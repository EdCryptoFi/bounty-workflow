import type { Metadata } from "next";
import Link from "next/link";
import { listCampaignsForTimeline } from "@/lib/campaigns/queries";
import { createClient } from "@/lib/supabase/server";
import type { CampaignWithCounts } from "@/lib/types";
import { GlowCard } from "@/components/ui/glow-card";

export const metadata: Metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const [campaigns, supabase] = await Promise.all([
    listCampaignsForTimeline(),
    createClient(),
  ]);

  const { data: billing } = await supabase
    .from("v_user_billing")
    .select("*")
    .maybeSingle();

  const running = campaigns.filter((c) => !c.archived_at).slice(0, 3);

  return (
    <div className="max-w-[1600px] mx-auto flex flex-col gap-6">
      {/* Page header */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="font-display text-[30px] font-semibold tracking-tight text-on-surface leading-tight">
            Visão Geral
          </h2>
          <p className="text-sm text-tertiary mt-1">
            Acompanhe suas campanhas e protocolos de workflow em tempo real.
          </p>
        </div>
        <Link
          href="/campaigns/new"
          className="flex items-center gap-2 px-5 py-2.5 bg-[#ff5c00] hover:bg-[#ff7b33] text-white text-xs font-bold uppercase tracking-widest rounded transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,92,0,0.35)] active:scale-95"
        >
          <span className="material-symbols-outlined text-[16px]">add</span>
          Nova Campanha
        </Link>
      </div>

      {/* Top row: Drive + Subscription */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Bounty Drive */}
        <GlassCard gradient="orange">
          <div className="flex items-center gap-3 mb-4">
            <span className="material-symbols-outlined text-[#ffb59a]">database</span>
            <h4 className="text-[18px] font-semibold text-on-surface">Bounty Drive</h4>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-tertiary">
                {running.length} campanhas ativas
              </span>
              <span className="text-[#ffb59a] font-medium">
                {campaigns.length} total
              </span>
            </div>
            <div className="h-2 w-full bg-surface-bright rounded-full overflow-hidden p-[1px]">
              <div
                className="h-full bg-gradient-to-r from-[#ffb59a] to-[#e9c349] rounded-full shadow-[0_0_8px_rgba(255,181,154,0.3)] transition-all"
                style={{
                  width: campaigns.length
                    ? `${Math.min(100, (running.length / Math.max(campaigns.length, 1)) * 100)}%`
                    : "0%",
                }}
              />
            </div>
          </div>
        </GlassCard>

        {/* Assinatura */}
        <GlassCard gradient="gold">
          <div className="flex items-center gap-3 mb-4">
            <span className="material-symbols-outlined text-[#e9c349]">workspace_premium</span>
            <h4 className="text-[18px] font-semibold text-on-surface">
              Assinatura &amp; Crescimento
            </h4>
          </div>
          <div className="flex flex-wrap gap-6">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-tertiary mb-1">
                Status do Plano
              </p>
              <p className="text-sm font-medium text-on-surface">
                {billing?.billing_status === "active"
                  ? "Premium Ativo"
                  : billing?.billing_status === "trialing"
                  ? `Trial · ${billing.trial_days_left ?? 0} dias`
                  : "Sem plano"}
              </p>
            </div>
            <div className="border-l border-surface-bright pl-6">
              <p className="text-[10px] font-bold uppercase tracking-widest text-tertiary mb-1">
                Campanhas Ativas
              </p>
              <p className="text-sm font-medium text-[#e9c349]">
                {running.length} em execução
              </p>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Main grid: Campaigns + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Campanhas em execução (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-5">
          <h3 className="text-[18px] font-semibold text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-[#ffb59a]">analytics</span>
            Campanhas em Execução
          </h3>

          {running.length === 0 ? (
            <GlassCard gradient="orange">
              <div className="flex flex-col items-center justify-center py-8 text-center gap-3">
                <span className="material-symbols-outlined text-[40px] text-tertiary">
                  rocket_launch
                </span>
                <p className="text-sm text-tertiary">Nenhuma campanha ativa ainda.</p>
                <Link
                  href="/campaigns/new"
                  className="mt-2 px-4 py-2 bg-[#ff5c00] hover:bg-[#ff7b33] text-white text-xs font-bold uppercase tracking-widest rounded transition-all"
                >
                  Criar primeira campanha
                </Link>
              </div>
            </GlassCard>
          ) : (
            running.map((c) => <CampaignCard key={c.id} campaign={c} />)
          )}
        </div>

        {/* Atividade da Rede (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-5">
          <h3 className="text-[18px] font-semibold text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-[#ffb59a]">hub</span>
            Atividade da Rede
          </h3>

          {/* Stats circle */}
          <GlassCard gradient="gold">
            <div className="flex flex-col items-center text-center">
              <div className="h-32 w-32 relative mb-5">
                <svg className="h-full w-full -rotate-90">
                  <circle
                    cx="64" cy="64" r="58"
                    fill="transparent"
                    stroke="currentColor"
                    strokeWidth="8"
                    className="text-surface-bright"
                  />
                  <circle
                    cx="64" cy="64" r="58"
                    fill="transparent"
                    stroke="#ffb59a"
                    strokeWidth="8"
                    strokeDasharray="364.4"
                    strokeDashoffset={
                      running.length && campaigns.length
                        ? 364.4 * (1 - running.length / Math.max(campaigns.length, 1))
                        : 300
                    }
                    style={{ filter: "drop-shadow(0 0 8px rgba(255,181,154,0.5))" }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-[32px] font-bold text-on-surface leading-none">
                    {running.length}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-tertiary mt-1">
                    Ativos
                  </span>
                </div>
              </div>
              <h5 className="text-base font-semibold text-on-surface">
                Desempenho Semanal
              </h5>
              <p className="text-sm text-tertiary mt-2">
                {campaigns.length} campanhas registradas no total.
              </p>
              <Link
                href="/performance"
                className="mt-5 w-full py-2.5 bg-surface-container border border-outline-variant/30 rounded text-[10px] font-bold uppercase tracking-widest text-[#ffb59a] hover:bg-[rgba(255,92,0,0.08)] transition-colors text-center"
              >
                Ver Relatório Completo
              </Link>
            </div>
          </GlassCard>

          {/* Timeline recente */}
          <GlassCard gradient="none">
            <h5 className="text-base font-semibold text-on-surface mb-4 flex items-center gap-2 border-b border-surface-bright pb-4">
              <span className="material-symbols-outlined text-[16px] text-[#ffb59a]">
                schedule
              </span>
              Timeline Recente
            </h5>
            <div className="flex flex-col gap-0 relative">
              <div className="absolute left-[11px] top-2 bottom-2 w-px bg-gradient-to-b from-[#ffb59a] via-surface-bright to-transparent" />
              {campaigns.slice(0, 3).map((c, i) => (
                <div key={c.id} className="flex gap-4 pb-5 relative z-10">
                  <div
                    className={`w-6 h-6 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                      i === 0
                        ? "bg-surface-container border-[#ffb59a] shadow-[0_0_10px_rgba(255,181,154,0.2)]"
                        : "bg-surface-container border-surface-bright"
                    }`}
                  >
                    <span
                      className={`material-symbols-outlined text-[12px] ${
                        i === 0 ? "text-[#ffb59a]" : "text-tertiary"
                      }`}
                    >
                      {i === 0 ? "check" : "edit"}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-on-surface">{c.title}</p>
                    <p className="text-[11px] text-tertiary mt-0.5 uppercase tracking-wide">
                      {c.days_to_deadline !== null
                        ? c.days_to_deadline === 0
                          ? "Vence hoje"
                          : c.days_to_deadline > 0
                          ? `${c.days_to_deadline}d restantes`
                          : "Atrasado"
                        : "Sem deadline"}
                    </p>
                  </div>
                </div>
              ))}
              {campaigns.length === 0 && (
                <p className="text-sm text-tertiary pl-8">Nenhuma atividade recente.</p>
              )}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}

function GlassCard({
  children,
}: {
  children: React.ReactNode;
  gradient?: "orange" | "gold" | "none";
}) {
  return (
    <GlowCard className="shadow-[0_10px_30px_-15px_rgba(0,0,0,0.8)]">
      <div className="bg-surface-container-highest/70 backdrop-blur-xl rounded-[11px] p-6 h-full">
        {children}
      </div>
    </GlowCard>
  );
}

function CampaignCard({ campaign: c }: { campaign: CampaignWithCounts }) {
  const progress =
    c.step_count > 0 ? Math.round((c.done_count / c.step_count) * 100) : 0;
  const isPaused = c.status === "archived" || c.status === "draft";

  return (
    <Link href={`/campaigns/${c.id}`}>
      <GlowCard className="group shadow-[0_10px_30px_-15px_rgba(0,0,0,0.8)] transition-all hover:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.9)]">
        <div className="bg-surface-container-highest/80 backdrop-blur-xl rounded-[11px] p-6 relative overflow-hidden">
          {!isPaused && (
            <div className="absolute -right-10 -top-10 h-40 w-40 bg-[rgba(255,181,154,0.06)] blur-[80px] group-hover:bg-[rgba(255,181,154,0.1)] transition-all pointer-events-none" />
          )}

          <div className="flex justify-between items-start mb-5 relative z-10">
            <div className="flex gap-4">
              <div
                className={`h-16 w-16 bg-surface-container border rounded-2xl flex items-center justify-center ${
                  isPaused
                    ? "border-[rgba(233,195,73,0.2)] shadow-[0_0_15px_rgba(233,195,73,0.08)]"
                    : "border-[rgba(255,181,154,0.2)] shadow-[0_0_15px_rgba(255,181,154,0.08)]"
                }`}
              >
                <span
                  className={`material-symbols-outlined text-[36px] ${
                    isPaused ? "text-[#e9c349]" : "text-[#ffb59a]"
                  }`}
                  style={{ fontVariationSettings: "'wght' 200" }}
                >
                  rocket
                </span>
              </div>
              <div>
                <h4 className="text-[20px] font-semibold text-on-surface">{c.title}</h4>
                <p className="text-[12px] text-tertiary uppercase tracking-widest mt-1 font-medium">
                  {c.days_to_deadline !== null
                    ? c.days_to_deadline > 0
                      ? `${c.days_to_deadline} dias restantes`
                      : c.days_to_deadline === 0
                      ? "Vence hoje"
                      : `${Math.abs(c.days_to_deadline)} dias atrasado`
                    : "Sem deadline"}
                </p>
              </div>
            </div>

            {isPaused ? (
              <span className="px-4 py-1.5 rounded-xl bg-surface-container-low text-tertiary text-[12px] font-bold border border-outline-variant/30 uppercase tracking-widest">
                Pausado
              </span>
            ) : (
              <div className="flex -space-x-2">
                <div className="h-8 w-8 rounded-full border-2 border-surface bg-surface-bright" />
                <div className="h-8 w-8 rounded-full border-2 border-surface bg-surface-variant" />
                <div className="h-8 w-8 rounded-full border-2 border-surface bg-[rgba(255,181,154,0.15)] flex items-center justify-center text-[10px] text-[#ffb59a] font-bold">
                  +{c.step_count}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-3 relative z-10" style={{ opacity: isPaused ? 0.7 : 1 }}>
            <div className="flex justify-between text-sm">
              <span className="text-tertiary">Progresso da Missão</span>
              <span
                className={`font-bold ${isPaused ? "text-tertiary" : "text-[#ffb59a]"}`}
              >
                {progress}%
              </span>
            </div>
            <div className="h-3 w-full bg-surface-bright rounded-full overflow-hidden border border-outline-variant/20 p-[2px]">
              <div
                className={`h-full rounded-full transition-all ${
                  isPaused
                    ? "bg-tertiary/50"
                    : "bg-gradient-to-r from-[#ffb59a] to-[#e9c349] shadow-[0_0_10px_rgba(255,181,154,0.5)]"
                }`}
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex gap-2">
              <span className="px-3 py-1 rounded-full bg-surface-container-low border border-outline-variant/30 text-[10px] text-on-surface-variant uppercase font-bold tracking-widest">
                {c.done_count}/{c.step_count} steps
              </span>
              {!isPaused && (
                <span className="px-3 py-1 rounded-full bg-[rgba(255,181,154,0.08)] border border-[rgba(255,181,154,0.25)] text-[10px] text-[#ffb59a] uppercase font-bold tracking-widest shadow-[inset_0_0_8px_rgba(255,181,154,0.08)]">
                  Em execução
                </span>
              )}
            </div>
          </div>
        </div>
      </GlowCard>
    </Link>
  );
}
