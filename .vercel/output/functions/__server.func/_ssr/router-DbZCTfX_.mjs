import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { T as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as StoreProvider } from "./store-DhPtNZlM.mjs";
import { c as HeadContent, d as createRouter, f as Outlet, g as Link, h as createRootRouteWithContext, m as createFileRoute, p as lazyRouteComponent, s as Scripts, v as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as Toaster } from "../_libs/sonner.mjs";
import { n as Route$15 } from "./admin-xr7dJP2t.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { r as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { t as Route$16 } from "./admin.dashboard-BoO8UViR.mjs";
import { t as Route$17 } from "./admin.dashboard.orders._id-UrwWyoAp.mjs";
import { t as Route$18 } from "./admin.dashboard.prescriptions._id-NdhinZQr.mjs";
import { t as Route$19 } from "./login-C1h3gG1O.mjs";
import { t as Route$20 } from "./order._id-BW39OPMR.mjs";
import { t as getSeoMeta } from "./seo-BNprBz8W.mjs";
import { t as Route$21 } from "./product._id-Ds2q8l7R.mjs";
import { t as Route$22 } from "./register-C7JLfIPg.mjs";
import { t as Route$23 } from "./shop-wPEyPZ69.mjs";
import { t as hero_pharmacy_default } from "./hero-pharmacy-hWXNKwtt.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-DbZCTfX_.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var styles_default = "/assets/styles-ByWXAjAq.css";
function reportLovableError(error, context = {}) {
	if (typeof window === "undefined") return;
	window.__lovableEvents?.captureException?.(error, {
		source: "react_error_boundary",
		route: window.location.pathname,
		...context
	}, {
		mechanism: "react_error_boundary",
		handled: false,
		severity: "error"
	});
}
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-7xl font-bold text-foreground",
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 text-xl font-semibold text-foreground",
					children: "Page not found"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "The page you're looking for doesn't exist or has been moved."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Back to MediCart"
					})
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		reportLovableError(error, { boundary: "tanstack_root_error_component" });
	}, [error]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-semibold tracking-tight text-foreground",
					children: "This page didn't load"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Something went wrong. Try again or head back to the homepage."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Try again"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
						children: "Go home"
					})]
				})
			]
		})
	});
}
var Route$14 = createRootRouteWithContext()({
	head: () => {
		const seo = getSeoMeta({
			title: "MediCart — Genuine Medicines, Verified & Delivered",
			description: "MediCart is a licensed online pharmacy delivering genuine, pharmacist-verified medicines. Order prescription and OTC medicines, upload your Rx, and track delivery.",
			path: "/"
		});
		return {
			meta: [
				{ charSet: "utf-8" },
				{
					name: "viewport",
					content: "width=device-width, initial-scale=1"
				},
				{
					name: "theme-color",
					content: "#0E7C7B"
				},
				...seo.meta
			],
			links: [
				...seo.links,
				{
					rel: "stylesheet",
					href: styles_default
				},
				{
					rel: "icon",
					href: "/favicon.ico",
					type: "image/x-icon"
				},
				{
					rel: "preconnect",
					href: "https://fonts.googleapis.com"
				},
				{
					rel: "preconnect",
					href: "https://fonts.gstatic.com",
					crossOrigin: "anonymous"
				},
				{
					rel: "stylesheet",
					href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
				}
			]
		};
	},
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		suppressHydrationWarning: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", {
			suppressHydrationWarning: true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", {
			suppressHydrationWarning: true,
			children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})]
		})]
	});
}
function RootComponent() {
	const { queryClient } = Route$14.useRouteContext();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QueryClientProvider, {
		client: queryClient,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(StoreProvider, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
			richColors: true,
			position: "top-center"
		})] })
	});
}
var $$splitComponentImporter$13 = () => import("./track-UecVOZr7.mjs");
var Route$13 = createFileRoute("/track")({
	head: () => ({ meta: [{ title: "Track your order — MediCart" }, {
		name: "description",
		content: "Track the status of your MediCart order."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$13, "component")
});
var $$splitComponentImporter$12 = () => import("./our-products-BnZNqmBx.mjs");
var Route$12 = createFileRoute("/our-products")({
	head: () => {
		const seo = getSeoMeta({
			title: "Our Products — Obat Medicare | MediCart",
			description: "Explore the Obat Medicare pharmaceutical product range — dermatology, general medicine, cardiac-diabetic, gastroenterology, and orthopaedics formulations.",
			path: "/our-products"
		});
		return {
			meta: seo.meta,
			links: seo.links
		};
	},
	component: lazyRouteComponent($$splitComponentImporter$12, "component")
});
var $$splitComponentImporter$11 = () => import("./contact-BsQBk-aV.mjs");
var Route$11 = createFileRoute("/contact")({
	head: () => {
		const seo = getSeoMeta({
			title: "Contact Us — Obat Medicare | MediCart",
			description: "Get in touch with Obat Medicare. Reach us at our Mumbai or Patna offices, call +91-9650506996, or email obatmedicare@gmail.com.",
			path: "/contact"
		});
		return {
			meta: seo.meta,
			links: seo.links
		};
	},
	component: lazyRouteComponent($$splitComponentImporter$11, "component")
});
var $$splitComponentImporter$10 = () => import("./cart-BwF0wivz.mjs");
var Route$10 = createFileRoute("/cart")({
	head: () => ({ meta: [{ title: "Your cart — MediCart" }, {
		name: "robots",
		content: "noindex"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$10, "component")
});
var $$splitComponentImporter$9 = () => import("./about-0z-5deAt.mjs");
var Route$9 = createFileRoute("/about")({
	head: () => {
		const seo = getSeoMeta({
			title: "About Us — Obat Medicare | MediCart",
			description: "Learn about Obat Medicare Pvt Ltd — a third-generation, super-specialty pharmaceutical company founded in 2016 with a presence across dermatology, cardiac care, and more.",
			path: "/about"
		});
		return {
			meta: seo.meta,
			links: seo.links
		};
	},
	component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
var $$splitComponentImporter$8 = () => import("./routes-BIy8sYnV.mjs");
var Route$8 = createFileRoute("/")({
	head: () => {
		const seo = getSeoMeta({
			title: "MediCart — Genuine Medicines, Verified & Delivered",
			description: "MediCart is a licensed online pharmacy delivering genuine, pharmacist-verified medicines. Order prescription and OTC medicines, upload your Rx, and track delivery.",
			path: "/"
		});
		return {
			meta: seo.meta,
			links: [...seo.links, {
				rel: "preload",
				as: "image",
				href: hero_pharmacy_default
			}]
		};
	},
	component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
var $$splitComponentImporter$7 = () => import("./admin.index-CWe9ZKXZ.mjs");
var Route$7 = createFileRoute("/admin/")({
	head: () => ({ meta: [{ title: "Admin — MediCart" }, {
		name: "robots",
		content: "noindex"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
var $$splitComponentImporter$6 = () => import("./checkout.prescription-tdLQFImG.mjs");
var Route$6 = createFileRoute("/checkout/prescription")({
	head: () => ({ meta: [{ title: "Upload prescription — MediCart" }, {
		name: "robots",
		content: "noindex"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
var $$splitComponentImporter$5 = () => import("./checkout.payment-79zdxGtI.mjs");
var Route$5 = createFileRoute("/checkout/payment")({
	head: () => ({ meta: [{ title: "Payment — MediCart" }, {
		name: "robots",
		content: "noindex"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
var $$splitComponentImporter$4 = () => import("./checkout.address-D_s2sM1E.mjs");
var Route$4 = createFileRoute("/checkout/address")({
	head: () => ({ meta: [{ title: "Delivery address — MediCart" }, {
		name: "robots",
		content: "noindex"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
var $$splitComponentImporter$3 = () => import("./admin.dashboard.users--nEm-ncy.mjs");
var Route$3 = createFileRoute("/admin/dashboard/users")({ component: lazyRouteComponent($$splitComponentImporter$3, "component") });
var $$splitComponentImporter$2 = () => import("./admin.dashboard.prescriptions-BwQsies8.mjs");
var Route$2 = createFileRoute("/admin/dashboard/prescriptions")({ component: lazyRouteComponent($$splitComponentImporter$2, "component") });
var $$splitComponentImporter$1 = () => import("./admin.dashboard.medicines-qhubeVrT.mjs");
var Route$1 = createFileRoute("/admin/dashboard/medicines")({ component: lazyRouteComponent($$splitComponentImporter$1, "component") });
var $$splitComponentImporter = () => import("./admin.dashboard.orders.index-bp3Qah_6.mjs");
var Route = createFileRoute("/admin/dashboard/orders/")({ component: lazyRouteComponent($$splitComponentImporter, "component") });
var TrackRoute = Route$13.update({
	id: "/track",
	path: "/track",
	getParentRoute: () => Route$14
});
var ShopRoute = Route$23.update({
	id: "/shop",
	path: "/shop",
	getParentRoute: () => Route$14
});
var RegisterRoute = Route$22.update({
	id: "/register",
	path: "/register",
	getParentRoute: () => Route$14
});
var OurProductsRoute = Route$12.update({
	id: "/our-products",
	path: "/our-products",
	getParentRoute: () => Route$14
});
var LoginRoute = Route$19.update({
	id: "/login",
	path: "/login",
	getParentRoute: () => Route$14
});
var ContactRoute = Route$11.update({
	id: "/contact",
	path: "/contact",
	getParentRoute: () => Route$14
});
var CartRoute = Route$10.update({
	id: "/cart",
	path: "/cart",
	getParentRoute: () => Route$14
});
var AdminRoute = Route$15.update({
	id: "/admin",
	path: "/admin",
	getParentRoute: () => Route$14
});
var AboutRoute = Route$9.update({
	id: "/about",
	path: "/about",
	getParentRoute: () => Route$14
});
var IndexRoute = Route$8.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$14
});
var AdminIndexRoute = Route$7.update({
	id: "/",
	path: "/",
	getParentRoute: () => AdminRoute
});
var ProductIdRoute = Route$21.update({
	id: "/product/$id",
	path: "/product/$id",
	getParentRoute: () => Route$14
});
var OrderIdRoute = Route$20.update({
	id: "/order/$id",
	path: "/order/$id",
	getParentRoute: () => Route$14
});
var CheckoutPrescriptionRoute = Route$6.update({
	id: "/checkout/prescription",
	path: "/checkout/prescription",
	getParentRoute: () => Route$14
});
var CheckoutPaymentRoute = Route$5.update({
	id: "/checkout/payment",
	path: "/checkout/payment",
	getParentRoute: () => Route$14
});
var CheckoutAddressRoute = Route$4.update({
	id: "/checkout/address",
	path: "/checkout/address",
	getParentRoute: () => Route$14
});
var AdminDashboardRoute = Route$16.update({
	id: "/dashboard",
	path: "/dashboard",
	getParentRoute: () => AdminRoute
});
var AdminDashboardUsersRoute = Route$3.update({
	id: "/users",
	path: "/users",
	getParentRoute: () => AdminDashboardRoute
});
var AdminDashboardPrescriptionsRoute = Route$2.update({
	id: "/prescriptions",
	path: "/prescriptions",
	getParentRoute: () => AdminDashboardRoute
});
var AdminDashboardMedicinesRoute = Route$1.update({
	id: "/medicines",
	path: "/medicines",
	getParentRoute: () => AdminDashboardRoute
});
var AdminDashboardOrdersIndexRoute = Route.update({
	id: "/orders/",
	path: "/orders/",
	getParentRoute: () => AdminDashboardRoute
});
var AdminDashboardPrescriptionsIdRoute = Route$18.update({
	id: "/$id",
	path: "/$id",
	getParentRoute: () => AdminDashboardPrescriptionsRoute
});
var AdminDashboardOrdersIdRoute = Route$17.update({
	id: "/orders/$id",
	path: "/orders/$id",
	getParentRoute: () => AdminDashboardRoute
});
var AdminDashboardPrescriptionsRouteChildren = { AdminDashboardPrescriptionsIdRoute };
var AdminDashboardRouteChildren = {
	AdminDashboardMedicinesRoute,
	AdminDashboardPrescriptionsRoute: AdminDashboardPrescriptionsRoute._addFileChildren(AdminDashboardPrescriptionsRouteChildren),
	AdminDashboardUsersRoute,
	AdminDashboardOrdersIdRoute,
	AdminDashboardOrdersIndexRoute
};
var AdminRouteChildren = {
	AdminDashboardRoute: AdminDashboardRoute._addFileChildren(AdminDashboardRouteChildren),
	AdminIndexRoute
};
var rootRouteChildren = {
	IndexRoute,
	AboutRoute,
	AdminRoute: AdminRoute._addFileChildren(AdminRouteChildren),
	CartRoute,
	ContactRoute,
	LoginRoute,
	OurProductsRoute,
	RegisterRoute,
	ShopRoute,
	TrackRoute,
	CheckoutAddressRoute,
	CheckoutPaymentRoute,
	CheckoutPrescriptionRoute,
	OrderIdRoute,
	ProductIdRoute
};
var routeTree = Route$14._addFileChildren(rootRouteChildren)._addFileTypes();
var getRouter = () => {
	return createRouter({
		routeTree,
		context: { queryClient: new QueryClient() },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { getRouter };
