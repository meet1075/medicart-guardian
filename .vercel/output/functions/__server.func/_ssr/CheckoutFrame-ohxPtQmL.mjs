import { T as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { r as useStore } from "./store-DhPtNZlM.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { D as MapPin, G as CreditCard, V as FileText, Z as Check } from "../_libs/lucide-react.mjs";
import { t as PublicLayout } from "./PublicLayout-BlOoVjOA.mjs";
import { t as useMedicines } from "./use-medicines-XsigtTxu.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/CheckoutFrame-ohxPtQmL.js
var import_jsx_runtime = require_jsx_runtime();
var STEPS = [
	{
		key: "prescription",
		label: "Prescription",
		icon: FileText
	},
	{
		key: "address",
		label: "Address",
		icon: MapPin
	},
	{
		key: "payment",
		label: "Payment",
		icon: CreditCard
	}
];
function CheckoutFrame({ current, children }) {
	const { cart, cartHasRx } = useStore();
	const activeIdx = STEPS.findIndex((s) => s.key === current);
	const { medicines } = useMedicines();
	const items = cart.map((c) => ({
		m: medicines.find((x) => x.id === c.medicineId),
		qty: c.qty
	})).filter((x) => x.m);
	const subtotal = items.reduce((s, i) => s + i.m.mrp * i.qty, 0);
	const delivery = subtotal > 499 ? 0 : items.length ? 39 : 0;
	const total = subtotal + delivery;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PublicLayout, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "container-page py-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-xs text-muted-foreground",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/cart",
						className: "hover:text-primary",
						children: "Cart"
					}),
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "mx-1",
						children: "/"
					}),
					" Checkout"
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-2 text-2xl font-bold md:text-3xl",
				children: "Checkout"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-6 flex items-center gap-2",
				children: STEPS.map((s, i) => {
					const skipRxStep = s.key === "prescription" && !cartHasRx;
					const done = i < activeIdx || skipRxStep;
					const active = i === activeIdx;
					const Icon = s.icon;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-1 items-center gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: `flex h-9 w-9 flex-none items-center justify-center rounded-full border text-xs font-bold ${active ? "border-primary bg-primary text-primary-foreground" : done ? "border-primary bg-primary-soft text-primary" : "border-border bg-surface text-muted-foreground"}`,
								children: done ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { size: 16 }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { size: 16 })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: `text-xs font-semibold ${active ? "text-foreground" : "text-muted-foreground"}`,
								children: [s.label, skipRxStep && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "ml-1 text-[10px]",
									children: "(skipped)"
								})]
							}),
							i < STEPS.length - 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mx-2 h-px flex-1 bg-border" })
						]
					}, s.key);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 grid gap-8 lg:grid-cols-[1.5fr_1fr]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
					className: "h-fit rounded-xl border border-border bg-surface p-5 lg:sticky lg:top-24",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-sm font-semibold uppercase tracking-wider text-muted-foreground",
							children: "Order summary"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-4 max-h-64 space-y-3 overflow-auto text-sm",
							children: items.map(({ m, qty }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "font-medium text-foreground",
									children: m.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-xs text-muted-foreground",
									children: [
										"Qty ",
										qty,
										" · ",
										m.packSize
									]
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "whitespace-nowrap font-semibold",
									children: ["₹", (m.mrp * qty).toFixed(2)]
								})]
							}, m.id))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 space-y-1.5 border-t border-border pt-4 text-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SumRow, {
									label: "Subtotal",
									value: `₹${subtotal.toFixed(2)}`
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SumRow, {
									label: "Delivery",
									value: delivery === 0 ? "FREE" : `₹${delivery}`
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "my-2 border-t border-border" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SumRow, {
									label: "Total",
									value: `₹${total.toFixed(2)}`,
									bold: true
								})
							]
						})
					]
				})]
			})
		]
	}) });
}
function SumRow({ label, value, bold }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `flex justify-between ${bold ? "text-base" : ""}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: bold ? "font-semibold" : "text-muted-foreground",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: bold ? "font-bold" : "font-medium",
			children: value
		})]
	});
}
//#endregion
export { CheckoutFrame as t };
