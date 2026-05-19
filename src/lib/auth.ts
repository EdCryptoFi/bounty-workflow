import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

/**
 * Retorna o user autenticado ou faz redirect. Use em Server Components
 * de rotas protegidas (/dashboard, /campaigns, etc).
 */
export async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");
  return { supabase, user };
}

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "cryptolairbr@gmail.com";

export const WHITELIST_EMAILS = [ADMIN_EMAIL, "cryptolairbr@gmail.com"];

export function isWhitelisted(email: string | null | undefined): boolean {
  if (!email) return false;
  return WHITELIST_EMAILS.includes(email.toLowerCase());
}

export async function isAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user?.email === ADMIN_EMAIL;
}
