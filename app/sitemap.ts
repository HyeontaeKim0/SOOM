import type { MetadataRoute } from "next";

import { prisma } from "@/lib/prisma";
import { getSiteUrl } from "@/lib/utils/siteUrl";

// 1시간마다 DB를 다시 조회해 sitemap을 갱신 (재배포 없이 새 글 자동 반영)
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl();

  const posts = await prisma.boardPost.findMany({
    select: { id: true, updatedAt: true },
    orderBy: { createdAt: "desc" },
  });

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${base}/board`,
      changeFrequency: "hourly",
      priority: 1,
    },
    {
      url: `${base}/hot`,
      changeFrequency: "hourly",
      priority: 0.8,
    },
    {
      url: `${base}/meeting`,
      changeFrequency: "daily",
      priority: 0.7,
    },
  ];

  const postRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${base}/board/${post.id}`,
    lastModified: post.updatedAt,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...postRoutes];
}
