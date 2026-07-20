import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { T as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { _ as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as useOrders } from "./use-orders-CxPkG3kV.mjs";
import { n as StatusPill } from "./admin.dashboard-BoO8UViR.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.dashboard.orders.index-bp3Qah_6.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function OrdersPage() {
	const { orders } = useOrders();
	const navigate = useNavigate();
	const [filter, setFilter] = (0, import_react.useState)("all");
	const [dateFilter, setDateFilter] = (0, import_react.useState)("all");
	const [q, setQ] = (0, import_react.useState)("");
	const [medicineQ, setMedicineQ] = (0, import_react.useState)("");
	const filtered = (0, import_react.useMemo)(() => {
		return orders.filter((o) => {
			if (filter === "rx" && !o.hasRx) return false;
			if (filter === "otc" && o.hasRx) return false;
			if (filter === "pending" && !(o.hasRx && o.prescriptionStatus === "pending")) return false;
			if (filter === "verified" && o.prescriptionStatus !== "verified") return false;
			if (filter === "rejected" && o.prescriptionStatus !== "rejected") return false;
			if (dateFilter !== "all") {
				const d = new Date(o.createdAt).getTime();
				const now = Date.now();
				const day = 1440 * 60 * 1e3;
				if (dateFilter === "today" && now - d > day) return false;
				if (dateFilter === "week" && now - d > 7 * day) return false;
				if (dateFilter === "month" && now - d > 30 * day) return false;
			}
			if (medicineQ) {
				const mq = medicineQ.toLowerCase();
				if (!o.items.some((i) => i.name.toLowerCase().includes(mq) || i.salt && i.salt.toLowerCase().includes(mq))) return false;
			}
			if (q) {
				const nq = q.toLowerCase();
				const customerName = o.address.fullName.toLowerCase();
				const userEmail = (o.user?.email ?? "").toLowerCase();
				const userName = (o.user?.name ?? "").toLowerCase();
				if (!o.id.toLowerCase().includes(nq) && !customerName.includes(nq) && !userEmail.includes(nq) && !userName.includes(nq)) return false;
			}
			return true;
		});
	}, [
		orders,
		filter,
		q,
		dateFilter,
		medicineQ
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-full flex-col pb-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "shrink-0 pb-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-2xl font-bold",
					children: "Orders"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-1 text-sm text-muted-foreground",
					children: [filtered.length, " orders"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-wrap gap-2",
						children: [
							["all", "All"],
							["rx", "Rx orders"],
							["otc", "OTC orders"],
							["pending", "Pending verification"],
							["verified", "Verified"],
							["rejected", "Rejected"]
						].map(([k, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setFilter(k),
							className: `rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${filter === k ? "bg-primary text-primary-foreground" : "border border-border bg-surface text-foreground/70 hover:bg-surface-muted"}`,
							children: label
						}, k))
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex gap-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							value: dateFilter,
							onChange: (e) => setDateFilter(e.target.value),
							className: "rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary transition-colors",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "all",
									children: "All Time"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "today",
									children: "Today"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "week",
									children: "Last 7 Days"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "month",
									children: "This Month"
								})
							]
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-3 flex flex-col gap-3 sm:flex-row",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: q,
						onChange: (e) => setQ(e.target.value),
						placeholder: "Search customer or order #",
						className: "flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary transition-colors"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: medicineQ,
						onChange: (e) => setMedicineQ(e.target.value),
						placeholder: "Filter by medicine name...",
						className: "flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary transition-colors"
					})]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex-1 min-h-0 rounded-xl border border-border bg-surface overflow-y-auto",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
				className: "w-full text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
					className: "sticky top-0 bg-surface-muted text-left text-xs uppercase tracking-wider text-muted-foreground z-10 border-b border-border shadow-sm",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-3",
							children: "Order #"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-3",
							children: "Placed"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-3",
							children: "Customer"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-3",
							children: "Phone"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-3",
							children: "Items"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-3",
							children: "Type"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-3",
							children: "Total"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-3",
							children: "Delivery"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-3",
							children: "Rx status"
						})
					] })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", {
					className: "divide-y divide-border",
					children: [filtered.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						colSpan: 9,
						className: "p-10 text-center text-sm text-muted-foreground",
						children: "No orders match this filter."
					}) }), filtered.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						onClick: () => navigate({
							to: "/admin/dashboard/orders/$id",
							params: { id: o.id }
						}),
						className: "cursor-pointer transition-colors hover:bg-surface-muted/60",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3 font-mono text-xs font-bold text-primary hover:underline",
								children: o.id
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3 text-muted-foreground",
								children: new Date(o.createdAt).toLocaleString()
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
								className: "px-4 py-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "font-semibold",
									children: o.user?.name || o.address.fullName
								}), o.user?.email && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs text-muted-foreground",
									children: o.user.email
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3 text-muted-foreground",
								children: o.address.phone
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3",
								children: o.items.length
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3",
								children: o.hasRx ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "rounded-full bg-warning/15 px-2 py-0.5 text-[11px] font-semibold text-warning-foreground",
									children: "Rx"
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "rounded-full bg-success/15 px-2 py-0.5 text-[11px] font-semibold text-success",
									children: "OTC"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
								className: "px-4 py-3 font-semibold",
								children: ["₹", o.total.toFixed(2)]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3 text-xs uppercase text-muted-foreground",
								children: o.status.replace("_", " ")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3",
								children: o.hasRx ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusPill, {
									status: o.status,
									rx: o.prescriptionStatus
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs text-muted-foreground",
									children: "—"
								})
							})
						]
					}, o.id))]
				})]
			})
		})]
	});
}
//#endregion
export { OrdersPage as component };
