/**
 * Section copy, drawn from pools and selected by each brand's `copySeed`.
 *
 * Two rules govern everything in this file:
 *
 * 1. NO JARGON. The reader is a founder or a sales leader, not a deliverability
 *    engineer. Never write: domain, mailbox, deliverability, bounce rate, ICP,
 *    sequence, enrichment, waterfall, catch-all, SPF/DKIM, cadence, sequencer.
 *    Say what it means for them instead.
 *
 * 2. Outcome first. Every section answers "what do I get" before "how does it
 *    work". The offer is live meetings you only pay for when they happen.
 *
 * The pools exist because fifteen domains serving byte-identical body text from
 * one edge is a stronger clustering signal than fifteen blank domains.
 */

function pick<T>(pool: T[], seed: number, offset: number): T {
  // Mixed rather than linear: a linear index modulo a fixed pool length makes
  // every Nth brand share the same paragraph. /api/brands asserts that no two
  // brands end up with an identical full copy combination.
  const h = Math.imul(seed + 1, 2654435761) ^ Math.imul(offset + 1, 40503);
  return pool[Math.abs(h) % pool.length];
}

/* ── You only pay for meetings that happen ────────────────────────────────── */

const PRICING_TITLE = [
  "Start with a free pilot. Then pay for meetings that happen",
  "No retainer. A free pilot, then you pay per meeting held",
  "Prove it first. Pay for it second",
  "Pay for live meetings, not for effort",
  "A free pilot, then live meetings and the running costs. Nothing else",
];

const PRICING_BODY = [
  "We run the first campaign as a free pilot, at our cost, so you can read the replies before you commit to anything. After that there is no retainer — you pay an agreed price for each meeting a real buyer attends, plus the small running cost of the accounts and data the campaign needs. No-shows are not billed.",
  "Most agencies bill you whether or not anything happens. We run a pilot for free, and once you are happy you pay per meeting held plus the running costs of the setup itself. If nobody turns up to a meeting, it does not go on the invoice.",
  "You are not buying our time or our activity. You are buying meetings with people who can sign. The pilot costs you nothing, and after it you pay per meeting held plus the modest cost of keeping the sending accounts and data running.",
  "Free pilot first, so the risk of it not working is ours. Then an agreed price per live meeting, plus the running costs of the infrastructure it sits on. No retainer, and no charge for a no-show.",
  "We carry the risk of proving it works. You carry the running costs and the price of meetings that actually happened — nothing else, and nothing monthly for our time.",
];

/* ── Where we reach them ──────────────────────────────────────────────────── */

const CHANNELS_TITLE = [
  "We reach your buyers where they answer",
  "Email and LinkedIn, working together",
  "Two ways in, so one ignored message does not end it",
  "We do not send one email and hope",
  "The same person, approached twice, properly",
];

const CHANNELS_BODY = [
  "Some people read email. Some never open it but check LinkedIn every day. We work both against the same list of companies, so a buyer who missed the email still sees your name — and we follow up rather than sending once and moving on.",
  "Most agencies fire off one email and call it outreach. We approach the same person by email and on LinkedIn, in a planned order, and we keep going politely until we get a yes or a no.",
  "One message means one chance. We use LinkedIn to make your name familiar and email to make the ask, so the message arrives from someone the buyer half recognises.",
  "You do not have to choose between email and LinkedIn. We run both against the same target list, and every reply comes back to one place where we answer it.",
  "Buyers answer in different places. Rather than guess which one yours prefers, we cover both and let them pick.",
];

/* ── How it works ─────────────────────────────────────────────────────────── */

const PROCESS_TITLE = [
  "What actually happens after you say yes",
  "From first call to first meeting",
  "Four steps, and only one of them is yours",
  "How a meeting ends up in your calendar",
  "The whole thing, start to finish",
];

const PROCESS_BODY = [
  "You tell us who you want to talk to. We build the list, write the messages, run the outreach and handle every reply. The first thing you do after the kick-off call is turn up to a meeting.",
  "We take the whole job: finding the right companies, working out who to speak to, writing to them properly, chasing the replies and putting the meeting in your calendar.",
  "Your involvement is one kick-off call and then approving the message. Everything after that is ours until a meeting appears in your diary.",
  "There is nothing for you to set up, install or learn. We run it end to end and you show up to the conversations.",
  "You approve who we target and what we say. We do the rest, and you hear from us when there is a meeting booked.",
];

/* ── The writing ──────────────────────────────────────────────────────────── */

