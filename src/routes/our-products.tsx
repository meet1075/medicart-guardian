import { createFileRoute, Link } from "@tanstack/react-router";
import { PublicLayout } from "@/components/PublicLayout";
import {
  FlaskConical,
  Heart,
  Pill,
  Activity,
  Stethoscope,
  Bone,
  ArrowRight,
  ShoppingBag,
  Phone,
} from "lucide-react";
import { useState, useEffect } from "react";
import { z } from "zod";

import { getSeoMeta } from "@/lib/seo";
import { useMedicines } from "@/hooks/use-medicines";

const searchSchema = z.object({
  category: z.enum(["dermatology", "general", "gastro", "ortho", "cardiac", "gynae"]).optional(),
});

export const Route = createFileRoute("/our-products")({
  validateSearch: (s) => searchSchema.parse(s),
  head: () => {
    const seo = getSeoMeta({
      title: "Our Products — Obat Medicare",
      description: "Explore the Obat Medicare pharmaceutical product range — dermatology, general medicine, cardiac-diabetic, gastroenterology, and orthopaedics formulations.",
      path: "/our-products",
      jsonLd: [
        {
          "@context": "https://schema.org",
          "@type": "ItemList",
          "name": "Our Products — Obat Medicare",
          "description": "Explore the Obat Medicare pharmaceutical product range.",
          "url": "https://obatmedicare.in/our-products"
        }
      ]
    });
    return {
      meta: seo.meta,
      links: seo.links,
      scripts: seo.scripts,
    };
  },
  component: OurProductsPage,
});



// ── Product Data ──────────────────────────────────────────────────────────────
type Category =
  | "dermatology"
  | "general"
  | "gastro"
  | "ortho"
  | "cardiac"
  | "gynae";

const CATEGORIES: {
  id: Category | "all";
  label: string;
  icon: React.ElementType;
}[] = [
  { id: "all", label: "All Products", icon: FlaskConical },
  { id: "dermatology", label: "Dermatology", icon: Heart },
  { id: "general", label: "General Medicine", icon: Pill },
  { id: "gastro", label: "Gastroenterology", icon: Activity },
  { id: "ortho", label: "Orthopaedics", icon: Bone },
  { id: "cardiac", label: "Cardiac-Diabetic", icon: Stethoscope },
  { id: "gynae", label: "Gynaecology", icon: Activity },
];

const CATEGORY_COLORS: Record<Category, { bg: string; text: string }> = {
  dermatology: { bg: "bg-warning/10", text: "text-warning-foreground" },
  general: { bg: "bg-primary/10", text: "text-primary" },
  gastro: { bg: "bg-success/10", text: "text-success" },
  ortho: { bg: "bg-info/10", text: "text-info" },
  cardiac: { bg: "bg-destructive/10", text: "text-destructive" },
  gynae: { bg: "bg-pink-500/10", text: "text-pink-600" },
};

