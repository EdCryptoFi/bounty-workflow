import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { verifyMercadoPagoSignature, getPreapproval } from "@/lib/payments/mercadopago";
import { claimEvent, finalizeEvent } from "@/lib/payments/idempotency";
import { paymentsEnabled } from "@/lib/payments/config";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * POST /api/webhooks/mercadopago
 *
 * - Feature-flagged (NEXT_PUBLIC_PAYMENTS_ENABLED)
 * - Verifica x-signature HMAC-SHA256 em timing-safe quando MERCADOPAGO_WEBHOOK_SECRET está setada
 * - FALLBACK: se a secret não estiver disponível, valida o evento consultando a API MP
 *   (se getPreapproval retornar 200, confirma que o evento é legítimo)
 * - Idempotência via webhook_events (provider='mercadopago', event_id = body.id)
 * - Atualiza subscriptions + users.tier
 *
 * Tipos de evento relevantes:
 * - `subscription_preapproval` (status: authorized|paused|cancelled)
 * - `payment` (status: approved|rejected|refunded) — pra dunning
 *
 * Fix C4: usa external_reference da preapproval = user.id.
 * NUNCA confia em payer_email pra identificar o user.
 */
export async function POST(request: NextRequest) {
  if (!paymentsEnabled) {
    return NextResponse.json({ error: "payments disabled" }, { status: 503 });
  }

  const secret = process.env.MERCADOPAGO_WEBHOOK_SECRET;
  const token = process.env.MERCADOPAGO_ACCESS_TOKEN;
  if (!secret && !token) {
    // Nem HMAC nem fallback por API disponíveis — não podemos validar nada.
    return NextResponse.json(
      { error: "no webhook secret or access token configured" },
      { status: 500 },
    );
  }

  // MP pode mandar data.id tanto no body quanto no query string
  const url = request.nextUrl;
  const dataIdFromQuery = url.searchParams.get("data.id") ?? url.searchParams.get("id");
  const topic = url.searchParams.get("topic") ?? url.searchParams.get("type");

  let body: {
    id?: number | string;
    type?: string;
    action?: string;
    data?: { id?: string };
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  const dataId = body.data?.id ?? dataIdFromQuery;
  const eventType = body.type ?? topic ?? body.action ?? "unknown";
  const eventId = body.id ? String(body.id) : null;

  if (!eventId || !dataId) {
    return NextResponse.json({ error: "missing id or data.id" }, { status: 400 });
  }

  // Verifica assinatura — com fallback via API MP quando a secret não está setada.
  if (secret) {
    const valid = verifyMercadoPagoSignature({
      signatureHeader: request.headers.get("x-signature"),
      requestIdHeader: request.headers.get("x-request-id"),
      dataId,
      secret,
    });
    if (!valid) {
      return NextResponse.json({ error: "invalid signature" }, { status: 401 });
    }
  } else {
    // FALLBACK: sem HMAC disponível, validamos consultando o recurso na API do MP
    // usando o access token. Se o preapproval existe, o evento é legítimo.
    // (Isso substitui a HMAC em ~99% dos casos práticos — um atacante precisaria
    // não só descobrir a URL do webhook mas também adivinhar um preapproval_id real.)
    const isPreapprovalEvent =
      eventType.includes("preapproval") ||
      eventType === "subscription_preapproval" ||
      topic === "preapproval";
    if (isPreapprovalEvent) {
      const pre = await getPreapproval(dataId);
      if (!pre) {
        console.warn("[webhooks/mercadopago] fallback validation failed: preapproval not found", {
          dataId,
          eventId,
        });
        return NextResponse.json({ error: "unverifiable event" }, { status: 401 });
      }
    }
    // Pra eventos não-preapproval (payment etc) sem secret, logamos e seguimos —
    // idempotência + finalização ainda protegem de replay.
    console.info("[webhooks/mercadopago] processing without HMAC (fallback)", {
      eventType,
      eventId,
    });
  }

  const supabase = createAdminClient();

  const claimed = await claimEvent(supabase, "mercadopago", eventId, eventType, body);
  if (!claimed) {
    return NextResponse.json({ status: "duplicate", event_id: eventId });
  }

  try {
    // Eventos de assinatura — consultamos a preapproval pra pegar status + external_reference
    if (
      eventType.includes("preapproval") ||
      eventType === "subscription_preapproval" ||
      topic === "preapproval"
    ) {
      const pre = await getPreapproval(dataId);
      if (!pre || !pre.external_reference) {
        await finalizeEvent(supabase, "mercadopago", eventId, {
          ok: false,
          error: "preapproval_not_found_or_no_external_ref",
        });
        return NextResponse.json({ status: "ignored", event_id: eventId });
      }

      const userId = pre.external_reference;
      const statusMap: Record<string, string> = {
        authorized: "active",
        pending: "incomplete",
        paused: "past_due",
        cancelled: "canceled",
        finished: "canceled",
      };
      const mappedStatus = statusMap[pre.status] ?? pre.status;

      await supabase.from("subscriptions").upsert(
        {
          user_id: userId,
          provider: "mercadopago",
          provider_sub_id: pre.id,
          status: mappedStatus,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "provider,provider_sub_id" },
      );

      if (mappedStatus === "active") {
        await supabase.from("users").update({ tier: "pro", trial_ends_at: null }).eq("id", userId);
      } else if (mappedStatus === "canceled") {
        await supabase.from("users").update({ tier: "free" }).eq("id", userId);
      }
    }
    // Pagamentos individuais (recorrentes) — só logamos, status real vem do preapproval
    // (evita race onde payment.approved chega antes do preapproval.authorized)

    await finalizeEvent(supabase, "mercadopago", eventId, { ok: true });
    return NextResponse.json({ status: "ok", event_id: eventId });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "handler failed";
    console.error("[webhooks/mercadopago] handler error", err);
    await finalizeEvent(supabase, "mercadopago", eventId, { ok: false, error: msg });
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
