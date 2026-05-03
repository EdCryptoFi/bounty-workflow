"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { isAdmin, requireUser } from "@/lib/auth";

const schema = z.object({
  slug: z
    .string()
    .min(2)
    .max(60)
    .regex(/^[a-z0-9-]+$/, "Slug deve ser lowercase com hífens"),
  name: z.string().min(2).max(100),
  description: z.string().max(500).optional(),
  category: z.string().max(50).optional(),
  website_url: z.string().url().optional().or(z.literal("")),
  is_active: z.string().optional(),
});

export type ProtocolFormState = { error?: string; ok?: string } | null;

async function guard() {
  await requireUser();
  if (!(await isAdmin())) {
    throw new Error("forbidden");
  }
}

export async function upsertProtocolAction(
  _: ProtocolFormState,
  formData: FormData,
): Promise<ProtocolFormState> {
  await guard();

  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
  }

  const { is_active, website_url, ...rest } = parsed.data;
  const supabase = await createClient();
  const id = (formData.get("id") as string) || null;

  const payload = {
    ...rest,
    website_url: website_url || null,
    is_active: is_active === "on",
  };

  const { error } = id
    ? await supabase.from("protocols").update(payload).eq("id", id)
    : await supabase.from("protocols").insert(payload);

  if (error) return { error: error.message };

  revalidatePath("/protocols");
  revalidatePath("/admin/protocols");
  redirect("/admin/protocols");
}

export async function deleteProtocolAction(id: string) {
  await guard();
  const supabase = await createClient();
  const { error } = await supabase.from("protocols").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/protocols");
  revalidatePath("/admin/protocols");
  return { ok: true };
}
