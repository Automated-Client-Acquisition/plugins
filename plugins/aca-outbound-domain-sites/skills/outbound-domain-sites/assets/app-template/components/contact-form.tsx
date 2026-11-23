"use client";

import { useState } from "react";

type State = { status: "idle" | "sending" | "sent" | "error"; message?: string };

export interface QuoteAnswers {
  meetings?: string;
  budget?: string;
  ltv?: string;
  close?: string;
}

export function ContactForm({
  brandDomain,
  brandName,
  fallbackEmail,
  currency = "$",
  quote,
}: {
  brandDomain: string;
  brandName: string;
  fallbackEmail: string;
  currency?: string;
  /**
   * Answers carried over from the quote calculator. Submitted as structured
   * hidden fields rather than pasted into the message, so they land in the CRM
   * as numbers you can filter and quote against.
   */
  quote?: QuoteAnswers;
}) {
  const [state, setState] = useState<State>({ status: "idle" });

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    setState({ status: "sending" });

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, brandDomain, brandName }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        setState({ status: "error", message: body.error ?? "Something went wrong. Please email us directly." });
        return;
      }
      form.reset();
      setState({ status: "sent" });
    } catch {
      setState({ status: "error", message: "Network error. Please email us directly." });
    }
  }

  if (state.status === "sent") {
    return (
      <div className="rounded-2xl border p-8" style={{ borderColor: "var(--c-line)", background: "var(--c-surface)" }}>
        <p className="text-[18px] font-semibold tracking-[-0.02em]">Thanks — that&apos;s with us.</p>
        <p className="mt-2 text-[14px] leading-[1.65] text-[var(--c-muted)]">
          We read every enquiry ourselves and reply within one business day. If it&apos;s urgent, mail{" "}
          <a href={`mailto:${fallbackEmail}`} className="underline underline-offset-4" style={{ color: "var(--c-accent)" }}>
            {fallbackEmail}
          </a>{" "}
          directly.
        </p>
      </div>
    );
  }

  const hasQuote = Boolean(quote?.meetings || quote?.ltv);
  const money = (v?: string) => (v ? `${currency}${Number(v).toLocaleString("en-US")}` : "");

  const field =
    "w-full rounded-xl border bg-transparent px-3.5 py-3 text-[14.5px] outline-none transition-colors placeholder:text-[var(--c-muted)] focus:border-[var(--c-accent)]";

  return (
    <form onSubmit={onSubmit} className="space-y-3.5">
      {/* Honeypot. Real people never fill this; bots fill everything. */}
      <div className="absolute left-[-9999px]" aria-hidden>
        <label htmlFor="company_url">Leave this empty</label>
        <input id="company_url" name="company_url" tabIndex={-1} autoComplete="off" />
      </div>

      {/* Calculator answers, submitted as data rather than prose. */}
      {quote?.meetings && <input type="hidden" name="meetings" value={quote.meetings} />}
      {quote?.budget && <input type="hidden" name="budget" value={quote.budget} />}
      {quote?.ltv && <input type="hidden" name="ltv" value={quote.ltv} />}
      {quote?.close && <input type="hidden" name="close" value={quote.close} />}

      {hasQuote && (
        <div
          className="rounded-xl border px-4 py-3.5"
          style={{ borderColor: "var(--c-accent)", background: "var(--c-accent-wash)" }}
        >
          <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--c-muted)]">
            Coming through with your enquiry
          </p>
          <ul className="mt-2 grid gap-x-6 gap-y-1 text-[13px] sm:grid-cols-2">
            {quote?.meetings && (
              <li>
                Meetings wanted: <strong>{quote.meetings}</strong>
              </li>
            )}
            {quote?.budget && (
              <li>
                Monthly budget: <strong>{money(quote.budget)}</strong>
              </li>
            )}
            {quote?.ltv && (
              <li>
                A customer is worth: <strong>{money(quote.ltv)}</strong>
              </li>
            )}
            {quote?.close && (
              <li>
                Close rate: <strong>{quote.close}%</strong>
              </li>
            )}
          </ul>
        </div>
      )}

      <div className="grid gap-3.5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="mb-1.5 block text-[12.5px] font-medium">
            Name
          </label>
          <input id="name" name="name" required autoComplete="name" className={field} style={{ borderColor: "var(--c-line)" }} placeholder="Jane Okafor" />
        </div>
        <div>
          <label htmlFor="email" className="mb-1.5 block text-[12.5px] font-medium">
            Work email
          </label>
          <input id="email" name="email" type="email" required autoComplete="email" className={field} style={{ borderColor: "var(--c-line)" }} placeholder="jane@company.com" />
        </div>
      </div>

      <div className="grid gap-3.5 sm:grid-cols-2">
        <div>
          <label htmlFor="phone" className="mb-1.5 block text-[12.5px] font-medium">
            Phone
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            required
            autoComplete="tel"
            inputMode="tel"
            // Browsers compile `pattern` with the `v` flag, where ( ) - inside a
            // character class must be escaped or the whole pattern is discarded.
            pattern="[\d\s+\(\)\.\-]{7,25}"
            className={field}
            style={{ borderColor: "var(--c-line)" }}
            placeholder="+44 20 7946 0000"
          />
        </div>
        <div>
          <label htmlFor="website" className="mb-1.5 block text-[12.5px] font-medium">
            Website
          </label>
          <input id="website" name="website" required autoComplete="url" className={field} style={{ borderColor: "var(--c-line)" }} placeholder="acme.com" />
        </div>
      </div>

      <div>
        <label htmlFor="company" className="mb-1.5 block text-[12.5px] font-medium">
          Company <span className="font-normal text-[var(--c-muted)]">(optional)</span>
        </label>
        <input id="company" name="company" autoComplete="organization" className={field} style={{ borderColor: "var(--c-line)" }} placeholder="Acme Ltd" />
      </div>

      <div>
        <label htmlFor="message" className="mb-1.5 block text-[12.5px] font-medium">
          What do you sell, and who buys it?
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          className={`${field} resize-y`}
          style={{ borderColor: "var(--c-line)" }}
          placeholder="We sell warehouse software to mid-sized logistics firms in the UK and Germany. A customer is worth around $40k to us."
        />
      </div>

      {state.status === "error" && (
        <p className="text-[13px] text-red-500" role="alert">
          {state.message}
        </p>
      )}

      <button
        type="submit"
        disabled={state.status === "sending"}
        className="inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-[15px] font-medium transition-all duration-200 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
        style={{ background: "var(--c-accent)", color: "var(--c-accent-ink)" }}
      >
        {state.status === "sending" ? "Sending…" : "Send enquiry"}
      </button>

      <p className="text-[12px] leading-[1.55] text-[var(--c-muted)]">
        We use what you send here to reply to your enquiry and nothing else. No list, no sequence. See our{" "}
        <a href="/privacy" className="underline underline-offset-4">
          privacy policy
        </a>
        .
      </p>
    </form>
  );
}
