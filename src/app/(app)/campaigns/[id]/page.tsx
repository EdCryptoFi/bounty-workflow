import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getCampaignById } from "@/lib/campaigns/queries";
import { daysUntil, formatDeadlineFull } from "@/lib/campaigns/date-utils";
import { requireUser } from "@/lib/auth";
import { TaskCard } from "@/components/campaigns/task-card";
import { AddStepForm } from "@/components/campaigns/add-step-form";
import { AttachmentDropzone } from "@/components/campaigns/attachment-dropzone";
import type { Step } from "@/lib/types";

export const metadata: Metadata = { title: "Campanha" };

const STATUS_LABEL: Record<string, string> = {
  draft: "RASCUNHO",
  active: "ATIVO",
  completed: "CONCLUÍDO",
  archived: "ARQUIVADO",
};

const STATUS_DOT: Record<string, string> = {
  draft: "bg-zinc-400",
  active: "bg-[#ff5c00] shadow-[0_0_8px_#ff5c00]",
  completed: "bg-[#e9c349] shadow-[0_0_8px_rgba(233,195,73,0.6)]",
  archived: "bg-zinc-600",
};

const STEP_BORDER: Record<Step["status"], string> = {
  todo: "border-outline-variant",
  in_progress: "border-[#ff5c00]/50",
  done: "border-[#e9c349]/50",
};

const STEP_ICON: Record<Step["status"], string> = {
  todo: "radio_button_unchecked",
  in_progress: "pending",
  done: "check_circle",
};

const STEP_ICON_COLOR: Record<Step["status"], string> = {
  todo: "text-tertiary",
  in_progress: "text-[#ffb59a]",
  done: "text-[#e9c349]",
};

const STEP_STATUS_LABEL: Record<Step["status"], string> = {
  todo: "Pendente",
  in_progress: "Em Progresso",
  done: "Concluído",
};

const STEP_STATUS_TEXT: Record<Step["status"], string> = {
  todo: "text-tertiary",
  in_progress: "text-[#ffb59a]",
  done: "text-[#e9c349]",
};

