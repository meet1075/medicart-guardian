import { createFileRoute } from "@tanstack/react-router";
import { PublicLayout } from "@/components/PublicLayout";
import {
  Building2,
  Phone,
  Mail,
  MapPin,
  MessageSquare,
  Send,
  Clock,
  Linkedin,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { sendContactEmailFn } from "@/api/contact";

import { getSeoMeta } from "@/lib/seo";

export const Route = createFileRoute("/contact")({
  head: () => {
    const seo = getSeoMeta({
      title: "Contact Us — Obat Medicare | MediCart",
      description: "Get in touch with Obat Medicare. Reach us at our Mumbai office, call +91-9650506996, or email obatmedicareonline@gmail.com.",
      path: "/contact",
    });
    return {
      meta: seo.meta,
      links: seo.links,
    };
  },
  component: ContactPage,
});

const OFFICES = [
  {
    city: "Mumbai",
    label: "Head Office",
    address: [
      "Prime Mall, Office No S42B, 2nd Floor,",
      "Irla Society Road, Vile Parle West,",
      "Andheri, Mumbai – 400056",
      "Maharashtra, India",
    ],
    icon: Building2,
    accent: "text-primary",
    accentBg: "bg-primary/10",
  },
];

const CONTACT_DETAILS = [
  {
    icon: Phone,
    label: "Phone",
    value: "+91-9650506996",
    href: "tel:+919650506996",
    accent: "text-primary",
    accentBg: "bg-primary/10",
  },
  {
    icon: Mail,
    label: "Email",
    value: "obatmedicareonline@gmail.com",
    href: "mailto:obatmedicareonline@gmail.com",
    accent: "text-info",
    accentBg: "bg-info/10",
  },
  {
    icon: Clock,
    label: "Business Hours",
    value: "Mon – Sat, 9:00 AM – 6:00 PM",
    href: null,
    accent: "text-warning-foreground",
    accentBg: "bg-warning/10",
  },
];

interface FormState {
  name: string;
  email: string;
  phone: string;
  company: string;
  message: string;
}

function ContactPage() {
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    phone: "",
    company: "",
    message: "",
  });
  const [sending, setSending] = useState(false);

  function update(k: keyof FormState, v: string) {
    setForm((p) => ({ ...p, [k]: v }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }
    setSending(true);
    try {
      await sendContactEmailFn({ data: form });
      setForm({ name: "", email: "", phone: "", company: "", message: "" });
      toast.success(
        "Message sent! We have received your inquiry and will contact you soon."
      );
    } catch (err: any) {
      toast.error(err.message || "Failed to send message.");
    } finally {
      setSending(false);
    }
  }

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
            description: "Reach us at our Mumbai office.",
            url: "https://obatmedicare.com/contact",
            telephone: "+91-9650506996",
            email: "obatmedicareonline@gmail.com",
            address: {
              "@type": "PostalAddress",
              streetAddress: "MUMBAI",
              addressCountry: "IN"
            },
            openingHours: "Mo-Sa 09:00-18:00"
          }),
        }}
      />
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
            <MessageSquare size={13} /> Get In Touch
          </div>
          <h1 className="mt-5 text-4xl font-bold tracking-tight md:text-5xl">
            Contact Us
          </h1>
          <p className="mt-4 mx-auto max-w-xl text-base text-white/80">
            Let's build better healthcare together. Reach out for partnerships,
            product inquiries, or expert pharmaceutical guidance.
          </p>
        </div>
      </section>

      {/* ── Contact Cards ── */}
      <section className="container-page py-16">
        <div className="grid gap-5 md:grid-cols-3">
          {CONTACT_DETAILS.map((item) => {
            const Icon = item.icon;
            const inner = (
              <>
                <div
                  className={`inline-flex h-11 w-11 items-center justify-center rounded-xl ${item.accentBg} ${item.accent}`}
                >
                  <Icon size={22} />
                </div>
                <div className="mt-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {item.label}
                </div>
                <div className="mt-1 text-sm font-semibold text-foreground">
                  {item.value}
                </div>
              </>
            );
            return item.href ? (
              <a
                key={item.label}
                href={item.href}
                className="rounded-2xl border border-border bg-surface p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md"
              >
                {inner}
              </a>
            ) : (
              <div
                key={item.label}
                className="rounded-2xl border border-border bg-surface p-6 shadow-sm"
              >
                {inner}
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Offices + Form ── */}
      <section className="bg-surface-muted py-16">
        <div className="container-page grid gap-10 lg:grid-cols-[1fr_1.3fr]">
          {/* Offices */}
          <div>
            <div className="text-xs font-semibold uppercase tracking-widest text-primary">
              Our Locations
            </div>
            <h2 className="mt-2 text-2xl font-bold text-foreground">
              Find Us
            </h2>
            <div className="mt-7 space-y-5">
              {OFFICES.map((office) => {
                const Icon = office.icon;
                return (
                  <div
                    key={office.city}
                    className="rounded-2xl border border-border bg-surface p-6 shadow-sm"
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`flex h-10 w-10 flex-none items-center justify-center rounded-xl ${office.accentBg} ${office.accent}`}
                      >
                        <Icon size={20} />
                      </div>
                      <div>
                        <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          {office.label}
                        </div>
                        <div className="mt-0.5 font-bold text-foreground">
                          {office.city}
                        </div>
                        <div className="mt-2 space-y-0.5 text-sm text-muted-foreground">
                          {office.address.map((line, i) => (
                            <div key={i}>{line}</div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* LinkedIn */}
              <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-[#0077b5]/10 text-[#0077b5]">
                    <Linkedin size={20} />
                  </div>
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      LinkedIn
                    </div>
                    <a
                      href="https://linkedin.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-0.5 block text-sm font-semibold text-[#0077b5] hover:underline"
                    >
                      Obat Medicare Pvt Ltd
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="rounded-2xl border border-border bg-surface p-8 shadow-sm">
            <div className="text-xs font-semibold uppercase tracking-widest text-primary">
              Send a Message
            </div>
            <h2 className="mt-2 text-2xl font-bold text-foreground">
              Get in Touch
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Let's build better healthcare. Connect with us today.
            </p>

            <form onSubmit={handleSubmit} className="mt-7 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Your Name" required>
                  <input
                    value={form.name}
                    onChange={(e) => update("name", e.target.value)}
                    placeholder="Rahul Sharma"
                    className={inputCls}
                    maxLength={80}
                  />
                </Field>
                <Field label="Email Address" required>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => update("email", e.target.value)}
                    placeholder="rahul@example.com"
                    className={inputCls}
                  />
                </Field>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Phone Number">
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => update("phone", e.target.value)}
                    placeholder="+91 98765 43210"
                    className={inputCls}
                    maxLength={15}
                  />
                </Field>
                <Field label="Company / Hospital">
                  <input
                    value={form.company}
                    onChange={(e) => update("company", e.target.value)}
                    placeholder="Apollo Hospitals"
                    className={inputCls}
                    maxLength={100}
                  />
                </Field>
              </div>
              <Field label="Your Message" required>
                <textarea
                  value={form.message}
                  onChange={(e) => update("message", e.target.value)}
                  placeholder="Tell us about your requirements, product inquiries, or how we can help…"
                  rows={5}
                  className={`${inputCls} resize-none`}
                  maxLength={1000}
                />
              </Field>

              <button
                type="submit"
                disabled={sending}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
              >
                <Send size={16} />
                {sending ? "Sending…" : "Send Message"}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* ── Map placeholder ── */}
      <section className="border-t border-border bg-surface">
        <div className="container-page py-12">
          <div className="overflow-hidden rounded-2xl border border-border">
            <div className="flex h-14 items-center gap-3 border-b border-border bg-surface-muted px-5">
              <MapPin size={16} className="text-primary" />
              <span className="text-sm font-semibold text-foreground">
                Prime Mall, Vile Parle West, Andheri, Mumbai 400056
              </span>
            </div>
            <div className="relative flex h-64 items-center justify-center bg-gradient-to-br from-primary-soft/40 to-background">
              <div className="text-center">
                <MapPin size={32} className="mx-auto text-primary" />
                <div className="mt-2 text-sm font-semibold text-foreground">
                  Obat Medicare — Head Office
                </div>
                <div className="mt-0.5 text-xs text-muted-foreground">
                  Vile Parle West, Mumbai
                </div>
                <a
                  href="https://maps.google.com/?q=Prime+Mall+Vile+Parle+West+Andheri+Mumbai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
                >
                  Open in Google Maps
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
        {required && <span className="ml-1 text-destructive">*</span>}
      </label>
      {children}
    </div>
  );
}

const inputCls =
  "w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground";
