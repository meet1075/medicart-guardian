# SEO Development Guidelines

> **Purpose:** This file contains SEO rules to apply while building this website.
> Any AI coding assistant (or developer) working on this codebase should read this
> file and apply these rules automatically to all pages, components, and routes
> during development — before the site is deployed.

---

## 1. Page `<head>` Requirements

Every route/page MUST have:

- [ ] Unique `<title>` — 50–60 characters, primary keyword near the start, brand name at the end (e.g. `Primary Keyword | Brand Name`)
- [ ] Unique `<meta name="description">` — 150–160 characters, includes primary keyword, written to earn a click (not stuffed with keywords)
- [ ] `<link rel="canonical" href="...">` — absolute URL, always present, even if it just points to itself
- [ ] `<meta name="viewport" content="width=device-width, initial-scale=1">`
- [ ] `<html lang="...">` set correctly
- [ ] Open Graph tags: `og:title`, `og:description`, `og:image`, `og:url`, `og:type`
- [ ] Twitter Card tags: `twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`
- [ ] No duplicate titles/descriptions across pages — each must be unique

**Never leave title/description empty, auto-generated as "Untitled", or duplicated across multiple routes.**

---

## 2. Heading Structure

- [ ] Exactly **one** `<h1>` per page — should contain the primary keyword naturally
- [ ] Headings must follow logical order: `h1 → h2 → h3` (never skip levels, e.g. h1 → h3)
- [ ] Do not use heading tags purely for visual styling — use CSS for size/weight instead
- [ ] Every major content section should have a descriptive heading, not generic labels like "Section 1"

---

## 3. Semantic HTML

Use semantic elements instead of generic `<div>`s wherever applicable:

- `<header>` for page/site header
- `<nav>` for navigation menus
- `<main>` for the primary content (only one per page)
- `<article>` for self-contained content (blog posts, product cards)
- `<section>` for thematic groupings
- `<aside>` for sidebars/supplementary content
- `<footer>` for page/site footer

---

## 4. Images

- [ ] Every `<img>` must have a descriptive, specific `alt` attribute (not `"image1.jpg"` or empty unless the image is purely decorative, in which case use `alt=""`)
- [ ] Always set explicit `width` and `height` attributes (or CSS aspect-ratio) to prevent layout shift (CLS)
- [ ] Use modern formats: `.webp` or `.avif` instead of `.jpg`/`.png` where possible
- [ ] Use `loading="lazy"` on all images below the fold
- [ ] Never use `loading="lazy"` on the LCP (hero/above-the-fold) image — it should load eagerly and ideally be preloaded
- [ ] Compress all images before committing to the repo

---

## 5. URLs & Routing

- [ ] URLs must be lowercase, hyphen-separated, human-readable (`/blog/seo-basics`, not `/blog/post?id=123` or `/blog/SEO_Basics`)
- [ ] No trailing-slash inconsistency — pick one convention and enforce it site-wide
- [ ] Avoid unnecessary URL parameters for content pages; use clean paths
- [ ] Set up 301 redirects (never 302) for any renamed or removed page during development
- [ ] Every internal link must point to the canonical version of the URL

---

## 6. Structured Data (Schema.org / JSON-LD)

Add JSON-LD structured data appropriate to the page type:

- Homepage / Organization pages → `Organization` or `LocalBusiness` schema
- Blog posts / articles → `Article` or `BlogPosting` schema
- Product pages → `Product` schema with `offers`, `aggregateRating` if available
- FAQ sections → `FAQPage` schema
- Navigation → `BreadcrumbList` schema
- Recipes, events, jobs, videos → use the matching Schema.org type if relevant

Place JSON-LD in a `<script type="application/ld+json">` block. Validate it mentally against Schema.org's spec before committing.

---

## 7. Performance (Core Web Vitals)

Target thresholds — treat these as build requirements, not suggestions:

| Metric | Target |
|---|---|
| LCP (Largest Contentful Paint) | < 2.5s |
| INP (Interaction to Next Paint) | < 200ms |
| CLS (Cumulative Layout Shift) | < 0.1 |

