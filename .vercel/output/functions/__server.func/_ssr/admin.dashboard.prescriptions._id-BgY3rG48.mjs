import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { T as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { r as useStore } from "./store-DhPtNZlM.mjs";
import { t as useAuth } from "./use-auth-C8ldQVR_.mjs";
import { _ as useNavigate, g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { J as CircleX, V as FileText, Y as CircleCheck, o as TriangleAlert, rt as ArrowLeft, u as Sparkles } from "../_libs/lucide-react.mjs";
import { n as useOrders, t as useOrder } from "./use-orders-CxPkG3kV.mjs";
import { t as useMedicines } from "./use-medicines-XsigtTxu.mjs";
import { t as Route } from "./admin.dashboard.prescriptions._id-NdhinZQr.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.dashboard.prescriptions._id-BgY3rG48.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function PrescriptionReviewPage() {
	const { id } = Route.useParams();
	const { storeHydrated } = useStore();
	const { user } = useAuth();
	const { updateOrderStatus, toggleItemVerification, isUpdating } = useOrders();
	const { data: order, isLoading } = useOrder(id);
	const { medicines, isLoading: isLoadingMedicines } = useMedicines();
	const navigate = useNavigate();
	const [rejectMode, setRejectMode] = (0, import_react.useState)(false);
	const [rejectReason, setRejectReason] = (0, import_react.useState)("");
	if (!storeHydrated || isLoading || isLoadingMedicines) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4 animate-pulse",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-5 w-32 rounded bg-border" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-8 w-64 rounded bg-border" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 grid gap-6 lg:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-64 rounded-xl bg-surface border border-border" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-64 rounded-xl bg-surface border border-border" })]
			})
		]
	});
	if (!order) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-xl border border-border bg-surface p-10 text-center",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted-foreground",
			children: "Order not found."
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/admin/dashboard/prescriptions",
			className: "mt-4 inline-block text-sm font-semibold text-primary",
			children: "← Back to prescriptions"
		})]
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
		navigate({ to: "/admin/dashboard/prescriptions" });
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
		toast.success("Order flagged as Action Needed and customer notified");
		navigate({ to: "/admin/dashboard/prescriptions" });
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
			to: "/admin/dashboard/prescriptions",
			className: "inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { size: 14 }), " Prescriptions"]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-3 flex items-start justify-between gap-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-2xl font-bold",
				children: "Prescription review"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: [
					"Order ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-mono font-bold",
						children: order.id
					}),
					" · ",
					order.address.fullName,
					" ",
					"· ",
					new Date(order.createdAt).toLocaleString()
				]
			})] }), order.prescriptionStatus && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: `rounded-full px-3 py-1 text-xs font-semibold ${order.prescriptionStatus === "verified" ? "bg-success/15 text-success" : order.prescriptionStatus === "rejected" ? "bg-destructive/15 text-destructive" : "bg-warning/15 text-warning-foreground"}`,
				children: order.prescriptionStatus.toUpperCase()
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-6 grid gap-6 lg:grid-cols-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-xl border border-border bg-surface p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
						className: "text-sm font-semibold uppercase tracking-wider text-muted-foreground",
						children: [
							"Uploaded prescription (",
							order.prescriptionFiles.length,
							")"
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-3 space-y-4",
						children: order.prescriptionFiles.map((f, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-lg border border-border bg-background p-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-xs text-muted-foreground",
									children: [
										"File ",
										idx + 1,
										" — ",
										f.name
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-2 overflow-hidden rounded-md border border-border bg-surface-muted",
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
											children: "This file was too large to cache locally. The AI extraction data below is still available for review."
										})] })]
									}) : f.mimeType.startsWith("image/") ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
										href: f.dataUrl,
										target: "_blank",
										rel: "noopener noreferrer",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
											src: f.dataUrl,
											alt: f.name,
											className: "max-h-96 w-full object-contain"
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
									className: "mt-3 rounded-md border border-border bg-surface-muted/50 p-3 text-xs",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-1.5 text-primary",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { size: 13 }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-semibold uppercase tracking-wider",
												children: "AI extraction (editable)"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "mt-2 grid gap-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kv, {
												label: "Doctor",
												value: f.aiExtractionResult?.doctorName ?? "—"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kv, {
												label: "Patient",
												value: f.aiExtractionResult?.patientName ?? "—"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "mt-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground",
											children: "Medicines detected"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
											className: "mt-1 space-y-0.5",
											children: [f.aiExtractionResult?.medicines?.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
												className: "text-muted-foreground",
												children: "None detected"
											}), f.aiExtractionResult?.medicines?.map((m, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
												"• ",
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-semibold",
													children: m.name
												}),
												m.dosage && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "text-muted-foreground",
													children: [" — ", m.dosage]
												})
											] }, i))]
										})
									]
								}),
								f.error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-2 text-xs text-destructive",
									children: f.error
								})
							]
						}, f.id))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-4 rounded-md border border-border bg-primary-soft/40 p-3 text-xs text-foreground/80",
						children: "AI comparison is a decision-support aid only. Final verification must be performed by the reviewing pharmacist."
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-xl border border-border bg-surface p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-sm font-semibold uppercase tracking-wider text-muted-foreground",
						children: "Cart items — Rx verification"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 space-y-3",
						children: [order.itemVerifications.map((v) => {
							const item = order.items.find((i) => i.medicineId === v.medicineId);
							const med = medicines.find((m) => m.id === v.medicineId);
							if (!item || !med) return null;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-lg border border-border bg-background p-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-start justify-between gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "font-semibold",
										children: item.name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-xs text-muted-foreground",
										children: [
											item.salt,
											" · ",
											item.dosageForm,
											" · Qty ",
											item.qty
										]
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MatchPill, { status: v.aiStatus })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "mt-3 flex cursor-pointer items-center gap-2 text-sm",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "checkbox",
										checked: v.pharmacistApproved,
										onChange: () => toggleItemVerification({
											id: v.id,
											approved: !v.pharmacistApproved
										}),
										className: "accent-primary",
										disabled: order.prescriptionStatus !== "pending" || isUpdating
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-medium",
										children: "Pharmacist verified"
									})]
								})]
							}, v.medicineId);
						}), order.itemVerifications.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-sm text-muted-foreground",
							children: "No Rx items on this order."
						})]
					}),
					order.prescriptionStatus === "pending" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-6 space-y-3 border-t border-border pt-4",
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
								placeholder: "e.g. The uploaded prescription doesn't clearly show Azithral 500. Please re-upload a clearer image.",
								maxLength: 400
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-3 flex gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: reject,
									className: "rounded-md bg-destructive px-4 py-2 text-sm font-semibold text-destructive-foreground hover:bg-destructive/90",
									children: "Send rejection"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setRejectMode(false),
									className: "rounded-md border border-border px-4 py-2 text-sm font-semibold text-foreground/80",
									children: "Cancel"
								})]
							})
						] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								disabled: !allReviewed,
								onClick: approve,
								className: "inline-flex items-center gap-2 rounded-md bg-success px-4 py-2 text-sm font-semibold text-success-foreground disabled:cursor-not-allowed disabled:opacity-50 hover:bg-success/90",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { size: 16 }), " Approve & Process Order"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => setRejectMode(true),
								className: "inline-flex items-center gap-2 rounded-md border border-destructive px-4 py-2 text-sm font-semibold text-destructive hover:bg-destructive hover:text-destructive-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, { size: 16 }), " Reject / Request Re-upload"]
							})]
						}), !allReviewed && !rejectMode && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start gap-2 text-xs text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, {
								size: 13,
								className: "mt-0.5"
							}), "Mark every Rx item as pharmacist verified to enable approval."]
						})]
					}),
					order.prescriptionStatus !== "pending" && order.reviewedBy && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-6 border-t border-border pt-4 text-xs text-muted-foreground",
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
			})]
		})
	] });
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
		children: "Possible match · review"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "whitespace-nowrap rounded-full bg-destructive/15 px-2 py-0.5 text-[11px] font-semibold text-destructive",
		children: "Not found in Rx"
	});
}
//#endregion
export { PrescriptionReviewPage as component };
