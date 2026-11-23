import { ImageResponse } from "next/og";
import { headers } from "next/headers";
import { brandForHost } from "@/lib/brands";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Managed B2B outbound";

/**
 * Per-domain social card. Drawn from the brand palette so a link preview from
 * one domain never looks like a link preview from another.
 */
export default async function OgImage() {
  const brand = brandForHost((await headers()).get("host"));
  const p = brand.palette;

  // Precomputed so every leaf below holds exactly one child: Satori treats two
  // adjacent expressions as two children and rejects them without a display.
  const initial = brand.name.replace(/[^A-Za-z]/g, "").charAt(0).toUpperCase();
  const accentLine = brand.hero.headlineTail
    ? `${brand.hero.headlineAccent} ${brand.hero.headlineTail}`
    : brand.hero.headlineAccent;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: p.band,
          color: p.bandInk,
          padding: 72,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: p.accent,
              color: p.accentInk,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 26,
              fontWeight: 700,
            }}
          >
            {initial}
          </div>
          <div style={{ fontSize: 28, fontWeight: 600, letterSpacing: "-0.02em" }}>{brand.name}</div>
        </div>

        {/* Satori requires an explicit display on any element with more than one
            child, and it has no inline layout — so each line is its own leaf
            div holding a single string rather than mixed text and spans. */}
        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          <div style={{ display: "flex", flexDirection: "column", maxWidth: 960 }}>
            <div style={{ fontSize: 60, fontWeight: 700, letterSpacing: "-0.04em", lineHeight: 1.06 }}>
              {brand.hero.headline}
            </div>
            <div style={{ fontSize: 60, fontWeight: 700, letterSpacing: "-0.04em", lineHeight: 1.06, color: p.accent }}>
              {accentLine}
            </div>
          </div>
          <div style={{ display: "flex", fontSize: 25, color: p.bandMuted, maxWidth: 860, lineHeight: 1.4 }}>
            {brand.hero.qualifier}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 21, color: p.bandMuted }}>
          <div>{brand.descriptor}</div>
          <div style={{ color: p.accent }}>{brand.domain}</div>
        </div>
      </div>
    ),
    size
  );
}
