"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
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

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:auto-rows-[22rem]">
            {/* Timeline — col-span-2 */}
            <BentoCard
              className="md:col-span-2"
              icon={<IconTimeline />}
              title={t.f1Title}
              description={t.f1Desc}
              cta={t.f1Cta}
              href="/auth/signup"
              background={
                <div className="absolute inset-0 overflow-hidden opacity-25 pointer-events-none">
                  {[...Array(8)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute left-0 right-0 h-px"
                      style={{ top: `${10 + i * 12}%`, background: `rgba(255,92,0,${0.2 + i * 0.08})` }}
                    />
                  ))}
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-3 h-3 rounded-full border-2 border-[#ff5c00]"
                      style={{ left: `${15 + i * 18}%`, top: `${10 + i * 12}%`, background: "rgba(255,92,0,0.3)" }}
                    />
                  ))}
                </div>
              }
            />

            {/* Canvas — col-span-1 */}
            <BentoCard
              className="md:col-span-1"
              icon={<IconCanvas />}
              title={t.f2Title}
              description={t.f2Desc}
              cta={t.f2Cta}
              href="/auth/signup"
              background={
                <div className="absolute inset-0 overflow-hidden opacity-20 pointer-events-none"
                  style={{
                    backgroundImage: "radial-gradient(circle, rgba(233,195,73,0.4) 1px, transparent 1px)",
                    backgroundSize: "28px 28px",
                  }}
                />
              }
            />

            {/* Reminders — col-span-1 */}
            <BentoCard
              className="md:col-span-1"
              icon={<IconReminders />}
              title={t.f3Title}
              description={t.f3Desc}
              cta={t.f3Cta}
              href="/auth/signup"
              background={
                <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-8 pointer-events-none">
                  <span className="material-symbols-outlined text-[120px] text-[#ffb59a] filled">alarm</span>
                </div>
              }
            />

            {/* Google Drive — col-span-1 */}
            <BentoCard
              className="md:col-span-1"
              icon={<IconGoogleDrive />}
              title={t.f4Title}
              description={t.f4Desc}
              cta={t.f4Cta}
              href="/auth/signup"
              background={
                <div className="absolute inset-0 overflow-hidden opacity-15 pointer-events-none"
                  style={{
                    background: "radial-gradient(ellipse 80% 80% at 80% 80%, rgba(255,92,0,0.25) 0%, transparent 70%)",
                  }}
                />
              }
            />

            {/* DropBox — col-span-1 */}
            <BentoCard
              className="md:col-span-1"
              icon={<IconDropbox />}
              title={t.f5Title}
              description={t.f5Desc}
              cta={t.f5Cta}
              href="/auth/signup"
              background={
                <div className="absolute inset-0 overflow-hidden opacity-15 pointer-events-none"
                  style={{
                    backgroundImage: "linear-gradient(135deg, rgba(255,92,0,0.1) 25%, transparent 25%, transparent 50%, rgba(255,92,0,0.1) 50%, rgba(255,92,0,0.1) 75%, transparent 75%)",
                    backgroundSize: "40px 40px",
                  }}
                />
              }
            />

            {/* Referral System — col-span-1 */}
            <BentoCard
              className="md:col-span-1"
              icon={<IconReferral />}
              title={t.f6Title}
              description={t.f6Desc}
              cta={t.f6Cta}
              href="/auth/signup"
              background={
                <div className="absolute inset-0 overflow-hidden opacity-10 pointer-events-none flex items-end justify-end pr-6 pb-6">
                  <span className="material-symbols-outlined text-[100px] text-[#ffb59a]">group</span>
                </div>
              }
            />
          </div>
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

function BentoCard({
  icon,
  title,
  description,
  cta,
  href,
  background,
  className = "",
}: {
  icon: ReactNode;
  title: string;
  description: string;
  cta: string;
  href: string;
  background?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`group relative flex flex-col justify-end overflow-hidden rounded-2xl min-h-[22rem] transition-all duration-300 hover:shadow-[0_0_40px_rgba(255,92,0,0.12)] hover:border-[rgba(255,92,0,0.25)] ${className}`}
      style={{
        background: "rgba(24,23,23,0.85)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(233,195,73,0.12)",
      }}
    >
      {background}
      <div className="relative z-10 p-8 flex flex-col gap-2 transition-all duration-300 lg:group-hover:-translate-y-8">
        <div className="mb-2 transition-all duration-300 lg:group-hover:scale-75 lg:group-hover:origin-left">
          {icon}
        </div>
        <h3 className="text-xl font-semibold text-on-surface">{title}</h3>
        <p className="text-sm text-tertiary leading-relaxed max-w-lg">{description}</p>
      </div>
      <div className="relative z-10 px-8 pb-8 opacity-100 translate-y-0 transition-all duration-300 lg:opacity-0 lg:translate-y-4 lg:group-hover:opacity-100 lg:group-hover:translate-y-0">
        <Link
          href={href}
          className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#ffb59a] hover:gap-4 transition-all"
        >
          {cta}
          <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
        </Link>
      </div>
      <div className="pointer-events-none absolute inset-0 rounded-2xl transition-all duration-300 group-hover:bg-[rgba(255,92,0,0.025)]" />
    </div>
  );
}

