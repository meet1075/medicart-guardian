import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { T as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { _ as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { D as MapPin } from "../_libs/lucide-react.mjs";
import { t as PublicLayout } from "./PublicLayout-B2Lc81uq.mjs";
import { n as useOrders } from "./use-orders-CxPkG3kV.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/track-UecVOZr7.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function TrackPage() {
	const { orders } = useOrders();
	const navigate = useNavigate();
	const [q, setQ] = (0, import_react.useState)("");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PublicLayout, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "container-page py-10",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-xl text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary-soft text-primary",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { size: 26 })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-4 text-2xl font-bold md:text-3xl",
					children: "Track your order"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Enter your order number to see live status."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: (e) => {
						e.preventDefault();
						if (q.trim()) navigate({
							to: "/order/$id",
							params: { id: q.trim() }
						});
					},
					className: "mt-6 flex items-center rounded-xl border border-border bg-surface focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: q,
						onChange: (e) => setQ(e.target.value),
						placeholder: "Order number (e.g. MC...)",
						className: "flex-1 bg-transparent px-4 py-3 text-sm outline-none"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "submit",
						className: "m-1 rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90",
						children: "Track"
					})]
				})
			]
		}), orders.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto mt-12 max-w-2xl",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-sm font-semibold uppercase tracking-wider text-muted-foreground",
				children: "Your recent orders"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3 space-y-2",
				children: orders.slice(0, 5).map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => navigate({
						to: "/order/$id",
						params: { id: o.id }
					}),
					className: "flex w-full items-center justify-between rounded-lg border border-border bg-surface p-4 text-left hover:border-primary",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-mono text-sm font-bold",
						children: o.id
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-xs text-muted-foreground",
						children: [
							new Date(o.createdAt).toLocaleString(),
							" · ",
							o.items.length,
							" items"
						]
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs font-semibold uppercase tracking-wider text-primary",
						children: o.status.replace("_", " ")
					})]
				}, o.id))
			})]
		})]
	}) });
}
//#endregion
export { TrackPage as component };
