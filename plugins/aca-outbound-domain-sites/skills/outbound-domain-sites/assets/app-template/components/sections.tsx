import { Fragment } from "react";
import type { Brand } from "@/lib/types";
import { COPY, TIMELINE, comparisonFor } from "@/lib/copy";
import { PROOF_AS_OF } from "@/lib/proof";
import { Button, Chip, Section, SectionHead } from "./ui";
import { QuoteCalculator } from "./quote-calculator";
import {
  BillingMockup,
  ChannelStackBad,
  ChannelStackGood,
  ComposeBad,
  ComposeGood,
  ExportBad,
  HandoverMockup,
  LiveDashboard,
  MeetingsCalendar,
  ThreadBad,
  ThreadGood,
} from "./mockups";

type P = { brand: Brand; dark?: boolean };

/** Two mockups side by side under a shared heading. The core "them vs us" device. */
function SplitProof({
  left,
  right,
  leftLabel,
  rightLabel,
  onDark,
}: {
  left: React.ReactNode;
  right: React.ReactNode;
  leftLabel: string;
  rightLabel: string;
  onDark?: boolean;
}) {
  const muted = onDark ? "text-[var(--c-band-muted)]" : "text-[var(--c-muted)]";
  return (
    <div className="mt-12 grid gap-5 lg:grid-cols-2">
      <div>
        <p className={`mb-3 text-[11px] font-medium uppercase tracking-[0.16em] ${muted}`}>{leftLabel}</p>
        {left}
      </div>
      <div>
        <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.16em]" style={{ color: "var(--c-accent)" }}>
          {rightLabel}
        </p>
        {right}
      </div>
    </div>
  );
}

export function StatsBand({ brand, dark = true }: P) {
  return (
    <Section dark={dark} className="!py-0">
      <div
        className="grid gap-px overflow-hidden rounded-2xl border sm:grid-cols-2 lg:grid-cols-4"
        style={{
          borderColor: dark ? "var(--c-band-line)" : "var(--c-line)",
          background: dark ? "var(--c-band-line)" : "var(--c-line)",
        }}
      >
        {brand.stats.map((s) => (
          <div key={s.label} className="p-6" style={{ background: dark ? "var(--c-band)" : "var(--c-bg)" }}>
            <p
              className="text-[clamp(1.5rem,2.8vw,2rem)] font-semibold tracking-[-0.03em]"
              style={{ color: "var(--c-accent)" }}
            >
              {s.value}
            </p>
            <p className={`mt-1 text-[13px] font-medium ${dark ? "text-[var(--c-band-ink)]" : "text-[var(--c-ink)]"}`}>
              {s.label}
            </p>
            {s.source && (
              <p className={`mt-1.5 text-[11px] leading-[1.45] ${dark ? "text-[var(--c-band-muted)]" : "text-[var(--c-muted)]"}`}>
                {s.source}
              </p>
            )}
          </div>
        ))}
      </div>
      <p className={`mt-4 text-[11px] ${dark ? "text-[var(--c-band-muted)]" : "text-[var(--c-muted)]"}`}>
        Measured across our own campaigns, {PROOF_AS_OF}.
      </p>
    </Section>
  );
}

