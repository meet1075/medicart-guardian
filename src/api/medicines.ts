import { createServerFn } from "@tanstack/react-start";
import { db } from "@/lib/db";
import { successResponse, errorResponse, type ApiResponse } from "@/lib/api";
import { getUserSession } from "@/api/auth.server";
import { z } from "zod";

export const getMedicinesFn = createServerFn({ method: "GET" })
  .handler(async (): Promise<ApiResponse> => {
    try {
      const medicines = await db.medicine.findMany({
        orderBy: { name: "asc" },
      });
      return successResponse("Medicines fetched successfully", medicines);
    } catch (error) {
      console.error(error);
      return errorResponse("Failed to fetch medicines", (error as Error).message);
    }
  });

export const getMedicineByIdFn = createServerFn({ method: "GET" })
  .validator(z.object({ id: z.string() }))
  .handler(async ({ data }): Promise<ApiResponse> => {
    try {
      const medicine = await db.medicine.findUnique({
        where: { id: data.id },
      });
      if (!medicine) return errorResponse("Medicine not found", undefined, 404);
      return successResponse("Medicine fetched successfully", medicine);
    } catch (error) {
      console.error(error);
      return errorResponse("Failed to fetch medicine", (error as Error).message);
    }
  });

const MedicineSchema = z.object({
  name: z.string().min(1, "Name is required"),
  salt: z.string(),
  brand: z.string(),
  mrp: z.number().min(0),
  packSize: z.string(),
  dosageForm: z.string(),
  prescriptionRequired: z.boolean().default(true),
  inStock: z.boolean().default(true),
  imageUrl: z.string().nullable().optional(),
});

export const createMedicineFn = createServerFn({ method: "POST" })
  .validator(MedicineSchema)
  .handler(async ({ data }): Promise<ApiResponse> => {
    try {
      const session = await getUserSession();
      if (!session || session.role !== "ADMIN") return errorResponse("Forbidden", undefined, 403);

      const medicine = await db.medicine.create({
        data,
      });
      return successResponse("Medicine created successfully", medicine, 201);
    } catch (error) {
      console.error(error);
      return errorResponse("Failed to create medicine", (error as Error).message);
    }
  });

export const updateMedicineFn = createServerFn({ method: "POST" })
  .validator(z.object({ id: z.string(), data: MedicineSchema }))
  .handler(async ({ data }): Promise<ApiResponse> => {
    try {
      const session = await getUserSession();
      if (!session || session.role !== "ADMIN") return errorResponse("Forbidden", undefined, 403);

      const medicine = await db.medicine.update({
        where: { id: data.id },
        data: data.data,
      });
      return successResponse("Medicine updated successfully", medicine);
    } catch (error) {
      console.error(error);
      return errorResponse("Failed to update medicine", (error as Error).message);
    }
  });

export const deleteMedicineFn = createServerFn({ method: "POST" })
  .validator(z.object({ id: z.string() }))
  .handler(async ({ data }): Promise<ApiResponse> => {
    try {
      const session = await getUserSession();
      if (!session || session.role !== "ADMIN") return errorResponse("Forbidden", undefined, 403);

      await db.medicine.delete({
        where: { id: data.id },
      });
      return successResponse("Medicine deleted successfully", { id: data.id });
    } catch (error) {
      console.error(error);
      return errorResponse("Failed to delete medicine", (error as Error).message);
    }
  });

export const identifyMedicineImageFn = createServerFn({ method: "POST" })
  .validator(z.object({ dataUrl: z.string().min(20) }))
  .handler(async ({ data }): Promise<ApiResponse> => {
    try {
      const session = await getUserSession();
      if (!session || session.role !== "ADMIN") return errorResponse("Forbidden", undefined, 403);

      const key = process.env.LOVABLE_API_KEY;
      if (!key) {
        return errorResponse("Missing LOVABLE_API_KEY in environment", undefined, 500);
      }

      const body = {
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content:
              "You are a pharmacist's assistant analyzing a photo of a medicine box or bottle. Extract the medicine name, brand, and salt exactly as written. Respond with a single JSON object only, no prose, no code fences.",
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `Read this medicine packaging image and return JSON with this exact shape:
{
  "name": "Medicine Name (e.g. Dolo 650)",
  "brand": "Brand Name (e.g. Dolo)",
  "salt": "Active ingredients/Salt (e.g. Paracetamol 650mg)"
}
If a field cannot be read confidently, use null. Return JSON only.`,
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

      const json = (await res.json()) as any;
      const raw = json.choices?.[0]?.message?.content ?? "";

      const cleaned = raw.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/i, "").trim();

      let parsed = { name: null, brand: null, salt: null };
      try {
        parsed = JSON.parse(cleaned);
      } catch {
        const match = cleaned.match(/\{[\s\S]*\}/);
        if (match) {
          try {
            parsed = JSON.parse(match[0]);
          } catch {}
        }
      }

      return successResponse("Image analyzed successfully", parsed);
    } catch (error) {
      console.error(error);
      return errorResponse("Failed to analyze image", (error as Error).message);
    }
  });
