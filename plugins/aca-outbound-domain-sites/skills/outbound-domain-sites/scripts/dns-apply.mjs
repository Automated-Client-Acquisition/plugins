#!/usr/bin/env node
/**
 * Point website records at Vercel, via the registrar APIs.
 *
 *   node scripts/dns-apply.mjs                          # dry run, every domain
 *   node scripts/dns-apply.mjs --only example.com        # dry run, one domain
 *   node scripts/dns-apply.mjs --only example.com --apply
 *   node scripts/dns-apply.mjs --apply                  # all supported domains
 *
 * These domains carry live mailboxes. Breaking their mail would stop the whole
 * outbound operation, so the safety rules below are enforced in code rather
 * than left to care:
 *
 *  1. ALLOWLIST. Only `@ A` and `www CNAME` are ever CREATED. Deletion is
 *     confined to website record types (A/AAAA/CNAME/ALIAS/URL) on the `@` and
 *     `www` hosts only — wide enough to clear a conflicting record, never wide
 *     enough to reach an MX, TXT, SPF, DKIM or DMARC. The mutation helpers
 *     double-check the type against MAIL_TYPES and throw before any request.
 *  2. SNAPSHOT FIRST. Every record for a domain is written to
 *     scripts/dns-backup/<domain>.<timestamp>.json before anything changes.
 *  3. VERIFY AFTER. Mail records are re-read post-change and compared to the
 *     snapshot. Any difference is reported as a FAILURE, loudly.
 *  4. DRY RUN BY DEFAULT. Nothing is written without --apply.
 *
 * Credentials are read from ../.env.local (gitignored). Never pass them as
 * command-line arguments — argv is visible to other processes.
 *
 *   PORKBUN_API_KEY=pk1_...
 *   PORKBUN_SECRET_KEY=sk1_...
 *   INTERNETBS_API_KEY=...
 *   INTERNETBS_PASSWORD=...
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { promises as dns } from "node:dns";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const BACKUP_DIR = join(HERE, "dns-backup");

/**
 * Legacy fallback. Vercel confirms these keep working, but its current
 * recommendation is two apex IPs plus a project-specific CNAME — fetched live in
 * resolveTargets() so this never goes stale when Vercel expands its range again.
 */
const LEGACY_A = ["76.76.21.21"];
const LEGACY_CNAME = "cname.vercel-dns.com";

/** The ONLY records this script may CREATE. Values filled by resolveTargets(). */
const ALLOWED = [
  { host: "", type: "A", values: [...LEGACY_A] },
  { host: "www", type: "CNAME", values: [LEGACY_CNAME] },
];
const canCreate = (host, type) =>
  ALLOWED.some((a) => a.host === (host ?? "").toLowerCase() && a.type === String(type).toUpperCase());

/**
 * Ask Vercel what it currently recommends, and prefer rank 1. Falls back to the
 * legacy records when there is no token or the call fails, so the script still
 * works without Vercel credentials.
 */
