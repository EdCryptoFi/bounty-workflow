import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLink, FolderKanban, Plus } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { getProjectStats } from "@/lib/campaigns/queries";
import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = { title: "Projetos" };
export const dynamic = "force-dynamic";

const GRADIENT_COLORS = [
  "from-purple-500 to-pink-500",
  "from-amber-500 to-orange-500",
  "from-sky-500 to-indigo-500",
  "from-emerald-500 to-teal-500",
  "from-rose-500 to-red-500",
  "from-violet-500 to-purple-500",
  "from-cyan-500 to-blue-500",
  "from-mint-500 to-teal-600",
];

function protocolGradient(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) & 0xffff;
  return GRADIENT_COLORS[hash % GRADIENT_COLORS.length];
}

function formatBRL(value: number): string {
  if (value <= 0) return "—";
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);
}

export default async function ProjectsPage() {
  await requireUser();

  const supabase = await createClient();
  const [projects, { data: creatorProtocols }] = await Promise.all([
    getProjectStats(),
    supabase
      .from("protocols")
      .select("id, name, website_url")
      .eq("category", "Creator")
      .eq("is_active", true)
      .order("name"),
  ]);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Projetos</h1>
          <p className="text-sm text-muted-foreground">
            Campanhas agrupadas por protocolo. Clique para ver a timeline do projeto.
          </p>
        </div>
        <Link
          href="/campaigns/new"
          className="inline-flex items-center gap-2 rounded-lg bg-mint-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-mint-700"
        >
          <Plus className="h-4 w-4" /> Nova campanha
        </Link>
      </div>

      {/* Acesso rápido — plataformas Creator */}
      {(creatorProtocols ?? []).length > 0 && (
        <section className="space-y-3">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Plataformas
          </h2>
          <div className="flex flex-wrap gap-2">
            {(creatorProtocols ?? []).map((p) => (
              <a
                key={p.id}
                href={p.website_url ?? "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium transition hover:border-mint-300 hover:bg-muted hover:text-mint-700 dark:hover:text-mint-300"
              >
                <span
                  className={`grid h-5 w-5 shrink-0 place-items-center rounded bg-gradient-to-br ${protocolGradient(p.name)} text-[10px] font-bold text-white`}
                >
                  {p.name[0].toUpperCase()}
                </span>
                {p.name}
                <ExternalLink className="h-3 w-3 text-muted-foreground transition group-hover:text-mint-500" />
              </a>
            ))}
          </div>
        </section>
      )}

      {/* Campanhas por protocolo */}
      <section className="space-y-3">
        {projects.length > 0 && (
          <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Campanhas ativas
          </h2>
        )}

        {projects.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-muted/20 p-12 text-center">
            <FolderKanban className="mx-auto mb-3 h-10 w-10 text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">
              Nenhum projeto ainda. Crie uma campanha vinculada a um protocolo para ver aqui.
            </p>
            <Link
              href="/campaigns/new"
              className="mt-4 inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium transition hover:bg-muted"
            >
              <Plus className="h-4 w-4" /> Criar campanha
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((p) => (
              <Link key={p.protocol_id} href={`/projects/${p.protocol_id}`} className="group block">
                <Card
                  padding="tight"
                  className="h-full transition hover:border-mint-300 hover:shadow-sm"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-gradient-to-br ${protocolGradient(p.protocol_name)} text-sm font-bold text-white`}
                    >
                      {p.protocol_name[0].toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h2 className="min-w-0 flex-1 truncate font-semibold text-foreground group-hover:text-mint-700 dark:group-hover:text-mint-300">
                          {p.protocol_name}
                        </h2>
                        {p.protocol_category && p.protocol_category !== "Creator" && (
                          <Badge tone="neutral" size="xs">
                            {p.protocol_category}
                          </Badge>
                        )}
                      </div>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {p.campaign_count} {p.campaign_count === 1 ? "campanha" : "campanhas"} ·{" "}
                        {p.active_count} {p.active_count === 1 ? "ativa" : "ativas"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 border-t border-border pt-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Valor estimado</span>
                      <span
                        className={
                          p.total_value_brl > 0
                            ? "font-semibold text-mint-700 dark:text-mint-300"
                            : "text-muted-foreground"
                        }
                      >
                        {formatBRL(p.total_value_brl)}
                      </span>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
