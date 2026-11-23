import {
  Inter,
  Instrument_Serif,
  Plus_Jakarta_Sans,
  Fraunces,
  Space_Grotesk,
  JetBrains_Mono,
  Manrope,
  Playfair_Display,
  DM_Sans,
  DM_Serif_Display,
  Figtree,
  Libre_Baskerville,
} from "next/font/google";
import type { FontPairId } from "./types";

// `preload: false` on every family: a given page uses two of them, and preloading
// twelve would ship a dozen <link rel=preload> tags per request.
// Options are inline rather than shared so each loader gets its own contextually
// typed `subsets` union — a shared `as const` object is readonly and rejected.

const inter = Inter({ subsets: ["latin"], display: "swap", preload: false, variable: "--f-sans" });
const instrument = Instrument_Serif({
  subsets: ["latin"], display: "swap", preload: false, weight: "400", style: ["normal", "italic"], variable: "--f-display",
});

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], display: "swap", preload: false, variable: "--f-sans" });
const fraunces = Fraunces({ subsets: ["latin"], display: "swap", preload: false, variable: "--f-display" });

const grotesk = Space_Grotesk({ subsets: ["latin"], display: "swap", preload: false, variable: "--f-sans" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], display: "swap", preload: false, variable: "--f-display" });

const manrope = Manrope({ subsets: ["latin"], display: "swap", preload: false, variable: "--f-sans" });
const playfair = Playfair_Display({
  subsets: ["latin"], display: "swap", preload: false, style: ["normal", "italic"], variable: "--f-display",
});

const dmSans = DM_Sans({ subsets: ["latin"], display: "swap", preload: false, variable: "--f-sans" });
const dmSerif = DM_Serif_Display({
  subsets: ["latin"], display: "swap", preload: false, weight: "400", style: ["normal", "italic"], variable: "--f-display",
});

const figtree = Figtree({ subsets: ["latin"], display: "swap", preload: false, variable: "--f-sans" });
const libre = Libre_Baskerville({
  subsets: ["latin"], display: "swap", preload: false, weight: ["400", "700"], style: ["normal", "italic"], variable: "--f-display",
});

/**
 * Six pairings. The sans carries the interface, the display face carries the
 * accent phrase in the hero and the section eyebrows. Two brands on the same
 * template never share a pairing.
 */
export const FONT_PAIRS: Record<FontPairId, { className: string; displayIsMono?: boolean }> = {
  "inter-instrument": { className: `${inter.variable} ${instrument.variable}` },
  "jakarta-fraunces": { className: `${jakarta.variable} ${fraunces.variable}` },
  "grotesk-mono": { className: `${grotesk.variable} ${jetbrains.variable}`, displayIsMono: true },
  "manrope-playfair": { className: `${manrope.variable} ${playfair.variable}` },
  "dm-serif": { className: `${dmSans.variable} ${dmSerif.variable}` },
  "figtree-libre": { className: `${figtree.variable} ${libre.variable}` },
};
