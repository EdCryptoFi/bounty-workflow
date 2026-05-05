"use client";

import { useTransition } from "react";
import { deleteActivationCodeAction } from "@/lib/admin/codes-actions";

export function DeleteCodeButton({ id, code }: { id: string; code: string }) {
  const [pending, start] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (!confirm(`Apagar código "${code}"?`)) return;
        start(async () => { await deleteActivationCodeAction(id); });
      }}
      className="rounded p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition disabled:opacity-50"
      aria-label="Apagar"
    >
      <span className="material-symbols-outlined text-[16px]">delete</span>
    </button>
  );
}
