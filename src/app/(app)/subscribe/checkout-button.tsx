"use client";

import { useState, useTransition } from "react";
import { startCheckoutAction } from "@/lib/settings/actions";

type Plan = "monthly" | "annual";

const PLAN_FEATURES: Record<Plan, string[]> = {
  monthly: [
    "Campanhas ilimitadas",
    "Protocolos avançados",
    "5 GB de armazenamento",
    "Lembretes e automações",
    "Suporte prioritário",
  ],
  annual: [
    "Tudo do plano Pro",
    "Acesso Early-Bird a novas features",
    "Suporte VIP (resposta em 12h)",
    "Economize R$78,80 por ano",
    "Badge exclusivo de Hunter",
  ],
};

function PlanCard({
  plan,
  selected,
  onSelect,
}: {
  plan: Plan;
  selected: boolean;
  onSelect: () => void;
}) {
  const isAnnual = plan === "annual";
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`w-full text-left rounded-xl p-5 border transition-all duration-200 ${
        selected
          ? "border-[#ff5c00]/60 bg-[rgba(255,92,0,0.08)] shadow-[0_0_20px_rgba(255,92,0,0.12)]"
          : "border-outline-variant/30 bg-surface-container/40 hover:border-outline-variant/60"
      }`}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          {isAnnual && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[rgba(255,92,0,0.15)] border border-[#ff5c00]/30 text-[9px] font-bold uppercase tracking-widest text-[#ffb59a] mb-2">
              ★ RECOMENDADO
            </span>
          )}
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-on-surface">
              {isAnnual ? "R$400" : "R$39,90"}
            </span>
            <span className="text-sm text-tertiary">
              {isAnnual ? "/ano" : "/mês"}
            </span>
          </div>
          {isAnnual && (
            <p className="text-[10px] text-tertiary mt-0.5">≈ R$33,33/mês · Pagamento único anual</p>
          )}
          {!isAnnual && (
            <p className="text-[10px] text-tertiary mt-0.5">Cancele a qualquer momento</p>
          )}
        </div>
        <div className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
          selected ? "border-[#ff5c00] bg-[#ff5c00]" : "border-outline-variant/50"
        }`}>
          {selected && <span className="material-symbols-outlined text-white text-[12px]">check</span>}
        </div>
      </div>

      <div className="text-[10px] font-bold uppercase tracking-widest text-tertiary mb-2">
        {isAnnual ? "Hunter" : "Pro"} — Inclui
      </div>
      <ul className="flex flex-col gap-1.5">
        {PLAN_FEATURES[plan].map((f) => (
          <li key={f} className="flex items-center gap-2 text-xs text-on-surface-variant">
            <span className="material-symbols-outlined text-[13px] text-[#ff5c00]">check_small</span>
            {f}
          </li>
        ))}
      </ul>
    </button>
  );
}

export function PlanSelector({ paymentsEnabled }: { paymentsEnabled: boolean }) {
  const [selectedPlan, setSelectedPlan] = useState<Plan>("annual");

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3">
        <PlanCard plan="annual" selected={selectedPlan === "annual"} onSelect={() => setSelectedPlan("annual")} />
        <PlanCard plan="monthly" selected={selectedPlan === "monthly"} onSelect={() => setSelectedPlan("monthly")} />
      </div>
      <CheckoutButton paymentsEnabled={paymentsEnabled} plan={selectedPlan} />
    </div>
  );
}

export function CheckoutButton({
  paymentsEnabled,
  plan,
}: {
  paymentsEnabled: boolean;
  plan: Plan;
}) {
  const [pending, start] = useTransition();

  function handleClick() {
    start(async () => {
      const res = await startCheckoutAction(plan);
      if (res.ok) window.location.href = res.url;
      else alert(res.error);
    });
  }

  if (!paymentsEnabled) {
    return (
      <div className="text-center py-3 rounded-lg border border-outline-variant/30 text-xs text-tertiary">
        Pagamentos em breve
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={pending}
      className="w-full py-3.5 bg-[#ff5c00] hover:bg-[#ff7b33] text-white text-sm font-bold uppercase tracking-widest rounded-lg transition-all duration-300 hover:shadow-[0_0_25px_rgba(255,92,0,0.4)] active:scale-95 disabled:opacity-60 flex items-center justify-center gap-2"
    >
      {pending ? (
        <>
          <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
          Redirecionando...
        </>
      ) : (
        <>
          <span className="material-symbols-outlined text-[18px]">credit_card</span>
          {plan === "annual" ? "Assinar Hunter — R$400/ano" : "Assinar Pro — R$39,90/mês"}
        </>
      )}
    </button>
  );
}
