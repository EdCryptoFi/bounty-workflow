"use client";

import { useState, useTransition, useRef, useEffect } from "react";
import { updateCampaignStatusAction } from "@/lib/campaigns/actions";
import type { CampaignStatus } from "@/lib/types";

const OPTIONS: { value: CampaignStatus; label: string; dot: string; text: string }[] = [
  { value: "active",   label: "Live",      dot: "bg-[#ff5c00] shadow-[0_0_8px_#ff5c00]", text: "text-[#ffb59a]" },
  { value: "draft",    label: "Rascunho",  dot: "bg-zinc-400",                             text: "text-zinc-400" },
  { value: "archived", label: "Pausado",   dot: "bg-zinc-600",                             text: "text-zinc-500" },
];

export function CampaignStatusSelect({
  campaignId,
  status,
}: {
  campaignId: string;
  status: CampaignStatus;
}) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const ref = useRef<HTMLDivElement>(null);

  const current = OPTIONS.find((o) => o.value === status) ?? OPTIONS[0];

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSelect(value: CampaignStatus) {
    setOpen(false);
    if (value === status) return;
    startTransition(async () => {
      await updateCampaignStatusAction(campaignId, value);
    });
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        disabled={pending}
        className="px-3 py-1 bg-surface-container/50 border border-secondary/30 rounded-full flex items-center gap-2 hover:border-[#ff5c00]/40 transition-colors disabled:opacity-60 group"
      >
        <span className={`w-2 h-2 rounded-full shrink-0 ${current.dot}`} />
        <span className={`text-[10px] font-bold uppercase tracking-widest ${current.text}`}>
          {pending ? "..." : current.label}
        </span>
        <span className="material-symbols-outlined text-[12px] text-tertiary group-hover:text-[#ffb59a] transition-colors">
          {open ? "expand_less" : "expand_more"}
        </span>
      </button>

      {open && (
        <div
          className="absolute left-0 top-full mt-2 z-50 flex flex-col py-1 rounded-xl overflow-hidden min-w-[130px]"
          style={{
            background: "rgba(22,21,21,0.98)",
            border: "1px solid rgba(255,92,0,0.2)",
            boxShadow: "0 8px 30px rgba(0,0,0,0.6)",
          }}
        >
          {OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => handleSelect(opt.value)}
              className={`flex items-center gap-2.5 px-4 py-2.5 text-left text-[10px] font-bold uppercase tracking-widest transition-colors hover:bg-[rgba(255,92,0,0.08)] ${
                opt.value === status ? opt.text : "text-tertiary"
              }`}
            >
              <span className={`w-2 h-2 rounded-full shrink-0 ${opt.dot}`} />
              {opt.label}
              {opt.value === status && (
                <span className="material-symbols-outlined text-[12px] ml-auto">check</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
