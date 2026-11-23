"use client";

import { useMemo, useState } from "react";

/**
 * "Get a free quote and ROI estimate."
 *
 * Four questions, a live estimate of what hitting the target is worth, and a CTA
 * that carries the answers into the contact form.
 *
 * IMPORTANT: this never states a price per meeting. Price depends on who the
 * client is targeting and how hard those people are to reach, so it is quoted by
 * hand after a conversation — putting a number on the page would either be wrong
 * or would anchor the deal before the account has been scoped.
 *
 * The return figure is therefore calculated against the budget the VISITOR
 * entered, not against any price of ours. Everything on screen is arithmetic on
 * inputs they chose, and it is labelled as an estimate rather than a forecast.
 */

const MEETINGS = [100, 200, 300, 400];
const BUDGETS = [5_000, 10_000, 25_000, 50_000];
const CLOSE_RATES = [0.05, 0.1, 0.2, 0.3];

/**
 * A bigger budget buys more meetings, so raising it raises the target. Without
 * this the two questions describe the same thing independently, and any "return
 * on budget" figure falls as the budget rises — which is backwards.
 *
 * The visitor can still move the target afterwards; this only sets the default.
 */
const BUDGET_TO_MEETINGS: Record<number, number> = {
  5_000: 100,
  10_000: 200,
  25_000: 300,
  50_000: 400,
};

/** Exact, with separators. Used for the per-meeting value, which a quote has to beat. */
function exact(n: number, currency: string) {
  return `${currency}${Math.round(n).toLocaleString("en-US")}`;
}

function money(n: number, currency: string) {
  if (n >= 1_000_000) return `${currency}${(n / 1_000_000).toFixed(n >= 10_000_000 ? 0 : 1)}M`;
  if (n >= 1_000) return `${currency}${Math.round(n / 1_000)}K`;
  return `${currency}${Math.round(n)}`;
}

function Option({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className="flex items-center gap-2.5 rounded-xl border px-4 py-3 text-[14px] font-medium transition-all duration-150"
      style={{
        borderColor: active ? "var(--c-accent)" : "var(--c-line)",
        background: active ? "var(--c-accent-wash)" : "transparent",
        color: active ? "var(--c-accent)" : "var(--c-ink)",
      }}
    >
      <span
        className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full border"
        style={{ borderColor: active ? "var(--c-accent)" : "var(--c-line)" }}
      >
        {active && <span className="h-2 w-2 rounded-full" style={{ background: "var(--c-accent)" }} />}
      </span>
      {children}
    </button>
  );
}

function Question({ n, label, children }: { n: string; label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[14.5px] font-semibold tracking-[-0.01em]">
        <span className="mr-2 font-medium text-[var(--c-muted)]">{n}</span>
        {label}
      </p>
      <div className="mt-3 flex flex-wrap gap-2.5">{children}</div>
    </div>
  );
}

