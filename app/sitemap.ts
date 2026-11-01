import type { MetadataRoute } from "next";
import { destinations } from "../lib/destinations";

export default function sitemap(): MetadataRoute.Sitemap {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (!configuredUrl) return [];

  let baseUrl: URL;
  try {
    baseUrl = new URL(configuredUrl);
    if (!(["https:", "http:"].includes(baseUrl.protocol))) return [];
  } catch {
    return [];
  }

  const paths = ["/", "/destinations", ...destinations.map((destination) => `/destinations/${destination.slug}`)];
  return paths.map((path) => ({
    url: new URL(path, baseUrl).toString(),
    changeFrequency: "monthly" as const,
    priority: path === "/" ? 1 : path === "/destinations" ? 0.8 : 0.6,
  }));
}
