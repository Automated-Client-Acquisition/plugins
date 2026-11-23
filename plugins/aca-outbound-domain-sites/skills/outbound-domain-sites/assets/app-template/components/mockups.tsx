/**
 * CSS-drawn product mockups.
 *
 * The visual backbone of every template: no photography, fully re-skinnable from
 * the brand palette, crisp at any density.
 *
 * Labels here follow the same no-jargon rule as lib/copy.ts. Nothing says
 * "domain", "deliverability" or "sequence" — the reader is a founder, not an
 * email engineer.
 *
 * Anything resembling a metric is illustrative and labelled as such. Real,
 * measured numbers live in lib/proof.ts and render with their source attached.
 */

import { EmailMark, LinkedInMark, ReplyMark } from "./logos";

type Tone = { onDark?: boolean };

function surface(onDark?: boolean) {
  return onDark
    ? { background: "var(--c-band-surface)", borderColor: "var(--c-band-line)" }
    : { background: "var(--c-surface)", borderColor: "var(--c-line)" };
}
function ink(onDark?: boolean) {
  return onDark ? "text-[var(--c-band-ink)]" : "text-[var(--c-ink)]";
}
function muted(onDark?: boolean) {
  return onDark ? "text-[var(--c-band-muted)]" : "text-[var(--c-muted)]";
}
function lineColor(onDark?: boolean) {
  return onDark ? "var(--c-band-line)" : "var(--c-line)";
}

function Frame({
  children,
  label,
  bad,
  onDark,
  note,
}: Tone & { children: React.ReactNode; label: string; bad?: boolean; note?: string }) {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border" style={surface(onDark)}>
      <div className="flex items-center gap-2 border-b px-4 py-2.5" style={{ borderColor: lineColor(onDark) }}>
        <span className="flex gap-1.5" aria-hidden>
          {["#F87171", "#FBBF24", "#34D399"].map((c) => (
            <span key={c} className="h-2 w-2 rounded-full" style={{ background: c, opacity: bad ? 0.35 : 0.7 }} />
          ))}
        </span>
        <span className={`ml-1 text-[11px] font-medium tracking-[-0.01em] ${muted(onDark)}`}>{label}</span>
        {note && (
          <span
            className="ml-auto rounded-full px-2 py-0.5 text-[10px] font-medium"
            style={{
              background: bad ? "rgba(248,113,113,.14)" : "var(--c-accent-wash)",
              color: bad ? "#EF4444" : "var(--c-accent)",
            }}
          >
            {note}
          </span>
        )}
      </div>
      <div className="flex-1 p-4">{children}</div>
    </div>
  );
}

/* ── Ways in: one channel vs three ───────────────────────────────────────── */

function ChannelRow({
  icon,
  name,
  state,
  detail,
  live,
  onDark,
}: Tone & { icon: React.ReactNode; name: string; state: string; detail?: string; live?: boolean }) {
  return (
    <div
      className="flex items-center gap-3 rounded-xl border px-3 py-2.5"
      style={{ borderColor: lineColor(onDark), background: live ? "var(--c-accent-wash)" : "transparent" }}
    >
      <span className={`flex h-[18px] w-[18px] shrink-0 items-center justify-center ${muted(onDark)}`}>{icon}</span>
      <div className="min-w-0 flex-1">
        <p className={`text-[13px] font-medium ${ink(onDark)}`}>{name}</p>
        {detail && <p className={`truncate text-[11px] ${muted(onDark)}`}>{detail}</p>}
      </div>
      <span
        className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium"
        style={
          live
            ? { background: "var(--c-accent)", color: "var(--c-accent-ink)" }
            : { background: "rgba(148,163,184,.16)", color: onDark ? "var(--c-band-muted)" : "var(--c-muted)" }
        }
      >
        {state}
      </span>
    </div>
  );
}

export function ChannelStackBad({ onDark }: Tone) {
  return (
    <Frame label="How they get approached" bad note="One chance" onDark={onDark}>
      <div className="space-y-2">
        <ChannelRow onDark={onDark} icon={<EmailMark />} name="Email" state="Sent once" detail="The only thing running" />
        {/* Greyscale here: the channel is dormant in this column, and a full-colour
            brand mark would read as active. LinkedIn's guidelines allow a
            single-colour treatment. */}
        <ChannelRow
          onDark={onDark}
          icon={<span style={{ filter: "grayscale(1)", opacity: 0.55, display: "flex" }}><LinkedInMark onDark={onDark} /></span>}
          name="LinkedIn"
          state="Not being used"
        />
        <ChannelRow onDark={onDark} icon={<ReplyMark />} name="Replies" state="Nobody answers" detail="Sitting in an inbox" />
      </div>
      <p className={`mt-3 text-[11px] ${muted(onDark)}`}>If they miss the email, that is the end of it.</p>
    </Frame>
  );
}

