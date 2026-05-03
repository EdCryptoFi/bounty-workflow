import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Calendar, Coins } from "lucide-react";
import { getCampaignById } from "@/lib/campaigns/queries";
import { daysUntil, parseDeadline, formatDeadlineFull } from "@/lib/campaigns/date-utils";
import { requireUser } from "@/lib/auth";
import { TaskCard } from "@/components/campaigns/task-card";
import { AddStepForm } from "@/components/campaigns/add-step-form";
import { WorkflowCanvas } from "@/components/campaigns/workflow-canvas";
import { AttachmentDropzone } from "@/components/campaigns/attachment-dropzone";
import { PageHeader, Card, Badge, SectionHeader, EmptyState } from "@/components/ui";

export const metadata: Metadata = { title: "Campanha" };

export default async function CampaignDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { user } = await requireUser();
  const data = await getCampaignById(params.id);
  if (!data) notFound();

  const { campaign, steps, attachments } = data;
  const deadline = parseDeadline(campaign.deadline);
  const daysLeft = daysUntil(campaign.deadline);

  const deadlineActions = (deadline || campaign.estimated_value_brl) ? (
    <div className="flex flex-col items-end gap-2 text-sm text-muted-foreground">
      {deadline && (
        <div className="inline-flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          {formatDeadlineFull(campaign.deadline)}
          {daysLeft !== null && (
            <Badge
              tone={daysLeft < 0 ? "danger" : daysLeft <= 7 ? "warning" : "mint"}
              size="xs"
            >
              {daysLeft < 0 ? `${Math.abs(daysLeft)}d atrás` : daysLeft === 0 ? "hoje" : `em ${daysLeft}d`}
            </Badge>
          )}
        </div>
      )}
      {campaign.estimated_value_brl && (
        <div className="inline-flex items-center gap-2">
          <Coins className="h-4 w-4" />
          R${" "}
          {Number(campaign.estimated_value_brl).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
        </div>
      )}
    </div>
  ) : undefined;

  return (
    <div className="space-y-6">
      <PageHeader
        title={campaign.title}
        subtitle={campaign.description ?? undefined}
        back={{ href: "/dashboard", label: "Voltar pra timeline" }}
        actions={deadlineActions}
      />

      {/* Workflow visual + Lista de tarefas */}
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <section className="space-y-3">
          <SectionHeader label="Workflow visual" />
          <WorkflowCanvas steps={steps} />
        </section>

        <section className="space-y-3">
          <SectionHeader label="Tarefas" count={steps.length} />
          <AddStepForm campaignId={campaign.id} />
          <div className="space-y-2">
            {steps.map((s) => (
              <TaskCard key={s.id} step={s} />
            ))}
            {steps.length === 0 && (
              <EmptyState
                title="Nenhuma tarefa ainda"
                size="sm"
              />
            )}
          </div>
        </section>
      </div>

      {/* Anexos */}
      <section className="space-y-3">
        <SectionHeader label="Anexos" count={attachments.length} />
        <AttachmentDropzone
          campaignId={campaign.id}
          userId={user.id}
          initial={attachments}
        />
      </section>
    </div>
  );
}
