import { createFileRoute, Link } from "@tanstack/react-router";
import { PublicLayout } from "@/components/PublicLayout";
import {
  ShieldCheck,
  Target,
  Eye,
  Award,
  Handshake,
  HeartPulse,
  FlaskConical,
  Globe,
  Users,
  ArrowRight,
  Building2,
  Phone,
  Mail,
} from "lucide-react";

import { getSeoMeta } from "@/lib/seo";

export const Route = createFileRoute("/about")({
  head: () => {
    const seo = getSeoMeta({
      title: "About Us — Obat Medicare",
      description: "Learn about Obat Medicare Pvt Ltd — a third-generation, super-specialty pharmaceutical company founded in 2016 with a presence across dermatology, cardiac care, and more.",
      path: "/about",
      jsonLd: [
        {
          "@context": "https://schema.org",
          "@type": "AboutPage",
          "name": "About Us — Obat Medicare",
          "description": "Learn about Obat Medicare Pvt Ltd — a third-generation, super-specialty pharmaceutical company founded in 2016.",
          "url": "https://obatmedicare.in/about"
        }
      ]
    });
    return {
      meta: seo.meta,
      links: seo.links,
      scripts: seo.scripts,
    };
  },
  component: AboutPage,
});

const STATS = [
  { label: "Founded", value: "2016", sub: "Third-generation enterprise" },
  { label: "Departments", value: "5+", sub: "Speciality focus areas" },
  { label: "Products", value: "100+", sub: "Formulations & counting" },
  { label: "Reach", value: "Pan-India", sub: "+ Global presence" },
];

const WHY_CHOOSE_US = [
  {
    icon: FlaskConical,
    title: "Quality Formulations",
    desc: "All products are formulated under strict quality control, adhering to national and international pharmaceutical standards.",
  },
  {
    icon: Award,
    title: "Trustable Brand",
    desc: "Built on a foundation of integrity and transparency, we deliver consistent quality and reliability that healthcare providers depend on.",
  },
  {
    icon: HeartPulse,
    title: "Continuous Support",
    desc: "Committed to providing ongoing support to healthcare providers and patients throughout every stage of treatment.",
  },
];

const WHAT_SETS_US_APART = [
  { icon: ShieldCheck, text: "Ethical Business Practices" },
  { icon: FlaskConical, text: "Scientifically Validated Products" },
  { icon: Globe, text: "Pan-India Distribution Network" },
  { icon: Users, text: "Patient-Centric Approach" },
];

const DEPARTMENTS = [
  "Dermatology",
  "General Medicine",
  "Gastroenterology",
  "Orthopaedics",
  "Cardiac-Diabetic",
  "Gynaecology",
];

