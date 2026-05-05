"use client";

import { useState, useTransition } from "react";
import { createActivationCodeAction } from "@/lib/admin/codes-actions";

export function CreateCodeForm() {
  const [days, setDays] = useState(7);
  const [customCode, setCustomCode] = useState("");
  const [pending, start] = useTransition();
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    start(async () => {
      const res = await createActivationCodeAction(days, customCode.trim() || null);
      if (res.error) setMsg({ ok: false, text: res.error });
      else {
        setMsg({ ok: true, text: `Código criado: ${res.code}` });
        setCustomCode("");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-end gap-3 flex-wrap p-4 bg-muted/30 rounded-xl border border-border">
      <div className="flex flex-col gap-1">
        <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
          Código (opcional)
        </label>
        <input
          type="text"
          value={customCode}
          onChange={(e) => setCustomCode(e.target.value.toUpperCase())}
          placeholder="AUTO-GERADO"
          maxLength={20}
          pattern="[A-Z0-9\-]*"
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm font-mono outline-none focus:border-[#ff5c00] w-44"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
          Dias grátis
        </label>
        <input
          type="number"
          min={1}
          max={365}
          value={days}
          onChange={(e) => setDays(Number(e.target.value))}
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-[#ff5c00] w-24"
        />
      </div>
      <button
        type="submit"
        disabled={pending}
        className="flex items-center gap-2 px-4 py-2 bg-[#ff5c00] hover:bg-[#ff7b33] text-white text-xs font-bold uppercase tracking-widest rounded-lg transition disabled:opacity-60"
      >
        {pending ? "Gerando..." : "Gerar Código"}
      </button>
      {msg && (
        <p className={`text-xs font-bold ${msg.ok ? "text-[#e9c349]" : "text-red-400"}`}>
          {msg.text}
        </p>
      )}
    </form>
  );
}
