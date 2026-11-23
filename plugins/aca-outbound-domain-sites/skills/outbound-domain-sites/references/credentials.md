# Handling the user's credentials

This process needs registrar and hosting API keys. You are asking someone to
hand over keys that can repoint their DNS. Behave accordingly.

## Never accept a key pasted into chat

Chat transcripts persist. A key pasted into one is exposed for as long as the
transcript exists, and rotating it later is a chore the user resents.

Ask for it in a file instead:

> Don't paste it here — the transcript keeps it. Put it in the gitignored env
> file and I'll read it from there:
>
> ```bash
> echo 'PORKBUN_API_KEY=pk1_...' >> .env
> ```

If the user pastes one anyway: use it, say once that it is now in the
transcript, and move on. Do not lecture, and do not keep raising it — they have
heard you.

## Verify the file is safe before writing to it

Every time, before writing a secret:

```bash
git check-ignore .env                         # must succeed
git ls-files --error-unmatch .env 2>/dev/null # must FAIL (not tracked)
```

If either check goes the wrong way, stop and fix the ignore rules first.

## Never echo a key back

Not even truncated. Print presence and length:

```bash
echo "  PORKBUN_API_KEY: ${PK:+set (${#PK} chars)}${PK:-MISSING}"
```

When printing API responses that might contain credentials, redact before
printing rather than after.

## Probe before you use

Verify each credential against its API before the run, so a bad key fails in
the first ten seconds rather than halfway through fifteen domains.

**Porkbun** — returns your public IP, useful for the Internet.bs allowlist:

```bash
curl -s -X POST https://api.porkbun.com/api/json/v3/ping \
  -H 'Content-Type: application/json' \
  -d "{\"apikey\":\"$PORKBUN_API_KEY\",\"secretapikey\":\"$PORKBUN_SECRET_KEY\"}"
```

**Internet.bs** — distinguishes a bad key from a blocked IP:

```bash
curl -s -G https://api.internet.bs/Account/Balance/Get \
  --data-urlencode "ApiKey=$INTERNETBS_API_KEY" \
  --data-urlencode "Password=$INTERNETBS_PASSWORD" \
  --data-urlencode "ResponseFormat=JSON"
```

`107002` = wrong credentials. `107017` = credentials fine, IP not whitelisted —
the message names the IP to add.

**Cloudflare**:

```bash
curl -s https://api.cloudflare.com/client/v4/user/tokens/verify \
  -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN"
```

Token needs **Zone → DNS → Edit** on the relevant zones.

**Vercel**:

```bash
curl -s https://api.vercel.com/v2/user -H "Authorization: Bearer $VERCEL_TOKEN"
```

## Scope requests to the minimum

Ask for the narrowest token that does the job. A Cloudflare token scoped to
DNS edit on three zones is very different from a global API key, and users are
more willing to hand over the former.

## Say what you will do with them

Before asking, state plainly which operations you will perform:

> With the Porkbun key I'll read your current DNS, delete the URL-forwarding
> rules, and set `@` and `www`. I won't touch MX, SPF, DKIM or DMARC — the
> script refuses to.

## Rotation

Mention it once at the end, as a note rather than a warning. If the user says
they would rather not, that is their call — persist the keys to the gitignored
env file so they are usable next session, confirm nothing is tracked, and drop
the subject.
