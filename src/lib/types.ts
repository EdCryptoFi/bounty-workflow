/**
 * Types que batem com o schema do Supabase.
 * Quando precisar, pode gerar com supabase gen types — por agora, manualmente.
 */

export type CampaignStatus = "draft" | "active" | "completed" | "archived";
export type StepStatus = "todo" | "in_progress" | "done";
export type AttachmentType = "image" | "link" | "pdf" | "other";
export type ReminderChannel = "email" | "push" | "in_app";
export type ReminderStatus = "pending" | "sent" | "failed" | "snoozed" | "canceled";

export type Protocol = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  logo_url: string | null;
  category: string | null;
  website_url: string | null;
  deadline: string | null;
  is_active: boolean;
};

export type Campaign = {
  id: string;
  user_id: string;
  protocol_id: string | null;
  title: string;
  description: string | null;
  status: CampaignStatus;
  deadline: string | null;
  planning_json: { version: number; nodes?: unknown[]; edges?: unknown[] } | null;
  estimated_value_brl: string | null;
  archived_at: string | null;
  created_at: string;
  updated_at: string;
};

export type Step = {
  id: string;
  campaign_id: string;
  order_index: number;
  title: string;
  description: string | null;
  status: StepStatus;
  due_date: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
};

export type Attachment = {
  id: string;
  campaign_id: string;
  user_id: string;
  bucket: string;
  path: string;
  mime_type: string | null;
  size_bytes: number | null;
  type: AttachmentType;
  metadata_json: Record<string, unknown> | null;
  uploaded_at: string;
};

export type CampaignWithCounts = Campaign & {
  step_count: number;
  done_count: number;
  days_to_deadline: number | null;
  protocol_slug?: string | null;
  protocol_website?: string | null;
  protocol_logo?: string | null;
};

export type XAccount = {
  id: string;
  user_id: string;
  x_user_id: string;
  x_username: string;
  x_name: string | null;
  x_avatar_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};
