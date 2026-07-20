import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { T as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { r as useStore } from "./store-DhPtNZlM.mjs";
import { H as boolean, K as object, Y as string, z as _enum } from "../_libs/@better-auth/core+[...].mjs";
import { _ as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as CheckoutFrame } from "./CheckoutFrame-1YFyFQmr.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/checkout.address-D_s2sM1E.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var PENDING_ADDRESS = "medicart.pending-address.v1";
var addressSchema = object({
	fullName: string().trim().min(2, "Enter your full name").max(80),
	phone: string().trim().regex(/^\+?\d[\d\s-]{7,14}$/, "Enter a valid phone number"),
	line1: string().trim().min(3, "Address line 1 required").max(120),
	line2: string().trim().max(120).optional(),
	city: string().trim().min(2).max(60),
	state: string().trim().min(2).max(60),
	pincode: string().trim().regex(/^\d{5,6}$/, "Enter a valid pincode"),
	type: _enum(["Home", "Work"]),
	deliverySlot: _enum(["standard", "express"]),
	save: boolean().optional()
});
function AddressStep() {
	const { cart, savedAddresses, saveAddress } = useStore();
	const navigate = useNavigate();
	const [values, setValues] = (0, import_react.useState)(() => {
		const base = {
			fullName: "",
			phone: "",
			line1: "",
			line2: "",
			city: "",
			state: "",
			pincode: "",
			type: "Home",
			deliverySlot: "standard",
			save: true
		};
		if (typeof window === "undefined") return base;
		try {
			const raw = window.localStorage.getItem(PENDING_ADDRESS);
			if (raw) return {
				...base,
				...JSON.parse(raw)
			};
		} catch {}
		return base;
	});
	const [errors, setErrors] = (0, import_react.useState)({});
	(0, import_react.useEffect)(() => {
		if (cart.length === 0) navigate({
			to: "/cart",
			replace: true
		});
	}, [cart.length, navigate]);
	function update(k, v) {
		setValues((p) => ({
			...p,
			[k]: v
		}));
	}
	function submit(e) {
		e.preventDefault();
		const parsed = addressSchema.safeParse(values);
		if (!parsed.success) {
			const errs = {};
			for (const issue of parsed.error.issues) errs[issue.path[0]] = issue.message;
			setErrors(errs);
			toast.error("Please fix the highlighted fields");
			return;
		}
		setErrors({});
		const { save, ...address } = parsed.data;
		if (save) saveAddress(address);
		window.localStorage.setItem(PENDING_ADDRESS, JSON.stringify(address));
		navigate({ to: "/checkout/payment" });
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CheckoutFrame, {
		current: "address",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit: submit,
			className: "space-y-6 rounded-xl border border-border bg-surface p-6",
			children: [
				savedAddresses.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-sm font-semibold text-foreground",
					children: "Saved addresses"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-3 grid gap-2 sm:grid-cols-2",
					children: savedAddresses.map((a, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => setValues({
							...a,
							save: false
						}),
						className: "rounded-lg border border-border bg-background p-3 text-left text-sm hover:border-primary",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "font-semibold",
							children: [
								a.fullName,
								" · ",
								a.type
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-xs text-muted-foreground",
							children: [
								a.line1,
								", ",
								a.city,
								", ",
								a.state,
								" — ",
								a.pincode
							]
						})]
					}, i))
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-lg font-semibold",
					children: "Delivery address"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-4 sm:grid-cols-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Full name",
							error: errors.fullName,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: values.fullName,
								onChange: (e) => update("fullName", e.target.value),
								className: inputClass(!!errors.fullName),
								maxLength: 80
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Phone",
							error: errors.phone,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: values.phone,
								onChange: (e) => update("phone", e.target.value),
								className: inputClass(!!errors.phone),
								maxLength: 15
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Address line 1",
							error: errors.line1,
							className: "sm:col-span-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: values.line1,
								onChange: (e) => update("line1", e.target.value),
								className: inputClass(!!errors.line1),
								maxLength: 120
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Address line 2 (optional)",
							className: "sm:col-span-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: values.line2 ?? "",
								onChange: (e) => update("line2", e.target.value),
								className: inputClass(false),
								maxLength: 120
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "City",
							error: errors.city,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: values.city,
								onChange: (e) => update("city", e.target.value),
								className: inputClass(!!errors.city),
								maxLength: 60
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "State",
							error: errors.state,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: values.state,
								onChange: (e) => update("state", e.target.value),
								className: inputClass(!!errors.state),
								maxLength: 60
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Pincode",
							error: errors.pincode,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: values.pincode,
								onChange: (e) => update("pincode", e.target.value),
								className: inputClass(!!errors.pincode),
								maxLength: 6
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Address type",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-1 flex gap-2",
								children: ["Home", "Work"].map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => update("type", t),
									className: `flex-1 rounded-md border px-3 py-2 text-sm ${values.type === t ? "border-primary bg-primary-soft text-primary" : "border-border bg-background text-foreground"}`,
									children: t
								}, t))
							})
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "text-sm font-semibold",
					children: "Delivery slot"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-2 grid gap-3 sm:grid-cols-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SlotOption, {
						selected: values.deliverySlot === "standard",
						title: "Standard",
						subtitle: "Delivered in 2–3 days",
						price: "Free over ₹499",
						onClick: () => update("deliverySlot", "standard")
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SlotOption, {
						selected: values.deliverySlot === "express",
						title: "Express",
						subtitle: "Next-day delivery",
						price: "₹79",
						onClick: () => update("deliverySlot", "express")
					})]
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "flex items-center gap-2 text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "checkbox",
						checked: !!values.save,
						onChange: (e) => update("save", e.target.checked),
						className: "accent-primary"
					}), "Save this address for future orders"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex justify-end",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "submit",
						className: "rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90",
						children: "Continue to Payment"
					})
				})
			]
		})
	});
}
function Field({ label, error, children, className = "" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
				className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
				children: label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-1",
				children
			}),
			error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-1 text-xs text-destructive",
				children: error
			})
		]
	});
}
function inputClass(err) {
	return `w-full rounded-md border ${err ? "border-destructive" : "border-input"} bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20`;
}
function SlotOption({ selected, title, subtitle, price, onClick }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		onClick,
		className: `rounded-lg border p-4 text-left ${selected ? "border-primary bg-primary-soft" : "border-border bg-background"}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-sm font-semibold",
				children: title
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-sm font-semibold text-primary",
				children: price
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-1 text-xs text-muted-foreground",
			children: subtitle
		})]
	});
}
//#endregion
export { AddressStep as component };
