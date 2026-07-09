import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { PublicLayout } from "@/components/PublicLayout";
import { useOrder, type FullOrder } from "@/hooks/use-orders";
import type { OrderStatus } from "@/lib/types";
import { AlertTriangle, CheckCircle2, Clock, Package, Truck, Home, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/order/$id")({
  head: () => ({
    meta: [{ title: "Order details — MediCart" }, { name: "robots", content: "noindex" }],
  }),
  component: OrderPage,
});

function OrderPage() {
  const { id } = Route.useParams();
  const { data: order, isLoading } = useOrder(id);

  if (isLoading) {
    return (
      <PublicLayout>
        <div className="container-page py-16 text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="mt-4 text-sm text-muted-foreground">Loading order details...</p>
        </div>
      </PublicLayout>
    );
  }

  if (!order) {
    return (
      <PublicLayout>
        <div className="container-page py-16 text-center">
          <h1 className="text-2xl font-bold">Order not found</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            We couldn't find order {id}. It may have been placed in a different browser.
          </p>
          <Link
            to="/"
            className="mt-6 inline-flex items-center rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
          >
            Back to home
          </Link>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <div className="container-page py-8">
        <ConfirmationBanner order={order} />

        <div className="mt-8 grid gap-8 lg:grid-cols-[1.4fr_1fr]">
          <div className="space-y-6">
            <Timeline order={order} />

            {order.prescriptionStatus === "rejected" && (
              <div className="rounded-xl border border-destructive/40 bg-destructive/10 p-5">
                <div className="flex items-start gap-3">
                  <AlertTriangle size={20} className="mt-0.5 text-destructive" />
                  <div>
                    <div className="font-semibold text-foreground">Prescription needs attention</div>
                    <p className="mt-1 text-sm text-foreground/80">
                      {order.rejectReason ||
                        "Our pharmacist couldn't verify your prescription. Please re-upload a clearer image or contact support."}
                    </p>
                    <p className="mt-2 text-xs text-muted-foreground">
                      To re-upload, please contact support with your order number ({order.id}).
                    </p>
                  </div>
                </div>
              </div>
            )}

            <section className="rounded-xl border border-border bg-surface p-5">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Items ({order.items.length})
              </h2>
              <div className="mt-3 divide-y divide-border">
                {order.items.map((i) => (
                  <div key={i.medicineId} className="flex justify-between py-3 text-sm">
                    <div>
                      <div className="font-semibold">{i.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {i.salt} · {i.dosageForm} · Qty {i.qty}
                      </div>
                    </div>
                    <div className="font-semibold">₹{(i.price * i.qty).toFixed(2)}</div>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-xl border border-border bg-surface p-5 text-sm">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Delivery
              </h2>
              <div className="mt-2 font-semibold">{order.address.fullName}</div>
              <div className="text-muted-foreground">
                {order.address.line1}
                {order.address.line2 ? `, ${order.address.line2}` : ""}, {order.address.city}, {order.address.state} — {order.address.pincode}
              </div>
              <div className="text-xs text-muted-foreground">{order.address.phone}</div>
            </section>
          </div>

          <aside className="h-fit space-y-4 rounded-xl border border-border bg-surface p-5 text-sm">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Order number
              </div>
              <div className="mt-1 font-mono text-base font-bold">{order.id}</div>
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Placed
              </div>
              <div className="mt-1">{new Date(order.createdAt).toLocaleString()}</div>
            </div>
            <div className="border-t border-border pt-4">
              <Row label="Subtotal" value={`₹${order.subtotal.toFixed(2)}`} />
              <Row label="Delivery" value={order.delivery === 0 ? "FREE" : `₹${order.delivery}`} />
              <div className="my-2 border-t border-border" />
              <Row label="Total" value={`₹${order.total.toFixed(2)}`} bold />
              <div className="mt-2 text-xs uppercase text-muted-foreground">
                Paid via {order.paymentMethod === "cod" ? "Cash on Delivery" : order.paymentMethod.toUpperCase()}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </PublicLayout>
  );
}

function ConfirmationBanner({ order }: { order: FullOrder }) {
  const isRxPending = order.hasRx && order.prescriptionStatus === "pending";
  const isRejected = order.prescriptionStatus === "rejected";

  const tone = isRejected
    ? "border-destructive/40 bg-destructive/10 text-destructive"
    : "border-success/40 bg-success/10 text-success";

  return (
    <div className={`rounded-2xl border p-6 ${tone}`}>
      <div className="flex items-center gap-3">
        {isRejected ? <AlertTriangle size={22} /> : <CheckCircle2 size={22} />}
        <div>
          <div className="text-lg font-bold text-foreground">
            {isRejected
              ? "Action needed on your order"
              : isRxPending
              ? "Order placed — awaiting prescription verification"
              : "Order placed — processing"}
          </div>
          <p className="mt-1 text-sm text-foreground/80">
            {isRejected
              ? "Please review the note below and re-upload your prescription."
              : isRxPending
              ? "Our licensed pharmacist is reviewing your prescription. You'll be notified once it's verified, and your order will then be processed for shipping."
              : "Your order is confirmed and being processed for shipping."}
          </p>
        </div>
      </div>
    </div>
  );
}

const STEP_LABEL: Record<OrderStatus, string> = {
  placed: "Placed",
  under_review: "Prescription Under Review",
  verified: "Prescription Verified",
  action_needed: "Action Needed",
  processing: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
};

function Timeline({ order }: { order: FullOrder }) {
  const rxSteps: OrderStatus[] = order.hasRx
    ? order.prescriptionStatus === "rejected"
      ? ["placed", "under_review", "action_needed"]
      : ["placed", "under_review", "verified", "processing", "shipped", "delivered"]
    : ["placed", "processing", "shipped", "delivered"];

  const currentIdx = rxSteps.indexOf(order.status as OrderStatus);
  const rank = currentIdx === -1 ? 0 : currentIdx;

  return (
    <section className="rounded-xl border border-border bg-surface p-5">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        Order status
      </h2>
      <ol className="mt-4 space-y-3">
        {rxSteps.map((s, i) => {
          const done = i < rank || (i === rank && s !== "action_needed");
          const current = i === rank;
          const isAction = s === "action_needed";
          const Icon = iconFor(s);
          return (
            <li key={s} className="flex items-center gap-3">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full border ${
                  isAction && current
                    ? "border-destructive bg-destructive text-destructive-foreground"
                    : done
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-surface-muted text-muted-foreground"
                }`}
              >
                <Icon size={14} />
              </div>
              <div>
                <div className={`text-sm font-semibold ${current ? "text-foreground" : done ? "text-foreground" : "text-muted-foreground"}`}>
                  {STEP_LABEL[s]}
                </div>
                {current && order.reviewedAt && (
                  <div className="text-xs text-muted-foreground">
                    Updated {new Date(order.reviewedAt).toLocaleString()}
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

function iconFor(s: OrderStatus) {
  switch (s) {
    case "placed":
      return CheckCircle2;
    case "under_review":
      return Clock;
    case "verified":
      return ShieldCheck;
    case "action_needed":
      return AlertTriangle;
    case "processing":
      return Package;
    case "shipped":
      return Truck;
    case "delivered":
      return Home;
  }
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className={`flex justify-between ${bold ? "text-base" : ""}`}>
      <span className={bold ? "font-semibold" : "text-muted-foreground"}>{label}</span>
      <span className={bold ? "font-bold" : "font-medium"}>{value}</span>
    </div>
  );
}
