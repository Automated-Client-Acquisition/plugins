export type TemplateId = "aurora" | "ledger" | "signal" | "press";

export type FontPairId =
  | "inter-instrument"
  | "jakarta-fraunces"
  | "grotesk-mono"
  | "manrope-playfair"
  | "dm-serif"
  | "figtree-libre";

export type MarkId = "orbit" | "stack" | "bolt" | "prism" | "arc" | "grid";

export interface Palette {
  /** Page background for light bands. */
  bg: string;
  /** Slightly raised surface on light bands (cards). */
  surface: string;
  /** Primary text on light bands. */
  ink: string;
  /** Secondary text on light bands. */
  muted: string;
  /** Hairline borders on light bands. */
  line: string;
  /** Dark band background. */
  band: string;
  /** Raised surface on dark bands. */
  bandSurface: string;
  /** Primary text on dark bands. */
  bandInk: string;
  /** Secondary text on dark bands. */
  bandMuted: string;
  /** Hairline borders on dark bands. */
  bandLine: string;
  /** Brand accent. */
  accent: string;
  /** Text that sits on top of the accent. */
  accentInk: string;
  /** Low-opacity accent wash for chips and highlights. */
  accentWash: string;
}

export interface Stat {
  value: string;
  label: string;
  /** Where the number comes from. Rendered as a footnote so nothing reads as invented. */
  source?: string;
}

export interface Faq {
  q: string;
  a: string;
}

export interface Contact {
  email: string;
  phone?: string;
  city?: string;
  country?: string;
}

export interface Brand {
  domain: string;
  name: string;
  /** Shown next to the wordmark in the nav. */
  descriptor: string;
  template: TemplateId;
  fonts: FontPairId;
  mark: MarkId;
  palette: Palette;

  /** One-line positioning. Threaded through several sections. */
  angle: string;

  hero: {
    eyebrow: string;
    headline: string;
    /** Rendered in the accent serif/italic face. */
    headlineAccent: string;
    headlineTail?: string;
    sub: string;
    qualifier: string;
    /** The free-pilot CTA. Sends to the contact form, and is reused by the nav. */
    ctaPrimary: string;
    /** Sends to the on-page quote calculator (#quote). */
    ctaSecondary: string;
  };

  /** Deterministic index into the copy pools. Keeps every domain's body text distinct. */
  copySeed: number;

  /** Only claims backed by data in the ACA database. See lib/proof.ts. */
  stats: Stat[];

  faq: Faq[];
  contact: Contact;
  /** Currency symbol used by the quote calculator. Defaults to "$". */
  currency?: string;
  /** Defaults to the on-site /contact form. Set to an external booking link if you have one. */
  bookingUrl?: string;
  /** Operating entity disclosed in the footer. Omit to render the brand name alone. */
  legalEntity?: string;
  metaDescription: string;
}
