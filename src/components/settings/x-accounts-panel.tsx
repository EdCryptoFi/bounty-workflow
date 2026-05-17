"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { XAccountCard } from "@/components/x/x-account-card";

type XAccountsPanelProps = {
  accounts: Array<{
    id: string;
    x_username: string;
    x_name: string | null;
    x_avatar_url: string | null;
  }>;
};

export function XAccountsPanel({ accounts }: XAccountsPanelProps) {
  const [connecting, setConnecting] = useState(false);
  const [localAccounts, setLocalAccounts] = useState(accounts);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const xError = searchParams?.get("x_error");
  const xSuccess = searchParams?.get("x_success");

  useEffect(() => {
    if (xError) setError(decodeURIComponent(xError));
    if (xSuccess) {
      setSuccess(`Conta @${decodeURIComponent(xSuccess)} conectada com sucesso!`);
      window.location.reload();
    }
  }, [xError, xSuccess]);

  async function handleConnect() {
    setConnecting(true);
    setError(null);
    try {
      const res = await fetch("/api/x/auth/url", { method: "POST" });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error ?? "Erro ao conectar");
      }
    } catch {
      setError("Erro de conexão");
    } finally {
      setConnecting(false);
    }
  }

  async function handleDisconnect(accountId: string) {
    try {
      const res = await fetch("/api/x/disconnect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accountId }),
      });
      const data = await res.json();
      if (data.ok) {
        setLocalAccounts((prev) => prev.filter((a) => a.id !== accountId));
        setSuccess("Conta desconectada");
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(data.error ?? "Erro ao desconectar");
      }
    } catch {
      setError("Erro de conexão");
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div
        className="rounded-2xl border p-6 flex flex-col gap-4"
        style={{
          background: "rgba(24,23,23,0.95)",
          borderColor: "rgba(255,92,0,0.2)",
          backdropFilter: "blur(20px)",
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
            style={{
              background: "rgba(255,92,0,0.1)",
              border: "1px solid rgba(255,92,0,0.2)",
            }}
          >
            <span className="material-symbols-outlined text-[20px]" style={{ color: "#ff5c00" }}>
              alternate_email
            </span>
          </div>
          <div>
            <h2 className="text-base font-semibold text-on-surface">
              Contas X / Twitter
            </h2>
            <p className="text-[11px] text-tertiary">
              Conecte sua conta do X para publicar posts diretamente do Bounty
              WorkFlow com o Bounty AI
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleConnect}
          disabled={connecting}
          className="flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed w-fit"
          style={{ background: "#ff5c00", color: "#fff" }}
        >
          <span className="material-symbols-outlined text-[18px]">
            {connecting ? "hourglass_empty" : "add_link"}
          </span>
          {connecting ? "Conectando..." : "Conectar conta do X"}
        </button>

        {error && (
          <p
            className="text-xs px-3 py-2 rounded-lg"
            style={{
              background: "rgba(239,68,68,0.08)",
              color: "#ef4444",
              border: "1px solid rgba(239,68,68,0.2)",
            }}
          >
            {error}
          </p>
        )}
        {success && (
          <p
            className="text-xs px-3 py-2 rounded-lg"
            style={{
              background: "rgba(34,197,94,0.08)",
              color: "#22c55e",
              border: "1px solid rgba(34,197,94,0.2)",
            }}
          >
            {success}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-3">
        <h3 className="text-xs font-bold uppercase tracking-widest text-tertiary">
          Contas conectadas ({localAccounts.length})
        </h3>
        {localAccounts.length === 0 && (
          <p className="text-[11px] text-tertiary py-4 text-center">
            Nenhuma conta conectada ainda.
          </p>
        )}
        {localAccounts.map((acc) => (
          <XAccountCard
            key={acc.id}
            id={acc.id}
            username={acc.x_username}
            name={acc.x_name}
            avatarUrl={acc.x_avatar_url}
            onDisconnect={handleDisconnect}
          />
        ))}
      </div>

      <div
        className="rounded-xl p-4 flex items-start gap-3"
        style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <span className="material-symbols-outlined text-[16px] shrink-0 mt-0.5" style={{ color: "#e9c349" }}>
          info
        </span>
        <p className="text-[11px] text-tertiary leading-relaxed">
          Precisamos da permissão <strong className="text-on-surface">tweet.write</strong> para publicar
          em seu nome. Você pode revogar o acesso em Configurações do X &gt; Aplicativos.
        </p>
      </div>
    </div>
  );
}
