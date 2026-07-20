import { G as number, H as boolean, K as object, Y as string } from "../_libs/@better-auth/core+[...].mjs";
import { n as db } from "./ssr.mjs";
import { c as createServerFn } from "./esm-B50dUWcE.mjs";
import { t as createServerRpc } from "./createServerRpc-BbGffMfs.mjs";
import { n as getUserSession, r as successResponse, t as errorResponse } from "./auth.server-CIzGGSXg.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/medicines-CphEFBrl.js
var getMedicinesFn_createServerFn_handler = createServerRpc({
	id: "2f3b73addd7b3a4277ea105a58fa85658c4870efd306c67a485c7d4b498f18e8",
	name: "getMedicinesFn",
	filename: "src/api/medicines.ts"
}, (opts) => getMedicinesFn.__executeServer(opts));
var getMedicinesFn = createServerFn({ method: "GET" }).handler(getMedicinesFn_createServerFn_handler, async () => {
	try {
		return successResponse("Medicines fetched successfully", await db.medicine.findMany({ orderBy: { name: "asc" } }));
	} catch (error) {
		console.error(error);
		return errorResponse("Failed to fetch medicines", error.message);
	}
});
var getMedicineByIdFn_createServerFn_handler = createServerRpc({
	id: "65c5cf8336103188f70f758fef547d90a5940dc67d3e708bbb836a744ae43aa4",
	name: "getMedicineByIdFn",
	filename: "src/api/medicines.ts"
}, (opts) => getMedicineByIdFn.__executeServer(opts));
var getMedicineByIdFn = createServerFn({ method: "GET" }).validator(object({ id: string() })).handler(getMedicineByIdFn_createServerFn_handler, async ({ data }) => {
	try {
		const medicine = await db.medicine.findUnique({ where: { id: data.id } });
		if (!medicine) return errorResponse("Medicine not found", void 0, 404);
		return successResponse("Medicine fetched successfully", medicine);
	} catch (error) {
		console.error(error);
		return errorResponse("Failed to fetch medicine", error.message);
	}
});
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
var createMedicineFn_createServerFn_handler = createServerRpc({
	id: "b2285bf707d43b52e38f804495c12b475c29c9e72468af5fd2b1f1409ea8cec1",
	name: "createMedicineFn",
	filename: "src/api/medicines.ts"
}, (opts) => createMedicineFn.__executeServer(opts));
var createMedicineFn = createServerFn({ method: "POST" }).validator(MedicineSchema).handler(createMedicineFn_createServerFn_handler, async ({ data }) => {
	try {
		const session = await getUserSession();
		if (!session || session.role !== "ADMIN") return errorResponse("Forbidden", void 0, 403);
		return successResponse("Medicine created successfully", await db.medicine.create({ data }), 201);
	} catch (error) {
		console.error(error);
		return errorResponse("Failed to create medicine", error.message);
	}
});
var updateMedicineFn_createServerFn_handler = createServerRpc({
	id: "8510250d0169daf97baaafc39bd2900f0435eddb53bfd3e1d08728d71f7be5db",
	name: "updateMedicineFn",
	filename: "src/api/medicines.ts"
}, (opts) => updateMedicineFn.__executeServer(opts));
var updateMedicineFn = createServerFn({ method: "POST" }).validator(object({
	id: string(),
	data: MedicineSchema
})).handler(updateMedicineFn_createServerFn_handler, async ({ data }) => {
	try {
		const session = await getUserSession();
		if (!session || session.role !== "ADMIN") return errorResponse("Forbidden", void 0, 403);
		return successResponse("Medicine updated successfully", await db.medicine.update({
			where: { id: data.id },
			data: data.data
		}));
	} catch (error) {
		console.error(error);
		return errorResponse("Failed to update medicine", error.message);
	}
});
var deleteMedicineFn_createServerFn_handler = createServerRpc({
	id: "a0556ec3785d8273b5b1a36343f4dfdaad36851f54785d8b248489992994d896",
	name: "deleteMedicineFn",
	filename: "src/api/medicines.ts"
}, (opts) => deleteMedicineFn.__executeServer(opts));
var deleteMedicineFn = createServerFn({ method: "POST" }).validator(object({ id: string() })).handler(deleteMedicineFn_createServerFn_handler, async ({ data }) => {
	try {
		const session = await getUserSession();
		if (!session || session.role !== "ADMIN") return errorResponse("Forbidden", void 0, 403);
		await db.medicine.delete({ where: { id: data.id } });
		return successResponse("Medicine deleted successfully", { id: data.id });
	} catch (error) {
		console.error(error);
		return errorResponse("Failed to delete medicine", error.message);
	}
});
//#endregion
export { createMedicineFn_createServerFn_handler, deleteMedicineFn_createServerFn_handler, getMedicineByIdFn_createServerFn_handler, getMedicinesFn_createServerFn_handler, updateMedicineFn_createServerFn_handler };
