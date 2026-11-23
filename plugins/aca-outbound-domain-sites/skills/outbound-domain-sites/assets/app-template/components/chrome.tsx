import Link from "next/link";
import type { Brand } from "@/lib/types";
import { Button, Mark } from "./ui";

const NAV = [
  { href: "/#pricing", label: "What it costs" },
  { href: "/#how", label: "How it works" },
  { href: "/#quote", label: "Free quote" },
  { href: "/#faq", label: "FAQ" },
];

export function Nav({ brand, onDark = false }: { brand: Brand; onDark?: boolean }) {
  const border = onDark ? "var(--c-band-line)" : "var(--c-line)";
  const mutedText = onDark ? "text-[var(--c-band-muted)]" : "text-[var(--c-muted)]";
  const inkText = onDark ? "text-[var(--c-band-ink)]" : "text-[var(--c-ink)]";
  return (
    <header
      className="sticky top-0 z-50 border-b backdrop-blur-md"
      style={{
        borderColor: border,
        background: onDark ? "color-mix(in srgb, var(--c-band) 82%, transparent)" : "color-mix(in srgb, var(--c-bg) 82%, transparent)",
      }}
    >
      <div className="mx-auto flex w-full max-w-6xl items-center gap-6 px-5 py-3.5 sm:px-8">
        <Link href="/" className={`flex items-center gap-2.5 ${inkText}`}>
          <span style={{ color: "var(--c-accent)" }}>
            <Mark id={brand.mark} className="h-6 w-6" />
          </span>
          <span className="max-w-[9rem] text-[14.5px] font-semibold leading-[1.12] tracking-[-0.02em] sm:max-w-none sm:text-[15px]">
            {brand.name}
          </span>
        </Link>
        <nav className="ml-auto hidden items-center gap-7 md:flex">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className={`text-[13.5px] transition-colors hover:text-[var(--c-accent)] ${mutedText}`}>
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto md:ml-0">
          <Button href={brand.bookingUrl ?? "/contact"}>{brand.hero.ctaPrimary}</Button>
        </div>
      </div>
    </header>
  );
}

export function Footer({ brand, onDark = true }: { brand: Brand; onDark?: boolean }) {
  const year = new Date().getFullYear();
  const border = onDark ? "var(--c-band-line)" : "var(--c-line)";
  const mutedText = onDark ? "text-[var(--c-band-muted)]" : "text-[var(--c-muted)]";
  const inkText = onDark ? "text-[var(--c-band-ink)]" : "text-[var(--c-ink)]";

  return (
    <footer
      className="border-t px-5 sm:px-8"
      style={{
        borderColor: border,
        background: onDark ? "var(--c-band)" : "var(--c-surface)",
        color: onDark ? "var(--c-band-ink)" : "var(--c-ink)",
      }}
    >
      <div className="mx-auto w-full max-w-6xl py-14">
        <div className="flex flex-wrap items-start justify-between gap-10">
          <div className="max-w-xs">
            <div className={`flex items-center gap-2.5 ${inkText}`}>
              <span style={{ color: "var(--c-accent)" }}>
                <Mark id={brand.mark} className="h-6 w-6" />
              </span>
              <span className="max-w-[9rem] text-[14.5px] font-semibold leading-[1.12] tracking-[-0.02em] sm:max-w-none sm:text-[15px]">
            {brand.name}
          </span>
            </div>
            <p className={`mt-3 text-[13px] leading-[1.6] ${mutedText}`}>{brand.descriptor}. {brand.angle}</p>
          </div>

          <div className="flex flex-wrap gap-14">
            <div>
              <p className={`text-[11px] font-medium uppercase tracking-[0.16em] ${mutedText}`}>Site</p>
              <ul className="mt-3.5 space-y-2.5">
                {[...NAV, { href: "/about", label: "About" }, { href: "/contact", label: "Contact" }].map((n) => (
                  <li key={n.href}>
                    <Link href={n.href} className={`text-[13.5px] transition-colors hover:text-[var(--c-accent)] ${mutedText}`}>
                      {n.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className={`text-[11px] font-medium uppercase tracking-[0.16em] ${mutedText}`}>Legal</p>
              <ul className="mt-3.5 space-y-2.5">
                {[
                  { href: "/privacy", label: "Privacy policy" },
                  { href: "/terms", label: "Terms of service" },
                ].map((n) => (
                  <li key={n.href}>
                    <Link href={n.href} className={`text-[13.5px] transition-colors hover:text-[var(--c-accent)] ${mutedText}`}>
                      {n.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className={`text-[11px] font-medium uppercase tracking-[0.16em] ${mutedText}`}>Get in touch</p>
              <ul className="mt-3.5 space-y-2.5">
                <li>
                  <a href={`mailto:${brand.contact.email}`} className={`text-[13.5px] transition-colors hover:text-[var(--c-accent)] ${mutedText}`}>
                    {brand.contact.email}
                  </a>
                </li>
                {brand.contact.phone && (
                  <li className={`text-[13.5px] ${mutedText}`}>{brand.contact.phone}</li>
                )}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t pt-6" style={{ borderColor: border }}>
          <p className={`text-[12px] ${mutedText}`}>
            © {year} {brand.name}
            {brand.legalEntity ? ` · a trading name of ${brand.legalEntity}` : ""}. All rights reserved.
          </p>
          <p className={`text-[12px] ${mutedText}`}>{brand.domain}</p>
        </div>
      </div>
    </footer>
  );
}
