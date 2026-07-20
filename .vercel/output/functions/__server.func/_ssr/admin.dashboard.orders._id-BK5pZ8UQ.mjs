import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { T as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as useAuth } from "./use-auth-C8ldQVR_.mjs";
import { _ as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { C as Package, J as CircleX, V as FileText, Y as CircleCheck, o as TriangleAlert, rt as ArrowLeft, u as Sparkles } from "../_libs/lucide-react.mjs";
import { i as useQueryClient, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as useOrders } from "./use-orders-CxPkG3kV.mjs";
import { i as scheduleShipmentPickupFn, n as generateShipmentAwbFn, r as retryShipmentCreationFn, t as cancelShiprocketShipmentFn } from "./shiprocket.api-BDlLZW_n.mjs";
import { n as StatusPill } from "./admin.dashboard-BoO8UViR.mjs";
import { t as Route } from "./admin.dashboard.orders._id-UrwWyoAp.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.dashboard.orders._id-BK5pZ8UQ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function useShiprocket() {
	const queryClient = useQueryClient();
	const invalidateOrders = () => {
		queryClient.invalidateQueries({ queryKey: ["orders"] });
	};
	return {
		retryShipmentCreation: useMutation({
			mutationFn: async (orderId) => {
				const res = await retryShipmentCreationFn({ data: { orderId } });
				if (res.status === "error") throw new Error(res.message);
				return res.data;
			},
			onSuccess: () => invalidateOrders()
		}),
		generateAwb: useMutation({
			mutationFn: async ({ orderId, shipmentId }) => {
				const res = await generateShipmentAwbFn({ data: {
					orderId,
					shipmentId
				} });
				if (res.status === "error") throw new Error(res.message);
				return res.data;
			},
			onSuccess: () => invalidateOrders()
		}),
		schedulePickup: useMutation({
			mutationFn: async ({ orderId, shipmentId }) => {
				const res = await scheduleShipmentPickupFn({ data: {
					orderId,
					shipmentId
				} });
				if (res.status === "error") throw new Error(res.message);
				return res.data;
			},
			onSuccess: () => invalidateOrders()
		}),
		cancelShipment: useMutation({
			mutationFn: async ({ orderId, awbCode }) => {
				const res = await cancelShiprocketShipmentFn({ data: {
					orderId,
					awbCode
				} });
				if (res.status === "error") throw new Error(res.message);
				return res.data;
			},
			onSuccess: () => invalidateOrders()
		})
	};
}
function OrderDetailsPage() {
	const { id } = Route.useParams();
	const navigate = useNavigate();
	const { user } = useAuth();
	const { orders, updateOrderStatus, toggleItemVerification, isUpdating } = useOrders();
	const [rejectMode, setRejectMode] = (0, import_react.useState)(false);
	const [rejectReason, setRejectReason] = (0, import_react.useState)("");
	const order = orders.find((o) => o.id === id);
	if (!order) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex h-full items-center justify-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "text-center",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-muted-foreground mb-4",
				children: "Order not found or loading..."
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: () => navigate({ to: "/admin/dashboard/orders" }),
				className: "text-primary hover:underline font-semibold",
				children: "← Back to Orders"
			})]
		})
	});
	const allReviewed = order.itemVerifications.length > 0 && order.itemVerifications.every((v) => v.pharmacistApproved);
	async function approve() {
		await updateOrderStatus({
			orderId: order.id,
			status: "processing",
			prescriptionStatus: "verified",
			reviewer: user?.email ?? "pharmacist"
		});
		toast.success("Order approved and moved to processing");
	}
	async function reject() {
		if (!rejectReason.trim()) {
			toast.error("Please provide a reason so the customer knows what to fix");
			return;
		}
		await updateOrderStatus({
			orderId: order.id,
			status: "action_needed",
			prescriptionStatus: "rejected",
			reviewer: user?.email ?? "pharmacist",
			rejectReason: rejectReason.trim()
		});
		setRejectMode(false);
		toast.success("Order flagged as Action Needed and customer notified");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "max-w-6xl pb-10",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-6 flex items-center gap-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: () => navigate({ to: "/admin/dashboard/orders" }),
				className: "flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border bg-surface hover:bg-surface-muted transition-colors",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { size: 18 })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
				className: "text-2xl font-bold flex items-center gap-3",
				children: ["Order ", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "font-mono text-primary",
					children: ["#", order.id]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: ["Placed on ", new Date(order.createdAt).toLocaleString()]
			})] })]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-6 md:grid-cols-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "md:col-span-2 space-y-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-border bg-surface p-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-lg font-bold mb-4",
							children: "Order Items"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "divide-y divide-border border border-border rounded-lg overflow-hidden",
							children: order.items.map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between p-4 bg-background",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-start gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary-soft text-primary",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Package, { size: 16 })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "font-semibold text-sm",
											children: i.name
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-xs text-muted-foreground mt-0.5",
											children: i.salt || "—"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "mt-2 flex gap-2 items-center",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-xs font-semibold text-foreground/80",
												children: ["Qty: ", i.qty]
											}), i.prescriptionRequired && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "rounded-full bg-warning/15 px-2 py-0.5 text-[10px] font-bold text-warning-foreground uppercase tracking-wider",
												children: "Rx Req"
											})]
										})
									] })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "font-bold text-sm",
									children: ["₹", (i.price * i.qty).toFixed(2)]
								})]
							}, i.medicineId))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-6 flex justify-end",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "w-full max-w-xs space-y-3 text-sm",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between text-muted-foreground",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Subtotal" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["₹", order.subtotal.toFixed(2)] })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between text-muted-foreground",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Delivery" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["₹", order.delivery.toFixed(2)] })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between font-bold text-lg border-t border-border pt-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Total" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["₹", order.total.toFixed(2)] })]
									})
								]
							})
						})
					]
				}), order.hasRx && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-border bg-surface p-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-lg font-bold mb-4",
						children: "Uploaded Prescriptions"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-4",
						children: order.prescriptionFiles.map((f, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-lg border border-border bg-background p-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-sm font-semibold mb-3",
									children: [
										"File ",
										idx + 1,
										" — ",
										f.name
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "overflow-hidden rounded-md border border-border bg-surface-muted mb-4",
									children: f.dataUrl === "[file-too-large-for-storage]" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-col items-center justify-center gap-2 p-6 text-center text-sm text-muted-foreground",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, {
											size: 28,
											className: "text-muted-foreground/50"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "font-medium",
											children: "File preview unavailable"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "mt-0.5 text-xs",
											children: "This file was too large to cache locally."
										})] })]
									}) : f.mimeType.startsWith("image/") ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
										href: f.dataUrl,
										target: "_blank",
										rel: "noopener noreferrer",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
											src: f.dataUrl,
											alt: f.name,
											className: "max-h-[500px] w-full object-contain"
										})
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
										href: f.dataUrl,
										target: "_blank",
										rel: "noopener noreferrer",
										className: "flex items-center gap-2 p-4 text-sm text-primary",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { size: 18 }), " Open PDF"]
									})
								}),
								f.aiExtractionResult && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-md border border-border bg-surface-muted/50 p-4 text-sm",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-1.5 text-primary mb-3",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { size: 16 }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-bold tracking-wide",
												children: "AI Extraction Data"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "grid gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kv, {
												label: "Doctor",
												value: f.aiExtractionResult?.doctorName ?? "—"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kv, {
												label: "Patient",
												value: f.aiExtractionResult?.patientName ?? "—"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "mt-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2",
											children: "Medicines Detected"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
											className: "space-y-1",
											children: [f.aiExtractionResult?.medicines?.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
												className: "text-muted-foreground text-sm",
												children: "None detected"
											}), f.aiExtractionResult?.medicines?.map((m, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
												className: "text-sm",
												children: [
													"• ",
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "font-semibold",
														children: m.name
													}),
													m.dosage && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "text-muted-foreground",
														children: [" — ", m.dosage]
													})
												]
											}, i))]
										})
									]
								})
							]
						}, f.id))
					})]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-border bg-surface p-6",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4",
								children: "Customer Details"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-semibold text-base",
								children: order.address.fullName
							}),
							order.user && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-1 flex items-center gap-1.5 text-xs text-muted-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "rounded-full bg-primary/10 px-2 py-0.5 font-medium text-primary",
									children: order.user.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: order.user.email })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-sm text-muted-foreground mt-2 leading-relaxed",
								children: [
									order.address.line1,
									order.address.line2 ? `, ${order.address.line2}` : "",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
									order.address.city,
									", ",
									order.address.state,
									" — ",
									order.address.pincode
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-sm font-semibold mt-3 text-foreground/80",
								children: ["Phone: ", order.address.phone]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-border bg-surface p-6",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4",
								children: "Payment & Tracking"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mb-6",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs text-muted-foreground mb-1",
									children: "Payment Method"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "font-semibold uppercase",
									children: order.paymentMethod
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mb-6",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs text-muted-foreground mb-1",
									children: "Rx Status"
								}), order.hasRx ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusPill, {
									status: order.status,
									rx: order.prescriptionStatus
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-sm font-semibold text-success",
									children: "OTC - Not Required"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "border-t border-border pt-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xs text-muted-foreground mb-2",
										children: "Update Fulfillment Status"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
										value: order.status,
										onChange: (e) => updateOrderStatus({
											orderId: order.id,
											status: e.target.value
										}),
										disabled: isUpdating,
										className: "w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-semibold outline-none focus:border-primary disabled:opacity-50 transition-colors",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "placed",
												children: "Placed"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "processing",
												children: "Processing"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "shipped",
												children: "Shipped"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "delivered",
												children: "Delivered"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "action_needed",
												disabled: true,
												children: "Action Needed"
											})
										]
									}),
									isUpdating && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "animate-pulse text-xs text-primary mt-2",
										children: "Updating..."
									})
								]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShipmentManagementCard, { order }),
					order.hasRx && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-warning/30 bg-warning/5 p-6",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-sm font-bold uppercase tracking-wider text-warning-foreground mb-4",
								children: "Pharmacist Review"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "space-y-3 mb-6",
								children: order.itemVerifications.map((v) => {
									const item = order.items.find((i) => i.medicineId === v.medicineId);
									if (!item) return null;
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-lg border border-warning/20 bg-background p-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-start justify-between gap-3",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "font-semibold text-sm",
												children: item.name
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MatchPill, { status: v.aiStatus })]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
											className: "mt-3 flex cursor-pointer items-center gap-2 text-sm",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "checkbox",
												checked: v.pharmacistApproved,
												onChange: () => toggleItemVerification({
													id: v.id,
													approved: !v.pharmacistApproved
												}),
												className: "accent-warning",
												disabled: order.prescriptionStatus !== "pending" || isUpdating
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-medium",
												children: "Pharmacist verified"
											})]
										})]
									}, v.medicineId);
								})
							}),
							order.prescriptionStatus === "pending" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-3 border-t border-warning/20 pt-4",
								children: [rejectMode ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
										children: "Reason (shown to customer)"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
										value: rejectReason,
										onChange: (e) => setRejectReason(e.target.value),
										rows: 3,
										className: "mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary",
										placeholder: "e.g. The uploaded prescription doesn't clearly show Azithral 500.",
										maxLength: 400
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-3 flex flex-col gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: reject,
											className: "w-full rounded-md bg-destructive px-4 py-2 text-sm font-semibold text-destructive-foreground hover:bg-destructive/90",
											children: "Send rejection"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: () => setRejectMode(false),
											className: "w-full rounded-md border border-border px-4 py-2 text-sm font-semibold text-foreground/80 bg-background",
											children: "Cancel"
										})]
									})
								] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-col gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										disabled: !allReviewed,
										onClick: approve,
										className: "w-full inline-flex items-center justify-center gap-2 rounded-md bg-success px-4 py-2 text-sm font-semibold text-success-foreground disabled:cursor-not-allowed disabled:opacity-50 hover:bg-success/90",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { size: 16 }), " Approve Rx"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										onClick: () => setRejectMode(true),
										className: "w-full inline-flex items-center justify-center gap-2 rounded-md border border-destructive bg-background px-4 py-2 text-sm font-semibold text-destructive hover:bg-destructive hover:text-destructive-foreground",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, { size: 16 }), " Reject Rx"]
									})]
								}), !allReviewed && !rejectMode && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-start gap-2 text-xs text-muted-foreground mt-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, {
										size: 14,
										className: "mt-0.5 shrink-0"
									}), "Verify every requested medication to enable approval."]
								})]
							}),
							order.prescriptionStatus !== "pending" && order.reviewedBy && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-6 border-t border-warning/20 pt-4 text-xs text-muted-foreground",
								children: [
									"Reviewed by ",
									order.reviewedBy,
									order.reviewedAt && ` · ${new Date(order.reviewedAt).toLocaleString()}`,
									order.rejectReason && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-2 rounded-md bg-destructive/10 p-3 text-destructive",
										children: [
											"Reason sent to customer: “",
											order.rejectReason,
											"”"
										]
									})
								]
							})
						]
					})
				]
			})]
		})]
	});
}
function Kv({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex gap-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "min-w-16 text-muted-foreground",
			children: [label, ":"]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "font-medium",
			children: value
		})]
	});
}
function MatchPill({ status }) {
	if (status === "matched") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "whitespace-nowrap rounded-full bg-success/15 px-2 py-0.5 text-[11px] font-semibold text-success",
		children: "Matched"
	});
	if (status === "possible") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "whitespace-nowrap rounded-full bg-warning/15 px-2 py-0.5 text-[11px] font-semibold text-warning-foreground",
		children: "Possible match"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "whitespace-nowrap rounded-full bg-destructive/15 px-2 py-0.5 text-[11px] font-semibold text-destructive",
		children: "Not found"
	});
}
function ShipmentManagementCard({ order }) {
	const { retryShipmentCreation, generateAwb, schedulePickup, cancelShipment } = useShiprocket();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-xl border border-border bg-surface p-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4",
			children: "Shiprocket Management"
		}), order.isShipmentCreated ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-4 text-sm",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-[95px_1fr] gap-y-3 gap-x-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-muted-foreground",
						children: "Order ID:"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-medium font-mono text-[13px] break-all",
						children: order.shiprocketOrderId
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-muted-foreground",
						children: "Shipment ID:"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-medium font-mono text-[13px] break-all",
						children: order.shipmentId
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-muted-foreground",
						children: "Status:"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-medium text-primary",
						children: order.shipmentStatus
					}),
					order.awbCode && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-muted-foreground",
							children: "AWB:"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-bold break-all",
							children: order.awbCode
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-muted-foreground",
							children: "Courier:"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-medium",
							children: order.courierName
						})
					] }),
					order.pickupStatus && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-muted-foreground",
						children: "Pickup:"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-medium",
						children: order.pickupStatus
					})] })
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "pt-3 border-t flex flex-col gap-2",
				children: [
					!order.awbCode && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => generateAwb.mutate({
							orderId: order.id,
							shipmentId: order.shipmentId
						}),
						disabled: generateAwb.isPending,
						className: "w-full rounded-md bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-50",
						children: generateAwb.isPending ? "Generating..." : "Generate AWB"
					}),
					order.awbCode && !order.pickupStatus && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => schedulePickup.mutate({
							orderId: order.id,
							shipmentId: order.shipmentId
						}),
						disabled: schedulePickup.isPending,
						className: "w-full rounded-md border border-primary text-primary px-3 py-2 text-sm font-semibold disabled:opacity-50",
						children: schedulePickup.isPending ? "Scheduling..." : "Schedule Pickup"
					}),
					order.shipmentStatus !== "Cancelled" && order.awbCode && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => cancelShipment.mutate({
							orderId: order.id,
							awbCode: order.awbCode
						}),
						disabled: cancelShipment.isPending,
						className: "w-full rounded-md bg-destructive/10 text-destructive px-3 py-2 text-sm font-semibold mt-2 disabled:opacity-50",
						children: cancelShipment.isPending ? "Cancelling..." : "Cancel Shipment"
					})
				]
			})]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "text-sm",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-muted-foreground mb-3",
					children: "Shipment not yet created in Shiprocket."
				}),
				order.shipmentError && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-4 rounded-md bg-destructive/10 p-3 text-destructive text-xs",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Error:" }),
						" ",
						order.shipmentError
					]
				}),
				order.status === "processing" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => retryShipmentCreation.mutate(order.id),
					disabled: retryShipmentCreation.isPending,
					className: "w-full rounded-md border border-primary px-3 py-2 text-sm font-semibold text-primary hover:bg-primary/5 disabled:opacity-50",
					children: retryShipmentCreation.isPending ? "Retrying..." : "Retry Creation"
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-xs italic text-muted-foreground",
					children: "Order must be in 'processing' status to create shipment."
				})
			]
		})]
	});
}
//#endregion
export { OrderDetailsPage as component };
