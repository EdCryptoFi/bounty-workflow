import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Como usar" };

const steps = [
  {
    number: "01",
    title: "Escolha um Protocolo",
    description:
      "Acesse o Catálogo de Protocolos e encontre o projeto para o qual você vai executar um bounty. Cada protocolo tem seu logo e link oficial.",
    tip: "Clique no logo para visitar o site oficial e entender as regras do bounty antes de começar.",
    icon: "hub",
    href: "/protocols",
    cta: "Ver Protocolos",
    visual: <VisualProtocols />,
  },
  {
    number: "02",
    title: "Crie uma Campanha",
    description:
      "Com o protocolo em mente, crie uma nova Campanha. Dê um nome claro, selecione o protocolo e defina o prazo final do bounty.",
    tip: "Use nomes descritivos como 'Rally Season 3 — Thread Campaign' para facilitar o rastreamento.",
    icon: "add_circle",
    href: "/campaigns/new",
    cta: "Nova Campanha",
    visual: <VisualNewCampaign />,
  },
  {
    number: "03",
    title: "Monte o Fluxo de Etapas",
    description:
      "Dentro da campanha, adicione as etapas (steps) que precisam ser concluídas. Cada step tem título, data de entrega e status independente.",
    tip: "Quebre o trabalho em etapas pequenas — é mais fácil de rastrear e menos provável de atrasar.",
    icon: "account_tree",
    href: null,
    cta: null,
    visual: <VisualFlowSteps />,
  },
  {
    number: "04",
    title: "Gerencie o Status de Cada Etapa",
    description:
      "Clique em qualquer card do fluxo para abrir o editor. Mude o status entre Todo → Em Progresso → Concluído e reordene com as setas.",
    tip: "O ícone de status no canto do card permite mudança rápida sem abrir o modal.",
    icon: "edit_note",
    href: null,
    cta: null,
    visual: <VisualStepEditor />,
  },
  {
    number: "05",
    title: "Configure Lembretes",
    description:
      "Crie alertas vinculados à campanha para não perder prazos críticos. Os lembretes aparecem no sino de notificações no topo da tela.",
    tip: "Configure lembretes 48h antes dos prazos — tempo suficiente para corrigir qualquer problema.",
    icon: "notifications_active",
    href: "/reminders",
    cta: "Ver Lembretes",
    visual: <VisualReminders />,
  },
  {
    number: "06",
    title: "Finalize e Arquive",
    description:
      "Quando todas as etapas estiverem concluídas, mude o status da campanha para 'Concluído' ou clique em Finalizar no Dashboard. A campanha vai para o Arquivo.",
    tip: "O histórico no Arquivo serve como portfólio — guarda tudo que você entregou.",
    icon: "inventory_2",
    href: "/archive",
    cta: "Ver Arquivo",
    visual: <VisualFinish />,
  },
  {
    number: "07",
    title: "Otimize seu Conteúdo com Bounty AI",
    description:
      "Use o Bounty AI para analisar seus posts antes de publicar no X. O analisador segue as regras do algoritmo Phoenix (xAI, 2026) e pontua seu conteúdo de 0 a 100, identificando problemas que reduzem o alcance.",
    tip: "Posts com links no corpo têm alcance zero para contas não-Premium. O Bounty AI detecta isso e sugere mover o link para a primeira reply.",
    icon: "bolt",
    href: "/dicas",
    cta: "Abrir Bounty AI",
    visual: <VisualBountyAI />,
  },
];