async function resolveTargets(sampleDomain) {
  const token = ENV.VERCEL_TOKEN;
  if (!token) return "legacy (no VERCEL_TOKEN)";
  let teamId = "";
  try {
    teamId = JSON.parse(readFileSync(join(HERE, "..", ".vercel", "project.json"), "utf8")).orgId;
  } catch {
    /* optional */
  }
  try {
    const res = await fetch(
      `https://api.vercel.com/v6/domains/${sampleDomain}/config${teamId ? `?teamId=${teamId}` : ""}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const cfg = await res.json();
    const bestA = (cfg.recommendedIPv4 || []).sort((a, b) => a.rank - b.rank)[0];
    const bestC = (cfg.recommendedCNAME || []).sort((a, b) => a.rank - b.rank)[0];
    if (bestA?.value?.length) ALLOWED[0].values = bestA.value;
    if (bestC?.value) ALLOWED[1].values = [String(bestC.value).replace(/\.$/, "")];
    return "Vercel-recommended";
  } catch {
    return "legacy (lookup failed)";
  }
}

/**
 * Deletion is broader than creation, and has to be.
 *
 * A CNAME cannot coexist with an A record at the same name, and Porkbun's apex
 * ALIAS conflicts with an apex A — so the conflicting *website* record must go
 * for the change to be valid DNS at all. An earlier version allowlisted only the
 * two records being written, which silently left those conflicts in place.
 *
 * The guarantee that matters is unchanged: deletion is confined to the `@` and
 * `www` hosts AND to website record types. No mail record is reachable, at any
 * host, ever.
 */
const WRITABLE_HOSTS = new Set(["", "www"]);
const WEBSITE_TYPES = new Set(["A", "AAAA", "CNAME", "ALIAS", "ANAME", "URL", "URL_FORWARD", "REDIRECT"]);
const canDelete = (host, type) =>
  WRITABLE_HOSTS.has((host ?? "").toLowerCase()) && WEBSITE_TYPES.has(String(type).toUpperCase());

/** Record types that must be byte-identical before and after. Never deletable. */
const MAIL_TYPES = new Set(["MX", "TXT", "SPF", "DKIM", "DMARC", "SRV", "CAA", "NS", "SOA"]);

// ── env ──────────────────────────────────────────────────────────────────────

function loadEnv() {
  const p = join(HERE, "..", ".env.local");
  if (!existsSync(p)) return {};
  return Object.fromEntries(
    readFileSync(p, "utf8")
      .split("\n")
      .filter((l) => l.trim() && !l.startsWith("#") && l.includes("="))
      .map((l) => {
        const i = l.indexOf("=");
        return [l.slice(0, i).trim(), l.slice(i + 1).trim()];
      })
  );
}
const ENV = loadEnv();

// ── providers ────────────────────────────────────────────────────────────────

const porkbun = {
  name: "Porkbun",
  ready: () => Boolean(ENV.PORKBUN_API_KEY && ENV.PORKBUN_SECRET_KEY),
  auth: () => ({ apikey: ENV.PORKBUN_API_KEY, secretapikey: ENV.PORKBUN_SECRET_KEY }),

  async call(path, body = {}) {
    const res = await fetch(`https://api.porkbun.com/api/json/v3${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...this.auth(), ...body }),
    });
    const json = await res.json().catch(() => ({}));
    if (json.status !== "SUCCESS") {
      throw new Error(json.message || `porkbun ${path} failed (${res.status})`);
    }
    return json;
  },

  async list(domain) {
    const { records = [] } = await this.call(`/dns/retrieve/${domain}`);
    return records.map((r) => ({
      id: r.id,
      // Porkbun returns fully-qualified names; normalise to a bare subdomain.
      host: r.name === domain ? "" : r.name.replace(`.${domain}`, ""),
      type: r.type,
      value: r.content,
      ttl: r.ttl,
      prio: r.prio,
    }));
  },

  async create(domain, host, type, value) {
    if (!canCreate(host, type)) throw new Error(`refused: cannot create ${host || "@"} ${type}`);
    return this.call(`/dns/create/${domain}`, { name: host, type, content: value, ttl: "600" });
  },

  async remove(domain, rec) {
    if (MAIL_TYPES.has(String(rec.type).toUpperCase())) throw new Error(`REFUSED: ${rec.type} is a mail record`);
    if (!canDelete(rec.host, rec.type)) throw new Error(`refused: cannot delete ${rec.host || "@"} ${rec.type}`);
    return this.call(`/dns/delete/${domain}/${rec.id}`);
  },

  /**
   * Porkbun URL forwarding outranks the A record, so it has to go.
   * The delete endpoint is `deleteUrlForward` (singular) — `deleteUrlForwarding`
   * mirrors the *get* endpoint's name but 404s.
   */
  async clearForwarding(domain, apply) {
    let fwd = [];
    try {
      const r = await this.call(`/domain/getUrlForwarding/${domain}`);
      fwd = r.forwards || [];
    } catch {
      return [];
    }
    for (const f of fwd) {
      if (apply) await this.call(`/domain/deleteUrlForward/${domain}/${f.id}`);
    }
    return fwd;
  },
};

const internetbs = {
  name: "Internet.bs",
  ready: () => Boolean(ENV.INTERNETBS_API_KEY && ENV.INTERNETBS_PASSWORD),

  async call(path, params = {}) {
    const qs = new URLSearchParams({
      ApiKey: ENV.INTERNETBS_API_KEY,
      Password: ENV.INTERNETBS_PASSWORD,
      ResponseFormat: "JSON",
      ...params,
    });
    const res = await fetch(`https://api.internet.bs${path}?${qs}`);
    const json = await res.json().catch(() => ({}));
    if (json.status && json.status !== "SUCCESS") {
      throw new Error(json.message || `internet.bs ${path} failed`);
    }
    return json;
  },

  async list(domain) {
    const r = await this.call("/Domain/DnsRecord/List", { Domain: domain });
    return (r.records || []).map((x) => ({
      id: `${x.name}|${x.type}|${x.value}`,
      host: x.name === domain ? "" : String(x.name).replace(`.${domain}`, ""),
      type: x.type,
      value: x.value,
      ttl: x.ttl,
    }));
  },

  async create(domain, host, type, value) {
    if (!canCreate(host, type)) throw new Error(`refused: cannot create ${host || "@"} ${type}`);
    // Add/Remove take FullRecordName only. Passing `Domain` (which List *does*
    // require) makes the API reject the whole call.
    return this.call("/Domain/DnsRecord/Add", {
      FullRecordName: host ? `${host}.${domain}` : domain,
      Type: type,
      Value: value,
      Ttl: "3600",
    });
  },

  async remove(domain, rec) {
    if (MAIL_TYPES.has(String(rec.type).toUpperCase())) throw new Error(`REFUSED: ${rec.type} is a mail record`);
    if (!canDelete(rec.host, rec.type)) throw new Error(`refused: cannot delete ${rec.host || "@"} ${rec.type}`);
    return this.call("/Domain/DnsRecord/Remove", {
      FullRecordName: rec.host ? `${rec.host}.${domain}` : domain,
      Type: rec.type,
    });
  },

  async clearForwarding() {
    return [];
  },
};

