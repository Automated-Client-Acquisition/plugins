import type { Metadata } from "next";
import { headers } from "next/headers";
import { brandForHost } from "@/lib/brands";
import { PROOF_AS_OF } from "@/lib/proof";
import { TIMELINE } from "@/lib/copy";
import { Button, Eyebrow, Section } from "@/components/ui";

export async function generateMetadata(): Promise<Metadata> {
  const brand = brandForHost((await headers()).get("host"));
  return { title: "About", description: `How ${brand.name} works, and who it is for.` };
}

export default async function About() {
  const brand = brandForHost((await headers()).get("host"));

  return (
    <>
      <section className="px-5 sm:px-8" style={{ background: "var(--c-bg)" }}>
        <div className="mx-auto w-full max-w-3xl py-20 sm:py-28">
          <Eyebrow>About</Eyebrow>
          <h1 className="mt-5 text-[clamp(2rem,4.6vw,3rem)] font-semibold leading-[1.05] tracking-[-0.04em] balance">
            {brand.angle}
          </h1>

          <div className="mt-10 space-y-6 text-[15.5px] leading-[1.75] pretty text-[var(--c-muted)]">
            <p>
              {brand.name} books sales meetings for B2B companies. You tell us who is worth talking to, we go and get
              their attention, and you pay for the meetings that actually take place.
            </p>
            <p>
              We priced it this way on purpose. Almost everyone else charges a monthly fee and then reports on how busy
              they have been. That puts all the risk on you and none on them, and it means an agency can do badly for
              months without it costing them anything. If we do not book meetings, we do not get paid.
            </p>
            <p>
              We are not a list you can buy and we are not software you have to run. There is nothing for you to set up
              or learn. The messages go out in your name, we answer every reply ourselves — including the awkward ones —
              and the only thing that reaches your sales team is a confirmed meeting with someone who wants to have it.
            </p>
            <p>
              We are deliberately small. The person on your first call is the person running your campaign in month six.
              No account managers, no support queue, and nobody handing you to a junior once the contract is signed.
            </p>
            <p>
              And we are not trying to be your supplier forever. After six months we set the whole thing up inside your
              business and train your team to run it. You keep the lists, the messages that worked and the accounts we
              send from. If you stop working with us, none of it stops working.
            </p>
          </div>

          <div className="mt-12 grid gap-6 border-t pt-10 sm:grid-cols-2" style={{ borderColor: "var(--c-line)" }}>
            {brand.stats.slice(0, 4).map((s) => (
              <div key={s.label}>
                <p className="text-[24px] font-semibold tracking-[-0.03em]" style={{ color: "var(--c-accent)" }}>
                  {s.value}
                </p>
                <p className="mt-1 text-[13.5px] font-medium">{s.label}</p>
                {s.source && <p className="mt-1 text-[12px] text-[var(--c-muted)]">{s.source}</p>}
              </div>
            ))}
          </div>
          <p className="mt-6 text-[12px] text-[var(--c-muted)]">
            Figures measured across our own campaigns, {PROOF_AS_OF}.
          </p>
        </div>
      </section>

      <Section dark>
        <Eyebrow onDark>Start to finish</Eyebrow>
        <h2 className="mt-4 max-w-2xl text-[clamp(1.6rem,3.2vw,2.3rem)] font-semibold leading-[1.12] tracking-[-0.03em] balance">
          What happens between the first call and a meeting in your calendar
        </h2>
        <ol className="mt-10 space-y-6">
          {TIMELINE.map((t, i) => (
            <li key={t.day} className="grid gap-4 border-t pt-6 sm:grid-cols-[auto_9rem_1fr]" style={{ borderColor: "var(--c-band-line)" }}>
              <span className="text-[12px] font-semibold tabular-nums" style={{ color: "var(--c-accent)" }}>
                0{i + 1}
              </span>
              <span className="text-[13px] font-medium text-[var(--c-band-muted)]">{t.day}</span>
              <span>
                <span className="block text-[16px] font-semibold tracking-[-0.02em]">{t.title}</span>
                <span className="mt-2 block max-w-xl text-[14px] leading-[1.65] text-[var(--c-band-muted)]">{t.body}</span>
              </span>
            </li>
          ))}
        </ol>
        <div className="mt-12">
          <Button href="/#quote" size="lg">
            Get a free quote
          </Button>
        </div>
      </Section>
    </>
  );
}
