import { T as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { r as useStore } from "./store-DhPtNZlM.mjs";
import { _ as useNavigate, g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { P as Info, V as FileText, h as ShieldCheck } from "../_libs/lucide-react.mjs";
import { t as PublicLayout } from "./PublicLayout-B2Lc81uq.mjs";
import { t as MedicineVisual } from "./MedicineVisual-DlBRNEbM.mjs";
import { t as Route } from "./product._id-Ds2q8l7R.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/product._id-BMcXXvnt.js
var import_jsx_runtime = require_jsx_runtime();
function ProductPage() {
	const { medicine } = Route.useLoaderData();
	const { addToCart } = useStore();
	const navigate = useNavigate();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PublicLayout, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("script", {
		type: "application/ld+json",
		dangerouslySetInnerHTML: { __html: JSON.stringify({
			"@context": "https://schema.org/",
			"@type": "Product",
			name: medicine.name,
			description: `${medicine.name} (${medicine.salt})`,
			sku: medicine.id,
			offers: {
				"@type": "Offer",
				url: `https://obatmedicare.com/product/${medicine.id}`,
				priceCurrency: "INR",
				price: medicine.mrp,
				availability: medicine.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
				itemCondition: "https://schema.org/NewCondition"
			}
		}) }
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "container-page py-8",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "text-xs text-muted-foreground",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/shop",
					className: "hover:text-primary",
					children: "Shop"
				}),
				" ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "mx-1",
					children: "/"
				}),
				" ",
				medicine.name
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-6 grid gap-8 lg:grid-cols-[1fr_1.2fr]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-border bg-surface p-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mx-auto max-w-md",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MedicineVisual, {
						medicine,
						size: "lg"
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 flex flex-wrap gap-2",
					children: [medicine.prescriptionRequired ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "inline-flex items-center gap-1 rounded-full bg-warning/15 px-2.5 py-1 text-xs font-semibold text-warning-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { size: 12 }), " Prescription Required"]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "inline-flex items-center gap-1 rounded-full bg-success/15 px-2.5 py-1 text-xs font-semibold text-success",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { size: 12 }), " OTC — No prescription"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary",
						children: "Verified pharmacy"
					})]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-2xl font-bold text-foreground md:text-3xl",
					children: medicine.name
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-1 text-sm text-muted-foreground",
					children: [
						medicine.salt,
						" · ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-medium",
							children: medicine.brand
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-5 flex items-baseline gap-3",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-3xl font-bold text-foreground",
						children: ["₹", medicine.mrp]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-1 text-xs text-muted-foreground",
					children: ["MRP incl. of all taxes · ", medicine.packSize]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						disabled: !medicine.inStock,
						onClick: () => {
							if (!medicine.inStock) return;
							addToCart(medicine.id);
							toast.success(`${medicine.name} added to cart`);
						},
						className: `flex-1 rounded-md border px-6 py-3 text-sm font-semibold transition-colors ${medicine.inStock ? "border-primary text-primary hover:bg-primary hover:text-primary-foreground" : "border-border text-muted-foreground opacity-50 cursor-not-allowed"}`,
						children: medicine.inStock ? "Add to cart" : "Out of stock"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						disabled: !medicine.inStock,
						onClick: () => {
							if (!medicine.inStock) return;
							addToCart(medicine.id);
							navigate({ to: "/cart" });
						},
						className: `flex-1 rounded-md px-6 py-3 text-sm font-semibold transition-colors ${medicine.inStock ? "bg-primary text-primary-foreground hover:bg-primary/90" : "bg-surface-muted text-muted-foreground opacity-50 cursor-not-allowed"}`,
						children: medicine.inStock ? "Buy now" : "Unavailable"
					})]
				}),
				medicine.prescriptionRequired && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 flex items-start gap-3 rounded-lg border border-warning/30 bg-warning/10 p-3 text-xs text-warning-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, {
						size: 16,
						className: "mt-0.5 flex-none"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: "This medicine requires a valid doctor's prescription. You'll upload one at checkout and our pharmacist will verify it before dispatch." })]
				})
			] })]
		})]
	})] });
}
//#endregion
export { ProductPage as component };
