# outbound-domain-sites

Turn bare cold-email sending domains into real, distinct landing pages.


## Install from the Sartoux marketplace

```bash
claude plugin marketplace add Automated-Client-Acquisition/plugins
claude plugin install aca-outbound-domain-sites@sartoux
```

## The problem

A prospect gets your email and pastes the domain into a browser. If nothing is
there — or it redirects into a link shortener — you have just answered their
question about whether you are real.

On the rollout this was built from, 8 of 15 domains did not resolve at all and
5 redirected into an `l.ink` shortener, which is worse than nothing.

## What it does

1. **Interviews you** — your offer, your domains, what proof you can evidence
2. **Audits** what your domains do today
3. **Generates a distinct brand per domain**, then audits for collisions
4. **Deploys** one Next.js app to Vercel with every domain attached
5. **Points DNS** via Porkbun / Internet.bs / Cloudflare APIs — `@` and `www`
   only, mail records verified unchanged
6. **Makes `contact@` work** — alias plus transport rule on M365, or the
   equivalent for your provider

## Safety

Your domains carry live mailboxes, so:

- DNS writes are confined to `@`/`www` and website record types. MX, SPF, DKIM,
  DMARC, NS and SOA are unreachable by the code, not merely avoided.
- Every domain is snapshotted before any change, and mail records are re-read
  and compared afterwards.
- Dry run by default; one domain applied and verified before the rest.
- API keys go in a gitignored `.env`, never into the chat.

## Usage

```
/outbound-domain-sites:outbound-domain-sites
```

Or describe the problem and Claude will reach for it.
