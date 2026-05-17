import Link from "next/link";
import type { Metadata } from "next";
import { PublicHeader } from "@/components/public/public-header";

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

      {/* Animated blobs */}
      <div className="aqua-blob pointer-events-none fixed" style={{ width: 600, height: 600, background: "#ff5c00", top: -150, right: -100, zIndex: 0 }} />
      <div className="aqua-blob aqua-blob--2 pointer-events-none fixed" style={{ width: 500, height: 500, background: "#ff8a3a", bottom: -80, left: -60, zIndex: 0 }} />

      <PublicHeader />

      <main className="flex-grow pt-32 pb-24 relative z-10">

        {/* ── Hero ── */}
        <section className="max-w-4xl mx-auto px-6 py-16 text-center sm:py-24">
          <div className="glass inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8" style={{ borderColor: "rgba(255,92,0,0.28)" }}>
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
          <div className="glass rounded-2xl p-10 text-center relative overflow-hidden" style={{ borderColor: "rgba(255,92,0,0.22)", boxShadow: "0 1px 0 rgba(255,255,255,0.10) inset, 0 0 60px rgba(255,92,0,0.06)" }}>
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
              <Link href="/auth/signup" className="aqua-pill-btn" style={{ borderRadius: 999, fontSize: 12, padding: "11px 28px" }}>
                Começar agora →
              </Link>
              <Link href="/auth/login" className="aqua-ghost-btn" style={{ fontSize: 12, padding: "11px 28px" }}>
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
    <div className="glass glass--dark relative p-8 rounded-xl flex flex-col gap-4 group transition-all duration-500" style={{ borderColor: "rgba(255,255,255,0.12)" }}>
      {/* Step number */}
      <span className="absolute right-6 top-6 text-3xl font-bold text-[#ff5c00]/10 select-none font-display">
        {number}
      </span>

      {/* Aqua icon */}
      <div className="w-12 h-12 rounded-xl flex items-center justify-center transition-colors"
        style={{ background: "linear-gradient(135deg, rgba(255,92,0,0.18) 0%, rgba(255,92,0,0.06) 100%)", border: "1px solid rgba(255,92,0,0.28)" }}>
        <span className="material-symbols-outlined text-[#ff7b33] text-[22px] group-hover:text-[#ffb59a] transition-colors filled">
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
    <div className="glass flex items-start gap-4 px-5 py-4 rounded-lg transition-all duration-200" style={{ borderColor: "rgba(255,255,255,0.10)" }}>
      <span className="material-symbols-outlined text-[#ff5c00] text-[18px] shrink-0 mt-0.5 filled">
        check_circle
      </span>
      <p className="text-sm text-on-surface leading-relaxed">{text}</p>
    </div>
  );
}
