"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";
import { cancelReminderAction } from "@/lib/reminders/actions";

export function CancelReminderButton({ id }: { id: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      onClick={() =>
        startTransition(async () => {
          await cancelReminderAction(id);
        })
      }
      disabled={pending}
      className="rounded p-1.5 text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive disabled:opacity-60"
      aria-label="Cancelar"
    >
      <Trash2 className="h-4 w-4" />
    </button>
  );
}
