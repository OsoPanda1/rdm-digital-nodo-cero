import Stripe from "stripe"

const STRIPE_API_VERSION = "2026-04-22.dahlia" as const

function resolveStripeSecret() {
  const secret = process.env.STRIPE_SECRET ?? process.env.STRIPE_SECRET_KEY

  if (!secret) {
    throw new Error("Falta STRIPE_SECRET (o STRIPE_SECRET_KEY) en variables de entorno")
  }

  return secret
}

export function getStripeClient() {
  return new Stripe(resolveStripeSecret(), {
    apiVersion: STRIPE_API_VERSION,
  })
}
