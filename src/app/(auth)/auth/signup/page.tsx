import Link from "next/link";
import { Suspense } from "react";
import type { Metadata } from "next";
import { SignupForm } from "./signup-form";
import { GoogleButton } from "@/components/auth/google-button";
import { TwitterButton } from "@/components/auth/twitter-button";

export const metadata: Metadata = { title: "Criar conta" };

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next = "/dashboard" } = await searchParams;

  return (
    <>
      {/* Logo / header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center mb-4">
          <svg width="80" height="80" viewBox="0 0 100 100" style={{ filter: "drop-shadow(0 14px 28px rgba(255,92,0,0.55))" }}>
            <defs>
              <linearGradient id="ai-signup-g" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ffc28a"/>
                <stop offset="35%" stopColor="#ff7a1f"/>
                <stop offset="100%" stopColor="#8a2900"/>
              </linearGradient>
              <linearGradient id="ai-signup-h" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(255,255,255,0.92)"/>
                <stop offset="100%" stopColor="rgba(255,255,255,0)"/>
              </linearGradient>
              <radialGradient id="ai-signup-s" cx="50%" cy="55%" r="55%">
                <stop offset="40%" stopColor="rgba(0,0,0,0)"/>
                <stop offset="100%" stopColor="rgba(255,92,0,0.55)"/>
              </radialGradient>
              <filter id="ai-signup-bl" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="1.4"/>
              </filter>
            </defs>
            <circle cx="50" cy="50" r="48" fill="url(#ai-signup-s)" opacity="0.7"/>
            <circle cx="50" cy="50" r="46" fill="url(#ai-signup-g)"/>
            <circle cx="50" cy="50" r="45.5" fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth="1"/>
            <ellipse cx="50" cy="30" rx="24" ry="9" fill="url(#ai-signup-h)" opacity="0.95"/>
            <ellipse cx="50" cy="82" rx="28" ry="6" fill="rgba(80,20,0,0.45)" filter="url(#ai-signup-bl)"/>
            {/* Spark/star glyph */}
            <path d="M50 22 L54 44 L74 50 L54 56 L50 78 L46 56 L26 50 L46 44 Z" fill="#fff"/>
          </svg>
        </div>
        <h1 className="font-display text-4xl font-bold tracking-tighter text-on-surface">
          Bounty Workflow
        </h1>
        <p className="text-xs text-tertiary mt-2 uppercase tracking-[0.2em] font-medium">
          14 dias grátis · Sem cartão
        </p>
      </div>

      {/* Tabs Login | Registrar */}
      <div className="flex justify-center mb-6">
        <div className="glass rounded-full px-1 py-1 flex items-center gap-1" style={{ borderColor: "rgba(255,255,255,0.15)" }}>
          <Link
            href={`/auth/login${next !== "/dashboard" ? `?next=${encodeURIComponent(next)}` : ""}`}
            className="px-5 py-2 rounded-full text-tertiary text-xs font-bold uppercase tracking-widest hover:text-[#ffb59a] transition-colors"
          >
            Login
          </Link>
          <span className="px-5 py-2 rounded-full bg-[#ff5c00] text-white text-xs font-bold uppercase tracking-widest">
            Registrar
          </span>
        </div>
      </div>

      {/* Glass card */}
      <div className="glass rounded-2xl p-10 shadow-[0_8px_48px_rgba(0,0,0,0.8)]" style={{ borderColor: "rgba(255,92,0,0.18)" }}>
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
            Ou crie com e-mail
          </span>
        </div>

        <SignupForm next={next} />

        <p className="mt-4 text-[10px] text-tertiary text-center">
          Ao criar a conta, você aceita nossos{" "}
          <Link href="/legal/termos" className="text-[#ffb59a] hover:text-[#ff5c00] transition-colors">
            termos
          </Link>{" "}
          e{" "}
          <Link href="/legal/privacidade" className="text-[#ffb59a] hover:text-[#ff5c00] transition-colors">
            privacidade
          </Link>
          .
        </p>
      </div>
    </>
  );
}
