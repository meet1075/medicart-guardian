import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { T as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { D as MapPin, K as Clock, M as Linkedin, O as Mail, Q as Building2, T as MessageSquare, _ as Send, x as Phone } from "../_libs/lucide-react.mjs";
import { t as PublicLayout } from "./PublicLayout-BlOoVjOA.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/contact-fh9-1rdd.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var OFFICES = [{
	city: "Mumbai",
	label: "Head Office",
	address: [
		"Prime Mall, Office No S42B, 2nd Floor,",
		"Irla Society Road, Vile Parle West,",
		"Andheri, Mumbai – 400056",
		"Maharashtra, India"
	],
	icon: Building2,
	accent: "text-primary",
	accentBg: "bg-primary/10"
}, {
	city: "Patna",
	label: "Regional Office",
	address: [
		"House of Ajay Kumar Tiwari,",
		"Road No 9, Near Chandak Bhawan,",
		"Rajendra Nagar, Patna – 800016",
		"Bihar, India"
	],
	icon: MapPin,
	accent: "text-success",
	accentBg: "bg-success/10"
}];
var CONTACT_DETAILS = [
	{
		icon: Phone,
		label: "Phone",
		value: "+91-9650506996",
		href: "tel:+919650506996",
		accent: "text-primary",
		accentBg: "bg-primary/10"
	},
	{
		icon: Mail,
		label: "Email",
		value: "obatmedicare@gmail.com",
		href: "mailto:obatmedicare@gmail.com",
		accent: "text-info",
		accentBg: "bg-info/10"
	},
	{
		icon: Clock,
		label: "Business Hours",
		value: "Mon – Sat, 9:00 AM – 6:00 PM",
		href: null,
		accent: "text-warning-foreground",
		accentBg: "bg-warning/10"
	}
];
function ContactPage() {
	const [form, setForm] = (0, import_react.useState)({
		name: "",
		email: "",
		phone: "",
		company: "",
		message: ""
	});
	const [sending, setSending] = (0, import_react.useState)(false);
	function update(k, v) {
		setForm((p) => ({
			...p,
			[k]: v
		}));
	}
	function handleSubmit(e) {
		e.preventDefault();
		if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
			toast.error("Please fill in all required fields.");
			return;
		}
		setSending(true);
		setTimeout(() => {
			setSending(false);
			setForm({
				name: "",
				email: "",
				phone: "",
				company: "",
				message: ""
			});
			toast.success("Message sent! Our team will get back to you within 1 business day.");
		}, 900);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PublicLayout, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("script", {
			type: "application/ld+json",
			dangerouslySetInnerHTML: { __html: JSON.stringify({
				"@context": "https://schema.org",
				"@type": "LocalBusiness",
				name: "Obat Medicare Pvt Ltd",
				image: "https://obatmedicare.com/favicon.ico",
				description: "Reach us at our Mumbai or Patna offices.",
				url: "https://obatmedicare.com/contact",
				telephone: "+91-9650506996",
				email: "obatmedicare@gmail.com",
				address: {
					"@type": "PostalAddress",
					streetAddress: "MUMBAI & PATNA",
					addressCountry: "IN"
				},
				openingHours: "Mo-Sa 09:00-18:00"
			}) }
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "relative overflow-hidden border-b border-border",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-br from-primary/90 via-primary/70 to-primary/50" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "absolute inset-0 opacity-10",
					style: {
						backgroundImage: `radial-gradient(circle at 25% 50%, white 1px, transparent 1px),
              radial-gradient(circle at 75% 20%, white 1px, transparent 1px)`,
						backgroundSize: "60px 60px"
					}
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "container-page relative py-20 text-center text-white md:py-28",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mx-auto inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest backdrop-blur",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageSquare, { size: 13 }), " Get In Touch"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "mt-5 text-4xl font-bold tracking-tight md:text-5xl",
							children: "Contact Us"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 mx-auto max-w-xl text-base text-white/80",
							children: "Let's build better healthcare together. Reach out for partnerships, product inquiries, or expert pharmaceutical guidance."
						})
					]
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "container-page py-16",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-5 md:grid-cols-3",
				children: CONTACT_DETAILS.map((item) => {
					const Icon = item.icon;
					const inner = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: `inline-flex h-11 w-11 items-center justify-center rounded-xl ${item.accentBg} ${item.accent}`,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { size: 22 })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground",
							children: item.label
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-1 text-sm font-semibold text-foreground",
							children: item.value
						})
					] });
					return item.href ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: item.href,
						className: "rounded-2xl border border-border bg-surface p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md",
						children: inner
					}, item.label) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "rounded-2xl border border-border bg-surface p-6 shadow-sm",
						children: inner
					}, item.label);
				})
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "bg-surface-muted py-16",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "container-page grid gap-10 lg:grid-cols-[1fr_1.3fr]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs font-semibold uppercase tracking-widest text-primary",
						children: "Our Locations"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-2 text-2xl font-bold text-foreground",
						children: "Find Us"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-7 space-y-5",
						children: [OFFICES.map((office) => {
							const Icon = office.icon;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "rounded-2xl border border-border bg-surface p-6 shadow-sm",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-start gap-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: `flex h-10 w-10 flex-none items-center justify-center rounded-xl ${office.accentBg} ${office.accent}`,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { size: 20 })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
											children: office.label
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "mt-0.5 font-bold text-foreground",
											children: office.city
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "mt-2 space-y-0.5 text-sm text-muted-foreground",
											children: office.address.map((line, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: line }, i))
										})
									] })]
								})
							}, office.city);
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "rounded-2xl border border-border bg-surface p-6 shadow-sm",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-[#0077b5]/10 text-[#0077b5]",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Linkedin, { size: 20 })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
									children: "LinkedIn"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: "https://linkedin.com",
									target: "_blank",
									rel: "noopener noreferrer",
									className: "mt-0.5 block text-sm font-semibold text-[#0077b5] hover:underline",
									children: "Obat Medicare Pvt Ltd"
								})] })]
							})
						})]
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl border border-border bg-surface p-8 shadow-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs font-semibold uppercase tracking-widest text-primary",
							children: "Send a Message"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mt-2 text-2xl font-bold text-foreground",
							children: "Get in Touch"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-muted-foreground",
							children: "Let's build better healthcare. Connect with us today."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
							onSubmit: handleSubmit,
							className: "mt-7 space-y-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid gap-4 sm:grid-cols-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "Your Name",
										required: true,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											value: form.name,
											onChange: (e) => update("name", e.target.value),
											placeholder: "Rahul Sharma",
											className: inputCls,
											maxLength: 80
										})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "Email Address",
										required: true,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "email",
											value: form.email,
											onChange: (e) => update("email", e.target.value),
											placeholder: "rahul@example.com",
											className: inputCls
										})
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid gap-4 sm:grid-cols-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "Phone Number",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "tel",
											value: form.phone,
											onChange: (e) => update("phone", e.target.value),
											placeholder: "+91 98765 43210",
											className: inputCls,
											maxLength: 15
										})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "Company / Hospital",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											value: form.company,
											onChange: (e) => update("company", e.target.value),
											placeholder: "Apollo Hospitals",
											className: inputCls,
											maxLength: 100
										})
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Your Message",
									required: true,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
										value: form.message,
										onChange: (e) => update("message", e.target.value),
										placeholder: "Tell us about your requirements, product inquiries, or how we can help…",
										rows: 5,
										className: `${inputCls} resize-none`,
										maxLength: 1e3
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "submit",
									disabled: sending,
									className: "inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { size: 16 }), sending ? "Sending…" : "Send Message"]
								})
							]
						})
					]
				})]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "border-t border-border bg-surface",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "container-page py-12",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "overflow-hidden rounded-2xl border border-border",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex h-14 items-center gap-3 border-b border-border bg-surface-muted px-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, {
							size: 16,
							className: "text-primary"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-sm font-semibold text-foreground",
							children: "Prime Mall, Vile Parle West, Andheri, Mumbai 400056"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "relative flex h-64 items-center justify-center bg-gradient-to-br from-primary-soft/40 to-background",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-center",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, {
									size: 32,
									className: "mx-auto text-primary"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-2 text-sm font-semibold text-foreground",
									children: "Obat Medicare — Head Office"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-0.5 text-xs text-muted-foreground",
									children: "Vile Parle West, Mumbai"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: "https://maps.google.com/?q=Prime+Mall+Vile+Parle+West+Andheri+Mumbai",
									target: "_blank",
									rel: "noopener noreferrer",
									className: "mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90",
									children: "Open in Google Maps"
								})
							]
						})
					})]
				})
			})
		})
	] });
}
function Field({ label, required, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground",
		children: [label, required && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "ml-1 text-destructive",
			children: "*"
		})]
	}), children] });
}
var inputCls = "w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground";
//#endregion
export { ContactPage as component };
