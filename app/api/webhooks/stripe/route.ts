import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const body = await req.text();

  const forwarded = await fetch(new URL("/api/stripe/webhook", req.url), {
    method: "POST",
    headers: {
      "content-type": req.headers.get("content-type") ?? "application/json",
      "stripe-signature": req.headers.get("stripe-signature") ?? "",
    },
    body,
  });

  const responseText = await forwarded.text();
  return new NextResponse(responseText, { status: forwarded.status });
}