const WRITING_TITLE = [
  "Messages that read like you wrote them",
  "Nothing we send looks like a mass email",
  "If it reads like marketing, it gets deleted",
  "Written one company at a time",
  "The message is the whole job, so we write it properly",
];

const WRITING_BODY = [
  "Everyone can spot a mail merge within half a line. We read what the company has actually done — an opening, a hire, an announcement — and open on that. It takes longer and it is the reason people reply.",
  "We do not use templates with your prospect's name dropped into a gap. Each message refers to something real about that specific business, in your voice, and it is short enough that a busy person finishes it.",
  "The messages sound like a person who did their homework, because that is what they are. No hype, no fake compliments, no paragraph about how much we admire their journey.",
  "Short, specific, and about them rather than about us. If a message could have been sent unchanged to a thousand other companies, we rewrite it.",
  "We test what we send and drop whatever stops working. You see and approve the messages before anything goes out under your name.",
];

/* ── One person on your account ───────────────────────────────────────────── */

const OPS_TITLE = [
  "One person on your account, and they stay",
  "You get an operator, not a support queue",
  "Nobody hands you to a junior after the first month",
  "The person who builds it is the person you talk to",
  "Ask for a change, get it the same day",
];

const OPS_BODY = [
  "You message the person actually running your campaign. Want to change the pitch, pause something or go after a different type of company? It is done that day, and you hear why.",
  "There is no ticket system and no account manager passing your request along. One experienced person runs your campaign and answers you directly.",
  "Most agencies put their best people on the sales call and their newest on your account afterwards. We do not. The person on your kick-off call is the person running it in month six.",
  "Weekly calls, a direct line, and a person who knows your business rather than a rota of whoever is free.",
  "You will never be told your change has been passed to the team. It gets made, and you are told what changed and why.",
];

/* ── What your team receives ──────────────────────────────────────────────── */

const HANDOFF_TITLE = [
  "Your team gets meetings, not a spreadsheet",
  "Everything lands in your calendar and your pipeline",
  "Nobody on your side sorts through replies",
  "We handle every reply, including the awkward ones",
  "The only thing that reaches your reps is a real conversation",
];

const HANDOFF_BODY = [
  "We read and answer every reply. Interested people get booked in. People who say not now get a note to try again later. Everything else is dealt with quietly, and your team only ever sees a booked meeting.",
  "Out of office, wrong person, not right now, no thanks — we handle all of it. What reaches your sales team is a confirmed meeting with someone who wants to have it.",
  "Replies do not arrive as a list for someone to work through. They arrive as meetings in the diary, with the full back-and-forth attached so your rep knows the story before they join.",
  "Your reps open a conversation already in progress rather than a name and an email address. No chasing, no sorting, no CSV files.",
  "Anyone who asks not to be contacted again is removed everywhere, immediately. That is our job to get right, not yours.",
];

/* ── Ownership / handover ─────────────────────────────────────────────────── */

const OWNERSHIP_TITLE = [
  "Do not rent your revenue. Build a sales engine you own",
  "After 180 days, we hand you the keys",
  "We are not trying to be your supplier forever",
  "At day 180 it becomes your team's job, not ours",
  "You should not still need us in year two",
];

const OWNERSHIP_BODY = [
  "Most agencies keep the accounts, the lists and the playbook, so the day you stop paying, everything stops. We set it up in your name from the start, and after 180 days we install it in-house and train your team to run it themselves.",
  "The lists, the messages that worked, the accounts we send from and the process behind them are all yours. After 180 days we hand the whole thing over and teach your people how to operate it. If you walk away, it keeps running without us.",
  "The goal is a working sales engine inside your business, not a permanent invoice. We prove it works first, then at day 180 we install it in-house and train the team who will run it.",
  "You are buying a capability, not a subscription. Everything we build sits under your name, and after 180 days your team is trained to run it without us.",
  "We would rather hand over something that works than hold it hostage. 180 days of us proving it, then it is yours to run.",
];

export const COPY = {
  pricing: (s: number) => ({ title: pick(PRICING_TITLE, s, 1), body: pick(PRICING_BODY, s, 2) }),
  channels: (s: number) => ({ title: pick(CHANNELS_TITLE, s, 3), body: pick(CHANNELS_BODY, s, 4) }),
  process: (s: number) => ({ title: pick(PROCESS_TITLE, s, 5), body: pick(PROCESS_BODY, s, 6) }),
  writing: (s: number) => ({ title: pick(WRITING_TITLE, s, 7), body: pick(WRITING_BODY, s, 8) }),
  ops: (s: number) => ({ title: pick(OPS_TITLE, s, 9), body: pick(OPS_BODY, s, 10) }),
  handoff: (s: number) => ({ title: pick(HANDOFF_TITLE, s, 11), body: pick(HANDOFF_BODY, s, 12) }),
  ownership: (s: number) => ({ title: pick(OWNERSHIP_TITLE, s, 13), body: pick(OWNERSHIP_BODY, s, 14) }),
};

