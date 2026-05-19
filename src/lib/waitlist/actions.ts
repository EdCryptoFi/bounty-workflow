"use server";

import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/server";
import { queueFullNurtureSequence } from "@/lib/email/nurture";

const joinSchema = z.object({
  name: z.string().min(2, "Nome precisa de pelo menos 2 caracteres").max(100),
  email: z.string().email("Email inválido"),
  profile_type: z.enum(["creator", "hunter", "both"] as const, {
    message: "Selecione seu perfil",
  }),
  ref: z.string().optional(),
});

export type WaitlistState = { error?: string; ok?: string } | null;

export async function joinWaitlistAction(
  _: WaitlistState,
  formData: FormData,
): Promise<WaitlistState> {
  const parsed = joinSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
  }

  const { name, email, profile_type, ref } = parsed.data;

  const supabase = createAdminClient();

  const { error } = await supabase
    .from("waitlist_subscribers")
    .insert({
      name,
      email,
      profile_type,
      referral_source: ref || null,
    });

  if (error) {
    if (error.code === "23505") {
      return { error: "Este email já está na lista de espera!" };
    }
    return { error: error.message ?? "Erro ao entrar na lista" };
  }

  // Queue nurture email sequence (fire-and-forget)
  queueFullNurtureSequence(email, name).catch(() => {});

  return {
    ok: "Você está na lista! Enviaremos novidades em breve.",
  };
}

export async function getWaitlistCount(): Promise<number> {
  const supabase = createAdminClient();
  const { count } = await supabase
    .from("waitlist_subscribers")
    .select("*", { count: "exact", head: true });
  return count ?? 0;
}