const cloudflare = {
  name: "Cloudflare",
  ready: () => Boolean(ENV.CLOUDFLARE_API_TOKEN),
  zones: new Map(),

  async call(path, init = {}) {
    const res = await fetch(`https://api.cloudflare.com/client/v4${path}`, {
      ...init,
      headers: {
        Authorization: `Bearer ${ENV.CLOUDFLARE_API_TOKEN}`,
        "Content-Type": "application/json",
        ...(init.headers || {}),
      },
    });
    const json = await res.json().catch(() => ({}));
    if (!json.success) {
      throw new Error((json.errors || []).map((e) => e.message).join("; ") || `cloudflare ${path} failed`);
    }
    return json;
  },

  async zoneId(domain) {
    if (this.zones.has(domain)) return this.zones.get(domain);
    const { result } = await this.call(`/zones?name=${domain}`);
    if (!result?.length) throw new Error(`zone not found for ${domain} (token may lack access)`);
    this.zones.set(domain, result[0].id);
    return result[0].id;
  },

  async list(domain) {
    const zone = await this.zoneId(domain);
    const { result } = await this.call(`/zones/${zone}/dns_records?per_page=200`);
    return result.map((r) => ({
      id: r.id,
      host: r.name === domain ? "" : r.name.replace(`.${domain}`, ""),
      type: r.type,
      value: r.content,
      ttl: r.ttl,
      proxied: r.proxied,
    }));
  },

  async create(domain, host, type, value) {
    if (!canCreate(host, type)) throw new Error(`refused: cannot create ${host || "@"} ${type}`);
    const zone = await this.zoneId(domain);
    // proxied MUST be false. Cloudflare's proxy terminates TLS itself, which
    // stops Vercel from completing the ACME challenge and issuing a certificate.
    return this.call(`/zones/${zone}/dns_records`, {
      method: "POST",
      body: JSON.stringify({
        type,
        name: host ? `${host}.${domain}` : domain,
        content: value,
        ttl: 1, // 1 = automatic
        proxied: false,
      }),
    });
  },

  async remove(domain, rec) {
    if (MAIL_TYPES.has(String(rec.type).toUpperCase())) throw new Error(`REFUSED: ${rec.type} is a mail record`);
    if (!canDelete(rec.host, rec.type)) throw new Error(`refused: cannot delete ${rec.host || "@"} ${rec.type}`);
    const zone = await this.zoneId(domain);
    return this.call(`/zones/${zone}/dns_records/${rec.id}`, { method: "DELETE" });
  },

  async clearForwarding() {
    return [];
  },
};

// ── domain → provider, decided by live nameservers ───────────────────────────

async function providerFor(domain) {
  const ns = (await dns.resolveNs(domain).catch(() => [])).join(" ").toLowerCase();
  if (ns.includes("porkbun")) return porkbun;
  if (ns.includes("topdns") || ns.includes("internet.bs")) return internetbs;
  if (ns.includes("cloudflare")) return cloudflare;
  return { name: ns || "unknown", unsupported: true };
}

function domainsFromBrands() {
  const src = readFileSync(join(HERE, "..", "lib", "brands.ts"), "utf8");
  return [...src.matchAll(/^\s*domain:\s*"([^"]+)"/gm)].map((m) => m[1]);
}

const snapshotMail = (records) =>
  records
    .filter((r) => MAIL_TYPES.has(String(r.type).toUpperCase()))
    .map((r) => `${r.host}|${r.type}|${r.value}`)
    .sort();

// ── main ─────────────────────────────────────────────────────────────────────

const argv = process.argv.slice(2);
const APPLY = argv.includes("--apply");
const only = argv.includes("--only") ? argv[argv.indexOf("--only") + 1] : null;

