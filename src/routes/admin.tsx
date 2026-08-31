import { createFileRoute, Outlet, Link, useNavigate, redirect } from "@tanstack/react-router";
import { useAuth } from "@/hooks/use-auth";
import { LayoutDashboard, Package, FileText, LogOut, Cross, Users, Image as ImageIcon } from "lucide-react";
import { useEffect } from "react";
import { checkIsAdminFn } from "@/api/admin";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [{ title: "Obat Medicare — Admin" }, { name: "robots", content: "noindex" }],
  }),
  beforeLoad: async () => {
    const { isAdmin } = await checkIsAdminFn();
    if (!isAdmin) throw redirect({ to: "/login", replace: true });
  },
  component: AdminLayout,
});

function AdminLayout() {
  return <Outlet />;
}

export function AdminChrome({ children, active }: { children: React.ReactNode; active: string }) {
  const { user, logout, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "ADMIN")) {
      navigate({ to: "/login", replace: true });
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-surface-muted">
        <div className="animate-pulse text-sm text-muted-foreground">Loading dashboard…</div>
      </div>
    );
  }

  if (!user || user.role !== "ADMIN") return null;

  const items = [
    { key: "overview", label: "Overview", icon: LayoutDashboard, to: "/admin/dashboard" as const },
    { key: "orders", label: "Orders", icon: Package, to: "/admin/dashboard/orders" as const },
    { key: "prescriptions", label: "Prescriptions", icon: FileText, to: "/admin/dashboard/prescriptions" as const },
    { key: "medicines", label: "Medicines", icon: Package, to: "/admin/dashboard/medicines" as const },
    { key: "users", label: "Users", icon: Users, to: "/admin/dashboard/users" as const },
    { key: "bulk-images", label: "Bulk Images", icon: ImageIcon, to: "/admin/dashboard/bulk-images" as const },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-surface-muted">
      <aside className="hidden w-64 flex-col border-r border-border bg-surface p-5 md:flex">
        <Link to="/admin/dashboard" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Cross size={16} strokeWidth={2.5} />
          </div>
          <div>
            <div className="text-sm font-bold">MediCart</div>
            <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Admin Console
            </div>
          </div>
        </Link>

        <nav className="mt-8 flex-1 space-y-1">
          {items.map((i) => {
            const Icon = i.icon;
            const isActive = i.key === active;
            return (
              <Link
                key={i.key}
                to={i.to}
                className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium ${
                  isActive
                    ? "bg-primary-soft text-primary"
                    : "text-foreground/70 hover:bg-surface-muted hover:text-foreground"
                }`}
              >
                <Icon size={16} /> {i.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-border pt-4">
          <div className="text-xs text-muted-foreground">Signed in as</div>
          <div className="truncate text-sm font-semibold">{user.email}</div>
          <button
            type="button"
            onClick={async () => {
              await logout();
              navigate({ to: "/" });
            }}
            className="mt-3 inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-destructive"
          >
            <LogOut size={12} /> Sign out
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <div className="border-b border-border bg-surface px-6 py-3 md:hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Cross size={16} strokeWidth={2.5} />
              </div>
              <span className="font-bold">MediCart Admin</span>
            </div>
            <button
              type="button"
              onClick={async () => {
                await logout();
                navigate({ to: "/" });
              }}
              className="text-xs text-muted-foreground"
            >
              Sign out
            </button>
          </div>
          <nav className="mt-3 flex gap-2 overflow-x-auto">
            {items.map((i) => (
              <Link
                key={i.key}
                to={i.to}
                className={`whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold ${
                  i.key === active
                    ? "bg-primary text-primary-foreground"
                    : "bg-surface-muted text-foreground/70"
                }`}
              >
                {i.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex-1 overflow-y-auto p-6 relative">{children}</div>
      </div>
    </div>
  );
}