export default function ComoUsarPage() {
  return (
    <div className="max-w-[1100px] mx-auto flex flex-col gap-16">
      {/* Header */}
      <div className="text-center">
        <p className="text-[10px] font-bold uppercase tracking-widest text-[#ff5c00] mb-2">
          Tutorial
        </p>
        <h1 className="font-display text-[36px] font-bold tracking-tight text-on-surface leading-tight mb-3">
          Como usar o fluxo de protocolos
        </h1>
        <p className="text-sm text-tertiary max-w-xl mx-auto leading-relaxed">
          Do protocolo ao arquivo — um guia completo para executar bounties com precisão usando o Bounty Workflow.
        </p>
      </div>

      {/* Steps */}
      <div className="flex flex-col gap-20">
        {steps.map((step, i) => {
          const isEven = i % 2 === 0;
          return (
            <div
              key={step.number}
              className={`flex flex-col ${isEven ? "lg:flex-row" : "lg:flex-row-reverse"} gap-10 items-center`}
            >
              {/* Text side */}
              <div className="flex-1 flex flex-col gap-5">
                {/* Step number */}
                <div className="flex items-center gap-3">
                  <span
                    className="text-[11px] font-black tracking-widest px-3 py-1 rounded-full"
                    style={{
                      background: "rgba(255,92,0,0.1)",
                      color: "#ff5c00",
                      border: "1px solid rgba(255,92,0,0.25)",
                    }}
                  >
                    STEP {step.number}
                  </span>
                  <div className="h-px flex-1" style={{ background: "rgba(255,92,0,0.15)" }} />
                </div>

                {/* Title + icon */}
                <div className="flex items-start gap-4">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
                    style={{ background: "rgba(255,92,0,0.1)", border: "1px solid rgba(255,92,0,0.2)" }}
                  >
                    <span className="material-symbols-outlined text-[24px] text-[#ff5c00]">
                      {step.icon}
                    </span>
                  </div>
                  <h2 className="font-display text-2xl font-semibold text-on-surface leading-tight pt-1.5">
                    {step.title}
                  </h2>
                </div>

                <p className="text-sm text-tertiary leading-relaxed">{step.description}</p>

                {/* Tip */}
                <div
                  className="flex gap-3 rounded-xl p-4"
                  style={{
                    background: "rgba(233,195,73,0.05)",
                    border: "1px solid rgba(233,195,73,0.15)",
                  }}
                >
                  <span className="material-symbols-outlined text-[16px] text-[#e9c349] shrink-0 mt-0.5">
                    lightbulb
                  </span>
                  <p className="text-xs text-[#e9c349] leading-relaxed">{step.tip}</p>
                </div>

                {step.href && step.cta && (
                  <Link
                    href={step.href}
                    className="self-start flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest text-white transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,92,0,0.35)] active:scale-95"
                    style={{ background: "#ff5c00" }}
                  >
                    <span className="material-symbols-outlined text-[15px]">{step.icon}</span>
                    {step.cta}
                  </Link>
                )}
              </div>

              {/* Visual side */}
              <div className="flex-1 w-full max-w-md lg:max-w-none">
                <div
                  className="rounded-2xl p-5 w-full"
                  style={{
                    background: "rgba(20,19,19,0.95)",
                    border: "1px solid rgba(255,92,0,0.15)",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.5), inset 0 0 20px rgba(255,92,0,0.04)",
                  }}
                >
                  {step.visual}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* CTA bottom */}
      <div
        className="rounded-2xl p-10 text-center"
        style={{
          background: "rgba(255,92,0,0.06)",
          border: "1px solid rgba(255,92,0,0.2)",
        }}
      >
        <span className="material-symbols-outlined text-[40px] text-[#ff5c00] mb-4 block">rocket_launch</span>
        <h3 className="font-display text-2xl font-bold text-on-surface mb-2">
          Pronto para começar?
        </h3>
        <p className="text-sm text-tertiary mb-6">
          Crie sua primeira campanha agora e coloque o fluxo em prática.
        </p>
        <Link
          href="/campaigns/new"
          className="inline-flex items-center gap-2 px-8 py-3 rounded-lg text-xs font-bold uppercase tracking-widest text-white transition-all hover:shadow-[0_0_30px_rgba(255,92,0,0.4)] active:scale-95"
          style={{ background: "#ff5c00" }}
        >
          <span className="material-symbols-outlined text-[16px]">add</span>
          Nova Campanha
        </Link>
      </div>
    </div>
  );
}

/* ── Illustrations ─────────────────────────────────────────────────── */

function MockChip({ label, color = "#ff5c00" }: { label: string; color?: string }) {
  return (
    <span
      className="inline-flex items-center px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest"
      style={{ background: `${color}18`, color, border: `1px solid ${color}30` }}
    >
      {label}
    </span>
  );
}

function MockCard({ children, active = false }: { children: React.ReactNode; active?: boolean }) {
  return (
    <div
      className="rounded-xl p-3"
      style={{
        background: active ? "rgba(255,92,0,0.08)" : "rgba(42,42,42,0.6)",
        border: `1px solid ${active ? "rgba(255,92,0,0.35)" : "rgba(71,71,70,0.4)"}`,
      }}
    >
      {children}
    </div>
  );
}

function VisualProtocols() {
  const protocols = [
    { name: "DRiP", domain: "drip.haus", active: true },
    { name: "MagicEden", domain: "magiceden.io", active: false },
    { name: "Rally", domain: "rally.io", active: false },
    { name: "P2P Kols", domain: "p2pkols.com", active: false },
  ];
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2 mb-1">
        <span className="material-symbols-outlined text-[14px] text-[#ff5c00]">hub</span>
        <span className="text-[10px] font-bold uppercase tracking-widest text-tertiary">Catálogo de Protocolos</span>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {protocols.map((p) => (
          <MockCard key={p.name} active={p.active}>
            <div className="flex items-center gap-2.5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://www.google.com/s2/favicons?sz=32&domain=${p.domain}`}
                alt={p.name}
                className="w-6 h-6 rounded"
              />
              <span className="text-xs font-semibold text-on-surface">{p.name}</span>
              {p.active && (
                <span className="ml-auto material-symbols-outlined text-[14px] text-[#ff5c00]">check_circle</span>
              )}
            </div>
          </MockCard>
        ))}
      </div>
    </div>
  );
}

function VisualNewCampaign() {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2 mb-1">
        <span className="material-symbols-outlined text-[14px] text-[#ff5c00]">edit</span>
        <span className="text-[10px] font-bold uppercase tracking-widest text-tertiary">Nova Campanha</span>
      </div>
      <div className="flex flex-col gap-2">
        {[
          { label: "Nome", value: "Rally Season 3 — Thread", filled: true },
          { label: "Protocolo", value: "DRiP", filled: true },
          { label: "Prazo final", value: "15 Jun 2026", filled: true },
        ].map((f) => (
          <div key={f.label}>
            <p className="text-[9px] font-bold uppercase tracking-widest text-tertiary mb-1">{f.label}</p>
            <div
              className="rounded-lg px-3 py-2 text-xs text-on-surface"
              style={{ background: f.filled ? "rgba(255,92,0,0.07)" : "rgba(42,42,42,0.5)", border: "1px solid rgba(255,92,0,0.2)" }}
            >
              {f.value}
            </div>
          </div>
        ))}
        <div
          className="mt-2 flex items-center justify-center gap-2 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest text-white"
          style={{ background: "#ff5c00" }}
        >
          <span className="material-symbols-outlined text-[14px]">add</span>
          Criar Campanha
        </div>
      </div>
    </div>
  );
}

