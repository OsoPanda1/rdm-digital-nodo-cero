import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
  apiVersion: "2025-08-27.basil",
});

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const body = await req.text();
    const sig = req.headers.get("stripe-signature");
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");

    let event: Stripe.Event;

    if (webhookSecret && sig) {
      try {
        event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
      } catch (err) {
        console.error("Webhook signature failed:", err);
        return new Response(`Webhook Error: ${err}`, { status: 400 });
      }
    } else {
      event = JSON.parse(body) as Stripe.Event;
    }

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const metadata = session.metadata || {};
      const businessId = metadata.businessId;
      const type = metadata.type;

      console.log(`[WEBHOOK] checkout.session.completed type=${type} businessId=${businessId}`);

      if (businessId && type === "activation") {
        const { error } = await supabaseAdmin
          .from("businesses")
          .update({ status: "active" })
          .eq("id", businessId);
        if (error) console.error("Failed to activate business:", error);
        else console.log(`Business ${businessId} activated`);
      }

      if (businessId && type === "premium") {
        const { error } = await supabaseAdmin
          .from("businesses")
          .update({ is_premium: true, is_featured: true, status: "active" })
          .eq("id", businessId);
        if (error) console.error("Failed to set premium:", error);
        else console.log(`Business ${businessId} set to premium`);
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Webhook error:", error);
    return new Response(JSON.stringify({ error: "Webhook handler failed" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});