"use client";

import { useState, useTransition } from "react";
import { applyActivationCodeAction } from "@/lib/admin/codes-actions";

type Props = {
  appliedCode: string | null;
  trialEndsAt: string | null;
};

export function ActivationCodePanel({ appliedCode, trialEndsAt }: Props) {
  const [code, setCode] = useState("");
  const [pending, start] = useTransition();
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  function handleApply(e: React.FormEvent) {
    e.preventDefault();
    if (!code.trim()) return;
    setMsg(null);
    start(async () => {
      const res = await applyActivationCodeAction(code.trim());
      if (res.error) setMsg({ ok: false, text: res.error });
      else {
        const date = res.newTrialEnds
          ? new Date(res.newTrialEnds).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })
          : "";
        setMsg({ ok: true, text: `+${res.daysAdded} dias adicionados! Trial válido até ${date}.` });
        setCode("");
      }
    });
  }

  return (
    <div className="bg-[rgba(42,42,42,0.7)] backdrop-blur-xl border border-outline-variant/50 rounded-xl p-6 flex flex-col gap-4 shadow-[inset_0_0_20px_rgba(255,92,0,0.03)]">
      <h2 className="text-sm font-semibold text-on-surface flex items-center gap-2">
        <span className="material-symbols-outlined text-[#e9c349] text-[16px]">confirmation_number</span>
        Código de Ativação
      </h2>

      {appliedCode ? (
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3 p-3 bg-surface-container/30 rounded-lg border border-[rgba(233,195,73,0.2)]">
            <span className="w-2 h-2 rounded-full bg-[#e9c349] shadow-[0_0_8px_#e9c349] shrink-0" />
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-tertiary">Código Aplicado</p>
              <p className="text-sm font-mono font-bold text-[#e9c349] mt-0.5">{appliedCode}</p>
            </div>
          </div>
          {trialEndsAt && (
            <p className="text-[10px] font-bold uppercase tracking-widest text-tertiary">
              Trial válido até{" "}
              <span className="text-on-surface">
                {new Date(trialEndsAt).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })}
              </span>
            </p>
          )}
          <p className="text-[10px] text-tertiary">
            Cada conta aceita apenas um código de ativação.
          </p>
        </div>
      ) : (
        <form onSubmit={handleApply} className="flex flex-col gap-3">
          <p className="text-xs text-tertiary leading-relaxed">
            Tem um código de ativação? Insira abaixo para estender seu período de trial.
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="BWF-XXXXXXXX"
              maxLength={20}
              className="flex-1 rounded-lg border border-outline-variant/50 bg-surface-container/50 px-3 py-2 text-sm font-mono text-on-surface placeholder:text-tertiary outline-none transition focus:border-[#ff5c00]/60 focus:ring-1 focus:ring-[#ff5c00]/40"
            />
            <button
              type="submit"
              disabled={pending || !code.trim()}
              className="px-4 py-2 bg-[#ff5c00] hover:bg-[#ff7b33] text-white text-xs font-bold uppercase tracking-widest rounded-lg transition disabled:opacity-60"
            >
              {pending ? "..." : "Aplicar"}
            </button>
          </div>
          {msg && (
            <p className={`text-xs font-bold ${msg.ok ? "text-[#e9c349]" : "text-red-400"}`}>
              {msg.text}
            </p>
          )}
        </form>
      )}
    </div>
  );
}
