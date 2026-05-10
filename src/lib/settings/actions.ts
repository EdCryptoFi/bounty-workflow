"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireUser } from "@/lib/auth";
import { getActiveProvider, paymentsEnabled } from "@/lib/payments/config";
import { createCheckoutSession } from "@/lib/payments/stripe";
import { createPreapproval } from "@/lib/payments/mercadopago";
import { env } from "@/lib/env";

export async function updateProfileAction(formData: FormData) {
  const { user } = await requireUser();
  const supabase = await createClient();
  const full_name = (formData.get("full_name") as string)?.trim() || null;
  const handle = (formData.get("handle") as string)?.trim() || null;
  const { error } = await supabase
    .from("users")
    .update({ full_name, handle })
    .eq("id", user.id);
  if (error) return { error: error.message };
  revalidatePath("/settings");
  return { ok: true };
}

export async function uploadAvatarAction(formData: FormData) {
  const { user } = await requireUser();
  const supabase = await createClient();
  const file = formData.get("avatar") as File | null;
  if (!file || file.size === 0) return { error: "Nenhum arquivo selecionado." };
  if (!["image/jpeg", "image/png", "image/webp"].includes(file.type))
    return { error: "Formato inválido. Use JPG, PNG ou WebP." };
  if (file.size > 2 * 1024 * 1024) return { error: "Arquivo muito grande. Máximo 2 MB." };

  const ext = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
  const path = `avatars/${user.id}.${ext}`;
  const arrayBuffer = await file.arrayBuffer();
  const { error: uploadError } = await supabase.storage
    .from("attachments")
    .upload(path, arrayBuffer, { contentType: file.type, upsert: true });
  if (uploadError) return { error: uploadError.message };

  const { data: urlData } = supabase.storage.from("attachments").getPublicUrl(path);
  const avatar_url = `${urlData.publicUrl}?t=${Date.now()}`;
  const { error: updateError } = await supabase
    .from("users")
    .update({ avatar_url })
    .eq("id", user.id);
  if (updateError) return { error: updateError.message };
  revalidatePath("/settings");
  return { ok: true, avatar_url };
}

export async function updatePasswordAction(formData: FormData) {
  await requireUser();
  const supabase = await createClient();
  const newPassword = (formData.get("new_password") as string) ?? "";
  if (newPassword.length < 6) return { error: "Senha mínima: 6 caracteres." };
  const { error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) return { error: error.message };
  return { ok: true };
}

export type CheckoutResult = { ok: true; url: string } | { ok: false; error: string };

export async function startCheckoutAction(): Promise<CheckoutResult> {
  if (!paymentsEnabled) return { ok: false, error: "Pagamentos ainda não estão ativados." };
  const { user } = await requireUser();
  const provider = getActiveProvider();
  if (!provider) return { ok: false, error: "Provider de pagamento não configurado." };
  const appUrl = env.NEXT_PUBLIC_APP_URL ?? "https://bounty-workflow.vercel.app";

  if (provider === "mercadopago") {
    const price = Number(process.env.MERCADOPAGO_PRICE_MONTHLY_BRL ?? "29.90");
    if (!Number.isFinite(price) || price <= 0) return { ok: false, error: "Preço inválido." };
    const res = await createPreapproval({
      userId: user.id,
      userEmail: user.email ?? "",
      amountBrl: price,
      reason: "Bounty WorkFlow Pro — mensal",
      frequency: "monthly",
      backUrl: `${appUrl}/settings?success=1`,
    });
    if (!res.ok) return { ok: false, error: res.error };
    return { ok: true, url: res.url };
  }

  const priceId = process.env.STRIPE_PRICE_ID_MONTHLY;
  if (!priceId) return { ok: false, error: "STRIPE_PRICE_ID_MONTHLY não configurado." };
  const res = await createCheckoutSession({
    userId: user.id,
    userEmail: user.email ?? "",
    priceId,
    successUrl: `${appUrl}/settings?success=1`,
    cancelUrl: `${appUrl}/settings?canceled=1`,
  });
  if (!res.ok) return { ok: false, error: res.error };
  return { ok: true, url: res.url };
}


export async function saveWalletAction(wallet: string) {
  const { user } = await requireUser();
  const supabase = await createClient();
  const { error } = await supabase
    .from("users")
    .update({ wallet_address: wallet.trim() || null })
    .eq("id", user.id);
  if (error) return { error: error.message };
  revalidatePath("/settings");
  return { ok: true };
}

export async function requestPayoutAction(wallet: string, amount: number) {
  const { user } = await requireUser();
  const supabase = await createClient();
  const { error } = await supabase.from("payout_requests").insert({
    user_id: user.id,
    amount,
    wallet,
  });
  if (error) return { error: error.message };
  revalidatePath("/settings");
  return { ok: true };
}
