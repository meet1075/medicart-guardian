import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const InputSchema = z.object({
  dataUrl: z.string().min(20),
});

/**
 * Send a prescription image to a vision-capable LLM and extract structured info:
 * doctor name, patient name, and a list of medicines with dosage. The result is a
 * decision-support aid — always confirmed by a human pharmacist.
 */
export const extractPrescription = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => InputSchema.parse(input))
  .handler(async ({ data }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) {
      throw new Error("Missing LOVABLE_API_KEY");
    }

    const body = {
      model: "google/gemini-2.5-flash",
      messages: [
        {
          role: "system",
          content:
            "You are a pharmacist's assistant that reads handwritten and printed medical prescriptions. Extract information strictly from what is visible on the image. Never invent medicines. Respond with a single JSON object only, no prose, no code fences.",
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Read this prescription image and return JSON with this exact shape:
{
  "doctorName": string | null,
  "patientName": string | null,
  "medicines": [{ "name": string, "dosage": string | null }]
}
If a field cannot be read confidently, use null. For medicines, include every drug name you can identify, even if handwritten. Include strength/dosage in "dosage" when visible (e.g. "500mg", "1-0-1 for 5 days"). Return JSON only.`,
            },
            { type: "image_url", image_url: { url: data.dataUrl } },
          ],
        },
      ],
    };

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Lovable-API-Key": key,
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`AI Gateway ${res.status}: ${text.slice(0, 200)}`);
    }

    const json = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const raw = json.choices?.[0]?.message?.content ?? "";

    // Strip potential code fences
    const cleaned = raw
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/```\s*$/i, "")
      .trim();

    let parsed: {
      doctorName?: string | null;
      patientName?: string | null;
      medicines?: { name: string; dosage?: string | null }[];
    } = {};
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      // Try to salvage a JSON object substring
      const match = cleaned.match(/\{[\s\S]*\}/);
      if (match) {
        try {
          parsed = JSON.parse(match[0]);
        } catch {
          /* ignore */
        }
      }
    }

    return {
      doctorName: parsed.doctorName ?? undefined,
      patientName: parsed.patientName ?? undefined,
      medicines: Array.isArray(parsed.medicines)
        ? parsed.medicines
            .filter((m) => m && typeof m.name === "string" && m.name.trim())
            .map((m) => ({
              name: m.name.trim(),
              dosage: m.dosage ? String(m.dosage) : undefined,
            }))
        : [],
      raw,
    };
  });
