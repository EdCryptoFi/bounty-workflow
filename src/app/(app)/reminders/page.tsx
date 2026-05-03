import type { Metadata } from "next";
import { Bell } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { CreateReminderForm } from "./create-form";
import { CancelReminderButton } from "./cancel-button";
import { PageHeader, Card, SectionHeader, EmptyState, Badge } from "@/components/ui";

export const metadata: Metadata = { title: "Lembretes" };
export const dynamic = "force-dynamic";

type ReminderRow = {
  id: string;
  channel: "email" | "push" | "in_app";
  trigger_at: string;
  message: string | null;
  status: "pending" | "sent" | "failed" | "snoozed" | "canceled";
  campaigns: { id: string; title: string } | null;
};

export default async function RemindersPage() {
  const supabase = await createClient();
  const { data: campaigns } = await supabase
    .from("campaigns")
    .select("id, title")
    .is("archived_at", null)
    .order("created_at", { ascending: false });

  const { data: reminders } = await supabase
    .from("reminders")
    .select("id, channel, trigger_at, message, status, campaigns(id, title)")
    .order("trigger_at", { ascending: true })
    .returns<ReminderRow[]>();

  return (
    <div className="space-y-8">
      <PageHeader
        title="Lembretes"
        subtitle="Configure alertas antes do deadline. O cron roda a cada 5 minutos."
      />

      <Card as="section">
        <SectionHeader label="Novo lembrete" />
        <CreateReminderForm campaigns={campaigns ?? []} />
      </Card>

      <section className="space-y-3">
        <SectionHeader label="Agendados" count={(reminders ?? []).length} />
        {(reminders ?? []).length === 0 ? (
          <EmptyState
            title="Nenhum lembrete agendado"
            size="sm"
          />
        ) : (
          <ul className="space-y-2">
            {reminders!.map((r) => (
              <li
                key={r.id}
                className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3"
              >
                <Bell className="h-4 w-4 text-muted-foreground" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">
                    {r.campaigns?.title ?? "Lembrete"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(r.trigger_at).toLocaleString("pt-BR")} · {r.channel}
                  </p>
                  {r.message && (
                    <p className="mt-0.5 truncate text-xs text-muted-foreground">
                      {r.message}
                    </p>
                  )}
                </div>
                <StatusBadge status={r.status} />
                {r.status === "pending" && <CancelReminderButton id={r.id} />}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function StatusBadge({ status }: { status: ReminderRow["status"] }) {
  const map: Record<ReminderRow["status"], { label: string; tone: "mint" | "success" | "danger" | "warning" | "neutral" }> = {
    pending: { label: "Agendado", tone: "mint" },
    sent: { label: "Enviado", tone: "success" },
    failed: { label: "Falhou", tone: "danger" },
    snoozed: { label: "Adiado", tone: "warning" },
    canceled: { label: "Cancelado", tone: "neutral" },
  };
  const cfg = map[status];
  return (
    <Badge tone={cfg.tone} size="xs">
      {cfg.label}
    </Badge>
  );
}
