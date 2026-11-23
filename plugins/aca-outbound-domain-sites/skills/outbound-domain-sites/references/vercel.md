# Deploying to Vercel

One project, every domain attached, separate from the user's main app.

## First deploy

```bash
cd <app>
npx vercel login
npx vercel --prod
```

Run it from inside the app directory so that is already the root. The
`*.vercel.app` URL renders `DEFAULT_BRAND`, because a `.vercel.app` host matches
no brand — expected, not a fault.

## Environment variables

Whatever the contact form needs, on **production and preview**. Vercel does not
apply new env vars to an existing deployment — redeploy after adding them.

The form should fail loudly (503) when unconfigured rather than silently
dropping enquiries.

## Attaching domains

`vercel domains add` **exits non-zero even on success**, so shell error handling
built around it reports false failures. Use the REST API:

```
POST /v10/projects/{projectId}/domains   { "name": "domain.com" }
```

`scripts/add-domains.sh` does this, reading the list from `lib/brands.ts` so it
cannot drift from the brands the app serves. Apex and www for each.

Domains show "Invalid Configuration" until DNS points at them. Expected.

## Certificates

**Do not assume automatic issuance.** DNS can be correct, the domain can report
`verified: true, misconfigured: false`, and TLS still fail — HTTP works, HTTPS
does not, TCP connects but the handshake does not complete.

Request it:

```
POST /v8/certs   { "domains": ["domain.com", "www.domain.com"] }
```

`http_pretest_domain_not_resolving_to_vercel_error` means DNS has not propagated
yet. Wait and retry.

## Deployment Protection

`ssoProtection: { deploymentType: "all_except_custom_domains" }` is correct: the
deployment URL stays login-gated while custom domains serve publicly. A 302 to
`vercel.com/login` on the `*.vercel.app` URL is that working as intended.

## Continuous deploys

Connecting the git repo needs the GitHub↔Vercel OAuth flow, which cannot be
done headlessly. Point the user at Settings → Git. Set Root Directory to the
app folder if it lives inside a larger repo; `/` if it has its own.

## Local gotcha

Never run `npm run build` while `npm run dev` is running — the build overwrites
`.next` under the server. Symptoms are unstyled pages or `Failed to fetch` on
navigation. `rm -rf .next && npm run dev` fixes it. Vercel is unaffected.
