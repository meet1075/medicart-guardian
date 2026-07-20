import { _ as string, c as boolean, m as object, p as number } from "../_libs/zod.mjs";
import { c as createServerFn } from "./esm-B50dUWcE.mjs";
import { t as createSsrRpc } from "./createSsrRpc-Dlr6sAwK.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/medicines-CBQcPI-m.js
var getMedicinesFn = createServerFn({ method: "GET" }).handler(createSsrRpc("2f3b73addd7b3a4277ea105a58fa85658c4870efd306c67a485c7d4b498f18e8"));
var getMedicineByIdFn = createServerFn({ method: "GET" }).validator(object({ id: string() })).handler(createSsrRpc("65c5cf8336103188f70f758fef547d90a5940dc67d3e708bbb836a744ae43aa4"));
var MedicineSchema = object({
	name: string().min(1, "Name is required"),
	salt: string(),
	brand: string(),
	mrp: number().min(0),
	packSize: string(),
	dosageForm: string(),
	prescriptionRequired: boolean().default(false),
	inStock: boolean().default(true)
});
var createMedicineFn = createServerFn({ method: "POST" }).validator(MedicineSchema).handler(createSsrRpc("b2285bf707d43b52e38f804495c12b475c29c9e72468af5fd2b1f1409ea8cec1"));
var updateMedicineFn = createServerFn({ method: "POST" }).validator(object({
	id: string(),
	data: MedicineSchema
})).handler(createSsrRpc("8510250d0169daf97baaafc39bd2900f0435eddb53bfd3e1d08728d71f7be5db"));
var deleteMedicineFn = createServerFn({ method: "POST" }).validator(object({ id: string() })).handler(createSsrRpc("a0556ec3785d8273b5b1a36343f4dfdaad36851f54785d8b248489992994d896"));
//#endregion
export { updateMedicineFn as a, getMedicinesFn as i, deleteMedicineFn as n, getMedicineByIdFn as r, createMedicineFn as t };
