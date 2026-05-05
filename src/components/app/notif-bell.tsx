"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

export type ReminderAlert = {
  id: string;
  message: string | null;
  trigger_at: string;
  campaign_title: string | null;
};

export function NotifBell({ reminders }: { reminders: ReminderAlert[] }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const count = reminders.length;

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function formatTime(iso: string) {
    const d = new Date(iso);
    const now = new Date();
    const diffMs = d.getTime() - now.getTime();
    const diffH = Math.round(diffMs / 3600000);
    if (diffH < 0) return "Vencido";
    if (diffH === 0) return "Agora";
    if (diffH < 24) return `em ${diffH}h`;
    const diffD = Math.round(diffH / 24);
    return `em ${diffD}d`;
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="relative text-zinc-400 hover:text-[#ffb59a] transition-colors active:scale-95"
        aria-label={count > 0 ? `${count} alertas` : "Notificações"}
      >
        <span className="material-symbols-outlined text-[24px]">notifications</span>
        {count > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 rounded-full bg-[#ff5c00] text-white text-[9px] font-bold flex items-center justify-center px-1 shadow-[0_0_8px_rgba(255,92,0,0.7)]">
            {count > 9 ? "9+" : count}
          </span>
        )}
      </button>

      {open && (
        <div
          className="absolute right-0 top-full mt-3 w-80 rounded-2xl overflow-hidden z-50"
          style={{
            background: "rgba(18,17,17,0.98)",
            border: "1px solid rgba(255,92,0,0.2)",
            boxShadow: "0 16px 48px rgba(0,0,0,0.7), 0 0 20px rgba(255,92,0,0.06)",
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-outline-variant/20">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#ffb59a] text-[16px]">notifications_active</span>
              <span className="text-xs font-bold uppercase tracking-widest text-on-surface">
                Alertas
              </span>
            </div>
            {count > 0 && (
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#ff5c00]">
                {count} pendente{count > 1 ? "s" : ""}
              </span>
            )}
          </div>

          {/* List */}
          {count === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 gap-2">
              <span className="material-symbols-outlined text-[32px] text-tertiary">notifications_off</span>
              <p className="text-[11px] text-tertiary font-bold uppercase tracking-widest">
                Nenhum alerta pendente
              </p>
            </div>
          ) : (
            <div className="flex flex-col divide-y divide-outline-variant/10 max-h-72 overflow-y-auto">
              {reminders.map((r) => (
                <div key={r.id} className="flex items-start gap-3 px-4 py-3 hover:bg-[rgba(255,92,0,0.05)] transition-colors">
                  <span className="w-2 h-2 rounded-full bg-[#ff5c00] shadow-[0_0_6px_#ff5c00] shrink-0 mt-1.5" />
                  <div className="flex-1 min-w-0">
                    {r.campaign_title && (
                      <p className="text-[10px] font-bold uppercase tracking-widest text-[#ffb59a] truncate">
                        {r.campaign_title}
                      </p>
                    )}
                    <p className="text-xs text-on-surface mt-0.5 leading-snug">
                      {r.message ?? "Deadline se aproximando"}
                    </p>
                  </div>
                  <span className="text-[10px] font-bold text-tertiary shrink-0 uppercase tracking-widest mt-0.5">
                    {formatTime(r.trigger_at)}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Footer */}
          <div className="border-t border-outline-variant/20 px-4 py-2.5">
            <Link
              href="/reminders"
              onClick={() => setOpen(false)}
              className="flex items-center justify-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-tertiary hover:text-[#ffb59a] transition-colors"
            >
              Ver todos os lembretes
              <span className="material-symbols-outlined text-[13px]">arrow_forward</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
