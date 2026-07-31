import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { CheckoutFrame } from "@/components/CheckoutFrame";
import { useStore } from "@/lib/store";
import { useAuth } from "@/hooks/use-auth";
import { useEffect, useState } from "react";
import type { Address } from "@/lib/types";
import { z } from "zod";
import { toast } from "sonner";

const PENDING_ADDRESS = "medicart.pending-address.v1";

const addressSchema = z.object({
  fullName: z.string().trim().min(2, "Enter your full name").max(20, "Full name must be at most 20 characters"),
  email: z.string().email("Enter a valid email address").optional().or(z.literal("")),
  phone: z.string().trim().regex(/^\d{10}$/, "Phone number must be exactly 10 digits"),
  line1: z.string().trim().min(3, "Address line 1 is required").max(120),
  line2: z.string().trim().max(120).optional(),
  city: z.string().trim().min(2, "City is required").max(60),
  state: z.string().trim().min(2, "State is required").max(60),
  pincode: z.string().trim().regex(/^\d{6}$/, "Pincode must be exactly 6 digits"),
  type: z.enum(["Home", "Work"]),
  deliverySlot: z.enum(["standard", "express"]),
  save: z.boolean().optional(),
});

export const Route = createFileRoute("/checkout/address")({
  head: () => ({
    meta: [{ title: "Delivery address — MediCart" }, { name: "robots", content: "noindex" }],
  }),
  component: AddressStep,
});

