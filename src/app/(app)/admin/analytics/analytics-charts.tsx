"use client";

import { GlowCard } from "@/components/ui/glow-card";

type SignupData = { date: string; label: string; count: number };
type GrowthData = { date: string; label: string; total: number };
type BillingBreakdown = { active: number; trialing: number; expired: number; free: number };

export function AnalyticsCharts({
  signupChartData,
  cumulativeGrowth,
  billingBreakdown,
}: {
  signupChartData: SignupData[];
  cumulativeGrowth: GrowthData[];
  billingBreakdown: BillingBreakdown;
}) {
  const maxSignups = Math.max(...signupChartData.map((d) => d.count), 1);
  const maxGrowth = Math.max(...cumulativeGrowth.map((d) => d.total), 1);

  const total = billingBreakdown.active + billingBreakdown.trialing + billingBreakdown.expired + billingBreakdown.free;
  const billingParts = [
    { label: "Premium", value: billingBreakdown.active, color: "#e9c349" },
    { label: "Trial", value: billingBreakdown.trialing, color: "#ffb59a" },
    { label: "Expirado", value: billingBreakdown.expired, color: "#ef4444" },
    { label: "Free", value: billingBreakdown.free, color: "#6b7280" },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Daily Signups Bar Chart */}
      <GlowCard>
        <div className="rounded-[11px] p-6" style={{ background: "rgba(24,23,23,0.9)" }}>
          <div className="flex items-center gap-2 mb-4">
            <span className="material-symbols-outlined text-[18px] text-[#ff5c00]">trending_up</span>
            <h3 className="text-sm font-bold uppercase tracking-widest text-on-surface">
              Signups (Últimos 30 dias)
            </h3>
          </div>
          <div className="flex items-end gap-[2px] h-40">
            {signupChartData.map((d, i) => (
              <div key={d.date} className="flex-1 flex flex-col items-center justify-end h-full group relative">
                <div
                  className="w-full rounded-t transition-all duration-200 hover:opacity-80 min-h-[2px]"
                  style={{
                    height: `${Math.max((d.count / maxSignups) * 100, 2)}%`,
                    background: d.count > 0 ? "#ff5c00" : "rgba(255,92,0,0.15)",
                  }}
                />
                {/* Tooltip */}
                <div className="absolute bottom-full mb-2 hidden group-hover:block z-10">
                  <div className="bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-[10px] text-white whitespace-nowrap">
                    {d.label}: {d.count} signup{d.count !== 1 ? "s" : ""}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-[9px] text-tertiary">
            <span>{signupChartData[0]?.label}</span>
            <span>{signupChartData[signupChartData.length - 1]?.label}</span>
          </div>
        </div>
      </GlowCard>

      {/* Billing Breakdown */}
      <GlowCard>
        <div className="rounded-[11px] p-6" style={{ background: "rgba(24,23,23,0.9)" }}>
          <div className="flex items-center gap-2 mb-4">
            <span className="material-symbols-outlined text-[18px] text-[#e9c349]">payments</span>
            <h3 className="text-sm font-bold uppercase tracking-widest text-on-surface">
              Distribuição de Planos
            </h3>
          </div>

          {/* Horizontal stacked bar */}
          <div className="h-8 rounded-full overflow-hidden flex mb-6">
            {billingParts.map((part) => (
              <div
                key={part.label}
                className="h-full transition-all duration-300"
                style={{
                  width: total > 0 ? `${(part.value / total) * 100}%` : "25%",
                  background: part.color,
                  minWidth: part.value > 0 ? "4px" : "0",
                }}
              />
            ))}
          </div>

          {/* Legend */}
          <div className="grid grid-cols-2 gap-3">
            {billingParts.map((part) => (
              <div key={part.label} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ background: part.color }} />
                <span className="text-xs text-tertiary">{part.label}</span>
                <span className="text-xs font-bold text-on-surface ml-auto">{part.value}</span>
                <span className="text-[10px] text-tertiary">
                  ({total > 0 ? Math.round((part.value / total) * 100) : 0}%)
                </span>
              </div>
            ))}
          </div>
        </div>
      </GlowCard>

      {/* Cumulative Growth */}
      <GlowCard className="lg:col-span-2">
        <div className="rounded-[11px] p-6" style={{ background: "rgba(24,23,23,0.9)" }}>
          <div className="flex items-center gap-2 mb-4">
            <span className="material-symbols-outlined text-[18px] text-[#22c55e]">show_chart</span>
            <h3 className="text-sm font-bold uppercase tracking-widest text-on-surface">
              Crescimento Total de Usuários
            </h3>
          </div>
          <div className="h-48 flex items-end gap-1">
            {cumulativeGrowth.map((d) => (
              <div
                key={d.date}
                className="flex-1 flex flex-col items-center justify-end h-full group relative"
              >
                <div
                  className="w-full rounded-t bg-gradient-to-t from-[#22c55e] to-[#22c55e]/60 transition-all duration-200 hover:opacity-80"
                  style={{ height: `${(d.total / maxGrowth) * 100}%` }}
                />
                <div className="absolute bottom-full mb-2 hidden group-hover:block z-10">
                  <div className="bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-[10px] text-white whitespace-nowrap">
                    {d.label}: {d.total} usuários
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-[9px] text-tertiary">
            <span>{cumulativeGrowth[0]?.label}</span>
            <span>{cumulativeGrowth[cumulativeGrowth.length - 1]?.label}</span>
          </div>
        </div>
      </GlowCard>
    </div>
  );
}
