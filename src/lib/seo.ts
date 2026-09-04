export const getBaseUrl = () => {
  if (typeof window !== "undefined") {
    return window.location.origin;
  }
  return "https://www.obatmedicare.in";
};
interface SeoProps {
  title: string;
  description: string;
  path: string;
  image?: string;
  type?: "website" | "article" | "product";
  jsonLd?: Record<string, any>[];
}

export function getSeoMeta({
  title,
  description,
  path,
  image = "/logo.svg",
  type = "website",
  jsonLd = [],
}: SeoProps) {
  const BASE_URL = getBaseUrl();
  const url = `${BASE_URL}${path}`;
  const fullImage = image.startsWith("http") ? image : `${BASE_URL}${image}`;

  return {
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: url },
      { property: "og:type", content: type },
      { property: "og:image", content: fullImage },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: fullImage },
    ],
    links: [
      { rel: "canonical", href: url },
    ],
    scripts: jsonLd.map((schema) => ({
      type: "application/ld+json",
      children: JSON.stringify(schema),
    })),
  };
}
