import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { T as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as useAuth } from "./use-auth-C8ldQVR_.mjs";
import { _ as useNavigate, g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { A as Lock, L as HeartPulse, O as Mail } from "../_libs/lucide-react.mjs";
import { t as PublicLayout } from "./PublicLayout-B2Lc81uq.mjs";
import { t as Route } from "./login-C1h3gG1O.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/login-fJJbgfBC.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function LoginPage() {
	const { login, isLoggingIn, loginWithGoogle } = useAuth();
	const navigate = useNavigate();
	const { redirect } = Route.useSearch();
	const redirectUrl = redirect || "/";
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	async function handleSubmit(e) {
		e.preventDefault();
		try {
			await login({
				email,
				password
			});
			toast.success("Welcome back!");
			navigate({ to: redirectUrl });
		} catch (error) {
			toast.error(error.message || "Failed to login");
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PublicLayout, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "container-page flex min-h-[70vh] items-center justify-center py-12",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-md rounded-2xl border border-border bg-surface p-8 shadow-xl",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex justify-center",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeartPulse, { size: 24 })
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-6 text-center text-2xl font-bold text-foreground",
					children: "Welcome back"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-center text-sm text-muted-foreground",
					children: "Log in to manage your orders and prescriptions."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: handleSubmit,
					className: "mt-8 space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
							children: "Email Address"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative mt-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, {
								size: 16,
								className: "absolute left-3 top-3 text-muted-foreground"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "email",
								required: true,
								value: email,
								onChange: (e) => setEmail(e.target.value),
								className: "w-full rounded-md border border-input bg-background py-2.5 pl-10 pr-3 text-sm outline-none focus:border-primary",
								placeholder: "you@example.com"
							})]
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-muted-foreground",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", { children: "Password" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative mt-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, {
								size: 16,
								className: "absolute left-3 top-3 text-muted-foreground"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "password",
								required: true,
								value: password,
								onChange: (e) => setPassword(e.target.value),
								className: "w-full rounded-md border border-input bg-background py-2.5 pl-10 pr-3 text-sm outline-none focus:border-primary",
								placeholder: "••••••••"
							})]
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "submit",
							disabled: isLoggingIn,
							className: "mt-2 w-full rounded-md bg-primary py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50",
							children: isLoggingIn ? "Logging in..." : "Log in"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative mt-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "absolute inset-0 flex items-center",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-full border-t border-border" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "relative flex justify-center text-xs",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "bg-surface px-2 text-muted-foreground uppercase tracking-wider font-semibold",
							children: "Or continue with"
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: async () => {
						try {
							await loginWithGoogle(redirectUrl);
						} catch (error) {
							toast.error(error.message || "Failed to login with Google");
						}
					},
					className: "mt-6 flex w-full items-center justify-center gap-3 rounded-md border border-border bg-background py-2.5 text-sm font-semibold hover:bg-surface-muted transition-colors",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
						viewBox: "0 0 24 24",
						className: "h-5 w-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
								d: "M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z",
								fill: "#4285F4"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
								d: "M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z",
								fill: "#34A853"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
								d: "M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z",
								fill: "#FBBC05"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
								d: "M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z",
								fill: "#EA4335"
							})
						]
					}), "Google"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-8 text-center text-sm text-muted-foreground",
					children: [
						"Don't have an account?",
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/register",
							search: { redirect: redirectUrl },
							className: "font-semibold text-primary hover:underline",
							children: "Sign up"
						})
					]
				})
			]
		})
	}) });
}
//#endregion
export { LoginPage as component };
