"use client";

import { useState } from "react";
import Link from "next/link";
import { formatDeadlineLabel } from "@/lib/campaigns/date-utils";
import type { CampaignWithCounts, CampaignStatus } from "@/lib/types";

export function Timeline({ campaigns }: { campaigns: CampaignWithCounts[] }) {
  if (campaigns.length === 0) return null;

  const groups = bucketByDeadline(campaigns);

  return (
    <div className="space-y-8">
      {groups.map((g) =>
        g.items.length === 0 ? null : (
          <TimelineBucket
            key={g.key}
            label={g.label}
            tone={g.tone}
            items={g.items}
            collapsible={g.key === "later"}
          />
        ),
      )}
    </div>
  );
}

export default Timeline;

interface TimelineBucketProps {
  label: string;
  tone: "danger" | "warning" | "default";
  items: CampaignWithCounts[];
  collapsible?: boolean;
}

function TimelineBucket({ label, tone, items, collapsible }: TimelineBucketProps) {
  const [expanded, setExpanded] = useState(false);
  const shouldCollapse = !!collapsible && items.length > 3 && !expanded;
  const visible = shouldCollapse ? items.slice(0, 3) : items;
  const hidden = items.length - visible.length;

  const labelColor =
    tone === "danger"
      ? "text-red-400"
      : tone === "warning"
      ? "text-[#e9c349]"
      : "text-tertiary";

  return (
    <section>
      <div className="mb-4 flex items-center gap-3">
        <span
          className={`text-[10px] font-bold uppercase tracking-widest ${labelColor}`}
        >
          {label}
        </span>
        <span className="px-2 py-0.5 rounded-full bg-surface-container border border-outline-variant/30 text-[10px] font-bold text-tertiary">
          {items.length}
        </span>
      </div>

      <div className="space-y-3">
        {visible.map((c) => (
          <TimelineCard key={c.id} campaign={c} />
        ))}
      </div>

      {shouldCollapse && (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="mt-4 text-[10px] font-bold uppercase tracking-widest text-[#ffb59a] hover:text-[#ff5c00] transition-colors"
        >
          Ver mais {hidden} →
        </button>
      )}
    </section>
  );
}

