"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/protocols", label: "Protocols", icon: "description" },
  { href: "/dashboard", label: "Dashboard", icon: "dashboard" },
  { href: "/campaigns", label: "Campaigns", icon: "rocket_launch" },
  { href: "/reminders", label: "Reminders", icon: "notifications_active" },
  { href: "/referrals", label: "Referrals", icon: "redeem" },
  { href: "/dicas", label: "Bounty AI", icon: "bolt" },
  { href: "/como-usar", label: "Como usar", icon: "school" },
];

export function SidebarNav({
  onNavigate,
  userSlot,
  showAdmin = false,
}: {
  onNavigate?: () => void;
  userSlot?: React.ReactNode;
  showAdmin?: boolean;
}) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col pt-24 pb-8">
      {/* Brand */}
      <div className="px-4 mb-6">
        <Link href="/dashboard" onClick={onNavigate} className="block relative overflow-hidden rounded-xl group">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-final.png" alt="Bounty Workflow" className="w-full object-contain rounded-xl" />
          <span className="logo-gold-shimmer pointer-events-none absolute inset-0 rounded-xl" />
        </Link>
        <style>{`
          @keyframes goldShimmer {
            0%, 80% { transform: translateX(-150%) skewX(-20deg); opacity: 0; }
            85% { opacity: 1; }
            100% { transform: translateX(250%) skewX(-20deg); opacity: 0; }
          }
          .logo-gold-shimmer {
            background: linear-gradient(90deg, transparent, rgba(233,195,73,0.55), rgba(255,220,100,0.7), rgba(233,195,73,0.55), transparent);
            animation: goldShimmer 5s ease-in-out infinite;
          }
        `}</style>
      </div>

      {/* Nova Campanha button */}
      <div className="px-4 mb-4">
        <Link
          href="/campaigns/new"
          onClick={onNavigate}
          className="flex items-center justify-center gap-2 w-full py-2.5 bg-[#ff5c00] hover:bg-[#ff7b33] text-white text-xs font-bold uppercase tracking-widest rounded transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,92,0,0.4)] active:scale-95"
        >
          <span className="material-symbols-outlined text-[16px]">add</span>
          Nova Campanha
        </Link>
      </div>

      {/* Nav links */}
      <nav className="flex-1 flex flex-col gap-1 px-2">
        {nav.map((item) => {
          const active =
            item.href === "/dashboard"
              ? pathname === item.href
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all duration-200",
                active
                  ? "text-[#ff5c00] bg-[rgba(255,92,0,0.08)] border-r-2 border-[#ff5c00] shadow-[0_0_15px_rgba(255,92,0,0.08)]"
                  : "text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800/40",
              )}
            >
              <span
                className={cn(
                  "material-symbols-outlined text-[20px]",
                  active ? "filled" : "",
                )}
              >
                {item.icon}
              </span>
              <span>{item.label}</span>
            </Link>
          );
        })}

        <div className="mt-auto">
          {showAdmin && (
            <Link
              href="/admin"
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all duration-200 mb-1",
                pathname.startsWith("/admin")
                  ? "text-[#e9c349] bg-[rgba(233,195,73,0.08)] border-r-2 border-[#e9c349]"
                  : "text-zinc-500 hover:text-[#e9c349] hover:bg-zinc-800/40",
              )}
            >
              <span className="material-symbols-outlined text-[20px]">admin_panel_settings</span>
              <span>Admin</span>
            </Link>
          )}
        </div>
      </nav>

      {/* Archive — above settings */}
      <div className="px-2 mt-2 border-t border-zinc-800/60 pt-2">
        <Link
          href="/archive"
          onClick={onNavigate}
          className={cn(
            "flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-all duration-200 rounded-lg",
            pathname.startsWith("/archive")
              ? "text-[#ff5c00] bg-[rgba(255,92,0,0.08)]"
              : "text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800/40",
          )}
        >
          <span className={cn("material-symbols-outlined text-[20px]", pathname.startsWith("/archive") ? "filled" : "")}>
            inventory_2
          </span>
          <span>Archive</span>
        </Link>
      </div>

      {userSlot && (
        <div className="px-4 mt-2">{userSlot}</div>
      )}

      {/* Logout */}
      <div className="px-4 mt-3">
        <form action="/auth/signout" method="post">
          <button
            type="submit"
            className="flex items-center gap-3 w-full px-4 py-2.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-500 hover:text-zinc-300 text-xs font-bold uppercase tracking-widest transition-all duration-200"
          >
            <span className="material-symbols-outlined text-[18px]">logout</span>
            Logout
          </button>
        </form>
      </div>
    </div>
  );
}

export function SidebarUserCard({
  fullName,
  email,
  avatarUrl,
  tierLabel,
  tierVariant = "trial",
}: {
  fullName: string | null | undefined;
  email: string;
  avatarUrl: string | null | undefined;
  tierLabel: string;
  tierVariant?: "trial" | "active" | "past_due" | "expired";
}) {
  const initial = (fullName?.[0] ?? email[0] ?? "?").toUpperCase();
  const display = fullName?.trim() || email.split("@")[0];

  const tierColor = {
    trial: "text-[#ffb59a]",
    active: "text-secondary",
    past_due: "text-amber-500",
    expired: "text-red-400",
  }[tierVariant];

  return (
    <Link
      href="/settings"
      className="flex items-center gap-3 rounded-xl bg-surface-container border border-outline-variant/30 px-3 py-2 hover:border-[#ff5c00]/30 hover:bg-[rgba(255,92,0,0.05)] transition-all duration-200"
    >
      {avatarUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={avatarUrl}
          alt=""
          className="h-9 w-9 shrink-0 rounded-full object-cover border border-secondary/30"
        />
      ) : (
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[rgba(255,92,0,0.15)] border border-[#ff5c00]/30 text-sm font-bold text-[#ffb59a]">
          {initial}
        </span>
      )}
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-medium text-on-surface">
          {display}
        </div>
        <div className={cn("truncate text-[10px] font-bold uppercase tracking-widest", tierColor)}>
          {tierLabel}
        </div>
      </div>
      <span className="material-symbols-outlined text-[16px] text-tertiary shrink-0">settings</span>
    </Link>
  );
}
