"use client";

import { useTransition } from "react";
import { ArchiveRestore } from "lucide-react";
import { unarchiveCampaignAction } from "@/lib/campaigns/actions";

export function UnarchiveButton({ id }: { id: string }) {
  const [pending, start] = useTransition();

  return (
    <button
      type="button"
      onClick={() =>
        start(async () => {
          await unarchiveCampaignAction(id);
        })
      }
      disabled={pending}
      className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-2.5 py-1.5 text-xs font-medium transition hover:border-mint-400 hover:bg-mint-50 disabled:opacity-60"
    >
      <ArchiveRestore className="h-3.5 w-3.5" />
      Restaurar
    </button>
  );
}