export function ChannelStackGood({ onDark }: Tone) {
  return (
    <Frame label="How they get approached" note="Twice, properly" onDark={onDark}>
      <div className="space-y-2">
        <ChannelRow onDark={onDark} live icon={<EmailMark />} name="Email" state="Running" detail="Sent in your name, then followed up" />
        <ChannelRow onDark={onDark} live icon={<LinkedInMark onDark={onDark} />} name="LinkedIn" state="Running" detail="So your name is already familiar" />
        <ChannelRow onDark={onDark} live icon={<ReplyMark />} name="Replies" state="Handled" detail="Every one, answered by us" />
      </div>
      <p className={`mt-3 text-[11px] ${muted(onDark)}`}>Same companies, both ways, in a planned order.</p>
    </Frame>
  );
}

/* ── The message: mass mail vs written for them ──────────────────────────── */

function ComposeField({ k, v, onDark }: Tone & { k: string; v: string }) {
  return (
    <div className="flex gap-2 border-b py-1.5 text-[12px]" style={{ borderColor: lineColor(onDark) }}>
      <span className={`w-12 shrink-0 ${muted(onDark)}`}>{k}</span>
      <span className={`truncate ${ink(onDark)}`}>{v}</span>
    </div>
  );
}

export function ComposeBad({ onDark }: Tone) {
  return (
    <Frame label="New message" bad note="Deleted in 2 seconds" onDark={onDark}>
      <ComposeField onDark={onDark} k="To" v="[First name]" />
      <ComposeField onDark={onDark} k="Subject" v="Quick question about [Company]" />
      <div className={`mt-3 space-y-2 text-[12.5px] leading-[1.6] ${muted(onDark)}`}>
        <p>Hi [First name],</p>
        <p>
          I noticed [Company] is growing fast. We help companies like yours and I&apos;d love to jump on a quick call.
        </p>
        <p>Are you the right person for this?</p>
      </div>
    </Frame>
  );
}

export function ComposeGood({ onDark }: Tone) {
  return (
    <Frame label="New message" note="Got a reply" onDark={onDark}>
      <ComposeField onDark={onDark} k="To" v="Sarah Jennings" />
      <ComposeField onDark={onDark} k="Subject" v="the Berlin warehouse" />
      <div className={`mt-3 space-y-2 text-[12.5px] leading-[1.6] ${ink(onDark)}`}>
        <p>Hi Sarah,</p>
        <p>
          Saw the Berlin site opened last month. A second warehouse is usually the point where your team stops being able
          to answer &ldquo;where is my order&rdquo; by hand.
        </p>
        <p className={muted(onDark)}>Worth fifteen minutes?</p>
      </div>
      <p className={`mt-3 text-[10.5px] italic ${muted(onDark)}`}>An example, not a real client&apos;s email.</p>
    </Frame>
  );
}

/* ── Support: queue vs direct line ───────────────────────────────────────── */

function Msg({
  who,
  initial,
  when,
  text,
  accent,
  onDark,
}: Tone & { who: string; initial: string; when: string; text: string; accent?: boolean }) {
  return (
    <div className="flex gap-2.5 py-2">
      <span
        className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-[10px] font-semibold"
        style={
          accent
            ? { background: "var(--c-accent)", color: "var(--c-accent-ink)" }
            : { background: lineColor(onDark), color: onDark ? "var(--c-band-muted)" : "var(--c-muted)" }
        }
      >
        {initial}
      </span>
      <div className="min-w-0">
        <p className={`text-[11.5px] font-medium ${ink(onDark)}`}>
          {who} <span className={`font-normal ${muted(onDark)}`}>{when}</span>
        </p>
        <p className={`mt-0.5 text-[12.5px] leading-[1.55] ${muted(onDark)}`}>{text}</p>
      </div>
    </div>
  );
}

