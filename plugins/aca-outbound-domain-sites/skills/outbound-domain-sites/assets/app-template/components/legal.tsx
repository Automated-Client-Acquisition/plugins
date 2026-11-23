import type { Brand } from "@/lib/types";
import { Eyebrow } from "./ui";

/**
 * Baseline legal pages, filled from the brand config.
 *
 * These are a starting point, not legal advice. Have them reviewed before the
 * domains go live — in particular the controller identity, the retention
 * periods, and the governing-law clause, which depend on the operating entity.
 */

export function LegalPage({
  brand,
  title,
  updated,
  children,
}: {
  brand: Brand;
  title: string;
  updated: string;
  children: React.ReactNode;
}) {
  return (
    <section className="px-5 sm:px-8" style={{ background: "var(--c-bg)" }}>
      <div className="mx-auto w-full max-w-3xl py-20 sm:py-24">
        <Eyebrow>Legal</Eyebrow>
        <h1 className="mt-5 text-[clamp(1.9rem,4vw,2.6rem)] font-semibold leading-[1.08] tracking-[-0.035em]">{title}</h1>
        <p className="mt-3 text-[13px] text-[var(--c-muted)]">
          Last updated {updated} · {brand.name}
          {brand.legalEntity ? `, a trading name of ${brand.legalEntity}` : ""}
        </p>
        <div className="legal mt-12 space-y-8 text-[14.5px] leading-[1.75] text-[var(--c-muted)]">{children}</div>
      </div>
    </section>
  );
}

export function H2({ children }: { children: React.ReactNode }) {
  return <h2 className="text-[17px] font-semibold tracking-[-0.02em] text-[var(--c-ink)]">{children}</h2>;
}

export function PrivacyBody({ brand }: { brand: Brand }) {
  const controller = brand.legalEntity ? `${brand.name}, a trading name of ${brand.legalEntity}` : brand.name;
  return (
    <>
      <section className="space-y-3">
        <H2>Who we are</H2>
        <p>
          {controller} (&ldquo;we&rdquo;) operates {brand.domain} and is the data controller for personal data processed
          through this website and through our outbound campaigns. You can reach us at{" "}
          <a href={`mailto:${brand.contact.email}`} className="underline underline-offset-4">
            {brand.contact.email}
          </a>
          .
        </p>
      </section>

      <section className="space-y-3">
        <H2>Data we collect from this website</H2>
        <p>
          If you submit the contact form we collect the name, email address, company, website and message you provide.
          We use that information solely to respond to your enquiry and, if we go on to work together, to administer that
          relationship. We do not add website enquiries to a marketing sequence.
        </p>
      </section>

      <section className="space-y-3">
        <H2>Data we process in our outbound work</H2>
        <p>
          As part of our service we process business contact details — name, job title, employer, business email address
          and public professional profile — belonging to people at companies our clients sell to. This data is obtained
          from public sources and from third-party business data providers. We do not make outbound telephone calls, and
          we do not collect telephone numbers for that purpose.
        </p>
        <p>
          Where we rely on legitimate interests (Article 6(1)(f) UK GDPR / EU GDPR) to send business-to-business
          communications, we have assessed that interest against the rights of the individuals concerned. Every message
          we send identifies the sender, states why the recipient was contacted, and offers a working opt-out. Where the
          applicable law requires consent instead, we obtain it.
        </p>
      </section>

      <section className="space-y-3">
        <H2>Your rights</H2>
        <p>
          You may ask us to confirm what personal data we hold about you, correct it, delete it, restrict how we use it,
          or object to our use of it. You may also ask for a copy in a portable format. Email{" "}
          <a href={`mailto:${brand.contact.email}`} className="underline underline-offset-4">
            {brand.contact.email}
          </a>{" "}
          and we will respond within one month.
        </p>
        <p>
          To stop hearing from us entirely, reply to any message with &ldquo;unsubscribe&rdquo; or email the address
          above. We honour opt-outs across every active campaign, not just the one you replied to, and we retain the
          minimum record needed to make sure we do not contact you again.
        </p>
        <p>
          If you are unhappy with how we have handled your data you may complain to your national data protection
          authority.
        </p>
      </section>

      <section className="space-y-3">
        <H2>Retention</H2>
        <p>
          Enquiry data is kept for as long as needed to respond and for a reasonable period afterwards for our own
          records. Prospect data is deleted or suppressed when it is no longer accurate, when the individual objects, or
          when the client engagement it was collected for ends.
        </p>
      </section>

      <section className="space-y-3">
        <H2>Processors and transfers</H2>
        <p>
          We use third-party providers for hosting, email delivery, data enrichment and customer relationship management.
          Each is bound by a data processing agreement. Where data is transferred outside the UK or EEA we rely on
          adequacy decisions or standard contractual clauses.
        </p>
      </section>

      <section className="space-y-3">
        <H2>Cookies</H2>
        <p>
          This site does not set advertising or cross-site tracking cookies. Any analytics we run is limited to aggregate
          page metrics and does not build a profile of you across other websites.
        </p>
      </section>
    </>
  );
}

export function TermsBody({ brand }: { brand: Brand }) {
  const entity = brand.legalEntity ? `${brand.name}, a trading name of ${brand.legalEntity}` : brand.name;
  return (
    <>
      <section className="space-y-3">
        <H2>These terms</H2>
        <p>
          These terms govern your use of {brand.domain}. By using the site you accept them. Services we provide under a
          separate engagement are governed by that engagement&apos;s contract, which takes precedence over anything on
          this page.
        </p>
      </section>

      <section className="space-y-3">
        <H2>What this website is</H2>
        <p>
          This site describes services offered by {entity}. Nothing on it is an offer capable of acceptance, a guarantee
          of results, or advice you should act on without talking to us first. Figures shown are measured across our own
          sending infrastructure and describe past performance; they are not a forecast of what your campaign will do.
        </p>
      </section>

      <section className="space-y-3">
        <H2>Acceptable use</H2>
        <p>
          Do not use this site to break the law, to attempt unauthorised access, to scrape it at a volume that degrades
          it for others, or to submit content you have no right to send. We may withdraw access without notice.
        </p>
      </section>

      <section className="space-y-3">
        <H2>Intellectual property</H2>
        <p>
          The content, design and code of this site belong to us or our licensors. You may read and share it; you may not
          republish it as your own.
        </p>
      </section>

      <section className="space-y-3">
        <H2>Liability</H2>
        <p>
          The site is provided as-is. To the extent permitted by law we exclude liability for loss arising from your use
          of it. Nothing here limits liability for death or personal injury caused by negligence, or for fraud.
        </p>
      </section>

      <section className="space-y-3">
        <H2>Contact</H2>
        <p>
          Questions about these terms go to{" "}
          <a href={`mailto:${brand.contact.email}`} className="underline underline-offset-4">
            {brand.contact.email}
          </a>
          .
        </p>
      </section>
    </>
  );
}
