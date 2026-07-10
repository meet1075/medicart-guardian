import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { PublicLayout } from "@/components/PublicLayout";
import { useStore } from "@/lib/store";
import { useAuth } from "@/hooks/use-auth";
import { useMedicines } from "@/hooks/use-medicines";
import { MedicineVisual } from "@/components/MedicineVisual";
import { useState } from "react";
import { FileText, Info, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [{ title: "Your cart — MediCart" }, { name: "robots", content: "noindex" }],
  }),
  component: CartPage,
});

function CartPage() {
  const { cart, updateQty, removeFromCart, cartHasRx } = useStore();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  const { medicines, isLoading } = useMedicines();
  
  const items = cart
    .map((c) => {
      const m = medicines.find((x) => x.id === c.medicineId);
      return m ? { m, qty: c.qty } : null;
    })
    .filter(Boolean) as { m: any; qty: number }[];

  const rxItems = items.filter((i) => i.m.prescriptionRequired);
  const otcItems = items.filter((i) => !i.m.prescriptionRequired);

  const subtotal = items.reduce((s, i) => s + i.m.price * i.qty, 0);
  const savings = items.reduce((s, i) => s + (i.m.mrp - i.m.price) * i.qty, 0);
  const delivery = subtotal > 499 ? 0 : items.length ? 39 : 0;
  const total = subtotal + delivery;

  if (items.length === 0) {
    return (
      <PublicLayout>
        <div className="container-page py-20 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary-soft text-primary">
            <ShoppingBag size={28} />
          </div>
          <h1 className="mt-4 text-2xl font-bold">Your cart is empty</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Browse our catalog and add medicines to get started.
          </p>
          <Link
            to="/shop"
            className="mt-6 inline-flex items-center rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
          >
            Shop medicines
          </Link>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <div className="container-page py-8">
        <h1 className="text-2xl font-bold text-foreground md:text-3xl">Your cart</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {items.length} item{items.length > 1 ? "s" : ""} · Review before checkout
        </p>

        {cartHasRx && (
          <div className="mt-5 flex items-start gap-3 rounded-lg border border-warning/40 bg-warning/10 p-4 text-sm text-warning-foreground">
            <Info size={18} className="mt-0.5 flex-none" />
            <div>
              Your cart includes prescription medicines. You'll upload your prescription in the next step,
              and our pharmacist will verify it before your order ships.
            </div>
          </div>
        )}

        <div className="mt-6 grid gap-8 lg:grid-cols-[1.6fr_1fr]">
          <div className="space-y-6">
            {rxItems.length > 0 && (
              <CartGroup title="Prescription medicines" tag="Rx" tagClass="bg-warning/15 text-warning-foreground">
                {rxItems.map(({ m, qty }) => (
                  <CartRow
                    key={m.id}
                    m={m}
                    qty={qty}
                    onQty={(n) => updateQty(m.id, n)}
                    onRemove={() => removeFromCart(m.id)}
                  />
                ))}
              </CartGroup>
            )}
            {otcItems.length > 0 && (
              <CartGroup title="Over-the-counter" tag="OTC" tagClass="bg-success/15 text-success">
                {otcItems.map(({ m, qty }) => (
                  <CartRow
                    key={m.id}
                    m={m}
                    qty={qty}
                    onQty={(n) => updateQty(m.id, n)}
                    onRemove={() => removeFromCart(m.id)}
                  />
                ))}
              </CartGroup>
            )}
          </div>

          <aside className="h-fit rounded-xl border border-border bg-surface p-5 lg:sticky lg:top-24">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Order summary
            </h2>
            <dl className="mt-4 space-y-2 text-sm">
              <Row label="Subtotal" value={`₹${subtotal.toFixed(2)}`} />
              <Row label="You saved" value={`− ₹${savings.toFixed(2)}`} accent="text-success" />
              <Row label="Delivery" value={delivery === 0 ? "FREE" : `₹${delivery}`} />
              <div className="my-3 border-t border-border" />
              <Row label="Total" value={`₹${total.toFixed(2)}`} bold />
            </dl>
            <button
              type="button"
              onClick={() => {
                const target = cartHasRx ? "/checkout/prescription" : "/checkout/address";
                if (!user) {
                  setShowLoginPrompt(true);
                } else {
                  navigate({ to: target });
                }
              }}
              className="mt-5 w-full rounded-md bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
            >
              Proceed
            </button>
            <p className="mt-3 text-center text-xs text-muted-foreground">
              Free delivery on orders over ₹499
            </p>
          </aside>
        </div>
      </div>

      <AlertDialog open={showLoginPrompt} onOpenChange={setShowLoginPrompt}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Sign in to proceed</AlertDialogTitle>
            <AlertDialogDescription>
              You need to be logged into your MediCart account to proceed to checkout.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => {
              const target = cartHasRx ? "/checkout/prescription" : "/checkout/address";
              navigate({ to: "/login", search: { redirect: target } });
            }}>
              Log in
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </PublicLayout>
  );
}