export function ThreadBad({ onDark }: Tone) {
  return (
    <Frame label="Agency support" bad note="Two days" onDark={onDark}>
      <Msg onDark={onDark} who="You" initial="Y" when="Mon 09:14" text="Can we stop pitching the cheaper package? It's attracting the wrong people." />
      <Msg onDark={onDark} who="You" initial="Y" when="Tue 10:30" text="Following up on this — any update?" />
      <Msg onDark={onDark} who="Support" initial="S" when="Wed 16:47" text="Hi! I'll check with the team and come back to you." />
      <p className="mt-2 text-[11px] text-red-400">Still going out unchanged.</p>
    </Frame>
  );
}

export function ThreadGood({ onDark }: Tone) {
  return (
    <Frame label="Your operator" note="Same day" onDark={onDark}>
      <Msg onDark={onDark} who="You" initial="Y" when="Mon 09:14" text="Can we stop pitching the cheaper package? It's attracting the wrong people." />
      <Msg
        onDark={onDark}
        accent
        who="Your operator"
        initial="O"
        when="Mon 11:22"
        text="Done — pulled it this morning and rewrote the opener around the enterprise plan. I'll send you what replied by Friday."
      />
      <p className="mt-2 text-[11px]" style={{ color: "var(--c-accent)" }}>
        Changed before the next batch went out.
      </p>
    </Frame>
  );
}

/* ── The handoff: a list to work through vs meetings in the diary ────────── */

