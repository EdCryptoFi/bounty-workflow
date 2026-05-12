import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { GlowCard } from "@/components/ui/glow-card";
import { AnalyticsCharts } from "./analytics-charts";

export const metadata: Metadata = { title: "Admin · Analytics" };
export const dynamic = "force-dynamic";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID ?? "G-2FG5PZ279D";
const GA_URL = "https://analytics.google.com/analytics/web/";

export default async function AdminAnalyticsPage() {
  const supabase = await createClient();

  // Fetch user signups over last 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const [
    { data: allUsers },
    { data: recentSignups },
    { count: totalCampaigns },
    { count: totalProtocols },
    { data: billingData },
  ] = await Promise.all([
    supabase
      .from("users")
      .select("id, email, full_name, created_at, banned_at, plan, trial_ends_at")
      .order("created_at", { ascending: true }),
    supabase
      .from("users")
      .select("id, created_at")
      .gte("created_at", thirtyDaysAgo.toISOString())
      .order("created_at", { ascending: true }),
    supabase.from("campaigns").select("*", { count: "exact", head: true }),
    supabase.from("protocols").select("*", { count: "exact", head: true }),
    supabase.from("v_user_billing").select("billing_status"),
  ]);

  // Process daily signups for chart
  const dailySignups: Record<string, number> = {};
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    dailySignups[d.toISOString().slice(0, 10)] = 0;
  }
  (recentSignups ?? []).forEach((u) => {
    const day = new Date(u.created_at).toISOString().slice(0, 10);
    if (dailySignups[day] !== undefined) dailySignups[day]++;
  });

  const signupChartData = Object.entries(dailySignups).map(([date, count]) => ({
    date,
    label: new Date(date + "T12:00:00").toLocaleDateString("pt-BR", { day: "2-digit", month: "short" }),
    count,
  }));

  // Process billing status breakdown
  const billingBreakdown = { active: 0, trialing: 0, expired: 0, free: 0 };
  (billingData ?? []).forEach((row) => {
    const status = row.billing_status as keyof typeof billingBreakdown;
    if (billingBreakdown[status] !== undefined) billingBreakdown[status]++;
    else billingBreakdown.free++;
  });

  // User growth (cumulative)
  const cumulativeGrowth: { date: string; label: string; total: number }[] = [];
  let cumTotal = 0;
  const usersByMonth: Record<string, number> = {};
  (allUsers ?? []).forEach((u) => {
    const month = new Date(u.created_at).toISOString().slice(0, 7);
    usersByMonth[month] = (usersByMonth[month] || 0) + 1;
  });
  Object.entries(usersByMonth)
    .sort(([a], [b]) => a.localeCompare(b))
    .forEach(([month, count]) => {
      cumTotal += count;
      cumulativeGrowth.push({
        date: month,
        label: new Date(month + "-15").toLocaleDateString("pt-BR", { month: "short", year: "2-digit" }),
        total: cumTotal,
      });
    });

  const stats = {
    totalUsers: allUsers?.length ?? 0,
    activeUsers: billingBreakdown.active,
    trialingUsers: billingBreakdown.trialing,
    expiredUsers: billingBreakdown.expired,
    totalCampaigns: totalCampaigns ?? 0,
    totalProtocols: totalProtocols ?? 0,
    bannedUsers: allUsers?.filter((u) => u.banned_at).length ?? 0,
    signupsToday: dailySignups[new Date().toISOString().slice(0, 10)] ?? 0,
    signupsThisWeek: (recentSignups ?? []).filter((u) => {
      const d = new Date(u.created_at);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return d >= weekAgo;
    }).length,
  };

  return (
    <div className="max-w-[1400px] mx-auto flex flex-col gap-8">
      {/* Header */}
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-[#ff5c00] mb-1">
          Analytics
        </p>
        <h1 className="font-display text-[30px] font-semibold tracking-tight text-on-surface leading-tight">
          Métricas da Plataforma
        </h1>
        <p className="text-sm text-tertiary mt-1">
          Visão completa de crescimento, atividade e receita.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Usuários", value: stats.totalUsers, icon: "group", color: "#ff5c00" },
          { label: "Premium Ativos", value: stats.activeUsers, icon: "workspace_premium", color: "#e9c349" },
          { label: "Em Trial", value: stats.trialingUsers, icon: "hourglass_top", color: "#ffb59a" },
          { label: "Expirados", value: stats.expiredUsers, icon: "block", color: "#ef4444" },
          { label: "Signups Hoje", value: stats.signupsToday, icon: "today", color: "#22c55e" },
          { label: "Signups 7d", value: stats.signupsThisWeek, icon: "date_range", color: "#3b82f6" },
          { label: "Campanhas", value: stats.totalCampaigns, icon: "campaign", color: "#ff5c00" },
          { label: "Banidos", value: stats.bannedUsers, icon: "person_off", color: "#ef4444" },
        ].map((s) => (
          <GlowCard key={s.label}>
            <div className="rounded-[11px] p-5 flex flex-col gap-2" style={{ background: "rgba(24,23,23,0.9)" }}>
              <span className="material-symbols-outlined text-[20px]" style={{ color: s.color }}>
                {s.icon}
              </span>
              <p className="text-2xl font-bold font-display" style={{ color: s.color }}>
                {s.value}
              </p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-tertiary">
                {s.label}
              </p>
            </div>
          </GlowCard>
        ))}
      </div>

      {/* Charts */}
      <AnalyticsCharts
        signupChartData={signupChartData}
        cumulativeGrowth={cumulativeGrowth}
        billingBreakdown={billingBreakdown}
      />

      {/* Google Analytics */}
      <GlowCard>
        <div
          className="rounded-[11px] p-6"
          style={{ background: "rgba(24,23,23,0.9)" }}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              {/* GA logo */}
              <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: "rgba(251,188,5,0.12)", border: "1px solid rgba(251,188,5,0.25)" }}>
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
                  <rect x="2" y="12" width="4" height="10" rx="1" fill="#e8710a" />
                  <rect x="10" y="6" width="4" height="16" rx="1" fill="#fbbc05" />
                  <rect x="18" y="2" width="4" height="20" rx="1" fill="#34a853" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-bold uppercase tracking-widest text-on-surface">
                  Google Analytics
                </h3>
                <p className="text-[10px] text-tertiary mt-0.5">Rastreamento ativo · {GA_ID}</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-green-400 shadow-[0_0_6px_#4ade80]" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-green-400">
                Ativo
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            {[
              {
                icon: "mouse",
                label: "Pageviews",
                desc: "Visitas às páginas públicas e app",
                color: "#fbbc05",
              },
              {
                icon: "person_pin",
                label: "Usuários Ativos",
                desc: "Sessões em tempo real no site",
                color: "#34a853",
              },
              {
                icon: "conversion_path",
                label: "Conversões",
                desc: "Signup e checkout rastreados",
                color: "#4285f4",
              },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-lg border border-outline-variant/20 bg-surface-container/30 p-4 flex gap-3 items-start"
              >
                <span
                  className="material-symbols-outlined text-[20px] shrink-0 mt-0.5"
                  style={{ color: item.color }}
                >
                  {item.icon}
                </span>
                <div>
                  <p className="text-xs font-bold text-on-surface">{item.label}</p>
                  <p className="text-[10px] text-tertiary mt-0.5 leading-snug">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href={GA_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-[#ff5c00] px-4 py-2.5 text-xs font-bold text-white uppercase tracking-widest transition hover:bg-[#ff7b33] hover:shadow-[0_0_15px_rgba(255,92,0,0.35)] active:scale-95"
            >
              <span className="material-symbols-outlined text-[16px]">open_in_new</span>
              Abrir Google Analytics
            </Link>
            <Link
              href={`${GA_URL}#/p/realtime`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg border border-green-500/30 bg-green-500/5 px-4 py-2.5 text-xs font-bold text-green-400 uppercase tracking-widest transition hover:bg-green-500/10"
            >
              <span className="w-2 h-2 rounded-full bg-green-400 shadow-[0_0_6px_#4ade80]" />
              Usuários em Tempo Real
            </Link>
          </div>

          <p className="mt-4 text-[10px] text-tertiary text-center">
            Tag instalada em todas as páginas · ID de medição:{" "}
            <span className="font-mono text-on-surface/60">{GA_ID}</span>
          </p>
        </div>
      </GlowCard>
    </div>
  );
}
