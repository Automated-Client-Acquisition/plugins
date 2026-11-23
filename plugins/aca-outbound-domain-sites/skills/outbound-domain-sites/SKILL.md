---
name: outbound-domain-sites
description: Give every cold-email sending domain its own real landing page. Use when the user has cold-email or secondary sending domains that show nothing, redirect elsewhere, or point at a link shortener — and wants each to serve a distinct, credible site. Also use for "landing pages for my sending domains", "my cold email domains have no website", "make my outreach domains look real", or when someone is setting up multi-domain cold email infrastructure and asks what to put on the domains. Handles the build, the Vercel deploy, the DNS via registrar APIs, and making contact@ work — without breaking mail.
---

# Landing pages for cold-email sending domains

A prospect who gets a cold email and pastes the domain into a browser must find
something real. So must the reputation systems at Google and Microsoft. A
sending domain that resolves to nothing — or worse, 302s into a link shortener —
is an own-goal.

This skill takes a set of sending domains and gives each one a distinct,
credible site, deployed as **one app** across all of them.

## The one rule that matters

**These domains carry live mailboxes. Breaking their mail stops the user's
entire outbound operation.**

Every DNS action is confined to `@` and `www`, and to website record types
(A, AAAA, CNAME, ALIAS). MX, TXT, SPF, DKIM, DMARC, NS and SOA are never
touched, and the apply script verifies they are byte-identical afterwards.
If you are ever unsure whether an action could affect mail, stop and ask.

## Handling the user's credentials

This process needs registrar and hosting API keys. Handle them like this:

- **Never ask the user to paste a key into the chat.** Chat transcripts persist.
  Ask them to write keys into a gitignored `.env` file, then read it yourself.
- Before writing anything to `.env`, verify it is gitignored **and** untracked.
- Never echo a key back, not even partially. Print lengths or `set/MISSING`.
- Probe each credential against its API before using it, so a bad key fails at
  the start rather than halfway through a 15-domain run.

Read `references/credentials.md` for the exact wording to use and the probe
commands per provider.

## Workflow

Work through these in order. Do not skip the interview — everything downstream
is generated from it.

### 1. Interview

Establish what is being sold and what domains exist. Use `AskUserQuestion` for
the closed questions. Full script and the reasoning behind each question:
**`references/interview.md`**.

You need, at minimum:

| | |
|---|---|
| The offer | what they sell, to whom, and the commercial terms |
| Proof | real numbers they can evidence — see the honesty rule below |
| Domains | the exact sending domains to build for |
| Registrars | who hosts DNS for each (detect from nameservers, do not ask) |
| Destination | where enquiries should go |

### 2. Audit the current state

Before proposing anything, show them what their domains do today. This is
usually the moment the problem becomes obvious.

```bash
node scripts/dns-plan.mjs
```

For each domain it reports the live A/CNAME, the MX/SPF/DMARC it will protect,
and which records need to change. Domains with URL forwarding into a shortener
are the urgent ones.

### 3. Generate the brands

One entry per domain in `lib/brands.ts`, generated from the interview.

**Every domain must differ** in template, palette, font pairing, wordmark,
body copy, and metadata. Fifteen identical pages served from one edge with one
analytics ID cluster the domains together — a *stronger* footprint signal than
leaving them blank. That variation is the entire point, not decoration.

`references/architecture.md` has the `Brand` shape, the four templates, and the
copy-pool mechanism. Copy `assets/app-template/` into place first; it contains
everything except `brands.ts` and `proof.ts`, which you generate.

Verify with the built-in audit — it fails if any two domains collide:

```bash
curl -s localhost:3010/api/brands | jq '{ok, issues}'
```

### 4. Honesty check — do this before writing a word of copy

Read `references/honesty.md` and apply it. In short:

- **Never invent** testimonials, client logos, ratings, case studies or metrics.
  Fifteen domains repeating a fabricated statistic is an advertising-standards
  problem and the fastest way to get the whole set cross-referenced.
- Only publish numbers the user can evidence. If they have none, use process,
  guarantees and response-time commitments instead — those are claims about how
  they work, not about results.
- Anything illustrative in a UI mockup must be **labelled** illustrative.
- Commercial promises on the page ("no-shows not billed", "free pilot") must
  match what the user actually contracts. Ask them to confirm.

### 5. Build and verify locally

```bash
cd <app> && npm install && npm run dev
```

Brands resolve from the `Host` header, so every domain is reachable locally —
browsers send any `*.localhost` name to loopback:

```
http://theirdomain.com.localhost:3010
```

Check several brands render distinctly, then `npm run build`.

### 6. Deploy to Vercel

One project, all domains attached. `references/vercel.md` covers it, including
the traps: certificates are **not** always issued automatically, and Deployment
Protection must be set to allow custom domains.

### 7. Point DNS

```bash
node scripts/dns-apply.mjs                    # dry run, all domains
node scripts/dns-apply.mjs --only <domain> --apply
```

**Always dry-run first, and always apply to one domain before the rest.**
Read the planned deletes aloud to the user before applying.

Provider specifics and their individual API quirks: `references/dns.md`.

### 8. Make contact@ work

The pages publish `contact@<domain>`. If that address bounces it is worse than
publishing nothing. `references/contact-address.md` covers the options by mail
provider — for Microsoft 365 it is an alias plus a transport rule, and the
distinction between `smtp:` and `SMTP:` will break a live sending mailbox if
you get it wrong.

### 9. Hand over the checklist

Close with what remains theirs: legal review, per-domain analytics, and
confirming the printed commercial promises match their contracts.

## Before you tell them it is done

Verify, do not assume. For every domain:

- `https://domain` and `https://www.domain` both return 200
- the right brand renders (`data-brand` attribute matches the host)
- MX, SPF and DMARC are unchanged from the pre-change snapshot
- the contact form writes to wherever it is meant to
- `contact@domain` receives mail

`references/pitfalls.md` lists every trap this playbook hit in production, with
the symptom, the cause and the fix. Read it before you start — it will save you
from at least three of them.
