import { redirect } from "next/navigation";
import { createClient, createAdminClient } from "@/lib/supabase/server";

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

export const WHITELIST_EMAILS = [ADMIN_EMAIL];

export function isWhitelisted(email: string | null | undefined): boolean {
  if (!email) return false;
  return WHITELIST_EMAILS.includes(email.toLowerCase());
}

export async function isLaunchOpen(): Promise<boolean> {
  try {
    const supabase = createAdminClient();
    const { data } = await supabase
      .from("app_config")
      .select("value")
      .eq("key", "launch_mode")
      .single();
    return data?.value === true;
  } catch {
    return false;
  }
}

export async function isAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user?.email === ADMIN_EMAIL;
}
