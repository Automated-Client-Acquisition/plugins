import type { Metadata } from "next";
import { headers } from "next/headers";
import { brandForHost } from "@/lib/brands";
import { LegalPage, TermsBody } from "@/components/legal";

export const metadata: Metadata = { title: "Terms of service", robots: { index: true, follow: true } };

export default async function Terms() {
  const brand = brandForHost((await headers()).get("host"));
  return (
    <LegalPage brand={brand} title="Terms of service" updated="1 August 2026">
      <TermsBody brand={brand} />
    </LegalPage>
  );
}
