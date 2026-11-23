/**
 * EXAMPLE ONLY — copy to `brands.ts` and replace with the user's real domains.
 *
 * One entry per sending domain. Generated from the interview; never invented.
 *
 * DIFFERENTIATION IS THE POINT. Two domains sharing a template must not also
 * share a palette, a font pairing or a copy seed. `/api/brands` audits this in
 * dev and fails on collisions — run it after every change.
 *
 * Palette tokens, all thirteen required:
 *   bg surface ink muted line                  light bands
 *   band bandSurface bandInk bandMuted bandLine  dark bands
 *   accent accentInk accentWash                 brand colour + text on it
 *
 * template: aurora | ledger | signal | press
 * fonts:    inter-instrument | jakarta-fraunces | grotesk-mono
 *           manrope-playfair | dm-serif | figtree-libre
 * mark:     orbit | stack | bolt | prism | arc | grid
 */

import type { Brand, Faq } from "./types";
import { statsFor } from "./proof";

/** Omit entirely if the footer should show the brand name alone. */
const LEGAL_ENTITY = "Example Holdings Ltd";

const BASE_FAQ: Faq[] = [
  {
    q: "How does the pricing work?",
    a: "Replace with the user's real commercial terms. Whatever goes here is a representation a customer can hold them to — confirm it matches what they actually contract.",
  },
  {
    q: "How quickly does it start?",
    a: "Replace with a timeline the user can meet.",
  },
];

function faqFor(seed: number): Faq[] {
  const r = [...BASE_FAQ.slice(seed % BASE_FAQ.length), ...BASE_FAQ.slice(0, seed % BASE_FAQ.length)];
  return r.slice(0, 5);
}

function brand(b: Omit<Brand, "stats" | "faq"> & Partial<Pick<Brand, "stats" | "faq">>): Brand {
  return {
    ...b,
    stats: b.stats ?? statsFor(b.copySeed),
    faq: b.faq ?? faqFor(b.copySeed),
    legalEntity: b.legalEntity ?? LEGAL_ENTITY,
    currency: b.currency ?? "$",
  };
}

export const BRANDS: Brand[] = [
  brand({
    domain: "example-one.com",
    name: "Example One",
    descriptor: "What this brand does",
    template: "aurora",
    fonts: "inter-instrument",
    mark: "arc",
    copySeed: 0,
    angle: "The one-line positioning, reused in the closing CTA and the About page.",
    palette: {
      bg: "#FFFFFF", surface: "#F4F7FC", ink: "#0B1220", muted: "#586179", line: "#E2E8F2",
      band: "#0B1220", bandSurface: "#141E33", bandInk: "#F5F8FF", bandMuted: "#8E9BB8", bandLine: "#1E2A44",
      accent: "#2563EB", accentInk: "#FFFFFF", accentWash: "rgba(37,99,235,0.10)",
    },
    hero: {
      eyebrow: "Short label above the headline",
      headline: "The plain part of the headline,",
      headlineAccent: "the part in the accent face",
      // headlineTail: "optional trailing words",
      sub: "Two sentences. What they get, and what makes it different. Written for a founder, not a specialist.",
      qualifier: "Who this is for — a real qualifier, so wrong-fit readers self-select out",
      ctaPrimary: "Primary action",
      ctaSecondary: "Secondary action",
    },
    contact: { email: "contact@example-one.com" },
    metaDescription: "Under 160 characters. What the company does, in plain words.",
  }),

  brand({
    domain: "example-two.net",
    name: "Example Two",
    descriptor: "A different positioning",
    // Same offer, deliberately different everything: template, fonts, mark,
    // palette, seed. This is what stops the two reading as one operation.
    template: "signal",
    fonts: "grotesk-mono",
    mark: "grid",
    copySeed: 1,
    angle: "A different angle on the same offer.",
    palette: {
      bg: "#07090D", surface: "#0D1117", ink: "#E9EEF5", muted: "#79879B", line: "#1A2029",
      band: "#0D1117", bandSurface: "#141B24", bandInk: "#E9EEF5", bandMuted: "#79879B", bandLine: "#1F2833",
      accent: "#22D3EE", accentInk: "#04141A", accentWash: "rgba(34,211,238,0.12)",
    },
    hero: {
      eyebrow: "A different eyebrow",
      headline: "A different headline",
      headlineAccent: "with its own accent",
      sub: "Different sub-copy. Never reuse another brand's wording verbatim.",
      qualifier: "A different qualifier",
      ctaPrimary: "Primary action",
      ctaSecondary: "Secondary action",
    },
    contact: { email: "contact@example-two.net" },
    metaDescription: "A distinct description. Search engines and link previews both surface this.",
  }),
];

export const BRAND_BY_DOMAIN: Record<string, Brand> = Object.fromEntries(
  BRANDS.map((b) => [b.domain, b])
);

/** Rendered for unknown hosts: local dev, Vercel preview URLs, stray CNAMEs. */
export const DEFAULT_BRAND = BRANDS[0];

/**
 * Strips the port, a trailing `.localhost` and a leading `www.`.
 *
 * The `.localhost` strip is what makes every brand reachable in dev at
 * http://theirdomain.com.localhost:3010 — browsers send any *.localhost to
 * loopback, so no /etc/hosts editing.
 */
export function brandForHost(host: string | null | undefined): Brand {
  if (!host) return DEFAULT_BRAND;
  const clean = host
    .split(":")[0]
    .toLowerCase()
    .replace(/\.localhost$/, "")
    .replace(/^www\./, "");
  return BRAND_BY_DOMAIN[clean] ?? DEFAULT_BRAND;
}
