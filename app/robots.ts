import type { MetadataRoute } from "next";

import { siteOrigin } from "../lib/site-origin";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = siteOrigin();
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/"]
    },
    ...(siteUrl ? { sitemap: `${siteUrl}/sitemap.xml` } : {})
  };
}
