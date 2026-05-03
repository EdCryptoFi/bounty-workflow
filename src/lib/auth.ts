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

/** Checa admin (via função is_admin no DB, que lê user_roles — C3 fix). */
export async function isAdmin() {
  const supabase = await createClient();
  const { data } = await supabase.rpc("is_admin");
  return data === true;
}
