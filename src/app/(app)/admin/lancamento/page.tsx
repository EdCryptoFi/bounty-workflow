import type { Metadata } from "next";
import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Campanha de Lançamento — Admin" };

export default async function AdminLancamentoPage() {
  const supabase = createAdminClient();

  const [
    { data: subscribers },
    { count: totalCount },
    { data: recentSubscribers },
    { data: referralStats },
    { data: emailStats },
  ] = await Promise.all([
    supabase
      .from("waitlist_subscribers")
      .select("id, name, email, twitter_handle, referral_source, created_at")
      .order("created_at", { ascending: false }),
    supabase
      .from("waitlist_subscribers")
      .select("*", { count: "exact", head: true }),
    supabase
      .from("waitlist_subscribers")
      .select("name, email, twitter_handle, created_at")
      .order("created_at", { ascending: false })
      .limit(10),
    supabase
      .from("referral_clicks")
      .select("id, converted"),
    supabase
      .from("email_queue")
      .select("id, sent_at, error")
      .order("created_at", { ascending: false }),
  ]);

  const totalClicks = referralStats?.length ?? 0;
  const conversions = referralStats?.filter((c: { converted: boolean }) => c.converted).length ?? 0;
  const sentEmails = emailStats?.filter((e: { sent_at: string | null }) => e.sent_at).length ?? 0;
  const failedEmails = emailStats?.filter((e: { error: string | null }) => e.error).length ?? 0;
  const pendingEmails = (emailStats?.length ?? 0) - sentEmails - failedEmails;

  return (
    <div className="max-w-[1400px] mx-auto flex flex-col gap-8">
      {/* Header */}
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-[#ff5c00] mb-1">
          Campanha de Lançamento
        </p>
        <h1 className="font-display text-[30px] font-semibold tracking-tight text-on-surface leading-tight">
          Controle Total
        </h1>
        <p className="text-sm text-tertiary mt-1">
          Acompanhe a lista de espera, indicações e envios de email.
        </p>
      </div>

      {/* Top stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard icon="group_add" label="Total na Lista" value={totalCount ?? 0} color="#ff5c00" />
        <StatCard icon="ads_click" label="Cliques em Links" value={totalClicks} color="#ffb59a" />
        <StatCard icon="person_add" label="Conversões" value={conversions} color="#34d05f" />
        <StatCard icon="mail" label="Emails Enviados" value={sentEmails} color="#e9c349" />
      </div>

      {/* Email queue status */}
      <div
        className="rounded-2xl border border-outline-variant/30 overflow-hidden"
        style={{ background: "rgba(24,23,23,0.9)", backdropFilter: "blur(20px)" }}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800/60">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#ff5c00] text-[18px]">mail</span>
            <h2 className="text-sm font-bold uppercase tracking-widest text-on-surface">
              Status da Fila de Email
            </h2>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 p-6">
          <div className="text-center">
            <p className="text-xl font-bold text-green-400">{sentEmails}</p>
            <p className="text-[10px] font-bold uppercase tracking-widest text-tertiary mt-1">Enviados</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-yellow-400">{pendingEmails}</p>
            <p className="text-[10px] font-bold uppercase tracking-widest text-tertiary mt-1">Pendentes</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-red-400">{failedEmails}</p>
            <p className="text-[10px] font-bold uppercase tracking-widest text-tertiary mt-1">Falhas</p>
          </div>
        </div>
        {failedEmails > 0 && (
          <div className="px-6 pb-4">
            <Link
              href="/admin/lancamento"
              className="text-[11px] font-bold text-red-400 hover:text-red-300 underline"
            >
              Ver detalhes das falhas
            </Link>
          </div>
        )}
      </div>

      {/* Recent subscribers */}
      <div
        className="rounded-2xl border border-outline-variant/30 overflow-hidden"
        style={{ background: "rgba(24,23,23,0.9)", backdropFilter: "blur(20px)" }}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800/60">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#ff5c00] text-[18px]">person_add</span>
            <h2 className="text-sm font-bold uppercase tracking-widest text-on-surface">
              Inscritos Recentes
            </h2>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-tertiary">
            Total: {totalCount ?? 0}
          </span>
        </div>

        {(!recentSubscribers || recentSubscribers.length === 0) ? (
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <span className="material-symbols-outlined text-[40px] text-tertiary">person_add</span>
            <p className="text-sm font-semibold text-on-surface">Nenhum inscrito ainda</p>
            <p className="text-xs text-tertiary">Compartilhe o link de pré-lançamento para começar.</p>
          </div>
        ) : (
          <div className="divide-y divide-zinc-800/40">
            {recentSubscribers.map((s: { name: string; email: string; twitter_handle: string | null; created_at: string }) => {
              const initials = s.name.split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase();
              const joined = new Date(s.created_at).toLocaleDateString("pt-BR", {
                day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit",
              });
              return (
                <div key={s.email} className="flex items-center gap-4 px-6 py-3 hover:bg-[rgba(255,92,0,0.03)] transition-colors">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                    style={{ background: "rgba(255,92,0,0.2)", border: "1px solid rgba(255,92,0,0.3)" }}>
                    {initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-on-surface truncate">{s.name}</p>
                    <p className="text-xs text-tertiary truncate">{s.email}</p>
                  </div>
                  {s.twitter_handle && (
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#ff5c00]">
                      {s.twitter_handle}
                    </span>
                  )}
                  <span className="text-[10px] font-bold uppercase tracking-widest text-tertiary shrink-0">{joined}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* All subscribers table */}
      {subscribers && subscribers.length > 0 && (
        <div
          className="rounded-2xl border border-outline-variant/30 overflow-hidden"
          style={{ background: "rgba(24,23,23,0.9)", backdropFilter: "blur(20px)" }}
        >
          <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800/60">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#ff5c00] text-[18px]">database</span>
              <h2 className="text-sm font-bold uppercase tracking-widest text-on-surface">
                Todos os Inscritos
              </h2>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-800/40 text-[10px] font-bold uppercase tracking-widest text-tertiary">
                  <th className="text-left px-6 py-3">Nome</th>
                  <th className="text-left px-6 py-3">Email</th>
                  <th className="text-left px-6 py-3">X/Twitter</th>
                  <th className="text-left px-6 py-3">Origem</th>
                  <th className="text-left px-6 py-3">Data</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/30">
                {subscribers.map((s: { id: string; name: string; email: string; twitter_handle: string | null; referral_source: string | null; created_at: string }) => (
                  <tr key={s.id} className="hover:bg-[rgba(255,92,0,0.03)]">
                    <td className="px-6 py-3 font-medium text-on-surface">{s.name}</td>
                    <td className="px-6 py-3 text-tertiary">{s.email}</td>
                    <td className="px-6 py-3">
                      <span className="text-[10px] font-bold uppercase tracking-widest">{s.twitter_handle ?? "—"}</span>
                    </td>
                    <td className="px-6 py-3 text-tertiary">{s.referral_source ?? "—"}</td>
                    <td className="px-6 py-3 text-tertiary">
                      {new Date(s.created_at).toLocaleDateString("pt-BR", {
                        day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Export hint */}
          <div className="px-6 py-4 border-t border-zinc-800/40">
            <p className="text-[10px] text-tertiary">
              💡 Use a consulta SQL no Supabase Dashboard para exportar:{" "}
              <code className="text-[#ff5c00]">SELECT * FROM waitlist_subscribers ORDER BY created_at DESC;</code>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ icon, label, value, color }: { icon: string; label: string; value: number; color: string }) {
  return (
    <div
      className="rounded-2xl border border-outline-variant/30 p-5"
      style={{ background: "rgba(24,23,23,0.9)", backdropFilter: "blur(20px)" }}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="material-symbols-outlined text-[22px]" style={{ color }}>{icon}</span>
      </div>
      <p className="text-3xl font-bold font-display" style={{ color }}>{value}</p>
      <p className="text-[11px] font-bold uppercase tracking-widest text-tertiary mt-0.5">{label}</p>
    </div>
  );
}
