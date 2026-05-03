"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { requireUser } from "@/lib/auth";

const createSchema = z.object({
  campaign_id: z.string().uuid().optional().or(z.literal("")),
  step_id: z.string().uuid().optional().or(z.literal("")),
  channel: z.enum(["email", "push", "in_app"]),
  trigger_at: z.string().min(1, "Escolha uma data/hora"),
  message: z.string().max(500).optional(),
});

export type ReminderState = { error?: string; ok?: string } | null;

export async function createReminderAction(
  _: ReminderState,
  formData: FormData,
): Promise<ReminderState> {
  const { user } = await requireUser();
  const parsed = createSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
  }

  const { campaign_id, step_id, trigger_at, ...rest } = parsed.data;

  const supabase = await createClient();
  const { error } = await supabase.from("reminders").insert({
    ...rest,
    user_id: user.id,
    campaign_id: campaign_id || null,
    step_id: step_id || null,
    trigger_at: new Date(trigger_at).toISOString(),
    status: "pending",
  });

  if (error) return { error: error.message };
  revalidatePath("/reminders");
  return { ok: "Lembrete criado." };
}

export async function cancelReminderAction(id: string) {
  await requireUser();
  const supabase = await createClient();
  const { error } = await supabase
    .from("reminders")
    .update({ status: "canceled" })
    .eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/reminders");
  return { ok: true };
}
