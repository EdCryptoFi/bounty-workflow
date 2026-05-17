"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { CheckCircle2, ArrowUpRight, X } from "lucide-react";
import { motion, AnimatePresence, useMotionValue, useTransform, type Variants } from "motion/react";
import { GlowCard } from "@/components/ui/glow-card";

export function LandingClient() {
  const [showDemo, setShowDemo] = useState(false);
  const [cookieAccepted, setCookieAccepted] = useState(true);

  useEffect(() => {
    setCookieAccepted(localStorage.getItem("cookie_consent") === "1");
  }, []);

  function acceptCookies() {
    localStorage.setItem("cookie_consent", "1");
    setCookieAccepted(true);
  }

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

      {/* ── Fixed Header ── */}
      <header
        className="fixed z-50 top-0 left-0 right-0 flex justify-between items-center px-12 h-20 border-b border-zinc-800/50 shadow-[0_4px_30px_rgba(0,0,0,0.5)]"
        style={{ background: "rgba(9,9,9,0.70)", backdropFilter: "blur(24px)" }}
      >
        <Link href="/" className="flex items-center gap-3">
          <div className="relative w-10 h-10 shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-final.png" alt="Bounty Workflow" className="h-10 w-10 object-contain rounded-xl" />
            <div
              className="absolute inset-0 rounded-xl pointer-events-none"
              style={{
                background: "linear-gradient(110deg, transparent 20%, rgba(233,195,73,0.55) 50%, transparent 80%)",
                backgroundSize: "200% 100%",
                animation: "goldShimmerLanding 5s ease-in-out infinite",
              }}
            />
          </div>
          <span className="text-xl font-black tracking-tighter text-[#ff5c00]">
            Bounty Workflow
          </span>
        </Link>

        <style>{`
          @keyframes goldShimmerLanding {
            0% { background-position: 200% center; opacity: 0; }
            20% { opacity: 1; }
            50% { background-position: -200% center; opacity: 0.6; }
            80% { opacity: 0; }
            100% { background-position: -200% center; opacity: 0; }
          }
          @keyframes heroGoldShimmer {
            0% { background-position: 200% center; opacity: 0; }
            15% { opacity: 1; }
            50% { background-position: -200% center; opacity: 0.7; }
            85% { opacity: 0; }
            100% { background-position: -200% center; opacity: 0; }
          }
        `}</style>

        <nav className="hidden md:flex items-center gap-8">
          <Link href="/como-funciona" className="text-[#ff7b33] text-sm font-medium hover:text-[#ffb59a] transition-colors">
            Como funciona
          </Link>
          <Link href="/campaigns" className="text-zinc-400 text-sm hover:text-[#ff7b33] transition-colors">
            Campaigns
          </Link>
          <Link href="/protocols" className="text-zinc-400 text-sm hover:text-[#ff7b33] transition-colors">
            Protocols
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link href="/auth/login" className="text-zinc-400 text-sm hover:text-[#ff7b33] transition-colors">
            Entrar
          </Link>
          <Link
            href="/auth/signup"
            className="px-5 py-2 bg-[#ff5c00] text-white text-xs font-bold uppercase tracking-widest rounded hover:bg-[#ff7b33] hover:shadow-[0_0_20px_rgba(255,92,0,0.4)] transition-all duration-300 active:scale-95"
          >
            Começar grátis
          </Link>
        </div>
      </header>

      {/* ── Main ── */}
      <main className="flex-grow pt-32 pb-24 relative z-10">

        {/* ── Hero ── */}
        <section className="relative px-6 mb-32 max-w-[1400px] mx-auto w-full">
          <div className="max-w-4xl mx-auto flex flex-col items-center text-center relative z-10">

            {/* Hero logo — full-width, no card */}
            <div className="mb-10 relative flex flex-col items-center w-full">
              <div className="relative w-full max-w-3xl mx-auto">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/logo-final.png"
                  alt="Bounty Workflow"
                  className="relative z-10 w-full h-auto object-contain"
                  style={{
                    filter: "drop-shadow(0 0 40px rgba(255,92,0,0.35)) drop-shadow(0 0 12px rgba(233,195,73,0.2))",
                  }}
                />
                {/* Golden shimmer overlay */}
                <div
                  className="absolute inset-0 pointer-events-none z-20"
                  style={{
                    background: "linear-gradient(110deg, transparent 15%, rgba(233,195,73,0.45) 50%, transparent 85%)",
                    backgroundSize: "200% 100%",
                    animation: "heroGoldShimmer 4s ease-in-out infinite",
                  }}
                />
              </div>
            </div>

            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#e9c349]/30 mb-8"
              style={{ background: "rgba(32,31,31,0.7)", backdropFilter: "blur(20px)" }}>
              <span
                className="w-2 h-2 rounded-full bg-[#ff5c00] animate-pulse"
                style={{ boxShadow: "0 0 8px #ff5c00" }}
              />
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#e9c349]">
                FEITO PARA HUNTERS DE BOUNTY CRIPTO
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-[52px] sm:text-[64px] font-bold tracking-tight leading-[1.1] text-on-surface mb-6">
              Domine seu{" "}
              <span
                style={{
                  background: "linear-gradient(135deg, #ffb59a 0%, #ff5c00 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                fluxo de trabalho
              </span>{" "}
              com precisão.
            </h1>

            <p className="text-base text-tertiary max-w-2xl leading-relaxed mb-12">
              Nunca mais perca um bounty por prazo vencido. Organize protocolos, gerencie campanhas e receba alertas automáticos — tudo em uma plataforma feita para hunters sérios.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 mb-20">
              <Link
                href="/auth/signup"
                className="px-8 py-4 bg-[#ff5c00] text-white text-xs font-bold uppercase tracking-widest rounded hover:brightness-110 hover:shadow-[0_0_30px_rgba(255,92,0,0.4)] transition-all duration-300 active:scale-95"
              >
                Começar grátis
              </Link>
              <button
                type="button"
                onClick={() => setShowDemo(true)}
                className="px-8 py-4 text-on-surface text-xs font-bold uppercase tracking-widest rounded border border-[#e9c349]/30 hover:bg-surface-container-highest transition-all duration-300 flex items-center gap-2"
                style={{ background: "rgba(32,31,31,0.7)", backdropFilter: "blur(20px)" }}
              >
                <span className="material-symbols-outlined text-[16px] text-[#e9c349]">play_circle</span>
                Ver Demonstração
              </button>
            </div>

            {/* Hero dashboard mockup */}
            <div className="relative w-full max-w-5xl mx-auto">
              <div
                className="relative rounded-xl p-1 overflow-hidden shadow-2xl"
                style={{
                  background: "rgba(32,31,31,0.7)",
                  backdropFilter: "blur(20px)",
                  borderImage: "linear-gradient(to bottom right, rgba(233,195,73,0.3), rgba(233,195,73,0.1)) 1",
                  border: "1px solid transparent",
                  boxShadow: "inset 0 0 20px rgba(255,92,0,0.1), 0 0 30px rgba(255,92,0,0.15)",
                }}
              >
                <DashboardMockup />
                <div
                  className="pointer-events-none absolute inset-0 rounded-xl animate-dash-glow"
                  style={{
                    background: "radial-gradient(ellipse 70% 50% at 60% 40%, rgba(255,92,0,0.22) 0%, transparent 70%)",
                  }}
                />
                <div
                  className="pointer-events-none absolute inset-0 rounded-xl animate-dash-glow-2"
                  style={{
                    background: "radial-gradient(ellipse 50% 60% at 30% 60%, rgba(255,92,0,0.14) 0%, transparent 70%)",
                  }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* ── Trust Bar ── */}
        <div
          className="relative z-10 mb-20 border-y"
          style={{ borderColor: "rgba(255,92,0,0.08)", background: "rgba(255,92,0,0.03)" }}
        >
          <div className="max-w-[1400px] mx-auto px-12 py-8 flex flex-col sm:flex-row items-center justify-center gap-0 divide-y sm:divide-y-0 sm:divide-x divide-[rgba(255,92,0,0.1)]">
            {[
              { value: "500+", label: "Hunters organizando bounties", color: "#ff5c00" },
              { value: "40+", label: "Protocolos suportados", color: "#e9c349" },
              { value: "87%", label: "Taxa de entrega no prazo", color: "#ffb59a" },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col items-center gap-1 px-12 py-4 sm:py-0 text-center">
                <span className="text-3xl font-bold" style={{ color: stat.color }}>{stat.value}</span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-tertiary">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Features Bento ── */}
        <section className="mb-32 max-w-[1400px] mx-auto px-12">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-on-surface mb-3">Ferramentas de Próxima Geração</h2>
            <p
              className="text-xl font-semibold mb-3"
              style={{
                background: "linear-gradient(135deg, #ffb59a 0%, #ff5c00 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Orchestrate Work. Ship Faster.
            </p>
            <p className="text-sm text-tertiary">Arquitetura modular para escalabilidade infinita.</p>
          </div>

          <motion.div
            className="grid gap-5"
            initial="hidden"
            variants={staggerContainer}
            viewport={{ once: true }}
            whileInView="visible"
          >
            {/* Row 1 */}
            <div className="grid gap-5 md:grid-cols-3">
              <motion.div className="md:col-span-1" variants={fadeInUp}>
                <MotionBentoCard
                  title="Rede de Protocolos"
                  description="Conectado aos maiores protocolos DeFi e NFT do ecossistema. Um catálogo vivo, sempre atualizado."
                  feature="protocols"
                  href="/auth/signup"
                />
              </motion.div>
              <motion.div className="md:col-span-2" variants={fadeInUp}>
                <MotionBentoCard
                  title="Gestão de Campanhas"
                  description="Orquestre cada campanha de bounty do início ao fim com total visibilidade e controle."
                  feature="spotlight"
                  spotlightItems={["Reordenação de etapas por drag & drop", "Fluxo multi-status (Todo → Em Progresso → Concluído)", "Campanhas vinculadas a protocolos", "Rastreamento de prazo com alertas", "Progresso visual por etapa"]}
                  href="/auth/signup"
                />
              </motion.div>
            </div>

            {/* Row 2 */}
            <div className="grid gap-5 md:grid-cols-3">
              <motion.div className="md:col-span-2" variants={fadeInUp}>
                <MotionBentoCard
                  title="Alertas Inteligentes"
                  description="Sistema de alertas ciente de prazos que mantém sua equipe sempre no ritmo certo."
                  feature="metrics"
                  metrics={[
                    { label: "Cobertura de prazos", value: 95, suffix: "%" },
                    { label: "Entrega no prazo", value: 87, suffix: "%" },
                    { label: "Resposta a alertas", value: 78, suffix: "%" },
                  ]}
                  href="/auth/signup"
                />
              </motion.div>
              <motion.div className="md:col-span-1" variants={fadeInUp}>
                <MotionBentoCard
                  title="Ciclo do Bounty"
                  description="Da descoberta ao pagamento, cada etapa rastreada em tempo real."
                  feature="timeline"
                  timeline={[
                    { year: "01", event: "Protocolo atribuído & campanha criada" },
                    { year: "02", event: "Etapas definidas com prazos" },
                    { year: "03", event: "Em execução — alertas ativos" },
                    { year: "04", event: "Revisão & submissão" },
                    { year: "05", event: "Pagamento confirmado" },
                  ]}
                  href="/auth/signup"
                />
              </motion.div>
            </div>

            {/* Row 3 */}
            <div className="grid gap-5 md:grid-cols-3">
              <motion.div className="md:col-span-1" variants={fadeInUp}>
                <MotionBentoCard
                  title="Organização Total"
                  description="Protocolos, steps, links e prazos em um só lugar. Zero planilha, zero caos."
                  feature="spotlight"
                  spotlightItems={["Links de evidência por campanha", "Steps com status e prazos", "Histórico completo de submissões", "Protocolos organizados por categoria"]}
                  href="/auth/signup"
                />
              </motion.div>
              <motion.div className="md:col-span-1" variants={fadeInUp}>
                <MotionBentoCard
                  title="Sistema de Indicação"
                  description="Indique outros hunters e multiplique suas recompensas. Programa exclusivo para membros."
                  feature="counter"
                  statistic={{ value: "2.4×", label: "MULTIPLICADOR DE RECOMPENSA", start: 1.8, end: 2.4, suffix: "×" }}
                  href="/auth/signup"
                />
              </motion.div>
              <motion.div className="md:col-span-1" variants={fadeInUp}>
                <MotionBentoCard
                  title="Bounty AI — Algoritmo X"
                  description="Analise seus posts com o algoritmo Phoenix (xAI 2026) antes de publicar. Score 0-100 em tempo real."
                  feature="bountyai"
                  href="/auth/signup"
                />
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* ── Pricing ── */}
        <section className="mb-24 max-w-[1400px] mx-auto px-12">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-on-surface mb-3">Simples e direto</h2>
            <p className="text-sm text-tertiary">Um plano. Sem surpresas.</p>
          </div>

          <div className="flex justify-center">
            <div
              className="relative w-full max-w-md rounded-2xl p-8 flex flex-col gap-6"
              style={{
                background: "rgba(20,19,19,0.95)",
                border: "1px solid rgba(255,92,0,0.35)",
                boxShadow: "0 0 60px rgba(255,92,0,0.12), inset 0 0 30px rgba(255,92,0,0.04)",
              }}
            >
              <div
                className="pointer-events-none absolute inset-x-0 top-0 h-px"
                style={{ background: "linear-gradient(90deg, transparent, rgba(255,92,0,0.6), transparent)" }}
              />

              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-[#ff5c00] border border-[#ff5c00]/40 bg-[rgba(255,92,0,0.08)]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ff5c00] shadow-[0_0_6px_#ff5c00]" />
                  PRO
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#e9c349]">
                  14 DIAS GRÁTIS
                </span>
              </div>

              <div className="flex items-end gap-2">
                <span className="text-5xl font-bold text-on-surface">R$ 29,90</span>
                <span className="text-sm text-tertiary mb-1.5">/mês</span>
              </div>

              <ul className="flex flex-col gap-3">
                {["Campanhas ilimitadas", "Alertas automáticos de prazo", "Bounty AI — Análise de Conteúdo", "Referral system completo", "Todos os protocolos suportados", "Suporte prioritário"].map((f) => (
                  <li key={f} className="flex items-center gap-3 text-sm text-on-surface">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-[#ff5c00]" />
                    {f}
                  </li>
                ))}
              </ul>

              <Link
                href="/auth/signup"
                className="flex items-center justify-center gap-2 w-full py-3.5 bg-[#ff5c00] hover:bg-[#ff7b33] text-white text-sm font-bold uppercase tracking-widest rounded-lg transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,92,0,0.4)] active:scale-95"
              >
                Começar grátis
              </Link>

              <p className="text-center text-[10px] text-tertiary">
                14 dias grátis. Cancele a qualquer momento.
              </p>
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
            Termos de Uso
          </Link>
          <span className="text-zinc-600 text-[10px] uppercase tracking-[0.2em] font-semibold flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ff5c00]" />
            Status do Sistema
          </span>
        </div>
      </footer>

      {/* ── Cookie Consent ── */}
      <AnimatePresence>
        {!cookieAccepted && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="fixed bottom-0 left-0 right-0 z-[100] px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 border-t border-zinc-800"
            style={{ background: "rgba(10,10,10,0.97)", backdropFilter: "blur(20px)" }}
          >
            <div className="flex items-start gap-3 flex-1">
              <span className="material-symbols-outlined text-[20px] text-[#e9c349] shrink-0 mt-0.5">cookie</span>
              <p className="text-[12px] text-zinc-400 leading-relaxed">
                Usamos cookies essenciais para autenticação e cookies analíticos para melhorar a plataforma. Ao continuar, você concorda com nossa{" "}
                <Link href="/legal/privacidade" className="text-[#e9c349] hover:underline">
                  Política de Privacidade
                </Link>
                .
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <Link
                href="/legal/privacidade"
                className="text-[11px] font-bold uppercase tracking-widest text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                Saiba mais
              </Link>
              <button
                type="button"
                onClick={acceptCookies}
                className="px-5 py-2 bg-[#ff5c00] hover:bg-[#ff7b33] text-white text-[11px] font-bold uppercase tracking-widest rounded transition-all"
              >
                Aceitar
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Demo Pipeline Modal ── */}
      <AnimatePresence>
        {showDemo && <DemoPipelineModal onClose={() => setShowDemo(false)} />}
      </AnimatePresence>
    </div>
  );
}

/* ── Demo Pipeline Modal ──────────────────────────────────────────── */
const PIPELINE_STEPS = [
  {
    number: "01",
    icon: "hub",
    title: "Escolha um Protocolo",
    desc: "Acesse o Catálogo e selecione o protocolo do bounty — cada um com logo e link oficial.",
    highlight: false,
  },
  {
    number: "02",
    icon: "add_circle",
    title: "Crie uma Campanha",
    desc: "Nome claro, protocolo selecionado e prazo final definido. Sua campanha nasce organizada.",
    highlight: false,
  },
  {
    number: "03",
    icon: "account_tree",
    title: "Monte o Fluxo de Etapas",
    desc: "Adicione steps dentro da campanha — cada um com título, data e status independente.",
    highlight: false,
  },
  {
    number: "04",
    icon: "edit_note",
    title: "Gerencie o Status",
    desc: "Todo → Em Progresso → Concluído. Mude rapidamente sem abrir modais.",
    highlight: false,
  },
  {
    number: "05",
    icon: "notifications_active",
    title: "Configure Lembretes",
    desc: "Alertas automáticos 48h antes dos prazos. Nunca perca uma entrega crítica.",
    highlight: false,
  },
  {
    number: "06",
    icon: "inventory_2",
    title: "Finalize e Arquive",
    desc: "Campanha entregue? Arquive com um clique. Histórico completo como portfólio.",
    highlight: false,
  },
  {
    number: "07",
    icon: "bolt",
    title: "Bounty AI — Algoritmo X",
    desc: "Analise cada post antes de publicar. Score 0-100 baseado no algoritmo Phoenix (xAI, 2026). Detecta links, hashtags, threads e sugere reescrita com IA.",
    highlight: true,
  },
];

function DemoPipelineModal({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Modal */}
      <motion.div
        className="relative z-10 w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl"
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        style={{
          background: "rgba(14,13,13,0.98)",
          border: "1px solid rgba(255,92,0,0.25)",
          boxShadow: "0 0 80px rgba(255,92,0,0.15)",
        }}
      >
        {/* Modal header */}
        <div
          className="sticky top-0 z-10 flex items-center justify-between px-8 py-5 border-b border-zinc-800/60"
          style={{ background: "rgba(14,13,13,0.98)", backdropFilter: "blur(20px)" }}
        >
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#ff5c00] mb-0.5">Pipeline completo</p>
            <h2 className="text-xl font-bold text-on-surface">Do protocolo ao Bounty AI — 7 passos</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-tertiary hover:text-on-surface hover:bg-zinc-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Pipeline */}
        <div className="px-8 py-8">
          {/* Connector line */}
          <div className="relative">
            <div
              className="absolute left-[27px] top-0 bottom-0 w-[2px]"
              style={{ background: "linear-gradient(to bottom, rgba(255,92,0,0.5), rgba(233,195,73,0.6))" }}
            />

            <div className="flex flex-col gap-0">
              {PIPELINE_STEPS.map((step, i) => (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.06 * i, duration: 0.35 }}
                  className={`relative flex gap-5 pb-6 ${step.highlight ? "pb-4" : ""}`}
                >
                  {/* Icon node */}
                  <div
                    className="relative z-10 shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center"
                    style={
                      step.highlight
                        ? {
                            background: "linear-gradient(135deg, rgba(255,92,0,0.2), rgba(233,195,73,0.15))",
                            border: "2px solid rgba(233,195,73,0.5)",
                            boxShadow: "0 0 24px rgba(233,195,73,0.2)",
                          }
                        : {
                            background: "rgba(255,92,0,0.08)",
                            border: "1px solid rgba(255,92,0,0.2)",
                          }
                    }
                  >
                    <span
                      className="material-symbols-outlined text-[24px]"
                      style={{ color: step.highlight ? "#e9c349" : "#ff5c00" }}
                    >
                      {step.icon}
                    </span>
                  </div>

                  {/* Content */}
                  <div
                    className={`flex-1 rounded-xl p-4 ${step.highlight ? "relative overflow-hidden" : ""}`}
                    style={
                      step.highlight
                        ? {
                            background: "linear-gradient(135deg, rgba(255,92,0,0.07), rgba(233,195,73,0.05))",
                            border: "1px solid rgba(233,195,73,0.3)",
                            boxShadow: "0 0 30px rgba(233,195,73,0.06)",
                          }
                        : {
                            background: "rgba(255,255,255,0.02)",
                            border: "1px solid rgba(255,255,255,0.05)",
                          }
                    }
                  >
                    {step.highlight && (
                      <div
                        className="absolute inset-x-0 top-0 h-[1px]"
                        style={{ background: "linear-gradient(90deg, transparent, rgba(233,195,73,0.6), transparent)" }}
                      />
                    )}
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className="text-[10px] font-black tracking-widest px-2 py-0.5 rounded-full"
                        style={
                          step.highlight
                            ? { background: "rgba(233,195,73,0.15)", color: "#e9c349", border: "1px solid rgba(233,195,73,0.3)" }
                            : { background: "rgba(255,92,0,0.1)", color: "#ff5c00", border: "1px solid rgba(255,92,0,0.2)" }
                        }
                      >
                        STEP {step.number}
                      </span>
                      {step.highlight && (
                        <span className="text-[10px] font-bold uppercase tracking-widest text-[#e9c349] flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#e9c349] animate-pulse" />
                          Destaque
                        </span>
                      )}
                    </div>
                    <h3
                      className="font-semibold text-base mb-1"
                      style={{ color: step.highlight ? "#e9c349" : "var(--color-on-surface)" }}
                    >
                      {step.title}
                    </h3>
                    <p className="text-sm text-tertiary leading-relaxed">{step.desc}</p>
                    {step.highlight && (
                      <div className="mt-3 flex gap-3">
                        <div className="flex items-center gap-1.5 rounded-lg px-3 py-1.5" style={{ background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)" }}>
                          <span className="w-2 h-2 rounded-full bg-[#22c55e]" />
                          <span className="text-[10px] font-bold text-[#22c55e] uppercase tracking-widest">Score A — 90/100</span>
                        </div>
                        <div className="flex items-center gap-1.5 rounded-lg px-3 py-1.5" style={{ background: "rgba(255,92,0,0.08)", border: "1px solid rgba(255,92,0,0.2)" }}>
                          <span className="material-symbols-outlined text-[12px] text-[#ff5c00]">auto_fix_high</span>
                          <span className="text-[10px] font-bold text-[#ff5c00] uppercase tracking-widest">Reescrita com IA</span>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA bottom */}
        <div className="px-8 pb-8 flex gap-4">
          <Link
            href="/auth/signup"
            onClick={onClose}
            className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-[#ff5c00] hover:bg-[#ff7b33] text-white text-sm font-bold uppercase tracking-widest rounded-lg transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,92,0,0.4)]"
          >
            Começar grátis — 14 dias
          </Link>
          <Link
            href="/como-usar"
            onClick={onClose}
            className="px-6 py-3.5 text-sm font-bold uppercase tracking-widest rounded-lg border border-zinc-700 text-tertiary hover:text-on-surface hover:border-zinc-500 transition-all"
          >
            Tutorial completo
          </Link>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ── Motion Bento animations ──────────────────────────────────────── */
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.2 } },
};

/* ── Sub-feature components ────────────────────────────────────────── */
function BentoSpotlight({ items }: { items: string[] }) {
  return (
    <ul className="mt-3 space-y-2">
      {items.map((item, i) => (
        <motion.li
          key={item}
          className="flex items-center gap-2"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 * i }}
        >
          <CheckCircle2 className="h-4 w-4 shrink-0 text-[#ff5c00]" />
          <span className="text-sm text-tertiary">{item}</span>
        </motion.li>
      ))}
    </ul>
  );
}

function BentoMetrics({ metrics }: { metrics: Array<{ label: string; value: number; suffix?: string }> }) {
  return (
    <div className="mt-4 space-y-3">
      {metrics.map((m, i) => (
        <motion.div
          key={m.label}
          className="space-y-1"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 * i }}
        >
          <div className="flex justify-between text-xs">
            <span className="font-medium text-tertiary">{m.label}</span>
            <span className="font-semibold text-[#ffb59a]">{m.value}{m.suffix}</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full" style={{ background: "rgba(255,92,0,0.12)" }}>
            <motion.div
              className="h-full rounded-full"
              style={{ background: "linear-gradient(90deg, #ff5c00, #ffb59a)" }}
              initial={{ width: 0 }}
              animate={{ width: `${m.value}%` }}
              transition={{ duration: 1.2, ease: "easeOut", delay: 0.15 * i }}
            />
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function BentoTimeline({ items }: { items: Array<{ year: string; event: string }> }) {
  return (
    <div className="relative mt-3">
      <div className="absolute top-0 bottom-0 left-[9px] w-[2px]" style={{ background: "rgba(255,92,0,0.2)" }} />
      {items.map((item, i) => (
        <motion.div
          key={item.year}
          className="relative mb-3 flex gap-3"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 * i }}
        >
          <div
            className="z-10 mt-0.5 h-5 w-5 shrink-0 rounded-full border-2 flex items-center justify-center"
            style={{ borderColor: "rgba(255,92,0,0.5)", background: "rgba(255,92,0,0.1)" }}
          />
          <div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-[#ff5c00]">{item.year}</div>
            <div className="text-xs text-tertiary mt-0.5">{item.event}</div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function BentoCounter({ start, end, suffix }: { start: number; end: number; suffix: string }) {
  const [count, setCount] = useState(start);
  useEffect(() => {
    const duration = 2000;
    const fps = 1000 / 60;
    const frames = Math.round(duration / fps);
    let frame = 0;
    const id = setInterval(() => {
      frame++;
      const p = 1 - (1 - frame / frames) ** 3;
      setCount(Math.min(start + (end - start) * p, end));
      if (frame === frames) clearInterval(id);
    }, fps);
    return () => clearInterval(id);
  }, [start, end]);
  return (
    <div className="mt-4 flex items-baseline gap-1">
      <span className="font-bold text-4xl" style={{ color: "#ff5c00" }}>
        {count % 1 === 0 ? count.toFixed(0) : count.toFixed(1)}
      </span>
      <span className="text-2xl font-bold text-[#ffb59a]">{suffix}</span>
    </div>
  );
}

function BentoProtocols() {
  const protocols = [
    { name: "Nano Creators", domain: "nanoscreators.xyz" },
    { name: "CryptokMe", domain: "cryptok.me" },
    { name: "Earn", domain: "superteam.fun" },
    { name: "CreatorVerse", domain: "thecreatorverse.xyz" },
    { name: "DRiP", domain: "drip.haus" },
    { name: "40+", domain: null },
  ];
  return (
    <div className="mt-4 grid grid-cols-3 gap-3">
      {protocols.map((p) => (
        <motion.div
          key={p.name}
          className="flex flex-col items-center gap-1.5 rounded-xl p-2.5 transition-all duration-300"
          style={{ background: "rgba(255,92,0,0.06)", border: "1px solid rgba(255,92,0,0.12)" }}
          whileHover={{ borderColor: "rgba(255,92,0,0.35)", background: "rgba(255,92,0,0.1)" }}
        >
          <div className="h-8 w-8 rounded-full overflow-hidden flex items-center justify-center"
            style={{ background: "rgba(255,92,0,0.1)" }}>
            {p.domain ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={`https://www.google.com/s2/favicons?sz=64&domain=${p.domain}`}
                alt={p.name}
                className="w-5 h-5 object-contain"
              />
            ) : (
              <span className="text-[#ff5c00] text-xs font-bold">+</span>
            )}
          </div>
          <span className="text-[9px] font-bold uppercase tracking-widest text-tertiary text-center leading-tight">{p.name}</span>
        </motion.div>
      ))}
    </div>
  );
}

function BentoAI() {
  return (
    <div className="mt-4 flex flex-col gap-2">
      {/* Score bar mock */}
      <div className="flex items-center justify-between mb-1">
        <span className="text-[10px] font-bold uppercase tracking-widest text-tertiary">Score Phoenix</span>
        <span className="text-lg font-bold" style={{ color: "#22c55e" }}>82<span className="text-xs text-tertiary font-normal">/100</span></span>
      </div>
      <div className="h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
        <motion.div
          className="h-full rounded-full"
          style={{ background: "#22c55e" }}
          initial={{ width: 0 }}
          animate={{ width: "82%" }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />
      </div>
      <div className="grid grid-cols-2 gap-1.5 mt-1">
        {[
          { label: "Thread", ok: true },
          { label: "Sem links", ok: true },
          { label: "Hashtags 2", ok: true },
          { label: "3 Emojis", ok: true },
        ].map((h) => (
          <div key={h.label} className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5" style={{ background: "rgba(34,197,94,0.06)", border: "1px solid rgba(34,197,94,0.15)" }}>
            <span className="material-symbols-outlined text-[11px] text-[#22c55e]">check_circle</span>
            <span className="text-[10px] font-semibold text-[#22c55e]">{h.label}</span>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-1.5 mt-1 rounded-lg px-3 py-2" style={{ background: "rgba(255,92,0,0.07)", border: "1px solid rgba(255,92,0,0.2)" }}>
        <span className="material-symbols-outlined text-[13px] text-[#ff5c00]">auto_fix_high</span>
        <span className="text-[10px] font-bold text-[#ff5c00] uppercase tracking-widest">Versão otimizada disponível</span>
      </div>
    </div>
  );
}

/* ── Main animated bento card ─────────────────────────────────────── */
function MotionBentoCard({
  title,
  description,
  feature,
  spotlightItems,
  timeline,
  metrics,
  statistic,
  href,
}: {
  title: string;
  description: string;
  feature: "spotlight" | "metrics" | "timeline" | "counter" | "chart" | "protocols" | "bountyai";
  spotlightItems?: string[];
  timeline?: Array<{ year: string; event: string }>;
  metrics?: Array<{ label: string; value: number; suffix?: string }>;
  statistic?: { value: string; label: string; start: number; end: number; suffix: string };
  href: string;
}) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [2, -2]);
  const rotateY = useTransform(x, [-100, 100], [-2, 2]);

  const isBountyAI = feature === "bountyai";

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const r = e.currentTarget.getBoundingClientRect();
    x.set(((e.clientX - r.left) / r.width - 0.5) * 100);
    y.set(((e.clientY - r.top) / r.height - 0.5) * 100);
  }
  function handleMouseLeave() { x.set(0); y.set(0); }

  return (
    <motion.div
      className="h-full"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      variants={fadeInUp}
      whileHover={{ y: -5 }}
    >
      <Link
        href={href}
        className="group relative flex h-full min-h-[22rem] flex-col gap-3 rounded-2xl p-6 transition-all duration-500"
        style={
          isBountyAI
            ? {
                background: "linear-gradient(135deg, rgba(20,19,19,0.95), rgba(30,25,18,0.95))",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(233,195,73,0.25)",
                boxShadow: "0 4px 20px rgba(0,0,0,0.4), inset 0 0 20px rgba(233,195,73,0.03)",
                transform: "translateZ(0)",
              }
            : {
                background: "rgba(20,19,19,0.9)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(255,92,0,0.14)",
                boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
                transform: "translateZ(0)",
              }
        }
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.border = isBountyAI
            ? "1px solid rgba(233,195,73,0.5)"
            : "1px solid rgba(255,92,0,0.35)";
          (e.currentTarget as HTMLElement).style.boxShadow = isBountyAI
            ? "0 8px 32px rgba(233,195,73,0.1)"
            : "0 8px 32px rgba(255,92,0,0.12)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.border = isBountyAI
            ? "1px solid rgba(233,195,73,0.25)"
            : "1px solid rgba(255,92,0,0.14)";
          (e.currentTarget as HTMLElement).style.boxShadow = isBountyAI
            ? "0 4px 20px rgba(0,0,0,0.4), inset 0 0 20px rgba(233,195,73,0.03)"
            : "0 4px 20px rgba(0,0,0,0.4)";
        }}
      >
        {/* Top gradient sheen */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-[1px] rounded-t-2xl"
          style={{
            background: isBountyAI
              ? "linear-gradient(90deg, transparent, rgba(233,195,73,0.5), transparent)"
              : "linear-gradient(90deg, transparent, rgba(255,92,0,0.2), transparent)",
          }}
        />
        <div
          className="pointer-events-none absolute inset-0 rounded-2xl"
          style={{ background: isBountyAI ? "linear-gradient(to bottom, rgba(233,195,73,0.04) 0%, transparent 40%)" : "linear-gradient(to bottom, rgba(255,92,0,0.04) 0%, transparent 40%)" }}
        />

        <div className="relative z-10 flex h-full flex-col" style={{ transform: "translateZ(20px)" }}>
          <div className="flex items-start justify-between mb-1">
            <div className="flex items-center gap-2">
              {isBountyAI && (
                <span className="material-symbols-outlined text-[18px] text-[#e9c349]">bolt</span>
              )}
              <h3
                className="font-semibold text-xl tracking-tight"
                style={{ color: isBountyAI ? "#e9c349" : "var(--color-on-surface)" }}
              >
                {title}
              </h3>
            </div>
            <ArrowUpRight className="h-5 w-5 text-tertiary opacity-0 transition-opacity duration-200 group-hover:opacity-100 shrink-0 mt-0.5" />
          </div>
          <p className="text-sm text-tertiary leading-relaxed">{description}</p>

          {feature === "spotlight" && spotlightItems && <BentoSpotlight items={spotlightItems} />}
          {feature === "metrics" && metrics && <BentoMetrics metrics={metrics} />}
          {feature === "timeline" && timeline && <BentoTimeline items={timeline} />}
          {feature === "protocols" && <BentoProtocols />}
          {feature === "bountyai" && <BentoAI />}
          {(feature === "counter" || feature === "chart") && statistic && (
            <div className="mt-auto pt-4">
              <BentoCounter start={statistic.start} end={statistic.end} suffix={statistic.suffix} />
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#e9c349] mt-1">{statistic.label}</p>
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
}

function DashboardMockup() {
  return (
    <div
      className="w-full rounded-lg overflow-hidden"
      style={{ background: "#0e0e0e", minHeight: "360px" }}
    >
      {/* Mockup topbar */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-zinc-800/60" style={{ background: "rgba(20,20,20,0.9)" }}>
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#ff5c00]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#e9c349]" />
          <div className="w-2.5 h-2.5 rounded-full bg-zinc-600" />
        </div>
        <div className="flex gap-6">
          {["Timeline","Campaigns","Protocols","Bounty AI"].map(label => (
            <span key={label} className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">{label}</span>
          ))}
        </div>
        <div className="w-6 h-6 rounded-full bg-[rgba(255,92,0,0.2)] border border-[#ff5c00]/30" />
      </div>

      {/* Mockup body */}
      <div className="flex" style={{ minHeight: "320px" }}>
        {/* Sidebar */}
        <div className="w-40 shrink-0 border-r border-zinc-800/40 p-4 flex flex-col gap-2" style={{ background: "rgba(14,14,14,0.8)" }}>
          {[
            { label: "Protocols", active: false },
            { label: "Dashboard", active: true },
            { label: "Campaigns", active: false },
            { label: "Bounty AI", active: false, gold: true },
            { label: "Archive", active: false },
            { label: "Reminders", active: false },
          ].map(({ label, active, gold }) => (
            <div
              key={label}
              className={`flex items-center gap-2 px-3 py-2 rounded text-[10px] font-bold uppercase tracking-widest ${
                active
                  ? "text-[#ff5c00] bg-[rgba(255,92,0,0.08)] border-r-2 border-[#ff5c00]"
                  : gold
                  ? "text-[#e9c349]"
                  : "text-zinc-600"
              }`}
            >
              <div className={`w-1.5 h-1.5 rounded-full ${active ? "bg-[#ff5c00]" : gold ? "bg-[#e9c349]" : "bg-zinc-700"}`} />
              {label}
            </div>
          ))}
        </div>

        {/* Main content */}
        <div className="flex-1 p-6 flex flex-col gap-4">
          {/* Stat row */}
          <div className="grid grid-cols-4 gap-3">
            {[
              { label: "Total", value: "12", color: "#e9c349" },
              { label: "Ativas", value: "8", color: "#ff5c00" },
              { label: "Concluídas", value: "3", color: "#ffb59a" },
              { label: "Atrasadas", value: "1", color: "#ef4444" },
            ].map(({ label, value, color }) => (
              <div key={label} className="rounded-lg p-3 border border-zinc-800/50" style={{ background: "rgba(32,31,31,0.6)" }}>
                <div className="text-[8px] font-bold uppercase tracking-widest text-zinc-500 mb-1">{label}</div>
                <div className="text-lg font-bold" style={{ color }}>{value}</div>
              </div>
            ))}
          </div>

          {/* Campaign cards */}
          <div className="flex flex-col gap-2">
            {[
              { title: "Rally Season 3 Bounty", progress: 75, status: "ATIVO", color: "#ff5c00" },
              { title: "Clasho Beta Hunt", progress: 40, status: "ATIVO", color: "#ff5c00" },
              { title: "MagVerse Explorer", progress: 100, status: "CONCLUÍDO", color: "#e9c349" },
            ].map(({ title, progress, status, color }) => (
              <div key={title} className="flex items-center gap-4 px-4 py-3 rounded-lg border border-zinc-800/40" style={{ background: "rgba(42,42,42,0.5)" }}>
                <div className="flex-1">
                  <div className="text-[10px] font-semibold text-zinc-300 mb-1">{title}</div>
                  <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${progress}%`, background: color }} />
                  </div>
                </div>
                <span className="text-[8px] font-bold uppercase tracking-widest" style={{ color }}>{status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
