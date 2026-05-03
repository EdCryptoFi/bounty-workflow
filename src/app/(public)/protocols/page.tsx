import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Catálogo de protocolos cripto com bounty",
  description:
    "Lista curada de protocolos cripto com programas de bounty, airdrop e quests ativos. Organize suas caçadas no Bounty WorkFlow.",
  openGraph: {
    title: "Protocolos com bounty cripto",
    description: "12+ protocolos monitorados com deadlines e oportunidades ativas.",
  },
};

export const revalidate = 3600; // ISR — revalida a cada 1h

export default async function ProtocolsPublicPage() {
  const supabase = await createClient();
  const { data: protocols } = await supabase
    .from("protocols")
    .select("id, slug, name, description, category, website_url")
    .eq("is_active", true)
    .order("name");

  return (
    <main className="min-h-screen bg-gradient-to-b from-background via-background to-mint-50/30">
      <header className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-mint-500 text-white">
            <Sparkles className="h-4 w-4" />
          </span>
          Bounty WorkFlow
        </Link>
        <nav className="flex items-center gap-3 text-sm">
          <Link href="/auth/login" className="text-muted-foreground hover:text-foreground">
            Entrar
          </Link>
          <Link
            href="/auth/signup"
            className="rounded-lg bg-mint-600 px-4 py-2 text-white transition hover:bg-mint-700"
          >
            Começar grátis
          </Link>
        </nav>
      </header>

      <section className="container mx-auto max-w-5xl py-16">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-mint-200 bg-mint-50 px-3 py-1 text-xs font-medium text-mint-800">
            Catálogo
          </span>
          <h1 className="mt-4 text-balance text-4xl font-bold tracking-tight">
            Protocolos cripto com bounty ativos
          </h1>
          <p className="mt-3 text-pretty text-muted-foreground">
            Lista curada dos maiores protocolos com programas de airdrop, quests e missions.
            Organize sua caçada no Bounty WorkFlow e não perca mais deadlines.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {(protocols ?? []).map((p) => (
            <Link
              key={p.id}
              href={`/protocols/${p.slug}`}
              className="group rounded-2xl border border-border bg-card p-5 transition hover:border-mint-300 hover:shadow-sm"
            >
              <div className="flex items-start justify-between">
                <h2 className="font-semibold group-hover:text-mint-700">{p.name}</h2>
                <ArrowRight className="h-4 w-4 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-mint-600" />
              </div>
              {p.description && (
                <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                  {p.description}
                </p>
              )}
              <div className="mt-3 flex flex-wrap gap-1.5 text-[11px]">
                {p.category && (
                  <span className="rounded-full bg-mint-50 px-2 py-0.5 text-mint-800">
                    {p.category}
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-16 rounded-3xl border border-mint-200 bg-mint-50/50 p-8 text-center">
          <h3 className="text-xl font-semibold">Nunca mais perca um bounty por deadline</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Crie sua conta grátis e comece a organizar suas caçadas em 2 minutos.
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
