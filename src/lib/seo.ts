export const BASE_URL = "https://obatmedicare.com";

interface SeoProps {
  title: string;
  description: string;
  path: string;
  image?: string;
  type?: "website" | "article" | "product";
}

export function getSeoMeta({
  title,
  description,
  path,
  image = "/logo.svg",
  type = "website",
}: SeoProps) {
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
  };
}
