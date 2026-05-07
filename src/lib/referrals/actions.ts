"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { requireUser } from "@/lib/auth";

const addSchema = z.object({
  protocol_id: z.string().uuid().optional().or(z.literal("")),
  label: z.string().max(100).optional(),
  url: z.string().url("URL inválida"),
});

export type ReferralState = { error?: string; data?: Record<string, unknown> } | null;

export async function addReferralAction(
  _: ReferralState,
  formData: FormData,
): Promise<ReferralState> {
  const { user } = await requireUser();
  const parsed = addSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" };

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("referrals")
    .insert({
      user_id: user.id,
      protocol_id: parsed.data.protocol_id || null,
      label: parsed.data.label || null,
      url: parsed.data.url,
    })
    .select("id, url, label, protocol_id, created_at, protocol:protocols(id, name, logo_url, website_url)")
    .single();

  if (error || !data) return { error: error?.message ?? "Erro ao salvar" };
  revalidatePath("/referrals");
  return { data: data as Record<string, unknown> };
}

export async function deleteReferralAction(id: string) {
  await requireUser();
  const supabase = await createClient();
  await supabase.from("referrals").delete().eq("id", id);
  revalidatePath("/referrals");
}
