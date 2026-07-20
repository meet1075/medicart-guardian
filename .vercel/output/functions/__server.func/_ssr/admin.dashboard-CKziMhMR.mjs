import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { T as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { f as Outlet, g as Link, l as useRouterState } from "../_libs/@tanstack/react-router+[...].mjs";
import { G as CreditCard, J as CircleX, K as Clock, U as DollarSign, Y as CircleCheck, d as Smartphone, et as Banknote, p as ShoppingBag } from "../_libs/lucide-react.mjs";
import { t as AdminChrome } from "./admin-xr7dJP2t.mjs";
import { n as useOrders } from "./use-orders-CxPkG3kV.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.dashboard-CKziMhMR.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function DashboardLayout() {
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminChrome, {
		active: pathname.startsWith("/admin/dashboard/orders") ? "orders" : pathname.startsWith("/admin/dashboard/prescriptions") ? "prescriptions" : "overview",
		children: pathname === "/admin/dashboard" || pathname === "/admin/dashboard/" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Overview, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})
	});
}
function Overview() {
	const { orders } = useOrders();
	const stats = (0, import_react.useMemo)(() => {
		const today = /* @__PURE__ */ new Date();
		today.setHours(0, 0, 0, 0);
		const todayMs = today.getTime();
		const isToday = (n) => n >= todayMs;
		return {
			today: orders.filter((o) => isToday(new Date(o.createdAt).getTime())).length,
			pending: orders.filter((o) => o.hasRx && o.prescriptionStatus === "pending").length,
			approved: orders.filter((o) => o.prescriptionStatus === "verified" && o.reviewedAt && isToday(new Date(o.reviewedAt).getTime())).length,
			rejected: orders.filter((o) => o.prescriptionStatus === "rejected" && o.reviewedAt && isToday(new Date(o.reviewedAt).getTime())).length
		};
	}, [orders]);
	const revenueStats = (0, import_react.useMemo)(() => {
		let total = 0;
		let cod = 0;
		let upi = 0;
		let card = 0;
		orders.forEach((o) => {
			if (o.prescriptionStatus !== "rejected" && o.status !== "rejected") {
				total += o.total;
				if (o.paymentMethod === "cod") cod += o.total;
				else if (o.paymentMethod === "upi") upi += o.total;
				else if (o.paymentMethod === "card") card += o.total;
			}
		});
		return {
			total,
			cod,
			upi,
			card
		};
	}, [orders]);
	const recent = orders.slice(0, 5);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "sticky top-0 z-10 bg-surface-muted pb-4 pt-2 -mt-2",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-2xl font-bold",
				children: "Overview"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: "Snapshot of today's orders and prescription workload."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Orders today",
						value: stats.today,
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingBag, { size: 18 })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Pending Rx reviews",
						value: stats.pending,
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { size: 18 }),
						tone: "warning"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Approved today",
						value: stats.approved,
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { size: 18 }),
						tone: "success"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Rejected today",
						value: stats.rejected,
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, { size: 18 }),
						tone: "destructive"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-lg font-semibold",
					children: "Revenue Insights (All-Time)"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
							label: "Total Revenue",
							value: `₹${revenueStats.total.toFixed(2)}`,
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DollarSign, { size: 18 }),
							tone: "success"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
							label: "Cash (COD)",
							value: `₹${revenueStats.cod.toFixed(2)}`,
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Banknote, { size: 18 })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
							label: "UPI",
							value: `₹${revenueStats.upi.toFixed(2)}`,
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Smartphone, { size: 18 })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
							label: "Card / Netbanking",
							value: `₹${revenueStats.card.toFixed(2)}`,
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CreditCard, { size: 18 })
						})
					]
				})]
			})
		]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mt-8",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-lg font-semibold",
				children: "Recent orders"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/admin/dashboard/orders",
				className: "text-sm font-semibold text-primary hover:underline",
				children: "View all"
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-4 overflow-hidden rounded-xl border border-border bg-surface",
			children: recent.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "p-8 text-center text-sm text-muted-foreground",
				children: "No orders yet. Place a test order from the storefront to see it appear here live."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
				className: "w-full text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
					className: "bg-surface-muted text-left text-xs uppercase tracking-wider text-muted-foreground",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-3",
							children: "Order"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-3",
							children: "Customer"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-3",
							children: "Placed"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-3",
							children: "Total"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-3",
							children: "Status"
						})
					] })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
					className: "divide-y divide-border",
					children: recent.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "cursor-pointer hover:bg-surface-muted/60 transition-colors",
						onClick: () => {
							window.location.href = `/admin/dashboard/orders/${o.id}`;
						},
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3 font-mono text-xs font-bold text-primary hover:underline",
								children: o.id
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3",
								children: o.address.fullName
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3 text-muted-foreground",
								children: new Date(o.createdAt).toLocaleString()
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
								className: "px-4 py-3 font-semibold",
								children: ["₹", o.total.toFixed(2)]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusPill, {
									status: o.status,
									rx: o.prescriptionStatus
								})
							})
						]
					}, o.id))
				})]
			})
		})]
	})] });
}
function StatCard({ label, value, icon, tone }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-xl border border-border bg-surface p-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: `inline-flex h-9 w-9 items-center justify-center rounded-lg ${tone === "warning" ? "bg-warning/15 text-warning-foreground" : tone === "success" ? "bg-success/15 text-success" : tone === "destructive" ? "bg-destructive/15 text-destructive" : "bg-primary-soft text-primary"}`,
				children: icon
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3 text-3xl font-bold",
				children: value
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
				children: label
			})
		]
	});
}
function StatusPill({ status, rx }) {
	if (rx === "pending") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "rounded-full bg-warning/15 px-2 py-0.5 text-[11px] font-semibold text-warning-foreground",
		children: "Pending review"
	});
	if (rx === "rejected") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "rounded-full bg-destructive/15 px-2 py-0.5 text-[11px] font-semibold text-destructive",
		children: "Rejected"
	});
	if (rx === "verified") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "rounded-full bg-success/15 px-2 py-0.5 text-[11px] font-semibold text-success",
		children: "Verified"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary",
		children: status.replace("_", " ")
	});
}
//#endregion
export { StatusPill, DashboardLayout as component };
