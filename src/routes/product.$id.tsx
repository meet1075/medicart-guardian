import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { PublicLayout } from "@/components/PublicLayout";
import { MedicineVisual } from "@/components/MedicineVisual";
import { MedicineCard } from "@/components/MedicineCard";
import { getMedicine, MEDICINES } from "@/lib/medicines";
import { useStore } from "@/lib/store";
import { toast } from "sonner";
import { useNavigate } from "@tanstack/react-router";
import { FileText, ShieldCheck, Info } from "lucide-react";

export const Route = createFileRoute("/product/$id")({
  loader: ({ params }) => {
    const medicine = getMedicine(params.id);
    if (!medicine) throw notFound();
    return { medicine };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.medicine.name} — ${loaderData.medicine.salt} | MediCart` },
          { name: "description", content: loaderData.medicine.uses.slice(0, 155) },
          { property: "og:title", content: `${loaderData.medicine.name} — MediCart` },
          { property: "og:description", content: loaderData.medicine.uses.slice(0, 155) },
        ]
      : [{ title: "Medicine — MediCart" }],
  }),
  component: ProductPage,
});

function ProductPage() {
  const { medicine } = Route.useLoaderData();
  const { addToCart } = useStore();
  const navigate = useNavigate();
  const off = Math.max(0, Math.round(((medicine.mrp - medicine.price) / medicine.mrp) * 100));

  const substitutes = MEDICINES.filter(
    (m) => m.id !== medicine.id && m.category === medicine.category,
  ).slice(0, 4);

  return (
    <PublicLayout>
      <div className="container-page py-8">
        <div className="text-xs text-muted-foreground">
          <Link to="/shop" className="hover:text-primary">Shop</Link>{" "}
          <span className="mx-1">/</span> {medicine.name}
        </div>

        <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_1.2fr]">
          <div className="rounded-2xl border border-border bg-surface p-6">
            <div className="mx-auto max-w-md">
              <MedicineVisual medicine={medicine} size="lg" />
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {medicine.prescriptionRequired ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-warning/15 px-2.5 py-1 text-xs font-semibold text-warning-foreground">
                  <FileText size={12} /> Prescription Required
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-full bg-success/15 px-2.5 py-1 text-xs font-semibold text-success">
                  <ShieldCheck size={12} /> OTC — No prescription
                </span>
              )}
              <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                Verified pharmacy
              </span>
            </div>
          </div>

          <div>
            <h1 className="text-2xl font-bold text-foreground md:text-3xl">{medicine.name}</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {medicine.salt} · <span className="font-medium">{medicine.manufacturer}</span>
            </p>

            <div className="mt-5 flex items-baseline gap-3">
              <span className="text-3xl font-bold text-foreground">₹{medicine.price}</span>
              {off > 0 && (
                <>
                  <span className="text-base text-muted-foreground line-through">₹{medicine.mrp}</span>
                  <span className="rounded-md bg-success/15 px-2 py-0.5 text-xs font-semibold text-success">
                    {off}% off
                  </span>
                </>
              )}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">MRP incl. of all taxes · {medicine.packSize}</p>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => {
                  addToCart(medicine.id);
                  toast.success(`${medicine.name} added to cart`);
                }}
                className="flex-1 rounded-md border border-primary px-6 py-3 text-sm font-semibold text-primary hover:bg-primary hover:text-primary-foreground"
              >
                Add to cart
              </button>
              <button
                type="button"
                onClick={() => {
                  addToCart(medicine.id);
                  navigate({ to: "/cart" });
                }}
                className="flex-1 rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
              >
                Buy now
              </button>
            </div>

            {medicine.prescriptionRequired && (
              <div className="mt-4 flex items-start gap-3 rounded-lg border border-warning/30 bg-warning/10 p-3 text-xs text-warning-foreground">
                <Info size={16} className="mt-0.5 flex-none" />
                <div>
                  This medicine requires a valid doctor's prescription. You'll upload one at checkout and
                  our pharmacist will verify it before dispatch.
                </div>
              </div>
            )}

            <div className="mt-8 space-y-5 text-sm">
              <Detail label="Uses" text={medicine.uses} />
              <Detail label="How to use" text={medicine.howToUse} />
              <Detail label="Side effects" text={medicine.sideEffects} />
              <Detail label="Safety advice" text={medicine.safety} />
            </div>
          </div>
        </div>

        {substitutes.length > 0 && (
          <section className="mt-14">
            <h2 className="text-xl font-bold text-foreground">Substitutes & related</h2>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {substitutes.map((s) => (
                <MedicineCard key={s.id} medicine={s} />
              ))}
            </div>
          </section>
        )}
      </div>
    </PublicLayout>
  );
}

function Detail({ label, text }: { label: string; text: string }) {
  return (
    <div>
      <div className="text-xs font-semibold uppercase tracking-wider text-primary">{label}</div>
      <p className="mt-1.5 text-foreground/85">{text}</p>
    </div>
  );
}
