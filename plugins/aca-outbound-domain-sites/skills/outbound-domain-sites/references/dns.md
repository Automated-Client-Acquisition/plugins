# Pointing DNS

Two records per domain. Nothing else changes.

| Host | Type | Value |
|---|---|---|
| `@` | A | Vercel apex IPs — fetch current values, do not hardcode |
| `www` | CNAME | project-specific Vercel target |

Fetch the current recommendation from `/v6/domains/{domain}/config` and prefer
rank 1. Vercel has expanded its IP range once already; hardcoding goes stale.

## The safety model

`dns-apply.mjs` enforces four properties in code, not by care:

1. **Create only** `@ A` and `www CNAME`. **Delete only** website record types
   (A/AAAA/CNAME/ALIAS/URL) on `@`/`www`. Mail types are checked against a
   blocklist and throw before any request is made.
2. **Snapshot first** — every record written to `scripts/dns-backup/` before a
   single change. That is the rollback.
3. **Verify after** — mail records re-read and compared to the snapshot. Any
   difference is reported as a failure.
4. **Dry run by default.** `--apply` is required.

## How to run it

```bash
node scripts/dns-plan.mjs                        # read-only report
node scripts/dns-apply.mjs                       # dry run, all domains
node scripts/dns-apply.mjs --only <domain>       # dry run, one
node scripts/dns-apply.mjs --only <domain> --apply
node scripts/dns-apply.mjs --apply               # the rest
```

**Always one domain first.** Verify it serves and mail is intact before the
remainder. Read the planned deletes to the user before applying.

## Per provider

**Porkbun** — API access is off per domain in the control panel. URL forwarding
outranks A records and must be deleted first, via `deleteUrlForward` (singular).
Deleting it also removes the ALIAS it created, invalidating snapshotted IDs.

**Internet.bs** — allowlists by IP; `107017` names the IP to add. `List` needs
a `Domain` param, `Add`/`Remove` reject it and take `FullRecordName` only.

**Cloudflare** — records must be `proxied: false`, or Vercel cannot issue a
certificate. Needs a token with Zone → DNS → Edit.

**Anything else** — no adapter. Print the exact records and let the user enter
them by hand. Do not improvise against an unfamiliar API on domains carrying
live mail.

## Verifying

Use a public resolver. Your machine's cache will lie:

```bash
dig +short A <domain> @1.1.1.1
dig +short MX <domain> @1.1.1.1     # must be unchanged
curl -s -o /dev/null -w "%{http_code}" https://<domain>
```
