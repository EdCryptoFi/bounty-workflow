import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { requireUser } from "@/lib/auth";

export const metadata: Metadata = { title: "Meus Pontos — Referrals" };

export default async function ReferralPointsPage() {
  const { user } = await requireUser();
  const supabase = await createClient();

  const [userData, clicksData, referredData] = await Promise.all([
    supabase
      .from("users")
      .select("referral_code, referral_balance, referred_by, created_at")
      .eq("id", user.id)
      .single(),
    supabase
      .from("referral_clicks")
      .select("id, clicked_at, converted")
      .eq("referrer_id", user.id)
      .order("clicked_at", { ascending: false }),
    supabase
      .from("users")
      .select("full_name, email, created_at")
      .eq("referred_by", user.id)
      .order("created_at", { ascending: false }),
  ]);

  const referralCode = userData?.data?.referral_code as string | null;
  const clicks = clicksData?.data ?? [];
  const referredUsers = referredData?.data ?? [];
  const totalClicks = clicks.length;
  const conversions = clicks.filter((c: { converted: boolean }) => c.converted).length;

  const origin = process.env.NEXT_PUBLIC_APP_URL ?? "https://bountywork.xyz";
  const referralLink = referralCode ? `${origin}/ref/${referralCode}` : null;

  return (
    <div className="max-w-[1200px] mx-auto flex flex-col gap-8">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#ff5c00] mb-1">
            Programa de Indicação
          </p>
          <h1 className="font-display text-[30px] font-semibold tracking-tight text-on-surface leading-tight">
            Meus Pontos
          </h1>
          <p className="text-sm text-tertiary mt-1">
            Acompanhe suas indicações e impacto.
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/referrals"
            className="flex items-center gap-2 px-4 py-2.5 rounded border border-[rgba(255,92,0,0.3)] text-[#ffb59a] text-xs font-bold uppercase tracking-widest hover:bg-[rgba(255,92,0,0.08)] transition-all"
          >
            <span className="material-symbols-outlined text-[16px]">redeem</span>
            Meus Links
          </Link>
        </div>
      </div>

      {/* Referral link share card */}
      {referralLink && (
        <div
          className="rounded-2xl border border-[rgba(255,92,0,0.2)] p-6"
          style={{ background: "rgba(255,92,0,0.04)" }}
        >
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#ff5c00] mb-2">
            Seu link de indicação
          </p>
          <CopyField value={referralLink} />
        </div>
      )}

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          icon="ads_click"
          label="Cliques no link"
          value={totalClicks}
          color="#ffb59a"
        />
        <StatCard
          icon="person_add"
          label="Conversões"
          value={conversions}
          color="#34d05f"
        />
        <StatCard
          icon="emoji_events"
          label="Pessoas indicadas"
          value={referredUsers.length}
          color="#e9c349"
        />
      </div>

      {/* Referred users table */}
      <div
        className="rounded-2xl border border-outline-variant/30 overflow-hidden"
        style={{ background: "rgba(24,23,23,0.9)", backdropFilter: "blur(20px)" }}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800/60">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#ff5c00] text-[18px]">group</span>
            <h2 className="text-sm font-bold uppercase tracking-widest text-on-surface">
              Indicados
            </h2>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-tertiary">
            {referredUsers.length} total
          </span>
        </div>

        {referredUsers.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <span className="material-symbols-outlined text-[40px] text-tertiary">person_add</span>
            <p className="text-sm font-semibold text-on-surface">Nenhuma indicação ainda</p>
            <p className="text-xs text-tertiary">Compartilhe seu link e comece a indicar outros hunters.</p>
          </div>
        ) : (
          <div className="divide-y divide-zinc-800/40">
            {referredUsers.map((u: { full_name?: string | null; email: string; created_at: string }) => {
              const initials = (
                u.full_name?.split(" ").map((w: string) => w[0]).join("").slice(0, 2) ??
                u.email?.[0] ??
                "?"
              ).toUpperCase();
              const joined = new Date(u.created_at).toLocaleDateString("pt-BR", {
                day: "2-digit", month: "short", year: "numeric",
              });
              return (
                <div key={u.email} className="flex items-center gap-4 px-6 py-3">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                    style={{ background: "rgba(255,92,0,0.2)", border: "1px solid rgba(255,92,0,0.3)" }}>
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
        )}
      </div>

      {/* Click history */}
      <div
        className="rounded-2xl border border-outline-variant/30 overflow-hidden"
        style={{ background: "rgba(24,23,23,0.9)", backdropFilter: "blur(20px)" }}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800/60">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#ff5c00] text-[18px]">history</span>
            <h2 className="text-sm font-bold uppercase tracking-widest text-on-surface">
              Histórico de Cliques
            </h2>
          </div>
        </div>

        {clicks.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-12 text-center">
            <span className="material-symbols-outlined text-[32px] text-tertiary">ads_click</span>
            <p className="text-sm text-tertiary">Nenhum clique registrado ainda</p>
          </div>
        ) : (
          <div className="divide-y divide-zinc-800/40 max-h-[400px] overflow-y-auto">
            {clicks.map((c: { id: string; clicked_at: string; converted: boolean }) => (
              <div key={c.id} className="flex items-center justify-between px-6 py-3 text-sm">
                <div className="flex items-center gap-3">
                  <span className={`w-2 h-2 rounded-full ${c.converted ? "bg-green-500" : "bg-zinc-500"}`} />
                  <span className="text-tertiary">
                    {new Date(c.clicked_at).toLocaleDateString("pt-BR", {
                      day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit",
                    })}
                  </span>
                </div>
                <span className={`text-[11px] font-bold uppercase tracking-widest ${c.converted ? "text-green-400" : "text-zinc-500"}`}>
                  {c.converted ? "Convertido" : "Clique"}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color }: { icon: string; label: string; value: number; color: string }) {
  return (
    <div className="rounded-2xl border border-outline-variant/30 p-5"
      style={{ background: "rgba(24,23,23,0.9)", backdropFilter: "blur(20px)" }}>
      <div className="flex items-center justify-between mb-3">
        <span className="material-symbols-outlined text-[22px]" style={{ color }}>{icon}</span>
      </div>
      <p className="text-3xl font-bold font-display" style={{ color }}>{value}</p>
      <p className="text-[11px] font-bold uppercase tracking-widest text-tertiary mt-0.5">{label}</p>
    </div>
  );
}

function CopyField({ value }: { value: string }) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-outline-variant/40 bg-surface-container/30 px-4 py-3">
      <span className="material-symbols-outlined text-[18px] text-tertiary">link</span>
      <code className="flex-1 text-sm text-tertiary font-mono truncate">{value}</code>
      <CopyButton value={value} />
    </div>
  );
}

function CopyButton({ value }: { value: string }) {
  return (
    <form
      action={async () => {
        "use server";
        // Server-side copy is not possible, we use client-side
      }}
    >
      <button
        type="button"
        onClick={async () => {
          await navigator.clipboard.writeText(value);
          const btn = document.activeElement as HTMLButtonElement;
          if (btn) {
            btn.textContent = "Copiado!";
            setTimeout(() => { btn.textContent = "Copiar"; }, 2000);
          }
        }}
        className="shrink-0 flex items-center gap-1.5 rounded-lg border border-[#ff5c00]/30 bg-[rgba(255,92,0,0.08)] px-4 py-2 text-[11px] font-bold text-[#ff5c00] hover:bg-[rgba(255,92,0,0.15)] transition-all"
      >
        <span className="material-symbols-outlined text-[14px]">content_copy</span>
        Copiar
      </button>
    </form>
  );
}
