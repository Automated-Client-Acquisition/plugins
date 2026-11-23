import type { Metadata } from "next";
import { headers } from "next/headers";
import { brandForHost } from "@/lib/brands";
import { FONT_PAIRS } from "@/lib/fonts";
import type { Palette } from "@/lib/types";
import { Footer, Nav } from "@/components/chrome";
import "./globals.css";

/** Palette → the CSS custom properties globals.css and every component read. */
function paletteVars(p: Palette): React.CSSProperties {
  return {
    "--c-bg": p.bg,
    "--c-surface": p.surface,
    "--c-ink": p.ink,
    "--c-muted": p.muted,
    "--c-line": p.line,
    "--c-band": p.band,
    "--c-band-surface": p.bandSurface,
    "--c-band-ink": p.bandInk,
    "--c-band-muted": p.bandMuted,
    "--c-band-line": p.bandLine,
    "--c-accent": p.accent,
    "--c-accent-ink": p.accentInk,
    "--c-accent-wash": p.accentWash,
  } as React.CSSProperties;
}

export async function generateMetadata(): Promise<Metadata> {
  const brand = brandForHost((await headers()).get("host"));
  const url = `https://${brand.domain}`;
  return {
    metadataBase: new URL(url),
    title: {
      default: `${brand.name} — ${brand.descriptor}`,
      template: `%s · ${brand.name}`,
    },
    description: brand.metaDescription,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      url,
      siteName: brand.name,
      title: `${brand.name} — ${brand.descriptor}`,
      description: brand.metaDescription,
    },
    twitter: {
      card: "summary_large_image",
      title: `${brand.name} — ${brand.descriptor}`,
      description: brand.metaDescription,
    },
    robots: { index: true, follow: true },
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const brand = brandForHost((await headers()).get("host"));
  const pair = FONT_PAIRS[brand.fonts];
  // The signal template's page background is already dark, so its chrome must
  // use the dark-band text colours rather than the light-band ones.
  const darkChrome = brand.template === "signal";

  return (
    <html
      lang="en"
      className={pair.className}
      style={paletteVars(brand.palette)}
      data-display={pair.displayIsMono ? "mono" : "serif"}
      data-brand={brand.domain}
    >
      <body className="min-h-dvh antialiased">
        <Nav brand={brand} onDark={darkChrome} />
        <main>{children}</main>
        <Footer brand={brand} onDark />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ProfessionalService",
              name: brand.name,
              url: `https://${brand.domain}`,
              description: brand.metaDescription,
              email: brand.contact.email,
              areaServed: "Worldwide",
              ...(brand.legalEntity ? { parentOrganization: { "@type": "Organization", name: brand.legalEntity } } : {}),
            }),
          }}
        />
      </body>
    </html>
  );
}
