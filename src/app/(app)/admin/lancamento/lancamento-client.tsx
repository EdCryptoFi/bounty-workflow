"use client";

import { useState } from "react";

type Subscriber = {
  id: string;
  name: string;
  email: string;
  twitter_handle: string | null;
  referral_source: string | null;
  created_at: string;
};

type EmailStats = {
  id: string;
  to_email: string;
  subject: string;
  sent_at: string | null;
  error: string | null;
  scheduled_for: string;
  created_at: string;
};

type GrowthDay = {
  date: string;
  count: number;
};

type Props = {
  subscribers: Subscriber[];
  totalCount: number;
  recentSubscribers: { name: string; email: string; twitter_handle: string | null; created_at: string }[];
  totalClicks: number;
  conversions: number;
  sentEmails: number;
  failedEmails: number;
  pendingEmails: number;
  launchOpen: boolean;
  emailStats: EmailStats[];
  dailyGrowth: GrowthDay[];
};

export function AdminLancamentoClient({
  subscribers,
  totalCount,
  recentSubscribers,
  totalClicks,
  conversions,
  sentEmails,
  failedEmails,
  pendingEmails,
  launchOpen: initialLaunchOpen,
  emailStats,
  dailyGrowth,
}: Props) {
  const [launchOpen, setLaunchOpen] = useState(initialLaunchOpen);
  const [toggling, setToggling] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [localSubscribers, setLocalSubscribers] = useState(subscribers);

  async function toggleLaunch() {
    setToggling(true);
    try {
      const res = await fetch("/api/admin/launch-toggle", { method: "POST" });
      const data = await res.json();
      if (res.ok) setLaunchOpen(data.launch_open);
    } catch {
      alert("Erro ao alternar modo de lançamento");
    } finally {
      setToggling(false);
    }
  }

  async function removeSubscriber(id: string) {
    if (!confirm("Remover este inscrito da lista?")) return;
    setDeletingId(id);
    try {
      const res = await fetch("/api/waitlist/remove", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (res.ok) setLocalSubscribers((prev) => prev.filter((s) => s.id !== id));
      else alert("Erro ao remover");
    } catch {
      alert("Erro ao remover");
    } finally {
      setDeletingId(null);
    }
  }

  function copyRefLink(code: string) {
    const url = `${window.location.origin}/ref/${code}`;
    navigator.clipboard.writeText(url);
    setShareUrl(url);
    setTimeout(() => setShareUrl(""), 2000);
  }

  const maxCount = Math.max(...dailyGrowth.map((d) => d.count), 1);

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

      {/* Launch Toggle + Actions Bar */}
      <div className="flex flex-wrap items-center gap-4 p-5 rounded-2xl border" style={{ background: "rgba(24,23,23,0.9)", backdropFilter: "blur(20px)", borderColor: launchOpen ? "rgba(34,197,94,0.3)" : "rgba(255,92,0,0.3)" }}>
        <div className="flex items-center gap-3">
          <span className={`w-3 h-3 rounded-full ${launchOpen ? "bg-green-500 shadow-[0_0_12px_rgba(34,197,94,0.6)]" : "bg-[#ff5c00] shadow-[0_0_12px_rgba(255,92,0,0.6)]"}`} />
          <div>
            <p className="text-sm font-bold text-on-surface">
              {launchOpen ? "Plataforma Aberta" : "Pré-lançamento"}
            </p>
            <p className="text-[10px] text-tertiary uppercase tracking-widest font-bold">
              {launchOpen ? "Qualquer email pode acessar" : "Apenas cryptolairbr@gmail.com"}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={toggleLaunch}
          disabled={toggling}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all disabled:opacity-50 ${launchOpen ? "bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30" : "bg-green-500/20 text-green-400 hover:bg-green-500/30 border border-green-500/30"}`}
        >
          {toggling ? "Alternando..." : launchOpen ? "Fechar Plataforma" : "Abrir Plataforma"}
        </button>

        <div className="ml-auto flex gap-3">
          <a
            href="/api/export/waitlist"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-outline-variant/30 text-xs font-bold uppercase tracking-widest text-tertiary hover:text-[#ffb59a] hover:border-[#ff5c00]/30 transition-all"
          >
            <span className="material-symbols-outlined text-[16px]">download</span>
            Exportar CSV
          </a>
        </div>
      </div>

      {/* Top stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard icon="group_add" label="Total na Lista" value={totalCount} color="#ff5c00" />
        <StatCard icon="ads_click" label="Cliques em Links" value={totalClicks} color="#ffb59a" />
        <StatCard icon="person_add" label="Conversões" value={conversions} color="#34d05f" />
        <StatCard icon="mail" label="Emails Enviados" value={sentEmails} color="#e9c349" />
      </div>

      {/* Growth chart */}
      {dailyGrowth.length > 0 && (
        <div className="rounded-2xl border border-outline-variant/30 overflow-hidden" style={{ background: "rgba(24,23,23,0.9)", backdropFilter: "blur(20px)" }}>
          <div className="flex items-center gap-2 px-6 py-4 border-b border-zinc-800/60">
            <span className="material-symbols-outlined text-[#ff5c00] text-[18px]">trending_up</span>
            <h2 className="text-sm font-bold uppercase tracking-widest text-on-surface">
              Inscrições por Dia
            </h2>
          </div>
          <div className="p-6">
            <div className="flex items-end gap-1.5 h-32">
              {dailyGrowth.slice(-14).map((day) => {
                const pct = (day.count / maxCount) * 100;
                return (
                  <div key={day.date} className="flex-1 flex flex-col items-center gap-1 group relative">
                    <span className="text-[9px] font-bold text-tertiary opacity-0 group-hover:opacity-100 transition-opacity">
                      {day.count}
                    </span>
                    <div
                      className="w-full rounded-t-sm transition-all duration-300 hover:opacity-80"
                      style={{
                        height: `${Math.max(pct, 4)}%`,
                        background: "linear-gradient(180deg, #ff5c00 0%, rgba(255,92,0,0.3) 100%)",
                      }}
                    />
                    <span className="text-[8px] text-tertiary whitespace-nowrap">
                      {new Date(day.date).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Email queue details */}
      <div className="rounded-2xl border border-outline-variant/30 overflow-hidden" style={{ background: "rgba(24,23,23,0.9)", backdropFilter: "blur(20px)" }}>
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

        {/* Pending email details */}
        {emailStats.filter((e) => !e.sent_at && !e.error).length > 0 && (
          <div className="border-t border-zinc-800/40 px-6 py-4">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-yellow-400 mb-3">
              Próximos disparos
            </h3>
            <div className="space-y-2">
              {emailStats.filter((e) => !e.sent_at && !e.error).slice(0, 10).map((e) => (
                <div key={e.id} className="flex items-center gap-3 text-xs">
                  <span className="w-2 h-2 rounded-full bg-yellow-500 shrink-0" />
                  <span className="text-tertiary truncate flex-1">{e.to_email}</span>
                  <span className="text-tertiary truncate max-w-[200px]">{e.subject}</span>
                  <span className="text-tertiary shrink-0">
                    {new Date(e.scheduled_for).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", hour: "2-digit" })}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Failed email details */}
        {emailStats.filter((e) => e.error).length > 0 && (
          <div className="border-t border-zinc-800/40 px-6 py-4">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-red-400 mb-3">
              Emails com falha
            </h3>
            <div className="space-y-2">
              {emailStats.filter((e) => e.error).slice(0, 10).map((e) => (
                <div key={e.id} className="flex items-center gap-3 text-xs">
                  <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
                  <span className="text-tertiary truncate flex-1">{e.to_email}</span>
                  <span className="text-red-400/80 truncate max-w-[300px]" title={e.error ?? ""}>{e.subject}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Recent subscribers */}
      <div className="rounded-2xl border border-outline-variant/30 overflow-hidden" style={{ background: "rgba(24,23,23,0.9)", backdropFilter: "blur(20px)" }}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800/60">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#ff5c00] text-[18px]">person_add</span>
            <h2 className="text-sm font-bold uppercase tracking-widest text-on-surface">
              Inscritos Recentes
            </h2>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-tertiary">
            Total: {totalCount}
          </span>
        </div>

        {recentSubscribers.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <span className="material-symbols-outlined text-[40px] text-tertiary">person_add</span>
            <p className="text-sm font-semibold text-on-surface">Nenhum inscrito ainda</p>
            <p className="text-xs text-tertiary">Compartilhe o link de pré-lançamento para começar.</p>
          </div>
        ) : (
          <div className="divide-y divide-zinc-800/40">
            {recentSubscribers.map((s) => {
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
      {localSubscribers.length > 0 && (
        <div className="rounded-2xl border border-outline-variant/30 overflow-hidden" style={{ background: "rgba(24,23,23,0.9)", backdropFilter: "blur(20px)" }}>
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
                  <th className="text-right px-6 py-3">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/30">
                {localSubscribers.map((s) => (
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
                    <td className="px-6 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => removeSubscriber(s.id)}
                        disabled={deletingId === s.id}
                        className="text-[10px] font-bold uppercase tracking-widest text-red-400 hover:text-red-300 transition-colors disabled:opacity-40"
                      >
                        {deletingId === s.id ? "Removendo..." : "Remover"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="px-6 py-4 border-t border-zinc-800/40 flex items-center justify-between">
            <p className="text-[10px] text-tertiary">
              {localSubscribers.length} inscrito{localSubscribers.length !== 1 ? "s" : ""}
            </p>
            <a
              href="/api/export/waitlist"
              className="text-[10px] font-bold uppercase tracking-widest text-[#ff5c00] hover:text-[#ffb59a] transition-colors"
            >
              Exportar CSV
            </a>
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
