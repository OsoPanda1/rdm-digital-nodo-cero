import { NextResponse, type NextRequest } from "next/server"
import { stripe } from "@/lib/stripe"
import { createClient } from "@supabase/supabase-js"

export const runtime = "nodejs"

// Service role client for webhook (bypasses RLS — only used here, never client-side)
function adminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_ANON_KEY!,
    { auth: { persistSession: false } },
  )
}

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get("stripe-signature")
  const secret = process.env.STRIPE_WEBHOOK_SECRET

  let event
  try {
    if (secret && sig) {
      event = stripe.webhooks.constructEvent(body, sig, secret)
    } else {
      event = JSON.parse(body)
    }
  } catch (err) {
    return NextResponse.json({ error: `Webhook Error: ${err instanceof Error ? err.message : "?"}` }, { status: 400 })
  }

  const supabase = adminClient()

  if (event.type === "checkout.session.completed" || event.type === "checkout.session.async_payment_succeeded") {
    const session = event.data.object as any
    await supabase
      .from("transactions")
      .update({
        status: "paid",
        stripe_payment_intent: session.payment_intent ?? null,
        metadata: { ...(session.metadata ?? {}), email: session.customer_details?.email ?? null },
      })
      .eq("stripe_session_id", session.id)

    // Credit wallet for authenticated users
    const userId = session.metadata?.user_id
    if (userId && userId !== "anonymous") {
      const credits = Math.round((session.amount_total ?? 0) / 100) // 1 credit per peso
      await supabase.rpc("increment_wallet", { p_user: userId, p_credits: credits }).then(
        () => null,
        async () => {
          // Fallback: read-update
          const { data: w } = await supabase.from("wallets").select("*").eq("user_id", userId).single()
          if (w) {
            await supabase
              .from("wallets")
              .update({
                balance_tamv_credits: (w.balance_tamv_credits ?? 0) + credits,
                updated_at: new Date().toISOString(),
              })
              .eq("user_id", userId)
          }
        },
      )
    }

    await supabase.from("audit_log").insert({
      action: "stripe.checkout.completed",
      entity_type: "transaction",
      entity_id: session.id,
      payload: { amount: session.amount_total, currency: session.currency, metadata: session.metadata },
    })
  }

  return NextResponse.json({ received: true })
}
