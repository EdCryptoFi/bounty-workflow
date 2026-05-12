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

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "bountyworkflow@proton.me";

export async function isAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user?.email === ADMIN_EMAIL;
}
