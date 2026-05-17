import Link from "next/link";
import { Suspense } from "react";
import type { Metadata } from "next";
import { LoginForm } from "./login-form";
import { GoogleButton } from "@/components/auth/google-button";
import { TwitterButton } from "@/components/auth/twitter-button";

export const metadata: Metadata = { title: "Entrar" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; verified?: string; error?: string }>;
}) {
  const { next = "/dashboard", verified, error } = await searchParams;

  return (
    <>
      {/* Logo / header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center mb-4">
          <svg width="80" height="80" viewBox="0 0 100 100" style={{ filter: "drop-shadow(0 14px 28px rgba(255,92,0,0.55))" }}>
            <defs>
              <linearGradient id="ai-login-g" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ffc28a"/>
                <stop offset="35%" stopColor="#ff7a1f"/>
                <stop offset="100%" stopColor="#8a2900"/>
              </linearGradient>
              <linearGradient id="ai-login-h" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(255,255,255,0.92)"/>
                <stop offset="100%" stopColor="rgba(255,255,255,0)"/>
              </linearGradient>
              <radialGradient id="ai-login-s" cx="50%" cy="55%" r="55%">
                <stop offset="40%" stopColor="rgba(0,0,0,0)"/>
                <stop offset="100%" stopColor="rgba(255,92,0,0.55)"/>
              </radialGradient>
              <filter id="ai-login-bl" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="1.4"/>
              </filter>
            </defs>
            <circle cx="50" cy="50" r="48" fill="url(#ai-login-s)" opacity="0.7"/>
            <circle cx="50" cy="50" r="46" fill="url(#ai-login-g)"/>
            <circle cx="50" cy="50" r="45.5" fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth="1"/>
            <ellipse cx="50" cy="30" rx="24" ry="9" fill="url(#ai-login-h)" opacity="0.95"/>
            <ellipse cx="50" cy="82" rx="28" ry="6" fill="rgba(80,20,0,0.45)" filter="url(#ai-login-bl)"/>
            {/* Rocket glyph */}
            <g stroke="#fff" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" fill="none">
              <path d="M50 22 c10 10 14 22 14 32 v8 H36 v-8 c0-10 4-22 14-32 Z"/>
              <circle cx="50" cy="44" r="5" fill="#fff" stroke="none"/>
              <path d="M36 56 L28 64 M64 56 L72 64"/>
              <path d="M44 70 V76 M50 70 V78 M56 70 V76"/>
            </g>
          </svg>
        </div>
        <h1 className="font-display text-4xl font-bold tracking-tighter text-on-surface">
          Bounty Workflow
        </h1>
        <p className="text-xs text-tertiary mt-2 uppercase tracking-[0.2em] font-medium">
          Acesse sua estação de comando
        </p>
      </div>

      {/* Tabs Login | Registrar */}
      <div className="flex justify-center mb-6">
        <div className="glass rounded-full px-1 py-1 flex items-center gap-1" style={{ borderColor: "rgba(255,255,255,0.15)" }}>
          <span className="px-5 py-2 rounded-full bg-[#ff5c00] text-white text-xs font-bold uppercase tracking-widest">
            Login
          </span>
          <Link
            href={`/auth/signup${next !== "/dashboard" ? `?next=${encodeURIComponent(next)}` : ""}`}
            className="px-5 py-2 rounded-full text-tertiary text-xs font-bold uppercase tracking-widest hover:text-[#ffb59a] transition-colors"
          >
            Registrar
          </Link>
        </div>
      </div>

      {/* Glass card */}
      <div className="glass rounded-2xl p-10 shadow-[0_8px_48px_rgba(0,0,0,0.8)]" style={{ borderColor: "rgba(255,92,0,0.18)" }}>
        {error && (
          <div className="mb-6 rounded border border-red-900/40 bg-red-900/20 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}
        {verified === "1" && (
          <div className="mb-6 rounded border border-secondary/30 bg-secondary/10 px-4 py-3 text-sm text-secondary">
            Email confirmado. Faça login pra continuar.
          </div>
        )}

        {/* Social logins — lado a lado */}
        <div className="mb-6">
          <Suspense fallback={<div className="grid grid-cols-2 gap-3 h-10" />}>
            <div className="grid grid-cols-2 gap-3">
              <GoogleButton />
              <TwitterButton />
            </div>
          </Suspense>
        </div>

        <div className="relative flex items-center justify-center mb-6">
          <div className="absolute w-full border-t border-surface-container-highest" />
          <span className="relative bg-[#131313] px-3 text-[10px] font-bold uppercase tracking-widest text-tertiary">
            Ou entre com e-mail
          </span>
        </div>

        <LoginForm next={next} />
      </div>

      {/* Footer links */}
      <div className="mt-6 flex justify-center gap-6 text-[10px] font-bold uppercase tracking-widest text-surface-container-highest">
        <Link href="/legal/termos" className="hover:text-tertiary transition-colors">
          Termos de Uso
        </Link>
        <span>•</span>
        <Link href="/legal/privacidade" className="hover:text-tertiary transition-colors">
          Privacidade
        </Link>
        <span>•</span>
        <a href="mailto:suporte@bountyworkflow.com" className="hover:text-tertiary transition-colors">
          Suporte
        </a>
      </div>
    </>
  );
}
