"use client";

import { useTransition } from "react";
import Link from "next/link";
import { GlowCard } from "@/components/ui/glow-card";
import { updateCampaignStatusAction } from "@/lib/campaigns/actions";
import type { CampaignStatus, CampaignWithCounts } from "@/lib/types";

function getProtocolIcon(logo: string | null | undefined, website: string | null | undefined): string | null {
  if (logo) return logo;
  if (!website) return null;
  try {
    const domain = new URL(website).hostname;
    return `https://www.google.com/s2/favicons?sz=64&domain=${domain}`;
  } catch {
    return null;
  }
}

const STATUS_OPTIONS: { value: CampaignStatus; label: string }[] = [
  { value: "draft", label: "Rascunho" },
  { value: "active", label: "Ativo" },
  { value: "completed", label: "Concluído" },
  { value: "archived", label: "Arquivado" },
];

export function CampaignCard({ campaign: c }: { campaign: CampaignWithCounts }) {
  const [pending, startTransition] = useTransition();
  const progress = c.step_count > 0 ? Math.round((c.done_count / c.step_count) * 100) : 0;
  const isPaused = c.status === "archived" || c.status === "draft";
  const icon = getProtocolIcon(c.protocol_logo, c.protocol_website);

  function handleStatusChange(status: CampaignStatus) {
    startTransition(async () => {
      await updateCampaignStatusAction(c.id, status);
    });
  }

  function handleFinalize() {
    if (!confirm(`Finalizar "${c.title}"?\nO status será marcado como Concluído.`)) return;
    handleStatusChange("completed");
  }

  return (
    <GlowCard className="group shadow-[0_10px_30px_-15px_rgba(0,0,0,0.8)] transition-all hover:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.9)]">
      <div className="glass rounded-[11px] p-6 relative overflow-hidden">
        {!isPaused && (
          <div className="absolute -right-10 -top-10 h-40 w-40 bg-[rgba(255,181,154,0.06)] blur-[80px] group-hover:bg-[rgba(255,181,154,0.1)] transition-all pointer-events-none" />
        )}

        <div className="flex justify-between items-start mb-5 relative z-10 gap-4">
          {/* Campaign info — clickable to detail */}
          <Link href={`/campaigns/${c.id}`} className="flex gap-4 flex-1 min-w-0">
            <div
              className={`h-16 w-16 bg-surface-container border rounded-2xl flex items-center justify-center shrink-0 overflow-hidden ${
                isPaused
                  ? "border-[rgba(233,195,73,0.2)] shadow-[0_0_15px_rgba(233,195,73,0.08)]"
                  : "border-[rgba(255,181,154,0.2)] shadow-[0_0_15px_rgba(255,181,154,0.08)]"
              }`}
            >
              {icon ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={icon} alt="" className="w-8 h-8 object-contain" />
              ) : (
                <span
                  className={`material-symbols-outlined text-[36px] ${isPaused ? "text-[#e9c349]" : "text-[#ffb59a]"}`}
                  style={{ fontVariationSettings: "'wght' 200" }}
                >
                  rocket
                </span>
              )}
            </div>
            <div className="min-w-0">
              <h4 className="text-[20px] font-semibold text-on-surface truncate">{c.title}</h4>
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
          </Link>

          {/* Actions */}
          <div className="flex flex-col items-end gap-2 shrink-0">
            <select
              value={c.status}
              onChange={(e) => handleStatusChange(e.target.value as CampaignStatus)}
              disabled={pending}
              className="text-[10px] font-bold uppercase tracking-widest bg-surface-container border border-outline-variant/40 rounded-lg px-2 py-1.5 text-on-surface-variant cursor-pointer hover:border-[#ff5c00]/40 transition-colors disabled:opacity-50 outline-none"
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={handleFinalize}
              disabled={pending || c.status === "completed"}
              className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-lg bg-[rgba(233,195,73,0.08)] border border-[#e9c349]/30 text-[#e9c349] hover:bg-[rgba(233,195,73,0.18)] hover:border-[#e9c349]/60 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {pending ? "..." : "Finalizar"}
            </button>
          </div>
        </div>

        {/* Progress */}
        <div className="space-y-3 relative z-10" style={{ opacity: isPaused ? 0.7 : 1 }}>
          <div className="flex justify-between text-sm">
            <span className="text-tertiary">Progresso da Missão</span>
            <span className={`font-bold ${isPaused ? "text-tertiary" : "text-[#ffb59a]"}`}>
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
  );
}