function AboutPage() {
  return (
    <PublicLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            name: "Obat Medicare Pvt Ltd",
            image: "https://obatmedicare.com/favicon.ico",
            description: "A third-generation, super-specialty pharmaceutical company.",
            url: "https://obatmedicare.com/about",
            telephone: "+91-9650506996",
            email: "obatmedicareonline@gmail.com",
            address: {
              "@type": "PostalAddress",
              streetAddress: "MUMBAI",
              addressCountry: "IN"
            }
          }),
        }}
      />
      {/* ── Hero ── */}
      <section className="relative overflow-hidden border-b border-border">
        {/* layered gradient background */}
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
            <Building2 size={13} /> Obat Medicare Pvt Ltd
          </div>
          <h1 className="mt-5 text-4xl font-bold tracking-tight md:text-5xl lg:text-[3.2rem]">
            About Us
          </h1>
          <p className="mt-4 mx-auto max-w-xl text-base text-white/80">
            A third-generation pharmaceutical enterprise redefining healthcare
            delivery in India and beyond since 2016.
          </p>
        </div>
      </section>

      {/* ── Stats Bar ── */}
      <section className="border-b border-border bg-surface">
        <div className="container-page grid grid-cols-2 divide-x divide-border md:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label} className="px-6 py-7 text-center">
              <div className="text-3xl font-bold text-primary">{s.value}</div>
              <div className="mt-0.5 text-sm font-semibold text-foreground">
                {s.label}
              </div>
              <div className="mt-0.5 text-xs text-muted-foreground">{s.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Our Story ── */}
      <section className="container-page py-16">
        <div className="grid gap-12 md:grid-cols-2 md:items-center">
          <div>
            <div className="text-xs font-semibold uppercase tracking-widest text-primary">
              Our Story
            </div>
            <h2 className="mt-2 text-3xl font-bold text-foreground">
              Born from a legacy of pharmaceutical excellence
            </h2>
            <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
              Obat Medicare was born from a legacy of pharmaceutical excellence
              and a vision to redefine healthcare delivery in India and beyond.
              As a third-generation enterprise, we blend decades of industry
              wisdom with modern innovation to address the evolving needs of
              patients and healthcare providers.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Since our inception in 2016, we have grown into a super-specialty
              pharmaceutical company with a strong presence in dermatology,
              immunology, general medicine, and more. Our journey is marked by a
              relentless pursuit of quality, ethical business practices, and a
              deep commitment to community well-being.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {DEPARTMENTS.map((d) => (
                <span
                  key={d}
                  className="rounded-full border border-primary/20 bg-primary-soft px-3 py-1 text-xs font-medium text-primary"
                >
                  {d}
                </span>
              ))}
            </div>
          </div>

          {/* Visual card */}
          <div className="relative">
            <div className="overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-primary-soft via-primary/5 to-background p-8">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: FlaskConical, label: "R&D Driven", color: "text-primary" },
                  { icon: Award, label: "GMP Certified", color: "text-success" },
                  { icon: Globe, label: "Global Reach", color: "text-info" },
                  { icon: HeartPulse, label: "Patient First", color: "text-destructive" },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.label}
                      className="flex flex-col items-center gap-3 rounded-xl border border-border bg-surface p-5 text-center shadow-sm"
                    >
                      <div className={`rounded-full bg-primary-soft p-3 ${item.color}`}>
                        <Icon size={22} />
                      </div>
                      <div className="text-sm font-semibold text-foreground">
                        {item.label}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-4 rounded-xl border border-border bg-surface px-5 py-4 text-center">
                <div className="text-xs text-muted-foreground">Headquartered in</div>
                <div className="mt-0.5 font-semibold text-foreground">
                  Mumbai, India
                </div>

              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Mission & Vision ── */}
      <section className="bg-surface-muted py-16">
        <div className="container-page">
          <div className="text-center">
            <div className="text-xs font-semibold uppercase tracking-widest text-primary">
              Our Purpose
            </div>
            <h2 className="mt-2 text-3xl font-bold text-foreground">
              Mission &amp; Vision
            </h2>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {/* Mission */}
            <div className="group relative overflow-hidden rounded-2xl border border-border bg-surface p-8 shadow-sm transition-shadow hover:shadow-md">
              <div className="absolute right-0 top-0 h-32 w-32 translate-x-8 -translate-y-8 rounded-full bg-primary/5" />
              <div className="relative">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                  <Target size={22} />
                </div>
                <h3 className="mt-5 text-xl font-bold text-foreground">
                  Our Mission
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  To make quality healthcare accessible and affordable for all
                  by developing and delivering pharmaceutical products that
                  address real-world health challenges with{" "}
                  <span className="font-medium text-foreground">
                    integrity, innovation and compassion.
                  </span>
                </p>
              </div>
            </div>

            {/* Vision */}
            <div className="group relative overflow-hidden rounded-2xl border border-border bg-surface p-8 shadow-sm transition-shadow hover:shadow-md">
              <div className="absolute right-0 top-0 h-32 w-32 translate-x-8 -translate-y-8 rounded-full bg-success/5" />
              <div className="relative">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-success/15 text-success">
                  <Eye size={22} />
                </div>
                <h3 className="mt-5 text-xl font-bold text-foreground">
                  Our Vision
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  To be a trusted global healthcare partner, recognized for our{" "}
                  <span className="font-medium text-foreground">
                    ethical practices, scientific excellence
                  </span>{" "}
                  and unwavering commitment to improving lives.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Why Choose Us ── */}
      <section className="container-page py-16">
        <div className="text-center">
          <div className="text-xs font-semibold uppercase tracking-widest text-primary">
            Why Choose Us
          </div>
          <h2 className="mt-2 text-3xl font-bold text-foreground">
            The Obat Medicare Advantage
          </h2>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {WHY_CHOOSE_US.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="rounded-2xl border border-border bg-surface p-7 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary-soft text-primary">
                  <Icon size={22} />
                </div>
                <h3 className="mt-5 text-base font-bold text-foreground">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── What Sets Us Apart ── */}
      <section className="bg-surface-muted py-16">
        <div className="container-page">
          <div className="grid gap-10 md:grid-cols-2 md:items-center">
            <div>
              <div className="text-xs font-semibold uppercase tracking-widest text-primary">
                Differentiators
              </div>
              <h2 className="mt-2 text-3xl font-bold text-foreground">
                What Sets Us Apart
              </h2>
              <p className="mt-4 text-sm text-muted-foreground">
                At Obat Medicare, we don't just manufacture medicines — we build
                relationships founded on trust, science, and a shared commitment
                to a healthier world.
              </p>
              <ul className="mt-7 space-y-4">
                {WHAT_SETS_US_APART.map((item) => {
                  const Icon = item.icon;
                  return (
                    <li key={item.text} className="flex items-center gap-4">
                      <div className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-primary/10 text-primary">
                        <Icon size={18} />
                      </div>
                      <span className="text-sm font-medium text-foreground">
                        {item.text}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Company profile summary card */}
            <div className="rounded-2xl border border-border bg-surface p-7 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                  <Building2 size={20} />
                </div>
                <div>
                  <div className="font-bold text-foreground">Obat Medicare Pvt Ltd</div>
                  <div className="text-xs text-muted-foreground">
                    Super-Specialty Pharmaceutical Company
                  </div>
                </div>
              </div>
              <div className="mt-5 space-y-3 divide-y divide-border">
                {[
                  { label: "Specialization", value: "Super-specialty pharma" },
                  { label: "Departments", value: DEPARTMENTS.join(", ") },
                  { label: "Reach / Domain", value: "Global Presence" },
                  { label: "Customer", value: "Patients & Healthcare Providers" },
                  { label: "Founded", value: "2016" },
                ].map((row) => (
                  <div key={row.label} className="flex gap-4 pt-3">
                    <span className="w-28 flex-none text-xs font-semibold text-muted-foreground">
                      {row.label}
                    </span>
                    <span className="text-xs text-foreground">{row.value}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href="tel:+919650506996"
                  className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:border-primary hover:text-primary"
                >
                  <Phone size={13} /> +91-9650506996
                </a>
                <a
                  href="mailto:obatmedicareonline@gmail.com"
                  className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:border-primary hover:text-primary"
                >
                  <Mail size={13} /> obatmedicareonline@gmail.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Partnership Banner ── */}
      <section className="container-page py-16">
        <div className="overflow-hidden rounded-2xl bg-primary p-10 text-center text-white md:p-14">
          <Handshake size={36} className="mx-auto text-white/70" />
          <h2 className="mt-5 text-2xl font-bold md:text-3xl">
            Get Your Quote or Partner With Us
          </h2>
          <p className="mt-3 mx-auto max-w-md text-sm text-white/80">
            Speak with our team for quick pricing, product information, and
            expert pharmaceutical guidance.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-semibold text-primary hover:bg-white/90"
            >
              Contact Us <ArrowRight size={16} />
            </Link>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 rounded-lg border border-white/30 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur hover:bg-white/20"
            >
              Shop <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
