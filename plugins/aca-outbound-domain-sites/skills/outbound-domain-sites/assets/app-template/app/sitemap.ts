import type { MetadataRoute } from "next";
import { headers } from "next/headers";
import { brandForHost } from "@/lib/brands";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const brand = brandForHost((await headers()).get("host"));
  const base = `https://${brand.domain}`;
  const now = new Date();
  return [
    { url: base, lastModified: now, changeFrequency: "monthly", priority: 1 },
    { url: `${base}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/contact`, lastModified: now, changeFrequency: "yearly", priority: 0.6 },
    { url: `${base}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    { url: `${base}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
  ];
}
