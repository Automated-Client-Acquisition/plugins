#!/usr/bin/env node
/**
 * Reads live DNS for every configured domain and prints exactly what has to
 * change to point the website at Vercel — and, critically, what must NOT change.
 *
 *   node scripts/dns-plan.mjs
 *   node scripts/dns-plan.mjs --json
 *
 * Mail records (MX, SPF, DKIM, DMARC) are reported read-only. This script never
 * writes anything. Apply changes with dns-apply.mjs, or by hand at the registrar.
 */

import { promises as dns } from "node:dns";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const HERE = dirname(fileURLToPath(import.meta.url));

// Vercel's published targets. Verify against your project's Domains tab before
// applying — Vercel occasionally issues a project-specific CNAME target.
const VERCEL_A = "76.76.21.21";
const VERCEL_CNAME = "cname.vercel-dns.com";

/** Pull the domain list straight out of lib/brands.ts so the two never drift. */
function domainsFromBrands() {
  const src = readFileSync(join(HERE, "..", "lib", "brands.ts"), "utf8");
  return [...src.matchAll(/^\s*domain:\s*"([^"]+)"/gm)].map((m) => m[1]);
}

const NS_PROVIDER = [
  [/porkbun\.com$/, "Porkbun"],
  [/cloudflare\.com$/, "Cloudflare"],
  [/topdns\.com$/, "Internet.bs / TopDNS"],
  [/vercel-dns\.com$/, "Vercel DNS"],
];

function providerFor(nsList) {
  const first = (nsList[0] ?? "").toLowerCase();
  for (const [re, name] of NS_PROVIDER) if (re.test(first)) return name;
  return first || "unknown";
}

async function safe(fn, fallback = []) {
  try {
    return await fn();
  } catch {
    return fallback;
  }
}

async function inspect(domain) {
  const [ns, a, wwwCname, wwwA, mx, txt, dmarc] = await Promise.all([
    safe(() => dns.resolveNs(domain)),
    safe(() => dns.resolve4(domain)),
    safe(() => dns.resolveCname(`www.${domain}`)),
    safe(() => dns.resolve4(`www.${domain}`)),
    safe(() => dns.resolveMx(domain)),
    safe(() => dns.resolveTxt(domain)),
    safe(() => dns.resolveTxt(`_dmarc.${domain}`)),
  ]);

  const spf = txt.flat().find((t) => t.toLowerCase().startsWith("v=spf1")) ?? null;

  const apexOk = a.includes(VERCEL_A);
  const wwwOk = wwwCname.some((c) => c.toLowerCase().includes("vercel-dns.com"));

  const actions = [];
  if (!apexOk) {
    actions.push({
      host: "@",
      type: "A",
      value: VERCEL_A,
      note: a.length ? `replaces existing A ${a.join(", ")}` : "no A record today",
    });
  }
  if (!wwwOk) {
    actions.push({
      host: "www",
      type: "CNAME",
      value: VERCEL_CNAME,
      note: wwwCname.length ? `replaces CNAME ${wwwCname.join(", ")}` : wwwA.length ? `replaces A ${wwwA.join(", ")}` : "no www record today",
    });
  }

  return {
    domain,
    provider: providerFor(ns),
    nameservers: ns,
    current: { apexA: a, wwwCname, wwwA },
    mail: {
      mx: mx.map((m) => `${m.priority} ${m.exchange}`),
      spf,
      dmarc: dmarc.flat()[0] ?? null,
    },
    actions,
    alreadyOnVercel: actions.length === 0,
  };
}

const domains = domainsFromBrands();
const results = await Promise.all(domains.map(inspect));

if (process.argv.includes("--json")) {
  console.log(JSON.stringify(results, null, 2));
} else {
  const byProvider = {};
  for (const r of results) (byProvider[r.provider] ??= []).push(r);

  console.log(`\nDNS plan for ${results.length} domains → Vercel\n`);

  for (const [provider, rows] of Object.entries(byProvider)) {
    console.log(`\n── ${provider} (${rows.length}) ${"─".repeat(Math.max(0, 46 - provider.length))}`);
    for (const r of rows) {
      const status = r.alreadyOnVercel ? "already on Vercel" : `${r.actions.length} change(s)`;
      console.log(`\n  ${r.domain}  [${status}]`);
      for (const a of r.actions) {
        console.log(`    SET  ${a.host.padEnd(4)} ${a.type.padEnd(5)} ${a.value}   (${a.note})`);
      }
      const mailBits = [
        r.mail.mx.length ? `MX ${r.mail.mx[0]}` : "MX MISSING",
        r.mail.spf ? "SPF present" : "SPF MISSING",
        r.mail.dmarc ? "DMARC present" : "DMARC missing",
      ];
      console.log(`    KEEP untouched: ${mailBits.join(" · ")}`);
    }
  }

  const missingMail = results.filter((r) => !r.mail.mx.length || !r.mail.spf);
  if (missingMail.length) {
    console.log(`\n!! ${missingMail.length} domain(s) are missing MX or SPF — check these before touching anything:`);
    for (const r of missingMail) console.log(`   ${r.domain}`);
  }

  const todo = results.filter((r) => !r.alreadyOnVercel).length;
  console.log(`\n${todo} of ${results.length} domains still need website records.\n`);
}
