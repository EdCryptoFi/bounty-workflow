"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";
import { deleteProtocolAction } from "@/lib/protocols/actions";

export function DeleteProtocolButton({ id, name }: { id: string; name: string }) {
  const [pending, startTransition] = useTransition();

  function onClick() {
    if (!confirm(`Excluir "${name}"?`)) return;
    startTransition(async () => {
      const res = await deleteProtocolAction(id);
      if (res?.error) alert(res.error);
    });
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={pending}
      className="rounded p-1.5 text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive disabled:opacity-60"
      aria-label="Excluir"
    >
      <Trash2 className="h-4 w-4" />
    </button>
  );
}
