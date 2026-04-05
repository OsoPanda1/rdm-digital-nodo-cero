import Stripe from "https://esm.sh/stripe@14.21.0?target=deno";
import { corsHeaders } from "@supabase/supabase-js/cors";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
  apiVersion: "2023-10-16",
});

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
    if (authHeader) {
      const { data: { user } } = await supabaseClient.auth.getUser(
        authHeader.replace("Bearer ", ""),
      );
      userId = user?.id ?? null;
    }

    const { type, businessId, plan } = await req.json();

    if (type === "activation") {
      // $200 MXN business activation
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "mxn",
              product_data: {
                name: "Activación de Negocio — RDM Digital",
                description: "Activa tu negocio en el directorio digital de Real del Monte",
              },
              unit_amount: 20000, // $200 MXN in centavos
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${req.headers.get("origin")}/directorio?activated=true`,
        cancel_url: `${req.headers.get("origin")}/directorio?canceled=true`,
        metadata: {
          type: "activation",
          businessId: businessId || "",
          userId: userId || "",
        },
      });

      return new Response(JSON.stringify({ url: session.url }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (type === "premium") {
      // $500 MXN/month premium subscription
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "mxn",
              product_data: {
                name: `Premium ${plan === "yearly" ? "Anual" : "Mensual"} — RDM Digital`,
                description: "Destaca tu negocio con visibilidad premium en el directorio",
              },
              unit_amount: plan === "yearly" ? 5400000 : 50000, // $500 MXN/mo or $5400/yr
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${req.headers.get("origin")}/directorio?premium=true`,
        cancel_url: `${req.headers.get("origin")}/directorio?canceled=true`,
        metadata: {
          type: "premium",
          businessId: businessId || "",
          userId: userId || "",
          plan: plan || "monthly",
        },
      });

      return new Response(JSON.stringify({ url: session.url }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (type === "donation") {
      const { amount } = await req.json().catch(() => ({ amount: 5000 }));
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "mxn",
              product_data: {
                name: "Donación — RDM Digital",
                description: "Apoya el desarrollo de la plataforma turística de Real del Monte",
              },
              unit_amount: Math.max(amount || 5000, 2000),
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${req.headers.get("origin")}/apoya?success=true`,
        cancel_url: `${req.headers.get("origin")}/apoya?canceled=true`,
        metadata: { type: "donation", userId: userId || "" },
      });

      return new Response(JSON.stringify({ url: session.url }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Invalid type" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Checkout error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
