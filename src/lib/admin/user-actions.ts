"use server";

import { revalidatePath } from "next/cache";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/auth";

export async function banUserAction(userId: string) {
  if (!(await isAdmin())) return { error: "Não autorizado." };

  const supabase = await createClient();

  // Don't allow banning yourself
  const { data: { user: currentUser } } = await supabase.auth.getUser();
  if (currentUser?.id === userId) return { error: "Você não pode banir a si mesmo." };

  const { error } = await supabase
    .from("users")
    .update({ banned_at: new Date().toISOString() })
    .eq("id", userId);

  if (error) return { error: error.message };

  // Also ban in Supabase Auth (prevents login)
  try {
    const adminClient = createAdminClient();
    await adminClient.auth.admin.updateUserById(userId, { ban_duration: "876000h" }); // ~100 years
  } catch (e) {
    // Non-critical — the app-level ban still works
  }

  revalidatePath("/admin/users");
  return { ok: true };
}

export async function unbanUserAction(userId: string) {
  if (!(await isAdmin())) return { error: "Não autorizado." };

  const supabase = await createClient();

  const { error } = await supabase
    .from("users")
    .update({ banned_at: null })
    .eq("id", userId);

  if (error) return { error: error.message };

  // Also unban in Supabase Auth
  try {
    const adminClient = createAdminClient();
    await adminClient.auth.admin.updateUserById(userId, { ban_duration: "none" });
  } catch (e) {
    // Non-critical
  }

  revalidatePath("/admin/users");
  return { ok: true };
}

export async function deleteUserAction(userId: string) {
  if (!(await isAdmin())) return { error: "Não autorizado." };

  const supabase = await createClient();
  const { data: { user: currentUser } } = await supabase.auth.getUser();
  if (currentUser?.id === userId) return { error: "Você não pode deletar a si mesmo." };

  // Remove from users table
  const { error } = await supabase.from("users").delete().eq("id", userId);
  if (error) return { error: error.message };

  // Remove from Supabase Auth
  try {
    const adminClient = createAdminClient();
    await adminClient.auth.admin.deleteUser(userId);
  } catch (e) {
    // Non-critical
  }

  revalidatePath("/admin/users");
  return { ok: true };
}
