import { NextResponse, type NextRequest } from "next/server";
import type Stripe from "stripe";

import { db } from "@/lib/db";
import { getStripeClient } from "@/lib/payments";

export const runtime = "nodejs";

function parseEvent(body: string, signature: string | null): Stripe.Event {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;

  if (secret && signature) {
    return getStripeClient().webhooks.constructEvent(body, signature, secret);
  }

  return JSON.parse(body) as Stripe.Event;
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  let event: Stripe.Event;
  try {
    event = parseEvent(body, signature);
  } catch (error) {
    return NextResponse.json(
      { error: `Webhook Error: ${error instanceof Error ? error.message : "invalid payload"}` },
      { status: 400 },
    );
  }

  if (event.type === "payment_intent.succeeded") {
    const intent = event.data.object as Stripe.PaymentIntent;
    const amount = (intent.amount_received || intent.amount || 0) / 100;

    await db.paymentIntent.create({
      data: {
        amount,
        status: intent.status,
        provider: "stripe",
      },
    });

    const userId = intent.metadata?.userId;
    if (userId) {
      await db.wallet.updateMany({ where: { userId }, data: { balance: { increment: amount } } });
      await db.transaction.create({ data: { userId, amount, type: "payment_credit" } });
    }
  }

  return NextResponse.json({ received: true });
}
