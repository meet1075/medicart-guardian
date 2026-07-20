import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { PublicLayout } from "@/components/PublicLayout";
import { MedicineVisual } from "@/components/MedicineVisual";
import { MedicineCard } from "@/components/MedicineCard";
import { getMedicineByIdFn } from "@/api/medicines";
import { useMedicines } from "@/hooks/use-medicines";
import { useStore } from "@/lib/store";
import { toast } from "sonner";
import { useNavigate } from "@tanstack/react-router";
import { FileText, ShieldCheck, Info } from "lucide-react";

import { getSeoMeta } from "@/lib/seo";

export const Route = createFileRoute("/product/$id")({
  loader: async ({ params }) => {
    const res = await getMedicineByIdFn({ data: { id: params.id } });
    if (res.status === "error" || !res.data) throw notFound();
    return { medicine: res.data as any };
  },
  head: ({ loaderData }) => {
    if (!loaderData?.medicine) return { meta: [{ title: "Medicine — MediCart" }] };
    
    const seo = getSeoMeta({
      title: `${loaderData.medicine.name} — ${loaderData.medicine.salt} | MediCart`,
      description: `${loaderData.medicine.name} (${loaderData.medicine.salt}) - Buy online at MediCart.`,
      path: `/product/${loaderData.medicine.id}`,
      type: "product",
    });

    return {
      meta: seo.meta,
      links: seo.links,
    };
  },
  component: ProductPage,
});

function ProductPage() {
  const { medicine } = Route.useLoaderData();
  const { addToCart } = useStore();
  const navigate = useNavigate();

  return (
    <PublicLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org/",
            "@type": "Product",
            name: medicine.name,
            description: `${medicine.name} (${medicine.salt})`,
            sku: medicine.id,
            offers: {
              "@type": "Offer",
              url: `https://obatmedicare.com/product/${medicine.id}`,
              priceCurrency: "INR",
              price: medicine.mrp,
              availability: medicine.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
              itemCondition: "https://schema.org/NewCondition"
            }
          }),
        }}
      />
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
              {medicine.salt} · <span className="font-medium">{medicine.brand}</span>
            </p>

            <div className="mt-5 flex items-baseline gap-3">
              <span className="text-3xl font-bold text-foreground">₹{medicine.mrp}</span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">MRP incl. of all taxes · {medicine.packSize}</p>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                disabled={!medicine.inStock}
                onClick={() => {
                  if (!medicine.inStock) return;
                  addToCart(medicine.id);
                  toast.success(`${medicine.name} added to cart`);
                }}
                className={`flex-1 rounded-md border px-6 py-3 text-sm font-semibold transition-colors ${
                  medicine.inStock 
                    ? "border-primary text-primary hover:bg-primary hover:text-primary-foreground" 
                    : "border-border text-muted-foreground opacity-50 cursor-not-allowed"
                }`}
              >
                {medicine.inStock ? "Add to cart" : "Out of stock"}
              </button>
              <button
                type="button"
                disabled={!medicine.inStock}
                onClick={() => {
                  if (!medicine.inStock) return;
                  addToCart(medicine.id);
                  navigate({ to: "/cart" });
                }}
                className={`flex-1 rounded-md px-6 py-3 text-sm font-semibold transition-colors ${
                  medicine.inStock 
                    ? "bg-primary text-primary-foreground hover:bg-primary/90" 
                    : "bg-surface-muted text-muted-foreground opacity-50 cursor-not-allowed"
                }`}
              >
                {medicine.inStock ? "Buy now" : "Unavailable"}
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

          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
