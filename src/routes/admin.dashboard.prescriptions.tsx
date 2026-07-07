import { createFileRoute, Link } from "@tanstack/react-router";
import { useStore } from "@/lib/store";
import { useMemo } from "react";
import { StatusPill } from "./admin.dashboard";

export const Route = createFileRoute("/admin/dashboard/prescriptions")({
  component: PrescriptionsListPage,
});

function PrescriptionsListPage() {
  const { orders } = useStore();
  const rxOrders = useMemo(() => {
    return orders
      .filter((o) => o.hasRx)
      .sort((a, b) => {
        const pa = a.prescriptionStatus === "pending" ? 0 : 1;
        const pb = b.prescriptionStatus === "pending" ? 0 : 1;
        if (pa !== pb) return pa - pb;
        return b.createdAt - a.createdAt;
      });
  }, [orders]);

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
                <td className="px-4 py-3 font-mono text-xs font-bold">{o.id}</td>
                <td className="px-4 py-3 font-semibold">{o.address.fullName}</td>
                <td className="px-4 py-3 text-muted-foreground">
                  {new Date(o.createdAt).toLocaleString()}
                </td>
                <td className="px-4 py-3">{o.prescriptionFiles.length}</td>
                <td className="px-4 py-3">
                  <StatusPill status={o.status} rx={o.prescriptionStatus} />
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
