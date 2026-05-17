"use client";

import Link from "next/link";

const PHASES = [
  {
    id: 1,
    name: "Fundação",
    status: "completed" as const,
    icon: "check_circle",
    color: "#22c55e",
    description:
      "A base do Bounty WorkFlow está sólida. Organização de campanhas, autenticação, pagamentos, lembretes e o design system Solaris Glass — tudo pronto pra você começar.",
    items: [
      "Auth (email, Google, X OAuth, magic link)",
      "App Shell com sidebar, topbar, busca global",
      "Campanhas: timeline, workflow canvas, tarefas, anexos",
      "Catálogo de Protocolos (público + admin)",
      "Lembretes por e-mail (cron Vercel + Resend)",
      "Pagamentos: Mercado Pago + Stripe",
      "Arquivo + Export CSV com proteção",
      "Design System Solaris Glass (dark glassmorphism)",
      "Bounty AI — Analisador Phoenix + rewriter",
      "Admin, Referral System",
    ],
  },
  {
    id: 2,
    name: "Marketing & Social Media",
    status: "in_progress" as const,
    icon: "local_fire_department",
    color: "#ff5c00",
    description:
      "A fase mais quente. Publicar resultados no X com IA, agendar posts, conectar comunidades e dar visibilidade ao seu trabalho. É aqui que o Bounty WorkFlow vira sua vitrine.",
    items: [
      "X API — Publicar posts com Bounty AI (OAuth 2.0)",
      "Agendador de posts multi-rede (fila, rascunhos)",
      "WhatsApp / Telegram Bot — Alpha direct para assinantes",
      "Compartilhamento de progresso nas redes",
      "Campanhas virais & Referral 2.0",
      "Analytics de engajamento dos posts",
      "Templates de post para bounties",
      "Integração com Agências de Marketing Web3",
    ],
  },
  {
    id: 3,
    name: "Web3 & Integrações",
    status: "upcoming" as const,
    icon: "hexagon",
    color: "#e9c349",
    description:
      "Conectar o mundo on-chain. Wallet, blockchain própria, APIs abertas e um marketplace de bounties pra você encontrar as melhores oportunidades.",
    items: [
      "Wallet Connect (conectar carteira, provas on-chain)",
      "Blockchain própria + nós Depin (MVP)",
      "API Pública REST + Webhooks de saída",
      "Mercado / Discovery de Bounties (feed curado)",
      "Campanhas Exclusivas (convite, senha, curadoria)",
    ],
  },
  {
    id: 4,
    name: "Engajamento & Escala",
    status: "upcoming" as const,
    icon: "rocket_launch",
    color: "#a78bfa",
    description:
      "Gamificação, times, mobile, internacionalização. Transformar o Bounty WorkFlow em uma plataforma global de bounty hunting.",
    items: [
      "Gamificação (XP, níveis, streaks, badges, leaderboard)",
      "PWA + Modo Offline (instalável, consulta sem internet)",
      "Notificações Push (browser)",
      "Colaboração em Equipe (compartilhado, permissões)",
      "Templates de Campanha (modelos prontos)",
      "i18n (multi-idioma: PT-BR → EN, ES)",
      "Testes E2E (Playwright)",
      "Páginas /projects e /performance (sair do ComingSoon)",
    ],
  },
];

const STATUS_LABEL: Record<string, { label: string; bg: string; border: string }> = {
  completed: {
    label: "Concluído",
    bg: "rgba(34,197,94,0.1)",
    border: "rgba(34,197,94,0.2)",
  },
  in_progress: {
    label: "Em desenvolvimento",
    bg: "rgba(255,92,0,0.1)",
    border: "rgba(255,92,0,0.2)",
  },
  upcoming: {
    label: "Próximos",
    bg: "rgba(167,139,250,0.08)",
    border: "rgba(167,139,250,0.15)",
  },
};

