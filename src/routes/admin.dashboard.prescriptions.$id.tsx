import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useStore } from "@/lib/store";
import { getMedicine } from "@/lib/medicines";
import type { MatchStatus } from "@/lib/types";
import { useState } from "react";
import { ArrowLeft, CheckCircle2, XCircle, AlertTriangle, FileText, Sparkles } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/dashboard/prescriptions/$id")({
  component: PrescriptionReviewPage,
});

function PrescriptionReviewPage() {
  const { id } = Route.useParams();
  const { orders, adminEmail, toggleItemVerified, approveOrder, rejectOrder } = useStore();
  const navigate = useNavigate();
  const order = orders.find((o) => o.id === id);
  const [rejectMode, setRejectMode] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  if (!order) {
    return (
      <div className="rounded-xl border border-border bg-surface p-10 text-center">
        <p className="text-sm text-muted-foreground">Order not found.</p>
        <Link to="/admin/dashboard/prescriptions" className="mt-4 inline-block text-sm font-semibold text-primary">
          ← Back to prescriptions
        </Link>
      </div>
    );
  }

  const allReviewed =
    order.itemVerification.length > 0 &&
    order.itemVerification.every((v) => v.pharmacistApproved);

  function approve() {
    approveOrder(order!.id, adminEmail ?? "pharmacist");
    toast.success("Order approved and moved to processing");
    navigate({ to: "/admin/dashboard/prescriptions" });
  }

  function reject() {
    if (!rejectReason.trim()) {
      toast.error("Please provide a reason so the customer knows what to fix");
      return;
    }
    rejectOrder(order!.id, adminEmail ?? "pharmacist", rejectReason.trim());
    toast.success("Order flagged as Action Needed and customer notified");
    navigate({ to: "/admin/dashboard/prescriptions" });
  }

  return (
    <div>
      <Link
        to="/admin/dashboard/prescriptions"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary"
      >
        <ArrowLeft size={14} /> Prescriptions
      </Link>
      <div className="mt-3 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Prescription review</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Order <span className="font-mono font-bold">{order.id}</span> · {order.address.fullName} ·{" "}
            {new Date(order.createdAt).toLocaleString()}
          </p>
        </div>
        {order.prescriptionStatus && (
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              order.prescriptionStatus === "verified"
                ? "bg-success/15 text-success"
                : order.prescriptionStatus === "rejected"
                ? "bg-destructive/15 text-destructive"
                : "bg-warning/15 text-warning-foreground"
            }`}
          >
            {order.prescriptionStatus.toUpperCase()}
          </span>
        )}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border border-border bg-surface p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Uploaded prescription ({order.prescriptionFiles.length})
          </h2>
          <div className="mt-3 space-y-4">
            {order.prescriptionFiles.map((f, idx) => (
              <div key={f.id} className="rounded-lg border border-border bg-background p-3">
                <div className="text-xs text-muted-foreground">
                  File {idx + 1} — {f.name}
                </div>
                <div className="mt-2 overflow-hidden rounded-md border border-border bg-surface-muted">
                  {f.mimeType.startsWith("image/") ? (
                    <a href={f.dataUrl} target="_blank" rel="noopener noreferrer">
                      <img src={f.dataUrl} alt={f.name} className="max-h-96 w-full object-contain" />
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
                {f.extraction && (
                  <div className="mt-3 rounded-md border border-border bg-surface-muted/50 p-3 text-xs">
                    <div className="flex items-center gap-1.5 text-primary">
                      <Sparkles size={13} />
                      <span className="font-semibold uppercase tracking-wider">
                        AI extraction (editable)
                      </span>
                    </div>
                    <div className="mt-2 grid gap-1.5">
                      <Kv label="Doctor" value={f.extraction.doctorName ?? "—"} />
                      <Kv label="Patient" value={f.extraction.patientName ?? "—"} />
                    </div>
                    <div className="mt-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Medicines detected
                    </div>
                    <ul className="mt-1 space-y-0.5">
                      {f.extraction.medicines.length === 0 && (
                        <li className="text-muted-foreground">None detected</li>
                      )}
                      {f.extraction.medicines.map((m, i) => (
                        <li key={i}>
                          • <span className="font-semibold">{m.name}</span>
                          {m.dosage && <span className="text-muted-foreground"> — {m.dosage}</span>}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {f.error && (
                  <div className="mt-2 text-xs text-destructive">{f.error}</div>
                )}
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-md border border-border bg-primary-soft/40 p-3 text-xs text-foreground/80">
            AI comparison is a decision-support aid only. Final verification must be performed by the
            reviewing pharmacist.
          </div>
        </section>

        <section className="rounded-xl border border-border bg-surface p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Cart items — Rx verification
          </h2>
          <div className="mt-3 space-y-3">
            {order.itemVerification.map((v) => {
              const item = order.items.find((i) => i.medicineId === v.medicineId);
              const med = getMedicine(v.medicineId);
              if (!item || !med) return null;
              return (
                <div
                  key={v.medicineId}
                  className="rounded-lg border border-border bg-background p-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-semibold">{item.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {item.salt} · {item.dosageForm} · Qty {item.qty}
                      </div>
                    </div>
                    <MatchPill status={v.aiStatus} />
                  </div>
                  <label className="mt-3 flex cursor-pointer items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={v.pharmacistApproved}
                      onChange={() => toggleItemVerified(order.id, v.medicineId)}
                      className="accent-primary"
                      disabled={order.prescriptionStatus !== "pending"}
                    />
                    <span className="font-medium">Pharmacist verified</span>
                  </label>
                </div>
              );
            })}
            {order.itemVerification.length === 0 && (
              <div className="text-sm text-muted-foreground">No Rx items on this order.</div>
            )}
          </div>

          {order.prescriptionStatus === "pending" && (
            <div className="mt-6 space-y-3 border-t border-border pt-4">
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
                    placeholder="e.g. The uploaded prescription doesn't clearly show Azithral 500. Please re-upload a clearer image."
                    maxLength={400}
                  />
                  <div className="mt-3 flex gap-2">
                    <button
                      type="button"
                      onClick={reject}
                      className="rounded-md bg-destructive px-4 py-2 text-sm font-semibold text-destructive-foreground hover:bg-destructive/90"
                    >
                      Send rejection
                    </button>
                    <button
                      type="button"
                      onClick={() => setRejectMode(false)}
                      className="rounded-md border border-border px-4 py-2 text-sm font-semibold text-foreground/80"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    disabled={!allReviewed}
                    onClick={approve}
                    className="inline-flex items-center gap-2 rounded-md bg-success px-4 py-2 text-sm font-semibold text-success-foreground disabled:cursor-not-allowed disabled:opacity-50 hover:bg-success/90"
                  >
                    <CheckCircle2 size={16} /> Approve & Process Order
                  </button>
                  <button
                    type="button"
                    onClick={() => setRejectMode(true)}
                    className="inline-flex items-center gap-2 rounded-md border border-destructive px-4 py-2 text-sm font-semibold text-destructive hover:bg-destructive hover:text-destructive-foreground"
                  >
                    <XCircle size={16} /> Reject / Request Re-upload
                  </button>
                </div>
              )}
              {!allReviewed && !rejectMode && (
                <div className="flex items-start gap-2 text-xs text-muted-foreground">
                  <AlertTriangle size={13} className="mt-0.5" />
                  Mark every Rx item as pharmacist verified to enable approval.
                </div>
              )}
            </div>
          )}

          {order.prescriptionStatus !== "pending" && order.reviewedBy && (
            <div className="mt-6 border-t border-border pt-4 text-xs text-muted-foreground">
              Reviewed by {order.reviewedBy}
              {order.reviewedAt && ` · ${new Date(order.reviewedAt).toLocaleString()}`}
              {order.rejectReason && (
                <div className="mt-2 rounded-md bg-destructive/10 p-3 text-destructive">
                  Reason sent to customer: “{order.rejectReason}”
                </div>
              )}
            </div>
          )}
        </section>
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
        Possible match · review
      </span>
    );
  return (
    <span className="whitespace-nowrap rounded-full bg-destructive/15 px-2 py-0.5 text-[11px] font-semibold text-destructive">
      Not found in Rx
    </span>
  );
}