function AddressStep() {
  const { user } = useAuth();
  const { cart, savedAddresses, saveAddress } = useStore();
  const navigate = useNavigate();
  const [values, setValues] = useState<Address & { save?: boolean }>(() => {
    const base = {
      fullName: "",
      email: "",
      phone: "",
      line1: "",
      line2: "",
      city: "",
      state: "",
      pincode: "",
      type: "Home" as const,
      deliverySlot: "standard" as const,
      save: true,
    };
    if (typeof window === "undefined") return base;
    try {
      const raw = window.localStorage.getItem(PENDING_ADDRESS);
      if (raw) return { ...base, ...JSON.parse(raw) };
    } catch { /* ignore */ }
    return base;
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (cart.length === 0) navigate({ to: "/cart", replace: true });
  }, [cart.length, navigate]);



  function update<K extends keyof typeof values>(k: K, v: (typeof values)[K]) {
    setValues((p) => ({ ...p, [k]: v }));
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = addressSchema.safeParse(values);
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        errs[issue.path[0] as string] = issue.message;
      }
      setErrors(errs);
      toast.error("Please fix the highlighted fields");
      return;
    }
    
    const hasValidEmail = user?.email && !user.email.endsWith('@medicart.local');
    if (!hasValidEmail && !parsed.data.email) {
      setErrors({ email: "Email is required since it's missing from your profile" });
      toast.error("Please provide an email address");
      return;
    }

    setErrors({});
    const { save, ...address } = parsed.data;
    if (save) saveAddress(address);
    window.localStorage.setItem(PENDING_ADDRESS, JSON.stringify(address));
    navigate({ to: "/checkout/payment" });
  }

  return (
    <CheckoutFrame current="address">
      <form onSubmit={submit} className="space-y-6 rounded-xl border border-border bg-surface p-6">
        {savedAddresses.length > 0 && (
          <div>
            <div className="text-sm font-semibold text-foreground">Saved addresses</div>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {savedAddresses.map((a, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setValues({ ...a, save: false })}
                  className="rounded-lg border border-border bg-background p-3 text-left text-sm hover:border-primary"
                >
                  <div className="font-semibold">{a.fullName} · {a.type}</div>
                  <div className="text-xs text-muted-foreground">
                    {a.line1}, {a.city}, {a.state} — {a.pincode}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        <h2 className="text-lg font-semibold">Delivery address</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Full name" error={errors.fullName}>
            <input
              value={values.fullName}
              onChange={(e) => update("fullName", e.target.value)}
              className={inputClass(!!errors.fullName)}
              maxLength={20}
            />
          </Field>
          <Field label={`Email ${user?.email && !user.email.endsWith('@medicart.local') ? "(from profile)" : "*"}`} error={errors.email}>
            <input
              type="email"
              disabled={!!(user?.email && !user.email.endsWith('@medicart.local'))}
              value={(user?.email && !user.email.endsWith('@medicart.local')) ? user.email : (values as any).email || ""}
              onChange={(e) => update("email" as any, e.target.value)}
              className={inputClass(!!errors.email) + ((user?.email && !user.email.endsWith('@medicart.local')) ? " opacity-50 cursor-not-allowed" : "")}
            />
          </Field>
          <Field label="Phone" error={errors.phone}>
            <input
              value={values.phone}
              onChange={(e) => update("phone", e.target.value)}
              className={inputClass(!!errors.phone)}
              maxLength={10}
            />
          </Field>
          <Field label="Address line 1" error={errors.line1} className="sm:col-span-2">
            <input
              value={values.line1}
              onChange={(e) => update("line1", e.target.value)}
              className={inputClass(!!errors.line1)}
              maxLength={120}
            />
          </Field>
          <Field label="Address line 2 (optional)" className="sm:col-span-2">
            <input
              value={values.line2 ?? ""}
              onChange={(e) => update("line2", e.target.value)}
              className={inputClass(false)}
              maxLength={120}
            />
          </Field>
          <Field label="City" error={errors.city}>
            <input
              value={values.city}
              onChange={(e) => update("city", e.target.value)}
              className={inputClass(!!errors.city)}
              maxLength={60}
            />
          </Field>
          <Field label="State" error={errors.state}>
            <input
              value={values.state}
              onChange={(e) => update("state", e.target.value)}
              className={inputClass(!!errors.state)}
              maxLength={60}
            />
          </Field>
          <Field label="Pincode" error={errors.pincode}>
            <input
              value={values.pincode}
              onChange={(e) => update("pincode", e.target.value)}
              className={inputClass(!!errors.pincode)}
              maxLength={6}
            />
          </Field>
          <Field label="Address type">
            <div className="mt-1 flex gap-2">
              {(["Home", "Work"] as const).map((t) => (
                <button
                  type="button"
                  key={t}
                  onClick={() => update("type", t)}
                  className={`flex-1 rounded-md border px-3 py-2 text-sm ${
                    values.type === t
                      ? "border-primary bg-primary-soft text-primary"
                      : "border-border bg-background text-foreground"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </Field>
        </div>

        <div>
          <h3 className="text-sm font-semibold">Delivery slot</h3>
          <div className="mt-2 grid gap-3 sm:grid-cols-2">
            <SlotOption
              selected={values.deliverySlot === "standard"}
              title="Standard"
              subtitle="Delivered in 2–3 days"
              price="Free over ₹499"
              onClick={() => update("deliverySlot", "standard")}
            />
            <SlotOption
              selected={values.deliverySlot === "express"}
              title="Express"
              subtitle="Next-day delivery"
              price="₹79"
              onClick={() => update("deliverySlot", "express")}
            />
          </div>
        </div>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={!!values.save}
            onChange={(e) => update("save", e.target.checked)}
            className="accent-primary"
          />
          Save this address for future orders
        </label>

        <div className="flex justify-end">
          <button
            type="submit"
            className="rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
          >
            Continue to Payment
          </button>
        </div>
      </form>
    </CheckoutFrame>
  );
}

function Field({
  label,
  error,
  children,
  className = "",
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </label>
      <div className="mt-1">{children}</div>
      {error && <div className="mt-1 text-xs text-destructive">{error}</div>}
    </div>
  );
}

function inputClass(err: boolean) {
  return `w-full rounded-md border ${
    err ? "border-destructive" : "border-input"
  } bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20`;
}

function SlotOption({
  selected,
  title,
  subtitle,
  price,
  onClick,
}: {
  selected: boolean;
  title: string;
  subtitle: string;
  price: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-lg border p-4 text-left ${
        selected ? "border-primary bg-primary-soft" : "border-border bg-background"
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="text-sm font-semibold">{title}</div>
        <div className="text-sm font-semibold text-primary">{price}</div>
      </div>
      <div className="mt-1 text-xs text-muted-foreground">{subtitle}</div>
    </button>
  );
}
