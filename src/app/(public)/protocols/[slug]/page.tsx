import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ExternalLink, Sparkles } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

type Props = { params: { slug: string } };

export const revalidate = 3600;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("protocols")
    .select("name, description")
    .eq("slug", params.slug)
    .eq("is_active", true)
    .maybeSingle();

  if (!data) return { title: "Protocolo não encontrado" };
  return {
    title: `${data.name} — bounty & airdrop`,
    description:
      data.description ?? `Organize suas caças de bounty do ${data.name} no Bounty WorkFlow.`,
  };
}

export default async function ProtocolDetailPage({ params }: Props) {
  const supabase = await createClient();
  const { data: protocol } = await supabase
    .from("protocols")
    .select("*")
    .eq("slug", params.slug)
    .eq("is_active", true)
    .maybeSingle();

  if (!protocol) notFound();

  return (
    <main className="min-h-screen bg-gradient-to-b from-background via-background to-mint-50/30">
      <header className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-mint-500 text-white">
            <Sparkles className="h-4 w-4" />
          </span>
          Bounty WorkFlow
        </Link>
        <Link
          href="/auth/signup"
          className="rounded-lg bg-mint-600 px-4 py-2 text-sm text-white transition hover:bg-mint-700"
        >
          Começar grátis
        </Link>
      </header>

      <section className="container mx-auto max-w-3xl py-12">
        <Link
          href="/protocols"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Todos os protocolos
        </Link>

        <div className="mt-8 rounded-3xl border border-border bg-card p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{protocol.name}</h1>
              <div className="mt-2 flex flex-wrap gap-1.5 text-xs">
                {protocol.category && (
                  <span className="rounded-full bg-mint-50 px-2.5 py-1 font-medium text-mint-800">
                    {protocol.category}
                  </span>
                )}
              </div>
            </div>
            {protocol.website_url && (
              <a
                href={protocol.website_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm transition hover:bg-muted"
              >
                Site oficial <ExternalLink className="h-3.5 w-3.5" />
              </a>
            )}
          </div>

          {protocol.description && (
            <p className="mt-6 text-pretty text-base leading-relaxed text-muted-foreground">
              {protocol.description}
            </p>
          )}
        </div>

        <div className="mt-8 rounded-2xl border border-mint-200 bg-mint-50/50 p-6 text-center">
          <h3 className="font-semibold">
            Caçando bounty do {protocol.name}? Organize no Bounty WorkFlow.
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Crie uma campanha em 30s com deadline, tarefas e lembretes.
          </p>
          <Link
            href="/auth/signup"
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-mint-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-mint-700"
          >
            Começar grátis <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}
