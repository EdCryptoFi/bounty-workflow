/**
 * Mercado Pago — cliente HTTP + verificação de webhook.
 *
 * Usa a API de Preapproval (assinatura recorrente autorizada uma vez).
 * Doc: https://www.mercadopago.com.br/developers/pt/reference/subscriptions/_preapproval/post
 *
 * Webhooks: validação via header `x-signature` (HMAC-SHA256).
 * Doc: https://www.mercadopago.com.br/developers/pt/docs/your-integrations/notifications/webhooks
 *
 * Fix C4: externalReference = user.id. Nunca identificar usuário por email.
 */
import crypto from "node:crypto";

const API_BASE = "https://api.mercadopago.com";

export type MpPreapproval = {
  id: string;
  status: string;
  init_point: string;
  external_reference?: string;
};

/**
 * Cria uma assinatura recorrente (preapproval) com plano livre.
 * Retorna `init_point` que é a URL pro checkout que o usuário acessa.
 */
export async function createPreapproval(input: {
  userId: string;
  userEmail: string;
  amountBrl: number;
  reason: string;
  frequency: "monthly" | "yearly";
  backUrl: string;
}): Promise<{ ok: true; url: string; id: string } | { ok: false; error: string }> {
  const token = process.env.MERCADOPAGO_ACCESS_TOKEN;
  if (!token) return { ok: false, error: "MERCADOPAGO_ACCESS_TOKEN não configurado" };

  const freqType = input.frequency === "yearly" ? "years" : "months";

  const body = {
    reason: input.reason,
    external_reference: input.userId, // fix C4
    payer_email: input.userEmail,
    back_url: input.backUrl,
    auto_recurring: {
      frequency: 1,
      frequency_type: freqType,
      transaction_amount: input.amountBrl,
      currency_id: "BRL",
    },
    status: "pending",
  };

  const res = await fetch(`${API_BASE}/preapproval`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "X-Idempotency-Key": crypto.randomUUID(),
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const txt = await res.text();
    return { ok: false, error: `MP HTTP ${res.status}: ${txt.slice(0, 200)}` };
  }

  const data = (await res.json()) as MpPreapproval;
  return { ok: true, url: data.init_point, id: data.id };
}

/**
 * Consulta uma preapproval (usado pelo webhook pra pegar status + externalReference).
 */
export async function getPreapproval(id: string): Promise<MpPreapproval | null> {
  const token = process.env.MERCADOPAGO_ACCESS_TOKEN;
  if (!token) return null;

  const res = await fetch(`${API_BASE}/preapproval/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return null;
  return (await res.json()) as MpPreapproval;
}

/**
 * Verifica x-signature do webhook Mercado Pago.
 *
 * Formato da assinatura:
 *   `ts=<unix>,v1=<hmac>`
 *
 * Manifesto (o que é assinado):
 *   `id:<data.id>;request-id:<x-request-id>;ts:<ts>;`
 *
 * Onde:
 * - `data.id` = query param `data.id` da URL do webhook (ou body.data.id)
 * - `x-request-id` = header `x-request-id`
 * - `ts` = timestamp extraído da própria x-signature
 *
 * HMAC-SHA256 da manifesto com MERCADOPAGO_WEBHOOK_SECRET.
 *
 * Doc: https://www.mercadopago.com.br/developers/pt/docs/your-integrations/notifications/webhooks#editor_3
 */
export function verifyMercadoPagoSignature(input: {
  signatureHeader: string | null;
  requestIdHeader: string | null;
  dataId: string | null;
  secret: string;
  toleranceSeconds?: number;
}): boolean {
  const { signatureHeader, requestIdHeader, dataId, secret } = input;
  const tolerance = input.toleranceSeconds ?? 300;
  if (!signatureHeader || !requestIdHeader || !dataId) return false;

  // Parse ts=...,v1=...
  const parts = signatureHeader.split(",").map((s) => s.trim());
  const map: Record<string, string> = {};
  for (const p of parts) {
    const [k, v] = p.split("=", 2);
    if (k && v) map[k] = v;
  }
  const ts = map.ts;
  const v1 = map.v1;
  if (!ts || !v1) return false;

  // Anti-replay
  const tsNum = parseInt(ts, 10);
  if (!Number.isFinite(tsNum)) return false;
  // Mercado Pago manda ts em milliseconds
  const tsSec = tsNum > 1e12 ? Math.floor(tsNum / 1000) : tsNum;
  const now = Math.floor(Date.now() / 1000);
  if (Math.abs(now - tsSec) > tolerance) return false;

  const manifest = `id:${dataId};request-id:${requestIdHeader};ts:${ts};`;
  const expected = crypto
    .createHmac("sha256", secret)
    .update(manifest)
    .digest("hex");

  try {
    return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(v1));
  } catch {
    return false;
  }
}
