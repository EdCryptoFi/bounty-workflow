"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { CheckCircle2, ArrowUpRight } from "lucide-react";
import { motion, useMotionValue, useTransform, type Variants } from "motion/react";
import { GlowCard } from "@/components/ui/glow-card";

const COPY = {
  pt: {
    badge: "NOVA EDIÇÃO COSMIC DISPONÍVEL",
    heroGradient: "fluxo de trabalho",
    heroPre: "Domine seu",
    heroPost: "com precisão.",
    heroSub:
      "A Bounty Workflow redefine a produtividade galáctica. Gerencie campanhas, protocolos e automações em uma interface de vidro imersiva feita para visionários.",
    cta: "Começar grátis",
    ctaDemo: "Ver Demonstração",
    login: "Entrar",
    featuresTitle: "Ferramentas de Próxima Geração",
    featuresSub: "Arquitetura modular para escalabilidade infinita.",
    f1Title: "Timeline",
    f1Desc: "Visualize o ciclo de vida completo de seus projetos com precisão temporal absoluta.",
    f1Cta: "EXPLORAR",
    f2Title: "Canvas",
    f2Desc: "Uma tela infinita para mapear protocolos complexos e fluxos de automação sem limites.",
    f2Cta: "CONFIGURAR",
    f3Title: "Reminders",
    f3Desc: "Alertas inteligentes acionados por IA que garantem que nenhuma etapa crítica seja perdida.",
    f3Cta: "AGENDAR",
    f4Title: "Google Drive",
    f4Desc: "Conecte seu Drive e anexe evidências, prints e documentos direto às suas campanhas.",
    f4Cta: "CONECTAR",
    f5Title: "DropBox",
    f5Desc: "Integração com DropBox para armazenar e compartilhar arquivos de bounty com segurança.",
    f5Cta: "INTEGRAR",
    f6Title: "Referral System",
    f6Desc: "Indique outros hunters e acumule recompensas. Programa de indicação exclusivo para membros.",
    f6Cta: "INDICAR",
    statUptime: "99.9% Up-time",
    statUptimeDesc:
      "Nossa infraestrutura distribuída garante que sua equipe nunca pare, não importa onde estejam.",
    statOrgs: "50k+",
    statOrgsLabel: "ORGANIZAÇÕES ATIVAS",
    statLatency: "2.4s",
    statLatencyLabel: "LATÊNCIA MÉDIA",
    statGlobal: "Global Ready",
    footerCopy: "BOUNTY WORKFLOW. TODOS OS DIREITOS RESERVADOS.",
    footerPrivacy: "Privacidade",
    footerTerms: "Termos de Uso",
    footerStatus: "Status do Sistema",
    navHow: "Como funciona",
    navCampaigns: "Campaigns",
    navProtocols: "Protocols",
  },
  en: {
    badge: "NEW COSMIC EDITION AVAILABLE",
    heroGradient: "workflow",
    heroPre: "Master your",
    heroPost: "with precision.",
    heroSub:
      "Bounty Workflow redefines galactic productivity. Manage campaigns, protocols and automations in an immersive glass interface built for visionaries.",
    cta: "Start for free",
    ctaDemo: "See Demo",
    login: "Sign in",
    featuresTitle: "Next Generation Tools",
    featuresSub: "Modular architecture for infinite scalability.",
    f1Title: "Timeline",
    f1Desc: "Visualize the complete lifecycle of your projects with absolute temporal precision.",
    f1Cta: "EXPLORE",
    f2Title: "Canvas",
    f2Desc: "An infinite canvas to map complex protocols and automation flows without limits.",
    f2Cta: "CONFIGURE",
    f3Title: "Reminders",
    f3Desc: "AI-triggered smart alerts that ensure no critical step is ever missed.",
    f3Cta: "SCHEDULE",
    f4Title: "Google Drive",
    f4Desc: "Connect your Drive and attach evidence, screenshots and documents directly to your campaigns.",
    f4Cta: "CONNECT",
    f5Title: "DropBox",
    f5Desc: "DropBox integration to securely store and share bounty files with your team.",
    f5Cta: "INTEGRATE",
    f6Title: "Referral System",
    f6Desc: "Invite other hunters and earn rewards. Exclusive referral program for members.",
    f6Cta: "REFER",
    statUptime: "99.9% Up-time",
    statUptimeDesc:
      "Our distributed infrastructure ensures your team never stops, no matter where in the universe they are.",
    statOrgs: "50k+",
    statOrgsLabel: "ACTIVE ORGANIZATIONS",
    statLatency: "2.4s",
    statLatencyLabel: "AVERAGE LATENCY",
    statGlobal: "Global Ready",
    footerCopy: "BOUNTY WORKFLOW. ALL RIGHTS RESERVED.",
    footerPrivacy: "Privacy Policy",
    footerTerms: "Terms of Service",
    footerStatus: "System Status",
    navHow: "How it works",
    navCampaigns: "Campaigns",
    navProtocols: "Protocols",
  },
} as const;

