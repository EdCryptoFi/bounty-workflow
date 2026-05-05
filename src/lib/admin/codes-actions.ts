"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { isAdmin, requireUser } from "@/lib/auth";

function generateCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "BWF-";
  for (let i = 0; i < 8; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

export async function createActivationCodeAction(daysFree: number, customCode: string | null) {
  if (!(await isAdmin())) return { error: "Não autorizado." };
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const code = customCode || generateCode();
  const { error } = await supabase.from("activation_codes").insert({
    code,
    days_free: daysFree,
    created_by: user?.id ?? null,
  });
  if (error) return { error: error.message };
  revalidatePath("/admin/codes");
  return { ok: true, code };
}

export async function deleteActivationCodeAction(id: string) {
  if (!(await isAdmin())) return { error: "Não autorizado." };
  const supabase = await createClient();
  const { error } = await supabase.from("activation_codes").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/codes");
  return { ok: true };
}

export async function applyActivationCodeAction(code: string) {
  const { user } = await requireUser();
  const supabase = await createClient();

  const { data: codeRow, error: fetchError } = await supabase
    .from("activation_codes")
    .select("id, days_free, used_by")
    .eq("code", code.trim().toUpperCase())
    .maybeSingle();

  if (fetchError) return { error: fetchError.message };
  if (!codeRow) return { error: "Código inválido ou não encontrado." };
  if (codeRow.used_by) return { error: "Este código já foi utilizado." };

  const { data: userData } = await supabase
    .from("users")
    .select("trial_ends_at, applied_code_id")
    .eq("id", user.id)
    .single();

  if (userData?.applied_code_id) return { error: "Você já utilizou um código de ativação." };

  const base = userData?.trial_ends_at
    ? new Date(Math.max(Date.now(), new Date(userData.trial_ends_at).getTime()))
    : new Date();
  base.setDate(base.getDate() + codeRow.days_free);
  const newTrialEnds = base.toISOString();

  const { error: updateUserError } = await supabase
    .from("users")
    .update({ trial_ends_at: newTrialEnds, applied_code_id: codeRow.id })
    .eq("id", user.id);
  if (updateUserError) return { error: updateUserError.message };

  const { error: markUsedError } = await supabase
    .from("activation_codes")
    .update({ used_by: user.id, used_at: new Date().toISOString() })
    .eq("id", codeRow.id);
  if (markUsedError) return { error: markUsedError.message };

  revalidatePath("/settings");
  return { ok: true, daysAdded: codeRow.days_free, newTrialEnds };
}
