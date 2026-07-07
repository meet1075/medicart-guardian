import { createFileRoute, Link } from "@tanstack/react-router";
import { PublicLayout } from "@/components/PublicLayout";
import { TrustStrip } from "@/components/TrustStrip";
import { MedicineCard } from "@/components/MedicineCard";
import { CategoryVisual } from "@/components/MedicineVisual";
import { CATEGORIES, HEALTH_CONCERNS, MEDICINES } from "@/lib/medicines";
import { ArrowRight, Search, ShieldCheck } from "lucide-react";
import heroImg from "@/assets/hero-pharmacy.jpg";
import { useState } from "react";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  return (
    <PublicLayout>
      <Hero />
      <section className="container-page py-10">
        <TrustStrip />
      </section>

      <section className="container-page py-10">
        <SectionHeading eyebrow="Browse" title="Shop by category" />
        <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
          {CATEGORIES.map((c) => (
            <Link
              key={c.id}
              to="/shop"
              search={{ category: c.id }}
              className="group flex flex-col items-center gap-3 rounded-xl border border-border bg-surface p-5 text-center transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-soft group-hover:bg-primary/10">
                <CategoryVisual id={c.id} size={28} />
              </div>
              <div>
                <div className="text-sm font-semibold text-foreground">{c.label}</div>
                <div className="mt-0.5 text-[11px] text-muted-foreground">{c.description}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="container-page py-10">
        <SectionHeading eyebrow="Personalized" title="Shop by health concern" />
        <div className="mt-6 flex flex-wrap gap-3">
          {HEALTH_CONCERNS.map((h) => (
            <Link
              key={h.id}
              to="/shop"
              search={{ concern: h.id }}
              className="rounded-full border border-border bg-surface px-5 py-2.5 text-sm font-medium text-foreground/80 transition-colors hover:border-primary hover:bg-primary-soft hover:text-primary"
            >
              {h.label}
            </Link>
          ))}
        </div>
      </section>

      <section className="container-page py-10">
        <div className="flex items-end justify-between gap-4">
          <SectionHeading eyebrow="Popular" title="Bestselling essentials" />
          <Link to="/shop" className="hidden items-center gap-1 text-sm font-semibold text-primary hover:underline sm:flex">
            See all <ArrowRight size={14} />
          </Link>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {MEDICINES.slice(0, 8).map((m) => (
            <MedicineCard key={m.id} medicine={m} />
          ))}
        </div>
      </section>

      <section className="container-page py-14">
        <div className="grid gap-8 rounded-2xl border border-border bg-primary-soft/50 p-8 md:grid-cols-[1.2fr_1fr] md:items-center md:p-12">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
              <ShieldCheck size={14} /> Verified by pharmacist
            </div>
            <h2 className="mt-4 text-2xl font-bold text-foreground md:text-3xl">
              Every prescription is reviewed by a licensed pharmacist
            </h2>
            <p className="mt-3 max-w-lg text-sm text-muted-foreground">
              Upload your prescription at checkout and our on-staff pharmacist verifies it before your
              order ships — usually within a few hours.
            </p>
            <Link
              to="/shop"
              className="mt-6 inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
            >
              Start shopping <ArrowRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {["Diabetes care", "Cardiac care", "Immunity", "Family essentials"].map((t) => (
              <div key={t} className="rounded-xl bg-surface p-4">
                <div className="text-xs font-semibold uppercase tracking-wider text-primary">MediCart</div>
                <div className="mt-1 text-sm font-semibold text-foreground">{t}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}

function Hero() {
  const [q, setQ] = useState("");
  return (
    <section className="relative overflow-hidden border-b border-border bg-gradient-to-br from-primary-soft/40 via-background to-background">
      <div className="container-page grid gap-10 py-10 lg:grid-cols-[1.15fr_1fr] lg:items-center lg:py-16">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
            <ShieldCheck size={13} /> Licensed & pharmacist-verified
          </div>
          <h1 className="mt-4 text-4xl font-bold leading-tight tracking-tight text-foreground md:text-5xl lg:text-[3.4rem]">
            Genuine medicines,{" "}
            <span className="text-primary">verified &amp; delivered.</span>
          </h1>
          <p className="mt-4 max-w-xl text-base text-muted-foreground">
            Prescription and over-the-counter medicines from trusted brands — each order reviewed by our
            in-house pharmacist and delivered securely to your door.
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              window.location.assign(`/shop?q=${encodeURIComponent(q)}`);
            }}
            className="mt-7 flex items-center rounded-xl border border-border bg-surface shadow-sm focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20"
          >
            <Search size={20} className="ml-4 text-muted-foreground" />
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search for medicines, brands, or health concerns"
              className="flex-1 bg-transparent px-3 py-3.5 text-sm outline-none placeholder:text-muted-foreground"
            />
            <button
              type="submit"
              className="m-1 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
            >
              Search
            </button>
          </form>

          <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
            <span>Trusted by 1M+ families</span>
            <span aria-hidden>•</span>
            <span>Free delivery over ₹499</span>
            <span aria-hidden>•</span>
            <span>7-day return on damaged items</span>
          </div>
        </div>

        <div className="relative">
          <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-lg">
            <img
              src={heroImg}
              alt="Genuine medicines from a licensed pharmacy — pill bottles, blister packs, and a mortar and pestle on a warm neutral surface"
              width={1600}
              height={1100}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="absolute -bottom-4 left-4 right-4 rounded-xl border border-border bg-surface p-4 shadow-md md:-bottom-6 md:left-6 md:right-auto md:max-w-xs">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-success/15 text-success">
                <ShieldCheck size={20} />
              </div>
              <div>
                <div className="text-sm font-semibold text-foreground">Pharmacist on staff</div>
                <div className="text-xs text-muted-foreground">Every Rx reviewed before dispatch</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SectionHeading({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div>
      <div className="text-xs font-semibold uppercase tracking-widest text-primary">{eyebrow}</div>
      <h2 className="mt-1 text-2xl font-bold text-foreground md:text-3xl">{title}</h2>
    </div>
  );
}
