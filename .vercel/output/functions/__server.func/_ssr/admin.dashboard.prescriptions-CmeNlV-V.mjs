import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { T as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { r as useStore } from "./store-DhPtNZlM.mjs";
import { f as Outlet, g as Link, l as useRouterState } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as useOrders } from "./use-orders-CxPkG3kV.mjs";
import { n as StatusPill } from "./admin.dashboard-BkfY7Kf9.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.dashboard.prescriptions-CmeNlV-V.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function PrescriptionsLayout() {
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	return pathname === "/admin/dashboard/prescriptions" || pathname === "/admin/dashboard/prescriptions/" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PrescriptionsListPage, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {});
}
function PrescriptionsListPage() {
	const { storeHydrated } = useStore();
	const { orders } = useOrders();
	const rxOrders = (0, import_react.useMemo)(() => {
		return orders.filter((o) => o.hasRx).sort((a, b) => {
			const pa = a.prescriptionStatus === "pending" ? 0 : 1;
			const pb = b.prescriptionStatus === "pending" ? 0 : 1;
			if (pa !== pb) return pa - pb;
			return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
		});
	}, [orders]);
	if (!storeHydrated) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4 animate-pulse",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-8 w-48 rounded bg-border" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mt-5 h-64 rounded-xl bg-surface border border-border" })]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "text-2xl font-bold",
			children: "Prescriptions"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 text-sm text-muted-foreground",
			children: "Pending reviews shown first, most recent next."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-5 overflow-x-auto rounded-xl border border-border bg-surface",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
				className: "w-full text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
					className: "bg-surface-muted text-left text-xs uppercase tracking-wider text-muted-foreground",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-3",
							children: "Order #"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-3",
							children: "Customer"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-3",
							children: "Uploaded"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-3",
							children: "Files"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-3",
							children: "Status"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-3",
							children: "Reviewed by"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { className: "px-4 py-3" })
					] })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", {
					className: "divide-y divide-border",
					children: [rxOrders.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						colSpan: 7,
						className: "p-10 text-center text-sm text-muted-foreground",
						children: "No prescriptions yet. Place a test Rx order to see it appear live."
					}) }), rxOrders.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "hover:bg-surface-muted/60",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3",
								children: o.id
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
								className: "px-4 py-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "font-medium",
									children: o.user?.name || o.address?.fullName || "Guest"
								}), o.user?.email && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs text-muted-foreground",
									children: o.user.email
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3",
								children: new Date(o.createdAt).toLocaleDateString("en-IN", {
									month: "short",
									day: "numeric",
									hour: "2-digit",
									minute: "2-digit"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3",
								children: o.prescriptionFiles.length
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusPill, {
									status: o.status,
									rx: o.prescriptionStatus
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3 text-xs text-muted-foreground",
								children: o.reviewedBy ?? "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3 text-right",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/admin/dashboard/prescriptions/$id",
									params: { id: o.id },
									className: "rounded-md border border-primary px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary hover:text-primary-foreground",
									children: "Review"
								})
							})
						]
					}, o.id))]
				})]
			})
		})
	] });
}
//#endregion
export { PrescriptionsLayout as component };
