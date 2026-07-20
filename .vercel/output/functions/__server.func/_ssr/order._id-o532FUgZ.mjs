import { T as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { C as Package, F as House, K as Clock, Y as CircleCheck, a as Truck, h as ShieldCheck, o as TriangleAlert } from "../_libs/lucide-react.mjs";
import { t as PublicLayout } from "./PublicLayout-B2Lc81uq.mjs";
import { t as useOrder } from "./use-orders-CxPkG3kV.mjs";
import { t as Route } from "./order._id-BW39OPMR.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/order._id-o532FUgZ.js
var import_jsx_runtime = require_jsx_runtime();
function OrderPage() {
	const { id } = Route.useParams();
	const { data: order, isLoading } = useOrder(id);
	if (isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PublicLayout, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "container-page py-16 text-center",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mx-auto h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-4 text-sm text-muted-foreground",
			children: "Loading order details..."
		})]
	}) });
	if (!order) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PublicLayout, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "container-page py-16 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-2xl font-bold",
				children: "Order not found"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-2 text-sm text-muted-foreground",
				children: [
					"We couldn't find order ",
					id,
					". It may have been placed in a different browser."
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/",
				className: "mt-6 inline-flex items-center rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground",
				children: "Back to home"
			})
		]
	}) });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PublicLayout, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "container-page py-8",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfirmationBanner, { order }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-8 grid gap-8 lg:grid-cols-[1.4fr_1fr]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Timeline, { order }),
					order.prescriptionStatus === "rejected" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "rounded-xl border border-destructive/40 bg-destructive/10 p-5",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, {
								size: 20,
								className: "mt-0.5 text-destructive"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "font-semibold text-foreground",
									children: "Prescription needs attention"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-sm text-foreground/80",
									children: order.rejectReason || "Our pharmacist couldn't verify your prescription. Please re-upload a clearer image or contact support."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-2 text-xs text-muted-foreground",
									children: [
										"To re-upload, please contact support with your order number (",
										order.id,
										")."
									]
								})
							] })]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "rounded-xl border border-border bg-surface p-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
							className: "text-sm font-semibold uppercase tracking-wider text-muted-foreground",
							children: [
								"Items (",
								order.items.length,
								")"
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-3 divide-y divide-border",
							children: order.items.map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between py-3 text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "font-semibold",
									children: i.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-xs text-muted-foreground",
									children: [
										i.salt,
										" · ",
										i.dosageForm,
										" · Qty ",
										i.qty
									]
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "font-semibold",
									children: ["₹", (i.price * i.qty).toFixed(2)]
								})]
							}, i.medicineId))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "rounded-xl border border-border bg-surface p-5 text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-sm font-semibold uppercase tracking-wider text-muted-foreground",
								children: "Delivery"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-2 font-semibold",
								children: order.address.fullName
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-muted-foreground",
								children: [
									order.address.line1,
									order.address.line2 ? `, ${order.address.line2}` : "",
									", ",
									order.address.city,
									", ",
									order.address.state,
									" — ",
									order.address.pincode
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs text-muted-foreground",
								children: order.address.phone
							})
						]
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: "h-fit space-y-4 rounded-xl border border-border bg-surface p-5 text-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
						children: "Order number"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-1 font-mono text-base font-bold",
						children: order.id
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
						children: "Placed"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-1",
						children: new Date(order.createdAt).toLocaleString()
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "border-t border-border pt-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
								label: "Subtotal",
								value: `₹${order.subtotal.toFixed(2)}`
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
								label: "Delivery",
								value: order.delivery === 0 ? "FREE" : `₹${order.delivery}`
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "my-2 border-t border-border" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
								label: "Total",
								value: `₹${order.total.toFixed(2)}`,
								bold: true
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-2 text-xs uppercase text-muted-foreground",
								children: ["Paid via ", order.paymentMethod === "cod" ? "Cash on Delivery" : order.paymentMethod.toUpperCase()]
							})
						]
					})
				]
			})]
		})]
	}) });
}
function ConfirmationBanner({ order }) {
	const isRxPending = order.hasRx && order.prescriptionStatus === "pending";
	const isRejected = order.prescriptionStatus === "rejected";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: `rounded-2xl border p-6 ${isRejected ? "border-destructive/40 bg-destructive/10 text-destructive" : "border-success/40 bg-success/10 text-success"}`,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-3",
			children: [isRejected ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { size: 22 }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { size: 22 }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-lg font-bold text-foreground",
				children: isRejected ? "Action needed on your order" : isRxPending ? "Order placed — awaiting prescription verification" : "Order placed — processing"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-foreground/80",
				children: isRejected ? "Please review the note below and re-upload your prescription." : isRxPending ? "Our licensed pharmacist is reviewing your prescription. You'll be notified once it's verified, and your order will then be processed for shipping." : "Your order is confirmed and being processed for shipping."
			})] })]
		})
	});
}
var STEP_LABEL = {
	placed: "Placed",
	under_review: "Prescription Under Review",
	verified: "Prescription Verified",
	action_needed: "Action Needed",
	processing: "Processing",
	shipped: "Shipped",
	delivered: "Delivered"
};
function Timeline({ order }) {
	const rxSteps = order.hasRx ? order.prescriptionStatus === "rejected" ? [
		"placed",
		"under_review",
		"action_needed"
	] : [
		"placed",
		"under_review",
		"verified",
		"processing",
		"shipped",
		"delivered"
	] : [
		"placed",
		"processing",
		"shipped",
		"delivered"
	];
	const currentIdx = rxSteps.indexOf(order.status);
	const rank = currentIdx === -1 ? 0 : currentIdx;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "rounded-xl border border-border bg-surface p-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-sm font-semibold uppercase tracking-wider text-muted-foreground",
				children: "Order status"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
				className: "mt-4 space-y-3",
				children: rxSteps.map((s, i) => {
					const done = i < rank || i === rank && s !== "action_needed";
					const current = i === rank;
					const isAction = s === "action_needed";
					const Icon = iconFor(s);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: `flex h-8 w-8 items-center justify-center rounded-full border ${isAction && current ? "border-destructive bg-destructive text-destructive-foreground" : done ? "border-primary bg-primary text-primary-foreground" : "border-border bg-surface-muted text-muted-foreground"}`,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { size: 14 })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: `text-sm font-semibold ${current ? "text-foreground" : done ? "text-foreground" : "text-muted-foreground"}`,
							children: STEP_LABEL[s]
						}), current && order.reviewedAt && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-xs text-muted-foreground",
							children: ["Updated ", new Date(order.reviewedAt).toLocaleString()]
						})] })]
					}, s);
				})
			}),
			order.isShipmentCreated && order.shipmentStatus && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 border-t border-border pt-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "text-xs font-semibold uppercase tracking-wider text-primary mb-2",
					children: "Live Tracking"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-lg bg-primary/5 p-4 border border-primary/10",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "font-semibold text-sm",
							children: ["Status: ", order.shipmentStatus]
						}),
						order.awbCode && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-2 text-xs text-muted-foreground space-y-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: ["Courier: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-medium text-foreground",
								children: order.courierName
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: ["AWB: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-medium text-foreground",
								children: order.awbCode
							})] })]
						}),
						order.pickupStatus && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-1 text-xs text-muted-foreground",
							children: ["Pickup: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-medium text-foreground",
								children: order.pickupStatus
							})]
						})
					]
				})]
			})
		]
	});
}
function iconFor(s) {
	switch (s) {
		case "placed": return CircleCheck;
		case "under_review": return Clock;
		case "verified": return ShieldCheck;
		case "action_needed": return TriangleAlert;
		case "processing": return Package;
		case "shipped": return Truck;
		case "delivered": return House;
	}
}
function Row({ label, value, bold }) {
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
export { OrderPage as component };
