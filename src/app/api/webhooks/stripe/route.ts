import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { verifyStripeSignature } from "@/lib/payments/stripe";
import { claimEvent, finalizeEvent } from "@/lib/payments/idempotency";
import { paymentsEnabled } from "@/lib/payments/config";
import { log } from "@/lib/logger";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * POST /api/webhooks/stripe
 * - Feature-flagged: retorna 503 se NEXT_PUBLIC_PAYMENTS_ENABLED !== "true"
 * - Verifica assinatura HMAC Stripe-Signature (anti-forge)
 * - Idempotência via webhook_events (unique em provider+provider_event_id)
 * - Atualiza subscriptions + users.tier/trial_ends_at
 *
 * Fix C4: usa client_reference_id (gravado no Checkout) + metadata.user_id
 * pra mapear customer → user.id. NUNCA confia em customer_email pra hijack.
 */
export async function POST(request: NextRequest) {
  if (!paymentsEnabled) {
    return NextResponse.json({ error: "payments disabled" }, { status: 503 });
  }

  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "webhook secret missing" }, { status: 500 });
  }

  const rawBody = await request.text();
  const sig = request.headers.get("stripe-signature");

  const event = verifyStripeSignature(rawBody, sig, secret);
  if (!event) {
    return NextResponse.json({ error: "invalid signature" }, { status: 400 });
  }

  const supabase = createAdminClient();

  // Claim (insert). Se já existe, retorna duplicate.
  const claimed = await claimEvent(supabase, "stripe", event.id, event.type, {
    type: event.type,
    livemode: event.livemode,
    data: event.data,
  });
  if (!claimed) {
    return NextResponse.json({ status: "duplicate", event_id: event.id });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as {
          client_reference_id?: string;
          customer?: string;
          subscription?: string;
          metadata?: { user_id?: string };
        };
        const userId = session.client_reference_id ?? session.metadata?.user_id;
        if (!userId || !session.subscription) break;

        await supabase.from("subscriptions").upsert(
          {
            user_id: userId,
            provider: "stripe",
            provider_customer_id: session.customer ?? null,
            provider_sub_id: session.subscription,
            status: "active",
            updated_at: new Date().toISOString(),
          },
          { onConflict: "provider,provider_sub_id" },
        );
        await supabase
          .from("users")
          .update({ tier: "pro", trial_ends_at: null })
          .eq("id", userId);
        break;
      }
      case "customer.subscription.updated":
      case "customer.subscription.created": {
        const sub = event.data.object as {
          id: string;
          customer: string;
          status: string;
          current_period_end: number;
          cancel_at_period_end?: boolean;
          metadata?: { user_id?: string };
        };
        const userId = sub.metadata?.user_id;
        if (!userId) break;
        await supabase.from("subscriptions").upsert(
          {
            user_id: userId,
            provider: "stripe",
            provider_customer_id: sub.customer,
            provider_sub_id: sub.id,
            status: sub.status,
            current_period_end: new Date(sub.current_period_end * 1000).toISOString(),
            cancel_at_period_end: sub.cancel_at_period_end ?? false,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "provider,provider_sub_id" },
        );
        if (sub.status === "active" || sub.status === "trialing") {
          await supabase.from("users").update({ tier: "pro" }).eq("id", userId);
        }
        break;
      }
      case "customer.subscription.deleted": {
        const sub = event.data.object as {
          id: string;
          metadata?: { user_id?: string };
        };
        await supabase
          .from("subscriptions")
          .update({ status: "canceled", updated_at: new Date().toISOString() })
          .eq("provider", "stripe")
          .eq("provider_sub_id", sub.id);
        if (sub.metadata?.user_id) {
          await supabase.from("users").update({ tier: "free" }).eq("id", sub.metadata.user_id);
        }
        break;
      }
      case "invoice.payment_failed": {
        const inv = event.data.object as { subscription?: string };
        if (!inv.subscription) break;
        await supabase
          .from("subscriptions")
          .update({ status: "past_due", updated_at: new Date().toISOString() })
          .eq("provider", "stripe")
          .eq("provider_sub_id", inv.subscription);
        break;
      }
      default:
        break;
    }

    await finalizeEvent(supabase, "stripe", event.id, { ok: true });
    return NextResponse.json({ status: "ok", event_id: event.id });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "handler failed";
    log.error("[webhooks/stripe] handler error", err, { eventId: event.id });
    await finalizeEvent(supabase, "stripe", event.id, { ok: false, error: msg });
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