/* ── Feature SVG Icons ─────────────────────────────────────────────── */
function IconTimeline() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
      <defs>
        <linearGradient id="ig-timeline" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ffb59a" />
          <stop offset="1" stopColor="#ff5c00" />
        </linearGradient>
      </defs>
      <rect width="48" height="48" rx="12" fill="rgba(255,92,0,0.1)" />
      <line x1="12" y1="16" x2="36" y2="16" stroke="url(#ig-timeline)" strokeWidth="2" strokeLinecap="round" />
      <circle cx="18" cy="16" r="3" fill="url(#ig-timeline)" />
      <line x1="12" y1="24" x2="36" y2="24" stroke="url(#ig-timeline)" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.6" />
      <circle cx="28" cy="24" r="3" fill="url(#ig-timeline)" fillOpacity="0.7" />
      <line x1="12" y1="32" x2="36" y2="32" stroke="url(#ig-timeline)" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.35" />
      <circle cx="22" cy="32" r="3" fill="url(#ig-timeline)" fillOpacity="0.45" />
    </svg>
  );
}

function IconCanvas() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
      <defs>
        <linearGradient id="ig-canvas" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ffb59a" />
          <stop offset="1" stopColor="#ff5c00" />
        </linearGradient>
      </defs>
      <rect width="48" height="48" rx="12" fill="rgba(255,92,0,0.1)" />
      {[[10,10],[22,10],[34,10],[10,22],[22,22],[34,22],[10,34],[22,34],[34,34]].map(([cx,cy], i) => (
        <rect key={i} x={cx} y={cy} width="8" height="8" rx="2"
          fill="url(#ig-canvas)"
          fillOpacity={i === 4 ? 1 : i < 3 ? 0.8 : i < 6 ? 0.5 : 0.25}
        />
      ))}
    </svg>
  );
}

function IconReminders() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
      <defs>
        <linearGradient id="ig-reminder" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ffb59a" />
          <stop offset="1" stopColor="#ff5c00" />
        </linearGradient>
      </defs>
      <rect width="48" height="48" rx="12" fill="rgba(255,92,0,0.1)" />
      <path d="M24 9 C17 9 13 14 13 20 L13 30 L10 33 L38 33 L35 30 L35 20 C35 14 31 9 24 9Z"
        fill="url(#ig-reminder)" fillOpacity="0.9" />
      <rect x="21" y="7" width="6" height="4" rx="2" fill="url(#ig-reminder)" />
      <path d="M20 34 C20 36.2 21.8 38 24 38 C26.2 38 28 36.2 28 34Z"
        fill="url(#ig-reminder)" fillOpacity="0.7" />
    </svg>
  );
}

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

function IconReferral() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
      <defs>
        <linearGradient id="ig-referral" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ffb59a" />
          <stop offset="1" stopColor="#ff5c00" />
        </linearGradient>
      </defs>
      <rect width="48" height="48" rx="12" fill="rgba(255,92,0,0.1)" />
      <circle cx="24" cy="15" r="5" fill="url(#ig-referral)" />
      <path d="M13 33 C13 26.4 18 22 24 22 C30 22 35 26.4 35 33Z" fill="url(#ig-referral)" fillOpacity="0.8" />
      <circle cx="12" cy="18" r="3.5" fill="url(#ig-referral)" fillOpacity="0.55" />
      <path d="M5 32 C5 27.6 8.1 24.5 12 24.5" stroke="url(#ig-referral)" strokeWidth="2" strokeOpacity="0.55" strokeLinecap="round" />
      <circle cx="36" cy="18" r="3.5" fill="url(#ig-referral)" fillOpacity="0.55" />
      <path d="M43 32 C43 27.6 39.9 24.5 36 24.5" stroke="url(#ig-referral)" strokeWidth="2" strokeOpacity="0.55" strokeLinecap="round" />
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
