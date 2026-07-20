import { _ as string, m as object } from "../_libs/zod.mjs";
import { m as createFileRoute, p as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/register-DHeih8HC.js
var $$splitComponentImporter = () => import("./register-Dp0-ffJT.mjs");
var searchSchema = object({ redirect: string().optional().catch("/") });
var Route = createFileRoute("/register")({
	validateSearch: searchSchema,
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