type Lang = "pt" | "en";

export function LandingClient({ defaultLang }: { defaultLang: Lang }) {
  const [lang, setLang] = useState<Lang>(defaultLang);
  const t = COPY[lang];

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
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="Bounty Workflow" className="h-10 w-10 object-contain" />
          <span className="text-xl font-black tracking-tighter text-[#ff5c00]">
            Bounty Workflow
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <Link href="/como-funciona" className="text-[#ff7b33] text-sm font-medium hover:text-[#ffb59a] transition-colors">
            {t.navHow}
          </Link>
          <Link href="/campaigns" className="text-zinc-400 text-sm hover:text-[#ff7b33] transition-colors">
            {t.navCampaigns}
          </Link>
          <Link href="/protocols" className="text-zinc-400 text-sm hover:text-[#ff7b33] transition-colors">
            {t.navProtocols}
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          {/* Language switcher — PT-BR | EN */}
          <div className="flex items-center rounded border border-zinc-700/60 bg-zinc-900/40 overflow-hidden text-[10px] font-bold uppercase tracking-widest">
            <button
              type="button"
              onClick={() => setLang("pt")}
              className={`px-2.5 py-1.5 transition-all ${lang === "pt" ? "bg-[#e9c349] text-zinc-900" : "text-zinc-500 hover:text-[#e9c349]"}`}
            >
              PT-BR
            </button>
            <span className="text-zinc-700">|</span>
            <button
              type="button"
              onClick={() => setLang("en")}
              className={`px-2.5 py-1.5 transition-all ${lang === "en" ? "bg-[#e9c349] text-zinc-900" : "text-zinc-500 hover:text-[#e9c349]"}`}
            >
              EN
            </button>
          </div>
          <Link href="/auth/login" className="text-zinc-400 text-sm hover:text-[#ff7b33] transition-colors">
            {t.login}
          </Link>
          <Link
            href="/auth/signup"
            className="px-5 py-2 bg-[#ff5c00] text-white text-xs font-bold uppercase tracking-widest rounded hover:bg-[#ff7b33] hover:shadow-[0_0_20px_rgba(255,92,0,0.4)] transition-all duration-300 active:scale-95"
          >
            {t.cta}
          </Link>
        </div>
      </header>

      {/* ── Main ── */}
      <main className="flex-grow pt-32 pb-24 relative z-10">

        {/* ── Hero ── */}
        <section className="relative px-6 mb-32 max-w-[1400px] mx-auto w-full">
          <div className="max-w-4xl mx-auto flex flex-col items-center text-center relative z-10">
            {/* Hero logo */}
            <div className="mb-10 relative">
              <div
                className="absolute inset-0 blur-3xl opacity-30 pointer-events-none"
                style={{ background: "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(255,92,0,0.4) 0%, transparent 70%)" }}
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo-horizontal.png"
                alt="Bounty Workflow"
                className="h-28 sm:h-36 object-contain relative z-10"
                style={{ filter: "drop-shadow(0 0 24px rgba(255,92,0,0.35))" }}
              />
            </div>

            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#e9c349]/30 mb-8"
              style={{ background: "rgba(32,31,31,0.7)", backdropFilter: "blur(20px)" }}>
              <span
                className="w-2 h-2 rounded-full bg-[#ff5c00] animate-pulse"
                style={{ boxShadow: "0 0 8px #ff5c00" }}
              />
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#e9c349]">
                {t.badge}
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-[52px] sm:text-[64px] font-bold tracking-tight leading-[1.1] text-on-surface mb-6">
              {t.heroPre}{" "}
              <span
                style={{
                  background: "linear-gradient(135deg, #ffb59a 0%, #ff5c00 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {t.heroGradient}
              </span>{" "}
              {t.heroPost}
            </h1>

            <p className="text-base text-tertiary max-w-2xl leading-relaxed mb-12">
              {t.heroSub}
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 mb-20">
              <Link
                href="/auth/signup"
                className="px-8 py-4 bg-[#ff5c00] text-white text-xs font-bold uppercase tracking-widest rounded hover:brightness-110 hover:shadow-[0_0_30px_rgba(255,92,0,0.4)] transition-all duration-300 active:scale-95"
              >
                {t.cta}
              </Link>
              <Link
                href="/como-funciona"
                className="px-8 py-4 text-on-surface text-xs font-bold uppercase tracking-widest rounded border border-[#e9c349]/30 hover:bg-surface-container-highest transition-all duration-300"
                style={{ background: "rgba(32,31,31,0.7)", backdropFilter: "blur(20px)" }}
              >
                {t.ctaDemo}
              </Link>
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
                {/* Animated orange gradient overlay */}
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

        {/* ── Features Bento ── */}
        <section className="mb-32 max-w-[1400px] mx-auto px-12">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-on-surface mb-3">{t.featuresTitle}</h2>
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
            <p className="text-sm text-tertiary">{t.featuresSub}</p>
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
                  title={lang === "pt" ? "Rede de Protocolos" : "Protocol Network"}
                  description={lang === "pt"
                    ? "Conectado aos maiores protocolos DeFi e NFT do ecossistema. Um catálogo vivo, sempre atualizado."
                    : "Connected to the leading DeFi and NFT protocols in the ecosystem. A living catalog, always up to date."}
                  feature="protocols"
                  href="/auth/signup"
                />
              </motion.div>
              <motion.div className="md:col-span-2" variants={fadeInUp}>
                <MotionBentoCard
                  title={lang === "pt" ? "Gestão de Campanhas" : "Campaign Management"}
                  description={lang === "pt"
                    ? "Orquestre cada campanha de bounty do início ao fim com total visibilidade e controle."
                    : "Orchestrate every bounty campaign from start to finish with full visibility and control."}
                  feature="spotlight"
                  spotlightItems={lang === "pt"
                    ? ["Reordenação de etapas por drag & drop", "Fluxo multi-status (Todo → Em Progresso → Concluído)", "Campanhas vinculadas a protocolos", "Rastreamento de prazo com alertas", "Progresso visual por etapa"]
                    : ["Drag & drop step reordering", "Multi-status flow (Todo → In Progress → Done)", "Protocol-linked campaigns", "Deadline proximity tracking", "Visual progress per step"]}
                  href="/auth/signup"
                />
              </motion.div>
            </div>

            {/* Row 2 */}
            <div className="grid gap-5 md:grid-cols-3">
              <motion.div className="md:col-span-2" variants={fadeInUp}>
                <MotionBentoCard
                  title={lang === "pt" ? "Alertas Inteligentes" : "Smart Reminders"}
                  description={lang === "pt"
                    ? "Sistema de alertas ciente de prazos que mantém sua equipe sempre no ritmo certo."
                    : "Deadline-aware alert system that keeps your team consistently on track."}
                  feature="metrics"
                  metrics={[
                    { label: lang === "pt" ? "Cobertura de prazos" : "Deadline coverage", value: 95, suffix: "%" },
                    { label: lang === "pt" ? "Entrega no prazo" : "On-time delivery", value: 87, suffix: "%" },
                    { label: lang === "pt" ? "Resposta a alertas" : "Alert response rate", value: 78, suffix: "%" },
                  ]}
                  href="/auth/signup"
                />
              </motion.div>
              <motion.div className="md:col-span-1" variants={fadeInUp}>
                <MotionBentoCard
                  title={lang === "pt" ? "Ciclo do Bounty" : "Bounty Lifecycle"}
                  description={lang === "pt"
                    ? "Da descoberta ao pagamento, cada etapa rastreada em tempo real."
                    : "From discovery to payout, every stage tracked in real time."}
                  feature="timeline"
                  timeline={[
                    { year: "01", event: lang === "pt" ? "Protocolo atribuído & campanha criada" : "Protocol assigned & campaign created" },
                    { year: "02", event: lang === "pt" ? "Etapas definidas com prazos" : "Steps defined with deadlines" },
                    { year: "03", event: lang === "pt" ? "Em execução — alertas ativos" : "In progress — alerts active" },
                    { year: "04", event: lang === "pt" ? "Revisão & submissão" : "Review & submission" },
                    { year: "05", event: lang === "pt" ? "Pagamento confirmado" : "Payout confirmed" },
                  ]}
                  href="/auth/signup"
                />
              </motion.div>
            </div>

            {/* Row 3 */}
            <div className="grid gap-5 md:grid-cols-3">
              <motion.div className="md:col-span-1" variants={fadeInUp}>
                <MotionBentoCard
                  title={lang === "pt" ? "Armazenamento" : "File Storage"}
                  description={lang === "pt"
                    ? "Anexe evidências, prints e documentos às suas campanhas via Google Drive ou DropBox."
                    : "Attach evidence, screenshots and documents to campaigns via Google Drive or DropBox."}
                  feature="storage"
                  href="/auth/signup"
                />
              </motion.div>
              <motion.div className="md:col-span-1" variants={fadeInUp}>
                <MotionBentoCard
                  title={lang === "pt" ? "Sistema de Indicação" : "Referral System"}
                  description={lang === "pt"
                    ? "Indique outros hunters e multiplique suas recompensas. Programa exclusivo para membros."
                    : "Invite hunters and multiply your rewards. Exclusive program for members."}
                  feature="counter"
                  statistic={{ value: "2.4×", label: lang === "pt" ? "MULTIPLICADOR DE RECOMPENSA" : "REWARD MULTIPLIER", start: 0, end: 2.4, suffix: "×" }}
                  href="/auth/signup"
                />
              </motion.div>
              <motion.div className="md:col-span-1" variants={fadeInUp}>
                <MotionBentoCard
                  title={lang === "pt" ? "Canvas Infinito" : "Infinite Canvas"}
                  description={lang === "pt"
                    ? "Uma tela infinita para mapear protocolos complexos e automações sem nenhum limite."
                    : "An infinite canvas to map complex protocols and automation flows without limits."}
                  feature="chart"
                  statistic={{ value: "∞", label: lang === "pt" ? "NÓS NO CANVAS" : "CANVAS NODES", start: 0, end: 100, suffix: "+" }}
                  href="/auth/signup"
                />
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* ── Stats Bento ── */}
        <section className="max-w-[1400px] mx-auto px-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:h-[600px]">
            {/* 99.9% Uptime — large 2x2 */}
            <GlowCard className="md:col-span-2 md:row-span-2 group">
            <div
              className="rounded-[11px] p-10 flex flex-col justify-end overflow-hidden relative h-full"
              style={{ background: "rgba(32,31,31,0.7)", backdropFilter: "blur(20px)" }}
            >
              {/* Decorative bg */}
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  background:
                    "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(255,92,0,0.4) 0%, transparent 70%)",
                }}
              />
              <div
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage:
                    "linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)",
                  backgroundSize: "24px 24px",
                }}
              />
              {/* Circuit decoration */}
              <div className="absolute top-8 left-8 right-8 flex gap-3 opacity-30">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-1 flex-1 rounded-full bg-[#ff5c00]" style={{ opacity: 0.3 + i * 0.1 }} />
                ))}
              </div>
              <div className="relative z-10">
                <h4 className="text-5xl font-bold text-on-surface mb-4">{t.statUptime}</h4>
                <p className="text-base text-tertiary max-w-sm leading-relaxed">{t.statUptimeDesc}</p>
              </div>
            </div>
            </GlowCard>

            {/* 50k+ Orgs */}
            <GlowCard className="md:col-span-2">
            <div
              className="rounded-[11px] p-8 flex items-center justify-between h-full"
              style={{ background: "rgba(32,31,31,0.7)", backdropFilter: "blur(20px)" }}
            >
              <div>
                <span className="text-5xl font-bold text-[#ff5c00]">{t.statOrgs}</span>
                <p className="text-[11px] font-bold uppercase tracking-widest text-[#e9c349] mt-2">
                  {t.statOrgsLabel}
                </p>
              </div>
              {/* Avatar stack */}
              <div className="flex -space-x-3">
                {["E","A","M","J"].map((initial, i) => (
                  <div
                    key={i}
                    className="w-12 h-12 rounded-full border-2 border-[#131313] flex items-center justify-center text-xs font-bold text-white"
                    style={{ background: ["#ff5c00","#e9c349","#ffb59a","#a73a00"][i] }}
                  >
                    {initial}
                  </div>
                ))}
                <div className="w-12 h-12 rounded-full border-2 border-[#131313] bg-surface-container flex items-center justify-center text-[10px] font-bold text-on-surface">
                  +12k
                </div>
              </div>
            </div>
            </GlowCard>

            {/* Latency */}
            <GlowCard className="md:col-span-1">
            <div
              className="rounded-[11px] p-8 text-center flex flex-col justify-center h-full"
              style={{ background: "rgba(32,31,31,0.7)", backdropFilter: "blur(20px)" }}
            >
              <span className="material-symbols-outlined text-[40px] text-[#e9c349] mb-2 filled">bolt</span>
              <span className="text-3xl font-bold text-on-surface">{t.statLatency}</span>
              <p className="text-[10px] font-bold uppercase tracking-widest text-tertiary mt-2">
                {t.statLatencyLabel}
              </p>
            </div>
            </GlowCard>

            {/* Global Ready */}
            <GlowCard className="md:col-span-1">
            <div
              className="rounded-[11px] p-8 flex flex-col justify-center items-center text-center text-white h-full hover:brightness-110 transition-all duration-300"
              style={{ background: "#ff5c00", boxShadow: "0 0 20px rgba(255,92,0,0.3)" }}
            >
              <span className="material-symbols-outlined text-[40px] mb-2 filled">language</span>
              <p className="text-xl font-bold">{t.statGlobal}</p>
            </div>
            </GlowCard>
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
          © {new Date().getFullYear()} {t.footerCopy}
        </p>
        <div className="flex gap-8">
          <Link href="/legal/privacidade" className="text-zinc-600 text-[10px] uppercase tracking-[0.2em] font-semibold hover:text-[#e9c349] transition-colors">
            {t.footerPrivacy}
          </Link>
          <Link href="/legal/termos" className="text-zinc-600 text-[10px] uppercase tracking-[0.2em] font-semibold hover:text-[#e9c349] transition-colors">
            {t.footerTerms}
          </Link>
          <span className="text-zinc-600 text-[10px] uppercase tracking-[0.2em] font-semibold flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ff5c00]" />
            {t.footerStatus}
          </span>
        </div>
      </footer>
    </div>
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
    { name: "DRiP", domain: "drip.haus" },
    { name: "MagicEden", domain: "magiceden.io" },
    { name: "Rally", domain: "rally.io" },
    { name: "P2P Kols", domain: "p2pkols.com" },
    { name: "3Look", domain: "3look.io" },
    { name: "More", domain: null },
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