const targets = domainsFromBrands().filter((d) => !only || d === only);
if (!targets.length) {
  console.error(only ? `no configured domain named ${only}` : "no domains configured");
  process.exit(1);
}

const source = await resolveTargets(targets[0]);
console.log(`\n${APPLY ? "APPLYING" : "DRY RUN"} — ${targets.length} domain(s)`);
console.log(`Targets (${source}):  @ A ${ALLOWED[0].values.join(", ")}   www CNAME ${ALLOWED[1].values.join(", ")}`);
console.log(`Only "@ A" and "www CNAME" can be written. Mail records are verified unchanged.\n`);

if (!APPLY) console.log("(no changes will be made; add --apply)\n");
mkdirSync(BACKUP_DIR, { recursive: true });

let ok = 0, skipped = 0, failed = 0;

for (const domain of targets) {
  const provider = await providerFor(domain);
  process.stdout.write(`${domain}  [${provider.name}]\n`);

  if (provider.unsupported) {
    console.log(`  SKIP — no API adapter for this provider; change these records by hand\n`);
    skipped++;
    continue;
  }
  if (!provider.ready()) {
    console.log(`  SKIP — credentials for ${provider.name} not in .env.local\n`);
    skipped++;
    continue;
  }

  try {
    const before = await provider.list(domain);
    const mailBefore = snapshotMail(before);
    const stamp = new Date().toISOString().replace(/[:.]/g, "-");
    writeFileSync(join(BACKUP_DIR, `${domain}.${stamp}.json`), JSON.stringify(before, null, 2));
    console.log(`  snapshot: ${before.length} records saved  (mail records: ${mailBefore.length})`);

    const fwd = await provider.clearForwarding(domain, APPLY);
    if (fwd.length) console.log(`  ${APPLY ? "removed" : "would remove"} ${fwd.length} URL forwarding rule(s)`);

    for (const want of ALLOWED) {
      const norm = (v) => String(v).replace(/\.$/, "").toLowerCase();
      const wanted = want.values.map(norm);

      const existing = before.filter(
        (r) => (r.host || "") === want.host && String(r.type).toUpperCase() === want.type
      );
      // Anything on the same host that would conflict — e.g. an A record where a
      // CNAME must go — must also be removed, but only if deletion is permitted.
      const conflicting = before.filter(
        (r) =>
          (r.host || "") === want.host &&
          String(r.type).toUpperCase() !== want.type &&
          WEBSITE_TYPES.has(String(r.type).toUpperCase())
      );

      // Reconcile by value: a target may have several (Vercel now recommends two
      // apex IPs), so keep the ones already correct and only touch the rest.
      const keep = existing.filter((r) => wanted.includes(norm(r.value)));
      const stale = existing.filter((r) => !wanted.includes(norm(r.value)));
      const missing = wanted.filter((v) => !existing.some((r) => norm(r.value) === v));

      if (!stale.length && !missing.length && !conflicting.length) {
        console.log(`  ok        ${want.host || "@"} ${want.type} already ${keep.map((r) => r.value).join(", ")}`);
        continue;
      }

      for (const r of [...stale, ...conflicting]) {
        if (!canDelete(r.host, r.type)) {
          console.log(`  keep      ${r.host || "@"} ${r.type} (protected, untouched)`);
          continue;
        }
        console.log(`  ${APPLY ? "delete " : "would delete"}  ${r.host || "@"} ${r.type} ${r.value}`);
        if (APPLY) await provider.remove(domain, r);
      }

      for (const v of missing) {
        console.log(`  ${APPLY ? "create " : "would create"}  ${want.host || "@"} ${want.type} ${v}`);
        if (APPLY) await provider.create(domain, want.host, want.type, v);
      }
    }

    if (APPLY) {
      const after = await provider.list(domain);
      const mailAfter = snapshotMail(after);
      if (JSON.stringify(mailBefore) !== JSON.stringify(mailAfter)) {
        console.log(`  !! FAILURE — mail records changed. Restore from the snapshot immediately.`);
        console.log(`     before: ${mailBefore.length}  after: ${mailAfter.length}`);
        failed++;
        continue;
      }
      console.log(`  verified: all ${mailAfter.length} mail records unchanged`);
    }

    ok++;
    console.log("");
  } catch (err) {
    console.log(`  ERROR — ${err.message}\n`);
    failed++;
  }
}

console.log(`\ndone: ${ok} ok, ${skipped} skipped, ${failed} failed`);
if (APPLY && ok) {
  console.log(`\nDNS is cached; allow a few minutes, then confirm with:`);
  console.log(`  node scripts/dns-plan.mjs`);
}