function OurProductsPage() {
  const { category: queryCategory } = Route.useSearch();
  const { medicines, isLoading } = useMedicines();
  const [active, setActive] = useState<Category | "all">(queryCategory || "all");

  useEffect(() => {
    if (queryCategory) {
      setActive(queryCategory);
    } else {
      setActive("all");
    }
  }, [queryCategory]);

  const filtered =
    active === "all"
      ? medicines
      : medicines.filter((p) => (p.category || "general").split(",").includes(active));

  return (
    <PublicLayout>
      {/* ── Hero ── */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary/70 to-primary/50" />
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle at 25% 50%, white 1px, transparent 1px),
              radial-gradient(circle at 75% 20%, white 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
        <div className="container-page relative py-20 text-center text-white md:py-28">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest backdrop-blur">
            <FlaskConical size={13} /> Pharmaceutical Formulations
          </div>
          <h1 className="mt-5 text-4xl font-bold tracking-tight md:text-5xl">
            Our Products
          </h1>
          <p className="mt-4 mx-auto max-w-xl text-base text-white/80">
            {medicines.length}+ pharmaceutical formulations across dermatology,
            general medicine, cardiac care, and more.
          </p>
        </div>
      </section>

      {/* ── Category Tabs ── */}
      <section className="sticky top-[64px] z-20 border-b border-border bg-surface shadow-sm">
        <div className="w-full px-2 md:px-6 lg:px-8 mx-auto max-w-[1920px]">
          <div className="flex items-center justify-center gap-x-1 md:gap-x-4 overflow-x-auto scrollbar-hide">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isActive = active === cat.id;
              const count = cat.id === "all" ? medicines.length : medicines.filter((m) => (m.category || "general").split(",").includes(cat.id)).length;
              return (
                <Link
                  key={cat.id}
                  to="/our-products"
                  search={{ category: cat.id === "all" ? undefined : cat.id }}
                  className={`flex shrink-0 items-center gap-2 border-b-2 px-4 py-4 text-xs font-semibold uppercase tracking-wider transition-colors ${
                    isActive
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Icon size={14} />
                  {cat.label}
                  <span
                    className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "bg-surface-muted text-muted-foreground"
                    }`}
                  >
                    {count}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Product Grid ── */}
      <section className="container-page py-12">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing{" "}
            <span className="font-semibold text-foreground">
              {filtered.length}
            </span>{" "}
            product{filtered.length !== 1 ? "s" : ""}
            {active !== "all" && (
              <> in <span className="font-semibold text-foreground capitalize">{active}</span></>
            )}
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filtered.map((product) => (
            <ProductFlipCard key={`${product.name}-${product.category || "general"}`} product={product} />
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-surface-muted py-16">
        <div className="container-page">
          <div className="overflow-hidden rounded-2xl bg-primary p-10 md:p-14">
            <div className="grid gap-8 md:grid-cols-2 md:items-center">
              <div className="text-white">
                <div className="text-xs font-semibold uppercase tracking-widest text-white/70">
                  Looking for these products?
                </div>
                <h2 className="mt-2 text-2xl font-bold md:text-3xl">
                  Order medicines directly from our online pharmacy
                </h2>
                <p className="mt-3 text-sm text-white/80">
                  Browse our e-commerce store to order prescription and OTC
                  medicines with pharmacist verification and fast home delivery.
                </p>
              </div>
              <div className="flex flex-wrap gap-4 md:justify-end">
                <Link
                  to="/shop"
                  className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-primary hover:bg-white/90"
                >
                  <ShoppingBag size={16} /> Shop Now
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur hover:bg-white/20"
                >
                  <Phone size={16} /> Contact Us <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}

function ProductFlipCard({ product }: { product: any }) {
  const [flipped, setFlipped] = useState(false);
  
  const cats = (product.category || "general").split(",");
  
  const getCategoryName = (cat: string) => {
    return cat === "gastro"
      ? "Gastroenterology"
      : cat === "ortho"
      ? "Orthopaedics"
      : cat === "cardiac"
      ? "Cardiac-Diabetic"
      : cat === "gynae"
      ? "Gynaecology"
      : cat.charAt(0).toUpperCase() + cat.slice(1);
  };

  return (
    <div 
      className="group relative h-[340px] w-full cursor-pointer" 
      style={{ perspective: "1000px" }}
      onClick={() => setFlipped(!flipped)}
    >
      <div 
        className="relative h-full w-full rounded-xl transition-all duration-500"
        style={{ 
          transformStyle: "preserve-3d",
          transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)"
        }}
      >
        {/* Front */}
        <div 
          className="absolute inset-0 flex flex-col rounded-xl border border-border bg-surface p-5 shadow-sm hover:border-primary/30 hover:shadow-md"
          style={{ backfaceVisibility: "hidden" }}
        >
           <div className="flex flex-wrap gap-1 mb-2">
             {cats.map((c: string) => {
               const colors = CATEGORY_COLORS[c as Category] || CATEGORY_COLORS.general;
               return (
                 <span key={c} className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${colors.bg} ${colors.text}`}>
                   {getCategoryName(c)}
                 </span>
               );
             })}
           </div>
           {product.imageUrl ? (
              <div className="mt-4 flex h-32 w-full items-center justify-center rounded-xl bg-surface-muted overflow-hidden">
                <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover mix-blend-multiply" />
              </div>
            ) : (
              <div className="mt-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary-soft text-primary">
                <FlaskConical size={22} />
              </div>
            )}
            <h3 className="mt-4 font-bold text-foreground leading-snug">
              {product.name}
            </h3>
            <p className="mt-1 text-xs text-muted-foreground">
              {product.dosageForm}
            </p>
            <div className="mt-auto pt-3 border-t border-border text-[10px] uppercase font-bold tracking-wider text-muted-foreground flex justify-between items-center opacity-70 group-hover:opacity-100 transition-opacity">
               <span>Tap to view ingredients</span>
               <ArrowRight size={12} />
            </div>
        </div>

        {/* Back */}
        <div 
          className="absolute inset-0 flex flex-col rounded-xl border border-primary bg-primary p-6 shadow-lg text-primary-foreground overflow-y-auto"
          style={{ 
            backfaceVisibility: "hidden", 
            transform: "rotateY(180deg)" 
          }}
        >
          <div className="flex flex-col h-full">
            <div className="mb-4 flex flex-wrap gap-1">
              {cats.map((c: string) => (
                <span key={c} className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide bg-white/20 text-white`}>
                 {getCategoryName(c)}
                </span>
              ))}
            </div>
            
            <h3 className="font-bold text-xl mb-1">{product.name}</h3>
            <p className="text-primary-foreground/70 text-xs mb-4 font-medium uppercase tracking-wider">Obat Medicare</p>
            
            <div className="text-xs font-bold text-primary-foreground/90 uppercase tracking-wide mb-2 border-b border-primary-foreground/20 pb-1">
              Active Ingredients
            </div>
            <p className="text-sm leading-relaxed">
              {product.salt}
            </p>

            <div className="mt-auto pt-4 text-[10px] uppercase font-bold tracking-wider text-primary-foreground/70 text-center opacity-70 hover:opacity-100 transition-opacity">
               Tap to flip back
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
