import { T as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { r as useStore } from "./store-DhPtNZlM.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { V as FileText, h as ShieldCheck } from "../_libs/lucide-react.mjs";
import { t as MedicineVisual } from "./MedicineVisual-DlBRNEbM.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/MedicineCard-DKgzk6Vx.js
var import_jsx_runtime = require_jsx_runtime();
function MedicineCard({ medicine }) {
	const { addToCart } = useStore();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "group flex flex-col rounded-xl border border-border bg-card p-3 transition-all hover:border-primary/40 hover:shadow-md",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/product/$id",
				params: { id: medicine.id },
				className: "block",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MedicineVisual, { medicine })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 flex-1",
				children: [medicine.prescriptionRequired ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "inline-flex items-center gap-1 rounded-full bg-warning/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-warning-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { size: 11 }), " Rx Required"]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "inline-flex items-center gap-1 rounded-full bg-success/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-success",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { size: 11 }), " OTC"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/product/$id",
					params: { id: medicine.id },
					className: "mt-2 block",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "line-clamp-2 text-sm font-semibold text-foreground group-hover:text-primary",
							children: medicine.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-0.5 line-clamp-1 text-xs text-muted-foreground",
							children: medicine.salt
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-0.5 text-xs text-muted-foreground",
							children: medicine.packSize
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 flex items-end justify-between gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-baseline gap-1.5",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-base font-bold text-foreground",
						children: ["₹", medicine.mrp]
					})
				}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					disabled: !medicine.inStock,
					onClick: () => {
						if (!medicine.inStock) return;
						addToCart(medicine.id);
						toast.success(`${medicine.name} added to cart`);
					},
					className: `rounded-md border px-3 py-1.5 text-xs font-semibold transition-colors ${medicine.inStock ? "border-primary text-primary hover:bg-primary hover:text-primary-foreground" : "border-border text-muted-foreground opacity-50 cursor-not-allowed"}`,
					children: medicine.inStock ? "Add" : "Out of stock"
				})]
			})
		]
	});
}
//#endregion
export { MedicineCard as t };
