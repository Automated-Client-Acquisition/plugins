import { headers } from "next/headers";
import { brandForHost } from "@/lib/brands";
import { Template } from "@/components/templates";

export default async function Home() {
  const brand = brandForHost((await headers()).get("host"));
  return <Template brand={brand} />;
}
