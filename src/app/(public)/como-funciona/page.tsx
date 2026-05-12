import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Como Funciona — Bounty WorkFlow",
  description:
    "Veja como o Bounty WorkFlow ajuda hunters cripto a organizar campanhas, nunca perder um deadline e maximizar recompensas. Simples, direto e feito para o Brasil.",
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_APP_URL ?? "https://bountywork.xyz"}/como-funciona`,
  },
  openGraph: {
    title: "Como Funciona o Bounty WorkFlow",
    description:
      "Organize protocolos, crie campanhas, receba alertas antes dos deadlines. Tudo em um só lugar.",
    url: `${process.env.NEXT_PUBLIC_APP_URL ?? "https://bountywork.xyz"}/como-funciona`,
  },
};

export default function ComoFuncionaPage() {
  return (
    <div
      className="min-h-screen flex flex-col text-on-surface antialiased overflow-x-hidden relative"
      style={{ backgroundColor: "#131313" }}
    >
      {/* Grid texture */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* Ambient glow */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 15% 20%, rgba(255,92,0,0.08) 0%, transparent 60%), radial-gradient(ellipse 50% 30% at 85% 80%, rgba(233,195,73,0.06) 0%, transparent 60%)",
        }}
      />

      {/* ── Fixed Header ── */}
      <header
        className="fixed z-50 top-0 left-0 right-0 flex justify-between items-center px-12 h-20 border-b border-zinc-800/50 shadow-[0_4px_30px_rgba(0,0,0,0.5)]"
        style={{ background: "rgba(9,9,9,0.70)", backdropFilter: "blur(24px)" }}
      >
        <Link href="/">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-horizontal.png" alt="Bounty Workflow" className="h-9 object-contain" />
        </Link>

        <nav className="flex items-center gap-6">
          <Link href="/como-funciona" className="text-[#ff7b33] text-xs font-medium hover:text-[#ffb59a] transition-colors">
            Como funciona
          </Link>
          <Link href="/auth/login" className="text-zinc-400 text-xs hover:text-[#ff7b33] transition-colors">
            Entrar
          </Link>
          <Link
            href="/auth/signup"
            className="px-5 py-2 bg-[#ff5c00] text-white text-xs font-bold uppercase tracking-widest rounded hover:bg-[#ff7b33] hover:shadow-[0_0_20px_rgba(255,92,0,0.4)] transition-all duration-300 active:scale-95"
          >
            Começar grátis
          </Link>
        </nav>
      </header>

      <main className="flex-grow pt-32 pb-24 relative z-10">

        {/* ── Hero ── */}
        <section className="max-w-4xl mx-auto px-6 py-16 text-center sm:py-24">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#e9c349]/30 mb-8"
            style={{ background: "rgba(32,31,31,0.7)", backdropFilter: "blur(20px)" }}>
            <span className="material-symbols-outlined text-[#e9c349] text-[14px] filled">timer</span>
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#e9c349]">
              Tour de 3 minutos
            </span>
          </div>

          <h1 className="text-[48px] sm:text-[56px] font-bold tracking-tight leading-[1.1] text-on-surface mb-6">
            Como o{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #ffb59a 0%, #ff5c00 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Bounty WorkFlow
            </span>{" "}
            funciona
          </h1>

          <p className="text-base text-tertiary max-w-2xl mx-auto leading-relaxed">
            A mesma rotina que um hunter de sucesso usa — agora num app só. Organize, acompanhe e
            entregue cada bounty antes do deadline vencer.
          </p>
        </section>

        {/* ── 4 Steps ── */}
        <section className="max-w-5xl mx-auto px-6 pb-24">
          <div className="grid gap-6 md:grid-cols-2">
            <StepCard
              number="01"
              icon="assignment_add"
              title="Cadastre a campanha em 30 segundos"
              description="Cole o link, escolha o protocolo, defina o deadline. A app quebra em tarefas automaticamente com base no tipo de bounty (conteúdo, código, thread, etc)."
            />
            <StepCard
              number="02"
              icon="calendar_month"
              title="Visualize tudo na timeline"
              description="Todas as suas campanhas ativas numa linha do tempo cronológica. O que vence em 24h fica destacado. O que já foi enviado some do radar automaticamente."
            />
            <StepCard
              number="03"
              icon="account_tree"
              title="Abra o workflow da campanha"
              description="Clique numa campanha e veja o fluxo completo: pesquisa → rascunho → revisão → publicação → submissão. Anexe prints, links e notas em cada etapa."
            />
            <StepCard
              number="04"
              icon="notifications_active"
              title="Receba lembretes no tempo certo"
              description="Email 48h e 24h antes de cada deadline. Sem notificação spam. Se você atrasar, ela vai pro topo automaticamente."
            />
          </div>
        </section>

        {/* ── Rotina do hunter ── */}
        <section className="max-w-4xl mx-auto px-6 pb-24">
          <div className="text-center mb-14">
            <h2 className="text-[32px] font-bold text-on-surface mb-4 tracking-tight">
              Uma rotina feita pra quem caça{" "}
              <span className="text-[#ff5c00]">bounty</span> sério
            </h2>
            <p className="text-base text-tertiary max-w-xl mx-auto leading-relaxed">
              Se você já perdeu um bounty de R$500 por esquecer o deadline, sabe como essa
              ferramenta paga ela mesma em 1 caçada.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <BulletCard text="Catálogo atualizado dos principais protocolos (Clasho, Kreators, MagVerse, Rally, e mais)." />
            <BulletCard text="Campos específicos pra bounty cripto: wallet, TX hash, link da submissão, recompensa esperada." />
            <BulletCard text="Conexão direta com Google Drive — anexe evidências, prints e documentos direto do seu Drive." />
            <BulletCard text="Export CSV das suas campanhas para análise e controle de ganhos." />
            <BulletCard text="Tudo seu fica salvo no seu workspace — nada é compartilhado com outros hunters." />
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="max-w-3xl mx-auto px-6 pb-16">
          <div
            className="rounded-2xl p-10 text-center relative overflow-hidden"
            style={{
              background: "rgba(32,31,31,0.7)",
              backdropFilter: "blur(20px)",
              border: "1px solid transparent",
              borderImage: "linear-gradient(to bottom right, rgba(233,195,73,0.4), rgba(233,195,73,0.1)) 1",
              boxShadow: "inset 0 0 30px rgba(255,92,0,0.06)",
            }}
          >
            {/* Glow top */}
            <div
              className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-px"
              style={{ background: "linear-gradient(to right, transparent, rgba(255,92,0,0.6), transparent)" }}
            />

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#ff5c00]/30 mb-6"
              style={{ background: "rgba(255,92,0,0.08)" }}>
              <span
                className="w-2 h-2 rounded-full bg-[#ff5c00] animate-pulse"
                style={{ boxShadow: "0 0 8px #ff5c00" }}
              />
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#ff5c00]">
                14 dias grátis
              </span>
            </div>

            <h2 className="text-[28px] font-bold text-on-surface mb-3 tracking-tight">
              Experimenta sem compromisso
            </h2>
            <p className="text-sm text-tertiary max-w-md mx-auto leading-relaxed mb-8">
              14 dias grátis, sem cartão. Depois, R$ 29,90/mês — ou cancela quando quiser, sem
              pergunta.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/auth/signup"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#ff5c00] hover:bg-[#ff7b33] text-white text-xs font-bold uppercase tracking-widest rounded transition-all duration-300 hover:shadow-[0_0_25px_rgba(255,92,0,0.5)] active:scale-95"
              >
                Começar agora
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </Link>
              <Link
                href="/auth/login"
                className="inline-flex items-center gap-2 px-8 py-3.5 text-on-surface text-xs font-bold uppercase tracking-widest rounded border border-outline-variant/40 hover:border-[#e9c349]/40 transition-all duration-300"
                style={{ background: "rgba(42,42,42,0.5)" }}
              >
                Já tenho conta
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* ── Footer ── */}
      <footer
        className="relative z-10 border-t border-zinc-900 py-8 px-12 flex flex-col md:flex-row justify-between items-center gap-4 mt-auto"
        style={{
          background: "#000",
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.02) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      >
        <p className="text-zinc-400 text-[10px] uppercase tracking-[0.2em] font-semibold">
          © {new Date().getFullYear()} BOUNTY WORKFLOW. TODOS OS DIREITOS RESERVADOS.
        </p>
        <div className="flex gap-8">
          <Link href="/legal/privacidade" className="text-zinc-600 text-[10px] uppercase tracking-[0.2em] font-semibold hover:text-[#e9c349] transition-colors">
            Privacidade
          </Link>
          <Link href="/legal/termos" className="text-zinc-600 text-[10px] uppercase tracking-[0.2em] font-semibold hover:text-[#e9c349] transition-colors">
            Termos de uso
          </Link>
          <span className="text-zinc-600 text-[10px] uppercase tracking-[0.2em] font-semibold flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ff5c00]" />
            Status do Sistema
          </span>
        </div>
      </footer>
    </div>
  );
}

function StepCard({
  number,
  icon,
  title,
  description,
}: {
  number: string;
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div
      className="relative p-8 rounded-xl flex flex-col gap-4 group hover:shadow-[inset_0_0_20px_rgba(255,92,0,0.08)] transition-all duration-500"
      style={{
        background: "rgba(32,31,31,0.7)",
        backdropFilter: "blur(20px)",
        border: "1px solid transparent",
        borderImage: "linear-gradient(to bottom right, rgba(233,195,73,0.3), rgba(233,195,73,0.08)) 1",
      }}
    >
      {/* Step number */}
      <span className="absolute right-6 top-6 text-3xl font-bold text-[#e9c349]/15 select-none">
        {number}
      </span>

      {/* Icon */}
      <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center border border-[#e9c349]/20 group-hover:border-[#ff5c00]/40 transition-colors">
        <span className="material-symbols-outlined text-[#e9c349] text-[22px] group-hover:text-[#ff5c00] transition-colors filled">
          {icon}
        </span>
      </div>

      <div className="pr-10">
        <h3 className="text-base font-semibold text-on-surface mb-2">{title}</h3>
        <p className="text-sm text-tertiary leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

function BulletCard({ text }: { text: string }) {
  return (
    <div
      className="flex items-start gap-4 px-5 py-4 rounded-lg hover:bg-surface-container-high/20 transition-colors"
      style={{
        background: "rgba(32,31,31,0.5)",
        backdropFilter: "blur(12px)",
        border: "1px solid rgba(91,65,55,0.3)",
      }}
    >
      <span className="material-symbols-outlined text-[#e9c349] text-[18px] shrink-0 mt-0.5 filled">
        check_circle
      </span>
      <p className="text-sm text-on-surface leading-relaxed">{text}</p>
    </div>
  );
}
