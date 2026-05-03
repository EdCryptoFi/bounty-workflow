import type { Metadata } from "next";
import Link from "next/link";
import { listCampaignsForTimeline } from "@/lib/campaigns/queries";
import { Timeline } from "@/components/campaigns/timeline";
import { GlowCard } from "@/components/ui/glow-card";

export const metadata: Metadata = { title: "Campanhas" };

export default async function CampaignsPage() {
  const campaigns = await listCampaignsForTimeline();

  return (
    <div className="max-w-[1200px] mx-auto flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-[30px] font-semibold tracking-tight text-on-surface leading-tight">
            Campanhas
          </h1>
          <p className="text-sm text-tertiary mt-1">
            Todas as suas caçadas ativas, ordenadas por deadline.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="/api/export/campaigns?scope=active"
            className="flex items-center gap-2 px-4 py-2.5 luxury-glass border border-outline-variant/30 rounded text-[10px] font-bold uppercase tracking-widest text-tertiary hover:text-[#ffb59a] transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">download</span>
            Exportar
          </a>
          <Link
            href="/campaigns/new"
            className="flex items-center gap-2 px-5 py-2.5 bg-[#ff5c00] hover:bg-[#ff7b33] text-white text-xs font-bold uppercase tracking-widest rounded transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,92,0,0.35)] active:scale-95"
          >
            <span className="material-symbols-outlined text-[16px]">add</span>
            Nova Campanha
          </Link>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          {
            label: "Total",
            value: campaigns.length,
            icon: "inventory_2",
            color: "text-tertiary",
          },
          {
            label: "Ativas",
            value: campaigns.filter((c) => c.status === "active").length,
            icon: "rocket_launch",
            color: "text-[#ffb59a]",
          },
          {
            label: "Concluídas",
            value: campaigns.filter((c) => c.status === "completed").length,
            icon: "check_circle",
            color: "text-[#e9c349]",
          },
          {
            label: "Atrasadas",
            value: campaigns.filter(
              (c) => c.days_to_deadline !== null && c.days_to_deadline < 0,
            ).length,
            icon: "warning",
            color: "text-red-400",
          },
        ].map((s) => (
          <GlowCard key={s.label}>
            <div className="bg-surface-container-highest/60 backdrop-blur-xl rounded-[11px] p-4 flex items-center gap-3">
              <span className={`material-symbols-outlined text-[22px] ${s.color}`}>
                {s.icon}
              </span>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-tertiary">
                  {s.label}
                </p>
                <p className={`text-xl font-bold leading-tight ${s.color}`}>
                  {s.value}
                </p>
              </div>
            </div>
          </GlowCard>
        ))}
      </div>

      {/* Timeline */}
      {campaigns.length === 0 ? (
        <GlowCard>
          <div className="bg-surface-container-highest/60 backdrop-blur-xl rounded-[11px] p-16 text-center">
            <span className="material-symbols-outlined text-[48px] text-tertiary block mb-4">
              rocket_launch
            </span>
            <p className="text-sm text-tertiary mb-6">
              Nenhuma campanha ainda. Crie sua primeira missão.
            </p>
            <Link
              href="/campaigns/new"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#ff5c00] hover:bg-[#ff7b33] text-white text-xs font-bold uppercase tracking-widest rounded transition-all hover:shadow-[0_0_20px_rgba(255,92,0,0.35)]"
            >
              <span className="material-symbols-outlined text-[16px]">add</span>
              Nova Campanha
            </Link>
          </div>
        </GlowCard>
      ) : (
        <Timeline campaigns={campaigns} />
      )}
    </div>
  );
}
