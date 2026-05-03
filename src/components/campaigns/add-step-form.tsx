"use client";

import { useRef, useState, useTransition } from "react";
import { Plus } from "lucide-react";
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
          className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none ring-ring transition focus:ring-2"
        />
        <input
          name="due_date"
          type="date"
          className="rounded-lg border border-border bg-background px-2 py-2 text-sm outline-none ring-ring transition focus:ring-2"
        />
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center gap-1.5 rounded-lg bg-mint-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-mint-700 disabled:opacity-60"
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Adicionar</span>
        </button>
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </form>
  );
}