function CartGroup({
  title,
  tag,
  tagClass,
  children,
}: {
  title: string;
  tag: string;
  tagClass: string;
  children: React.ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-xl border border-border bg-surface">
      <header className="flex items-center justify-between border-b border-border bg-surface-muted px-5 py-3">
        <h2 className="text-sm font-semibold text-foreground">{title}</h2>
        <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${tagClass}`}>
          {tag}
        </span>
      </header>
      <div className="divide-y divide-border">{children}</div>
    </section>
  );
}

function CartRow({
  m,
  qty,
  onQty,
  onRemove,
}: {
  m: any;
  qty: number;
  onQty: (n: number) => void;
  onRemove: () => void;
}) {
  return (
    <div className="flex gap-4 p-4">
      <div className="h-20 w-20 flex-none">
        <MedicineVisual medicine={m} size="sm" />
      </div>
      <div className="flex-1">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="font-semibold text-foreground">{m.name}</div>
            <div className="text-xs text-muted-foreground">{m.salt}</div>
            <div className="text-xs text-muted-foreground">{m.packSize}</div>
            {m.prescriptionRequired && (
              <div className="mt-1.5 inline-flex items-center gap-1 text-[11px] font-semibold text-warning-foreground">
                <FileText size={11} /> Prescription required
              </div>
            )}
          </div>
          <div className="text-right">
            <div className="font-bold text-foreground">₹{(m.price * qty).toFixed(2)}</div>
            <div className="text-xs text-muted-foreground">₹{m.price} each</div>
          </div>
        </div>

        <div className="mt-3 flex items-center gap-3">
          <div className="inline-flex items-center rounded-md border border-border">
            <button
              type="button"
              onClick={() => onQty(qty - 1)}
              className="flex h-8 w-8 items-center justify-center text-muted-foreground hover:text-foreground"
              aria-label="Decrease"
            >
              <Minus size={14} />
            </button>
            <span className="w-8 text-center text-sm font-semibold">{qty}</span>
            <button
              type="button"
              onClick={() => onQty(qty + 1)}
              className="flex h-8 w-8 items-center justify-center text-muted-foreground hover:text-foreground"
              aria-label="Increase"
            >
              <Plus size={14} />
            </button>
          </div>
          <button
            type="button"
            onClick={onRemove}
            className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive"
          >
            <Trash2 size={14} /> Remove
          </button>
        </div>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  accent,
  bold,
}: {
  label: string;
  value: string;
  accent?: string;
  bold?: boolean;
}) {
  return (
    <div className={`flex items-center justify-between ${bold ? "text-base" : ""}`}>
      <dt className={`${bold ? "font-semibold text-foreground" : "text-muted-foreground"}`}>{label}</dt>
      <dd className={`${bold ? "font-bold text-foreground" : "font-medium text-foreground"} ${accent ?? ""}`}>
        {value}
      </dd>
    </div>
  );
}
