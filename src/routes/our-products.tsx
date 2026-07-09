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
import { useState } from "react";

export const Route = createFileRoute("/our-products")({
  head: () => ({
    meta: [
      { title: "Our Products — Obat Medicare | MediCart" },
      {
        name: "description",
        content:
          "Explore the Obat Medicare pharmaceutical product range — dermatology, general medicine, cardiac-diabetic, gastroenterology, and orthopaedics formulations.",
      },
    ],
  }),
  component: OurProductsPage,
});

// ── Product Data ──────────────────────────────────────────────────────────────
type Category =
  | "dermatology"
  | "general"
  | "gastro"
  | "ortho"
  | "cardiac";

interface Product {
  name: string;
  category: Category;
  form: string;
  description: string;
}

const PRODUCTS: Product[] = [
  // Dermatology
  { name: "BYVIGO Cream", category: "dermatology", form: "Cream", description: "Advanced topical formulation for skin conditions." },
  { name: "BRIGHTEN UP", category: "dermatology", form: "Serum", description: "Brightening and depigmentation skincare solution." },
  { name: "BYESCAB", category: "dermatology", form: "Lotion", description: "Anti-scabies treatment lotion." },
  { name: "BYEZBAC Face Wash", category: "dermatology", form: "Face Wash", description: "Antibacterial face wash for acne-prone skin." },
  { name: "BYEZBAC Lotion", category: "dermatology", form: "Lotion", description: "Antibacterial body lotion." },
  { name: "BYEZBAC Ointment", category: "dermatology", form: "Ointment", description: "Topical antibacterial ointment." },
  { name: "OBATDERM Cream", category: "dermatology", form: "Cream", description: "Multi-action dermatology cream." },
  { name: "KETOMAX Shampoo", category: "dermatology", form: "Shampoo", description: "Anti-dandruff medicated shampoo." },
  { name: "CLOTRIZOLE Cream", category: "dermatology", form: "Cream", description: "Antifungal topical cream." },
  { name: "TACRO-0.03 Ointment", category: "dermatology", form: "Ointment", description: "Immunomodulator for eczema." },
  { name: "CALAMINE Plus Lotion", category: "dermatology", form: "Lotion", description: "Calamine-based soothing lotion." },
  { name: "SALICYL-6 Gel", category: "dermatology", form: "Gel", description: "Salicylic acid gel for psoriasis and acne." },
  { name: "TRETINOIN 0.025% Cream", category: "dermatology", form: "Cream", description: "Retinoid cream for anti-aging and acne." },
  { name: "DERMOCORT Cream", category: "dermatology", form: "Cream", description: "Corticosteroid cream for inflammatory skin disorders." },
  // General Medicine
  { name: "AMOXYCILLIN 500", category: "general", form: "Capsule", description: "Broad-spectrum penicillin antibiotic." },
  { name: "AZITHROMYCIN 250", category: "general", form: "Tablet", description: "Macrolide antibiotic for respiratory infections." },
  { name: "CETIRIZINE 10", category: "general", form: "Tablet", description: "Antihistamine for allergy relief." },
  { name: "PARACETAMOL 650", category: "general", form: "Tablet", description: "Analgesic and antipyretic." },
  { name: "IBUPROFEN 400", category: "general", form: "Tablet", description: "NSAID for pain and inflammation." },
  { name: "DEXTROMETHORPHAN Syrup", category: "general", form: "Syrup", description: "Cough suppressant syrup." },
  { name: "MONTELUKAST 10", category: "general", form: "Tablet", description: "Leukotriene antagonist for asthma." },
  { name: "ONDANSETRON 4", category: "general", form: "Tablet", description: "Antiemetic for nausea and vomiting." },
  // Gastroenterology
  { name: "RABEPRAZOLE 20", category: "gastro", form: "Tablet", description: "Proton pump inhibitor for acid reflux and ulcers." },
  { name: "PANTOPRAZOLE 40", category: "gastro", form: "Tablet", description: "PPI for GERD and peptic ulcer." },
  // Orthopaedics
  { name: "DICLOFENAC GEL 1%", category: "ortho", form: "Gel", description: "Topical NSAID for joint and muscle pain." },
  { name: "METHYL SALICYLATE Cream", category: "ortho", form: "Cream", description: "Topical analgesic for musculoskeletal pain." },
  // Cardiac-Diabetic
  { name: "ATORVASTATIN 10", category: "cardiac", form: "Tablet", description: "Statin for lowering cholesterol." },
  { name: "TELMISARTAN 40", category: "cardiac", form: "Tablet", description: "ARB for hypertension management." },
  { name: "AMLODIPINE 5", category: "cardiac", form: "Tablet", description: "Calcium channel blocker for blood pressure." },
  { name: "METOPROLOL 25", category: "cardiac", form: "Tablet", description: "Beta-blocker for cardiac conditions." },
  { name: "GLIMEPIRIDE 1", category: "cardiac", form: "Tablet", description: "Sulfonylurea for type 2 diabetes." },
  { name: "METFORMIN 500", category: "cardiac", form: "Tablet", description: "Biguanide for blood glucose control." },
  { name: "SITAGLIPTIN 100", category: "cardiac", form: "Tablet", description: "DPP-4 inhibitor for type 2 diabetes." },
  { name: "ASPIRIN 75", category: "cardiac", form: "Tablet", description: "Antiplatelet for cardiovascular prevention." },
  { name: "CLOPIDOGREL 75", category: "cardiac", form: "Tablet", description: "Antiplatelet agent." },
  { name: "RAMIPRIL 5", category: "cardiac", form: "Tablet", description: "ACE inhibitor for heart failure and hypertension." },
];

