export const EARLY_BIRD_PRICE_ID = "price_1TIEduEt4aAP5ylPU5RJtO6s";
export const REGULAR_PRICE_ID = "price_1TIEdyEt4aAP5ylPN6ffwF5U";
export const EARLY_BIRD_CAPACITY = 20;

type StripeClient = {
  checkout: {
    sessions: {
      list: (params: Record<string, unknown>) => Promise<{
        data: Array<{ id: string; payment_status: string }>;
        has_more: boolean;
      }>;
      retrieve: (
        id: string,
        opts: { expand?: string[] }
      ) => Promise<{ line_items?: { data?: Array<{ price?: unknown }> } }>;
    };
  };
};

/** Stripe returns `price` as either a string id or an expanded Price object. */
export function lineItemPriceId(item: { price?: unknown }): string | undefined {
  const p = item.price;
  if (typeof p === "string") return p;
  if (p && typeof p === "object" && p !== null && "id" in p) {
    const id = (p as { id?: unknown }).id;
    return typeof id === "string" ? id : undefined;
  }
  return undefined;
}

export type EarlyBirdCountResult = {
  earlyBirdSold: number;
  truncated: boolean;
  sessionsExamined: number;
};

/**
 * Count paid Checkout sessions that include the early-bird price.
 * Paginates past the default 100-session cap so counts stay correct for busy Stripe accounts.
 */
export async function countPaidEarlyBirdSales(
  stripe: StripeClient,
  log?: (step: string, details?: Record<string, unknown>) => void
): Promise<EarlyBirdCountResult> {
  const createdGteRaw = Deno.env.get("SUMMIT_CHECKOUT_CREATED_GTE_UNIX");
  const createdGte = createdGteRaw ? parseInt(createdGteRaw, 10) : undefined;
  if (createdGteRaw && Number.isNaN(createdGte)) {
    log?.("Invalid SUMMIT_CHECKOUT_CREATED_GTE_UNIX ignored", { raw: createdGteRaw });
  }

  const maxSessions = Math.min(
    50_000,
    Math.max(100, parseInt(Deno.env.get("SUMMIT_EARLY_BIRD_MAX_SESSIONS_SCAN") ?? "10000", 10) || 10000)
  );

  let earlyBirdSold = 0;
  let sessionsExamined = 0;
  let startingAfter: string | undefined;
  let truncated = false;
  let done = false;

  while (sessionsExamined < maxSessions && !done) {
    const params: Record<string, unknown> = { limit: 100 };
    if (startingAfter) params.starting_after = startingAfter;
    if (createdGte != null && !Number.isNaN(createdGte)) {
      params.created = { gte: createdGte };
    }

    const page = await stripe.checkout.sessions.list(params);
    if (page.data.length === 0) break;

    for (const session of page.data) {
      sessionsExamined++;
      if (session.payment_status !== "paid") continue;

      try {
        const full = await stripe.checkout.sessions.retrieve(session.id, {
          expand: ["line_items"],
        });
        const hasEarly = (full.line_items?.data ?? []).some(
          (item) => lineItemPriceId(item) === EARLY_BIRD_PRICE_ID
        );
        if (hasEarly) {
          earlyBirdSold++;
          log?.("Early bird session counted", { sessionId: session.id });
          if (earlyBirdSold >= EARLY_BIRD_CAPACITY) {
            done = true;
            break;
          }
        }
      } catch (e) {
        log?.("Skip session retrieve", {
          sessionId: session.id,
          error: e instanceof Error ? e.message : String(e),
        });
      }
    }

    if (done) break;

    if (!page.has_more) break;
    startingAfter = page.data[page.data.length - 1]?.id;
    if (!startingAfter) break;
  }

  if (sessionsExamined >= maxSessions) {
    truncated = true;
    log?.("Early bird count scan stopped at maxSessions", { maxSessions, earlyBirdSold });
  }

  return { earlyBirdSold, truncated, sessionsExamined };
}
