# The interview

Everything downstream is generated from these answers. Get them properly and
the rest is mechanical; guess at them and you will produce fifteen plausible
pages that say nothing true.

Use `AskUserQuestion` for the closed questions. Ask the open ones in prose —
they need a paragraph, not a button.

---

## 1. What are the domains?

Ask for the exact list. Then **detect the registrar yourself** from the live
nameservers rather than asking — users often do not know, and the DNS host is
frequently not the registrar:

```bash
dig +short NS <domain>
```

Map: `porkbun.com` → Porkbun · `topdns.com` → Internet.bs · `cloudflare.com` →
Cloudflare · anything else → manual, tell them plainly.

While you are there, capture the current state. This is the moment the problem
becomes concrete for them:

```bash
dig +short A <domain>            # nothing = domain does not resolve
curl -sI -m 8 https://<domain>   # 30x into a shortener = actively harmful
dig +short MX <domain>           # confirms mail you must protect
```

Report it as a table. "Eight of your fifteen domains do not resolve at all, and
five redirect into a link shortener" lands harder than any pitch.

---

## 2. What do they sell?

Open question. You need enough to write copy that could not have been written
about anyone else:

- What is the product or service, in their words
- Who buys it — industry, size, the job title that signs
- What a customer is worth, roughly
- What the buyer's alternative is if they do nothing
- **The commercial terms**: retainer, per-outcome, setup fees, minimum term

The commercial terms matter more than they look. They end up printed on every
domain, so they must match what the user actually contracts. Ask directly:
*"If a prospect read this page and signed, would the terms on it be the deal
they get?"*

---

## 3. What proof do they actually have?

The single most important question, and the one users answer loosely.

Ask what they can **evidence**. Push back on anything vague:

- "We get great results" → what number, measured how, over what period?
- "Our clients love us" → can you name one who would agree to be named?
- "Industry-leading deliverability" → measured across how many sends?

Then apply `honesty.md`. If the honest answer is "we are new and have no
numbers", that is fine and workable — the page leans on method, guarantees and
response times instead. It is not fine to invent something.

Record for each number: the value, what it measures, and where it came from.
That provenance goes on the page as a footnote and is what makes it credible.

---

## 4. Where do enquiries go?

- Which inbox should receive them
- Is there a CRM to write into, or is email enough
- Do they want a phone number collected (raises friction, improves qualification)
- Is there a booking link, or should the form be the only path

---

## 5. Brand naming

For each domain, a brand name that a visitor would accept as the company behind
that address. Usually a tidied version of the domain itself.

Watch for **near-identical domain pairs** (`fastdealsai.com` and
`fast-deals-ai.com`). They need visibly different names, palettes and layouts,
or the relationship is obvious to anyone who looks at both.

---

## 6. The legal entity

Ask whether the footer should name the operating company.

There is a genuine trade-off and it is the user's call, not yours:

- **Naming it** is the legally safer position in most jurisdictions and normal
  for a trading name. It also links the domains to each other.
- **Omitting it** keeps the domains looking independent, and is harder to
  defend if anyone asks who is behind the site.

Present both, take their answer, do not decide for them.

---

## 7. Credentials

Last, once they have agreed the plan. See `credentials.md` — never in chat.

You need, depending on scope:

| Purpose | Keys |
|---|---|
| Hosting | Vercel token |
| DNS (whichever apply) | Porkbun key + secret · Internet.bs key + password · Cloudflare token |
| Enquiry storage | whatever their backend needs |

---

## Sanity checks before you build

- Does every domain in the list actually belong to them? Check whois if unsure.
- Do any already host a real site you would be overwriting? `dig` + `curl` first.
- Are any expired or lapsed? A domain with no NS records is gone — do not build
  a page for it, tell them.
- Is the domain count sane? Beyond ~20, ask whether all are actively sending.
