import type { Metadata } from "next";
import Link from "next/link";
import { listCampaignsForTimeline } from "@/lib/campaigns/queries";
import { createClient } from "@/lib/supabase/server";
import { GlowCard } from "@/components/ui/glow-card";
import { CampaignCard } from "@/components/campaigns/campaign-card";

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

