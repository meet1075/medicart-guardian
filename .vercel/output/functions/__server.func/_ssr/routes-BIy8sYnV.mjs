import { T as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { $ as Bone, B as FlaskConical, H as Eye, I as Heart, L as HeartPulse, Y as CircleCheck, b as Pill, c as Target, h as ShieldCheck, it as Activity, l as Stethoscope, nt as ArrowRight, tt as Award, z as Globe } from "../_libs/lucide-react.mjs";
import { t as PublicLayout } from "./PublicLayout-B2Lc81uq.mjs";
import { t as useMedicines } from "./use-medicines-XsigtTxu.mjs";
import { t as hero_pharmacy_default } from "./hero-pharmacy-hWXNKwtt.mjs";
import { t as MedicineCard } from "./MedicineCard-DKgzk6Vx.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-BIy8sYnV.js
var import_jsx_runtime = require_jsx_runtime();
function LandingPage() {
	const { medicines, isLoading } = useMedicines();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PublicLayout, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("script", {
			type: "application/ld+json",
			dangerouslySetInnerHTML: { __html: JSON.stringify({
				"@context": "https://schema.org",
				"@type": "Organization",
				name: "Obat Medicare Pvt Ltd",
				url: "https://obatmedicare.com",
				logo: "https://obatmedicare.com/favicon.ico",
				description: "A third-generation, super-specialty pharmaceutical company."
			}) }
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "relative overflow-hidden bg-surface",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "absolute inset-0 z-0",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -top-[20%] -left-[10%] h-[60%] w-[50%] rounded-full bg-primary/10 blur-[120px]" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute top-[40%] -right-[10%] h-[50%] w-[40%] rounded-full bg-info/10 blur-[100px]" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "absolute inset-0 opacity-[0.03]",
						style: {
							backgroundImage: `radial-gradient(circle at 2px 2px, var(--color-foreground) 1px, transparent 0)`,
							backgroundSize: "40px 40px"
						}
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "container-page relative z-10 grid gap-12 py-16 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:py-24",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "max-w-2xl",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "inline-flex animate-in fade-in slide-in-from-bottom-4 duration-700 items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Award, { size: 14 }), " Obat Medicare Pvt Ltd"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
							className: "mt-6 animate-in fade-in slide-in-from-bottom-5 duration-700 delay-150 text-5xl font-extrabold leading-[1.1] tracking-tight text-foreground md:text-6xl lg:text-[4rem]",
							children: [
								"Your Health, ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "bg-gradient-to-r from-primary to-info bg-clip-text text-transparent",
									children: "Our Priority."
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-6 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-300 text-lg leading-relaxed text-muted-foreground",
							children: "A third-generation super-specialty pharmaceutical company dedicated to redefining healthcare delivery through quality, innovation, and unwavering ethical practices."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-10 animate-in fade-in slide-in-from-bottom-7 duration-700 delay-500 flex flex-wrap items-center gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/our-products",
								className: "inline-flex h-12 items-center gap-2 rounded-xl bg-primary px-8 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-primary/40",
								children: ["Explore Formulations ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { size: 16 })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/shop",
								className: "inline-flex h-12 items-center gap-2 rounded-xl border border-border bg-surface px-8 text-sm font-semibold text-foreground transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:bg-primary-soft hover:text-primary",
								children: "Online Pharmacy"
							})]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative animate-in fade-in zoom-in-95 duration-1000 delay-300",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative overflow-hidden rounded-3xl border border-border bg-surface/50 p-2 shadow-2xl backdrop-blur-xl",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: hero_pharmacy_default,
							alt: "Pharmaceutical formulations and quality control",
							width: 800,
							height: 600,
							className: "aspect-[4/3] w-full rounded-2xl object-cover"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 rounded-2xl bg-gradient-to-tr from-primary/20 via-transparent to-transparent opacity-60" })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "absolute -bottom-6 -left-6 rounded-2xl border border-border bg-surface/80 p-5 shadow-xl backdrop-blur-md supports-[backdrop-filter]:bg-surface/60 md:bottom-10 md:-left-12",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex h-12 w-12 items-center justify-center rounded-full bg-success/15 text-success",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { size: 24 })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-sm font-bold text-foreground",
								children: "GMP Certified"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs text-muted-foreground",
								children: "World-class quality control"
							})] })]
						})
					})]
				})]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "border-y border-border bg-surface-muted",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "container-page py-12 md:py-16",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-2 divide-x divide-border md:grid-cols-4",
					children: [
						{
							value: "2016",
							label: "Founded",
							sub: "Third-gen enterprise"
						},
						{
							value: "5+",
							label: "Specialties",
							sub: "Medical departments"
						},
						{
							value: "90+",
							label: "Products",
							sub: "Active formulations"
						},
						{
							value: "Global",
							label: "Reach",
							sub: "Pan-India & Beyond"
						}
					].map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: `px-4 text-center md:px-8 ${i === 0 ? "pl-0" : ""} ${i === 3 ? "pr-0 border-r-0" : ""}`,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-3xl font-extrabold text-foreground md:text-4xl",
								children: s.value
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-2 text-sm font-bold uppercase tracking-wider text-primary",
								children: s.label
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-1 text-xs text-muted-foreground",
								children: s.sub
							})
						]
					}, s.label))
				})
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "relative overflow-hidden py-20 md:py-28",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "container-page relative z-10",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-3xl font-bold text-foreground md:text-4xl",
						children: "Our Purpose"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mx-auto mt-4 max-w-2xl text-muted-foreground",
						children: "We are driven by a commitment to make quality healthcare accessible, blending decades of industry wisdom with modern medical innovation."
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-14 grid gap-6 md:grid-cols-2 lg:gap-10",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "group relative overflow-hidden rounded-3xl border border-border bg-surface p-8 shadow-sm transition-all hover:shadow-lg lg:p-10",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/5 transition-transform duration-500 group-hover:scale-150" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative z-10",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-md",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Target, { size: 28 })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "mt-6 text-2xl font-bold text-foreground",
									children: "Our Mission"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-4 text-base leading-relaxed text-muted-foreground",
									children: [
										"To make quality healthcare accessible and affordable for all by developing and delivering pharmaceutical products that address real-world health challenges with",
										" ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
											className: "font-semibold text-foreground",
											children: "integrity, innovation, and compassion."
										})
									]
								})
							]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "group relative overflow-hidden rounded-3xl border border-border bg-surface p-8 shadow-sm transition-all hover:shadow-lg lg:p-10",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -right-10 -top-10 h-40 w-40 rounded-full bg-info/5 transition-transform duration-500 group-hover:scale-150" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative z-10",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-info text-info-foreground shadow-md",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { size: 28 })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "mt-6 text-2xl font-bold text-foreground",
									children: "Our Vision"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-4 text-base leading-relaxed text-muted-foreground",
									children: [
										"To be a trusted global healthcare partner, recognized for our",
										" ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
											className: "font-semibold text-foreground",
											children: "ethical practices and scientific excellence"
										}),
										", with an unwavering commitment to improving the lives of patients worldwide."
									]
								})
							]
						})]
					})]
				})]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "bg-surface-muted py-20 md:py-28",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "container-page",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-6 md:flex-row md:items-end md:justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "max-w-xl",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs font-bold uppercase tracking-widest text-primary",
								children: "Formulations"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "mt-2 text-3xl font-bold text-foreground md:text-4xl",
								children: "Super-Specialty Departments"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-4 text-muted-foreground",
								children: "We manufacture and distribute over 90 advanced formulations across 5 critical healthcare domains."
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/our-products",
						className: "group inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80",
						children: ["View Full Catalog", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, {
							size: 16,
							className: "transition-transform group-hover:translate-x-1"
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5 lg:gap-6",
					children: [
						{
							id: "dermatology",
							icon: Heart,
							label: "Dermatology",
							count: 61
						},
						{
							id: "general",
							icon: Pill,
							label: "General Medicine",
							count: 22
						},
						{
							id: "cardiac",
							icon: Stethoscope,
							label: "Cardiac-Diabetic",
							count: 11
						},
						{
							id: "gastro",
							icon: Activity,
							label: "Gastroenterology",
							count: 1
						},
						{
							id: "ortho",
							icon: Bone,
							label: "Orthopaedics",
							count: 1
						}
					].map((cat) => {
						const Icon = cat.icon;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/our-products",
							className: "group relative flex flex-col items-center overflow-hidden rounded-2xl border border-border bg-surface p-6 text-center transition-all hover:-translate-y-1 hover:border-primary/50 hover:shadow-xl",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-b from-primary/0 to-primary/5 opacity-0 transition-opacity group-hover:opacity-100" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "relative z-10 flex h-14 w-14 items-center justify-center rounded-full bg-primary-soft text-primary transition-transform group-hover:scale-110",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { size: 24 })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "relative z-10 mt-5 font-bold text-foreground",
									children: cat.label
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "relative z-10 mt-1 text-xs font-medium text-muted-foreground",
									children: [cat.count, " Products"]
								})
							]
						}, cat.id);
					})
				})]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "py-20 md:py-28",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "container-page",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-6 md:flex-row md:items-end md:justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs font-bold uppercase tracking-widest text-primary",
							children: "MediCart Online"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mt-2 text-3xl font-bold text-foreground md:text-4xl",
							children: "Order Direct to Home"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 max-w-xl text-muted-foreground",
							children: "Purchase authentic Obat Medicare formulations directly through our secure online pharmacy portal."
						})
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/shop",
						className: "inline-flex items-center gap-2 rounded-xl bg-foreground px-6 py-3 text-sm font-semibold text-background hover:bg-foreground/90",
						children: ["Open Pharmacy ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { size: 16 })]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 lg:gap-6",
					children: isLoading ? Array.from({ length: 4 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-border bg-surface p-4 animate-pulse",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "aspect-square rounded-xl bg-surface-muted" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mt-3 h-4 w-3/4 rounded bg-surface-muted" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mt-2 h-3 w-1/2 rounded bg-surface-muted" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mt-3 h-8 w-full rounded bg-surface-muted" })
						]
					}, i)) : medicines.slice(0, 4).map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MedicineCard, { medicine: m }, m.id))
				})]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "border-t border-border bg-surface-muted py-20",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "container-page",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-12 rounded-3xl border border-border bg-surface p-8 shadow-sm md:grid-cols-2 md:items-center md:p-14 lg:p-20",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-success/15 text-success",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { size: 28 })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
							className: "mt-6 text-3xl font-bold text-foreground",
							children: [
								"Pharmacist Verified, ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
								" Quality Assured."
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 text-base leading-relaxed text-muted-foreground",
							children: "For prescription medications ordered via MediCart, our in-house licensed pharmacists manually verify every prescription before dispatch, ensuring strict compliance with healthcare regulations."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "mt-8 space-y-4",
							children: [
								"100% Genuine Medicines Guaranteed",
								"Secure, Temperature-Controlled Shipping",
								"Free Consultation with Pharmacists"
							].map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex items-center gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, {
									size: 18,
									className: "text-success"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-medium text-foreground",
									children: item
								})]
							}, item))
						})
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid gap-4 sm:grid-cols-2",
						children: [
							{
								icon: FlaskConical,
								title: "R&D Driven",
								desc: "Scientifically validated formulas"
							},
							{
								icon: Globe,
								title: "Pan-India",
								desc: "Robust distribution network"
							},
							{
								icon: HeartPulse,
								title: "Patient First",
								desc: "Dedicated to community health"
							},
							{
								icon: ShieldCheck,
								title: "Ethical",
								desc: "Transparent business practices"
							}
						].map((b) => {
							const Icon = b.icon;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-2xl border border-border bg-surface-muted p-6",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
										size: 24,
										className: "text-primary"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "mt-4 font-bold text-foreground",
										children: b.title
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 text-xs text-muted-foreground",
										children: b.desc
									})
								]
							}, b.title);
						})
					})]
				})
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "py-20 md:py-28",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "container-page",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative overflow-hidden rounded-3xl bg-primary p-10 text-center text-primary-foreground shadow-2xl md:p-20",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "absolute inset-0 opacity-10",
						style: {
							backgroundImage: `radial-gradient(circle at 25% 50%, white 1px, transparent 1px),
                radial-gradient(circle at 75% 20%, white 1px, transparent 1px)`,
							backgroundSize: "60px 60px"
						}
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative z-10 mx-auto max-w-2xl",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-3xl font-extrabold md:text-5xl",
								children: "Partner With Us"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-6 text-lg text-primary-foreground/80",
								children: "Whether you are a healthcare provider looking for bulk supplies, or a distributor seeking to expand your portfolio, let's build better healthcare together."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-10 flex flex-wrap justify-center gap-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/contact",
									className: "inline-flex h-12 items-center gap-2 rounded-xl bg-background px-8 text-sm font-bold text-primary transition-transform hover:scale-105",
									children: ["Contact Our Team ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { size: 16 })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/about",
									className: "inline-flex h-12 items-center gap-2 rounded-xl border border-primary-foreground/20 bg-primary-foreground/10 px-8 text-sm font-bold text-primary-foreground backdrop-blur transition-colors hover:bg-primary-foreground/20",
									children: "Read Our Story"
								})]
							})
						]
					})]
				})
			})
		})
	] });
}
//#endregion
export { LandingPage as component };
