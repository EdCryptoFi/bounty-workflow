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

export type ReferralState = { error?: string } | null;

export async function addReferralAction(
  _: ReferralState,
  formData: FormData,
): Promise<ReferralState> {
  const { user } = await requireUser();
  const parsed = addSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" };

  const supabase = await createClient();
  const { error } = await supabase.from("referrals").insert({
    user_id: user.id,
    protocol_id: parsed.data.protocol_id || null,
    label: parsed.data.label || null,
    url: parsed.data.url,
  });

  if (error) return { error: error.message };
  revalidatePath("/referrals");
  return null;
}

export async function deleteReferralAction(id: string) {
  await requireUser();
  const supabase = await createClient();
  await supabase.from("referrals").delete().eq("id", id);
  revalidatePath("/referrals");
}
