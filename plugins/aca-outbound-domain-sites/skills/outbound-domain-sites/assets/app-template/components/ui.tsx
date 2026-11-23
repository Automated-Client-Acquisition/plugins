import Link from "next/link";
import type { MarkId } from "@/lib/types";

/** Six geometric wordmark glyphs. Pure SVG, inherits the accent colour. */
export function Mark({ id, className = "" }: { id: MarkId; className?: string }) {
  const common = { width: 28, height: 28, viewBox: "0 0 28 28", fill: "none", className };
  switch (id) {
    case "orbit":
      return (
        <svg {...common} aria-hidden>
          <circle cx="14" cy="14" r="5" fill="currentColor" />
          <ellipse cx="14" cy="14" rx="12.5" ry="6.5" stroke="currentColor" strokeWidth="1.5" opacity=".55" transform="rotate(-28 14 14)" />
        </svg>
      );
    case "stack":
      return (
        <svg {...common} aria-hidden>
          <rect x="3" y="16.5" width="22" height="4.5" rx="1.4" fill="currentColor" opacity=".35" />
          <rect x="3" y="10.2" width="22" height="4.5" rx="1.4" fill="currentColor" opacity=".65" />
          <rect x="3" y="3.9" width="22" height="4.5" rx="1.4" fill="currentColor" />
        </svg>
      );
    case "bolt":
      return (
        <svg {...common} aria-hidden>
          <path d="M15.6 2.5 5.8 15.4h6.1l-1.6 10.1 10.3-13.3h-6.4l1.4-9.7Z" fill="currentColor" />
        </svg>
      );
    case "prism":
      return (
        <svg {...common} aria-hidden>
          <path d="M14 2.6 25.4 22.4H2.6L14 2.6Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
          <path d="M14 9.4 20.6 22.4H7.4L14 9.4Z" fill="currentColor" opacity=".8" />
        </svg>
      );
    case "arc":
      return (
        <svg {...common} aria-hidden>
          <path d="M3.5 22.5a10.5 10.5 0 0 1 21 0" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
          <circle cx="14" cy="22.5" r="2.6" fill="currentColor" />
        </svg>
      );
    case "grid":
    default:
      return (
        <svg {...common} aria-hidden>
          <rect x="3.5" y="3.5" width="8.4" height="8.4" rx="1.6" fill="currentColor" />
          <rect x="16.1" y="3.5" width="8.4" height="8.4" rx="1.6" fill="currentColor" opacity=".45" />
          <rect x="3.5" y="16.1" width="8.4" height="8.4" rx="1.6" fill="currentColor" opacity=".45" />
          <rect x="16.1" y="16.1" width="8.4" height="8.4" rx="1.6" fill="currentColor" />
        </svg>
      );
  }
}

type ButtonProps = {
  href: string;
  children: React.ReactNode;
  variant?: "accent" | "outline" | "ghost";
  onDark?: boolean;
  size?: "md" | "lg";
  className?: string;
};

export function Button({ href, children, variant = "accent", onDark = false, size = "md", className = "" }: ButtonProps) {
  const pad = size === "lg" ? "px-7 py-3.5 text-[15px]" : "px-5 py-2.5 text-sm";
  const base =
    "inline-flex items-center justify-center gap-2 rounded-full font-medium tracking-[-0.01em] transition-all duration-200 whitespace-nowrap";

  const styles: Record<string, string> = {
    accent:
      "bg-[var(--c-accent)] text-[var(--c-accent-ink)] hover:brightness-110 hover:-translate-y-px shadow-[0_1px_2px_rgba(0,0,0,.16),0_10px_24px_-12px_var(--c-accent)]",
    outline: onDark
      ? "border border-[var(--c-band-line)] text-[var(--c-band-ink)] hover:border-[var(--c-accent)] hover:text-[var(--c-accent)]"
      : "border border-[var(--c-line)] text-[var(--c-ink)] hover:border-[var(--c-accent)] hover:text-[var(--c-accent)]",
    ghost: onDark
      ? "text-[var(--c-band-muted)] hover:text-[var(--c-band-ink)]"
      : "text-[var(--c-muted)] hover:text-[var(--c-ink)]",
  };

  return (
    <Link href={href} className={`${base} ${pad} ${styles[variant]} ${className}`}>
      {children}
      {variant === "accent" && (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
          <path d="M3 7h8m0 0L7.6 3.6M11 7l-3.4 3.4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </Link>
  );
}

export function Eyebrow({ children, onDark = false }: { children: React.ReactNode; onDark?: boolean }) {
  return (
    <p
      className={`text-[11px] font-medium uppercase tracking-[0.18em] ${
        onDark ? "text-[var(--c-band-muted)]" : "text-[var(--c-muted)]"
      }`}
    >
      <span className="text-[var(--c-accent)]">—</span> {children}
    </p>
  );
}

export function Chip({ children, onDark = false }: { children: React.ReactNode; onDark?: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[12px] ${
        onDark
          ? "border-[var(--c-band-line)] bg-[var(--c-band-surface)] text-[var(--c-band-muted)]"
          : "border-[var(--c-line)] bg-[var(--c-surface)] text-[var(--c-muted)]"
      }`}
    >
      {children}
    </span>
  );
}

export function Section({
  children,
  dark = false,
  className = "",
  id,
}: {
  children: React.ReactNode;
  dark?: boolean;
  className?: string;
  id?: string;
}) {
  return (
    <section
      id={id}
      // The nav is sticky, so an anchor jump would otherwise land with the
      // heading hidden underneath it.
      className={`scroll-mt-16 px-5 sm:px-8 ${className}`}
      style={
        dark
          ? { background: "var(--c-band)", color: "var(--c-band-ink)" }
          : { background: "var(--c-bg)", color: "var(--c-ink)" }
      }
    >
      <div className="mx-auto w-full max-w-6xl py-20 sm:py-28">{children}</div>
    </section>
  );
}

export function SectionHead({
  eyebrow,
  title,
  body,
  onDark = false,
  align = "left",
}: {
  eyebrow: string;
  title: React.ReactNode;
  body?: string;
  onDark?: boolean;
  align?: "left" | "center";
}) {
  return (
    <div className={`${align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}`}>
      <Eyebrow onDark={onDark}>{eyebrow}</Eyebrow>
      <h2 className="mt-4 text-[clamp(1.75rem,3.4vw,2.6rem)] font-semibold leading-[1.1] tracking-[-0.03em] balance">
        {title}
      </h2>
      {body && (
        <p
          className={`mt-5 text-[15px] leading-[1.65] pretty ${
            onDark ? "text-[var(--c-band-muted)]" : "text-[var(--c-muted)]"
          }`}
        >
          {body}
        </p>
      )}
    </div>
  );
}
