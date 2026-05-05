import { createClient } from "@/lib/supabase/server";
import type { Campaign, CampaignStatus, Step, Attachment, CampaignWithCounts } from "@/lib/types";
import { daysUntil } from "./date-utils";

// ─── Projects ────────────────────────────────────────────────────────────────

export type ProjectStat = {
  protocol_id: string;
  protocol_name: string;
  protocol_slug: string | null;
  protocol_category: string | null;
  campaign_count: number;
  active_count: number;
  total_value_brl: number;
};

export async function getProjectStats(): Promise<ProjectStat[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("campaigns")
    .select("protocol_id, estimated_value_brl, archived_at, protocols(id, name, slug, category)");

  if (error || !data) return [];

  const map = new Map<string, ProjectStat>();

  for (const c of data as unknown as {
    protocol_id: string | null;
    estimated_value_brl: string | null;
    archived_at: string | null;
    protocols: { id: string; name: string; slug: string | null; category: string | null } | null;
  }[]) {
    if (!c.protocol_id || !c.protocols) continue;
    const key = c.protocol_id;

    if (!map.has(key)) {
      map.set(key, {
        protocol_id: c.protocol_id,
        protocol_name: c.protocols.name,
        protocol_slug: c.protocols.slug,
        protocol_category: c.protocols.category,
        campaign_count: 0,
        active_count: 0,
        total_value_brl: 0,
      });
    }

    const stat = map.get(key)!;
    stat.campaign_count++;
    if (!c.archived_at) stat.active_count++;
    const val = parseFloat(c.estimated_value_brl ?? "0");
    if (isFinite(val) && val > 0) stat.total_value_brl += val;
  }

  return [...map.values()].sort(
    (a, b) => b.total_value_brl - a.total_value_brl || b.campaign_count - a.campaign_count,
  );
}

export async function listCampaignsByProtocol(protocolId: string): Promise<CampaignWithCounts[]> {
  const supabase = await createClient();

  const { data: campaigns, error } = await supabase
    .from("campaigns")
    .select("*, steps(status)")
    .eq("protocol_id", protocolId)
    .is("archived_at", null)
    .order("deadline", { ascending: true, nullsFirst: false })
    .returns<(Campaign & { steps: { status: string }[] })[]>();

  if (error || !campaigns) return [];

  return campaigns.map((c) => {
    const step_count = c.steps.length;
    const done_count = c.steps.filter((s) => s.status === "done").length;
    const days_to_deadline = daysUntil(c.deadline);
    const { steps: _steps, ...rest } = c;
    void _steps;
    return { ...rest, step_count, done_count, days_to_deadline };
  });
}

// ─── Performance ─────────────────────────────────────────────────────────────

export type CampaignPerf = {
  id: string;
  title: string;
  status: CampaignStatus;
  estimated_value_brl: string | null;
  archived_at: string | null;
  deadline: string | null;
  created_at: string;
  protocol_id: string | null;
  protocol_name: string | null;
};

export async function getCampaignsForPerformance(): Promise<CampaignPerf[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("campaigns")
    .select("id, title, status, estimated_value_brl, archived_at, deadline, created_at, protocol_id, protocols(name)")
    .order("created_at", { ascending: false });

  if (error || !data) return [];

  return (
    (data as unknown) as {
      id: string;
      title: string;
      status: CampaignStatus;
      estimated_value_brl: string | null;
      archived_at: string | null;
      deadline: string | null;
      created_at: string;
      protocol_id: string | null;
      protocols: { name: string } | null;
    }[]
  ).map((c) => ({
    id: c.id,
    title: c.title,
    status: c.status,
    estimated_value_brl: c.estimated_value_brl,
    archived_at: c.archived_at,
    deadline: c.deadline,
    created_at: c.created_at,
    protocol_id: c.protocol_id,
    protocol_name: c.protocols?.name ?? null,
  }));
}

/** Lista campanhas do usuário atual com contagem de steps — ordenadas por deadline. */
export async function listCampaignsForTimeline(): Promise<CampaignWithCounts[]> {
  const supabase = await createClient();

  const { data: campaigns, error } = await supabase
    .from("campaigns")
    .select("*, steps(status), protocols(slug, website_url, logo_url)")
    .is("archived_at", null)
    .order("deadline", { ascending: true, nullsFirst: false })
    .returns<(Campaign & {
      steps: { status: string }[];
      protocols: { slug: string | null; website_url: string | null; logo_url: string | null } | null;
    })[]>();

  if (error || !campaigns) return [];

  return campaigns.map((c) => {
    const step_count = c.steps.length;
    const done_count = c.steps.filter((s) => s.status === "done").length;
    const days_to_deadline = daysUntil(c.deadline);
    const { steps: _steps, protocols, ...rest } = c;
    void _steps;
    return {
      ...rest,
      step_count,
      done_count,
      days_to_deadline,
      protocol_slug: protocols?.slug ?? null,
      protocol_website: protocols?.website_url ?? null,
      protocol_logo: protocols?.logo_url ?? null,
    };
  });
}

export async function getCampaignById(
  id: string,
): Promise<{ campaign: Campaign; steps: Step[]; attachments: Attachment[] } | null> {
  const supabase = await createClient();

  const [campaignRes, stepsRes, attachmentsRes] = await Promise.all([
    supabase.from("campaigns").select("*").eq("id", id).maybeSingle(),
    supabase
      .from("steps")
      .select("*")
      .eq("campaign_id", id)
      .order("order_index", { ascending: true }),
    supabase
      .from("attachments")
      .select("*")
      .eq("campaign_id", id)
      .order("uploaded_at", { ascending: false }),
  ]);

  if (campaignRes.error || !campaignRes.data) return null;

  return {
    campaign: campaignRes.data as Campaign,
    steps: (stepsRes.data ?? []) as Step[],
    attachments: (attachmentsRes.data ?? []) as Attachment[],
  };
}
