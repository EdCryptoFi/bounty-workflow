import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getCampaignById } from "@/lib/campaigns/queries";
import { daysUntil, formatDeadlineFull } from "@/lib/campaigns/date-utils";
import { requireUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { TaskCard } from "@/components/campaigns/task-card";
import { AddStepModal } from "@/components/campaigns/add-step-modal";
import { FlowLeftPanel } from "@/components/campaigns/flow-left-panel";
import { FlowNodes } from "@/components/campaigns/flow-nodes";
import { CampaignStatusSelect } from "@/components/campaigns/campaign-status-select";
import { GlowCard } from "@/components/ui/glow-card";
import { CampaignPublishButton } from "@/components/x/campaign-publish-button";

export const metadata: Metadata = { title: "Campanha" };


export default async function CampaignDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { user } = await requireUser();
  const data = await getCampaignById(id);
  if (!data) notFound();

  const supabase = await createClient();
  const { data: xAccounts } = await supabase
    .from("user_x_accounts")
    .select("id, x_username, x_name, x_avatar_url")
    .eq("user_id", user.id)
    .eq("is_active", true);

  const { campaign, steps, attachments } = data;
  const links = attachments.filter((a) => a.type === "link");
  const daysLeft = daysUntil(campaign.deadline);
  const stepsDone = steps.filter((s) => s.status === "done").length;
  const efficiency =
    steps.length > 0 ? Math.round((stepsDone / steps.length) * 100) : 0;

  return (
    <div className="max-w-[1400px] mx-auto flex flex-col gap-6">
      {/* Back */}
      <Link
        href="/campaigns"
        className="flex items-center gap-1 text-xs text-tertiary hover:text-[#ffb59a] transition-colors w-fit"
      >
        <span className="material-symbols-outlined text-[16px]">arrow_back</span>
        Voltar para Campanhas
      </Link>

      {/* Header metrics */}
      <GlowCard className="shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
        <div className="bg-[rgba(42,42,42,0.7)] backdrop-blur-xl rounded-[11px] p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-[inset_0_0_20px_rgba(255,92,0,0.05)]">
          <div>
            <h1 className="font-display text-[30px] font-semibold tracking-tight text-on-surface leading-tight">
              {campaign.title}
            </h1>
            <div className="flex items-center gap-3 mt-2 flex-wrap">
              <CampaignStatusSelect campaignId={campaign.id} status={campaign.status} />
              {campaign.description && (
                <span className="text-xs text-tertiary truncate max-w-[400px]">
                  {campaign.description}
                </span>
              )}
            </div>
          </div>

          <div className="flex gap-6 shrink-0 flex-wrap">
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-bold uppercase tracking-widest text-tertiary mb-1">
                Eficiência
              </span>
              <span className="text-2xl font-semibold text-[#e9c349] drop-shadow-[0_0_10px_rgba(233,195,73,0.3)]">
                {efficiency}%
              </span>
            </div>
            <div className="h-10 w-px bg-outline-variant/50 self-center" />
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-bold uppercase tracking-widest text-tertiary mb-1">
                Tarefas
              </span>
              <span className="text-2xl font-semibold text-[#e9c349] drop-shadow-[0_0_10px_rgba(233,195,73,0.3)]">
                {stepsDone}/{steps.length}
              </span>
            </div>
            {campaign.deadline && (
              <>
                <div className="h-10 w-px bg-outline-variant/50 self-center" />
                <div className="flex flex-col items-end">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-tertiary mb-1">
                    Prazo
                  </span>
                  <span
                    className={`text-sm font-semibold ${
                      daysLeft !== null && daysLeft < 0
                        ? "text-red-400"
                        : daysLeft !== null && daysLeft <= 7
                          ? "text-amber-400"
                          : "text-on-surface"
                    }`}
                  >
                    {formatDeadlineFull(campaign.deadline)}
                  </span>
                  {daysLeft !== null && (
                    <span
                      className={`text-[10px] font-bold ${
                        daysLeft < 0
                          ? "text-red-400"
                          : daysLeft <= 7
                            ? "text-amber-400"
                            : "text-tertiary"
                      }`}
                    >
                      {daysLeft < 0
                        ? `${Math.abs(daysLeft)}d atrás`
                        : daysLeft === 0
                          ? "hoje"
                          : `em ${daysLeft}d`}
                    </span>
                  )}
                </div>
              </>
            )}
          </div>

          <div className="shrink-0">
            <CampaignPublishButton
              campaignTitle={campaign.title}
              stepsDone={stepsDone}
              stepsTotal={steps.length}
              accounts={(xAccounts ?? []) as Array<{ id: string; x_username: string; x_name: string | null; x_avatar_url: string | null }>}
            />
          </div>
        </div>
      </GlowCard>

      {/* Main bento grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Fluxo de Protocolo */}
        <GlowCard className="lg:col-span-2 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
          <div className="bg-[rgba(42,42,42,0.7)] backdrop-blur-xl rounded-[11px] p-5 flex flex-col gap-4 shadow-[inset_0_0_20px_rgba(255,92,0,0.05)] min-h-[600px]">
            <div className="flex justify-between items-center">
              <h2 className="text-base font-semibold text-on-surface">
                Fluxo de Protocolo
              </h2>
              <AddStepModal campaignId={campaign.id} />
            </div>

            {/* Inner canvas */}
            <div className="flex-1 bg-[rgba(14,14,14,0.5)] border border-outline-variant/30 rounded-lg flex flex-row p-4 gap-6 overflow-hidden min-h-[500px]">
              {/* Left sub-col: Links, Prompts & Drive */}
              <FlowLeftPanel
                campaignId={campaign.id}
                links={links}
                steps={steps}
              />

              {/* Right sub-col: flow nodes */}
              <div className="w-2/3 relative flex flex-col items-center justify-start gap-10 py-4 overflow-y-auto h-full">
                <FlowNodes steps={steps} />
              </div>
            </div>
          </div>
        </GlowCard>

        {/* Right column */}
        <div className="flex flex-col gap-4">
          {/* Campaign Details */}
          <GlowCard>
            <div className="bg-[rgba(42,42,42,0.7)] backdrop-blur-xl rounded-[11px] p-5">
              <h2 className="text-base font-semibold text-on-surface mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-[#e9c349] text-[18px]">
                  campaign
                </span>
                Detalhes da Campanha
              </h2>
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between p-3 bg-surface-container-high/30 rounded-lg border border-outline-variant/20">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-tertiary">
                    Status
                  </span>
                  <CampaignStatusSelect campaignId={campaign.id} status={campaign.status} />
                </div>
                {campaign.estimated_value_brl && (
                  <div className="flex items-center justify-between p-3 bg-surface-container-high/30 rounded-lg border border-outline-variant/20">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-tertiary">
                      Valor Est.
                    </span>
                    <span className="text-xs font-semibold text-[#e9c349]">
                      {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
                        Number(campaign.estimated_value_brl),
                      )}
                    </span>
                  </div>
                )}
                {campaign.deadline && (
                  <div className="flex items-center justify-between p-3 bg-surface-container-high/30 rounded-lg border border-outline-variant/20">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-tertiary">
                      Prazo
                    </span>
                    <span
                      className={`text-xs font-semibold ${
                        daysLeft !== null && daysLeft < 0
                          ? "text-red-400"
                          : "text-on-surface"
                      }`}
                    >
                      {formatDeadlineFull(campaign.deadline)}
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between p-3 bg-surface-container-high/30 rounded-lg border border-outline-variant/20">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-tertiary">
                    Progresso
                  </span>
                  <span className="text-xs font-semibold text-[#e9c349]">
                    {stepsDone}/{steps.length} tarefas
                  </span>
                </div>
                {steps.length > 0 && (
                  <div className="mt-1">
                    <div className="h-1.5 bg-surface-container-high/50 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#ff5c00] to-[#e9c349] rounded-full transition-all duration-500"
                        style={{ width: `${efficiency}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </GlowCard>

          {/* Tasks checklist */}
          <GlowCard className="flex-1">
            <div className="bg-[rgba(42,42,42,0.7)] backdrop-blur-xl rounded-[11px] p-5">
              <h2 className="text-base font-semibold text-on-surface mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-[#e9c349] text-[18px]">
                  checklist
                </span>
                Tarefas Pendentes
              </h2>
              <div className="flex flex-col gap-2">
                {steps.map((s) => (
                  <TaskCard key={s.id} step={s} />
                ))}
                {steps.length === 0 && (
                  <p className="text-[10px] font-bold uppercase tracking-widest text-tertiary py-4 text-center">
                    Nenhuma tarefa adicionada
                  </p>
                )}
              </div>
            </div>
          </GlowCard>

        </div>
      </div>
    </div>
  );
}
