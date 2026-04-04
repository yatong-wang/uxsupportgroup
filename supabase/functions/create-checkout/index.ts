import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";

const EARLY_BIRD_PRICE_ID = "price_1TIEduEt4aAP5ylPU5RJtO6s";
const REGULAR_PRICE_ID = "price_1TIEdyEt4aAP5ylPN6ffwF5U";
const EARLY_BIRD_CAPACITY = 20;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CREATE-CHECKOUT] ${step}${detailsStr}`);
};

async function countEarlyBirdSold(stripe: Stripe): Promise<number> {
  const sessions = await stripe.checkout.sessions.list({ limit: 100 });
  let earlyBirdSold = 0;
  for (const s of sessions.data) {
    if (s.payment_status !== "paid") continue;
    try {
      const full = await stripe.checkout.sessions.retrieve(s.id, {
        expand: ["line_items"],
      });
      const hasEarly = full.line_items?.data?.some(
        (item: { price?: { id?: string } }) =>
          item.price?.id === EARLY_BIRD_PRICE_ID
      );
      if (hasEarly) earlyBirdSold++;
    } catch (e) {
      logStep("Early bird count skip session", {
        sessionId: s.id,
        error: e instanceof Error ? e.message : String(e),
      });
    }
  }
  return earlyBirdSold;
}

function checkoutBaseUrl(req: Request): string {
  const origin = req.headers.get("origin");
  if (origin) return origin.replace(/\/$/, "");

  const referer = req.headers.get("referer");
  if (referer) {
    try {
      const u = new URL(referer);
      return `${u.protocol}//${u.host}`;
    } catch {
      /* fall through */
    }
  }

  return "";
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const { priceId } = await req.json();

    const allowed = new Set([EARLY_BIRD_PRICE_ID, REGULAR_PRICE_ID]);
    if (!priceId || !allowed.has(priceId)) {
      throw new Error("Invalid or missing price ID");
    }

    logStep("Creating checkout session", { priceId });

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");

    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });

    const earlyBirdSold = await countEarlyBirdSold(stripe);

    if (priceId === EARLY_BIRD_PRICE_ID) {
      if (earlyBirdSold >= EARLY_BIRD_CAPACITY) {
        throw new Error("Early bird tickets are sold out");
      }
    }

    if (priceId === REGULAR_PRICE_ID) {
      if (earlyBirdSold < EARLY_BIRD_CAPACITY) {
        throw new Error("Regular tickets are available after early bird sells out");
      }
    }

    const base = checkoutBaseUrl(req);
    if (!base) {
      throw new Error("Could not determine site URL for checkout redirect");
    }

    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "payment",
      metadata: {
        price_id: priceId,
        ticket_type: priceId === EARLY_BIRD_PRICE_ID ? "early_bird" : "regular",
      },
      success_url: `${base}/summit?checkout=success`,
      cancel_url: `${base}/summit?checkout=canceled`,
    });

    logStep("Checkout session created", { sessionId: session.id, url: session.url });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in create-checkout", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
