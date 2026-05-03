import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowRight,
  Bell,
  Calendar,
  CheckCircle2,
  ClipboardList,
  GitBranch,
  Sparkles,
  Timer,
} from "lucide-react";
import { PublicHeader } from "@/components/public/public-header";
import { Badge, Card, buttonClasses } from "@/components/ui";

export const metadata: Metadata = {
  title: "Como funciona",
  description:
    "Entenda como o Bounty WorkFlow ajuda hunters brasileiros a organizar campanhas de bounties cripto, nunca perder um prazo e maximizar ganhos.",
};

export default function ComoFuncionaPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background via-background to-mint-50/30 dark:to-mint-900/10">
      <PublicHeader />

      {/* Hero */}
      <section className="container mx-auto max-w-4xl py-16 text-center sm:py-24">
        <Badge tone="mint" icon={<Sparkles className="h-3 w-3" />}>
          Tour de 3 minutos
        </Badge>
        <h1 className="typo-hero mt-6 text-balance">
          Como o Bounty WorkFlow funciona
        </h1>
        <p className="typo-hero-sub mx-auto mt-4 max-w-2xl text-pretty">
          A mesma rotina que um hunter de sucesso usa — agora num app só. Organize, acompanhe e
          entregue cada bounty antes do deadline vencer.
        </p>
      </section>

      {/* 4 steps */}
      <section className="container mx-auto max-w-5xl pb-16">
        <div className="grid gap-6 md:grid-cols-2">
          <Step
            number="01"
            icon={<ClipboardList className="h-5 w-5" />}
            title="Cadastre a campanha em 30 segundos"
            description="Cole o link, escolha o protocolo, defina o deadline. A app quebra em tarefas automaticamente com base no tipo de bounty (conteúdo, código, thread, etc)."
          />
          <Step
            number="02"
            icon={<Calendar className="h-5 w-5" />}
            title="Visualize tudo na timeline"
            description="Todas as suas campanhas ativas numa linha do tempo cronológica. O que vence em 24h fica destacado. O que já foi enviado some do radar automaticamente."
          />
          <Step
            number="03"
            icon={<GitBranch className="h-5 w-5" />}
            title="Abra o workflow da campanha"
            description="Clique numa campanha e veja o fluxo completo: pesquisa → rascunho → revisão → publicação → submissão. Anexe prints, links e notas em cada etapa."
          />
          <Step
            number="04"
            icon={<Bell className="h-5 w-5" />}
            title="Receba lembretes no tempo certo"
            description="Email 48h e 24h antes de cada deadline. Sem notificação spam. Se você atrasar, ela vai pro topo automaticamente."
          />
        </div>
      </section>

      {/* Rotina do hunter */}
      <section className="container mx-auto max-w-4xl py-16">
        <h2 className="typo-h2 text-center">
          Uma rotina feita pra quem caça bounty sério
        </h2>
        <p className="typo-body mx-auto mt-4 max-w-2xl text-center text-muted-foreground">
          Se você já perdeu um bounty de R$500 por esquecer o deadline, sabe como essa ferramenta
          paga ela mesma em 1 caçada.
        </p>

        <div className="mt-12 space-y-4">
          <Bullet text="Catálogo atualizado dos principais protocolos (LayerZero, Hyperliquid, Monad, EigenLayer, etc)." />
          <Bullet text="Campos específicos pra bounty cripto: wallet, TX hash, link da submissão, recompensa esperada." />
          <Bullet text="Export CSV das suas campanhas pra colar no Excel e declarar no IR." />
          <Bullet text="Tudo seu fica salvo no seu workspace — nada é compartilhado com outros hunters." />
          <Bullet text="Feito pra BR: preços em Real, interface em português, suporte via email." />
        </div>
      </section>

      {/* Pricing + CTA */}
      <section className="container mx-auto max-w-3xl py-16">
        <Card className="rounded-3xl border-mint-200 bg-mint-50/50 text-center shadow-sm dark:border-mint-800 dark:bg-mint-900/20">
          <Badge tone="mint" icon={<Timer className="h-3 w-3" />} className="bg-mint-600 text-white dark:bg-mint-600 dark:text-white">
            14 dias grátis
          </Badge>
          <h2 className="typo-h2 mt-4">Experimenta sem compromisso</h2>
          <p className="typo-body mx-auto mt-3 max-w-lg text-muted-foreground">
            14 dias grátis, sem cartão. Depois, R$ 29,90/mês — ou cancela quando quiser, sem
            pergunta.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/auth/signup"
              className={buttonClasses("primary", "lg")}
            >
              Começar agora <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/auth/login"
              className={buttonClasses("secondary", "lg")}
            >
              Já tenho conta
            </Link>
          </div>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card/30">
        <div className="container mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 py-8 text-sm text-muted-foreground">
          <span>© {new Date().getFullYear()} Bounty WorkFlow — por Ed</span>
          <nav className="flex flex-wrap items-center gap-4">
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

function Step({
  number,
  icon,
  title,
  description,
}: {
  number: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Card className="relative rounded-2xl">
      <span className="absolute right-6 top-6 text-3xl font-bold text-mint-200 dark:text-mint-900">
        {number}
      </span>
      <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-mint-100 text-mint-700 dark:bg-mint-900/40 dark:text-mint-300">
        {icon}
      </div>
      <h3 className="typo-h3 mt-4 pr-14">{title}</h3>
      <p className="typo-caption mt-2 text-muted-foreground">{description}</p>
    </Card>
  );
}

function Bullet({ text }: { text: string }) {
  return (
    <Card padding="tight" className="flex items-start gap-3 rounded-lg">
      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-mint-600" />
      <p className="typo-caption">{text}</p>
    </Card>
  );
}
