import { a as db } from "./ssr.mjs";
import { _ as string, m as object } from "../_libs/zod.mjs";
import { c as createServerFn } from "./esm-B50dUWcE.mjs";
import { t as createServerRpc } from "./createServerRpc-BbGffMfs.mjs";
import { n as getUserSession, r as successResponse, t as errorResponse } from "./auth.server-CIzGGSXg.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/users-CJeotTuJ.js
var getUsersFn_createServerFn_handler = createServerRpc({
	id: "f24f20ce9df5ac7d76933babae8293b89929eeff50c46da620e01993809575c6",
	name: "getUsersFn",
	filename: "src/api/users.ts"
}, (opts) => getUsersFn.__executeServer(opts));
var getUsersFn = createServerFn({ method: "GET" }).handler(getUsersFn_createServerFn_handler, async () => {
	try {
		const session = await getUserSession();
		if (!session || session.role !== "ADMIN") return errorResponse("Forbidden", void 0, 403);
		return successResponse("Users fetched successfully", await db.user.findMany({
			select: {
				id: true,
				name: true,
				email: true,
				role: true,
				createdAt: true
			},
			orderBy: { createdAt: "desc" }
		}));
	} catch (error) {
		console.error(error);
		return errorResponse("Failed to fetch users", error.message);
	}
});
var updateUserRoleFn_createServerFn_handler = createServerRpc({
	id: "966ba1498e4a33b60fc5134952749c3dfeb070d42121ad82f67bd5a05afafe99",
	name: "updateUserRoleFn",
	filename: "src/api/users.ts"
}, (opts) => updateUserRoleFn.__executeServer(opts));
var updateUserRoleFn = createServerFn({ method: "POST" }).validator(object({
	id: string(),
	role: string()
})).handler(updateUserRoleFn_createServerFn_handler, async ({ data }) => {
	try {
		const session = await getUserSession();
		if (!session || session.role !== "ADMIN") return errorResponse("Forbidden", void 0, 403);
		if (session.id === data.id && data.role !== "ADMIN") return errorResponse("Cannot revoke your own admin access", void 0, 400);
		return successResponse("User role updated successfully", await db.user.update({
			where: { id: data.id },
			data: { role: data.role },
			select: {
				id: true,
				name: true,
				email: true,
				role: true,
				createdAt: true
			}
		}));
	} catch (error) {
		console.error(error);
		return errorResponse("Failed to update user role", error.message);
	}
});
//#endregion
export { getUsersFn_createServerFn_handler, updateUserRoleFn_createServerFn_handler };
