import type { MetadataRoute } from "next";

import { getSiteUrl } from "@/lib/utils/siteUrl";

export default function robots(): MetadataRoute.Robots {
  const base = getSiteUrl();

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin/",
        "/board/create",
        "/profile",
        "/meeting/create",
      ],
    },
    sitemap: `${base}/sitemap.xml`,
  };
}
