"use client";

import { useTransition } from "react";
import { startCheckoutAction } from "./actions";

export function UpgradeButton({ enabled }: { enabled: boolean }) {
  const [pending, start] = useTransition();

  if (!enabled) {
    return (
      <button
        type="button"
        disabled
        className="inline-flex cursor-not-allowed rounded-lg bg-muted px-4 py-2 text-sm font-medium text-muted-foreground"
      >
        Upgrade em breve
      </button>
    );
  }

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() =>
        start(async () => {
          const res = await startCheckoutAction();
          if (res.ok) {
            window.location.href = res.url;
          } else {
            alert(res.error);
          }
        })
      }
      className="inline-flex rounded-lg bg-mint-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-mint-700 disabled:opacity-60"
    >
      {pending ? "Redirecionando..." : "Fazer upgrade pro Pro"}
    </button>
  );
}
