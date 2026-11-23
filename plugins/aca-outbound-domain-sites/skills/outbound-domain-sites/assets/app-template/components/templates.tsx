import type { Brand } from "@/lib/types";
import { Button, Chip, Eyebrow, Section } from "./ui";
import { ChannelStackGood, LiveDashboard, MeetingsCalendar } from "./mockups";
import {
  ChannelsSection,
  ComparisonSection,
  CtaSection,
  FaqSection,
  HandoffSection,
  OpsSection,
  OwnershipSection,
  PricingSection,
  ProcessSection,
  QuoteSection,
  ReportingSection,
  StatsBand,
  WritingSection,
} from "./sections";

/**
 * Four structurally different page templates.
 *
 * They differ in hero construction, section order, which bands invert, and how
 * dense the type is — not just in colour. Two domains on the same template never
 * share a palette or a font pairing, so no two of the fifteen sites read as the
 * same page with the hue rotated.
 *
 * QuoteSection always renders on a light band: the calculator uses the
 * light-band colour tokens, and inverting it would need a second set.
 */

/** The three things a visitor needs to believe before they read anything else. */
const TRUST = ["Free pilot", "No retainer", "No-shows are not billed", "Yours at day 180"];

function TrustChips({ onDark = false, center = false }: { onDark?: boolean; center?: boolean }) {
  return (
    <div className={`flex flex-wrap gap-2 ${center ? "justify-center" : ""}`}>
      {TRUST.map((t) => (
        <Chip key={t} onDark={onDark}>
          <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ background: "var(--c-accent)" }} />
          {t}
        </Chip>
      ))}
    </div>
  );
}

function Headline({ brand, className = "" }: { brand: Brand; className?: string }) {
  const { headline, headlineAccent, headlineTail } = brand.hero;
  return (
    <h1 className={`balance ${className}`}>
      {headline}{" "}
      <span className="display-em" style={{ color: "var(--c-accent)" }}>
        {headlineAccent}
      </span>
      {headlineTail ? <> {headlineTail}</> : null}
    </h1>
  );
}

function CtaPair({ brand, onDark = false }: { brand: Brand; onDark?: boolean }) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button href={brand.bookingUrl ?? "/contact"} size="lg">
        {brand.hero.ctaPrimary}
      </Button>
      <Button href="#quote" variant="outline" size="lg" onDark={onDark}>
        {brand.hero.ctaSecondary}
      </Button>
    </div>
  );
}

/* ── aurora: light hero, alternating bands, outcome mockups in the fold ───── */

