import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { GlowCard } from "@/components/ui/glow-card";

export const metadata: Metadata = { title: "Admin Dashboard" };

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  const [
    { count: totalUsers },
    { count: activeUsers },
    { count: trialUsers },
    { count: expiredUsers },
    { count: totalCampaigns },
    { count: totalProtocols },
    { count: codesTotal },
    { count: codesUsed },
    { data: recentUsers },
  ] = await Promise.all([
    supabase.from("users").select("*", { count: "exact", head: true }),
    supabase
      .from("v_user_billing")
      .select("*", { count: "exact", head: true })
      .eq("billing_status", "active"),
    supabase
      .from("v_user_billing")
      .select("*", { count: "exact", head: true })
      .eq("billing_status", "trialing"),
    supabase
      .from("v_user_billing")
      .select("*", { count: "exact", head: true })
      .eq("billing_status", "expired"),
    supabase.from("campaigns").select("*", { count: "exact", head: true }),
    supabase.from("protocols").select("*", { count: "exact", head: true }),
    supabase.from("activation_codes").select("*", { count: "exact", head: true }),
    supabase
      .from("activation_codes")
      .select("*", { count: "exact", head: true })
      .not("used_by", "is", null),
    supabase
      .from("users")
      .select("id, full_name, email, created_at")
      .order("created_at", { ascending: false })
      .limit(8),
  ]);

  const stats = [
    {
      label: "Total de Usuários",
      value: totalUsers ?? 0,
      icon: "group",
      color: "#ff5c00",
      href: null,
    },
    {
      label: "Premium Ativos",
      value: activeUsers ?? 0,
      icon: "workspace_premium",
      color: "#e9c349",
      href: null,
    },
    {
      label: "Em Trial",
      value: trialUsers ?? 0,
      icon: "hourglass_top",
      color: "#ffb59a",
      href: null,
    },
    {
      label: "Trial Expirado",
      value: expiredUsers ?? 0,
      icon: "block",
      color: "#ef4444",
      href: null,
    },
    {
      label: "Campanhas Criadas",
      value: totalCampaigns ?? 0,
      icon: "campaign",
      color: "#ff5c00",
      href: "/campaigns",
    },
    {
      label: "Protocolos",
      value: totalProtocols ?? 0,
      icon: "hub",
      color: "#e9c349",
      href: "/admin/protocols",
    },
    {
      label: "Códigos Criados",
      value: codesTotal ?? 0,
      icon: "key",
      color: "#ffb59a",
      href: "/admin/codes",
    },
    {
      label: "Códigos Usados",
      value: codesUsed ?? 0,
      icon: "check_circle",
      color: "#22c55e",
      href: "/admin/codes",
    },
  ];

  return (
    <div className="max-w-[1400px] mx-auto flex flex-col gap-8">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#ff5c00] mb-1">
            Painel Administrativo
          </p>
          <h1 className="font-display text-[30px] font-semibold tracking-tight text-on-surface leading-tight">
            Visão Global da Plataforma
          </h1>
          <p className="text-sm text-tertiary mt-1">
            Métricas em tempo real de todos os usuários e operações.
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/admin/codes"
            className="flex items-center gap-2 px-4 py-2.5 rounded border border-[rgba(255,92,0,0.3)] text-[#ffb59a] text-xs font-bold uppercase tracking-widest hover:bg-[rgba(255,92,0,0.08)] transition-all"
          >
            <span className="material-symbols-outlined text-[16px]">key</span>
            Códigos
          </Link>
          <Link
            href="/admin/protocols"
            className="flex items-center gap-2 px-4 py-2.5 bg-[#ff5c00] hover:bg-[#ff7b33] text-white text-xs font-bold uppercase tracking-widest rounded transition-all hover:shadow-[0_0_20px_rgba(255,92,0,0.35)] active:scale-95"
          >
            <span className="material-symbols-outlined text-[16px]">hub</span>
            Protocolos
          </Link>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {stats.map((s) => {
          const inner = (
            <GlowCard className="h-full">
              <div
                className="rounded-[11px] p-5 flex flex-col gap-3 h-full relative overflow-hidden"
                style={{ background: "rgba(24,23,23,0.9)", backdropFilter: "blur(20px)" }}
              >
                <div
                  className="absolute inset-0 opacity-10 pointer-events-none"
                  style={{
                    background: `radial-gradient(ellipse 80% 60% at 10% 10%, ${s.color}44 0%, transparent 70%)`,
                  }}
                />
                <div className="flex items-center justify-between relative z-10">
                  <span
                    className="material-symbols-outlined text-[22px]"
                    style={{ color: s.color }}
                  >
                    {s.icon}
                  </span>
                  {s.href && (
                    <span className="material-symbols-outlined text-[14px] text-tertiary">
                      arrow_forward
                    </span>
                  )}
                </div>
                <div className="relative z-10">
                  <p
                    className="text-3xl font-bold font-display"
                    style={{ color: s.color }}
                  >
                    {s.value}
                  </p>
                  <p className="text-[11px] font-bold uppercase tracking-widest text-tertiary mt-0.5">
                    {s.label}
                  </p>
                </div>
              </div>
            </GlowCard>
          );

          return s.href ? (
            <Link key={s.label} href={s.href} className="h-full">
              {inner}
            </Link>
          ) : (
            <div key={s.label}>{inner}</div>
          );
        })}
      </div>

      {/* Recent users */}
      <GlowCard>
        <div
          className="rounded-[11px] overflow-hidden"
          style={{ background: "rgba(24,23,23,0.9)", backdropFilter: "blur(20px)" }}
        >
          <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800/60">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#ffb59a] text-[18px]">
                person_add
              </span>
              <h2 className="text-sm font-bold uppercase tracking-widest text-on-surface">
                Usuários Recentes
              </h2>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-tertiary">
              Últimos 8
            </span>
          </div>

          <div className="divide-y divide-zinc-800/40">
            {(recentUsers ?? []).map((u) => {
              const initials = (
                u.full_name?.split(" ").map((w: string) => w[0]).join("").slice(0, 2) ??
                u.email?.[0] ??
                "?"
              ).toUpperCase();

              const joined = new Date(u.created_at).toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              });

              return (
                <div
                  key={u.id}
                  className="flex items-center gap-4 px-6 py-3 hover:bg-[rgba(255,92,0,0.03)] transition-colors"
                >
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                    style={{ background: "rgba(255,92,0,0.2)", border: "1px solid rgba(255,92,0,0.3)" }}
                  >
                    {initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-on-surface truncate">
                      {u.full_name ?? "—"}
                    </p>
                    <p className="text-xs text-tertiary truncate">{u.email}</p>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-tertiary shrink-0">
                    {joined}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </GlowCard>

      {/* Quick links */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            href: "/admin/protocols",
            icon: "hub",
            label: "Gerenciar Protocolos",
            desc: "Adicionar, editar ou remover protocolos do catálogo.",
          },
          {
            href: "/admin/codes",
            icon: "key",
            label: "Códigos de Ativação",
            desc: "Criar e monitorar códigos de trial para novos usuários.",
          },
          {
            href: "/dashboard",
            icon: "analytics",
            label: "Dashboard do Usuário",
            desc: "Ver a plataforma como um usuário comum.",
          },
        ].map((item) => (
          <Link key={item.href} href={item.href}>
            <GlowCard className="h-full">
              <div
                className="rounded-[11px] p-5 flex gap-4 items-start h-full hover:bg-[rgba(255,92,0,0.04)] transition-colors"
                style={{ background: "rgba(24,23,23,0.9)", backdropFilter: "blur(20px)" }}
              >
                <span
                  className="material-symbols-outlined text-[24px] text-[#ff5c00] shrink-0 mt-0.5"
                >
                  {item.icon}
                </span>
                <div>
                  <p className="text-sm font-semibold text-on-surface">{item.label}</p>
                  <p className="text-xs text-tertiary mt-0.5 leading-relaxed">{item.desc}</p>
                </div>
                <span className="material-symbols-outlined text-[16px] text-tertiary ml-auto shrink-0 mt-0.5">
                  arrow_forward
                </span>
              </div>
            </GlowCard>
          </Link>
        ))}
      </div>
    </div>
  );
}
