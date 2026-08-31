import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { CheckoutFrame } from "@/components/CheckoutFrame";
import { useStore } from "@/lib/store";
import { useEffect, useState } from "react";
import type { Address, Order, PrescriptionFile } from "@/lib/types";
import { ShieldCheck } from "lucide-react";
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
  const { createOrder: submitOrder, verifyPayment } = useOrders();
  const { medicines } = useMedicines();
  const navigate = useNavigate();
  const [method] = useState<Order["paymentMethod"]>("upi");
  const [placing, setPlacing] = useState(false);
  const [address, setAddress] = useState<Address | null>(null);

  useEffect(() => {
    if (cart.length === 0) {
      navigate({ to: "/cart", replace: true });
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

  async function placeOrder() {
    if (!address) return;
    setPlacing(true);
    let files: PrescriptionFile[] = [];
    if (cartHasRx) {
      try {
        const raw = window.localStorage.getItem(PRESCRIPTION_KEY);
        if (raw) files = JSON.parse(raw);
      } catch { /* ignore */ }
    }

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
    const delivery = subtotal >= 1000 ? 0 : 39;
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
        delivery,
        total: subtotal + delivery,
        hasRx,
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
        prescriptionFiles: pfData.length > 0 ? pfData : undefined,
        itemVerifications: itemVerifications.length > 0 ? itemVerifications : undefined,
      });

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
            ondismiss: function () {
              setPlacing(false);
            },
          },
        };
        const rzp = new (window as any).Razorpay(options);
        rzp.on("payment.failed", function (response: any) {
          toast.error(response.error.description || "Payment failed");
          setPlacing(false);
        });
        rzp.open();
      }
    } catch (error) {
      toast.error("Failed to place order: " + (error as Error).message);
      setPlacing(false);
    }
  }

  function completeOrder(orderId: string) {
    clearCart();
    window.localStorage.removeItem(PENDING_ADDRESS);
    window.localStorage.removeItem(PRESCRIPTION_KEY);
    toast.success("Order placed successfully");
    navigate({ to: "/order/$id", params: { id: orderId } });
  }

  return (
    <CheckoutFrame current="payment">
      <section className="rounded-xl border border-border bg-surface p-6">
        <h2 className="text-lg font-semibold">Payment method</h2>
        <div className="mt-4 space-y-3">
          <PayOption
            selected={true}
            onClick={() => {}}
            icon={<ShieldCheck size={20} />}
            title="Pay Online Securely"
            subtitle="UPI, Cards, Netbanking via Razorpay"
          />
        </div>

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

        <div className="mt-6 flex items-start gap-2 rounded-lg border border-border bg-primary-soft/40 p-4 text-xs text-foreground/80">
          <ShieldCheck size={16} className="mt-0.5 flex-none text-primary" />
          Payments are processed securely via Razorpay. Your connection is fully encrypted.
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            disabled={placing}
            onClick={placeOrder}
            className="rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground disabled:opacity-60 hover:bg-primary/90"
          >
            {placing ? "Placing order…" : "Place order"}
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
}: {
  selected: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-start gap-4 rounded-lg border p-4 text-left ${
        selected ? "border-primary bg-primary-soft/60" : "border-border bg-background hover:border-primary/40"
      }`}
    >
      <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${selected ? "bg-primary text-primary-foreground" : "bg-surface-muted text-muted-foreground"}`}>
        {icon}
      </div>
      <div className="flex-1">
        <div className="font-semibold text-foreground">{title}</div>
        <div className="text-xs text-muted-foreground">{subtitle}</div>
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
