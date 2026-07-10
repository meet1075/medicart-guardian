/* eslint-disable @typescript-eslint/no-explicit-any */
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useOrders } from "@/hooks/use-orders";
import { useMemo, useState } from "react";
import { StatusPill } from "./admin.dashboard";

export const Route = createFileRoute("/admin/dashboard/orders/")({
  component: OrdersPage,
});

type Filter = "all" | "rx" | "otc" | "pending" | "verified" | "rejected";
type DateFilter = "all" | "today" | "week" | "month";

function OrdersPage() {
  const { orders } = useOrders();
  const navigate = useNavigate();
  const [filter, setFilter] = useState<Filter>("all");
  const [dateFilter, setDateFilter] = useState<DateFilter>("all");
  const [q, setQ] = useState("");
  const [medicineQ, setMedicineQ] = useState("");

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      if (filter === "rx" && !o.hasRx) return false;
      if (filter === "otc" && o.hasRx) return false;
      if (filter === "pending" && !(o.hasRx && o.prescriptionStatus === "pending")) return false;
      if (filter === "verified" && o.prescriptionStatus !== "verified") return false;
      if (filter === "rejected" && o.prescriptionStatus !== "rejected") return false;

      if (dateFilter !== "all") {
        const d = new Date(o.createdAt).getTime();
        const now = Date.now();
        const day = 24 * 60 * 60 * 1000;
        if (dateFilter === "today" && now - d > day) return false;
        if (dateFilter === "week" && now - d > 7 * day) return false;
        if (dateFilter === "month" && now - d > 30 * day) return false;
      }

      if (medicineQ) {
        const mq = medicineQ.toLowerCase();
        const hasMed = o.items.some(
          (i: any) => i.name.toLowerCase().includes(mq) || (i.salt && i.salt.toLowerCase().includes(mq)),
        );
        if (!hasMed) return false;
      }

      if (q) {
        const nq = q.toLowerCase();
        const customerName = o.address.fullName.toLowerCase();
        const userEmail = (o.user?.email ?? "").toLowerCase();
        const userName = (o.user?.name ?? "").toLowerCase();
        if (!o.id.toLowerCase().includes(nq) && !customerName.includes(nq) && !userEmail.includes(nq) && !userName.includes(nq)) {
          return false;
        }
      }
      return true;
    });
  }, [orders, filter, q, dateFilter, medicineQ]);

  return (
    <div className="flex h-full flex-col pb-6">
      <div className="shrink-0 pb-4">
        <h1 className="text-2xl font-bold">Orders</h1>
        <p className="mt-1 text-sm text-muted-foreground">{filtered.length} orders</p>

        <div className="mt-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            {(
              [
                ["all", "All"],
                ["rx", "Rx orders"],
                ["otc", "OTC orders"],
                ["pending", "Pending verification"],
                ["verified", "Verified"],
                ["rejected", "Rejected"],
              ] as [Filter, string][]
            ).map(([k, label]) => (
              <button
                key={k}
                type="button"
                onClick={() => setFilter(k)}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                  filter === k
                    ? "bg-primary text-primary-foreground"
                    : "border border-border bg-surface text-foreground/70 hover:bg-surface-muted"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value as DateFilter)}
              className="rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary transition-colors"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">Last 7 Days</option>
              <option value="month">This Month</option>
            </select>
          </div>
        </div>

        <div className="mt-3 flex flex-col gap-3 sm:flex-row">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search customer or order #"
            className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary transition-colors"
          />
          <input
            value={medicineQ}
            onChange={(e) => setMedicineQ(e.target.value)}
            placeholder="Filter by medicine name..."
            className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary transition-colors"
          />
        </div>
      </div>

      <div className="flex-1 min-h-0 rounded-xl border border-border bg-surface overflow-y-auto">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-surface-muted text-left text-xs uppercase tracking-wider text-muted-foreground z-10 border-b border-border shadow-sm">
            <tr>
              <th className="px-4 py-3">Order #</th>
              <th className="px-4 py-3">Placed</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Items</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Delivery</th>
              <th className="px-4 py-3">Rx status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.length === 0 && (
              <tr>
                <td colSpan={9} className="p-10 text-center text-sm text-muted-foreground">
                  No orders match this filter.
                </td>
              </tr>
            )}
            {filtered.map((o) => (
              <tr
                key={o.id}
                onClick={() =>
                  navigate({ to: "/admin/dashboard/orders/$id", params: { id: o.id } })
                }
                className="cursor-pointer transition-colors hover:bg-surface-muted/60"
              >
                <td className="px-4 py-3 font-mono text-xs font-bold text-primary hover:underline">
                  {o.id}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {new Date(o.createdAt).toLocaleString()}
                </td>
                <td className="px-4 py-3">
                  <div className="font-semibold">{o.user?.name || o.address.fullName}</div>
                  {o.user?.email && (
                    <div className="text-xs text-muted-foreground">{o.user.email}</div>
                  )}
                </td>
                <td className="px-4 py-3 text-muted-foreground">{o.address.phone}</td>
                <td className="px-4 py-3">{o.items.length}</td>
                <td className="px-4 py-3">
                  {o.hasRx ? (
                    <span className="rounded-full bg-warning/15 px-2 py-0.5 text-[11px] font-semibold text-warning-foreground">
                      Rx
                    </span>
                  ) : (
                    <span className="rounded-full bg-success/15 px-2 py-0.5 text-[11px] font-semibold text-success">
                      OTC
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 font-semibold">₹{o.total.toFixed(2)}</td>
                <td className="px-4 py-3 text-xs uppercase text-muted-foreground">
                  {o.status.replace("_", " ")}
                </td>
                <td className="px-4 py-3">
                  {o.hasRx ? (
                    <StatusPill status={o.status} rx={o.prescriptionStatus as any} />
                  ) : (
                    <span className="text-xs text-muted-foreground">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
