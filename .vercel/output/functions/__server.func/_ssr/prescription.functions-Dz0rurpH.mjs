import { _ as string, m as object } from "../_libs/zod.mjs";
import { c as createServerFn } from "./esm-B50dUWcE.mjs";
import { t as createServerRpc } from "./createServerRpc-BbGffMfs.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/prescription.functions-Dz0rurpH.js
var InputSchema = object({ dataUrl: string().min(20) });
/**
* Send a prescription image to a vision-capable LLM and extract structured info:
* doctor name, patient name, and a list of medicines with dosage. The result is a
* decision-support aid — always confirmed by a human pharmacist.
*/
var extractPrescription_createServerFn_handler = createServerRpc({
	id: "6fd842065327fb4267e80aadd4664a1b4b2dc0beda13e7d74e265684696bdc56",
	name: "extractPrescription",
	filename: "src/lib/prescription.functions.ts"
}, (opts) => extractPrescription.__executeServer(opts));
var extractPrescription = createServerFn({ method: "POST" }).inputValidator((input) => InputSchema.parse(input)).handler(extractPrescription_createServerFn_handler, async ({ data }) => {
	const key = process.env.LOVABLE_API_KEY;
	if (!key) throw new Error("Missing LOVABLE_API_KEY");
	const body = {
		model: "google/gemini-2.5-flash",
		messages: [{
			role: "system",
			content: "You are a pharmacist's assistant that reads handwritten and printed medical prescriptions. Extract information strictly from what is visible on the image. Never invent medicines. Respond with a single JSON object only, no prose, no code fences."
		}, {
			role: "user",
			content: [{
				type: "text",
				text: `Read this prescription image and return JSON with this exact shape:
{
  "doctorName": string | null,
  "patientName": string | null,
  "medicines": [{ "name": string, "dosage": string | null }]
}
If a field cannot be read confidently, use null. For medicines, include every drug name you can identify, even if handwritten. Include strength/dosage in "dosage" when visible (e.g. "500mg", "1-0-1 for 5 days"). Return JSON only.`
			}, {
				type: "image_url",
				image_url: { url: data.dataUrl }
			}]
		}]
	};
	const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"Lovable-API-Key": key
		},
		body: JSON.stringify(body)
	});
	if (!res.ok) {
		const text = await res.text().catch(() => "");
		throw new Error(`AI Gateway ${res.status}: ${text.slice(0, 200)}`);
	}
	const raw = (await res.json()).choices?.[0]?.message?.content ?? "";
	const cleaned = raw.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/i, "").trim();
	let parsed = {};
	try {
		parsed = JSON.parse(cleaned);
	} catch {
		const match = cleaned.match(/\{[\s\S]*\}/);
		if (match) try {
			parsed = JSON.parse(match[0]);
		} catch {}
	}
	return {
		doctorName: parsed.doctorName ?? void 0,
		patientName: parsed.patientName ?? void 0,
		medicines: Array.isArray(parsed.medicines) ? parsed.medicines.filter((m) => m && typeof m.name === "string" && m.name.trim()).map((m) => ({
			name: m.name.trim(),
			dosage: m.dosage ? String(m.dosage) : void 0
		})) : [],
		raw
	};
});
//#endregion
export { extractPrescription_createServerFn_handler };
