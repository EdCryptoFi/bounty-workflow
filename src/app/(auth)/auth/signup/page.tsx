import Link from "next/link";
import { Suspense } from "react";
import type { Metadata } from "next";
import { SignupForm } from "./signup-form";
import { GoogleButton } from "@/components/auth/google-button";

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
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full luxury-glass glow-orange mb-4">
          <span className="material-symbols-outlined text-[40px] text-[#ff5c00] filled">
            rocket_launch
          </span>
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
        <div className="luxury-glass rounded-full px-1 py-1 flex items-center gap-1 border border-outline-variant/20">
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
      <div className="luxury-glass rounded-xl p-10 shadow-[0_8px_32px_rgba(0,0,0,0.8)] glow-orange border border-outline-variant/20">
        {/* Social logins */}
        <div className="mb-6">
          <Suspense>
            <GoogleButton />
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
