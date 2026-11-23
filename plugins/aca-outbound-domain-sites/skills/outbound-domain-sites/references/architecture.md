# Architecture

One Next.js app. N domains. The brand is resolved from the request `Host`.

```
app/                    layout resolves the brand, sets CSS vars + fonts
components/
  templates.tsx         4 page layouts
  sections.tsx          the sections each template arranges
  mockups.tsx           CSS-drawn product mockups (no images)
  chrome.tsx            nav + footer
  quote-calculator.tsx  optional interactive estimate
  contact-form.tsx      client form
  logos.tsx             third-party brand marks
lib/
  brands.ts             ← YOU GENERATE THIS, one entry per domain
  proof.ts              ← YOU GENERATE THIS, measured numbers only
  copy.ts               body-copy pools, selected per brand
  types.ts              the Brand shape
  audit.ts              differentiation audit
scripts/
  dns-plan.mjs          read-only DNS report
  dns-apply.mjs         apply website records, never mail
  add-domains.sh        attach domains to the Vercel project
```

## Why one project, not one per domain

Fifteen Vercel projects is fifteen deploys, fifteen sets of env vars, fifteen
things to forget. One project with N domains attached is one deploy.

It must also be **separate from the user's main app**. Serving their real
product on a cold-email domain puts their brand and their `/login` on every
sending domain.

## Host resolution

```ts
export function brandForHost(host?: string | null): Brand {
  const clean = host?.split(":")[0].toLowerCase()
    .replace(/\.localhost$/, "")   // every brand reachable in local dev
    .replace(/^www\./, "");        // apex and www share one config
  return BRAND_BY_DOMAIN[clean ?? ""] ?? DEFAULT_BRAND;
}
```

Stripping `.localhost` is what makes `http://theirdomain.com.localhost:3010`
render that brand locally — browsers resolve any `*.localhost` to loopback, so
no `/etc/hosts` editing.

Reading `headers()` makes routes dynamic. That is fine; these pages are small.

## The Brand shape

```ts
interface Brand {
  domain: string;            // the key — must match the sending domain exactly
  name: string;              // what a visitor accepts as the company
  descriptor: string;        // one line beside the wordmark
  template: TemplateId;      // aurora | ledger | signal | press
  fonts: FontPairId;         // 6 pairings
  mark: MarkId;              // 6 SVG glyphs
  palette: Palette;          // 13 tokens, light + dark bands + accent
  angle: string;             // one-line positioning, reused across sections
  hero: { eyebrow; headline; headlineAccent; headlineTail?; sub;
          qualifier; ctaPrimary; ctaSecondary };
  copySeed: number;          // unique per brand — indexes the copy pools
  stats: Stat[];             // measured only, each with its source
  faq: Faq[];
  contact: { email; phone?; city?; country? };
  currency?: string;
  bookingUrl?: string;
  legalEntity?: string;      // omit to show the brand name alone
  metaDescription: string;
}
```

## Differentiation is the product

Two domains sharing a template must not also share a palette, a font pairing or
a copy seed. `lib/audit.ts` enforces it and is exposed at `/api/brands` in dev:

```bash
curl -s localhost:3010/api/brands | jq '{ok, issues}'
```

It checks for collisions in template+palette, template+fonts, accent colour,
rendered body copy, and duplicate seeds. **It caught a real collision** on the
original rollout — four domains had drifted onto the same font pairing.

## Copy pools

Hand-writing distinct body copy for fifteen domains is unmaintainable; shipping
identical copy defeats the purpose. `lib/copy.ts` holds pools of 5+ variants per
section, selected by a hash of `(copySeed, sectionOffset)`.

Note the hash: a *linear* index modulo a fixed pool length makes every Nth brand
share a paragraph. Mix the seed.

## Templates

Four, differing in structure — not just colour:

| | |
|---|---|
| **aurora** | light hero with accent glow, alternating bands, mockups in the fold |
| **ledger** | editorial, stat rail in the hero, mostly light, data-forward |
| **signal** | dark throughout, grid-ruled, centred hero |
| **press** | magazine, serif-forward, generous rules, wide margins |

## Mockups instead of images

Every visual is CSS: a fake inbox, a comparison of two message drafts, an
invoice, a channel list, a live dashboard. No photography, no stock, no image
budget, and it re-skins across every brand from the palette automatically.

This is what makes fifteen pages look expensive for free.

## Per-brand metadata

`app/icon.tsx` and `app/opengraph-image.tsx` generate a favicon and social card
per brand at request time. `robots.ts` and `sitemap.ts` emit per-domain URLs.

For the OG image, note that Satori (behind `next/og`) needs an explicit
`display` on any element with more than one child, and has no inline layout —
build each line as its own leaf holding a single string.
