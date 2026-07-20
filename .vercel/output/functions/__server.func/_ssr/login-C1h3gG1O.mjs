import { K as object, Y as string } from "../_libs/@better-auth/core+[...].mjs";
import { m as createFileRoute, p as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/login-C1h3gG1O.js
var $$splitComponentImporter = () => import("./login-fJJbgfBC.mjs");
var searchSchema = object({ redirect: string().optional().catch("/") });
var Route = createFileRoute("/login")({
	validateSearch: searchSchema,
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
