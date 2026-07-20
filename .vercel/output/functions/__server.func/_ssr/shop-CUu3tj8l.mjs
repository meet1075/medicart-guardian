import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { T as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as PublicLayout } from "./PublicLayout-BlOoVjOA.mjs";
import { t as useMedicines } from "./use-medicines-XsigtTxu.mjs";
import { t as Route } from "./shop-BGhV34Us.mjs";
import { t as MedicineCard } from "./MedicineCard-DKgzk6Vx.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/shop-CUu3tj8l.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ShopPage() {
	const { q } = Route.useSearch();
	const { medicines, isLoading } = useMedicines();
	const [rxFilter, setRxFilter] = (0, import_react.useState)("all");
	const [maxPrice, setMaxPrice] = (0, import_react.useState)(3e3);
	const [sortBy, setSortBy] = (0, import_react.useState)("popular");
	const [query, setQuery] = (0, import_react.useState)(q ?? "");
	const results = (0, import_react.useMemo)(() => {
		let list = [...medicines];
		if (rxFilter !== "all") list = list.filter((m) => rxFilter === "rx" ? m.prescriptionRequired : !m.prescriptionRequired);
		if (query) {
			const nq = query.toLowerCase();
			list = list.filter((m) => m.name.toLowerCase().includes(nq) || m.salt.toLowerCase().includes(nq) || m.brand.toLowerCase().includes(nq));
		}
		list = list.filter((m) => m.mrp <= maxPrice);
		switch (sortBy) {
			case "price-asc":
				list.sort((a, b) => a.mrp - b.mrp);
				break;
			case "price-desc":
				list.sort((a, b) => b.mrp - a.mrp);
				break;
		}
		return list;
	}, [
		rxFilter,
		query,
		maxPrice,
		sortBy,
		medicines
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PublicLayout, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "container-page py-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-xs text-muted-foreground",
					children: [
						"Home ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mx-1",
							children: "/"
						}),
						" Shop"
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-2 text-2xl font-bold text-foreground md:text-3xl",
					children: "All medicines"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-1 text-sm text-muted-foreground",
					children: [
						results.length,
						" products ",
						query && `matching "${query}"`
					]
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "container-page grid gap-6 lg:grid-cols-[260px_1fr]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: "space-y-5 rounded-xl border border-border bg-surface p-5 lg:sticky lg:top-24 lg:self-start",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
						children: "Search"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: query,
						onChange: (e) => setQuery(e.target.value),
						placeholder: "e.g. Dolo",
						className: "mt-2 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
						children: "Prescription"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-2 flex flex-col gap-2 text-sm",
						children: [
							"all",
							"rx",
							"otc"
						].map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "radio",
								checked: rxFilter === k,
								onChange: () => setRxFilter(k),
								className: "accent-primary"
							}), k === "all" ? "All" : k === "rx" ? "Prescription only" : "OTC only"]
						}, k))
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
							children: "Max price"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-xs font-semibold text-foreground",
							children: ["₹", maxPrice]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "range",
						min: 30,
						max: 3e3,
						step: 20,
						value: maxPrice,
						onChange: (e) => setMaxPrice(Number(e.target.value)),
						className: "mt-2 w-full accent-primary"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
						children: "Sort by"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						value: sortBy,
						onChange: (e) => setSortBy(e.target.value),
						className: "mt-2 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "popular",
								children: "Popularity"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "price-asc",
								children: "Price: low to high"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "price-desc",
								children: "Price: high to low"
							})
						]
					})] })
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4",
				children: Array.from({ length: 8 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl border border-border bg-surface p-4 animate-pulse",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "aspect-square rounded-xl bg-surface-muted" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mt-3 h-4 w-3/4 rounded bg-surface-muted" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mt-2 h-3 w-1/2 rounded bg-surface-muted" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mt-3 h-8 w-full rounded bg-surface-muted" })
					]
				}, i))
			}) : results.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "rounded-xl border border-dashed border-border bg-surface p-12 text-center",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "No medicines match your filters."
				})
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4",
				children: results.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MedicineCard, { medicine: m }, m.id))
			}) })]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pb-16" })
	] });
}
//#endregion
export { ShopPage as component };