function VisualFlowSteps() {
  const steps = [
    { title: "Pesquisar regras do bounty", status: "done", date: "02 Jun" },
    { title: "Redigir thread principal", status: "in_progress", date: "05 Jun" },
    { title: "Publicar e engajar", status: "todo", date: "08 Jun" },
    { title: "Submeter prova", status: "todo", date: "12 Jun" },
  ];
  const statusColor: Record<string, string> = {
    done: "#22c55e",
    in_progress: "#ff5c00",
    todo: "#5b4137",
  };
  const statusLabel: Record<string, string> = {
    done: "done",
    in_progress: "em prog.",
    todo: "todo",
  };
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2 mb-1">
        <span className="material-symbols-outlined text-[14px] text-[#ff5c00]">account_tree</span>
        <span className="text-[10px] font-bold uppercase tracking-widest text-tertiary">Etapas do Fluxo</span>
      </div>
      {steps.map((s) => (
        <div
          key={s.title}
          className="flex items-center gap-3 rounded-lg px-3 py-2.5"
          style={{
            background: s.status === "in_progress" ? "rgba(255,92,0,0.08)" : "rgba(42,42,42,0.5)",
            border: `1px solid ${s.status === "in_progress" ? "rgba(255,92,0,0.3)" : "rgba(71,71,70,0.3)"}`,
          }}
        >
          <div
            className="w-2 h-2 rounded-full shrink-0"
            style={{ background: statusColor[s.status] }}
          />
          <span className="text-xs text-on-surface flex-1 truncate">{s.title}</span>
          <MockChip label={statusLabel[s.status]} color={statusColor[s.status]} />
          <span className="text-[9px] text-tertiary shrink-0">{s.date}</span>
        </div>
      ))}
    </div>
  );
}

