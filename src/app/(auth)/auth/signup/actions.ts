"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/server";
import { isWhitelisted, isLaunchOpen } from "@/lib/auth";

const signupSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z
    .string()
    .min(8, "Senha precisa de pelo menos 8 caracteres")
    .regex(/[A-Z]/, "Inclua ao menos uma letra maiúscula")
    .regex(/[0-9]/, "Inclua ao menos um número"),
  full_name: z.string().min(2, "Nome muito curto").max(80).optional(),
  next: z.string().default("/dashboard"),
  ref: z.string().optional(),
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
  const { email, password, full_name, next, ref } = parsed.data;

  if (!(await isLaunchOpen()) && !isWhitelisted(email)) {
    redirect("/pre-lancamento");
  }

  // Track referral if provided
  let referredById: string | null = null;
  if (ref) {
    const admin = createAdminClient();
    const { data: referrer } = await admin
      .from("users")
      .select("id")
      .eq("referral_code", ref.toUpperCase())
      .maybeSingle();
    if (referrer) {
      referredById = referrer.id;
    }
  }

  const supabase = await createClient();
  const origin = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  // Pass referral info in user_metadata so the trigger can use it
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        ...(full_name ? { full_name } : {}),
        ...(referredById ? { referred_by: referredById } : {}),
      },
      emailRedirectTo: `${origin}/auth/callback?next=${encodeURIComponent(next)}`,
    },
  });

  if (error) return { error: error.message };

  // If signup successful and we have referral info, update the user row
  if (data.user && referredById) {
    const admin = createAdminClient();
    await admin
      .from("users")
      .update({ referred_by: referredById })
      .eq("id", data.user.id);

    // Mark referral click as converted
    await admin
      .from("referral_clicks")
      .update({ converted: true })
      .eq("referrer_id", referredById);
  }

  if (data.user && !data.session) {
    return {
      ok: "Conta criada. Confira seu email pra confirmar antes de entrar.",
    };
  }

  redirect(next);
}
