/* eslint-disable @typescript-eslint/no-explicit-any */
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useOrders } from "@/hooks/use-orders";
import { useShiprocket } from "@/hooks/use-shiprocket";
import {
  ArrowLeft,
  FileText,
  CheckCircle2,
  Clock,
  XCircle,
  Package,
  Sparkles,
  AlertTriangle,
} from "lucide-react";
import { StatusPill } from "./admin.dashboard";
import { useAuth } from "@/hooks/use-auth";
import { useState } from "react";
import { toast } from "sonner";
import type { MatchStatus } from "@/lib/types";

export const Route = createFileRoute("/admin/dashboard/orders/$id")({
  component: OrderDetailsPage,
});

function OrderDetailsPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { orders, updateOrderStatus, toggleItemVerification, isUpdating } = useOrders();
  const [rejectMode, setRejectMode] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  const order = orders.find((o) => o.id === id);

  if (!order) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="text-muted-foreground mb-4">Order not found or loading...</div>
          <button
            onClick={() => navigate({ to: "/admin/dashboard/orders" })}
            className="text-primary hover:underline font-semibold"
          >
            &larr; Back to Orders
          </button>
        </div>
      </div>
    );
  }

  const allReviewed =
    order.itemVerifications.length > 0 &&
    order.itemVerifications.every((v: any) => v.pharmacistApproved);

  async function approve() {
    await updateOrderStatus({
      orderId: order!.id,
      status: "processing",
      prescriptionStatus: "verified",
      reviewer: user?.email ?? "pharmacist",
    });
    toast.success("Order approved and moved to processing");
  }

  async function reject() {
    if (!rejectReason.trim()) {
      toast.error("Please provide a reason so the customer knows what to fix");
      return;
    }
    await updateOrderStatus({
      orderId: order!.id,
      status: "action_needed",
      prescriptionStatus: "rejected",
      reviewer: user?.email ?? "pharmacist",
      rejectReason: rejectReason.trim(),
    });
    setRejectMode(false);
    toast.success("Order flagged as Action Needed and customer notified");
  }

  return (
    <div className="max-w-6xl pb-10">
      <div className="mb-6 flex items-center gap-4">
        <button
          onClick={() => navigate({ to: "/admin/dashboard/orders" })}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border bg-surface hover:bg-surface-muted transition-colors"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-3">
            Order <span className="font-mono text-primary">#{order.id}</span>
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Placed on {new Date(order.createdAt).toLocaleString()}
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Left Column: Details & Items */}
        <div className="md:col-span-2 space-y-6">
          <div className="rounded-xl border border-border bg-surface p-6">
            <h2 className="text-lg font-bold mb-4">Order Items</h2>
            <div className="divide-y divide-border border border-border rounded-lg overflow-hidden">
              {order.items.map((i: any) => (
                <div
                  key={i.medicineId}
                  className="flex items-center justify-between p-4 bg-background"
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary-soft text-primary">
                      <Package size={16} />
                    </div>
                    <div>
                      <div className="font-semibold text-sm">{i.name}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{i.salt || "—"}</div>
                      <div className="mt-2 flex gap-2 items-center">
                        <span className="text-xs font-semibold text-foreground/80">
                          Qty: {i.qty}
                        </span>
                        {i.prescriptionRequired && (
                          <span className="rounded-full bg-warning/15 px-2 py-0.5 text-[10px] font-bold text-warning-foreground uppercase tracking-wider">
                            Rx Req
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="font-bold text-sm">₹{(i.price * i.qty).toFixed(2)}</div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-end">
              <div className="w-full max-w-xs space-y-3 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span>₹{order.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Delivery</span>
                  <span>₹{order.delivery.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t border-border pt-3">
                  <span>Total</span>
                  <span>₹{order.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {order.hasRx && (
            <div className="rounded-xl border border-border bg-surface p-6">
              <h2 className="text-lg font-bold mb-4">Uploaded Prescriptions</h2>
              <div className="space-y-4">
                {order.prescriptionFiles.map((f: any, idx: number) => (
                  <div key={f.id} className="rounded-lg border border-border bg-background p-4">
                    <div className="text-sm font-semibold mb-3">
                      File {idx + 1} — {f.name}
                    </div>
                    <div className="overflow-hidden rounded-md border border-border bg-surface-muted mb-4">
                      {f.dataUrl === "[file-too-large-for-storage]" ? (
                        <div className="flex flex-col items-center justify-center gap-2 p-6 text-center text-sm text-muted-foreground">
                          <FileText size={28} className="text-muted-foreground/50" />
                          <div>
                            <div className="font-medium">File preview unavailable</div>
                            <div className="mt-0.5 text-xs">
                              This file was too large to cache locally.
                            </div>
                          </div>
                        </div>
                      ) : f.mimeType.startsWith("image/") ? (
                        <a href={f.dataUrl} target="_blank" rel="noopener noreferrer">
                          <img
                            src={f.dataUrl}
                            alt={f.name}
                            className="max-h-[500px] w-full object-contain"
                          />
                        </a>
                      ) : (
                        <a
                          href={f.dataUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 p-4 text-sm text-primary"
                        >
                          <FileText size={18} /> Open PDF
                        </a>
                      )}
                    </div>

                    {f.aiExtractionResult && (
                      <div className="rounded-md border border-border bg-surface-muted/50 p-4 text-sm">
                        <div className="flex items-center gap-1.5 text-primary mb-3">
                          <Sparkles size={16} />
                          <span className="font-bold tracking-wide">AI Extraction Data</span>
                        </div>
                        <div className="grid gap-2">
                          <Kv
                            label="Doctor"
                            value={(f.aiExtractionResult as any)?.doctorName ?? "—"}
                          />
                          <Kv
                            label="Patient"
                            value={(f.aiExtractionResult as any)?.patientName ?? "—"}
                          />
                        </div>
                        <div className="mt-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                          Medicines Detected
                        </div>
                        <ul className="space-y-1">
                          {(f.aiExtractionResult as any)?.medicines?.length === 0 && (
                            <li className="text-muted-foreground text-sm">None detected</li>
                          )}
                          {(f.aiExtractionResult as any)?.medicines?.map((m: any, i: number) => (
                            <li key={i} className="text-sm">
                              • <span className="font-semibold">{m.name}</span>
                              {m.dosage && (
                                <span className="text-muted-foreground"> — {m.dosage}</span>
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Customer, Status, Actions */}
        <div className="space-y-6">
          <div className="rounded-xl border border-border bg-surface p-6">
            <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">
              Customer Details
            </h2>
            <div className="font-semibold text-base">{order.address.fullName}</div>
            {(order as any).user && (
              <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className="rounded-full bg-primary/10 px-2 py-0.5 font-medium text-primary">
                  {(order as any).user.name}
                </span>
                <span>{(order as any).user.email}</span>
              </div>
            )}
            <div className="text-sm text-muted-foreground mt-2 leading-relaxed">
              {order.address.line1}
              {order.address.line2 ? `, ${order.address.line2}` : ""}
              <br />
              {order.address.city}, {order.address.state} — {order.address.pincode}
            </div>
            <div className="text-sm font-semibold mt-3 text-foreground/80">
              Phone: {order.address.phone}
            </div>
          </div>

          <div className="rounded-xl border border-border bg-surface p-6">
            <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">
              Payment & Tracking
            </h2>

            <div className="mb-6">
              <div className="text-xs text-muted-foreground mb-1">Payment Method</div>
              <div className="font-semibold uppercase">{order.paymentMethod}</div>
            </div>

            <div className="mb-6">
              <div className="text-xs text-muted-foreground mb-1">Rx Status</div>
              {order.hasRx ? (
                <StatusPill status={order.status} rx={order.prescriptionStatus as any} />
              ) : (
                <span className="text-sm font-semibold text-success">OTC - Not Required</span>
              )}
            </div>

            <div className="border-t border-border pt-4">
              <div className="text-xs text-muted-foreground mb-2">Update Fulfillment Status</div>
              <select
                value={order.status}
                onChange={(e) => updateOrderStatus({ orderId: order.id, status: e.target.value as any })}
                disabled={isUpdating}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-semibold outline-none focus:border-primary disabled:opacity-50 transition-colors"
              >
                <option value="placed">Placed</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="action_needed" disabled>
                  Action Needed
                </option>
              </select>
              {isUpdating && (
                <div className="animate-pulse text-xs text-primary mt-2">Updating...</div>
              )}
            </div>
          </div>

          <ShipmentManagementCard order={order} />

          {order.hasRx && (
            <div className="rounded-xl border border-warning/30 bg-warning/5 p-6">
              <h2 className="text-sm font-bold uppercase tracking-wider text-warning-foreground mb-4">
                Pharmacist Review
              </h2>

              <div className="space-y-3 mb-6">
                {order.itemVerifications.map((v: any) => {
                  const item = order.items.find((i: any) => i.medicineId === v.medicineId);
                  if (!item) return null;
                  return (
                    <div
                      key={v.medicineId}
                      className="rounded-lg border border-warning/20 bg-background p-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="font-semibold text-sm">{item.name}</div>
                        <MatchPill status={v.aiStatus as MatchStatus} />
                      </div>
                      <label className="mt-3 flex cursor-pointer items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={v.pharmacistApproved}
                          onChange={() =>
                            toggleItemVerification({ id: v.id, approved: !v.pharmacistApproved })
                          }
                          className="accent-warning"
                          disabled={order.prescriptionStatus !== "pending" || isUpdating}
                        />
                        <span className="font-medium">Pharmacist verified</span>
                      </label>
                    </div>
                  );
                })}
              </div>

              {order.prescriptionStatus === "pending" && (
                <div className="space-y-3 border-t border-warning/20 pt-4">
                  {rejectMode ? (
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Reason (shown to customer)
                      </label>
                      <textarea
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                        rows={3}
                        className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                        placeholder="e.g. The uploaded prescription doesn't clearly show Azithral 500."
                        maxLength={400}
                      />
                      <div className="mt-3 flex flex-col gap-2">
                        <button
                          type="button"
                          onClick={reject}
                          className="w-full rounded-md bg-destructive px-4 py-2 text-sm font-semibold text-destructive-foreground hover:bg-destructive/90"
                        >
                          Send rejection
                        </button>
                        <button
                          type="button"
                          onClick={() => setRejectMode(false)}
                          className="w-full rounded-md border border-border px-4 py-2 text-sm font-semibold text-foreground/80 bg-background"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <button
                        type="button"
                        disabled={!allReviewed}
                        onClick={approve}
                        className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-success px-4 py-2 text-sm font-semibold text-success-foreground disabled:cursor-not-allowed disabled:opacity-50 hover:bg-success/90"
                      >
                        <CheckCircle2 size={16} /> Approve Rx
                      </button>
                      <button
                        type="button"
                        onClick={() => setRejectMode(true)}
                        className="w-full inline-flex items-center justify-center gap-2 rounded-md border border-destructive bg-background px-4 py-2 text-sm font-semibold text-destructive hover:bg-destructive hover:text-destructive-foreground"
                      >
                        <XCircle size={16} /> Reject Rx
                      </button>
                    </div>
                  )}
                  {!allReviewed && !rejectMode && (
                    <div className="flex items-start gap-2 text-xs text-muted-foreground mt-3">
                      <AlertTriangle size={14} className="mt-0.5 shrink-0" />
                      Verify every requested medication to enable approval.
                    </div>
                  )}
                </div>
              )}

              {order.prescriptionStatus !== "pending" && order.reviewedBy && (
                <div className="mt-6 border-t border-warning/20 pt-4 text-xs text-muted-foreground">
                  Reviewed by {order.reviewedBy}
                  {order.reviewedAt && ` · ${new Date(order.reviewedAt).toLocaleString()}`}
                  {order.rejectReason && (
                    <div className="mt-2 rounded-md bg-destructive/10 p-3 text-destructive">
                      Reason sent to customer: “{order.rejectReason}”
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Kv({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2">
      <span className="min-w-16 text-muted-foreground">{label}:</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

function MatchPill({ status }: { status: MatchStatus }) {
  if (status === "matched")
    return (
      <span className="whitespace-nowrap rounded-full bg-success/15 px-2 py-0.5 text-[11px] font-semibold text-success">
        Matched
      </span>
    );
  if (status === "possible")
    return (
      <span className="whitespace-nowrap rounded-full bg-warning/15 px-2 py-0.5 text-[11px] font-semibold text-warning-foreground">
        Possible match
      </span>
    );
  return (
    <span className="whitespace-nowrap rounded-full bg-destructive/15 px-2 py-0.5 text-[11px] font-semibold text-destructive">
      Not found
    </span>
  );
}

function ShipmentManagementCard({ order }: { order: any }) {
  const { retryShipmentCreation, generateAwb, schedulePickup, cancelShipment } = useShiprocket();

  return (
    <div className="rounded-xl border border-border bg-surface p-6">
      <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">
        Shiprocket Management
      </h2>

      {order.isShipmentCreated ? (
        <div className="space-y-4 text-sm">
          <div className="grid grid-cols-[95px_1fr] gap-y-3 gap-x-2">
            <div className="text-muted-foreground">Order ID:</div>
            <div className="font-medium font-mono text-[13px] break-all">{order.shiprocketOrderId}</div>
            
            <div className="text-muted-foreground">Shipment ID:</div>
            <div className="font-medium font-mono text-[13px] break-all">{order.shipmentId}</div>

            <div className="text-muted-foreground">Status:</div>
            <div className="font-medium text-primary">{order.shipmentStatus}</div>

            {order.awbCode && (
              <>
                <div className="text-muted-foreground">AWB:</div>
                <div className="font-bold break-all">{order.awbCode}</div>
                <div className="text-muted-foreground">Courier:</div>
                <div className="font-medium">{order.courierName}</div>
              </>
            )}
            
            {order.pickupStatus && (
              <>
                <div className="text-muted-foreground">Pickup:</div>
                <div className="font-medium">{order.pickupStatus}</div>
              </>
            )}

            {(order as any).estimatedDelivery && (
              <>
                <div className="text-muted-foreground">Est. Delivery:</div>
                <div className="font-medium text-success">
                  {new Date((order as any).estimatedDelivery).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                </div>
              </>
            )}
          </div>

          {(order as any).trackingUrl && (
            <a
              href={(order as any).trackingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary/10 text-primary px-3 py-2 text-xs font-semibold hover:bg-primary/20 transition-colors"
            >
              Open Tracking Page ↗
            </a>
          )}

          <div className="pt-3 border-t flex flex-col gap-2">
            {!order.awbCode && (
              <button
                onClick={() => generateAwb.mutate({ orderId: order.id, shipmentId: order.shipmentId })}
                disabled={generateAwb.isPending}
                className="w-full rounded-md bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-50"
              >
                {generateAwb.isPending ? "Generating..." : "Generate AWB"}
              </button>
            )}
            
            {order.awbCode && !order.pickupStatus && (
              <button
                onClick={() => schedulePickup.mutate({ orderId: order.id, shipmentId: order.shipmentId })}
                disabled={schedulePickup.isPending}
                className="w-full rounded-md border border-primary text-primary px-3 py-2 text-sm font-semibold disabled:opacity-50"
              >
                {schedulePickup.isPending ? "Scheduling..." : "Schedule Pickup"}
              </button>
            )}

            {order.shipmentStatus !== "Cancelled" && order.awbCode && (
              <button
                onClick={() => cancelShipment.mutate({ orderId: order.id, awbCode: order.awbCode })}
                disabled={cancelShipment.isPending}
                className="w-full rounded-md bg-destructive/10 text-destructive px-3 py-2 text-sm font-semibold mt-2 disabled:opacity-50"
              >
                {cancelShipment.isPending ? "Cancelling..." : "Cancel Shipment"}
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="text-sm">
          <div className="text-muted-foreground mb-3">
            Shipment not yet created in Shiprocket.
          </div>
          {order.shipmentError && (
            <div className="mb-4 rounded-md bg-destructive/10 p-3 text-destructive text-xs">
              <strong>Error:</strong> {order.shipmentError}
            </div>
          )}
          {order.status === "processing" ? (
            <button
              onClick={() => retryShipmentCreation.mutate(order.id)}
              disabled={retryShipmentCreation.isPending}
              className="w-full rounded-md border border-primary px-3 py-2 text-sm font-semibold text-primary hover:bg-primary/5 disabled:opacity-50"
            >
              {retryShipmentCreation.isPending ? "Retrying..." : "Retry Creation"}
            </button>
          ) : (
            <div className="text-xs italic text-muted-foreground">
              Order must be in 'processing' status to create shipment.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