function VisualStepEditor() {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2 mb-1">
        <span className="material-symbols-outlined text-[14px] text-[#ff5c00]">edit_note</span>
        <span className="text-[10px] font-bold uppercase tracking-widest text-tertiary">Editor de Etapa</span>
      </div>
      <div
        className="rounded-xl p-4 flex flex-col gap-3"
        style={{ background: "rgba(32,31,31,0.8)", border: "1px solid rgba(255,92,0,0.25)" }}
      >
        <div>
          <p className="text-[9px] font-bold uppercase tracking-widest text-tertiary mb-1">Título</p>
          <div className="text-xs text-on-surface rounded px-2 py-1.5" style={{ background: "rgba(255,92,0,0.06)", border: "1px solid rgba(255,92,0,0.2)" }}>
            Redigir thread principal
          </div>
        </div>
        <div>
          <p className="text-[9px] font-bold uppercase tracking-widest text-tertiary mb-1.5">Status</p>
          <div className="flex gap-2">
            {[
              { label: "Todo", active: false },
              { label: "Em Progresso", active: true },
              { label: "Concluído", active: false },
            ].map((b) => (
              <div
                key={b.label}
                className="flex-1 text-center py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-widest"
                style={{
                  background: b.active ? "#ff5c00" : "rgba(42,42,42,0.5)",
                  color: b.active ? "white" : "#c8c6c5",
                  border: b.active ? "none" : "1px solid rgba(71,71,70,0.4)",
                }}
              >
                {b.label}
              </div>
            ))}
          </div>
        </div>
        <div>
          <p className="text-[9px] font-bold uppercase tracking-widest text-tertiary mb-1">Prazo</p>
          <div className="text-xs text-on-surface rounded px-2 py-1.5" style={{ background: "rgba(255,92,0,0.06)", border: "1px solid rgba(255,92,0,0.2)" }}>
            05 Jun 2026
          </div>
        </div>
        <div className="flex gap-2 mt-1">
          <div className="flex-1 text-center py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-widest text-white" style={{ background: "#ff5c00" }}>
            Salvar
          </div>
          <div className="px-3 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-widest text-tertiary" style={{ background: "rgba(42,42,42,0.5)", border: "1px solid rgba(71,71,70,0.4)" }}>
            Cancelar
          </div>
        </div>
      </div>
    </div>
  );
}

function VisualReminders() {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2 mb-1">
        <span className="material-symbols-outlined text-[14px] text-[#ff5c00]">notifications_active</span>
        <span className="text-[10px] font-bold uppercase tracking-widest text-tertiary">Lembretes Ativos</span>
      </div>
      {[
        { msg: "Deadline: Submeter prova", campaign: "Rally Season 3", time: "em 2d", urgent: true },
        { msg: "Revisão da thread", campaign: "MagVerse Hunter", time: "em 5d", urgent: false },
      ].map((r) => (
        <div
          key={r.msg}
          className="flex items-start gap-3 rounded-xl px-3 py-3"
          style={{
            background: r.urgent ? "rgba(255,92,0,0.08)" : "rgba(42,42,42,0.5)",
            border: `1px solid ${r.urgent ? "rgba(255,92,0,0.3)" : "rgba(71,71,70,0.3)"}`,
          }}
        >
          <span
            className="w-2 h-2 rounded-full mt-1 shrink-0"
            style={{ background: r.urgent ? "#ff5c00" : "#5b4137", boxShadow: r.urgent ? "0 0 6px #ff5c00" : "none" }}
          />
          <div className="flex-1 min-w-0">
            <p className="text-[9px] font-bold uppercase tracking-widest text-[#ffb59a] truncate">{r.campaign}</p>
            <p className="text-xs text-on-surface mt-0.5">{r.msg}</p>
          </div>
          <span className="text-[9px] font-bold text-tertiary uppercase tracking-widest shrink-0">{r.time}</span>
        </div>
      ))}
      <div
        className="flex items-center gap-2 mt-1 py-2 px-3 rounded-lg"
        style={{ background: "rgba(42,42,42,0.4)", border: "1px solid rgba(71,71,70,0.3)" }}
      >
        <span className="material-symbols-outlined text-[14px] text-[#ff5c00]">add</span>
        <span className="text-[10px] font-bold uppercase tracking-widest text-tertiary">Novo Lembrete</span>
      </div>
    </div>
  );
}

