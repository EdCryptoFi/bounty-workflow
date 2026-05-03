import Link from "next/link";
import { ArrowRight, Clock, GitBranch, Sparkles } from "lucide-react";
import { PublicHeader } from "@/components/public/public-header";
import { Badge, Button, Card, buttonClasses } from "@/components/ui";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background via-background to-mint-50/40 dark:to-mint-900/10">
      <PublicHeader />

      {/* Hero */}
      <section className="container mx-auto max-w-5xl py-20 text-center sm:py-32">
        <Badge tone="mint" icon={<Sparkles className="h-3 w-3" />}>
          14 dias grátis · sem cartão
        </Badge>
        <h1 className="typo-hero mt-6 text-balance">
          Nunca mais perca um{" "}
          <span className="bg-gradient-to-r from-mint-500 to-mint-700 bg-clip-text text-transparent">
            bounty
          </span>{" "}
          por prazo vencido.
        </h1>
        <p className="typo-hero-sub mx-auto mt-6 max-w-2xl text-pretty">
          Organize campanhas, visualize deadlines e receba lembretes no tempo certo — feito pra
          hunters do Brasil.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/auth/signup"
            className={buttonClasses("primary", "lg")}
          >
            Começar grátis <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/como-funciona"
            className={buttonClasses("secondary", "lg")}
          >
            Como funciona
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto max-w-5xl grid gap-6 pb-24 sm:grid-cols-3">
        <Feature
          icon={<Clock className="h-5 w-5" />}
          title="Timeline por deadline"
          description="Veja todas as campanhas numa linha do tempo. O que é urgente vai pra cima."
        />
        <Feature
          icon={<GitBranch className="h-5 w-5" />}
          title="Workflow visual"
          description="Clique numa campanha e abra o fluxo completo: tarefas, dependências, anexos."
        />
        <Feature
          icon={<Sparkles className="h-5 w-5" />}
          title="Lembretes no tempo certo"
          description="Email e notificações antes de deadline, sem spam."
        />
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card/30">
        <div className="container mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 py-8 text-sm text-muted-foreground">
          <span>© {new Date().getFullYear()} Bounty WorkFlow — por Ed</span>
          <nav className="flex flex-wrap items-center gap-4">
            <Link href="/como-funciona" className="hover:text-foreground">
              Como funciona
            </Link>
            <Link href="/legal/termos" className="hover:text-foreground">
              Termos de uso
            </Link>
            <Link href="/legal/privacidade" className="hover:text-foreground">
              Privacidade
            </Link>
          </nav>
        </div>
      </footer>
    </main>
  );
}

function Feature({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Card className="rounded-2xl">
      <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-mint-100 text-mint-700 dark:bg-mint-900/40 dark:text-mint-300">
        {icon}
      </div>
      <h3 className="typo-h3 mt-4">{title}</h3>
      <p className="typo-caption mt-2 text-muted-foreground">{description}</p>
    </Card>
  );
}
