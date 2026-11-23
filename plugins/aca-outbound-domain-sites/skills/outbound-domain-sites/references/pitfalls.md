# Pitfalls

Every one of these was hit in production on a real 15-domain rollout. Each cost
time or nearly caused damage. Read before starting.

---

## DNS

### A CNAME cannot coexist with an A record at the same name

Creating `www CNAME` while a `www A` record still exists produces invalid DNS.
The same applies to an apex `A` alongside Porkbun's `ALIAS`.

An allowlist narrow enough to permit only the two records being *written* will
silently leave the conflict in place. Creation and deletion need different
rules: create exactly the target records; delete any **website-type** record
(A / AAAA / CNAME / ALIAS / URL) on `@` or `www`. Mail types stay untouchable.

### Porkbun URL forwarding outranks the A record

If a domain has a URL-forwarding rule, adding an A record changes nothing —
the forward still wins. Delete the rule first.

The delete endpoint is **`/domain/deleteUrlForward/{domain}/{id}`** — singular.
`deleteUrlForwarding` mirrors the *get* endpoint's name and 404s.

Deleting the forwarding rule also removes the ALIAS record it created, which
invalidates any record ID you snapshotted beforehand. Re-read after clearing.

### Porkbun API access is off per domain

Enabled individually in the control panel. Calls 403 until it is on. Check all
domains before starting, not one at a time as you hit them.

### Internet.bs: `Domain` is required by List and rejected by Add/Remove

`/Domain/DnsRecord/List` needs `Domain`. `/Domain/DnsRecord/Add` and `/Remove`
take `FullRecordName` only, and passing `Domain` fails the whole call with
`Parameter(s) "domain" not recognized`.

### Internet.bs allowlists by IP

Correct credentials still fail with `107017` until the calling machine's public
IP is whitelisted. The error names the IP, so read it rather than guessing.

### Cloudflare records must be DNS-only

`proxied: true` terminates TLS at Cloudflare and prevents Vercel completing the
ACME challenge. Set `proxied: false` and verify it in the response.

### Your own resolver will lie to you

macOS caches aggressively. A domain can be correct at `1.1.1.1` and still
resolve to the old IP locally, making a working site look broken.

Verify with `dig @1.1.1.1` and `curl --resolve`, not the system resolver.

**But `--resolve` needs the right IP**: if the CNAME chain changes, a parser
that grabbed the first line may pass an empty IP and every domain reports 000.
Plain `curl https://domain` is the honest check.

---

## Vercel

### Certificates are not always issued automatically

DNS can be correct, the domain can report `verified: true, misconfigured: false`,
and TLS still fails — TCP connects, handshake does not, HTTP works and HTTPS
does not. Request issuance explicitly:

```
POST /v8/certs  { "domains": ["domain.com", "www.domain.com"] }
```

If it returns `http_pretest_domain_not_resolving_to_vercel_error`, DNS has not
propagated yet. Wait, retry.

### `vercel domains add` exits non-zero on success

Error handling built around the exit code will report every domain as failed
while they are actually being added. Use the REST API
(`POST /v10/projects/{id}/domains`), which returns real per-domain results.

### Deployment Protection

`ssoProtection: { deploymentType: "all_except_custom_domains" }` is the setting
you want: the `*.vercel.app` URL stays login-gated, custom domains serve
publicly. A 302 to `vercel.com/login` on the deployment URL is expected and not
a fault.

### Vercel's recommended records change

Vercel has expanded its IP range; the current recommendation is two apex IPs
plus a project-specific CNAME. Legacy values keep working. Fetch the
recommendation from `/v6/domains/{domain}/config` rather than hardcoding, so it
does not go stale.

### Never run `npm run build` while the dev server is running

The build overwrites `.next` underneath the running server. Symptoms: serif
text and blue underlined links (CSS chunk 404s), or `TypeError: Failed to
fetch` on navigation. Fix: `rm -rf .next && npm run dev`. Vercel builds in a
clean checkout, so this only bites locally.

---

## Microsoft 365

### `smtp:` versus `SMTP:` will break a live mailbox

Lowercase adds a secondary alias. **Uppercase sets the PRIMARY address** — on a
sending mailbox that rewrites its From and damages its reputation.

Always re-read `PrimarySmtpAddress` after writing and compare.

### Hashtable parameters are rejected by the REST endpoint

`Set-Mailbox -EmailAddresses @{Add="..."}` fails with `Invalid Operation` over
Exchange's REST `InvokeCommand`. The whole list must be written.

That is replace semantics on a live mailbox, so: read immediately before, pass
existing entries through byte-for-byte (preserving the uppercase `SMTP:` that
marks the primary), append only the new lowercase entry, and refuse to write if
the read returned an empty list.

### Use a transport rule, not mailbox forwarding

`contact@` is an alias on a real sending mailbox. Mailbox-level forwarding would
redirect **every cold-outreach reply** to the destination inbox, out of the
system that is supposed to receive them.

A transport rule scoped to the recipient address moves only mail sent to that
address. It also avoids the outbound spam policy that blocks automatic external
forwarding by default.

### Supabase edge functions time out at 150s

Fifteen tenants of Exchange calls in one request will not finish. Loop
per-domain from the client. Make the operation idempotent so a partial run is
safely resumable — a rerun should report "already present", not fail.

---

## Email delivery

### Resend rejects unverified domains with a status, not an exception

`await fetch(...)` without checking `res.ok` sees no error. The send silently
never happens. This can hide for months.

Always check the status and surface it — return `sent:<id>` / `failed:<code>`
rather than `void`.

### Verification may be on a subdomain, not the apex

`notifications.example.com` being verified does not verify `example.com`. Probe
the exact address you intend to send from; do not infer from the apex.

### A send-only API key cannot list or add domains

Resend restricted keys return `restricted_api_key` for the domains API. The
only way to test which senders work is to attempt a send and read the status.

---

## Process

### Dry-run output is worth reading, not skimming

The CNAME/A conflict above surfaced as a line saying `keep www A (not
allowlisted)` sitting directly above `would create www CNAME`. It was visible
before it was harmful, and only because the dry run printed both.

### Verify a failure left no partial state

When a multi-step operation fails mid-way, check what actually happened before
retrying. In one run seven domains errored — a read-back confirmed all seven
were untouched, because the error fired before any write. Assuming either way
would have been wrong.

### Do not report success from a test harness you just changed

Two separate false alarms came from the verification script, not the system:
once a stale local DNS cache, once a `--resolve` parser. Both would have been
reported as production failures. When everything fails at once, suspect the
harness first.
