import type { Metadata } from "next";
import { headers } from "next/headers";
import { brandForHost } from "@/lib/brands";
import { ContactForm, type QuoteAnswers } from "@/components/contact-form";
import { Eyebrow } from "@/components/ui";

export async function generateMetadata(): Promise<Metadata> {
  const brand = brandForHost((await headers()).get("host"));
  return {
    title: "Contact",
    description: `Talk to ${brand.name} about outbound. Tell us what you sell and who buys it.`,
  };
}

/**
 * Answers carried over from the quote calculator.
 *
 * Only digits survive: these become hidden form fields and then numeric columns
 * in the CRM, so anything else is dropped rather than passed through.
 */
function quoteFrom(sp: Record<string, string | string[] | undefined>): QuoteAnswers | undefined {
  const clean = (k: string) => {
    const raw = Array.isArray(sp[k]) ? sp[k][0] : sp[k];
    if (!raw) return undefined;
    const digits = String(raw).replace(/[^\d]/g, "");
    return digits && Number(digits) > 0 ? digits : undefined;
  };
  const quote: QuoteAnswers = {
    meetings: clean("meetings"),
    budget: clean("budget"),
    ltv: clean("ltv"),
    close: clean("close"),
  };
  return quote.meetings || quote.ltv ? quote : undefined;
}

export default async function Contact({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const brand = brandForHost((await headers()).get("host"));
  const quote = quoteFrom(await searchParams);

  return (
    <section className="px-5 sm:px-8" style={{ background: "var(--c-bg)" }}>
      <div className="mx-auto grid w-full max-w-5xl gap-14 py-20 sm:py-28 lg:grid-cols-[0.85fr_1.15fr]">
        <div>
          <Eyebrow>Contact</Eyebrow>
          <h1 className="mt-5 text-[clamp(2rem,4.4vw,2.9rem)] font-semibold leading-[1.05] tracking-[-0.04em] balance">
            Tell us what you sell and{" "}
            <span className="display-em" style={{ color: "var(--c-accent)" }}>
              who buys it
            </span>
          </h1>
          <p className="mt-5 max-w-md text-[15px] leading-[1.7] pretty text-[var(--c-muted)]">
            We will tell you honestly whether outbound is the right channel for it. If it is not, we will say so — a
            campaign into the wrong market wastes your money and our reputation.
          </p>

          <dl className="mt-10 space-y-5 border-t pt-8 text-[14px]" style={{ borderColor: "var(--c-line)" }}>
            <div>
              <dt className="text-[12px] font-medium uppercase tracking-[0.14em] text-[var(--c-muted)]">Email</dt>
              <dd className="mt-1.5">
                <a href={`mailto:${brand.contact.email}`} className="underline underline-offset-4" style={{ color: "var(--c-accent)" }}>
                  {brand.contact.email}
                </a>
              </dd>
            </div>
            {brand.contact.phone && (
              <div>
                <dt className="text-[12px] font-medium uppercase tracking-[0.14em] text-[var(--c-muted)]">Phone</dt>
                <dd className="mt-1.5">{brand.contact.phone}</dd>
              </div>
            )}
            <div>
              <dt className="text-[12px] font-medium uppercase tracking-[0.14em] text-[var(--c-muted)]">Response time</dt>
              <dd className="mt-1.5 text-[var(--c-muted)]">One business day, from a person.</dd>
            </div>
          </dl>
        </div>

        <div className="rounded-2xl border p-6 sm:p-8" style={{ borderColor: "var(--c-line)", background: "var(--c-surface)" }}>
          <ContactForm
            brandDomain={brand.domain}
            brandName={brand.name}
            fallbackEmail={brand.contact.email}
            currency={brand.currency ?? "$"}
            quote={quote}
          />
        </div>
      </div>
    </section>
  );
}
