import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { T as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { K as object, Y as string } from "../_libs/@better-auth/core+[...].mjs";
import { t as useAuth } from "./use-auth-C8ldQVR_.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { g as ShieldAlert, m as Shield, r as User } from "../_libs/lucide-react.mjs";
import { c as createServerFn } from "./esm-B50dUWcE.mjs";
import { t as createSsrRpc } from "./createSsrRpc-Dlr6sAwK.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.dashboard.users--nEm-ncy.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var getUsersFn = createServerFn({ method: "GET" }).handler(createSsrRpc("f24f20ce9df5ac7d76933babae8293b89929eeff50c46da620e01993809575c6"));
var updateUserRoleFn = createServerFn({ method: "POST" }).validator(object({
	id: string(),
	role: string()
})).handler(createSsrRpc("966ba1498e4a33b60fc5134952749c3dfeb070d42121ad82f67bd5a05afafe99"));
function useUsers() {
	const queryClient = useQueryClient();
	const usersQuery = useQuery({
		queryKey: ["users"],
		queryFn: async () => {
			const res = await getUsersFn();
			if (res.status === "error") throw new Error(res.message);
			return res.data;
		},
		staleTime: 300 * 1e3
	});
	const updateUserRoleMutation = useMutation({
		mutationFn: async (args) => {
			const res = await updateUserRoleFn({ data: args });
			if (res.status === "error") throw new Error(res.message);
			return res.data;
		},
		onSuccess: (updatedUser) => {
			queryClient.setQueryData(["users"], (old) => {
				if (!old) return old;
				return old.map((u) => u.id === updatedUser.id ? updatedUser : u);
			});
			queryClient.invalidateQueries({ queryKey: ["users"] });
		}
	});
	return {
		users: usersQuery.data ?? [],
		isLoading: usersQuery.isLoading && !usersQuery.data,
		isError: usersQuery.isError,
		updateUserRole: updateUserRoleMutation.mutateAsync,
		isUpdating: updateUserRoleMutation.isPending
	};
}
function UsersPage() {
	const { users, isLoading, updateUserRole } = useUsers();
	const { user: currentUser } = useAuth();
	const [q, setQ] = (0, import_react.useState)("");
	const filtered = (0, import_react.useMemo)(() => {
		if (!q) return users;
		const search = q.toLowerCase();
		return users.filter((u) => u.name.toLowerCase().includes(search) || u.email.toLowerCase().includes(search) || u.id.toLowerCase().includes(search));
	}, [users, q]);
	async function handleRoleChange(userId, currentRole) {
		if (userId === currentUser?.id) {
			toast.error("You cannot change your own role.");
			return;
		}
		const newRole = currentRole === "ADMIN" ? "USER" : "ADMIN";
		if (newRole === "USER") {
			if (!confirm("Are you sure you want to revoke Admin access for this user?")) return;
		}
		try {
			await updateUserRole({
				id: userId,
				role: newRole
			});
			toast.success(`User role updated to ${newRole}`);
		} catch (err) {
			toast.error(err.message || "Failed to update role");
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-full flex-col pb-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "shrink-0 pb-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-2xl font-bold",
					children: "User Management"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-1 text-sm text-muted-foreground",
					children: [filtered.length, " total users"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-5 flex flex-col gap-3 sm:flex-row",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: q,
						onChange: (e) => setQ(e.target.value),
						placeholder: "Search by name, email, or ID...",
						className: "flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary transition-colors"
					})
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex-1 min-h-0 rounded-xl border border-border bg-surface overflow-y-auto",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
				className: "w-full text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
					className: "sticky top-0 bg-surface-muted text-left text-xs uppercase tracking-wider text-muted-foreground z-10 border-b border-border shadow-sm",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-3",
							children: "User Details"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-3",
							children: "User ID"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-3",
							children: "Joined"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-3",
							children: "Role"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-3 text-right",
							children: "Actions"
						})
					] })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", {
					className: "divide-y divide-border",
					children: [
						isLoading && users.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							colSpan: 5,
							className: "p-10 text-center text-sm text-muted-foreground animate-pulse",
							children: "Loading users..."
						}) }),
						!isLoading && filtered.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							colSpan: 5,
							className: "p-10 text-center text-sm text-muted-foreground",
							children: "No users match this filter."
						}) }),
						filtered.map((u) => {
							const isSelf = u.id === currentUser?.id;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "transition-colors hover:bg-surface-muted/60",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
										className: "px-4 py-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "font-semibold text-foreground flex items-center gap-2",
											children: [u.name, isSelf && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded font-bold uppercase tracking-wider",
												children: "You"
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-xs text-muted-foreground mt-0.5",
											children: u.email
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-3 font-mono text-xs text-muted-foreground",
										children: u.id
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-3 text-muted-foreground text-xs",
										children: new Date(u.createdAt).toLocaleDateString()
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-3",
										children: u.role === "ADMIN" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shield, { size: 14 }), " Admin"]
										}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "inline-flex items-center gap-1.5 rounded-full border border-border px-2.5 py-1 text-xs font-semibold text-muted-foreground",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { size: 14 }), " User"]
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-3 text-right",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											onClick: () => handleRoleChange(u.id, u.role),
											disabled: isSelf,
											className: `inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${isSelf ? "opacity-50 cursor-not-allowed bg-surface-muted text-muted-foreground" : u.role === "ADMIN" ? "border border-destructive text-destructive hover:bg-destructive/10" : "bg-primary text-primary-foreground hover:bg-primary/90"}`,
											children: u.role === "ADMIN" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { size: 14 }), " Revoke Admin"] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shield, { size: 14 }), " Make Admin"] })
										})
									})
								]
							}, u.id);
						})
					]
				})]
			})
		})]
	});
}
//#endregion
export { UsersPage as component };
