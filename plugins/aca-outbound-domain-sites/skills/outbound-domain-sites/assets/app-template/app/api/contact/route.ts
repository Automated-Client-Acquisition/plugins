import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { brandForHost } from "@/lib/brands";

/**
 * Server-side proxy to the `submit-site-lead` edge function.
 *
 * The shared secret lives here and never reaches the browser. The brand is
 * re-derived from the request Host rather than trusted from the body, so a
 * scripted POST cannot attribute itself to a domain it did not come from.
 */

const EDGE_URL = process.env.SUPABASE_FUNCTIONS_URL
  ? `${process.env.SUPABASE_FUNCTIONS_URL}/submit-site-lead`
  : undefined;
const SHARED_SECRET = process.env.SITE_LEAD_SHARED_SECRET;

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  // Honeypot first, before any other branch: a bot must always see a plain
  // success so it stops retrying, including while the form is unconfigured.
  if (typeof body.company_url === "string" && body.company_url.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  if (!EDGE_URL || !SHARED_SECRET) {
    console.error("contact route: SUPABASE_FUNCTIONS_URL or SITE_LEAD_SHARED_SECRET is unset");
    return NextResponse.json({ error: "Contact form is not configured yet." }, { status: 503 });
  }

  const brand = brandForHost((await headers()).get("host"));

  try {
    const res = await fetch(EDGE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-site-secret": SHARED_SECRET },
      body: JSON.stringify({
        name: body.name,
        email: body.email,
        phone: body.phone,
        company: body.company,
        website: body.website,
        message: body.message,
        // Only forwarded when the visitor actually used the calculator.
        quote:
          body.meetings || body.ltv
            ? {
                meetings: body.meetings,
                budget: body.budget,
                ltv: body.ltv,
                closeRate: body.close,
              }
            : undefined,
        brandDomain: brand.domain,
        brandName: brand.name,
      }),
    });
    const out = await res.json().catch(() => ({}));
    if (!res.ok) {
      return NextResponse.json({ error: out.error ?? "Could not send your enquiry." }, { status: res.status });
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("contact route: upstream failed", err);
    return NextResponse.json({ error: "Could not send your enquiry. Please email us directly." }, { status: 502 });
  }
}
