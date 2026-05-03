"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(8, "Senha precisa de 8+ caracteres"),
  next: z.string().default("/dashboard"),
});

const magicSchema = z.object({
  email: z.string().email("Email inválido"),
  next: z.string().default("/dashboard"),
});

export type LoginState = { error?: string; ok?: string } | null;

export async function loginAction(_: LoginState, formData: FormData): Promise<LoginState> {
  const parsed = loginSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
  }
  const { email, password, next } = parsed.data;

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: "Email ou senha incorretos" };

  redirect(next);
}

export async function magicLinkAction(
  _: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const parsed = magicSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Email inválido" };
  }
  const { email, next } = parsed.data;

  const supabase = await createClient();
  const origin = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: true,
      emailRedirectTo: `${origin}/auth/callback?next=${encodeURIComponent(next)}`,
    },
  });

  if (error) return { error: error.message };
  return { ok: "Link de acesso enviado pro seu email. Confira a caixa de entrada." };
}
