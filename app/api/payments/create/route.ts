import { db } from "@/lib/db";
import { getStripeClient } from "@/lib/payments";

export async function POST(req: Request) {
  const { amount } = await req.json();

  if (typeof amount !== "number" || amount <= 0) {
    return Response.json({ error: "amount debe ser un número mayor a 0" }, { status: 400 });
  }

  const stripe = getStripeClient();
  const intent = await stripe.paymentIntents.create({
    amount: Math.round(amount * 100),
    currency: "mxn",
  });

  await db.paymentIntent.create({
    data: {
      amount,
      status: intent.status,
      provider: "stripe",
    },
  });

  return Response.json({ clientSecret: intent.client_secret });
}
