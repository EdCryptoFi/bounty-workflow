"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { requireUser } from "@/lib/auth";
import type { CampaignStatus, StepStatus } from "@/lib/types";

const createSchema = z.object({
  title: z.string().min(2, "Título curto demais").max(120),
  description: z.string().max(2000).optional(),
  deadline: z.union([
    z.literal(""),
    z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Formato inválido")
      .refine((s) => {
        const y = Number(s.slice(0, 4));
        return y >= 2000 && y <= 2100;
      }, "Ano fora do intervalo (2000-2100)"),
  ]).optional(),
  protocol_id: z.string().uuid().optional().or(z.literal("")),
  estimated_value_brl: z.string().optional(),
});

export type CreateCampaignState = { error?: string } | null;

export async function createCampaignAction(
  _: CreateCampaignState,
  formData: FormData,
): Promise<CreateCampaignState> {
  const { user } = await requireUser();
  const raw = Object.fromEntries(formData);
  const parsed = createSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("campaigns")
    .insert({
      user_id: user.id,
      title: parsed.data.title,
      description: parsed.data.description || null,
      deadline: parsed.data.deadline || null,
      protocol_id: parsed.data.protocol_id || null,
      estimated_value_brl: parsed.data.estimated_value_brl
        ? Number(parsed.data.estimated_value_brl)
        : null,
      status: "draft",
    })
    .select("id")
    .single();

  if (error || !data) {
    return { error: error?.message ?? "Não foi possível criar a campanha" };
  }

  revalidatePath("/dashboard");
  revalidatePath("/campaigns");
  redirect(`/campaigns/${data.id}`);
}

const stepSchema = z.object({
  campaign_id: z.string().uuid(),
  title: z.string().min(1).max(200),
  description: z.string().max(1000).optional(),
  due_date: z.string().optional(),
});

export async function addStepAction(formData: FormData) {
  const { user } = await requireUser();
  const parsed = stepSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
  }

  const supabase = await createClient();
  // pega o próximo order_index
  const { data: max } = await supabase
    .from("steps")
    .select("order_index")
    .eq("campaign_id", parsed.data.campaign_id)
    .order("order_index", { ascending: false })
    .limit(1)
    .maybeSingle();

  const nextIdx = ((max?.order_index as number | undefined) ?? -1) + 1;

  const { error } = await supabase.from("steps").insert({
    campaign_id: parsed.data.campaign_id,
    title: parsed.data.title,
    description: parsed.data.description || null,
    due_date: parsed.data.due_date || null,
    order_index: nextIdx,
    status: "todo",
  });

  if (error) return { error: error.message };

  const links = (formData.getAll("link") as string[]).filter(Boolean);
  if (links.length > 0) {
    await supabase.from("attachments").insert(
      links.map((url) => ({
        campaign_id: parsed.data.campaign_id,
        user_id: user.id,
        bucket: "attachments",
        path: url,
        type: "link" as const,
        mime_type: null,
        size_bytes: null,
      })),
    );
  }

  revalidatePath(`/campaigns/${parsed.data.campaign_id}`);
  return { ok: true };
}

export async function deleteStepAction(stepId: string) {
  await requireUser();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("steps")
    .delete()
    .eq("id", stepId)
    .select("campaign_id")
    .single();
  if (error || !data) return { error: error?.message ?? "Erro" };
  revalidatePath(`/campaigns/${data.campaign_id}`);
  return { ok: true };
}

export async function addLinkAction(campaignId: string, url: string) {
  const { user } = await requireUser();
  const supabase = await createClient();
  const { error } = await supabase.from("attachments").insert({
    campaign_id: campaignId,
    user_id: user.id,
    bucket: "attachments",
    path: url,
    type: "link" as const,
    mime_type: null,
    size_bytes: null,
  });
  if (error) return { error: error.message };
  revalidatePath(`/campaigns/${campaignId}`);
  return { ok: true };
}

export async function removeAttachmentAction(attachmentId: string, campaignId: string) {
  await requireUser();
  const supabase = await createClient();
  const { error } = await supabase
    .from("attachments")
    .delete()
    .eq("id", attachmentId);
  if (error) return { error: error.message };
  revalidatePath(`/campaigns/${campaignId}`);
  return { ok: true };
}

export async function toggleStepAction(stepId: string, next: "todo" | "in_progress" | "done") {
  await requireUser();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("steps")
    .update({
      status: next,
      completed_at: next === "done" ? new Date().toISOString() : null,
    })
    .eq("id", stepId)
    .select("campaign_id")
    .single();

  if (error || !data) return { error: error?.message ?? "Erro" };
  revalidatePath(`/campaigns/${data.campaign_id}`);
  revalidatePath("/dashboard");
  return { ok: true };
}

export async function updateStepAction(
  stepId: string,
  data: { title?: string; description?: string | null; due_date?: string | null; status?: StepStatus },
) {
  await requireUser();
  const supabase = await createClient();
  const patch: Record<string, unknown> = {};
  if (data.title !== undefined) patch.title = data.title;
  if ("description" in data) patch.description = data.description ?? null;
  if ("due_date" in data) patch.due_date = data.due_date ?? null;
  if (data.status !== undefined) {
    patch.status = data.status;
    patch.completed_at = data.status === "done" ? new Date().toISOString() : null;
  }
  const { data: updated, error } = await supabase
    .from("steps")
    .update(patch)
    .eq("id", stepId)
    .select("campaign_id")
    .single();
  if (error || !updated) return { error: error?.message ?? "Erro" };
  revalidatePath(`/campaigns/${(updated as { campaign_id: string }).campaign_id}`);
  revalidatePath("/dashboard");
  return { ok: true };
}

export async function updateCampaignStatusAction(campaignId: string, status: CampaignStatus) {
  await requireUser();
  const supabase = await createClient();
  const { error } = await supabase
    .from("campaigns")
    .update({
      status,
      archived_at: status === "archived" ? new Date().toISOString() : null,
    })
    .eq("id", campaignId);
  if (error) return { error: error.message };
  revalidatePath("/dashboard");
  revalidatePath("/campaigns");
  return { ok: true };
}

export async function archiveCampaignAction(campaignId: string) {
  await requireUser();
  const supabase = await createClient();
  const { error } = await supabase
    .from("campaigns")
    .update({ archived_at: new Date().toISOString(), status: "archived" })
    .eq("id", campaignId);
  if (error) return { error: error.message };
  revalidatePath("/dashboard");
  revalidatePath("/campaigns");
  revalidatePath("/archive");
  redirect("/dashboard");
}

export async function unarchiveCampaignAction(campaignId: string) {
  await requireUser();
  const supabase = await createClient();
  const { error } = await supabase
    .from("campaigns")
    .update({ archived_at: null, status: "active" })
    .eq("id", campaignId);
  if (error) return { error: error.message };
  revalidatePath("/dashboard");
  revalidatePath("/campaigns");
  revalidatePath("/archive");
  return { ok: true };
}