export function ExportBad({ onDark }: Tone) {
  const rows = [
    ["j.smith@co.io", "Replied?", "—"],
    ["m.chen@startup.co", "Maybe", "check"],
    ["a.davis@corp.com", "?", "away?"],
    ["r.patel@tech.io", "No reply", "—"],
    ["s.kim@saas.co", "?", "no idea"],
  ];
  return (
    <Frame label="leads.csv" bad note="Two weeks old" onDark={onDark}>
      <table className="w-full text-left text-[11.5px]">
        <thead>
          <tr className={muted(onDark)}>
            <th className="pb-1.5 font-medium">Contact</th>
            <th className="pb-1.5 font-medium">Status</th>
            <th className="pb-1.5 font-medium">Notes</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(([e, s, n]) => (
            <tr key={e} className="border-t" style={{ borderColor: lineColor(onDark) }}>
              <td className={`truncate py-1.5 pr-2 ${muted(onDark)}`}>{e}</td>
              <td className={`py-1.5 pr-2 ${muted(onDark)}`}>{s}</td>
              <td className={`py-1.5 ${muted(onDark)}`}>{n}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className={`mt-2.5 text-[11px] ${muted(onDark)}`}>Someone on your team now has to work through this.</p>
    </Frame>
  );
}

/** Booked meetings, the thing the client actually buys. */
export function MeetingsCalendar({ onDark }: Tone) {
  const rows = [
    { i: "JS", n: "James Smith", c: "Techcorp", when: "Tue 10:00", tag: "Confirmed" },
    { i: "MC", n: "Maria Chen", c: "StartupHQ", when: "Tue 15:30", tag: "Confirmed" },
    { i: "AD", n: "Alex Davis", c: "CorpInc", when: "Wed 09:00", tag: "Confirmed" },
    { i: "SK", n: "Sarah Kim", c: "Northwind", when: "Thu 11:00", tag: "Confirmed" },
  ];
  return (
    <Frame label="Your calendar, this week" note="4 booked" onDark={onDark}>
      <div className="space-y-1.5">
        {rows.map((r) => (
          <div
            key={r.i}
            className="flex items-center gap-2.5 rounded-lg border px-2.5 py-2"
            style={{ borderColor: lineColor(onDark) }}
          >
            <span
              className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-[9.5px] font-semibold"
              style={{ background: "var(--c-accent-wash)", color: "var(--c-accent)" }}
            >
              {r.i}
            </span>
            <div className="min-w-0 flex-1">
              <p className={`truncate text-[12px] font-medium ${ink(onDark)}`}>
                {r.n} <span className={`font-normal ${muted(onDark)}`}>· {r.c}</span>
              </p>
              <p className={`truncate text-[10.5px] ${muted(onDark)}`}>{r.when}</p>
            </div>
            <span
              className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium"
              style={{ background: "var(--c-accent-wash)", color: "var(--c-accent)" }}
            >
              {r.tag}
            </span>
          </div>
        ))}
      </div>
      <p className={`mt-2.5 text-[11px] ${muted(onDark)}`}>
        Everything else — the maybes, the away messages, the no thanks — we dealt with.
      </p>
    </Frame>
  );
}

/* ── What you pay for ────────────────────────────────────────────────────── */

export function BillingMockup({ onDark }: Tone) {
  const rows = [
    { label: "Meetings booked", value: "18", muted: true },
    { label: "Turned up", value: "16" },
    { label: "No-shows", value: "2", free: true },
    { label: "Monthly retainer", value: "None", free: true },
    { label: "Running costs", value: "At cost" },
  ];
  return (
    <Frame label="This month's invoice" note="Meetings held only" onDark={onDark}>
      <div className="space-y-2">
        {rows.map((r) => (
          <div
            key={r.label}
            className="flex items-baseline justify-between gap-3 border-b pb-2 last:border-0"
            style={{ borderColor: lineColor(onDark) }}
          >
            <span className={`text-[12.5px] ${muted(onDark)}`}>{r.label}</span>
            <span
              className={`text-[13px] font-semibold ${r.free ? "" : ink(onDark)}`}
              style={r.free ? { color: "var(--c-accent)" } : undefined}
            >
              {r.value}
              {r.free && r.label === "No-shows" ? " · not billed" : ""}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-baseline justify-between gap-3">
        <span className={`text-[12.5px] font-medium ${ink(onDark)}`}>You are billed for</span>
        <span className="text-[15px] font-semibold" style={{ color: "var(--c-accent)" }}>
          16 meetings + running costs
        </span>
      </div>
      <p className={`mt-2 text-[10.5px] italic ${muted(onDark)}`}>
        Illustrative. The pilot is free, and your price per meeting is agreed in writing first.
      </p>
    </Frame>
  );
}

/* ── Handover at month six ───────────────────────────────────────────────── */

export function HandoverMockup({ onDark }: Tone) {
  const items = [
    "The list of companies and contacts",
    "The messages that actually got replies",
    "The email accounts, in your name",
    "The process written down",
    "Your team trained to run it",
  ];
  return (
    <Frame label="Month six: handover" note="Yours to keep" onDark={onDark}>
      <div className="space-y-2">
        {items.map((t) => (
          <div key={t} className="flex items-center gap-2.5">
            <span
              className="flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full"
              style={{ background: "var(--c-accent)", color: "var(--c-accent-ink)", height: 18, width: 18 }}
            >
              <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden>
                <path d="M2.5 6.2 4.8 8.5 9.5 3.8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <span className={`text-[12.5px] ${ink(onDark)}`}>{t}</span>
          </div>
        ))}
      </div>
      <p className={`mt-3 text-[11px] ${muted(onDark)}`}>If you stop working with us, none of this stops working.</p>
    </Frame>
  );
}

/* ── Live view ───────────────────────────────────────────────────────────── */

export function LiveDashboard({ onDark }: Tone) {
  const tiles = [
    { k: "Companies contacted", v: "1,240" },
    { k: "Replies", v: "96" },
    { k: "Meetings booked", v: "18" },
    { k: "Meetings held", v: "16" },
  ];
  const bars = [34, 52, 41, 68, 59, 77, 71, 86, 74, 92, 88, 97];
  return (
    <Frame label="What you can see, any time" note="Example view" onDark={onDark}>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {tiles.map((t) => (
          <div key={t.k} className="rounded-lg border px-3 py-2.5" style={{ borderColor: lineColor(onDark) }}>
            <p className={`text-[10.5px] ${muted(onDark)}`}>{t.k}</p>
            <p className={`mt-0.5 text-[17px] font-semibold tracking-[-0.02em] ${ink(onDark)}`}>{t.v}</p>
          </div>
        ))}
      </div>
      <div className="mt-3 flex h-20 items-end gap-1.5">
        {bars.map((h, i) => (
          <span
            key={i}
            className="flex-1 rounded-t-sm"
            style={{ height: `${h}%`, background: i === bars.length - 1 ? "var(--c-accent)" : "var(--c-accent-wash)" }}
          />
        ))}
      </div>
      <p className={`mt-2 text-[10.5px] italic ${muted(onDark)}`}>Illustrative. Your numbers replace these on day one.</p>
    </Frame>
  );
}
