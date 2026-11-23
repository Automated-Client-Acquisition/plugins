import type { Metadata } from "next";
import { headers } from "next/headers";
import { brandForHost } from "@/lib/brands";
import { LegalPage, PrivacyBody } from "@/components/legal";

export const metadata: Metadata = { title: "Privacy policy", robots: { index: true, follow: true } };

export default async function Privacy() {
  const brand = brandForHost((await headers()).get("host"));
  return (
    <LegalPage brand={brand} title="Privacy policy" updated="1 August 2026">
      <PrivacyBody brand={brand} />
    </LegalPage>
  );
}
