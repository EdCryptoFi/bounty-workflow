import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { GlowCard } from "@/components/ui/glow-card";
import { CheckoutButton } from "./checkout-button";
import { paymentsEnabled } from "@/lib/payments/config";

export const metadata: Metadata = { title: "Assinar Bounty WorkFlow Pro" };
export const dynamic = "force-dynamic";

const FEATURES = [
  { icon: "rocket_launch", text: "Campanhas ilimitadas" },
  { icon: "auto_awesome", text: "Protocolos avançados" },
  { icon: "folder_open", text: "5 GB de armazenamento no Drive" },
  { icon: "notifications_active", text: "Lembretes e automações" },
  { icon: "support_agent", text: "Suporte prioritário" },
  { icon: "analytics", text: "Relatórios de performance" },
];

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

        {/* Plan card */}
        <GlowCard className="shadow-[0_0_40px_rgba(255,92,0,0.15)]">
          <div className="bg-[rgba(42,42,42,0.85)] backdrop-blur-xl rounded-[11px] p-6 flex flex-col gap-5">
            {/* Price */}
            <div className="text-center border-b border-outline-variant/30 pb-5">
              <p className="text-[10px] font-bold uppercase tracking-widest text-tertiary mb-1">Plano Mensal</p>
              <div className="flex items-end justify-center gap-1">
                <span className="text-[40px] font-bold text-on-surface leading-none">R$29</span>
                <span className="text-xl font-semibold text-tertiary mb-1">,90/mês</span>
              </div>
              <p className="text-xs text-tertiary mt-1">Cancele a qualquer momento</p>
            </div>

            {/* Features */}
            <ul className="flex flex-col gap-3">
              {FEATURES.map((f) => (
                <li key={f.icon} className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-[rgba(255,92,0,0.12)] border border-[#ff5c00]/30 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[#ff5c00] text-[14px]">{f.icon}</span>
                  </span>
                  <span className="text-sm text-on-surface">{f.text}</span>
                </li>
              ))}
            </ul>

            {/* CTA */}
            <CheckoutButton paymentsEnabled={paymentsEnabled} />
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
