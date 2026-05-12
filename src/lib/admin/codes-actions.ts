"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { isAdmin, requireUser } from "@/lib/auth";

const createCodeSchema = z.object({
  daysFree: z.number().int().min(1, "Mínimo 1 dia").max(365, "Máximo 365 dias"),
  customCode: z
    .string()
    .trim()
    .toUpperCase()
    .min(3, "Código mínimo 3 caracteres")
    .max(20, "Código máximo 20 caracteres")
    .regex(/^[A-Z0-9-]+$/, "Apenas letras, números e hífens")
    .nullable()
    .optional(),
});

const applyCodeSchema = z.object({
  code: z
    .string()
    .trim()
    .toUpperCase()
    .min(3, "Código mínimo 3 caracteres")
    .max(20, "Código inválido"),
});

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

  const parsed = createCodeSchema.safeParse({ daysFree, customCode });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const code = parsed.data.customCode || generateCode();

  // Usar service role para bypass de RLS
  const adminClient = createAdminClient();
  const { error } = await adminClient.from("activation_codes").insert({
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

  const adminClient = createAdminClient();
  const { error } = await adminClient.from("activation_codes").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/codes");
  return { ok: true };
}

export async function applyActivationCodeAction(code: string) {
  const { user } = await requireUser();

  const parsed = applyCodeSchema.safeParse({ code });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Código inválido." };

  const adminClient = createAdminClient();

  const { data: codeRow, error: fetchError } = await adminClient
    .from("activation_codes")
    .select("id, days_free, used_by")
    .eq("code", parsed.data.code)
    .maybeSingle();

  if (fetchError) return { error: fetchError.message };
  if (!codeRow) return { error: "Código inválido ou não encontrado." };
  if (codeRow.used_by) return { error: "Este código já foi utilizado." };

  const { data: userData } = await adminClient
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

  const { error: updateUserError } = await adminClient
    .from("users")
    .update({ trial_ends_at: newTrialEnds, applied_code_id: codeRow.id })
    .eq("id", user.id);
  if (updateUserError) return { error: updateUserError.message };

  const { error: markUsedError } = await adminClient
    .from("activation_codes")
    .update({ used_by: user.id, used_at: new Date().toISOString() })
    .eq("id", codeRow.id);
  if (markUsedError) return { error: markUsedError.message };

  revalidatePath("/settings");
  return { ok: true, daysAdded: codeRow.days_free, newTrialEnds };
}
