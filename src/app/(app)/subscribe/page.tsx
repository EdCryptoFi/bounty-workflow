import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { GlowCard } from "@/components/ui/glow-card";
import { PlanSelector } from "./checkout-button";
import { paymentsEnabled } from "@/lib/payments/config";

export const metadata: Metadata = { title: "Assinar Bounty WorkFlow Pro" };
export const dynamic = "force-dynamic";


export default async function SubscribePage() {
  const supabase = await createClient();
  const { data: billing } = await supabase
    .from("v_user_billing")
    .select("derived_status")
    .maybeSingle();

  // If already active, redirect to settings
  if (billing?.derived_status === "active") redirect("/settings");

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-[480px] w-full flex flex-col gap-6">
        {/* Header */}
        <div className="text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-horizontal.png" alt="Bounty Workflow" className="h-10 object-contain mx-auto mb-6" />
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[rgba(255,92,0,0.12)] border border-[#ff5c00]/30 mb-4">
            <span className="w-2 h-2 rounded-full bg-red-400 shadow-[0_0_8px_rgba(248,113,113,0.8)]" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-red-400">
              Trial Encerrado
            </span>
          </div>
          <h1 className="font-display text-[28px] font-semibold tracking-tight text-on-surface leading-tight">
            Continue com o Pro
          </h1>
          <p className="text-sm text-tertiary mt-2 leading-relaxed">
            Seu período de avaliação chegou ao fim. Assine agora para continuar
            gerenciando suas campanhas de bounty sem interrupções.
          </p>
        </div>

        {/* Plan selector */}
        <GlowCard className="shadow-[0_0_40px_rgba(255,92,0,0.15)]">
          <div className="glass rounded-[11px] p-6 flex flex-col gap-5">
            <div className="text-center border-b border-outline-variant/20 pb-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-tertiary">Escolha seu plano</p>
            </div>
            <PlanSelector paymentsEnabled={paymentsEnabled} />
          </div>
        </GlowCard>

        {/* Footer note */}
        <p className="text-center text-[10px] text-tertiary">
          Tem um código de ativação?{" "}
          <a href="/settings" className="text-[#ffb59a] hover:text-[#ff5c00] transition">
            Acesse Settings → Código de Ativação
          </a>
        </p>
      </div>
    </div>
  );
}
