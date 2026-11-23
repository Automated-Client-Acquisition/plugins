/**
 * EXAMPLE ONLY — copy to `proof.ts` and replace with the user's real numbers.
 *
 * ══════════════════════════════════════════════════════════════════════════
 *  EVERY NUMBER IN THIS FILE MUST BE ONE THE USER CAN EVIDENCE.
 * ══════════════════════════════════════════════════════════════════════════
 *
 * Not estimated, not "roughly", not from a competitor's site, not what they
 * hope to hit. If it cannot be traced to a query, a dashboard or an invoice,
 * it does not belong here.
 *
 * This is not fussiness. The same numbers appear on every domain, so a reader
 * comparing two pages sees the same claim twice — and a fabricated statistic
 * repeated across a dozen domains is an advertising-standards problem as well
 * as the fastest route to the whole set being cross-referenced.
 *
 * If the user has no numbers yet: delete the entries, keep the array short or
 * empty, and let the page carry process, guarantees and response commitments
 * instead. Those are claims about how they work, true from day one.
 *
 * Every stat carries a `source`. It renders as a footnote under the number and
 * is what makes a reader believe it. A number without provenance reads as
 * marketing; a number with it reads as a fact.
 */

import type { Stat } from "./types";

/** Update whenever the numbers are refreshed. Rendered under the stat band. */
export const PROOF_AS_OF = "Month Year";

/**
 * The raw measurements, kept separate so the source of each figure is legible
 * and so the labels below can be reworded without losing the provenance.
 */
export const MEASURED = {
  // e.g. emailsSent: 94_281,   // count of terminal-state sends, all campaigns
  // e.g. bounceRatePct: 0.81,  // bounced / terminal sends
};

/**
 * The pool the stat band draws from. Write labels in plain language — what the
 * number means to a founder, not what it is called internally.
 *
 * Good:  "Fewer than 1 in 100 emails bounces"
 * Bad:   "0.81% bounce rate"        (jargon)
 * Worse: "Industry-leading delivery" (unmeasurable, and a claim)
 */
const POOL: Stat[] = [
  // {
  //   value: "94,000",
  //   label: "Emails sent for clients",
  //   source: "Across every campaign to date",
  // },
];

/**
 * Varied per brand so no two domains show the same four tiles in the same
 * order. Returns fewer than `count` if the pool is smaller — which is correct
 * behaviour when the user genuinely has little to show.
 */
export function statsFor(seed: number, count = 4): Stat[] {
  if (!POOL.length) return [];
  const out: Stat[] = [];
  const used = new Set<string>();
  for (let i = 0; out.length < count && i < POOL.length * 2; i++) {
    const stat = POOL[(seed * 3 + i * 5) % POOL.length];
    if (used.has(stat.label)) continue;
    used.add(stat.label);
    out.push(stat);
  }
  return out;
}
