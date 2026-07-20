import { N as notFound, m as createFileRoute, p as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as getMedicineByIdFn } from "./medicines-CBQcPI-m.mjs";
import { t as getSeoMeta } from "./seo-BNprBz8W.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/product._id-Ds2q8l7R.js
var $$splitComponentImporter = () => import("./product._id-BMcXXvnt.mjs");
var Route = createFileRoute("/product/$id")({
	loader: async ({ params }) => {
		const res = await getMedicineByIdFn({ data: { id: params.id } });
		if (res.status === "error" || !res.data) throw notFound();
		return { medicine: res.data };
	},
	head: ({ loaderData }) => {
		if (!loaderData?.medicine) return { meta: [{ title: "Medicine — MediCart" }] };
		const seo = getSeoMeta({
			title: `${loaderData.medicine.name} — ${loaderData.medicine.salt} | MediCart`,
			description: `${loaderData.medicine.name} (${loaderData.medicine.salt}) - Buy online at MediCart.`,
			path: `/product/${loaderData.medicine.id}`,
			type: "product"
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
