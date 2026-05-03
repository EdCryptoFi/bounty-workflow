"use server";

import { requireUser } from "@/lib/auth";
import { getActiveProvider, paymentsEnabled } from "@/lib/payments/config";
import { createCheckoutSession } from "@/lib/payments/stripe";
import { createPreapproval } from "@/lib/payments/mercadopago";
import { env } from "@/lib/env";

export type CheckoutResult = { ok: true; url: string } | { ok: false; error: string };

/**
 * Inicia o checkout de upgrade.
 * - Se payments off → retorna erro
 * - Se Mercado Pago configurado → cria Preapproval (recorrente BRL)
 * - Senão se Stripe configurado → cria Checkout Session
 *
 * Fix C4: sempre passa user.id como external_reference / client_reference_id.
 */
export async function startCheckoutAction(): Promise<CheckoutResult> {
  if (!paymentsEnabled) {
    return { ok: false, error: "Pagamentos ainda não estão ativados." };
  }

  const { user } = await requireUser();
  const provider = getActiveProvider();
  if (!provider) {
    return { ok: false, error: "Provider de pagamento não configurado." };
  }

  const appUrl = env.NEXT_PUBLIC_APP_URL ?? "https://bounty-workflow.vercel.app";

  if (provider === "mercadopago") {
    const priceRaw = process.env.MERCADOPAGO_PRICE_MONTHLY_BRL ?? "29.90";
    const price = Number(priceRaw);
    if (!Number.isFinite(price) || price <= 0) {
      return { ok: false, error: "MERCADOPAGO_PRICE_MONTHLY_BRL inválido." };
    }
    const res = await createPreapproval({
      userId: user.id,
      userEmail: user.email ?? "",
      amountBrl: price,
      reason: "Bounty WorkFlow Pro — mensal",
      frequency: "monthly",
      backUrl: `${appUrl}/settings/billing?success=1`,
    });
    if (!res.ok) return { ok: false, error: res.error };
    return { ok: true, url: res.url };
  }

  // Stripe fallback
  const priceId = process.env.STRIPE_PRICE_ID_MONTHLY;
  if (!priceId) return { ok: false, error: "STRIPE_PRICE_ID_MONTHLY não configurado." };

  const res = await createCheckoutSession({
    userId: user.id,
    userEmail: user.email ?? "",
    priceId,
    successUrl: `${appUrl}/settings/billing?success=1`,
    cancelUrl: `${appUrl}/settings/billing?canceled=1`,
  });
  if (!res.ok) return { ok: false, error: res.error };
  return { ok: true, url: res.url };
}
