"use client";

import Link from "next/link";
import { Bell, Settings } from "lucide-react";
import { buttonClasses } from "@/components/ui";

/**
 * Sininho de lembretes (link direto pra página de lembretes).
 * Commit 1 é visual: badge de "não lidas" virá no Commit 3 via client fetch.
 */
export function NotifBell({ unread = 0 }: { unread?: number }) {
  return (
    <Link
      href="/reminders"
      className={`relative ${buttonClasses("ghost", "sm")} h-9 w-9 p-0`}
      aria-label={unread > 0 ? `${unread} lembretes não lidos` : "Lembretes"}
    >
      <Bell className="h-4 w-4 text-muted-foreground" />
      {unread > 0 && (
        <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-mint-500" />
      )}
    </Link>
  );
}

export function SettingsButton() {
  return (
    <Link
      href="/settings"
      className={`${buttonClasses("ghost", "sm")} h-9 w-9 p-0`}
      aria-label="Configurações"
    >
      <Settings className="h-4 w-4 text-muted-foreground" />
    </Link>
  );
}
