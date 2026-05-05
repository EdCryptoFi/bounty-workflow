"use client";

import { useState, useTransition } from "react";
import { addStepAction } from "@/lib/campaigns/actions";

const MONTHS = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

export function AddStepModal({
  campaignId,
  compact = false,
}: {
  campaignId: string;
  compact?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [links, setLinks] = useState<string[]>([]);
  const [linkInput, setLinkInput] = useState("");
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");

  function addLink() {
    const url = linkInput.trim();
    if (url) {
      setLinks((prev) => [...prev, url]);
      setLinkInput("");
    }
  }

  function removeLink(i: number) {
    setLinks((prev) => prev.filter((_, idx) => idx !== i));
  }

  function handleClose() {
    setOpen(false);
    setLinks([]);
    setLinkInput("");
    setMonth("");
    setDay("");
    setError(null);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    fd.set("campaign_id", campaignId);

    if (month && day) {
      const year = new Date().getFullYear();
      fd.set("due_date", `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`);
    }

    links.forEach((url) => fd.append("link", url));

    startTransition(async () => {
      const res = await addStepAction(fd);
      if (res?.error) {
        setError(res.error);
      } else {
        handleClose();
      }
    });
  }

  return (
    <>
      {compact ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="text-tertiary hover:text-[#ff5c00] transition rounded p-0.5"
          title="Adicionar tarefa"
        >
          <span className="material-symbols-outlined text-[14px]">add</span>
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-[#ff5c00] px-4 py-2 text-sm font-bold text-white transition hover:bg-[#ff7b33] hover:shadow-[0_0_15px_rgba(255,92,0,0.4)] active:scale-95"
        >
          <span className="material-symbols-outlined text-[16px]">add</span>
          Adicionar Tarefa
        </button>
      )}

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={handleClose}
          />

          <div className="relative z-10 w-full max-w-md bg-[rgba(22,22,22,0.98)] border border-outline-variant/50 rounded-2xl p-6 shadow-[0_0_60px_rgba(255,92,0,0.2)] flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-on-surface">Nova Tarefa</h3>
              <button
                type="button"
                onClick={handleClose}
                className="text-tertiary hover:text-on-surface transition"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* Title */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-tertiary">
                  Nome da Tarefa
                </label>
                <input
                  name="title"
                  required
                  maxLength={200}
                  placeholder="Ex: Configurar wallet"
                  className="rounded-lg border border-outline-variant/50 bg-surface-container/50 px-3 py-2 text-sm text-on-surface placeholder:text-tertiary outline-none transition focus:border-[#ff5c00]/60 focus:ring-1 focus:ring-[#ff5c00]/40"
                />
              </div>

              {/* Description */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-tertiary">
                  Descrição
                </label>
                <textarea
                  name="description"
                  rows={3}
                  maxLength={1000}
                  placeholder="Detalhes opcionais..."
                  className="rounded-lg border border-outline-variant/50 bg-surface-container/50 px-3 py-2 text-sm text-on-surface placeholder:text-tertiary outline-none transition focus:border-[#ff5c00]/60 focus:ring-1 focus:ring-[#ff5c00]/40 resize-none"
                />
              </div>

              {/* Links */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-tertiary">
                  Links
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={linkInput}
                    onChange={(e) => setLinkInput(e.target.value)}
                    placeholder="https://..."
                    className="flex-1 rounded-lg border border-outline-variant/50 bg-surface-container/50 px-3 py-2 text-sm text-on-surface placeholder:text-tertiary outline-none transition focus:border-[#ff5c00]/60 focus:ring-1 focus:ring-[#ff5c00]/40"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addLink();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={addLink}
                    className="rounded-lg border border-outline-variant/50 bg-surface-container/50 px-3 py-2 text-tertiary hover:text-[#ff5c00] transition"
                  >
                    <span className="material-symbols-outlined text-[16px]">add</span>
                  </button>
                </div>
                {links.length > 0 && (
                  <div className="flex flex-col gap-1.5 mt-1">
                    {links.map((url, i) => (
                      <div key={i} className="flex items-center gap-2 text-[11px]">
                        <span className="material-symbols-outlined text-[12px] text-tertiary">link</span>
                        <span className="flex-1 truncate text-tertiary">{url}</span>
                        <button
                          type="button"
                          onClick={() => removeLink(i)}
                          className="text-tertiary hover:text-red-400 transition"
                        >
                          <span className="material-symbols-outlined text-[14px]">close</span>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Date: month + day */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-tertiary">
                  Data (opcional)
                </label>
                <div className="flex gap-3">
                  <select
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                    className="flex-1 rounded-lg border border-outline-variant/50 bg-[rgba(22,22,22,0.98)] px-3 py-2 text-sm text-on-surface outline-none transition focus:border-[#ff5c00]/60"
                  >
                    <option value="">Mês</option>
                    {MONTHS.map((m, i) => (
                      <option key={i} value={String(i + 1)}>
                        {m}
                      </option>
                    ))}
                  </select>
                  <select
                    value={day}
                    onChange={(e) => setDay(e.target.value)}
                    className="w-24 rounded-lg border border-outline-variant/50 bg-[rgba(22,22,22,0.98)] px-3 py-2 text-sm text-on-surface outline-none transition focus:border-[#ff5c00]/60"
                  >
                    <option value="">Dia</option>
                    {Array.from({ length: 31 }, (_, i) => (
                      <option key={i} value={String(i + 1)}>
                        {i + 1}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {error && <p className="text-xs text-red-400">{error}</p>}

              <div className="flex gap-3 justify-end pt-1">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 rounded-lg text-sm text-tertiary hover:text-on-surface border border-outline-variant/50 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={pending}
                  className="inline-flex items-center gap-2 rounded-lg bg-[#ff5c00] px-5 py-2 text-sm font-bold text-white transition hover:bg-[#ff7b33] hover:shadow-[0_0_15px_rgba(255,92,0,0.4)] disabled:opacity-60 active:scale-95"
                >
                  {pending ? "Salvando..." : "Criar Tarefa"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
