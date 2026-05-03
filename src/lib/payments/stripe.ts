/**
 * Stripe — cliente lazy + helpers de verificação de webhook.
 * Não importa o SDK top-level pra não quebrar build quando as chaves
 * não estão setadas (feature flag off).
 *
 * Usa crypto nativo pra verificar a assinatura Stripe-Signature
 * sem precisar do SDK (Stripe.webhooks.constructEvent).
 */
import crypto from "node:crypto";

export type StripeEvent = {
  id: string;
  type: string;
  data: {
    object: Record<string, unknown>;
  };
  livemode: boolean;
};

/**
 * Verifica Stripe-Signature header.
 * Algoritmo: HMAC-SHA256(timestamp + "." + payload) = v1.
 * Rejeita se timestamp > 5 min (replay).
 *
 * Retorna o event parseado, ou null se inválido.
 */
export function verifyStripeSignature(
  rawBody: string,
  header: string | null,
  secret: string,
  toleranceSeconds = 300,
): StripeEvent | null {
  if (!header) return null;

  const parts = header.split(",");
  const map = new Map<string, string>();
  for (const p of parts) {
    const [k, v] = p.split("=", 2);
    if (k && v) {
      const arr = map.get(k);
      map.set(k, arr ? `${arr},${v}` : v);
    }
  }

  const timestamp = map.get("t");
  const signatures = map.get("v1")?.split(",") ?? [];
  if (!timestamp || signatures.length === 0) return null;

  const signedPayload = `${timestamp}.${rawBody}`;
  const expected = crypto
    .createHmac("sha256", secret)
    .update(signedPayload)
    .digest("hex");

  const valid = signatures.some((s) => {
    try {
      return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(s));
    } catch {
      return false;
    }
  });
  if (!valid) return null;

  // Verifica tolerância (anti-replay)
  const ts = parseInt(timestamp, 10);
  if (!Number.isFinite(ts)) return null;
  const now = Math.floor(Date.now() / 1000);
  if (Math.abs(now - ts) > toleranceSeconds) return null;

  try {
    return JSON.parse(rawBody) as StripeEvent;
  } catch {
    return null;
  }
}

/**
 * Cria uma sessão de Checkout do Stripe via API HTTP direto.
 * client_reference_id = user.id (fix C4 — previne hijack via replay).
 */
export async function createCheckoutSession(input: {
  userId: string;
  userEmail: string;
  priceId: string;
  successUrl: string;
  cancelUrl: string;
}): Promise<{ ok: true; url: string; id: string } | { ok: false; error: string }> {
  const apiKey = process.env.STRIPE_SECRET_KEY;
  if (!apiKey) return { ok: false, error: "STRIPE_SECRET_KEY não configurado" };

  const body = new URLSearchParams();
  body.append("mode", "subscription");
  body.append("line_items[0][price]", input.priceId);
  body.append("line_items[0][quantity]", "1");
  body.append("success_url", input.successUrl);
  body.append("cancel_url", input.cancelUrl);
  body.append("client_reference_id", input.userId); // C4 fix
  body.append("customer_email", input.userEmail);
  body.append("metadata[user_id]", input.userId);
  body.append("subscription_data[metadata][user_id]", input.userId);

  const res = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: body.toString(),
  });

  if (!res.ok) {
    const txt = await res.text();
    return { ok: false, error: `Stripe HTTP ${res.status}: ${txt.slice(0, 200)}` };
  }
  const data = (await res.json()) as { id: string; url: string };
  return { ok: true, url: data.url, id: data.id };
}
