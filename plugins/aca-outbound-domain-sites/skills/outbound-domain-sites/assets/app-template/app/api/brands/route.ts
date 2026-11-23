import { NextResponse } from "next/server";
import { auditBrands } from "@/lib/audit";

/** Development-only differentiation audit. Never exposed in production. */
export async function GET() {
  if (process.env.NODE_ENV === "production") {
    return new NextResponse("Not found", { status: 404 });
  }
  return NextResponse.json(auditBrands());
}