export function RoadmapTimeline() {
  return (
    <div className="max-w-[1000px] mx-auto px-6 flex flex-col gap-16">
      {/* Hero */}
      <div className="flex flex-col gap-6 text-center max-w-[650px] mx-auto">
        <div className="flex items-center justify-center gap-2">
          <span
            className="material-symbols-outlined text-[28px]"
            style={{
              color: "#ff5c00",
              animation: "fireGlowHero 1.5s ease-in-out infinite",
            }}
          >
            local_fire_department
          </span>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#ff5c00]">
            Roadmap
          </span>
        </div>

        <h1 className="font-display text-[42px] md:text-[56px] font-bold tracking-tight leading-[1.05] text-on-surface">
          Estamos só{" "}
          <span
            className="text-transparent bg-clip-text"
            style={{
              backgroundImage: "linear-gradient(135deg, #ff5c00, #e9c349)",
            }}
          >
            começando
          </span>
          .
        </h1>

        <p className="text-base md:text-lg text-tertiary leading-relaxed">
          Bounty WorkFlow nasceu pra revolucionar como caçadores de bounty organizam,
          publicam e escalam seus resultados. O que vem por aí vai{" "}
          <span className="text-on-surface font-semibold">mudar o jogo</span> — e você
          está aqui antes de todo mundo.
        </p>

        <div className="flex items-center justify-center gap-6 mt-2">
          <div className="flex items-center gap-2">
            <span
              className="w-2 h-2 rounded-full"
              style={{ background: "#22c55e" }}
            />
            <span className="text-[11px] text-tertiary">Concluído</span>
          </div>
          <div className="flex items-center gap-2">
            <span
              className="w-2 h-2 rounded-full"
              style={{ background: "#ff5c00" }}
            />
            <span className="text-[11px] text-tertiary">Em desenvolvimento</span>
          </div>
          <div className="flex items-center gap-2">
            <span
              className="w-2 h-2 rounded-full"
              style={{ background: "#a78bfa" }}
            />
            <span className="text-[11px] text-tertiary">Próximos</span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fireGlowHero {
          0%, 100% { opacity: 0.6; filter: drop-shadow(0 0 6px rgba(255,92,0,0.3)); }
          50% { opacity: 1; filter: drop-shadow(0 0 14px rgba(255,92,0,0.8)); }
        }
      `}</style>

      {/* Timeline phases */}
      <div className="flex flex-col gap-12">
        {PHASES.map((phase, index) => {
          const statusInfo = STATUS_LABEL[phase.status];

          return (
            <div
              key={phase.id}
              className="glass relative flex flex-col gap-6 rounded-2xl p-6 md:p-8 transition-all duration-300 hover:translate-y-[-2px]"
              style={{
                borderColor: phase.status === "completed"
                  ? "rgba(34,197,94,0.15)"
                  : phase.status === "in_progress"
                    ? "rgba(255,92,0,0.2)"
                    : "rgba(167,139,250,0.1)",
                boxShadow: phase.status === "in_progress"
                  ? "0 0 30px rgba(255,92,0,0.08)"
                  : "none",
              }}
            >
              {/* Phase number */}
              <div
                className="absolute -top-3 left-6 flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest"
                style={{
                  background: statusInfo.bg,
                  color: phase.color,
                  border: `1px solid ${statusInfo.border}`,
                }}
              >
                <span className="material-symbols-outlined text-[12px]">
                  {phase.icon}
                </span>
                {statusInfo.label}
              </div>

              {/* Header */}
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-2 mt-2">
                <div>
                  <h2 className="font-display text-[26px] font-semibold tracking-tight text-on-surface">
                    Fase {phase.id}: {phase.name}
                  </h2>
                  <p className="text-sm text-tertiary mt-2 max-w-[600px] leading-relaxed">
                    {phase.description}
                  </p>
                </div>
              </div>

              {/* Items */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {phase.items.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2.5 rounded-lg px-3 py-2"
                    style={{
                      background: phase.status === "completed"
                        ? "rgba(34,197,94,0.04)"
                        : "rgba(255,255,255,0.02)",
                    }}
                  >
                    <span
                      className="material-symbols-outlined text-[14px] shrink-0 mt-0.5"
                      style={{
                        color: phase.status === "completed"
                          ? "#22c55e"
                          : "var(--color-tertiary)",
                      }}
                    >
                      {phase.status === "completed" ? "check" : "remove"}
                    </span>
                    <span
                      className="text-[13px]"
                      style={{
                        color: phase.status === "completed"
                          ? "#22c55e"
                          : "var(--color-on-surface)",
                      }}
                    >
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* CTA final */}
      <div
        className="glass rounded-2xl p-8 md:p-12 flex flex-col items-center text-center gap-5"
        style={{ borderColor: "rgba(255,92,0,0.2)" }}
      >
        <span
          className="material-symbols-outlined text-[40px]"
          style={{ color: "#e9c349" }}
        >
          rocket_launch
        </span>
        <h2 className="font-display text-[28px] font-semibold tracking-tight text-on-surface">
          Quer embarcar nessa jornada?
        </h2>
        <p className="text-sm text-tertiary max-w-[500px] leading-relaxed">
          Os primeiros usuários têm acesso prioritário às novidades e influenciam
          os próximos passos do produto. Crie sua conta grátis e venha construir
          o futuro do bounty hunting.
        </p>
        <Link
          href="/auth/signup"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#ff5c00] text-white text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-[#ff7b33] hover:shadow-[0_0_30px_rgba(255,92,0,0.4)] transition-all duration-300 active:scale-95"
        >
          Começar grátis agora
          <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
        </Link>
      </div>
    </div>
  );
}
