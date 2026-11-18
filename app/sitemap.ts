import type { MetadataRoute } from "next";
import { destinations } from "../lib/destinations";

import { siteOrigin } from "../lib/site-origin";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteOrigin();
  if (!baseUrl) return [];

  const paths = ["/", "/destinations", ...destinations.map((destination) => `/destinations/${destination.slug}`)];
  return paths.map((path) => ({
    url: new URL(path, baseUrl).toString(),
    changeFrequency: "monthly" as const,
    priority: path === "/" ? 1 : path === "/destinations" ? 0.8 : 0.6,
  }));
}
