import { i as renderErrorPage } from "./ssr.mjs";
import { n as createMiddleware, r as createStart, t as createCsrfMiddleware } from "./createStart-DwZhSttb.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/start-uIqSEUxY.js
var errorMiddleware = createMiddleware().server(async ({ next }) => {
	try {
		return await next();
	} catch (error) {
		if (error != null && typeof error === "object" && "statusCode" in error) throw error;
		console.error(error);
		return new Response(renderErrorPage(), {
			status: 500,
			headers: { "content-type": "text/html; charset=utf-8" }
		});
	}
});
var csrfMiddleware = createCsrfMiddleware({ filter: (ctx) => ctx.handlerType === "serverFn" });
var startInstance = createStart(() => ({
	functionMiddleware: [],
	requestMiddleware: [csrfMiddleware, errorMiddleware]
}));
//#endregion
export { startInstance };
