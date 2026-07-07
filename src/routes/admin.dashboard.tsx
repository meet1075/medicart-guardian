import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { AdminChrome } from "./admin";
import { useStore } from "@/lib/store";
import { useMemo } from "react";
import { Clock, CheckCircle2, XCircle, ShoppingBag } from "lucide-react";

export const Route = createFileRoute("/admin/dashboard")({
  component: DashboardLayout,
});

function DashboardLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const activeKey = pathname.startsWith("/admin/dashboard/orders")
    ? "orders"
    : pathname.startsWith("/admin/dashboard/prescriptions")
    ? "prescriptions"
    : "overview";
  const isIndex = pathname === "/admin/dashboard" || pathname === "/admin/dashboard/";

  return (
    <AdminChrome active={activeKey}>
      {isIndex ? <Overview /> : <Outlet />}
    </AdminChrome>
  );
}

function Overview() {
  const { orders } = useStore();

  const stats = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayMs = today.getTime();

    const isToday = (n: number) => n >= todayMs;

    return {
      today: orders.filter((o) => isToday(o.createdAt)).length,
      pending: orders.filter((o) => o.hasRx && o.prescriptionStatus === "pending").length,
      approved: orders.filter(
        (o) => o.prescriptionStatus === "verified" && o.reviewedAt && isToday(o.reviewedAt),
      ).length,
      rejected: orders.filter(
        (o) => o.prescriptionStatus === "rejected" && o.reviewedAt && isToday(o.reviewedAt),
      ).length,
    };
  }, [orders]);

  const recent = orders.slice(0, 6);

  return (
    <div>
      <h1 className="text-2xl font-bold">Overview</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Snapshot of today's orders and prescription workload.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Orders today" value={stats.today} icon={<ShoppingBag size={18} />} />
        <StatCard label="Pending Rx reviews" value={stats.pending} icon={<Clock size={18} />} tone="warning" />
        <StatCard label="Approved today" value={stats.approved} icon={<CheckCircle2 size={18} />} tone="success" />
        <StatCard label="Rejected today" value={stats.rejected} icon={<XCircle size={18} />} tone="destructive" />
      </div>

      <section className="mt-8">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Recent orders</h2>
          <Link to="/admin/dashboard/orders" className="text-sm font-semibold text-primary hover:underline">
            View all
          </Link>
        </div>
        <div className="mt-4 overflow-hidden rounded-xl border border-border bg-surface">
          {recent.length === 0 ? (
            <div className="p-8 text-center text-sm text-muted-foreground">
              No orders yet. Place a test order from the storefront to see it appear here live.
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-surface-muted text-left text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">Order</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Placed</th>
                  <th className="px-4 py-3">Total</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {recent.map((o) => (
                  <tr key={o.id} className="hover:bg-surface-muted/60">
                    <td className="px-4 py-3 font-mono text-xs font-bold">{o.id}</td>
                    <td className="px-4 py-3">{o.address.fullName}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {new Date(o.createdAt).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 font-semibold">₹{o.total.toFixed(2)}</td>
                    <td className="px-4 py-3">
                      <StatusPill status={o.status} rx={o.prescriptionStatus} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
  tone,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  tone?: "warning" | "success" | "destructive";
}) {
  const toneBg =
    tone === "warning"
      ? "bg-warning/15 text-warning-foreground"
      : tone === "success"
      ? "bg-success/15 text-success"
      : tone === "destructive"
      ? "bg-destructive/15 text-destructive"
      : "bg-primary-soft text-primary";
  return (
    <div className="rounded-xl border border-border bg-surface p-5">
      <div className={`inline-flex h-9 w-9 items-center justify-center rounded-lg ${toneBg}`}>
        {icon}
      </div>
      <div className="mt-3 text-3xl font-bold">{value}</div>
      <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
    </div>
  );
}

export function StatusPill({
  status,
  rx,
}: {
  status: string;
  rx?: "pending" | "verified" | "rejected";
}) {
  if (rx === "pending")
    return (
      <span className="rounded-full bg-warning/15 px-2 py-0.5 text-[11px] font-semibold text-warning-foreground">
        Pending review
      </span>
    );
  if (rx === "rejected")
    return (
      <span className="rounded-full bg-destructive/15 px-2 py-0.5 text-[11px] font-semibold text-destructive">
        Rejected
      </span>
    );
  if (rx === "verified")
    return (
      <span className="rounded-full bg-success/15 px-2 py-0.5 text-[11px] font-semibold text-success">
        Verified
      </span>
    );
  return (
    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary">
      {status.replace("_", " ")}
    </span>
  );
}