/**
 * Three-way comparison: what you pay for outcomes, activity, or effort.
 * Deliberately concrete — every row is a question a buyer already has.
 */
const COMPARISON_ROWS: { label: string; ours: string; retainer: string; inhouse: string }[][] = [
  [
    { label: "What you pay for", ours: "Meetings a real buyer attended, plus running costs. Nothing for our time", retainer: "Emails sent and “pipeline influenced”", inhouse: "A salary, whether or not it works" },
    { label: "Cost of a no-show", ours: "Nothing. It never reaches the invoice", retainer: "The same retainer", inhouse: "The same salary" },
    { label: "Cost to find out if it works", ours: "Nothing. The pilot is on us", retainer: "A month's retainer, minimum", inhouse: "A hire and three months of ramp" },
    { label: "Time to the first meeting", ours: "Weeks. Everything is already running", retainer: "Two to three months of setup", inhouse: "Three to six months to hire and train" },
    { label: "What you own at day 180", ours: "The whole system, in your name, and a team trained to run it", retainer: "Nothing. They keep it all", inhouse: "One person who might leave" },
    { label: "How much you manage", ours: "One call a week", retainer: "Chasing them for updates", inhouse: "Hiring, training and turnover" },
  ],
  [
    { label: "What you are buying", ours: "Meetings with people who can sign", retainer: "Activity, measured in emails", inhouse: "Someone's time" },
    { label: "Up-front cost", ours: "None. The pilot is free", retainer: "Setup fee plus the first month", inhouse: "Salary, tools and data before anything happens" },
    { label: "Who does the follow-up", ours: "We do, including the awkward replies", retainer: "Handed back to you as a list", inhouse: "Your rep, between other tasks" },
    { label: "Who your buyer hears from", ours: "You. It goes out in your name", retainer: "A shared inbox", inhouse: "Your rep, when they get to it" },
    { label: "What happens when it works", ours: "At day 180 we install it in your business", retainer: "The retainer goes up", inhouse: "You hire a second one" },
    { label: "Risk if it fails", ours: "Ours", retainer: "Yours", inhouse: "Yours" },
  ],
  [
    { label: "Billed for", ours: "Meetings held, plus running costs", retainer: "Every month, regardless", inhouse: "Every month, regardless" },
    { label: "Who finds the companies", ours: "We do, and you approve them", retainer: "A bought list", inhouse: "Your rep, if they have time" },
    { label: "Who writes the messages", ours: "We do, in your voice, and you sign them off", retainer: "A template library", inhouse: "Your rep, between calls" },
    { label: "When you see results", ours: "Weeks, and the pilot costs nothing", retainer: "“Trust the process”", inhouse: "After the ramp" },
    { label: "If you want to stop", ours: "Stop. Nothing is owed", retainer: "Notice period", inhouse: "A difficult conversation" },
    { label: "What is left behind", ours: "A sales engine in your name, and a trained team", retainer: "An invoice history", inhouse: "A CV on a job board" },
  ],
];

export function comparisonFor(seed: number) {
  return pick(COMPARISON_ROWS, seed, 15);
}

/** The four-step timeline. Ranges are deliberately loose, except day 180. */
export const TIMELINE = [
  {
    day: "The pilot",
    title: "We run the first campaign free",
    body: "One call to agree which companies are worth talking to, then we build the list and write the messages. The pilot runs at our cost, so you can judge the replies before committing to anything.",
  },
  {
    day: "Then",
    title: "You pay per meeting held",
    body: "An agreed price for each meeting a real buyer attends, plus the small running cost of the accounts and data behind it. No retainer, and no charge for a no-show.",
  },
  {
    day: "Ongoing",
    title: "Meetings appear in your calendar",
    body: "We answer every reply, book the people worth meeting, and hand your team a conversation that is already under way. You approve the messages and turn up.",
  },
  {
    day: "Day 180",
    title: "We install it in-house",
    body: "Now that it is proven, we set the whole thing up inside your business and train your team to run it themselves. You keep the lists, the accounts and the playbook.",
  },
];
