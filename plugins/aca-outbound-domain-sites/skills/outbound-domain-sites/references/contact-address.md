# Making contact@ work

The pages publish `contact@<domain>`. An address that bounces is worse than no
address — it proves nobody is home.

Ask which mail provider the domains use, then follow the matching section.

## Microsoft 365

Two steps per domain. No new licence.

**1. Alias.** Add `contact@<domain>` as a *secondary* address on an existing
mailbox so Exchange accepts mail for it.

> **`smtp:` lowercase = secondary. `SMTP:` uppercase = PRIMARY.**
> Uppercase on a live sending mailbox rewrites its From address and damages its
> reputation. Re-read `PrimarySmtpAddress` afterwards and compare.

Exchange's REST `InvokeCommand` **rejects hashtable parameters**
(`@{Add="..."}` → `Invalid Operation`), so the full `EmailAddresses` list must
be written. That is replace semantics on a live mailbox: read immediately
before, pass existing entries through byte-for-byte, append only the new
lowercase entry, and refuse to write if the read came back empty.

**2. Transport rule**, not mailbox forwarding.

Mailbox forwarding would redirect **every reply to that mailbox** — including
the cold-outreach replies that must stay where they are. A rule scoped to the
recipient moves only mail addressed to `contact@`:

```
New-TransportRule
  -Name "redirect contact@ to inbox"
  -SentTo "contact@<domain>"
  -RedirectMessageTo "<destination>"
```

It also sidesteps the outbound spam policy that blocks automatic external
forwarding by default.

Make it idempotent — check for the alias and the rule before creating either,
so a partial run is safely resumable. And loop per-domain: fifteen tenants of
Exchange calls will exceed a 150-second request limit.

## Google Workspace

Add `contact@<domain>` as an alias on an existing user (Admin console → Users →
Alternate email addresses), then a filter that forwards mail to that address on.
Aliases are free; the forwarding address must be verified first.

## A catch-all forwarder

Many registrars offer free email forwarding. Simplest option when the domain has
no mailboxes of its own — but check it does not conflict with existing MX
records, and remember a catch-all accepts spam for every address.

## Whatever you choose, test it

Send a real message to `contact@<domain>` and confirm it arrives. Transport
rules can take minutes to become active in a fresh tenant.

Then check the address published on the page matches the one you created.
