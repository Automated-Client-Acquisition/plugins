import type { MetadataRoute } from "next";
import { headers } from "next/headers";
import { brandForHost } from "@/lib/brands";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const brand = brandForHost((await headers()).get("host"));
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/api/"] }],
    sitemap: `https://${brand.domain}/sitemap.xml`,
    host: `https://${brand.domain}`,
  };
}