function AuroraHero({ brand }: { brand: Brand }) {
  return (
    <div className="relative overflow-hidden" style={{ background: "var(--c-bg)" }}>
      <div
        className="pointer-events-none absolute -top-52 left-1/2 h-[520px] w-[900px] -translate-x-1/2 rounded-full blur-3xl"
        style={{ background: "var(--c-accent-wash)" }}
        aria-hidden
      />
      <div className="relative mx-auto w-full max-w-6xl px-5 pb-20 pt-16 sm:px-8 sm:pb-28 sm:pt-24">
        <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rise">
            <Eyebrow>{brand.hero.eyebrow}</Eyebrow>
            <Headline
              brand={brand}
              className="mt-5 text-[clamp(2.2rem,5.2vw,3.7rem)] font-semibold leading-[1.04] tracking-[-0.04em]"
            />
            <p className="mt-6 max-w-xl text-[16px] leading-[1.65] pretty text-[var(--c-muted)]">{brand.hero.sub}</p>
            <div className="mt-9">
              <CtaPair brand={brand} />
            </div>
            <div className="mt-7">
              <TrustChips />
            </div>
            <p className="mt-5 text-[12.5px] text-[var(--c-muted)]">{brand.hero.qualifier}</p>
          </div>
          <div className="rise" style={{ animationDelay: "120ms" }}>
            <MeetingsCalendar />
            <div className="mt-4">
              <ChannelStackGood />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Aurora({ brand }: { brand: Brand }) {
  return (
    <>
      <AuroraHero brand={brand} />
      <StatsBand brand={brand} dark />
      <PricingSection brand={brand} />
      <ChannelsSection brand={brand} dark />
      <ProcessSection brand={brand} />
      <QuoteSection brand={brand} />
      <ComparisonSection brand={brand} dark />
      <WritingSection brand={brand} />
      <HandoffSection brand={brand} dark />
      <OwnershipSection brand={brand} />
      <FaqSection brand={brand} />
      <CtaSection brand={brand} dark />
    </>
  );
}

/* ── ledger: editorial, data-forward, mostly light ────────────────────────── */

function LedgerHero({ brand }: { brand: Brand }) {
  return (
    <div style={{ background: "var(--c-bg)" }}>
      <div className="mx-auto w-full max-w-6xl px-5 pb-16 pt-16 sm:px-8 sm:pb-24 sm:pt-24">
        <div className="rise max-w-4xl">
          <Eyebrow>{brand.hero.eyebrow}</Eyebrow>
          <Headline
            brand={brand}
            className="mt-6 text-[clamp(2.3rem,5.6vw,4.1rem)] font-semibold leading-[1.02] tracking-[-0.045em]"
          />
        </div>
        <div className="mt-12 grid gap-10 border-t pt-10 lg:grid-cols-[1.1fr_0.9fr]" style={{ borderColor: "var(--c-line)" }}>
          <div className="rise" style={{ animationDelay: "100ms" }}>
            <p className="max-w-xl text-[16px] leading-[1.7] pretty text-[var(--c-muted)]">{brand.hero.sub}</p>
            <div className="mt-8">
              <CtaPair brand={brand} />
            </div>
            <div className="mt-7">
              <TrustChips />
            </div>
          </div>
          <dl className="rise grid grid-cols-2 gap-6 self-start" style={{ animationDelay: "180ms" }}>
            {brand.stats.slice(0, 4).map((s) => (
              <div key={s.label} className="border-l pl-4" style={{ borderColor: "var(--c-accent)" }}>
                <dt className="text-[20px] font-semibold tracking-[-0.03em]">{s.value}</dt>
                <dd className="mt-1 text-[12px] leading-[1.45] text-[var(--c-muted)]">{s.label}</dd>
              </div>
            ))}
          </dl>
        </div>
        <p className="mt-8 text-[12.5px] text-[var(--c-muted)]">{brand.hero.qualifier}</p>
      </div>
    </div>
  );
}

function Ledger({ brand }: { brand: Brand }) {
  return (
    <>
      <LedgerHero brand={brand} />
      <PricingSection brand={brand} dark />
      <ComparisonSection brand={brand} />
      <QuoteSection brand={brand} />
      <ProcessSection brand={brand} dark />
      <ChannelsSection brand={brand} />
      <HandoffSection brand={brand} dark />
      <OwnershipSection brand={brand} />
      <ReportingSection brand={brand} dark />
      <FaqSection brand={brand} />
      <CtaSection brand={brand} dark />
    </>
  );
}

/* ── signal: dark throughout, technical, grid-ruled ───────────────────────── */

function SignalHero({ brand }: { brand: Brand }) {
  return (
    <div className="relative overflow-hidden" style={{ background: "var(--c-bg)" }}>
      <div className="grid-lines pointer-events-none absolute inset-0" aria-hidden />
      <div className="relative mx-auto w-full max-w-6xl px-5 pb-20 pt-20 sm:px-8 sm:pb-28 sm:pt-28">
        <div className="rise mx-auto max-w-3xl text-center">
          <Eyebrow>{brand.hero.eyebrow}</Eyebrow>
          <Headline
            brand={brand}
            className="mt-6 text-[clamp(2.1rem,5.2vw,3.7rem)] font-semibold leading-[1.05] tracking-[-0.045em]"
          />
          <p className="mx-auto mt-6 max-w-xl text-[16px] leading-[1.65] pretty text-[var(--c-muted)]">{brand.hero.sub}</p>
          <div className="mt-9 flex justify-center">
            <CtaPair brand={brand} onDark />
          </div>
          <div className="mt-7">
            <TrustChips center />
          </div>
          <p className="mt-5 text-[12.5px] text-[var(--c-muted)]">{brand.hero.qualifier}</p>
        </div>
        <div className="rise mx-auto mt-16 max-w-4xl" style={{ animationDelay: "140ms" }}>
          <LiveDashboard />
        </div>
      </div>
    </div>
  );
}

function Signal({ brand }: { brand: Brand }) {
  return (
    <>
      <SignalHero brand={brand} />
      <StatsBand brand={brand} dark />
      <PricingSection brand={brand} />
      <ProcessSection brand={brand} dark />
      <QuoteSection brand={brand} />
      <ChannelsSection brand={brand} dark />
      <WritingSection brand={brand} />
      <ComparisonSection brand={brand} dark />
      <HandoffSection brand={brand} />
      <OwnershipSection brand={brand} dark />
      <FaqSection brand={brand} />
      <CtaSection brand={brand} dark />
    </>
  );
}

/* ── press: magazine, serif-forward, generous rules ───────────────────────── */

function PressHero({ brand }: { brand: Brand }) {
  return (
    <div style={{ background: "var(--c-bg)" }}>
      <div className="mx-auto w-full max-w-5xl px-5 pb-14 pt-20 sm:px-8 sm:pb-20 sm:pt-28">
        <div className="rise text-center">
          <Eyebrow>{brand.hero.eyebrow}</Eyebrow>
          <h1 className="mx-auto mt-7 max-w-4xl text-[clamp(2.2rem,5.8vw,4rem)] leading-[1.03] tracking-[-0.035em] balance">
            <span className="display">{brand.hero.headline} </span>
            <span className="display-em" style={{ color: "var(--c-accent)" }}>
              {brand.hero.headlineAccent}
            </span>
            {brand.hero.headlineTail ? <span className="display"> {brand.hero.headlineTail}</span> : null}
          </h1>
          <p className="mx-auto mt-7 max-w-xl text-[16.5px] leading-[1.7] pretty text-[var(--c-muted)]">{brand.hero.sub}</p>
          <div className="mt-9 flex justify-center">
            <CtaPair brand={brand} />
          </div>
          <div className="mt-7">
            <TrustChips center />
          </div>
        </div>
      </div>
      <div className="mx-auto w-full max-w-5xl px-5 sm:px-8">
        <div className="border-y py-5 text-center" style={{ borderColor: "var(--c-line)" }}>
          <p className="text-[12.5px] tracking-[0.02em] text-[var(--c-muted)]">{brand.hero.qualifier}</p>
        </div>
      </div>
    </div>
  );
}

function Press({ brand }: { brand: Brand }) {
  return (
    <>
      <PressHero brand={brand} />
      <PricingSection brand={brand} />
      <StatsBand brand={brand} dark />
      <WritingSection brand={brand} />
      <QuoteSection brand={brand} />
      <OpsSection brand={brand} dark />
      <ChannelsSection brand={brand} />
      <ProcessSection brand={brand} dark />
      <ComparisonSection brand={brand} />
      <OwnershipSection brand={brand} dark />
      <HandoffSection brand={brand} />
      <FaqSection brand={brand} />
      <CtaSection brand={brand} dark />
    </>
  );
}

export function Template({ brand }: { brand: Brand }) {
  switch (brand.template) {
    case "aurora":
      return <Aurora brand={brand} />;
    case "ledger":
      return <Ledger brand={brand} />;
    case "signal":
      return <Signal brand={brand} />;
    case "press":
      return <Press brand={brand} />;
  }
}

export { Section };
