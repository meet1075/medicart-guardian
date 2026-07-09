import { createFileRoute, Link } from "@tanstack/react-router";
import { useStore } from "@/lib/store";
import { useOrders } from "@/hooks/use-orders";
import { useMemo, useState } from "react";
import { StatusPill } from "./admin.dashboard";
import { FileText } from "lucide-react";

export const Route = createFileRoute("/admin/dashboard/orders")({
  component: OrdersPage,
});

type Filter = "all" | "rx" | "otc" | "pending" | "verified" | "rejected";

function OrdersPage() {
  const { orders, updateOrderStatus, isUpdating } = useOrders();
  const [filter, setFilter] = useState<Filter>("all");
  const [q, setQ] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      if (filter === "rx" && !o.hasRx) return false;
      if (filter === "otc" && o.hasRx) return false;
      if (filter === "pending" && !(o.hasRx && o.prescriptionStatus === "pending")) return false;
      if (filter === "verified" && o.prescriptionStatus !== "verified") return false;
      if (filter === "rejected" && o.prescriptionStatus !== "rejected") return false;
      if (q) {
        const nq = q.toLowerCase();
        if (!o.id.toLowerCase().includes(nq) && !o.address.fullName.toLowerCase().includes(nq)) {
          return false;
        }
      }
      return true;
    });
  }, [orders, filter, q]);

  const open = orders.find((o) => o.id === openId);

  return (
    <div>
      <h1 className="text-2xl font-bold">Orders</h1>
      <p className="mt-1 text-sm text-muted-foreground">{filtered.length} orders</p>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {([
            ["all", "All"],
            ["rx", "Rx orders"],
            ["otc", "OTC orders"],
            ["pending", "Pending verification"],
            ["verified", "Verified"],
            ["rejected", "Rejected"],
          ] as [Filter, string][]).map(([k, label]) => (
            <button
              key={k}
              type="button"
              onClick={() => setFilter(k)}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                filter === k
                  ? "bg-primary text-primary-foreground"
                  : "bg-surface text-foreground/70 border border-border"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search customer or order #"
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary sm:w-64"
        />
      </div>

      <div className="mt-4 overflow-x-auto rounded-xl border border-border bg-surface">
        <table className="w-full text-sm">
          <thead className="bg-surface-muted text-left text-xs uppercase tracking-wider text-muted-foreground">
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
                onClick={() => setOpenId(o.id)}
                className="cursor-pointer hover:bg-surface-muted/60"
              >
                <td className="px-4 py-3 font-mono text-xs font-bold">{o.id}</td>
                <td className="px-4 py-3 text-muted-foreground">
                  {new Date(o.createdAt).toLocaleString()}
                </td>
                <td className="px-4 py-3 font-semibold">{o.address.fullName}</td>
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
                  {o.hasRx ? <StatusPill status={o.status} rx={o.prescriptionStatus as any} /> : <span className="text-xs text-muted-foreground">—</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {open && (
        <div
          className="fixed inset-0 z-40 flex justify-end bg-foreground/40"
          onClick={() => setOpenId(null)}
        >
          <div
            className="h-full w-full max-w-lg overflow-auto bg-surface p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="font-mono text-sm font-bold">{open.id}</div>
                <div className="text-xs text-muted-foreground">
                  {new Date(open.createdAt).toLocaleString()}
                </div>
              </div>
              <button
                type="button"
                className="text-sm text-muted-foreground"
                onClick={() => setOpenId(null)}
              >
                Close
              </button>
            </div>

            <div className="mt-5">
              <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Customer
              </div>
              <div className="mt-1 font-semibold">{open.address.fullName}</div>
              <div className="text-sm text-muted-foreground">
                {open.address.line1}
                {open.address.line2 ? `, ${open.address.line2}` : ""}, {open.address.city}, {open.address.state} — {open.address.pincode}
              </div>
              <div className="text-xs text-muted-foreground">{open.address.phone}</div>
            </div>

            <div className="mt-5">
              <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Items
              </div>
              <div className="mt-2 divide-y divide-border rounded-lg border border-border">
                {open.items.map((i) => (
                  <div key={i.medicineId} className="flex justify-between px-3 py-2 text-sm">
                    <div>
                      <div className="font-semibold">{i.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {i.salt} · Qty {i.qty}
                        {i.prescriptionRequired && " · Rx"}
                      </div>
                    </div>
                    <div className="font-semibold">₹{(i.price * i.qty).toFixed(2)}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div>
                <div className="text-xs uppercase text-muted-foreground">Payment</div>
                <div className="font-semibold">{open.paymentMethod.toUpperCase()}</div>
              </div>
              <div>
                <div className="text-xs uppercase text-muted-foreground">Total</div>
                <div className="font-bold">₹{open.total.toFixed(2)}</div>
              </div>
            </div>

            {open.hasRx && (
              <Link
                to="/admin/dashboard/prescriptions/$id"
                params={{ id: open.id }}
                className="mt-6 inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
              >
                <FileText size={16} /> Open prescription review
              </Link>
            )}

            <div className="mt-8 border-t border-border pt-6">
              <div className="text-sm font-bold">Update Tracking Status</div>
              <p className="mt-1 text-xs text-muted-foreground">
                Move the order through the fulfillment pipeline.
              </p>
              <div className="mt-3 flex gap-2">
                <select
                  value={open.status}
                  onChange={(e) => updateOrderStatus({ orderId: open.id, status: e.target.value })}
                  disabled={isUpdating}
                  className="rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary disabled:opacity-50"
                >
                  <option value="placed">Placed</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="action_needed" disabled>Action Needed (via Rx)</option>
                </select>
                {isUpdating && <div className="animate-pulse text-xs text-primary self-center">Updating...</div>}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
