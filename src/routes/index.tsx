import { createFileRoute, Link } from "@tanstack/react-router";
import { PublicLayout } from "@/components/PublicLayout";
import { MedicineCard } from "@/components/MedicineCard";
import { useMedicines } from "@/hooks/use-medicines";
import {
  ArrowRight,
  ShieldCheck,
  Target,
  Eye,
  FlaskConical,
  Globe,
  Heart,
  Pill,
  Activity,
  Stethoscope,
  Bone,
  CheckCircle2,
  Award,
  HeartPulse,
} from "lucide-react";
import heroImg from "@/assets/hero-pharmacy.jpg";

export const Route = createFileRoute("/")({
  component: LandingPage,
});

function LandingPage() {
  const { medicines, isLoading } = useMedicines();
  
  return (
    <PublicLayout>
      {/* ── 1. Premium Hero Section ── */}
      <section className="relative overflow-hidden bg-surface">
        {/* Abstract Background Elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute -top-[20%] -left-[10%] h-[60%] w-[50%] rounded-full bg-primary/10 blur-[120px]" />
          <div className="absolute top-[40%] -right-[10%] h-[50%] w-[40%] rounded-full bg-info/10 blur-[100px]" />
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, var(--color-foreground) 1px, transparent 0)`,
              backgroundSize: "40px 40px",
            }}
          />
        </div>

        <div className="container-page relative z-10 grid gap-12 py-16 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:py-24">
          <div className="max-w-2xl">
            <div className="inline-flex animate-in fade-in slide-in-from-bottom-4 duration-700 items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
              <Award size={14} /> Obat Medicare Pvt Ltd
            </div>
            <h1 className="mt-6 animate-in fade-in slide-in-from-bottom-5 duration-700 delay-150 text-5xl font-extrabold leading-[1.1] tracking-tight text-foreground md:text-6xl lg:text-[4rem]">
              Your Health, <br />
              <span className="bg-gradient-to-r from-primary to-info bg-clip-text text-transparent">
                Our Priority.
              </span>
            </h1>
            <p className="mt-6 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-300 text-lg leading-relaxed text-muted-foreground">
              A third-generation super-specialty pharmaceutical company dedicated
              to redefining healthcare delivery through quality, innovation, and
              unwavering ethical practices.
            </p>

            <div className="mt-10 animate-in fade-in slide-in-from-bottom-7 duration-700 delay-500 flex flex-wrap items-center gap-4">
              <Link
                to="/our-products"
                className="inline-flex h-12 items-center gap-2 rounded-xl bg-primary px-8 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-primary/40"
              >
                Explore Formulations <ArrowRight size={16} />
              </Link>
              <Link
                to="/shop"
                className="inline-flex h-12 items-center gap-2 rounded-xl border border-border bg-surface px-8 text-sm font-semibold text-foreground transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:bg-primary-soft hover:text-primary"
              >
                Online Pharmacy
              </Link>
            </div>
          </div>

          <div className="relative animate-in fade-in zoom-in-95 duration-1000 delay-300">
            {/* Glassmorphism image container */}
            <div className="relative overflow-hidden rounded-3xl border border-border bg-surface/50 p-2 shadow-2xl backdrop-blur-xl">
              <img
                src={heroImg}
                alt="Pharmaceutical formulations and quality control"
                className="aspect-[4/3] w-full rounded-2xl object-cover"
              />
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-primary/20 via-transparent to-transparent opacity-60" />
            </div>

            {/* Floating Trust Badge */}
            <div className="absolute -bottom-6 -left-6 rounded-2xl border border-border bg-surface/80 p-5 shadow-xl backdrop-blur-md supports-[backdrop-filter]:bg-surface/60 md:bottom-10 md:-left-12">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-success/15 text-success">
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <div className="text-sm font-bold text-foreground">
                    GMP Certified
                  </div>
                  <div className="text-xs text-muted-foreground">
                    World-class quality control
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. Company Identity & Stats ── */}
      <section className="border-y border-border bg-surface-muted">
        <div className="container-page py-12 md:py-16">
          <div className="grid grid-cols-2 divide-x divide-border md:grid-cols-4">
            {[
              { value: "2016", label: "Founded", sub: "Third-gen enterprise" },
              { value: "5+", label: "Specialties", sub: "Medical departments" },
              { value: "90+", label: "Products", sub: "Active formulations" },
              { value: "Global", label: "Reach", sub: "Pan-India & Beyond" },
            ].map((s, i) => (
              <div
                key={s.label}
                className={`px-4 text-center md:px-8 ${
                  i === 0 ? "pl-0" : ""
                } ${i === 3 ? "pr-0 border-r-0" : ""}`}
              >
                <div className="text-3xl font-extrabold text-foreground md:text-4xl">
                  {s.value}
                </div>
                <div className="mt-2 text-sm font-bold uppercase tracking-wider text-primary">
                  {s.label}
                </div>
                <div className="mt-1 text-xs text-muted-foreground">{s.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. Mission & Vision (Glass Cards) ── */}
      <section className="relative overflow-hidden py-20 md:py-28">
        <div className="container-page relative z-10">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-foreground md:text-4xl">
              Our Purpose
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              We are driven by a commitment to make quality healthcare accessible,
              blending decades of industry wisdom with modern medical innovation.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:gap-10">
            <div className="group relative overflow-hidden rounded-3xl border border-border bg-surface p-8 shadow-sm transition-all hover:shadow-lg lg:p-10">
              <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/5 transition-transform duration-500 group-hover:scale-150" />
              <div className="relative z-10">
                <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-md">
                  <Target size={28} />
                </div>
                <h3 className="mt-6 text-2xl font-bold text-foreground">
                  Our Mission
                </h3>
                <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                  To make quality healthcare accessible and affordable for all
                  by developing and delivering pharmaceutical products that
                  address real-world health challenges with{" "}
                  <strong className="font-semibold text-foreground">
                    integrity, innovation, and compassion.
                  </strong>
                </p>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-3xl border border-border bg-surface p-8 shadow-sm transition-all hover:shadow-lg lg:p-10">
              <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-info/5 transition-transform duration-500 group-hover:scale-150" />
              <div className="relative z-10">
                <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-info text-info-foreground shadow-md">
                  <Eye size={28} />
                </div>
                <h3 className="mt-6 text-2xl font-bold text-foreground">
                  Our Vision
                </h3>
                <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                  To be a trusted global healthcare partner, recognized for our{" "}
                  <strong className="font-semibold text-foreground">
                    ethical practices and scientific excellence
                  </strong>
                  , with an unwavering commitment to improving the lives of
                  patients worldwide.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. Core Specialties ── */}
      <section className="bg-surface-muted py-20 md:py-28">
        <div className="container-page">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-xl">
              <div className="text-xs font-bold uppercase tracking-widest text-primary">
                Formulations
              </div>
              <h2 className="mt-2 text-3xl font-bold text-foreground md:text-4xl">
                Super-Specialty Departments
              </h2>
              <p className="mt-4 text-muted-foreground">
                We manufacture and distribute over 90 advanced formulations across
                5 critical healthcare domains.
              </p>
            </div>
            <Link
              to="/our-products"
              className="group inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80"
            >
              View Full Catalog
              <ArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
          </div>

          <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5 lg:gap-6">
            {[
              { id: "dermatology", icon: Heart, label: "Dermatology", count: 61 },
              { id: "general", icon: Pill, label: "General Medicine", count: 22 },
              { id: "cardiac", icon: Stethoscope, label: "Cardiac-Diabetic", count: 11 },
              { id: "gastro", icon: Activity, label: "Gastroenterology", count: 1 },
              { id: "ortho", icon: Bone, label: "Orthopaedics", count: 1 },
            ].map((cat) => {
              const Icon = cat.icon;
              return (
                <Link
                  key={cat.id}
                  to="/our-products"
                  className="group relative flex flex-col items-center overflow-hidden rounded-2xl border border-border bg-surface p-6 text-center transition-all hover:-translate-y-1 hover:border-primary/50 hover:shadow-xl"
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-primary/0 to-primary/5 opacity-0 transition-opacity group-hover:opacity-100" />
                  <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full bg-primary-soft text-primary transition-transform group-hover:scale-110">
                    <Icon size={24} />
                  </div>
                  <div className="relative z-10 mt-5 font-bold text-foreground">
                    {cat.label}
                  </div>
                  <div className="relative z-10 mt-1 text-xs font-medium text-muted-foreground">
                    {cat.count} Products
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 5. E-Commerce Integration ── */}
      <section className="py-20 md:py-28">
        <div className="container-page">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="text-xs font-bold uppercase tracking-widest text-primary">
                MediCart Online
              </div>
              <h2 className="mt-2 text-3xl font-bold text-foreground md:text-4xl">
                Order Direct to Home
              </h2>
              <p className="mt-4 max-w-xl text-muted-foreground">
                Purchase authentic Obat Medicare formulations directly through our
                secure online pharmacy portal.
              </p>
            </div>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 rounded-xl bg-foreground px-6 py-3 text-sm font-semibold text-background hover:bg-foreground/90"
            >
              Open Pharmacy <ArrowRight size={16} />
            </Link>
          </div>

          <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 lg:gap-6">
            {isLoading ? (
              <div className="col-span-full py-10 text-center text-muted-foreground animate-pulse">
                Loading medicines...
              </div>
            ) : (
              medicines.slice(0, 4).map((m) => (
                <MedicineCard key={m.id} medicine={m} />
              ))
            )}
          </div>
        </div>
      </section>

      {/* ── 6. Trust & Verification ── */}
      <section className="border-t border-border bg-surface-muted py-20">
        <div className="container-page">
          <div className="grid gap-12 rounded-3xl border border-border bg-surface p-8 shadow-sm md:grid-cols-2 md:items-center md:p-14 lg:p-20">
            <div>
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-success/15 text-success">
                <ShieldCheck size={28} />
              </div>
              <h2 className="mt-6 text-3xl font-bold text-foreground">
                Pharmacist Verified, <br /> Quality Assured.
              </h2>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                For prescription medications ordered via MediCart, our in-house
                licensed pharmacists manually verify every prescription before
                dispatch, ensuring strict compliance with healthcare regulations.
              </p>
              <ul className="mt-8 space-y-4">
                {[
                  "100% Genuine Medicines Guaranteed",
                  "Secure, Temperature-Controlled Shipping",
                  "Free Consultation with Pharmacists",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <CheckCircle2 size={18} className="text-success" />
                    <span className="font-medium text-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { icon: FlaskConical, title: "R&D Driven", desc: "Scientifically validated formulas" },
                { icon: Globe, title: "Pan-India", desc: "Robust distribution network" },
                { icon: HeartPulse, title: "Patient First", desc: "Dedicated to community health" },
                { icon: ShieldCheck, title: "Ethical", desc: "Transparent business practices" },
              ].map((b) => {
                const Icon = b.icon;
                return (
                  <div key={b.title} className="rounded-2xl border border-border bg-surface-muted p-6">
                    <Icon size={24} className="text-primary" />
                    <h3 className="mt-4 font-bold text-foreground">{b.title}</h3>
                    <p className="mt-1 text-xs text-muted-foreground">{b.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── 7. CTA ── */}
      <section className="py-20 md:py-28">
        <div className="container-page">
          <div className="relative overflow-hidden rounded-3xl bg-primary p-10 text-center text-primary-foreground shadow-2xl md:p-20">
            <div className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: `radial-gradient(circle at 25% 50%, white 1px, transparent 1px),
                radial-gradient(circle at 75% 20%, white 1px, transparent 1px)`,
                backgroundSize: "60px 60px",
              }}
            />
            <div className="relative z-10 mx-auto max-w-2xl">
              <h2 className="text-3xl font-extrabold md:text-5xl">
                Partner With Us
              </h2>
              <p className="mt-6 text-lg text-primary-foreground/80">
                Whether you are a healthcare provider looking for bulk supplies, or
                a distributor seeking to expand your portfolio, let's build better
                healthcare together.
              </p>
              <div className="mt-10 flex flex-wrap justify-center gap-4">
                <Link
                  to="/contact"
                  className="inline-flex h-12 items-center gap-2 rounded-xl bg-background px-8 text-sm font-bold text-primary transition-transform hover:scale-105"
                >
                  Contact Our Team <ArrowRight size={16} />
                </Link>
                <Link
                  to="/about"
                  className="inline-flex h-12 items-center gap-2 rounded-xl border border-primary-foreground/20 bg-primary-foreground/10 px-8 text-sm font-bold text-primary-foreground backdrop-blur transition-colors hover:bg-primary-foreground/20"
                >
                  Read Our Story
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
