import Link from "next/link";
import { Suspense } from "react";
import type { Metadata } from "next";
import { LoginForm } from "./login-form";
import { GoogleButton } from "@/components/auth/google-button";

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
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full luxury-glass glow-orange mb-4">
          <span className="material-symbols-outlined text-[40px] text-[#ff5c00] filled">
            rocket_launch
          </span>
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
        <div className="luxury-glass rounded-full px-1 py-1 flex items-center gap-1 border border-outline-variant/20">
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
      <div className="luxury-glass rounded-xl p-10 shadow-[0_8px_32px_rgba(0,0,0,0.8)] glow-orange border border-outline-variant/20">
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

        {/* Social logins */}
        <div className="mb-6">
          <Suspense>
            <GoogleButton />
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
