import type { MetadataRoute } from "next";
import { profile } from "@/content/profile";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = profile.site.url;
  return [
    { url: base, changeFrequency: "monthly", priority: 1 },
    ...profile.projects.map((p) => ({
      url: `${base}/work/${p.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
