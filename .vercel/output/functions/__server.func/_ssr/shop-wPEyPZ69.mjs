import { K as object, Y as string } from "../_libs/@better-auth/core+[...].mjs";
import { m as createFileRoute, p as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as getSeoMeta } from "./seo-BNprBz8W.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/shop-wPEyPZ69.js
var $$splitComponentImporter = () => import("./shop-RnofGj2_.mjs");
var searchSchema = object({ q: string().optional() });
var Route = createFileRoute("/shop")({
	validateSearch: (s) => searchSchema.parse(s),
	head: () => {
		const seo = getSeoMeta({
			title: "Shop medicines — MediCart",
			description: "Browse prescription and OTC medicines, vitamins, skincare, baby care, and health devices — verified by our pharmacist.",
			path: "/shop"
		});
		return {
			meta: seo.meta,
			links: seo.links
		};
	},
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