const CATEGORIES: {
  id: Category | "all";
  label: string;
  icon: React.ElementType;
  count: number;
}[] = [
  { id: "all", label: "All Products", icon: FlaskConical, count: PRODUCTS.length },
  {
    id: "dermatology",
    label: "Dermatology",
    icon: Heart,
    count: PRODUCTS.filter((p) => p.category === "dermatology").length,
  },
  {
    id: "general",
    label: "General Medicine",
    icon: Pill,
    count: PRODUCTS.filter((p) => p.category === "general").length,
  },
  {
    id: "gastro",
    label: "Gastroenterology",
    icon: Activity,
    count: PRODUCTS.filter((p) => p.category === "gastro").length,
  },
  {
    id: "ortho",
    label: "Orthopaedics",
    icon: Bone,
    count: PRODUCTS.filter((p) => p.category === "ortho").length,
  },
  {
    id: "cardiac",
    label: "Cardiac-Diabetic",
    icon: Stethoscope,
    count: PRODUCTS.filter((p) => p.category === "cardiac").length,
  },
];

const CATEGORY_COLORS: Record<Category, { bg: string; text: string }> = {
  dermatology: { bg: "bg-warning/10", text: "text-warning-foreground" },
  general: { bg: "bg-primary/10", text: "text-primary" },
  gastro: { bg: "bg-success/10", text: "text-success" },
  ortho: { bg: "bg-info/10", text: "text-info" },
  cardiac: { bg: "bg-destructive/10", text: "text-destructive" },
};

function OurProductsPage() {
  const [active, setActive] = useState<Category | "all">("all");

  const filtered =
    active === "all"
      ? PRODUCTS
      : PRODUCTS.filter((p) => p.category === active);

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
            {PRODUCTS.length}+ pharmaceutical formulations across dermatology,
            general medicine, cardiac care, and more.
          </p>
        </div>
      </section>

      {/* ── Category Tabs ── */}
      <section className="sticky top-[64px] z-20 border-b border-border bg-surface shadow-sm">
        <div className="container-page">
          <div className="flex gap-0 overflow-x-auto">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isActive = active === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActive(cat.id as Category | "all")}
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
                    {cat.count}
                  </span>
                </button>
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
          {filtered.map((product) => {
            const colors = CATEGORY_COLORS[product.category];
            return (
              <div
                key={`${product.name}-${product.category}`}
                className="group flex flex-col rounded-xl border border-border bg-surface p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md"
              >
                {/* Category pill */}
                <span
                  className={`self-start rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${colors.bg} ${colors.text}`}
                >
                  {product.category === "gastro"
                    ? "Gastroenterology"
                    : product.category === "ortho"
                    ? "Orthopaedics"
                    : product.category === "cardiac"
                    ? "Cardiac-Diabetic"
                    : product.category.charAt(0).toUpperCase() +
                      product.category.slice(1)}
                </span>

                {/* Icon */}
                <div className="mt-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary-soft text-primary">
                  <FlaskConical size={22} />
                </div>

                <h3 className="mt-4 font-bold text-foreground leading-snug">
                  {product.name}
                </h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  {product.form}
                </p>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground flex-1">
                  {product.description}
                </p>

                <div className="mt-4 border-t border-border pt-3">
                  <a
                    href={`tel:+919650506996`}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
                  >
                    <Phone size={11} /> Enquire
                  </a>
                </div>
              </div>
            );
          })}
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
