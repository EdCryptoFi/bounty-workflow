"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const signupSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z
    .string()
    .min(8, "Senha precisa de pelo menos 8 caracteres")
    .regex(/[A-Z]/, "Inclua ao menos uma letra maiúscula")
    .regex(/[0-9]/, "Inclua ao menos um número"),
  full_name: z.string().min(2, "Nome muito curto").max(80).optional(),
  next: z.string().default("/dashboard"),
});

export type SignupState = { error?: string; ok?: string } | null;

export async function signupAction(
  _: SignupState,
  formData: FormData,
): Promise<SignupState> {
  const parsed = signupSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
  }
  const { email, password, full_name, next } = parsed.data;

  const supabase = await createClient();
  const origin = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: full_name ? { full_name } : undefined,
      emailRedirectTo: `${origin}/auth/callback?next=${encodeURIComponent(next)}`,
    },
  });

  if (error) return { error: error.message };

  // Se email confirmação está ligado (default no Supabase), user existe mas sem session
  if (data.user && !data.session) {
    return {
      ok: "Conta criada. Confira seu email pra confirmar antes de entrar.",
    };
  }

  // Se auto-confirm ou signup já retornou session, manda pro dashboard
  redirect(next);
}
