"use client";

import { useState } from "react";
import Link from "next/link";

const COPY = {
  pt: {
    badge: "14 dias grátis · sem cartão",
    heroLine1: "Nunca mais perca um",
    heroHighlight: "bounty",
    heroLine2: "por prazo vencido.",
    heroSub:
      "Organize campanhas, visualize deadlines e receba lembretes no tempo certo — feito pra hunters do Brasil.",
    cta: "Começar grátis",
    ctaSub: "Como funciona",
    login: "Entrar",
    f1Title: "Timeline por deadline",
    f1Desc:
      "Veja todas as campanhas numa linha do tempo. O que é urgente vai pra cima.",
    f2Title: "Workflow visual",
    f2Desc:
      "Clique numa campanha e abra o fluxo completo: tarefas, dependências, anexos.",
    f3Title: "Lembretes no tempo certo",
    f3Desc: "Email e notificações antes do deadline, sem spam.",
    footerCopy: "Bounty WorkFlow — por Ed",
    footerHow: "Como funciona",
    footerTerms: "Termos de uso",
    footerPrivacy: "Privacidade",
  },
  en: {
    badge: "14 days free · no card required",
    heroLine1: "Never miss a",
    heroHighlight: "bounty",
    heroLine2: "deadline again.",
    heroSub:
      "Organize campaigns, visualize deadlines and get reminders at the right time — built for crypto hunters.",
    cta: "Start for free",
    ctaSub: "How it works",
    login: "Sign in",
    f1Title: "Deadline timeline",
    f1Desc:
      "See all campaigns on a timeline. The most urgent ones rise to the top.",
    f2Title: "Visual workflow",
    f2Desc:
      "Click a campaign and open the full flow: tasks, dependencies, attachments.",
    f3Title: "Timely reminders",
    f3Desc: "Email and push notifications before deadline, no spam.",
    footerCopy: "Bounty WorkFlow — by Ed",
    footerHow: "How it works",
    footerTerms: "Terms of use",
    footerPrivacy: "Privacy",
  },
} as const;

type Lang = "pt" | "en";

