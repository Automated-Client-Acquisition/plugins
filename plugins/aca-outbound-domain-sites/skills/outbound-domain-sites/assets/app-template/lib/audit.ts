import { BRANDS } from "./brands";
import { COPY, comparisonFor } from "./copy";

/**
 * Differentiation audit.
 *
 * The whole point of this app is that fifteen domains do NOT look like one page
 * with the hue rotated. This function proves it mechanically instead of by eye:
 *
 *  - no two brands share a (template, palette) pair
 *  - no two brands share a (template, font pair)
 *  - no two brands render an identical set of body paragraphs
 *  - no two brands share an accent colour
 *
 * Exposed at /api/brands in development. Run it after adding a domain.
 */

export interface AuditIssue {
  kind: string;
  detail: string;
  domains: string[];
}

export function auditBrands() {
  const issues: AuditIssue[] = [];

  const seen = {
    templatePalette: new Map<string, string[]>(),
    templateFonts: new Map<string, string[]>(),
    accent: new Map<string, string[]>(),
    copy: new Map<string, string[]>(),
    seed: new Map<number, string[]>(),
  };

  const rows = BRANDS.map((b) => {
    const c = {
      pricing: COPY.pricing(b.copySeed),
      channels: COPY.channels(b.copySeed),
      process: COPY.process(b.copySeed),
      writing: COPY.writing(b.copySeed),
      ops: COPY.ops(b.copySeed),
      handoff: COPY.handoff(b.copySeed),
      ownership: COPY.ownership(b.copySeed),
    };
    const copyKey = Object.values(c)
      .map((s) => s.title)
      .join("|");

    const push = (m: Map<string | number, string[]>, k: string | number) => {
      const list = m.get(k) ?? [];
      list.push(b.domain);
      m.set(k, list);
    };

    push(seen.templatePalette as Map<string | number, string[]>, `${b.template}:${b.palette.bg}:${b.palette.accent}`);
    push(seen.templateFonts as Map<string | number, string[]>, `${b.template}:${b.fonts}`);
    push(seen.accent as Map<string | number, string[]>, b.palette.accent);
    push(seen.copy as Map<string | number, string[]>, copyKey);
    push(seen.seed as Map<string | number, string[]>, b.copySeed);

    return {
      domain: b.domain,
      name: b.name,
      template: b.template,
      fonts: b.fonts,
      mark: b.mark,
      accent: b.palette.accent,
      background: b.palette.bg,
      copySeed: b.copySeed,
      comparisonTable: comparisonFor(b.copySeed)[0].label,
      sections: Object.fromEntries(Object.entries(c).map(([k, v]) => [k, v.title])),
    };
  });

  const collide = (m: Map<unknown, string[]>, kind: string) => {
    for (const [k, domains] of m) {
      if (domains.length > 1) issues.push({ kind, detail: String(k), domains });
    }
  };

  collide(seen.templatePalette, "same template + palette");
  collide(seen.templateFonts, "same template + font pair");
  collide(seen.accent, "same accent colour");
  collide(seen.copy, "identical body copy");
  collide(seen.seed, "duplicate copySeed");

  return {
    total: BRANDS.length,
    ok: issues.length === 0,
    issues,
    templates: countBy(BRANDS.map((b) => b.template)),
    fonts: countBy(BRANDS.map((b) => b.fonts)),
    rows,
  };
}

function countBy(values: string[]): Record<string, number> {
  return values.reduce<Record<string, number>>((acc, v) => {
    acc[v] = (acc[v] ?? 0) + 1;
    return acc;
  }, {});
}
