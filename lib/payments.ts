import Stripe from "stripe";

export function getStripeClient() {
  const stripeSecret = process.env.STRIPE_SECRET;

  if (!stripeSecret) {
    throw new Error("STRIPE_SECRET no está definida");
  }

  return new Stripe(stripeSecret, {
    apiVersion: "2025-03-31.basil",
  });
}
