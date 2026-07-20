import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { T as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { n as compareMedicine, r as useStore } from "./store-DhPtNZlM.mjs";
import { _ as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { et as Banknote, h as ShieldCheck } from "../_libs/lucide-react.mjs";
import { n as useOrders } from "./use-orders-CxPkG3kV.mjs";
import { t as useMedicines } from "./use-medicines-XsigtTxu.mjs";
import { t as CheckoutFrame } from "./CheckoutFrame-ohxPtQmL.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/checkout.payment-CWry0Vet.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var PENDING_ADDRESS = "medicart.pending-address.v1";
var PRESCRIPTION_KEY = "medicart.pending-prescription.v1";
function loadRazorpayScript() {
	return new Promise((resolve) => {
		if (window.Razorpay) {
			resolve(true);
			return;
		}
		const script = document.createElement("script");
		script.src = "https://checkout.razorpay.com/v1/checkout.js";
		script.onload = () => resolve(true);
		script.onerror = () => resolve(false);
		document.body.appendChild(script);
	});
}
function PaymentStep() {
	const { cart, cartHasRx, clearCart } = useStore();
	const { createOrder: submitOrder, verifyPayment } = useOrders();
	const { medicines } = useMedicines();
	const navigate = useNavigate();
	const [method, setMethod] = (0, import_react.useState)("upi");
	const [placing, setPlacing] = (0, import_react.useState)(false);
	const [address, setAddress] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		if (cart.length === 0) {
			navigate({
				to: "/cart",
				replace: true
			});
			return;
		}
		try {
			const raw = window.localStorage.getItem(PENDING_ADDRESS);
			if (!raw) {
				navigate({
					to: "/checkout/address",
					replace: true
				});
				return;
			}
			setAddress(JSON.parse(raw));
		} catch {
			navigate({
				to: "/checkout/address",
				replace: true
			});
		}
	}, [cart.length, navigate]);
	async function placeOrder() {
		if (!address) return;
		setPlacing(true);
		let files = [];
		if (cartHasRx) try {
			const raw = window.localStorage.getItem(PRESCRIPTION_KEY);
			if (raw) files = JSON.parse(raw);
		} catch {}
		const items = cart.map((c) => {
			const m = medicines.find((x) => x.id === c.medicineId);
			if (!m) return null;
			return {
				medicineId: m.id,
				name: m.name,
				salt: m.salt,
				qty: c.qty,
				price: m.mrp,
				dosageForm: m.dosageForm,
				prescriptionRequired: m.prescriptionRequired
			};
		}).filter(Boolean);
		const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
		const delivery = address.deliverySlot === "express" ? 79 : subtotal > 499 ? 0 : 39;
		const hasRx = items.some((i) => i.prescriptionRequired);
		const extracted = files.flatMap((f) => f.extraction?.medicines ?? []);
		const itemVerifications = items.filter((i) => i.prescriptionRequired).map((i) => {
			const m = medicines.find((x) => x.id === i.medicineId);
			const aiStatus = extracted.length ? compareMedicine({
				name: m.name,
				salt: m.salt,
				brand: m.brand
			}, extracted) : "not_found";
			return {
				medicineId: i.medicineId,
				aiStatus,
				pharmacistApproved: false
			};
		});
		const pfData = files.map((f) => ({
			name: f.name,
			mimeType: f.mimeType,
			dataUrl: f.dataUrl,
			aiExtractionResult: f.extraction ?? void 0
		}));
		try {
			const order = await submitOrder({
				items,
				subtotal,
				delivery,
				total: subtotal + delivery,
				hasRx,
				paymentMethod: method,
				address: {
					fullName: address.fullName,
					phone: address.phone,
					line1: address.line1,
					line2: address.line2,
					city: address.city,
					state: address.state,
					pincode: address.pincode,
					type: address.type,
					deliverySlot: address.deliverySlot
				},
				prescriptionFiles: pfData.length > 0 ? pfData : void 0,
				itemVerifications: itemVerifications.length > 0 ? itemVerifications : void 0
			});
			if (order.razorpayOrderId) {
				if (!await loadRazorpayScript()) {
					toast.error("Razorpay SDK failed to load. Are you online?");
					setPlacing(false);
					return;
				}
				const options = {
					key: "rzp_test_TBlc9zvMpPDJMh",
					amount: Math.round(order.total * 100).toString(),
					currency: "INR",
					name: "MediCart",
					description: "Pharmacy Order",
					order_id: order.razorpayOrderId,
					handler: async function(response) {
						try {
							await verifyPayment({
								orderId: order.id,
								razorpayPaymentId: response.razorpay_payment_id,
								razorpayOrderId: response.razorpay_order_id,
								razorpaySignature: response.razorpay_signature
							});
							completeOrder(order.id);
						} catch (err) {
							toast.error(err.message || "Payment verification failed");
							setPlacing(false);
						}
					},
					prefill: {
						name: address.fullName,
						contact: address.phone
					},
					theme: { color: "#2563eb" }
				};
				const rzp = new window.Razorpay(options);
				rzp.on("payment.failed", function(response) {
					toast.error(response.error.description || "Payment failed");
					setPlacing(false);
				});
				rzp.open();
			} else completeOrder(order.id);
		} catch (error) {
			toast.error("Failed to place order: " + error.message);
			setPlacing(false);
		}
	}
	function completeOrder(orderId) {
		clearCart();
		window.localStorage.removeItem(PENDING_ADDRESS);
		window.localStorage.removeItem(PRESCRIPTION_KEY);
		toast.success("Order placed successfully");
		navigate({
			to: "/order/$id",
			params: { id: orderId }
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CheckoutFrame, {
		current: "payment",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "rounded-xl border border-border bg-surface p-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-lg font-semibold",
					children: "Payment method"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 space-y-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PayOption, {
						selected: method === "upi",
						onClick: () => setMethod("upi"),
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { size: 20 }),
						title: "Pay Online Securely",
						subtitle: "UPI, Cards, Netbanking via Razorpay"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PayOption, {
						selected: method === "cod",
						onClick: () => setMethod("cod"),
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Banknote, { size: 20 }),
						title: "Cash on Delivery",
						subtitle: "Pay when your order arrives"
					})]
				}),
				address && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 rounded-lg border border-border bg-background p-4 text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
							children: "Delivering to"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-1 font-semibold",
							children: [
								address.fullName,
								" · ",
								address.type
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-muted-foreground",
							children: [
								address.line1,
								address.line2 ? `, ${address.line2}` : "",
								", ",
								address.city,
								", ",
								address.state,
								" — ",
								address.pincode
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-1 text-xs text-muted-foreground",
							children: address.phone
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex items-start gap-2 rounded-lg border border-border bg-primary-soft/40 p-4 text-xs text-foreground/80",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, {
						size: 16,
						className: "mt-0.5 flex-none text-primary"
					}), "Payments are processed over an encrypted connection. This demo simulates a real payment gateway (Razorpay/Stripe) without charging your account."]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6 flex justify-end",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						disabled: placing,
						onClick: placeOrder,
						className: "rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground disabled:opacity-60 hover:bg-primary/90",
						children: placing ? "Placing order…" : "Place order"
					})
				})
			]
		})
	});
}
function PayOption({ selected, onClick, icon, title, subtitle }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		onClick,
		className: `flex w-full items-start gap-4 rounded-lg border p-4 text-left ${selected ? "border-primary bg-primary-soft/60" : "border-border bg-background hover:border-primary/40"}`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: `flex h-10 w-10 items-center justify-center rounded-lg ${selected ? "bg-primary text-primary-foreground" : "bg-surface-muted text-muted-foreground"}`,
				children: icon
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "font-semibold text-foreground",
					children: title
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-xs text-muted-foreground",
					children: subtitle
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: `mt-1 h-4 w-4 rounded-full border ${selected ? "border-primary bg-primary" : "border-border"}`,
				"aria-hidden": true
			})
		]
	});
}
//#endregion
export { PaymentStep as component };
