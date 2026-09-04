import { createFileRoute } from "@tanstack/react-router";

const TODAY = new Date().toISOString().split("T")[0];

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        // Vercel proxies requests, so we need to read the forwarded headers
        const host = request.headers.get("x-forwarded-host") || request.headers.get("host") || "obatmedicare.in";
        const protocol = request.headers.get("x-forwarded-proto") || "https";
        const BASE_URL = `${protocol}://${host}`;
        const entries = [
          { path: "/", priority: "1.0", changefreq: "weekly" },
          { path: "/shop", priority: "0.9", changefreq: "daily" },
          { path: "/our-products", priority: "0.8", changefreq: "weekly" },
          { path: "/about", priority: "0.7", changefreq: "monthly" },
          { path: "/contact", priority: "0.7", changefreq: "monthly" },
          { path: "/login", priority: "0.5", changefreq: "monthly" },
        ];
        const urls = entries.map(
          (e) =>
            `  <url>\n    <loc>${BASE_URL}${e.path}</loc>\n    <lastmod>${TODAY}</lastmod>\n    <changefreq>${e.changefreq}</changefreq>\n    <priority>${e.priority}</priority>\n  </url>`
        );
        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>`;
        
        return new Response(xml, {
          headers: { 
            "Content-Type": "application/xml", 
            "Cache-Control": "public, max-age=3600" 
          },
        });
      },
    },
  },
});