function BentoStorage() {
  return (
    <div className="mt-6 flex gap-4">
      {[
        { name: "Google Drive", icon: <IconGoogleDrive /> },
        { name: "DropBox", icon: <IconDropbox /> },
      ].map((item) => (
        <motion.div
          key={item.name}
          className="flex-1 flex flex-col items-center gap-2 rounded-xl p-4"
          style={{ background: "rgba(255,92,0,0.06)", border: "1px solid rgba(255,92,0,0.12)" }}
          whileHover={{ borderColor: "rgba(255,92,0,0.35)" }}
        >
          {item.icon}
          <span className="text-[10px] font-bold uppercase tracking-widest text-tertiary">{item.name}</span>
        </motion.div>
      ))}
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
  feature: "spotlight" | "metrics" | "timeline" | "counter" | "chart" | "protocols" | "storage";
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
        style={{
          background: "rgba(20,19,19,0.9)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255,92,0,0.14)",
          boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
          transform: "translateZ(0)",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.border = "1px solid rgba(255,92,0,0.35)";
          (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 32px rgba(255,92,0,0.12)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.border = "1px solid rgba(255,92,0,0.14)";
          (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 20px rgba(0,0,0,0.4)";
        }}
      >
        {/* Subtle top gradient sheen */}
        <div
          className="pointer-events-none absolute inset-0 rounded-2xl"
          style={{ background: "linear-gradient(to bottom, rgba(255,92,0,0.04) 0%, transparent 40%)" }}
        />

        <div className="relative z-10 flex h-full flex-col" style={{ transform: "translateZ(20px)" }}>
          <div className="flex items-start justify-between mb-1">
            <h3 className="font-semibold text-xl tracking-tight text-on-surface">{title}</h3>
            <ArrowUpRight className="h-5 w-5 text-tertiary opacity-0 transition-opacity duration-200 group-hover:opacity-100 shrink-0 mt-0.5" />
          </div>
          <p className="text-sm text-tertiary leading-relaxed">{description}</p>

          {feature === "spotlight" && spotlightItems && <BentoSpotlight items={spotlightItems} />}
          {feature === "metrics" && metrics && <BentoMetrics metrics={metrics} />}
          {feature === "timeline" && timeline && <BentoTimeline items={timeline} />}
          {feature === "protocols" && <BentoProtocols />}
          {feature === "storage" && <BentoStorage />}
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

/* ── Feature SVG Icons (used in BentoStorage) ──────────────────────── */
function IconGoogleDrive() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
      <defs>
        <linearGradient id="ig-drive" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ffb59a" />
          <stop offset="1" stopColor="#ff5c00" />
        </linearGradient>
      </defs>
      <rect width="48" height="48" rx="12" fill="rgba(255,92,0,0.1)" />
      <polygon points="24,10 8,37 16,37" fill="url(#ig-drive)" fillOpacity="0.9" />
      <polygon points="24,10 40,37 32,37" fill="url(#ig-drive)" fillOpacity="0.6" />
      <polygon points="16,37 32,37 24,21" fill="url(#ig-drive)" fillOpacity="0.75" />
    </svg>
  );
}

function IconDropbox() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
      <defs>
        <linearGradient id="ig-dropbox" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ffb59a" />
          <stop offset="1" stopColor="#ff5c00" />
        </linearGradient>
      </defs>
      <rect width="48" height="48" rx="12" fill="rgba(255,92,0,0.1)" />
      <polygon points="24,11 10,20 24,29 38,20" fill="url(#ig-dropbox)" fillOpacity="0.9" />
      <polygon points="10,29 24,38 38,29 24,20" fill="url(#ig-dropbox)" fillOpacity="0.55" />
    </svg>
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
          {["Timeline","Campaigns","Protocols","Reminders"].map(label => (
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
            { label: "Archive", active: false },
            { label: "Reminders", active: false },
          ].map(({ label, active }) => (
            <div
              key={label}
              className={`flex items-center gap-2 px-3 py-2 rounded text-[10px] font-bold uppercase tracking-widest ${
                active
                  ? "text-[#ff5c00] bg-[rgba(255,92,0,0.08)] border-r-2 border-[#ff5c00]"
                  : "text-zinc-600"
              }`}
            >
              <div className={`w-1.5 h-1.5 rounded-full ${active ? "bg-[#ff5c00]" : "bg-zinc-700"}`} />
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
