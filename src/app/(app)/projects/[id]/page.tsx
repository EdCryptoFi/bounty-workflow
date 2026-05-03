import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Plus } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { listCampaignsByProtocol } from "@/lib/campaigns/queries";
import { createClient } from "@/lib/supabase/server";
import { Timeline } from "@/components/campaigns/timeline";
import type { Protocol } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("protocols")
    .select("name")
    .eq("id", params.id)
    .maybeSingle();
  return { title: data?.name ?? "Projeto" };
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await requireUser();

  const supabase = await createClient();
  const { data: protocol } = await supabase
    .from("protocols")
    .select("id, name, slug, description, category, website_url")
    .eq("id", id)
    .maybeSingle<
      Pick<Protocol, "id" | "name" | "slug" | "description" | "category" | "website_url">
    >();

  if (!protocol) notFound();

  const campaigns = await listCampaignsByProtocol(id);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <Link
            href="/projects"
            className="mt-1 rounded-lg border border-border bg-card p-1.5 text-muted-foreground transition hover:text-foreground"
            aria-label="Voltar para Projetos"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">{protocol.name}</h1>
            <p className="text-sm text-muted-foreground">
              {protocol.description ??
                `Campanhas ativas do protocolo ${protocol.name}.`}
            </p>
          </div>
        </div>
        <Link
          href="/campaigns/new"
          className="inline-flex items-center gap-2 rounded-lg bg-mint-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-mint-700"
        >
          <Plus className="h-4 w-4" /> Nova campanha
        </Link>
      </div>

      {campaigns.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-muted/20 p-12 text-center">
          <p className="text-sm text-muted-foreground">
            Nenhuma campanha ativa para {protocol.name}.
          </p>
          <Link
            href="/campaigns/new"
            className="mt-4 inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium transition hover:bg-muted"
          >
            <Plus className="h-4 w-4" /> Criar campanha
          </Link>
        </div>
      ) : (
        <Timeline campaigns={campaigns} />
      )}
    </div>
  );
}