/** The offer. This is the section the whole page exists to deliver. */
export function PricingSection({ brand, dark = false }: P) {
  const c = COPY.pricing(brand.copySeed);
  const line = dark ? "var(--c-band-line)" : "var(--c-line)";
  const mut = dark ? "text-[var(--c-band-muted)]" : "text-[var(--c-muted)]";

  return (
    <Section id="pricing" dark={dark}>
      <div className="grid items-start gap-12 lg:grid-cols-[1fr_0.95fr]">
        <div>
          <SectionHead eyebrow="What it costs" title={c.title} body={c.body} onDark={dark} />
          <ul className="mt-9 space-y-4">
            {[
              ["A free pilot first", "We run the first campaign at our cost. You read the replies before you commit."],
              ["No retainer", "Nothing monthly for our time, whatever happens."],
              ["You pay per live meeting", "An agreed price for each meeting a real buyer attends."],
              ["Plus the running costs", "The sending accounts and data the campaign needs, charged at cost."],
              ["No-shows are not billed", "If they do not turn up, it does not go on the invoice."],
              ["Yours at day 180", "We install it in-house and train your team to run it."],
            ].map(([t, d]) => (
              <li key={t} className="flex gap-3.5 border-b pb-4" style={{ borderColor: line }}>
                <span
                  className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full"
                  style={{ background: "var(--c-accent)", color: "var(--c-accent-ink)" }}
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
                    <path d="M2.5 6.2 4.8 8.5 9.5 3.8" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <span>
                  <span className="text-[14.5px] font-medium">{t}</span>
                  <span className={`ml-2 text-[14px] ${mut}`}>{d}</span>
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href={brand.bookingUrl ?? "/contact"} size="lg">
              {brand.hero.ctaPrimary}
            </Button>
            <Button href="#quote" variant="outline" size="lg" onDark={dark}>
              Request a quote
            </Button>
          </div>
        </div>
        {/* self-start: the mockup's `h-full` would otherwise resolve against the
            grid row and stretch it to match the taller bullet column. */}
        <div className="self-start lg:sticky lg:top-24">
          <BillingMockup onDark={dark} />
        </div>
      </div>
    </Section>
  );
}

/** Free quote + ROI estimate. */
export function QuoteSection({ brand, dark = false }: P) {
  return (
    <Section id="quote" dark={dark}>
      <SectionHead
        eyebrow="Free quote"
        align="center"
        onDark={dark}
        title={
          <>
            Get a free quote and{" "}
            <span className="display-em" style={{ color: "var(--c-accent)" }}>
              ROI estimate
            </span>
          </>
        }
        body="Answer four questions to see what hitting your meetings target would be worth. Send it over and we will come back with a price in writing."
      />
      <div className="mt-12">
        <QuoteCalculator currency={brand.currency ?? "$"} />
      </div>
    </Section>
  );
}

export function ChannelsSection({ brand, dark = false }: P) {
  const c = COPY.channels(brand.copySeed);
  return (
    <Section id="how" dark={dark}>
      <SectionHead eyebrow="How we reach them" title={c.title} body={c.body} onDark={dark} />
      <SplitProof
        onDark={dark}
        leftLabel="Most agencies"
        rightLabel={brand.name}
        left={<ChannelStackBad onDark={dark} />}
        right={<ChannelStackGood onDark={dark} />}
      />
    </Section>
  );
}

/** Week 1 → month 6, ending in the in-house handover. */
export function ProcessSection({ brand, dark = false }: P) {
  const c = COPY.process(brand.copySeed);
  const line = dark ? "var(--c-band-line)" : "var(--c-line)";
  const mut = dark ? "text-[var(--c-band-muted)]" : "text-[var(--c-muted)]";

  return (
    <Section dark={dark}>
      <SectionHead eyebrow="How it works" title={c.title} body={c.body} onDark={dark} />
      <ol className="mt-12 grid gap-px overflow-hidden rounded-2xl border sm:grid-cols-2 lg:grid-cols-4"
        style={{ borderColor: line, background: line }}
      >
        {TIMELINE.map((t, i) => (
          <li key={t.day} className="p-6" style={{ background: dark ? "var(--c-band)" : "var(--c-bg)" }}>
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em]" style={{ color: "var(--c-accent)" }}>
              {t.day}
            </p>
            <p className="mt-3 text-[15.5px] font-semibold leading-[1.3] tracking-[-0.02em]">{t.title}</p>
            <p className={`mt-2.5 text-[13px] leading-[1.6] ${mut}`}>{t.body}</p>
            <p className={`mt-5 text-[11px] ${mut}`}>0{i + 1} / 04</p>
          </li>
        ))}
      </ol>
    </Section>
  );
}

export function WritingSection({ brand, dark = false }: P) {
  const c = COPY.writing(brand.copySeed);
  return (
    <Section dark={dark}>
      <SectionHead eyebrow="What we send" title={c.title} body={c.body} onDark={dark} />
      <SplitProof
        onDark={dark}
        leftLabel="A mass email"
        rightLabel="Written for that company"
        left={<ComposeBad onDark={dark} />}
        right={<ComposeGood onDark={dark} />}
      />
    </Section>
  );
}

export function OpsSection({ brand, dark = false }: P) {
  const c = COPY.ops(brand.copySeed);
  return (
    <Section dark={dark}>
      <SectionHead eyebrow="Who you deal with" title={c.title} body={c.body} onDark={dark} />
      <SplitProof
        onDark={dark}
        leftLabel="A support queue"
        rightLabel="A direct line"
        left={<ThreadBad onDark={dark} />}
        right={<ThreadGood onDark={dark} />}
      />
    </Section>
  );
}

export function HandoffSection({ brand, dark = false }: P) {
  const c = COPY.handoff(brand.copySeed);
  return (
    <Section dark={dark}>
      <SectionHead eyebrow="What your team gets" title={c.title} body={c.body} onDark={dark} />
      <SplitProof
        onDark={dark}
        leftLabel="What most agencies hand over"
        rightLabel="What we hand over"
        left={<ExportBad onDark={dark} />}
        right={<MeetingsCalendar onDark={dark} />}
      />
    </Section>
  );
}

/** Don't rent your revenue — build a sales engine you own. */
export function OwnershipSection({ brand, dark = false }: P) {
  const c = COPY.ownership(brand.copySeed);
  return (
    <Section dark={dark}>
      <div className="grid items-center gap-12 lg:grid-cols-[1fr_0.9fr]">
        <SectionHead eyebrow="What you keep" title={c.title} body={c.body} onDark={dark} />
        <HandoverMockup onDark={dark} />
      </div>
    </Section>
  );
}

export function ReportingSection({ brand, dark = false }: P) {
  return (
    <Section dark={dark}>
      <div className="grid items-center gap-12 lg:grid-cols-[0.85fr_1.15fr]">
        <SectionHead
          eyebrow="What you can see"
          title="You can check how it is going without asking anyone"
          body="Who has been contacted, who replied, what is booked and what it has cost. Open it whenever you like. There is no monthly slide deck and no version of the numbers that we keep to ourselves."
          onDark={dark}
        />
        <LiveDashboard onDark={dark} />
      </div>
    </Section>
  );
}

/** Row glyphs, matched to the row order in lib/copy.ts by index. */
function RowIcon({ i }: { i: number }) {
  const p = { width: 16, height: 16, viewBox: "0 0 20 20", fill: "none" as const, "aria-hidden": true };
  const s = { stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  switch (i % 6) {
    case 0: // cost
      return (
        <svg {...p}>
          <circle cx="10" cy="10" r="7.2" {...s} />
          <path d="M10 6v8M12.2 7.8c-.5-.7-1.3-1-2.2-1-1.2 0-2 .6-2 1.6 0 2.2 4.4 1 4.4 3.2 0 1-.9 1.6-2.2 1.6-1 0-1.8-.4-2.3-1.1" {...s} />
        </svg>
      );
    case 1: // no-show / calendar
      return (
        <svg {...p}>
          <rect x="3" y="4.6" width="14" height="12.4" rx="2.2" {...s} />
          <path d="M3 8.6h14M7 3v3M13 3v3" {...s} />
        </svg>
      );
    case 2: // risk to find out
      return (
        <svg {...p}>
          <path d="M10 2.8 17.4 16H2.6L10 2.8Z" {...s} />
          <path d="M10 8v3.4M10 13.6v.05" {...s} />
        </svg>
      );
    case 3: // time
      return (
        <svg {...p}>
          <circle cx="10" cy="10" r="7.2" {...s} />
          <path d="M10 5.8V10l2.8 1.8" {...s} />
        </svg>
      );
    case 4: // ownership
      return (
        <svg {...p}>
          <circle cx="7" cy="12.6" r="3.1" {...s} />
          <path d="M9.3 10.4 16 3.7M13.4 6.3l1.8 1.8M11.6 8.1l1.8 1.8" {...s} />
        </svg>
      );
    default: // management load
      return (
        <svg {...p}>
          <circle cx="7.6" cy="7.4" r="2.7" {...s} />
          <path d="M2.8 16.2c0-2.6 2.1-4.3 4.8-4.3s4.8 1.7 4.8 4.3" {...s} />
          <path d="M13.6 5.2a2.7 2.7 0 0 1 0 5.1M14.6 12.3c1.7.5 2.8 1.9 2.8 3.9" {...s} />
        </svg>
      );
  }
}

export function ComparisonSection({ brand, dark = false }: P) {
  const rows = comparisonFor(brand.copySeed);
  const line = dark ? "var(--c-band-line)" : "var(--c-line)";
  const mut = dark ? "text-[var(--c-band-muted)]" : "text-[var(--c-muted)]";
  const inkc = dark ? "text-[var(--c-band-ink)]" : "text-[var(--c-ink)]";
  const cardBg = dark ? "var(--c-band-surface)" : "var(--c-bg)";
  // Hairline inside the accent card. Derived from the accent's own text colour so
  // it reads correctly whether that colour is near-white or near-black.
  const accentRule = "color-mix(in srgb, var(--c-accent-ink) 22%, transparent)";

  const columns = [
    { key: "ours" as const, name: brand.name, kind: "Pay for outcomes", accent: true },
    { key: "retainer" as const, name: "Agency retainer", kind: "Pay for activity", accent: false },
    { key: "inhouse" as const, name: "Hiring in-house", kind: "Pay for effort", accent: false },
  ];

  return (
    <Section dark={dark}>
      <SectionHead
        eyebrow="Compared with the alternatives"
        onDark={dark}
        title={
          <>
            Pay for outcomes, pay for activity, or{" "}
            <span className="display-em" style={{ color: "var(--c-accent)" }}>
              pay for effort
            </span>
          </>
        }
      />

      {/* ── Desktop: one continuous card per column, layered behind the cells ── */}
      <div className="mt-12 hidden lg:block">
        <div className="relative grid grid-cols-[0.95fr_1.15fr_1fr_1fr] gap-x-4">
          {/* Column backgrounds. Drawn as single elements so the columns read as
              cards with no seams between rows, and so the accent column can sit
              proud of the others. */}
          {/* `1 / -1` would resolve against the EXPLICIT grid, which is one row
              tall here, so the backgrounds would cover only the header. Span the
              header plus every data row instead. */}
          <div
            aria-hidden
            className="pointer-events-none -my-4 rounded-[26px]"
            style={{
              gridColumn: 2,
              gridRow: `1 / span ${rows.length + 1}`,
              background: "var(--c-accent)",
              boxShadow: "0 24px 60px -24px var(--c-accent), 0 2px 8px rgba(0,0,0,.10)",
            }}
          />
          {[3, 4].map((col) => (
            <div
              key={col}
              aria-hidden
              className="pointer-events-none rounded-[22px] border"
              style={{
                gridColumn: col,
                gridRow: `1 / span ${rows.length + 1}`,
                background: cardBg,
                borderColor: line,
              }}
            />
          ))}

          {/* Every cell is placed explicitly. The column backgrounds above are
              explicitly placed too, and auto-placement refuses to reuse cells an
              explicit item already occupies — so mixing the two silently pushes
              every auto cell into column 1. */}
          {columns.map((c, j) => (
            <div
              key={c.name}
              className="relative z-10 px-6 pb-6 pt-8 text-center"
              style={{ gridColumn: j + 2, gridRow: 1 }}
            >
              <p
                className={`text-[18px] font-semibold tracking-[-0.025em] ${c.accent ? "" : inkc}`}
                style={c.accent ? { color: "var(--c-accent-ink)" } : undefined}
              >
                {c.name}
              </p>
              <p
                className={`mt-1.5 text-[11.5px] tracking-[0.01em] ${c.accent ? "" : mut}`}
                style={c.accent ? { color: "var(--c-accent-ink)", opacity: 0.78 } : undefined}
              >
                [ {c.kind} ]
              </p>
            </div>
          ))}

          {rows.map((r, i) => (
            <Fragment key={r.label}>
              <div
                className="relative z-10 flex items-center gap-3.5 py-6 pr-5"
                style={{ gridColumn: 1, gridRow: i + 2, borderTop: i === 0 ? undefined : `1px solid ${line}` }}
              >
                <span
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                  style={{ background: "var(--c-accent-wash)", color: "var(--c-accent)" }}
                >
                  <RowIcon i={i} />
                </span>
                <span className={`text-[14px] font-medium leading-[1.35] ${inkc}`}>{r.label}</span>
              </div>

              <div
                className="relative z-10 flex items-center px-6 py-6 text-[14px] font-medium leading-[1.5]"
                style={{
                  gridColumn: 2,
                  gridRow: i + 2,
                  color: "var(--c-accent-ink)",
                  borderTop: i === 0 ? undefined : `1px solid ${accentRule}`,
                }}
              >
                {r.ours}
              </div>

              {(["retainer", "inhouse"] as const).map((k, kj) => (
                <div
                  key={k}
                  className={`relative z-10 flex items-center px-6 py-6 text-[13.5px] leading-[1.5] ${mut}`}
                  style={{
                    gridColumn: kj + 3,
                    gridRow: i + 2,
                    borderTop: i === 0 ? undefined : `1px solid ${line}`,
                  }}
                >
                  {r[k]}
                </div>
              ))}
            </Fragment>
          ))}
        </div>
      </div>

      {/* ── Mobile: one block per row, rather than an 880px sideways scroll ── */}
      <div className="mt-10 space-y-3 lg:hidden">
        {rows.map((r, i) => (
          <div
            key={r.label}
            className="overflow-hidden rounded-2xl border"
            style={{ borderColor: line, background: cardBg }}
          >
            <div className="flex items-center gap-3 px-4 py-3.5" style={{ borderBottom: `1px solid ${line}` }}>
              <span
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg"
                style={{ background: "var(--c-accent-wash)", color: "var(--c-accent)" }}
              >
                <RowIcon i={i} />
              </span>
              <span className={`text-[13.5px] font-semibold tracking-[-0.01em] ${inkc}`}>{r.label}</span>
            </div>

            <div className="px-4 py-3.5" style={{ background: "var(--c-accent)" }}>
              <p className="text-[10.5px] font-medium uppercase tracking-[0.14em]" style={{ color: "var(--c-accent-ink)", opacity: 0.75 }}>
                {brand.name}
              </p>
              <p className="mt-1 text-[13.5px] font-medium leading-[1.45]" style={{ color: "var(--c-accent-ink)" }}>
                {r.ours}
              </p>
            </div>

            {[
              { n: "Agency retainer", v: r.retainer },
              { n: "Hiring in-house", v: r.inhouse },
            ].map((c) => (
              <div key={c.n} className="px-4 py-3.5" style={{ borderTop: `1px solid ${line}` }}>
                <p className={`text-[10.5px] font-medium uppercase tracking-[0.14em] ${mut}`}>{c.n}</p>
                <p className={`mt-1 text-[13.5px] leading-[1.45] ${mut}`}>{c.v}</p>
              </div>
            ))}
          </div>
        ))}
      </div>
    </Section>
  );
}

export function FaqSection({ brand, dark = false }: P) {
  const line = dark ? "var(--c-band-line)" : "var(--c-line)";
  const mut = dark ? "text-[var(--c-band-muted)]" : "text-[var(--c-muted)]";
  return (
    <Section id="faq" dark={dark}>
      <div className="grid gap-12 lg:grid-cols-[0.7fr_1.3fr]">
        <SectionHead eyebrow="Questions" title="Before you book a call" onDark={dark} />
        <div>
          {brand.faq.map((f) => (
            <details key={f.q} className="group border-b py-5" style={{ borderColor: line }}>
              <summary className="flex cursor-pointer list-none items-start justify-between gap-6 text-[15px] font-medium leading-[1.45]">
                {f.q}
                <span
                  className="mt-0.5 shrink-0 transition-transform duration-200 group-open:rotate-45"
                  style={{ color: "var(--c-accent)" }}
                  aria-hidden
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                  </svg>
                </span>
              </summary>
              <p className={`mt-3 max-w-2xl text-[14px] leading-[1.65] pretty ${mut}`}>{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </Section>
  );
}

export function CtaSection({ brand, dark = true }: P) {
  const href = brand.bookingUrl ?? "/contact";
  return (
    <Section dark={dark}>
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-[clamp(1.9rem,4.4vw,3.1rem)] font-semibold leading-[1.06] tracking-[-0.035em] balance">
          {brand.angle}
        </h2>
        <p
          className={`mx-auto mt-5 max-w-xl text-[15px] leading-[1.65] ${
            dark ? "text-[var(--c-band-muted)]" : "text-[var(--c-muted)]"
          }`}
        >
          Tell us what you sell and who buys it. We will tell you what it would cost to book the meetings you want, and
          whether we think it will work.
        </p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <Button href={href} size="lg">
            {brand.hero.ctaPrimary}
          </Button>
          <Button href="#quote" variant="outline" size="lg" onDark={dark}>
            {brand.hero.ctaSecondary}
          </Button>
        </div>
        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {["Free pilot", "No retainer", "No-shows are not billed", "Yours at day 180"].map((t) => (
            <Chip key={t} onDark={dark}>
              {t}
            </Chip>
          ))}
        </div>
      </div>
    </Section>
  );
}
