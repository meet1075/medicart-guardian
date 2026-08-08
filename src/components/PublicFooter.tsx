import { ShieldCheck, Truck, Lock, Phone, Mail, MapPin, Linkedin } from "lucide-react";
import { Link } from "@tanstack/react-router";

export function PublicFooter() {
  return (
    <footer className="mt-16 border-t border-border bg-surface-muted">
      {/* ── CTA Banner ── */}
      <div className="bg-primary">
        <div className="container-page flex flex-col items-center justify-between gap-4 py-5 text-center sm:flex-row sm:text-left">
          <div>
            <div className="text-sm font-semibold text-white">
              Get Your Quote or Call:{" "}
              <a
                href="tel:+919650506996"
                className="underline underline-offset-2 hover:text-white/80"
              >
                +91-9650506996
              </a>
            </div>
            <div className="text-xs text-white/70">
              Speak with our team for quick pricing and expert guidance.
            </div>
          </div>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-primary hover:bg-white/90"
          >
            Contact Us
          </Link>
        </div>
      </div>

      {/* ── Main footer grid ── */}
      <div className="container-page grid gap-10 py-12 md:grid-cols-2 lg:grid-cols-4">
        {/* Brand */}
        <div className="lg:col-span-1">
          <div className="flex items-center">
            <img src="/logo.svg" alt="Obat Medicare" width={192} height={48} loading="lazy" className="h-12 w-auto object-contain" />
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            Obat Medicare Pvt Ltd is a fast-growing Indian pharmaceutical
            company offering a broad array of medicines and personal care
            products. With our base in Mumbai, distributing via online
            pharmacies.
          </p>
          <div className="mt-4 flex gap-3">
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border text-muted-foreground hover:border-[#0077b5] hover:text-[#0077b5]"
              aria-label="LinkedIn"
            >
              <Linkedin size={16} />
            </a>
          </div>
        </div>

        {/* Explore */}
        <div>
          <h4 className="text-sm font-semibold text-foreground">Explore</h4>
          <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
            <li>
              <Link to="/about" className="hover:text-primary">
                About Us
              </Link>
            </li>

            <li>
              <Link to="/shop" className="hover:text-primary">
                Online Shop
              </Link>
            </li>
            <li>
              <Link
                to="/our-products"
                search={{ category: "general" }}
                className="hover:text-primary"
              >
                General Medicine
              </Link>
            </li>
            <li>
              <Link to="/our-products" search={{ category: "dermatology" }} className="hover:text-primary">
                Dermatology
              </Link>
            </li>
            <li>
              <Link to="/our-products" search={{ category: "cardiac" }} className="hover:text-primary">
                Cardiac-Diabetic
              </Link>
            </li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h4 className="text-sm font-semibold text-foreground">Support</h4>
          <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
            <li>
              <Link to="/track" className="hover:text-primary">
                Track your order
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-primary">
                Contact Us
              </Link>
            </li>
            <li className="flex items-center gap-2">
              <ShieldCheck size={14} className="text-primary" />
              Licensed pharmacy
            </li>
            <li className="flex items-center gap-2">
              <Truck size={14} className="text-primary" />
              Fast delivery
            </li>
            <li className="flex items-center gap-2">
              <Lock size={14} className="text-primary" />
              Secure payment
            </li>
          </ul>
        </div>

        {/* Contact & Locations */}
        <div>
          <h4 className="text-sm font-semibold text-foreground">
            Our Locations
          </h4>
          <ul className="mt-4 space-y-4 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <MapPin size={14} className="mt-0.5 shrink-0 text-primary" />
              <span>
                Prime Mall, Office No S42B, 2nd Floor,
                <br />
                Irla Society Rd, Vile Parle West,
                <br />
                Andheri, Mumbai – 400056
              </span>
            </li>

            <li className="flex items-center gap-2">
              <Phone size={14} className="shrink-0 text-primary" />
              <a href="tel:+919650506996" className="hover:text-primary">
                +91-9650506996
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Mail size={14} className="shrink-0 text-primary" />
              <a
                href="mailto:obatmedicare@gmail.com"
                className="break-all hover:text-primary"
              >
                obatmedicare@gmail.com
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="border-t border-border py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Obat Medicare Pvt Ltd. All Rights Reserved.
        &nbsp;|&nbsp; MediCart e-commerce platform.
      </div>
    </footer>
  );
}