export function LandingClient({ defaultLang }: { defaultLang: Lang }) {
  const [lang, setLang] = useState<Lang>(defaultLang);
  const t = COPY[lang];

  return (
    <main className="min-h-screen relative overflow-hidden" style={{ background: "#0e0e0e" }}>
      {/* Grid texture */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(28,27,27,0.8) 1px, transparent 1px), linear-gradient(to bottom, rgba(28,27,27,0.8) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* Ambient gradients */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 20% 30%, rgba(255,92,0,0.10) 0%, transparent 60%), radial-gradient(ellipse 60% 40% at 80% 70%, rgba(233,195,73,0.07) 0%, transparent 60%)",
        }}
      />

      {/* ── Header ── */}
      <header className="relative z-10 container mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-[rgba(255,92,0,0.15)] border border-[#ff5c00]/30 flex items-center justify-center">
            <span className="material-symbols-outlined text-[#ff5c00] text-[18px] filled">
              rocket_launch
            </span>
          </div>
          <span className="text-sm font-bold text-[#ff5c00] tracking-tight">
            Bounty WorkFlow
          </span>
        </Link>

        <nav className="flex items-center gap-3 text-sm">
          <Link
            href="/como-funciona"
            className="hidden text-tertiary hover:text-on-surface transition-colors sm:inline text-xs font-medium"
          >
            {t.ctaSub}
          </Link>
          <Link
            href="/auth/login"
            className="text-tertiary hover:text-on-surface transition-colors text-xs font-medium"
          >
            {t.login}
          </Link>
          <Link
            href="/auth/signup"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#ff5c00] hover:bg-[#ff7b33] text-white text-xs font-bold uppercase tracking-widest rounded transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,92,0,0.4)] active:scale-95"
          >
            {t.cta}
          </Link>

          {/* Language toggle */}
          <button
            type="button"
            onClick={() => setLang(lang === "pt" ? "en" : "pt")}
            className="flex items-center gap-1.5 px-2.5 py-2 rounded-lg border border-outline-variant/40 bg-surface-container/30 text-tertiary hover:text-on-surface hover:border-[#e9c349]/40 transition-all text-[11px] font-bold uppercase tracking-widest"
            title={lang === "pt" ? "Switch to English" : "Mudar para Português"}
          >
            <span className="material-symbols-outlined text-[14px]">language</span>
            {lang === "pt" ? "EN" : "PT"}
          </button>
        </nav>
      </header>

      {/* ── Hero ── */}
      <section className="relative z-10 container mx-auto max-w-5xl px-4 py-20 text-center sm:py-36">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#e9c349]/30 bg-[rgba(233,195,73,0.08)] text-[10px] font-bold uppercase tracking-widest text-[#e9c349] mb-8">
          <span className="material-symbols-outlined text-[12px] filled">auto_awesome</span>
          {t.badge}
        </div>

        <h1 className="font-display text-[48px] sm:text-[64px] font-bold tracking-tight text-on-surface leading-[1.1] mb-6">
          {t.heroLine1}{" "}
          <span
            className="text-[#ff5c00]"
            style={{ textShadow: "0 0 40px rgba(255,92,0,0.4)" }}
          >
            {t.heroHighlight}
          </span>{" "}
          {t.heroLine2}
        </h1>

        <p className="mx-auto max-w-2xl text-base text-tertiary leading-relaxed mb-10">
          {t.heroSub}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/auth/signup"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#ff5c00] hover:bg-[#ff7b33] text-white text-sm font-bold uppercase tracking-widest rounded-xl transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,92,0,0.5)] active:scale-95"
          >
            {t.cta}
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </Link>
          <Link
            href="/como-funciona"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-[rgba(42,42,42,0.6)] hover:bg-[rgba(42,42,42,0.9)] text-on-surface text-sm font-bold uppercase tracking-widest rounded-xl border border-outline-variant/40 hover:border-[#e9c349]/40 transition-all duration-300 active:scale-95"
          >
            {t.ctaSub}
          </Link>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="relative z-10 container mx-auto max-w-5xl px-4 pb-28 grid gap-5 sm:grid-cols-3">
        <FeatureCard
          icon="schedule"
          title={t.f1Title}
          description={t.f1Desc}
        />
        <FeatureCard
          icon="account_tree"
          title={t.f2Title}
          description={t.f2Desc}
        />
        <FeatureCard
          icon="notifications_active"
          title={t.f3Title}
          description={t.f3Desc}
        />
      </section>

      {/* ── Footer ── */}
      <footer className="relative z-10 border-t border-outline-variant/20">
        <div className="container mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-4 py-8 text-xs text-tertiary">
          <span>© {new Date().getFullYear()} {t.footerCopy}</span>
          <nav className="flex flex-wrap items-center gap-5">
            <Link href="/como-funciona" className="hover:text-on-surface transition-colors font-bold uppercase tracking-widest text-[10px]">
              {t.footerHow}
            </Link>
            <Link href="/legal/termos" className="hover:text-on-surface transition-colors font-bold uppercase tracking-widest text-[10px]">
              {t.footerTerms}
            </Link>
            <Link href="/legal/privacidade" className="hover:text-on-surface transition-colors font-bold uppercase tracking-widest text-[10px]">
              {t.footerPrivacy}
            </Link>
          </nav>
        </div>
      </footer>
    </main>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div className="p-[1px] rounded-xl bg-gradient-to-br from-[rgba(233,195,73,0.15)] to-transparent group hover:from-[rgba(255,181,154,0.2)] transition-all duration-300">
      <div className="bg-[rgba(42,42,42,0.7)] backdrop-blur-xl rounded-[calc(0.75rem-1px)] p-6 flex flex-col gap-4 h-full hover:shadow-[inset_0_0_20px_rgba(255,92,0,0.06)] transition-all duration-300">
        <div className="w-11 h-11 rounded-xl bg-surface-container-highest/50 border border-[rgba(233,195,73,0.2)] flex items-center justify-center group-hover:border-[rgba(255,92,0,0.4)] transition-colors">
          <span className="material-symbols-outlined text-[#e9c349] text-[20px] group-hover:text-[#ff5c00] transition-colors filled">
            {icon}
          </span>
        </div>
        <div>
          <h3 className="font-semibold text-on-surface text-base mb-1">{title}</h3>
          <p className="text-xs text-tertiary leading-relaxed">{description}</p>
        </div>
      </div>
    </div>
  );
}
