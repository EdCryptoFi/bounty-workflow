"use client";

import { useState } from "react";

type XAccountCardProps = {
  id: string;
  username: string;
  name: string | null;
  avatarUrl: string | null;
  onDisconnect: (id: string) => Promise<void>;
};

export function XAccountCard({
  id,
  username,
  name,
  avatarUrl,
  onDisconnect,
}: XAccountCardProps) {
  const [disconnecting, setDisconnecting] = useState(false);

  async function handleDisconnect() {
    if (!confirm(`Desconectar @${username}?`)) return;
    setDisconnecting(true);
    try {
      await onDisconnect(id);
    } finally {
      setDisconnecting(false);
    }
  }

  return (
    <div
      className="flex items-center gap-4 rounded-xl p-4"
      style={{
        background: "rgba(24,23,23,0.9)",
        border: "1px solid rgba(255,92,0,0.14)",
      }}
    >
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt={username}
          className="h-10 w-10 shrink-0 rounded-full object-cover border border-[#ff5c00]/30"
        />
      ) : (
        <span
          className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-sm font-bold"
          style={{
            background: "rgba(255,92,0,0.15)",
            border: "1px solid rgba(255,92,0,0.3)",
            color: "#ffb59a",
          }}
        >
          {username[0]?.toUpperCase() ?? "X"}
        </span>
      )}

      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-on-surface truncate">
          {name ?? username}
        </p>
        <p className="text-[11px] text-tertiary">@{username}</p>
      </div>

      <button
        type="button"
        onClick={handleDisconnect}
        disabled={disconnecting}
        className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest px-3 py-2 rounded-lg transition-all hover:opacity-80 disabled:opacity-50"
        style={{
          background: "rgba(239,68,68,0.1)",
          color: "#ef4444",
          border: "1px solid rgba(239,68,68,0.2)",
        }}
      >
        <span className="material-symbols-outlined text-[14px]">link_off</span>
        {disconnecting ? "..." : "Desconectar"}
      </button>
    </div>
  );
}
