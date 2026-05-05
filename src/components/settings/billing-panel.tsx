"use client";

import { useTransition } from "react";
import { startCheckoutAction } from "@/lib/settings/actions";

type BillingPanelProps = {
  tier: string;
  trialEnds: Date | null;
  status: string;
  provider: string | null;
  periodEnd: Date | null;
  cancelAtPeriodEnd: boolean;
  campaignCount: number;
  paymentsEnabled: boolean;
};

export function BillingPanel({
  tier,
  trialEnds,
  status,
  provider,
  periodEnd,
  cancelAtPeriodEnd,
  campaignCount,
  paymentsEnabled,
}: BillingPanelProps) {
  const [pending, start] = useTransition();
  const isTrialing = status === "trialing";
  const daysLeft =
    trialEnds != null
      ? Math.max(0, Math.ceil((trialEnds.getTime() - Date.now()) / 86_400_000))
      : null;

  function handleUpgrade() {
    start(async () => {
      const res = await startCheckoutAction();
      if (res.ok) window.location.href = res.url;
      else alert(res.error);
    });
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Trial / Plan banner */}
      {isTrialing && daysLeft !== null ? (
        <div className="bg-[rgba(255,92,0,0.07)] border border-[#ff5c00]/30 rounded-xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-[inset_0_0_30px_rgba(255,92,0,0.05)]">
          <div className="flex-1">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#ff5c00]/20 border border-[#ff5c00]/40 mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff5c00] shadow-[0_0_6px_#ff5c00]" />
              <span className="text-[9px] font-bold uppercase tracking-widest text-[#ff5c00]">
                Avaliação Pro
              </span>
            </span>
            <h3 className="text-base font-semibold text-on-surface">
              Sua avaliação Pro expira em breve.
            </h3>
            <p className="text-xs text-tertiary mt-1 leading-relaxed">
              Faça upgrade para continuar com campanhas ilimitadas, automações e suporte prioritário.
            </p>
            <div className="flex gap-3 mt-4 flex-wrap">
              <button
                type="button"
                onClick={handleUpgrade}
                disabled={pending || !paymentsEnabled}
                className="inline-flex items-center gap-2 rounded-lg bg-[#ff5c00] px-4 py-2 text-sm font-bold text-white transition hover:bg-[#ff7b33] hover:shadow-[0_0_15px_rgba(255,92,0,0.4)] disabled:opacity-60 active:scale-95"
              >
                <span className="material-symbols-outlined text-[16px]">bolt</span>
                {pending ? "Redirecionando..." : "Fazer Upgrade Agora"}
              </button>
              <button
                type="button"
                className="px-4 py-2 rounded-lg text-sm text-tertiary border border-outline-variant/50 hover:text-on-surface transition"
              >
                Comparar Planos
              </button>
            </div>
          </div>
          <div className="shrink-0 flex flex-col items-center justify-center w-20 h-20 rounded-full border-2 border-[#ff5c00]/60 bg-[rgba(255,92,0,0.1)] shadow-[0_0_30px_rgba(255,92,0,0.25)]">
            <span className="text-2xl font-bold text-[#ff5c00]">
              {String(daysLeft).padStart(2, "0")}
            </span>
            <span className="text-[8px] font-bold uppercase tracking-widest text-tertiary">dias</span>
          </div>
        </div>
      ) : (
        <div className="bg-[rgba(42,42,42,0.7)] backdrop-blur-xl border border-outline-variant/50 rounded-xl p-5 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-tertiary">Plano Atual</p>
            <p className="text-xl font-bold text-on-surface mt-1 capitalize">{tier}</p>
          </div>
          <div className="flex items-center gap-3">
            <span
              className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                status === "active"
                  ? "bg-[#e9c349]/10 text-[#e9c349] border border-[#e9c349]/30"
                  : "bg-surface-container/50 text-tertiary border border-outline-variant/30"
              }`}
            >
              {status}
            </span>
            {status !== "active" && (
              <button
                type="button"
                onClick={handleUpgrade}
                disabled={pending || !paymentsEnabled}
                className="inline-flex items-center gap-2 rounded-lg bg-[#ff5c00] px-4 py-2 text-sm font-bold text-white transition hover:bg-[#ff7b33] disabled:opacity-60"
              >
                {pending ? "..." : "Upgrade"}
              </button>
            )}
          </div>
        </div>
      )}

      {cancelAtPeriodEnd && (
        <div className="rounded-xl border border-amber-400/30 bg-amber-400/5 px-4 py-3 text-xs text-amber-400">
          Sua assinatura está marcada para cancelamento no fim do período.
        </div>
      )}

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Metrics + History */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Análise de Indicações */}
          <div className="bg-[rgba(42,42,42,0.7)] backdrop-blur-xl border border-outline-variant/50 rounded-xl p-5 shadow-[inset_0_0_20px_rgba(255,92,0,0.03)]">
            <h3 className="text-sm font-semibold text-on-surface mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#e9c349] text-[16px]">analytics</span>
              Análise de Indicações
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Campanhas Ativas", value: String(campaignCount), color: "text-[#e9c349]" },
                { label: "Recompensas Earned", value: "R$ —", color: "text-[#ff5c00]" },
                { label: "Saldo Pendente", value: "R$ —", color: "text-tertiary" },
              ].map((m) => (
                <div
                  key={m.label}
                  className="p-3 bg-surface-container/30 rounded-lg border border-outline-variant/20"
                >
                  <p className="text-[10px] font-bold uppercase tracking-widest text-tertiary leading-tight">
                    {m.label}
                  </p>
                  <p className={`text-2xl font-bold mt-1 ${m.color}`}>{m.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Histórico de Transações */}
          <div className="bg-[rgba(42,42,42,0.7)] backdrop-blur-xl border border-outline-variant/50 rounded-xl p-5 shadow-[inset_0_0_20px_rgba(255,92,0,0.03)]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-[#e9c349] text-[16px]">receipt_long</span>
                Histórico de Transações
              </h3>
              <button
                type="button"
                className="text-[10px] font-bold uppercase tracking-widest text-tertiary hover:text-[#ff5c00] transition flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[12px]">download</span>
                Exportar CSV
              </button>
            </div>
            {periodEnd ? (
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="text-[10px] font-bold uppercase tracking-widest text-tertiary border-b border-outline-variant/30">
                      <th className="text-left pb-2 pr-4">ID da Fatura</th>
                      <th className="text-left pb-2 pr-4">Data</th>
                      <th className="text-left pb-2 pr-4">Plano</th>
                      <th className="text-right pb-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-outline-variant/10">
                      <td className="py-2.5 pr-4 text-tertiary font-mono">INV-2024-001</td>
                      <td className="py-2.5 pr-4 text-tertiary">
                        {periodEnd.toLocaleDateString("pt-BR")}
                      </td>
                      <td className="py-2.5 pr-4 text-on-surface capitalize">
                        {tier} Pro Monthly
                      </td>
                      <td className="py-2.5 text-right">
                        <span className="px-2 py-0.5 rounded-full bg-[#e9c349]/10 border border-[#e9c349]/30 text-[9px] font-bold uppercase tracking-widest text-[#e9c349]">
                          Pago
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8">
                <span className="material-symbols-outlined text-[36px] text-tertiary">receipt</span>
                <p className="text-[10px] text-tertiary font-bold uppercase tracking-widest mt-2">
                  Nenhuma transação registrada
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right: Payment + Resgate */}
        <div className="flex flex-col gap-6">
          {/* Método de Pagamento */}
          <div className="bg-[rgba(42,42,42,0.7)] backdrop-blur-xl border border-outline-variant/50 rounded-xl p-5 shadow-[inset_0_0_20px_rgba(255,92,0,0.03)]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-[#e9c349] text-[16px]">credit_card</span>
                Pagamento
              </h3>
              {provider && (
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#e9c349]">
                  {provider}
                </span>
              )}
            </div>
            <div className="p-3 bg-surface-container/30 rounded-lg border border-outline-variant/20 flex items-center gap-3 mb-3">
              <span className="material-symbols-outlined text-tertiary text-[20px]">credit_card</span>
              <span className="text-xs text-tertiary font-mono tracking-widest">
                •••• •••• •••• ——
              </span>
            </div>
            <button
              type="button"
              className="w-full text-[10px] font-bold uppercase tracking-widest text-[#ff5c00] hover:text-[#ffb59a] transition text-center py-2 rounded-lg border border-[#ff5c00]/20 hover:border-[#ff5c00]/40"
            >
              + Adicionar Novo Método
            </button>
          </div>

          {/* Resgate */}
          <div className="bg-[rgba(42,42,42,0.7)] backdrop-blur-xl border border-outline-variant/50 rounded-xl p-5 shadow-[inset_0_0_20px_rgba(255,92,0,0.03)]">
            <h3 className="text-sm font-semibold text-on-surface mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#e9c349] text-[16px]">savings</span>
              Resgate
            </h3>
            <p className="text-[10px] font-bold uppercase tracking-widest text-tertiary mb-2">
              Carteira Solana
            </p>
            <div className="p-2 bg-surface-container/30 rounded-lg border border-outline-variant/20 font-mono text-[10px] text-tertiary mb-3 truncate">
              —
            </div>
            <button
              type="button"
              className="w-full inline-flex items-center justify-center gap-2 rounded-lg border border-[#e9c349]/30 bg-[#e9c349]/10 px-3 py-2 text-xs font-bold text-[#e9c349] transition hover:bg-[#e9c349]/20"
            >
              <span className="material-symbols-outlined text-[14px]">account_balance_wallet</span>
              Solicitar Resgate
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
