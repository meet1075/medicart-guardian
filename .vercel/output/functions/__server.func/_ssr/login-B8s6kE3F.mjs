import { _ as string, m as object } from "../_libs/zod.mjs";
import { m as createFileRoute, p as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/login-B8s6kE3F.js
var $$splitComponentImporter = () => import("./login-BA1OSXp7.mjs");
var searchSchema = object({ redirect: string().optional().catch("/") });
var Route = createFileRoute("/login")({
	validateSearch: searchSchema,
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
