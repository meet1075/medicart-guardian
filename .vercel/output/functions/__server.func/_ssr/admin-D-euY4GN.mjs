import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { T as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as useAuth } from "./use-auth-C8ldQVR_.mjs";
import { _ as useNavigate, f as Outlet, g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { C as Package, N as LayoutDashboard, V as FileText, W as Cross, k as LogOut, n as Users } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-D-euY4GN.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AdminLayout() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {});
}
function AdminChrome({ children, active }) {
	const { user, logout, isLoading } = useAuth();
	const navigate = useNavigate();
	(0, import_react.useEffect)(() => {
		if (!isLoading && (!user || user.role !== "ADMIN")) navigate({
			to: "/login",
			replace: true
		});
	}, [
		user,
		isLoading,
		navigate
	]);
	if (isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex h-screen items-center justify-center bg-surface-muted",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "animate-pulse text-sm text-muted-foreground",
			children: "Loading dashboard…"
		})
	});
	if (!user || user.role !== "ADMIN") return null;
	const items = [
		{
			key: "overview",
			label: "Overview",
			icon: LayoutDashboard,
			to: "/admin/dashboard"
		},
		{
			key: "orders",
			label: "Orders",
			icon: Package,
			to: "/admin/dashboard/orders"
		},
		{
			key: "prescriptions",
			label: "Prescriptions",
			icon: FileText,
			to: "/admin/dashboard/prescriptions"
		},
		{
			key: "medicines",
			label: "Medicines",
			icon: Package,
			to: "/admin/dashboard/medicines"
		},
		{
			key: "users",
			label: "Users",
			icon: Users,
			to: "/admin/dashboard/users"
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-screen overflow-hidden bg-surface-muted",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
			className: "hidden w-64 flex-col border-r border-border bg-surface p-5 md:flex",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/admin/dashboard",
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cross, {
							size: 16,
							strokeWidth: 2.5
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-sm font-bold",
						children: "MediCart"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-[10px] font-semibold uppercase tracking-wider text-muted-foreground",
						children: "Admin Console"
					})] })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
					className: "mt-8 flex-1 space-y-1",
					children: items.map((i) => {
						const Icon = i.icon;
						const isActive = i.key === active;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: i.to,
							className: `flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium ${isActive ? "bg-primary-soft text-primary" : "text-foreground/70 hover:bg-surface-muted hover:text-foreground"}`,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { size: 16 }),
								" ",
								i.label
							]
						}, i.key);
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "border-t border-border pt-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs text-muted-foreground",
							children: "Signed in as"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "truncate text-sm font-semibold",
							children: user.email
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: async () => {
								await logout();
								navigate({ to: "/" });
							},
							className: "mt-3 inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-destructive",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { size: 12 }), " Sign out"]
						})
					]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex-1 flex flex-col h-screen overflow-hidden",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "border-b border-border bg-surface px-6 py-3 md:hidden",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cross, {
								size: 16,
								strokeWidth: 2.5
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-bold",
							children: "MediCart Admin"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: async () => {
							await logout();
							navigate({ to: "/" });
						},
						className: "text-xs text-muted-foreground",
						children: "Sign out"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
					className: "mt-3 flex gap-2 overflow-x-auto",
					children: items.map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: i.to,
						className: `whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold ${i.key === active ? "bg-primary text-primary-foreground" : "bg-surface-muted text-foreground/70"}`,
						children: i.label
					}, i.key))
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex-1 overflow-y-auto p-6 relative",
				children
			})]
		})]
	});
}
//#endregion
export { AdminChrome, AdminLayout as component };
