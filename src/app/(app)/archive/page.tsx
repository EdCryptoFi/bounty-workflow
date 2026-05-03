import Link from "next/link";
import { Archive, Download } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { formatDeadlineFull } from "@/lib/campaigns/date-utils";
import { UnarchiveButton } from "./unarchive-button";
import { PageHeader, Card, EmptyState, buttonClasses } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function ArchivePage() {
  await requireUser();
  const supabase = await createClient();

  const { data: campaigns, error } = await supabase
    .from("campaigns")
    .select(
      `id, title, status, deadline, estimated_value_brl,
       archived_at, created_at, protocol:protocols(name, slug)`,
    )
    .not("archived_at", "is", null)
    .order("archived_at", { ascending: false })
    .limit(500);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Arquivo"
        subtitle="Campanhas arquivadas. Você pode restaurar ou exportar."
        actions={
          <a
            href="/api/export/campaigns?scope=archived"
            className={buttonClasses("secondary", "md")}
          >
            <Download className="h-4 w-4" />
            Export CSV
          </a>
        }
      />

      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive">
          {error.message}
        </div>
      )}

      {!campaigns || campaigns.length === 0 ? (
        <EmptyState
          icon={Archive}
          title="Nada no arquivo"
          description="Campanhas que você arquivar aparecem aqui."
        />
      ) : (
        <Card className="overflow-hidden" padding="tight">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-4 py-3 font-medium">Campanha</th>
                <th className="px-4 py-3 font-medium">Protocolo</th>
                <th className="px-4 py-3 font-medium">Deadline</th>
                <th className="px-4 py-3 font-medium">Arquivado em</th>
                <th className="px-4 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map((c) => {
                const protocol = Array.isArray(c.protocol) ? c.protocol[0] : c.protocol;
                return (
                  <tr key={c.id} className="border-b border-border last:border-0">
                    <td className="px-4 py-3">
                      <Link href={`/campaigns/${c.id}`} className="font-medium hover:underline">
                        {c.title}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {protocol?.name ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {formatDeadlineFull(c.deadline)}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {c.archived_at
                        ? new Date(c.archived_at).toLocaleDateString("pt-BR")
                        : "—"}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <UnarchiveButton id={c.id} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}
