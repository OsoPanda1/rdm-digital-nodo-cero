import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const ACTIVATION_PRICE = "price_1TJ8Ol2c9MT9LcDvVSezxcQC";
const PREMIUM_PRICE = "price_1TJ8PY2c9MT9LcDvxkkyURRp";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
    );

    const authHeader = req.headers.get("Authorization");
    let userId: string | null = null;
    let userEmail: string | undefined;
    if (authHeader) {
      const { data: { user } } = await supabaseClient.auth.getUser(
        authHeader.replace("Bearer ", ""),
      );
      userId = user?.id ?? null;
      userEmail = user?.email ?? undefined;
    }

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
      apiVersion: "2025-08-27.basil",
    });

    const body = await req.json();
    const { type, businessId, plan, amount } = body;
    const origin = req.headers.get("origin") || "https://id-preview--334b3a44-e78c-4534-bb41-e34e0d4da117.lovable.app";

    let customerId: string | undefined;
    if (userEmail) {
      const customers = await stripe.customers.list({ email: userEmail, limit: 1 });
      if (customers.data.length > 0) customerId = customers.data[0].id;
    }

    if (type === "activation") {
      const session = await stripe.checkout.sessions.create({
        customer: customerId,
        customer_email: customerId ? undefined : userEmail,
        line_items: [{ price: ACTIVATION_PRICE, quantity: 1 }],
        mode: "payment",
        success_url: `${origin}/directorio?activated=true`,
        cancel_url: `${origin}/directorio?canceled=true`,
        metadata: { type: "activation", businessId: businessId || "", userId: userId || "" },
      });
      return new Response(JSON.stringify({ url: session.url }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (type === "premium") {
      const session = await stripe.checkout.sessions.create({
        customer: customerId,
        customer_email: customerId ? undefined : userEmail,
        line_items: [{ price: PREMIUM_PRICE, quantity: 1 }],
        mode: "subscription",
        success_url: `${origin}/directorio?premium=true`,
        cancel_url: `${origin}/directorio?canceled=true`,
        metadata: { type: "premium", businessId: businessId || "", userId: userId || "", plan: plan || "monthly" },
      });
      return new Response(JSON.stringify({ url: session.url }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (type === "donation") {
      const donationAmount = Math.max(amount || 5000, 2000);
      const session = await stripe.checkout.sessions.create({
        line_items: [{
          price_data: {
            currency: "mxn",
            product_data: { name: "Donación — RDM Digital", description: "Apoya la plataforma turística de Real del Monte" },
            unit_amount: donationAmount,
          },
          quantity: 1,
        }],
        mode: "payment",
        success_url: `${origin}/apoya?success=true`,
        cancel_url: `${origin}/apoya?canceled=true`,
        metadata: { type: "donation", userId: userId || "" },
      });
      return new Response(JSON.stringify({ url: session.url }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Invalid type" }), {
      status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Checkout error:", error);
    const message = error instanceof Error ? error.message : "Checkout handler failed";
    return new Response(JSON.stringify({ error: message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
