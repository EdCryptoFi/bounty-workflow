"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ChevronDown, LogOut, Settings, User as UserIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function UserMenu({
  email,
  fullName,
  avatarUrl,
}: {
  email: string;
  fullName?: string | null;
  avatarUrl?: string | null;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const initial = (fullName?.[0] ?? email[0] ?? "?").toUpperCase();

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-lg border border-border bg-card px-2 py-1.5 text-sm transition hover:bg-muted"
      >
        {avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={avatarUrl} alt="" className="h-7 w-7 rounded-full" />
        ) : (
          <span className="grid h-7 w-7 place-items-center rounded-full bg-mint-100 text-xs font-semibold text-mint-800">
            {initial}
          </span>
        )}
        <span className="hidden max-w-[140px] truncate font-medium sm:inline">
          {fullName ?? email}
        </span>
        <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
      </button>

      <div
        className={cn(
          "absolute right-0 top-full z-50 mt-2 w-56 origin-top-right rounded-xl border border-border bg-card p-1 shadow-lg transition",
          open
            ? "pointer-events-auto scale-100 opacity-100"
            : "pointer-events-none scale-95 opacity-0",
        )}
      >
        <div className="border-b border-border px-3 py-2 text-xs text-muted-foreground">
          {email}
        </div>
        <MenuItem href="/settings" icon={<UserIcon className="h-4 w-4" />}>
          Meu perfil
        </MenuItem>
        <MenuItem href="/settings/billing" icon={<Settings className="h-4 w-4" />}>
          Plano e pagamento
        </MenuItem>
        <form action="/auth/signout" method="post">
          <button
            type="submit"
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-destructive transition hover:bg-destructive/10"
          >
            <LogOut className="h-4 w-4" />
            Sair
          </button>
        </form>
      </div>
    </div>
  );
}

function MenuItem({
  href,
  icon,
  children,
}: {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition hover:bg-muted"
    >
      {icon}
      {children}
    </Link>
  );
}