function TimelineCard({ campaign: c }: { campaign: CampaignWithCounts }) {
  const pct =
    c.step_count === 0 ? 0 : Math.round((c.done_count / c.step_count) * 100);
  const valueLabel = formatBRL(c.estimated_value_brl);
  const isOverdue = c.days_to_deadline !== null && c.days_to_deadline < 0;
  const isActive = c.status === "active";

  return (
    <Link href={`/campaigns/${c.id}`} className="block group">
      <div
        className={`p-[1px] rounded-xl transition-all duration-200 ${
          isActive
            ? "bg-gradient-to-br from-[rgba(255,181,154,0.15)] to-transparent hover:from-[rgba(255,181,154,0.25)]"
            : isOverdue
            ? "bg-gradient-to-br from-[rgba(255,100,80,0.12)] to-transparent"
            : "bg-gradient-to-br from-[rgba(91,65,55,0.3)] to-transparent"
        }`}
      >
        <div className="bg-surface-container-highest/70 backdrop-blur-xl rounded-[calc(0.75rem-1px)] p-5 relative overflow-hidden">
          {isActive && (
            <div className="absolute -right-8 -top-8 h-32 w-32 bg-[rgba(255,181,154,0.05)] blur-[60px] group-hover:bg-[rgba(255,181,154,0.08)] transition-all pointer-events-none" />
          )}

          <div className="flex items-start justify-between gap-4 mb-4 relative z-10">
            <div className="flex items-center gap-3 min-w-0">
              <div
                className={`h-10 w-10 shrink-0 rounded-xl border flex items-center justify-center ${
                  isActive
                    ? "bg-[rgba(255,181,154,0.08)] border-[rgba(255,181,154,0.2)]"
                    : "bg-surface-container border-outline-variant/30"
                }`}
              >
                <span
                  className={`material-symbols-outlined text-[20px] ${
                    isActive ? "text-[#ffb59a]" : "text-tertiary"
                  }`}
                  style={{ fontVariationSettings: "'wght' 200" }}
                >
                  rocket_launch
                </span>
              </div>
              <div className="min-w-0">
                <h3
                  className={`text-base font-semibold truncate transition-colors ${
                    isActive
                      ? "text-on-surface group-hover:text-[#ffb59a]"
                      : "text-tertiary"
                  }`}
                >
                  {c.title}
                </h3>
                {c.description && (
                  <p className="text-xs text-tertiary mt-0.5 line-clamp-1">
                    {c.description}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {valueLabel && (
                <span className="text-[11px] font-bold text-[#e9c349]">
                  {valueLabel}
                </span>
              )}
              <StatusChip status={c.status} />
            </div>
          </div>

          <div className="space-y-2 relative z-10">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-tertiary">
                {c.done_count}/{c.step_count} tarefas
              </span>
              <span
                className={`font-bold ${isActive ? "text-[#ffb59a]" : "text-tertiary"}`}
              >
                {pct}%
              </span>
            </div>
            <div className="h-1.5 w-full bg-surface-bright rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  isActive
                    ? "bg-gradient-to-r from-[#ffb59a] to-[#e9c349]"
                    : "bg-tertiary/40"
                }`}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>

          <div className="flex items-center justify-between mt-3 relative z-10">
            <span
              className={`text-[10px] font-bold uppercase tracking-widest ${
                isOverdue ? "text-red-400" : "text-tertiary"
              }`}
            >
              {c.deadline
                ? formatDeadlineLabel(c.deadline) +
                  (c.days_to_deadline !== null
                    ? c.days_to_deadline < 0
                      ? ` · ${Math.abs(c.days_to_deadline)}d atrasado`
                      : c.days_to_deadline === 0
                      ? " · hoje"
                      : c.days_to_deadline === 1
                      ? " · amanhã"
                      : ` · ${c.days_to_deadline}d`
                    : "")
                : "Sem prazo"}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

function StatusChip({ status }: { status: CampaignStatus }) {
  const map: Record<CampaignStatus, { label: string; cls: string }> = {
    draft: {
      label: "Rascunho",
      cls: "bg-surface-container border-outline-variant/30 text-tertiary",
    },
    active: {
      label: "Ativa",
      cls: "bg-[rgba(255,181,154,0.1)] border-[rgba(255,181,154,0.3)] text-[#ffb59a]",
    },
    completed: {
      label: "Concluída",
      cls: "bg-[rgba(233,195,73,0.1)] border-[rgba(233,195,73,0.3)] text-[#e9c349]",
    },
    archived: {
      label: "Arquivada",
      cls: "bg-surface-container border-outline-variant/30 text-tertiary",
    },
  };
  const cfg = map[status];
  return (
    <span
      className={`px-2.5 py-1 rounded-full border text-[10px] font-bold uppercase tracking-widest ${cfg.cls}`}
    >
      {cfg.label}
    </span>
  );
}

function bucketByDeadline(campaigns: CampaignWithCounts[]) {
  const groups: {
    key: string;
    label: string;
    tone: "danger" | "warning" | "default";
    items: CampaignWithCounts[];
  }[] = [
    { key: "overdue", label: "Atrasadas", tone: "danger", items: [] },
    { key: "today", label: "Hoje", tone: "warning", items: [] },
    { key: "week", label: "Próximos 7 dias", tone: "default", items: [] },
    { key: "later", label: "Mais tarde", tone: "default", items: [] },
    { key: "none", label: "Sem prazo", tone: "default", items: [] },
  ];

  for (const c of campaigns) {
    if (c.days_to_deadline === null) groups[4].items.push(c);
    else if (c.days_to_deadline < 0) groups[0].items.push(c);
    else if (c.days_to_deadline === 0) groups[1].items.push(c);
    else if (c.days_to_deadline <= 7) groups[2].items.push(c);
    else groups[3].items.push(c);
  }

  return groups;
}

function formatBRL(value: string | null): string | null {
  if (!value) return null;
  const n = parseFloat(value);
  if (!isFinite(n) || n <= 0) return null;
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(n);
}