function VisualBountyAI() {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2 mb-1">
        <span className="material-symbols-outlined text-[14px] text-[#ff5c00]">bolt</span>
        <span className="text-[10px] font-bold uppercase tracking-widest text-tertiary">Bounty AI — Algoritmo do X</span>
      </div>
      <div className="flex flex-col gap-2">
        {/* Score bar mock */}
        <div className="rounded-xl p-3" style={{ background: "rgba(42,42,42,0.6)", border: "1px solid rgba(71,71,70,0.4)" }}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[9px] font-bold uppercase tracking-widest text-tertiary">Score Phoenix</span>
            <span className="text-base font-bold" style={{ color: "#ff5c00" }}>78<span className="text-[10px] text-tertiary">/100</span></span>
          </div>
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
            <div className="h-full rounded-full" style={{ width: "78%", background: "#ff5c00" }} />
          </div>
        </div>
        {/* Issues mock */}
        <div className="rounded-lg px-3 py-2.5 flex items-start gap-2" style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}>
          <span className="material-symbols-outlined text-[14px] shrink-0 mt-0.5" style={{ color: "#ef4444" }}>error</span>
          <div>
            <p className="text-[10px] font-semibold text-on-surface">Link no post principal</p>
            <p className="text-[9px] text-tertiary">-20 pts — mova o link para a reply</p>
          </div>
        </div>
        {/* Suggestion mock */}
        <div className="rounded-lg px-3 py-2.5 flex items-start gap-2" style={{ background: "rgba(34,197,94,0.06)", border: "1px solid rgba(34,197,94,0.2)" }}>
          <span className="material-symbols-outlined text-[14px] shrink-0 mt-0.5" style={{ color: "#22c55e" }}>check_circle</span>
          <p className="text-[10px] text-on-surface">Thread detectada — alcance dobrado ✅</p>
        </div>
        {/* Rewrite button mock */}
        <div className="flex items-center justify-center gap-2 rounded-xl py-2.5 text-[10px] font-bold uppercase tracking-widest" style={{ background: "rgba(255,92,0,0.06)", border: "1px solid rgba(255,92,0,0.3)", color: "#ff5c00" }}>
          <span className="material-symbols-outlined text-[14px]">auto_fix_high</span>
          Gerar versão otimizada com IA
        </div>
      </div>
    </div>
  );
}

function VisualFinish() {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2 mb-1">
        <span className="material-symbols-outlined text-[14px] text-[#e9c349]">inventory_2</span>
        <span className="text-[10px] font-bold uppercase tracking-widest text-tertiary">Campanha Concluída</span>
      </div>
      <div
        className="rounded-xl p-4 flex items-center gap-4"
        style={{ background: "rgba(34,197,94,0.06)", border: "1px solid rgba(34,197,94,0.2)" }}
      >
        <span className="material-symbols-outlined text-[32px] text-[#22c55e]">check_circle</span>
        <div>
          <p className="text-sm font-semibold text-on-surface">Rally Season 3 — Thread</p>
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#22c55e] mt-0.5">Concluído · 4/4 etapas</p>
        </div>
      </div>
      <div className="flex gap-2 mt-1">
        <div
          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-[9px] font-bold uppercase tracking-widest"
          style={{ background: "rgba(233,195,73,0.08)", color: "#e9c349", border: "1px solid rgba(233,195,73,0.2)" }}
        >
          <span className="material-symbols-outlined text-[13px]">inventory_2</span>
          Arquivar
        </div>
        <div
          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-[9px] font-bold uppercase tracking-widest text-tertiary"
          style={{ background: "rgba(42,42,42,0.5)", border: "1px solid rgba(71,71,70,0.3)" }}
        >
          <span className="material-symbols-outlined text-[13px]">visibility</span>
          Ver histórico
        </div>
      </div>
    </div>
  );
}
