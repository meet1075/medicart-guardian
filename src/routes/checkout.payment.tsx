import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { CheckoutFrame } from "@/components/CheckoutFrame";
import { useStore } from "@/lib/store";
import { useEffect, useState } from "react";
import type { Address, PrescriptionFile } from "@/lib/types";
import { ShieldCheck, CreditCard, Banknote } from "lucide-react";
import { toast } from "sonner";
import { useOrders } from "@/hooks/use-orders";
import { useMedicines } from "@/hooks/use-medicines";

const PENDING_ADDRESS = "medicart.pending-address.v1";
const PRESCRIPTION_KEY = "medicart.pending-prescription.v1";

function loadRazorpayScript() {
  return new Promise((resolve) => {
    if ((window as any).Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export const Route = createFileRoute("/checkout/payment")({
  head: () => ({
    meta: [{ title: "Payment — Obat Medicare" }, { name: "robots", content: "noindex" }],
  }),
  component: PaymentStep,
});

function PaymentStep() {
  const { cart, cartHasRx, clearCart } = useStore();
  const { createOrder: submitOrder, verifyPayment, cancelOrderPayment } = useOrders();
  const { medicines } = useMedicines();
  const navigate = useNavigate();
  const [method, setMethod] = useState<"online" | "cod">("online");
  const [placing, setPlacing] = useState(false);
  const [address, setAddress] = useState<Address | null>(null);

  useEffect(() => {
    if (cart.length === 0) {
      navigate({ to: "/cart", replace: true });
      return;
    }

    // Prescription is strictly mandatory for all orders
    try {
      const rxRaw = window.localStorage.getItem(PRESCRIPTION_KEY);
      const rxFiles = rxRaw ? JSON.parse(rxRaw) : [];
      if (!rxFiles || rxFiles.length === 0) {
        toast.error("Prescription is required before payment.");
        navigate({ to: "/checkout/prescription", replace: true });
        return;
      }
    } catch {
      navigate({ to: "/checkout/prescription", replace: true });
      return;
    }

    try {
      const raw = window.localStorage.getItem(PENDING_ADDRESS);
      if (!raw) {
        navigate({ to: "/checkout/address", replace: true });
        return;
      }
      setAddress(JSON.parse(raw) as Address);
    } catch {
      navigate({ to: "/checkout/address", replace: true });
    }
  }, [cart.length, navigate]);

  const items = cart
    .map((c) => {
      const m = medicines.find((x) => x.id === c.medicineId);
      if (!m) return null;
      return {
        medicineId: m.id,
        name: m.name,
        salt: m.salt,
        qty: c.qty,
        price: m.mrp,
        dosageForm: m.dosageForm,
        prescriptionRequired: m.prescriptionRequired,
      };
    })
    .filter(Boolean) as any[];

  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const baseDelivery = subtotal >= 1000 ? 0 : 39;
  const codFee = method === "cod" ? (subtotal >= 1000 ? 0 : 49) : 0;
  const currentTotal = subtotal + baseDelivery + codFee;

  async function placeOrder() {
    if (!address) return;

    let files: PrescriptionFile[] = [];
    try {
      const raw = window.localStorage.getItem(PRESCRIPTION_KEY);
      if (raw) files = JSON.parse(raw);
    } catch { /* ignore */ }

    if (!files || files.length === 0) {
      toast.error("Prescription is required to place an order.");
      navigate({ to: "/checkout/prescription" });
      return;
    }

    setPlacing(true);

    const hasRx = items.some((i) => i.prescriptionRequired);

    const itemVerifications = items
      .filter((i) => i.prescriptionRequired)
      .map((i) => {
        return { medicineId: i.medicineId, aiStatus: "not_found", pharmacistApproved: false };
      });

    const pfData = files.map(f => ({
      name: f.name,
      mimeType: f.mimeType,
      dataUrl: f.dataUrl,
      aiExtractionResult: f.extraction ?? undefined
    }));

    try {
      const order = await submitOrder({
        items,
        subtotal,
        delivery: baseDelivery + codFee,
        total: currentTotal,
        hasRx: true,
        paymentMethod: method,
        address: {
          fullName: address.fullName,
          phone: address.phone,
          line1: address.line1,
          line2: address.line2,
          city: address.city,
          state: address.state,
          pincode: address.pincode,
          type: address.type,
        },
        prescriptionFiles: pfData,
        itemVerifications: itemVerifications.length > 0 ? itemVerifications : undefined,
      });

      // If COD, the order is confirmed immediately without gateway redirect
      if (method === "cod") {
        completeOrder(order.id, true);
        return;
      }

      if (order.razorpayOrderId) {
        const isLoaded = await loadRazorpayScript();
        if (!isLoaded) {
          toast.error("Razorpay SDK failed to load. Are you online?");
          setPlacing(false);
          return;
        }

        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_TBlc9zvMpPDJMh", // Use env var in prod
          amount: Math.round(order.total * 100).toString(),
          currency: "INR",
          name: "Obat Medicare",
          description: "Pharmacy Order",
          order_id: order.razorpayOrderId,
          handler: async function (response: any) {
            try {
              await verifyPayment({
                orderId: order.id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpayOrderId: response.razorpay_order_id,
                razorpaySignature: response.razorpay_signature,
              });
              completeOrder(order.id);
            } catch (err: any) {
              toast.error(err.message || "Payment verification failed");
              setPlacing(false);
            }
          },
          prefill: {
            name: address.fullName,
            contact: address.phone,
          },
          theme: { color: "#2563eb" },
          modal: {
            ondismiss: async function () {
              setPlacing(false);
              try {
                await cancelOrderPayment({
                  orderId: order.id,
                  reason: "Payment cancelled by customer",
                });
              } catch (e) {
                console.error("Failed to mark order as payment cancelled:", e);
              }
              toast.error("Payment cancelled. Order marked as payment cancelled.");
            },
          },
        };
        const rzp = new (window as any).Razorpay(options);
        rzp.on("payment.failed", async function (response: any) {
          try {
            await cancelOrderPayment({
              orderId: order.id,
              reason: response.error?.description || "Payment failed",
            });
          } catch (e) {
            console.error("Failed to mark order as payment cancelled:", e);
          }
          toast.error(response.error?.description || "Payment failed");
          setPlacing(false);
        });
        rzp.open();
      }
    } catch (error) {
      toast.error("Failed to place order: " + (error as Error).message);
      setPlacing(false);
    }
  }

  function completeOrder(orderId: string, isCod: boolean = false) {
    clearCart();
    window.localStorage.removeItem(PENDING_ADDRESS);
    window.localStorage.removeItem(PRESCRIPTION_KEY);
    if (isCod) {
      toast.success("Order placed successfully with Cash on Delivery!");
    } else {
      toast.success("Payment verified! Order placed successfully.");
    }
    navigate({ to: "/order/$id", params: { id: orderId } });
  }

  return (
    <CheckoutFrame
      current="payment"
      extraFee={method === "cod" ? codFee : undefined}
      extraFeeLabel={method === "cod" ? "COD Handling Fee" : undefined}
    >
      <section className="rounded-xl border border-border bg-surface p-6">
        <h2 className="text-lg font-semibold">Select Payment Method</h2>
        <div className="mt-4 space-y-3">
          <PayOption
            selected={method === "online"}
            onClick={() => setMethod("online")}
            icon={<CreditCard size={20} />}
            title="Pay Online Securely"
            subtitle="UPI (GPay, PhonePe, Paytm), Cards, Netbanking via Razorpay"
            badge={
              <span className="rounded-full bg-success/15 px-2.5 py-0.5 text-[11px] font-semibold text-success">
                Zero Extra Fee
              </span>
            }
          />

          <PayOption
            selected={method === "cod"}
            onClick={() => setMethod("cod")}
            icon={<Banknote size={20} />}
            title="Cash on Delivery (COD)"
            subtitle="Pay with Cash or UPI at your doorstep upon delivery"
            badge={
              subtotal >= 1000 ? (
                <span className="rounded-full bg-success/15 px-2.5 py-0.5 text-[11px] font-semibold text-success">
                  FREE COD
                </span>
              ) : (
                <span className="rounded-full bg-amber-500/15 px-2.5 py-0.5 text-[11px] font-semibold text-amber-700">
                  +₹49 COD Fee
                </span>
              )
            }
          />
        </div>

        {/* Informative Notice for COD */}
        {method === "cod" && (
          <div className="mt-4 rounded-lg border border-amber-500/30 bg-amber-500/10 p-4 text-xs text-amber-900 space-y-1">
            <div className="font-semibold flex items-center gap-1.5">
              <span>💵 Cash on Delivery Information</span>
            </div>
            {subtotal < 1000 ? (
              <p className="leading-relaxed">
                Orders below ₹1,000 carry a <strong>₹49 COD handling fee</strong>.
                You can pay online with UPI/Cards to save ₹49, or add items worth <strong>₹{(1000 - subtotal).toFixed(2)}</strong> more to get Free Delivery & Free COD!
              </p>
            ) : (
              <p className="leading-relaxed text-emerald-800 font-medium">
                🎉 Congratulations! Since your order is ₹1,000 or more, you qualify for <strong>FREE Cash on Delivery</strong> and <strong>FREE Shipping</strong>.
              </p>
            )}
          </div>
        )}

        {method === "online" && (
          <div className="mt-4 flex items-start gap-2 rounded-lg border border-border bg-primary-soft/40 p-4 text-xs text-foreground/80">
            <ShieldCheck size={16} className="mt-0.5 flex-none text-primary" />
            Payments are processed securely via Razorpay. Zero extra charges. All major UPI apps (GPay, PhonePe, Paytm) and Cards supported.
          </div>
        )}

        {address && (
          <div className="mt-6 rounded-lg border border-border bg-background p-4 text-sm">
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Delivering to
            </div>
            <div className="mt-1 font-semibold">{address.fullName} · {address.type}</div>
            <div className="text-muted-foreground">
              {address.line1}{address.line2 ? `, ${address.line2}` : ""}, {address.city}, {address.state} — {address.pincode}
            </div>
            <div className="mt-1 text-xs text-muted-foreground">{address.phone}</div>
          </div>
        )}

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-t border-border pt-4">
          <div className="text-xs text-muted-foreground">
            Total Payable: <strong className="text-foreground text-sm font-bold">₹{currentTotal.toFixed(2)}</strong>
            {method === "cod" ? " (to delivery agent)" : " (online now)"}
          </div>
          <button
            type="button"
            disabled={placing}
            onClick={placeOrder}
            className="rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground disabled:opacity-60 hover:bg-primary/90 transition-colors"
          >
            {placing
              ? "Placing order…"
              : method === "cod"
              ? `Place COD Order (₹${currentTotal.toFixed(2)})`
              : `Pay Online (₹${currentTotal.toFixed(2)})`}
          </button>
        </div>
      </section>
    </CheckoutFrame>
  );
}

function PayOption({
  selected,
  onClick,
  icon,
  title,
  subtitle,
  badge,
}: {
  selected: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  badge?: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-start gap-4 rounded-lg border p-4 text-left transition-all ${
        selected ? "border-primary bg-primary-soft/60 shadow-sm" : "border-border bg-background hover:border-primary/40"
      }`}
    >
      <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${selected ? "bg-primary text-primary-foreground" : "bg-surface-muted text-muted-foreground"}`}>
        {icon}
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-semibold text-foreground">{title}</span>
          {badge}
        </div>
        <div className="text-xs text-muted-foreground mt-0.5">{subtitle}</div>
      </div>
      <div
        className={`mt-1 h-4 w-4 rounded-full border ${
          selected ? "border-primary bg-primary" : "border-border"
        }`}
        aria-hidden
      />
    </button>
  );
}
