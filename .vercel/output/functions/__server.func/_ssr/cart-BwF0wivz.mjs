import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { T as require_jsx_runtime, a as Overlay2, c as Title2, i as Description2, n as Cancel, o as Portal2, r as Content2, s as Root2, t as Action } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { r as useStore } from "./store-DhPtNZlM.mjs";
import { t as useAuth } from "./use-auth-C8ldQVR_.mjs";
import { _ as useNavigate, g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as Slot } from "../_libs/@radix-ui/react-avatar+[...].mjs";
import { P as Info, V as FileText, p as ShoppingBag, s as Trash2, w as Minus, y as Plus } from "../_libs/lucide-react.mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { n as cn, t as PublicLayout } from "./PublicLayout-B2Lc81uq.mjs";
import { t as useMedicines } from "./use-medicines-XsigtTxu.mjs";
import { t as MedicineVisual } from "./MedicineVisual-DlBRNEbM.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/cart-BwF0wivz.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0", {
	variants: {
		variant: {
			default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
			destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
			outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
			secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
			ghost: "hover:bg-accent hover:text-accent-foreground",
			link: "text-primary underline-offset-4 hover:underline"
		},
		size: {
			default: "h-9 px-4 py-2",
			sm: "h-8 rounded-md px-3 text-xs",
			lg: "h-10 rounded-md px-8",
			icon: "h-9 w-9"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
var Button = import_react.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size,
			className
		})),
		ref,
		...props
	});
});
Button.displayName = "Button";
var AlertDialog = Root2;
var AlertDialogPortal = Portal2;
var AlertDialogOverlay = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Overlay2, {
	className: cn("fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className),
	...props,
	ref
}));
AlertDialogOverlay.displayName = Overlay2.displayName;
var AlertDialogContent = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogOverlay, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content2, {
	ref,
	className: cn("fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-lg", className),
	...props
})] }));
AlertDialogContent.displayName = Content2.displayName;
var AlertDialogHeader = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col space-y-2 text-center sm:text-left", className),
	...props
});
AlertDialogHeader.displayName = "AlertDialogHeader";
var AlertDialogFooter = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
	...props
});
AlertDialogFooter.displayName = "AlertDialogFooter";
var AlertDialogTitle = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Title2, {
	ref,
	className: cn("text-lg font-semibold", className),
	...props
}));
AlertDialogTitle.displayName = Title2.displayName;
var AlertDialogDescription = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Description2, {
	ref,
	className: cn("text-sm text-muted-foreground", className),
	...props
}));
AlertDialogDescription.displayName = Description2.displayName;
var AlertDialogAction = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Action, {
	ref,
	className: cn(buttonVariants(), className),
	...props
}));
AlertDialogAction.displayName = Action.displayName;
var AlertDialogCancel = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cancel, {
	ref,
	className: cn(buttonVariants({ variant: "outline" }), "mt-2 sm:mt-0", className),
	...props
}));
AlertDialogCancel.displayName = Cancel.displayName;
function CartPage() {
	const { cart, updateQty, removeFromCart, cartHasRx } = useStore();
	const { user } = useAuth();
	const navigate = useNavigate();
	const [showLoginPrompt, setShowLoginPrompt] = (0, import_react.useState)(false);
	const { medicines, isLoading } = useMedicines();
	const items = cart.map((c) => {
		const m = medicines.find((x) => x.id === c.medicineId);
		return m ? {
			m,
			qty: c.qty
		} : null;
	}).filter(Boolean);
	const rxItems = items.filter((i) => i.m.prescriptionRequired);
	const otcItems = items.filter((i) => !i.m.prescriptionRequired);
	const subtotal = items.reduce((s, i) => s + i.m.mrp * i.qty, 0);
	const delivery = subtotal > 499 ? 0 : items.length ? 39 : 0;
	const total = subtotal + delivery;
	if (items.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PublicLayout, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "container-page py-20 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary-soft text-primary",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingBag, { size: 28 })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-4 text-2xl font-bold",
				children: "Your cart is empty"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted-foreground",
				children: "Browse our catalog and add medicines to get started."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/shop",
				className: "mt-6 inline-flex items-center rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90",
				children: "Shop medicines"
			})
		]
	}) });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PublicLayout, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "container-page py-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-2xl font-bold text-foreground md:text-3xl",
				children: "Your cart"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: [
					items.length,
					" item",
					items.length > 1 ? "s" : "",
					" · Review before checkout"
				]
			}),
			cartHasRx && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-5 flex items-start gap-3 rounded-lg border border-warning/40 bg-warning/10 p-4 text-sm text-warning-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, {
					size: 18,
					className: "mt-0.5 flex-none"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: "Your cart includes prescription medicines. You'll upload your prescription in the next step, and our pharmacist will verify it before your order ships." })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 grid gap-8 lg:grid-cols-[1.6fr_1fr]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-6",
					children: [rxItems.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartGroup, {
						title: "Prescription medicines",
						tag: "Rx",
						tagClass: "bg-warning/15 text-warning-foreground",
						children: rxItems.map(({ m, qty }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartRow, {
							m,
							qty,
							onQty: (n) => updateQty(m.id, n),
							onRemove: () => removeFromCart(m.id)
						}, m.id))
					}), otcItems.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartGroup, {
						title: "Over-the-counter",
						tag: "OTC",
						tagClass: "bg-success/15 text-success",
						children: otcItems.map(({ m, qty }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartRow, {
							m,
							qty,
							onQty: (n) => updateQty(m.id, n),
							onRemove: () => removeFromCart(m.id)
						}, m.id))
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
					className: "h-fit rounded-xl border border-border bg-surface p-5 lg:sticky lg:top-24",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-sm font-semibold uppercase tracking-wider text-muted-foreground",
							children: "Order summary"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
							className: "mt-4 space-y-2 text-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
									label: "Subtotal",
									value: `₹${subtotal.toFixed(2)}`
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
									label: "Delivery",
									value: delivery === 0 ? "FREE" : `₹${delivery}`
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "my-3 border-t border-border" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
									label: "Total",
									value: `₹${total.toFixed(2)}`,
									bold: true
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => {
								const target = cartHasRx ? "/checkout/prescription" : "/checkout/address";
								if (!user) setShowLoginPrompt(true);
								else navigate({ to: target });
							},
							className: "mt-5 w-full rounded-md bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90",
							children: "Proceed"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-center text-xs text-muted-foreground",
							children: "Free delivery on orders over ₹499"
						})
					]
				})]
			})
		]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialog, {
		open: showLoginPrompt,
		onOpenChange: setShowLoginPrompt,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogTitle, { children: "Sign in to proceed" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogDescription, { children: "You need to be logged into your MediCart account to proceed to checkout." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogCancel, { children: "Cancel" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogAction, {
			onClick: () => {
				navigate({
					to: "/login",
					search: { redirect: cartHasRx ? "/checkout/prescription" : "/checkout/address" }
				});
			},
			children: "Log in"
		})] })] })
	})] });
}
function CartGroup({ title, tag, tagClass, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "overflow-hidden rounded-xl border border-border bg-surface",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "flex items-center justify-between border-b border-border bg-surface-muted px-5 py-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-sm font-semibold text-foreground",
				children: title
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: `rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${tagClass}`,
				children: tag
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "divide-y divide-border",
			children
		})]
	});
}
function CartRow({ m, qty, onQty, onRemove }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex gap-4 p-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "h-20 w-20 flex-none",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MedicineVisual, {
				medicine: m,
				size: "sm"
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex-1",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-semibold text-foreground",
						children: m.name
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs text-muted-foreground",
						children: m.salt
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs text-muted-foreground",
						children: m.packSize
					}),
					m.prescriptionRequired && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-1.5 inline-flex items-center gap-1 text-[11px] font-semibold text-warning-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { size: 11 }), " Prescription required"]
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-right",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "font-bold text-foreground",
						children: ["₹", (m.mrp * qty).toFixed(2)]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-xs text-muted-foreground",
						children: [
							"₹",
							m.mrp,
							" each"
						]
					})]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 flex items-center gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "inline-flex items-center rounded-md border border-border",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => onQty(qty - 1),
							className: "flex h-8 w-8 items-center justify-center text-muted-foreground hover:text-foreground",
							"aria-label": "Decrease",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Minus, { size: 14 })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "w-8 text-center text-sm font-semibold",
							children: qty
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => onQty(qty + 1),
							className: "flex h-8 w-8 items-center justify-center text-muted-foreground hover:text-foreground",
							"aria-label": "Increase",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { size: 14 })
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: onRemove,
					className: "inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { size: 14 }), " Remove"]
				})]
			})]
		})]
	});
}
function Row({ label, value, accent, bold }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `flex items-center justify-between ${bold ? "text-base" : ""}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
			className: `${bold ? "font-semibold text-foreground" : "text-muted-foreground"}`,
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
			className: `${bold ? "font-bold text-foreground" : "font-medium text-foreground"} ${accent ?? ""}`,
			children: value
		})]
	});
}
//#endregion
export { CartPage as component };
