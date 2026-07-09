import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { useStore } from "@/lib/store";
import { useOrders } from "@/hooks/use-orders";
import { useMemo } from "react";
import { StatusPill } from "./admin.dashboard";

export const Route = createFileRoute("/admin/dashboard/prescriptions")({
  component: PrescriptionsLayout,
});

function PrescriptionsLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isIndex =
    pathname === "/admin/dashboard/prescriptions" ||
    pathname === "/admin/dashboard/prescriptions/";

  return isIndex ? <PrescriptionsListPage /> : <Outlet />;
}

function PrescriptionsListPage() {
  const { storeHydrated } = useStore();
  const { orders } = useOrders();
  const rxOrders = useMemo(() => {
    return orders
      .filter((o) => o.hasRx)
      .sort((a, b) => {
        const pa = a.prescriptionStatus === "pending" ? 0 : 1;
        const pb = b.prescriptionStatus === "pending" ? 0 : 1;
        if (pa !== pb) return pa - pb;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [orders]);

  if (!storeHydrated) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-8 w-48 rounded bg-border" />
        <div className="mt-5 h-64 rounded-xl bg-surface border border-border" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">Prescriptions</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Pending reviews shown first, most recent next.
      </p>

      <div className="mt-5 overflow-x-auto rounded-xl border border-border bg-surface">
        <table className="w-full text-sm">
          <thead className="bg-surface-muted text-left text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Order #</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Uploaded</th>
              <th className="px-4 py-3">Files</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Reviewed by</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rxOrders.length === 0 && (
              <tr>
                <td colSpan={7} className="p-10 text-center text-sm text-muted-foreground">
                  No prescriptions yet. Place a test Rx order to see it appear live.
                </td>
              </tr>
            )}
            {rxOrders.map((o) => (
              <tr key={o.id} className="hover:bg-surface-muted/60">
                <td className="px-4 py-3">{o.id}</td>
                <td className="px-4 py-3 font-medium">
                  {o.address?.fullName || "Guest"}
                </td>
                <td className="px-4 py-3">
                  {new Date(o.createdAt).toLocaleDateString("en-IN", {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </td>
                <td className="px-4 py-3">{o.prescriptionFiles.length}</td>
                <td className="px-4 py-3">
                  <StatusPill status={o.status} rx={o.prescriptionStatus as any} />
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground">
                  {o.reviewedBy ?? "—"}
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    to="/admin/dashboard/prescriptions/$id"
                    params={{ id: o.id }}
                    className="rounded-md border border-primary px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary hover:text-primary-foreground"
                  >
                    Review
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
