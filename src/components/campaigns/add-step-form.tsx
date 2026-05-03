"use client";

import { useRef, useState, useTransition } from "react";
import { addStepAction } from "@/lib/campaigns/actions";

export function AddStepForm({ campaignId }: { campaignId: string }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    fd.set("campaign_id", campaignId);
    startTransition(async () => {
      const res = await addStepAction(fd);
      if (res?.error) setError(res.error);
      else formRef.current?.reset();
    });
  }

  return (
    <form ref={formRef} onSubmit={onSubmit} className="flex flex-col gap-2">
      <div className="flex gap-2">
        <input
          name="title"
          required
          maxLength={200}
          placeholder="Adicionar tarefa..."
          className="flex-1 rounded-lg border border-outline-variant/50 bg-surface-container/50 px-3 py-2 text-sm text-on-surface placeholder:text-tertiary outline-none transition focus:border-[#ff5c00]/60 focus:ring-1 focus:ring-[#ff5c00]/40"
        />
        <input
          name="due_date"
          type="date"
          className="rounded-lg border border-outline-variant/50 bg-surface-container/50 px-2 py-2 text-sm text-on-surface outline-none transition focus:border-[#ff5c00]/60 focus:ring-1 focus:ring-[#ff5c00]/40"
        />
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center gap-1.5 rounded-lg bg-[#ff5c00] px-3 py-2 text-sm font-bold text-white transition hover:bg-[#ff7b33] hover:shadow-[0_0_15px_rgba(255,92,0,0.4)] disabled:opacity-60 active:scale-95"
        >
          <span className="material-symbols-outlined text-[16px]">add</span>
          <span className="hidden sm:inline">Adicionar</span>
        </button>
      </div>
      {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
    </form>
  );
}
