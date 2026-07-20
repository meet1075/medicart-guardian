import { t as auth } from "./ssr.mjs";
import { t as getRequest } from "./request-response-BEPp1C2k.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auth.server-CIzGGSXg.js
function successResponse(message, data, code = 200) {
	return {
		status: "success",
		code,
		message,
		data
	};
}
function errorResponse(message, error, code = 400) {
	return {
		status: "error",
		code,
		message,
		error
	};
}
async function getUserSession() {
	const request = getRequest();
	if (!request) return null;
	try {
		const sessionData = await auth.api.getSession({ headers: request.headers });
		if (!sessionData?.user) return null;
		return sessionData.user;
	} catch (error) {
		console.error("Error getting user session via Better Auth:", error);
		return null;
	}
}
//#endregion
export { getUserSession as n, successResponse as r, errorResponse as t };