Rules to follow:
- [ ] Minify and bundle CSS/JS in production builds
- [ ] Defer or async non-critical JavaScript (`<script defer>` / `<script async>`)
- [ ] Preload critical fonts and the LCP image (`<link rel="preload">`)
- [ ] Avoid render-blocking CSS — inline critical CSS if needed
- [ ] Avoid layout shifts: reserve space for ads, embeds, images, and fonts (use `font-display: swap`)
- [ ] Use a CDN for static assets if available
- [ ] Avoid injecting content above existing content after page load

---

## 8. JavaScript Rendering

- [ ] If using React/Vue/Next.js/Nuxt/etc., ensure content is server-side rendered (SSR) or statically generated (SSG) — do NOT rely on pure client-side rendering for primary content, since crawlers may index a blank/incomplete page
- [ ] Verify with "view page source" (not just DevTools Elements tab) that critical text content is present in the initial HTML response
- [ ] Avoid content that only appears after user interaction (clicks, hovers) if that content matters for SEO

---

## 9. Sitemap & Robots

- [ ] Generate a valid `sitemap.xml` covering all indexable pages, auto-updated as routes are added
- [ ] Create a `robots.txt` at the root that:
  - Allows crawling of all public pages
  - Disallows admin, cart, checkout, search-result, and filter/duplicate-parameter URLs
  - References the sitemap: `Sitemap: https://yourdomain.com/sitemap.xml`
- [ ] Add `<meta name="robots" content="noindex">` only to pages that genuinely should not be indexed (thank-you pages, internal search results, staging pages) — never accidentally leave this on production content pages

---

## 10. Internal Linking

- [ ] Every page should be reachable within 3–4 clicks from the homepage (no orphan pages)
- [ ] Use descriptive, keyword-relevant anchor text for internal links — avoid "click here" / "read more" as the only link text
- [ ] Link related content together (e.g., related blog posts, related products)
- [ ] Ensure the main navigation and footer contain links to all key pages

---

## 11. Mobile-Friendliness

- [ ] Fully responsive layout — no horizontal scrolling on any viewport
- [ ] Tap targets (buttons/links) at least 48x48px with adequate spacing
- [ ] Text readable without zooming (minimum ~16px base font size)
- [ ] Test every page at mobile viewport widths (375px, 390px, 414px) during development

---

## 12. HTTPS & Security

- [ ] Site must be served over HTTPS in all environments approaching production
- [ ] No mixed-content warnings (no HTTP resources loaded on an HTTPS page)
- [ ] Ensure all internal links use HTTPS, not HTTP

---

## 13. Accessibility (overlaps with SEO)

- [ ] All interactive elements are keyboard-navigable
- [ ] Sufficient color contrast (WCAG AA minimum)
- [ ] Form inputs have associated `<label>` elements
- [ ] ARIA attributes used only where semantic HTML isn't sufficient

---

## 14. Content Rules

- [ ] Every page has substantive, unique content — no thin/duplicate pages
- [ ] Primary keyword appears naturally in: H1, first ~100 words, and 1–2 times in body — never keyword-stuffed
- [ ] No duplicate content across multiple URLs without a canonical tag pointing to the primary version

---

## Checklist Summary (quick pass before marking a page "done")

- [ ] Unique title + meta description present
- [ ] Canonical tag present
- [ ] One H1, logical heading hierarchy
- [ ] All images have alt text + width/height set
- [ ] Semantic HTML used
- [ ] Clean, hyphenated URL
- [ ] Structured data added if applicable
- [ ] Core Web Vitals targets met (test with Lighthouse)
- [ ] Content renders in initial HTML (not JS-only)
- [ ] Page included in sitemap.xml and not blocked by robots.txt (unless intentional)
- [ ] Mobile responsive, no layout shift
- [ ] HTTPS, no mixed content

---

*Note: This file covers development-phase SEO only. Post-deployment steps (Google Search Console setup, sitemap submission, backlink building, ongoing monitoring) are a separate process and not covered here.*