export default async function CampaignDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { user } = await requireUser();
  const data = await getCampaignById(params.id);
  if (!data) notFound();

  const { campaign, steps, attachments } = data;
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
      <div className="p-[1px] rounded-xl bg-gradient-to-br from-[rgba(233,195,73,0.2)] to-transparent">
        <div className="bg-[rgba(42,42,42,0.7)] backdrop-blur-xl rounded-[calc(0.75rem-1px)] p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-[inset_0_0_20px_rgba(255,92,0,0.05),0_4px_30px_rgba(0,0,0,0.5)]">
          <div>
            <h1 className="font-display text-[30px] font-semibold tracking-tight text-on-surface leading-tight">
              {campaign.title}
            </h1>
            <div className="flex items-center gap-3 mt-2 flex-wrap">
              <span className="px-3 py-1 bg-surface-container/50 border border-secondary/30 rounded-full flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${STATUS_DOT[campaign.status] ?? "bg-zinc-500"}`} />
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#e9c349]">
                  {STATUS_LABEL[campaign.status] ?? campaign.status}
                </span>
              </span>
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
        </div>
      </div>

      {/* Main bento grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Fluxo de Protocolo */}
        <div className="lg:col-span-2 p-[1px] rounded-xl bg-gradient-to-br from-[rgba(233,195,73,0.15)] to-transparent">
          <div className="bg-[rgba(42,42,42,0.7)] backdrop-blur-xl rounded-[calc(0.75rem-1px)] p-5 flex flex-col gap-4 shadow-[inset_0_0_20px_rgba(255,92,0,0.05),0_4px_30px_rgba(0,0,0,0.5)] min-h-[600px]">
            <div className="flex justify-between items-center">
              <h2 className="text-base font-semibold text-on-surface">
                Fluxo de Protocolo
              </h2>
              <AddStepForm campaignId={campaign.id} />
            </div>

            {/* Inner canvas */}
            <div className="flex-1 bg-[rgba(14,14,14,0.5)] border border-outline-variant/30 rounded-lg flex flex-row p-4 gap-6 overflow-hidden min-h-[500px]">
              {/* Left sub-col: Links & Prompts */}
              <div className="w-1/3 flex flex-col gap-4 h-full overflow-y-auto pr-1">
                {/* Links */}
                <div className="bg-[rgba(32,31,31,0.8)] border border-outline-variant/50 rounded-lg p-3 flex flex-col gap-3">
                  <h3 className="text-xs font-semibold text-on-surface flex items-center gap-2">
                    <span className="material-symbols-outlined text-tertiary text-[14px]">
                      link
                    </span>
                    Links
                  </h3>
                  {attachments.filter((a) => a.type === "link").length > 0 ? (
                    <ul className="flex flex-col gap-2">
                      {attachments
                        .filter((a) => a.type === "link")
                        .map((a) => (
                          <li
                            key={a.id}
                            className="text-[10px] text-tertiary hover:text-[#ffb59a] cursor-pointer flex items-center gap-2 font-bold uppercase tracking-widest"
                          >
                            <span className="material-symbols-outlined text-[12px]">
                              open_in_new
                            </span>
                            {a.path.split("/").pop()}
                          </li>
                        ))}
                    </ul>
                  ) : (
                    <p className="text-[10px] text-tertiary font-bold uppercase tracking-widest">
                      Nenhum link
                    </p>
                  )}
                </div>

                {/* Prompts */}
                <div className="bg-[rgba(32,31,31,0.8)] border border-outline-variant/50 rounded-lg p-3 flex flex-col gap-3 flex-1">
                  <h3 className="text-xs font-semibold text-on-surface flex items-center gap-2">
                    <span className="material-symbols-outlined text-tertiary text-[14px]">
                      terminal
                    </span>
                    Prompts
                  </h3>
                  {steps.length > 0 ? (
                    <div className="flex flex-col gap-2">
                      {steps.slice(0, 5).map((s) => (
                        <div
                          key={s.id}
                          className="p-2 bg-surface-container/50 border border-outline-variant/30 rounded text-[10px] font-mono text-tertiary break-all"
                        >
                          /{s.title.toLowerCase().replace(/\s+/g, "_")}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[10px] text-tertiary font-bold uppercase tracking-widest">
                      Nenhuma tarefa ainda
                    </p>
                  )}
                </div>
              </div>

              {/* Right sub-col: flow nodes */}
              <div className="w-2/3 relative flex flex-col items-center justify-start gap-10 py-4 overflow-y-auto h-full">
                {steps.length > 0 ? (
                  <>
                    <div className="absolute left-1/2 top-4 bottom-4 w-0 border-l-2 border-dashed border-[#ff5c00]/40 -translate-x-1/2 z-0" />
                    {steps.map((step, i) => (
                      <div
                        key={step.id}
                        className={`w-72 bg-[rgba(42,42,42,0.85)] backdrop-blur-xl border rounded-lg p-3 z-10 relative ${STEP_BORDER[step.status]}`}
                        style={
                          step.status === "in_progress"
                            ? { boxShadow: "0 0 15px rgba(255,92,0,0.2), inset 0 0 15px rgba(255,92,0,0.08)" }
                            : undefined
                        }
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <span
                            className={`material-symbols-outlined text-[14px] filled ${STEP_ICON_COLOR[step.status]}`}
                          >
                            {STEP_ICON[step.status]}
                          </span>
                          <span className="text-xs font-semibold text-on-surface">
                            {i + 1}. {step.title}
                          </span>
                        </div>
                        {step.description && (
                          <p className="text-[10px] font-bold uppercase tracking-widest text-tertiary mb-2 leading-relaxed">
                            {step.description}
                          </p>
                        )}
                        <div className="border-t border-outline-variant/30 pt-2 flex justify-between items-center mt-1">
                          {step.due_date ? (
                            <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-tertiary">
                              <span className="material-symbols-outlined text-[12px]">
                                calendar_today
                              </span>
                              {new Date(step.due_date).toLocaleDateString("pt-BR", {
                                day: "2-digit",
                                month: "short",
                              })}
                            </div>
                          ) : (
                            <span />
                          )}
                          <span
                            className={`text-[10px] font-bold uppercase tracking-widest ${STEP_STATUS_TEXT[step.status]}`}
                          >
                            {STEP_STATUS_LABEL[step.status]}
                          </span>
                        </div>
                      </div>
                    ))}
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center flex-1 text-center gap-3 h-full">
                    <span className="material-symbols-outlined text-[48px] text-tertiary">
                      account_tree
                    </span>
                    <p className="text-xs text-tertiary font-bold uppercase tracking-widest">
                      Adicione tarefas para ver o fluxo
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-4">
          {/* Campaign Details */}
          <div className="p-[1px] rounded-xl bg-gradient-to-br from-[rgba(233,195,73,0.15)] to-transparent">
            <div className="bg-[rgba(42,42,42,0.7)] backdrop-blur-xl rounded-[calc(0.75rem-1px)] p-5">
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
                  <span className="text-xs font-semibold text-on-surface">
                    {STATUS_LABEL[campaign.status] ?? campaign.status}
                  </span>
                </div>
                {campaign.estimated_value_brl && (
                  <div className="flex items-center justify-between p-3 bg-surface-container-high/30 rounded-lg border border-outline-variant/20">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-tertiary">
                      Valor Est.
                    </span>
                    <span className="text-xs font-semibold text-[#e9c349]">
                      R${" "}
                      {Number(campaign.estimated_value_brl).toLocaleString(
                        "pt-BR",
                        { minimumFractionDigits: 2 },
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
          </div>

          {/* Tasks checklist */}
          <div className="p-[1px] rounded-xl bg-gradient-to-br from-[rgba(233,195,73,0.15)] to-transparent flex-1">
            <div className="bg-[rgba(42,42,42,0.7)] backdrop-blur-xl rounded-[calc(0.75rem-1px)] p-5">
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
          </div>

          {/* File Dropzone */}
          <div className="p-[1px] rounded-xl bg-gradient-to-br from-[rgba(233,195,73,0.15)] to-transparent">
            <div className="bg-[rgba(42,42,42,0.7)] backdrop-blur-xl rounded-[calc(0.75rem-1px)] p-5">
              <AttachmentDropzone
                campaignId={campaign.id}
                userId={user.id}
                initial={attachments}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
