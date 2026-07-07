import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { PublicLayout } from "./PublicLayout";
import { useStore } from "@/lib/store";
import { getMedicine } from "@/lib/medicines";
import { Check, FileText, MapPin, CreditCard } from "lucide-react";

const STEPS = [
  { key: "prescription", label: "Prescription", icon: FileText },
  { key: "address", label: "Address", icon: MapPin },
  { key: "payment", label: "Payment", icon: CreditCard },
] as const;

export function CheckoutFrame({
  current,
  children,
}: {
  current: "prescription" | "address" | "payment";
  children: ReactNode;
}) {
  const { cart, cartHasRx } = useStore();
  const activeIdx = STEPS.findIndex((s) => s.key === current);

  const items = cart
    .map((c) => ({ m: getMedicine(c.medicineId), qty: c.qty }))
    .filter((x) => x.m) as { m: NonNullable<ReturnType<typeof getMedicine>>; qty: number }[];
  const subtotal = items.reduce((s, i) => s + i.m.price * i.qty, 0);
  const delivery = subtotal > 499 ? 0 : items.length ? 39 : 0;
  const total = subtotal + delivery;

  return (
    <PublicLayout>
      <div className="container-page py-6">
        <div className="text-xs text-muted-foreground">
          <Link to="/cart" className="hover:text-primary">Cart</Link>{" "}
          <span className="mx-1">/</span> Checkout
        </div>
        <h1 className="mt-2 text-2xl font-bold md:text-3xl">Checkout</h1>

        <div className="mt-6 flex items-center gap-2">
          {STEPS.map((s, i) => {
            const isRxStep = s.key === "prescription";
            const skipRxStep = isRxStep && !cartHasRx;
            const done = i < activeIdx || skipRxStep;
            const active = i === activeIdx;
            const Icon = s.icon;
            return (
              <div key={s.key} className="flex flex-1 items-center gap-2">
                <div
                  className={`flex h-9 w-9 flex-none items-center justify-center rounded-full border text-xs font-bold ${
                    active
                      ? "border-primary bg-primary text-primary-foreground"
                      : done
                      ? "border-primary bg-primary-soft text-primary"
                      : "border-border bg-surface text-muted-foreground"
                  }`}
                >
                  {done ? <Check size={16} /> : <Icon size={16} />}
                </div>
                <div className={`text-xs font-semibold ${active ? "text-foreground" : "text-muted-foreground"}`}>
                  {s.label}
                  {skipRxStep && <span className="ml-1 text-[10px]">(skipped)</span>}
                </div>
                {i < STEPS.length - 1 && <div className="mx-2 h-px flex-1 bg-border" />}
              </div>
            );
          })}
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1.5fr_1fr]">
          <div>{children}</div>

          <aside className="h-fit rounded-xl border border-border bg-surface p-5 lg:sticky lg:top-24">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Order summary
            </h2>
            <div className="mt-4 max-h-64 space-y-3 overflow-auto text-sm">
              {items.map(({ m, qty }) => (
                <div key={m.id} className="flex justify-between gap-3">
                  <div>
                    <div className="font-medium text-foreground">{m.name}</div>
                    <div className="text-xs text-muted-foreground">Qty {qty} · {m.packSize}</div>
                  </div>
                  <div className="whitespace-nowrap font-semibold">₹{(m.price * qty).toFixed(2)}</div>
                </div>
              ))}
            </div>
            <div className="mt-4 space-y-1.5 border-t border-border pt-4 text-sm">
              <SumRow label="Subtotal" value={`₹${subtotal.toFixed(2)}`} />
              <SumRow label="Delivery" value={delivery === 0 ? "FREE" : `₹${delivery}`} />
              <div className="my-2 border-t border-border" />
              <SumRow label="Total" value={`₹${total.toFixed(2)}`} bold />
            </div>
          </aside>
        </div>
      </div>
    </PublicLayout>
  );
}

function SumRow({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className={`flex justify-between ${bold ? "text-base" : ""}`}>
      <span className={bold ? "font-semibold" : "text-muted-foreground"}>{label}</span>
      <span className={bold ? "font-bold" : "font-medium"}>{value}</span>
    </div>
  );
}
