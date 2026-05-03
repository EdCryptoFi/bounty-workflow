/**
 * Config central de pagamentos.
 * Controla se o fluxo está habilitado e qual provider usar.
 *
 * Enquanto `paymentsEnabled` for false (default), as UIs de billing
 * mostram "em breve" e os webhooks retornam 503. Assim podemos deployar
 * sem as chaves do Mercado Pago/Stripe e ligar depois mudando as envs.
 */
import { paymentsEnabled } from "@/lib/env";

export type Provider = "stripe" | "mercadopago";

export function getActiveProvider(): Provider | null {
  if (!paymentsEnabled) return null;

  // Prefere Mercado Pago pra mercado BR (PIX + cartão + boleto).
  // Stripe fica como fallback pra internacional.
  //
  // MERCADOPAGO_WEBHOOK_SECRET é *recomendada* (valida HMAC), mas opcional:
  // quando ausente, o handler faz fallback validando cada evento via API MP
  // (getPreapproval com access token). Segurança prática equivalente em ~99%
  // dos casos — ver src/app/api/webhooks/mercadopago/route.ts.
  if (process.env.MERCADOPAGO_ACCESS_TOKEN) {
    return "mercadopago";
  }
  if (process.env.STRIPE_SECRET_KEY && process.env.STRIPE_WEBHOOK_SECRET) {
    return "stripe";
  }
  return null;
}

export { paymentsEnabled };
