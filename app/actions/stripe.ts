"use server"

import { stripe } from "@/lib/stripe"
import { findTribute } from "@/lib/products"
import { createClient } from "@/lib/supabase/server"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

export async function createCheckoutSession(productId: string): Promise<{ url: string | null; error?: string }> {
  const tribute = findTribute(productId)
  if (!tribute) return { url: null, error: "Tributo no encontrado en el catálogo federado." }

  const h = await headers()
  const host = h.get("host") ?? "localhost"
  const proto = h.get("x-forwarded-proto") ?? "https"
  const origin = `${proto}://${host}`

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: tribute.currency.toLowerCase(),
            product_data: {
              name: tribute.name,
              description: `${tribute.federation} · RDM Digital · Nodo Cero`,
            },
            unit_amount: tribute.priceInCents,
          },
          quantity: 1,
        },
      ],
      metadata: {
        product_id: tribute.id,
        federation: tribute.federation,
        user_id: user?.id ?? "anonymous",
      },
      success_url: `${origin}/mercado/recibo?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/mercado`,
    })

    await supabase.from("transactions").insert({
      user_id: user?.id ?? null,
      stripe_session_id: session.id,
      amount_cents: tribute.priceInCents,
      currency: tribute.currency.toLowerCase(),
      status: "pending",
      type: "tribute",
      metadata: { product_id: tribute.id, federation: tribute.federation },
    })

    return { url: session.url }
  } catch (e) {
    return { url: null, error: e instanceof Error ? e.message : "Stripe error" }
  }
}

export async function startCheckout(formData: FormData) {
  const productId = String(formData.get("productId"))
  const result = await createCheckoutSession(productId)
  if (result.url) redirect(result.url)
}