export function QuoteCalculator({ currency = "$" }: { currency?: string }) {
  // Defaults are chosen so the first view is a clean, positive estimate. The
  // over-budget note is real feedback, not something to greet the visitor with.
  const [meetings, setMeetings] = useState(200);
  const [budget, setBudget] = useState(25_000);
  const [ltv, setLtv] = useState(20_000);
  const [closeRate, setCloseRate] = useState(0.2);

  const r = useMemo(() => {
    const deals = meetings * closeRate;
    const revenue = deals * ltv;
    // What one meeting is worth before paying anything for it. This is the number
    // any quote has to beat, it needs no price from us, and unlike a
    // "return on budget" ratio it cannot move the wrong way when an input changes.
    const perMeetingValue = ltv * closeRate;
    return { deals, revenue, perMeetingValue, spend: budget * 6 };
  }, [meetings, budget, ltv, closeRate]);

  function chooseBudget(b: number) {
    setBudget(b);
    setMeetings(BUDGET_TO_MEETINGS[b] ?? meetings);
  }

  const quoteHref = `/contact?meetings=${meetings}&budget=${budget}&ltv=${ltv}&close=${Math.round(
    closeRate * 100
  )}`;

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      {/* Questions */}
      <div
        className="overflow-hidden rounded-2xl border"
        style={{ borderColor: "var(--c-line)", background: "var(--c-surface)" }}
      >
        <div className="flex items-center gap-2 border-b px-4 py-2.5" style={{ borderColor: "var(--c-line)" }}>
          <span className="flex gap-1.5" aria-hidden>
            {["#F87171", "#FBBF24", "#34D399"].map((c) => (
              <span key={c} className="h-2 w-2 rounded-full" style={{ background: c, opacity: 0.7 }} />
            ))}
          </span>
          <span className="ml-1 text-[11px] font-medium text-[var(--c-muted)]">Your estimate</span>
        </div>

        <div className="space-y-7 p-5 sm:p-7">
          <Question n="01." label="How many meetings do you want over the next 6 months?">
            {MEETINGS.map((m) => (
              <Option key={m} active={meetings === m} onClick={() => setMeetings(m)}>
                {m}
              </Option>
            ))}
          </Question>

          <Question n="02." label="What is your monthly budget?">
            {BUDGETS.map((b) => (
              <Option key={b} active={budget === b} onClick={() => chooseBudget(b)}>
                {money(b, currency)}
                {b === 50_000 ? "+" : ""}
              </Option>
            ))}
          </Question>

          <div>
            <p className="text-[14.5px] font-semibold tracking-[-0.01em]">
              <span className="mr-2 font-medium text-[var(--c-muted)]">03.</span>
              What is a customer worth to you?
            </p>
            <div
              className="mt-3 flex max-w-xs items-center overflow-hidden rounded-xl border"
              style={{ borderColor: "var(--c-line)" }}
            >
              <span
                className="px-3.5 py-3 text-[14px] font-medium text-[var(--c-muted)]"
                style={{ background: "var(--c-accent-wash)" }}
              >
                {currency}
              </span>
              <input
                type="number"
                min={1000}
                step={1000}
                value={ltv}
                onChange={(e) => setLtv(Math.max(1000, Number(e.target.value) || 0))}
                aria-label="Average customer lifetime value"
                className="w-full bg-transparent px-3 py-3 text-[15px] font-medium outline-none"
              />
            </div>
            <p className="mt-2 text-[12px] text-[var(--c-muted)]">
              Total revenue from an average customer, not the first invoice.
            </p>
          </div>

          <Question n="04." label="Roughly what share of meetings turn into customers?">
            {CLOSE_RATES.map((c) => (
              <Option key={c} active={closeRate === c} onClick={() => setCloseRate(c)}>
                {Math.round(c * 100)}%
              </Option>
            ))}
          </Question>
        </div>
      </div>

      {/* Result */}
      <div
        className="flex flex-col justify-between rounded-2xl border p-5 sm:p-7"
        style={{ borderColor: "var(--c-accent)", background: "var(--c-accent-wash)" }}
      >
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[var(--c-muted)]">What that is worth</p>

          <div className="mt-5">
            <p className="text-[12.5px] text-[var(--c-muted)]">One meeting is worth, on average</p>
            <p className="text-[clamp(2.2rem,4.4vw,3rem)] font-semibold tracking-[-0.035em]" style={{ color: "var(--c-accent)" }}>
              {exact(r.perMeetingValue, currency)}
            </p>
            <p className="mt-1.5 text-[12px] leading-[1.5] text-[var(--c-muted)]">
              {Math.round(closeRate * 100)}% of {exact(ltv, currency)} — before you pay anything for it.
            </p>
          </div>

          <dl className="mt-6 space-y-3.5 border-t pt-5 text-[14px]" style={{ borderColor: "var(--c-line)" }}>
            {[
              ["Meetings over 6 months", `${meetings}`],
              [`Customers won at ${Math.round(closeRate * 100)}%`, `${Math.round(r.deals)}`],
              ["Your budget over 6 months", money(r.spend, currency)],
            ].map(([k, v]) => (
              <div key={k} className="flex items-baseline justify-between gap-4">
                <dt className="text-[var(--c-muted)]">{k}</dt>
                <dd className="shrink-0 font-semibold tracking-[-0.01em]">{v}</dd>
              </div>
            ))}
            <div
              className="flex items-baseline justify-between gap-4 border-t pt-3.5"
              style={{ borderColor: "var(--c-line)" }}
            >
              <dt className="font-medium">Revenue from those customers</dt>
              <dd className="text-[22px] font-semibold tracking-[-0.02em]" style={{ color: "var(--c-accent)" }}>
                {money(r.revenue, currency)}
              </dd>
            </div>
          </dl>

          <p className="mt-5 rounded-lg px-3 py-2.5 text-[12.5px] leading-[1.55]" style={{ background: "var(--c-surface)" }}>
            Whatever we quote per meeting has to come in under {exact(r.perMeetingValue, currency)}, or it is not worth
            doing. That price depends on who you are going after and how hard they are to reach, so we work it out by
            hand and put it in writing.
          </p>
        </div>

        <div className="mt-7">
          <a
            href={quoteHref}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3.5 text-[15px] font-medium transition-all duration-200 hover:brightness-110"
            style={{ background: "var(--c-accent)", color: "var(--c-accent-ink)" }}
          >
            Request my quote
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
              <path d="M3 7h8m0 0L7.6 3.6M11 7l-3.4 3.4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
          <p className="mt-3 text-[11.5px] leading-[1.5] text-[var(--c-muted)]">
            Worked out from the numbers you entered. It is an estimate, not a forecast or a guarantee — your real close
            rate decides the outcome.
          </p>
        </div>
      </div>
    </div>
  );
}
