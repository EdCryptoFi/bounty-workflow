"use client";

export type AttachmentRow = {
  id: string;
  path: string;
  type: string;
  size_bytes: number | null;
  uploaded_at: string;
  campaign_id: string | null;
  campaign_title: string | null;
};

const TYPE_LABELS: Record<string, string> = {
  image: "Imagens",
  pdf: "PDF",
  link: "Links",
  other: "Outros",
};

const TYPE_COLORS: Record<string, string> = {
  image: "#ff5c00",
  pdf: "#e9c349",
  link: "#ffb59a",
  other: "#6b7280",
};

const QUOTA_BYTES = 5 * 1024 * 1024 * 1024;

function fmtBytes(b: number): string {
  if (b >= 1024 ** 3) return `${(b / 1024 ** 3).toFixed(1)} GB`;
  if (b >= 1024 ** 2) return `${(b / 1024 ** 2).toFixed(1)} MB`;
  if (b >= 1024) return `${(b / 1024).toFixed(1)} KB`;
  return `${b} B`;
}

export function DrivePanel({ attachments }: { attachments: AttachmentRow[] }) {
  const totalUsed = attachments.reduce((s, a) => s + (a.size_bytes ?? 0), 0);
  const usedPct = Math.min(100, Math.round((totalUsed / QUOTA_BYTES) * 100));
  const available = Math.max(0, QUOTA_BYTES - totalUsed);
  const health = usedPct < 70 ? "OPTIMAL" : usedPct < 90 ? "WARNING" : "CRITICAL";
  const healthColor =
    health === "OPTIMAL" ? "text-[#e9c349]" : health === "WARNING" ? "text-amber-400" : "text-red-400";

  const byType = (["image", "pdf", "link", "other"] as const).map((t) => ({
    type: t,
    total: attachments.filter((a) => a.type === t).reduce((s, a) => s + (a.size_bytes ?? 0), 0),
    count: attachments.filter((a) => a.type === t).length,
  }));

  const byCampaign = new Map<string, AttachmentRow[]>();
  for (const a of attachments) {
    const key = a.campaign_id ?? "__none__";
    if (!byCampaign.has(key)) byCampaign.set(key, []);
    byCampaign.get(key)!.push(a);
  }
  const partitions = Array.from(byCampaign.entries()).map(([key, files]) => {
    const title =
      files[0]?.campaign_title ??
      (key !== "__none__" ? key.slice(0, 8) : "general");
    const size = files.reduce((s, f) => s + (f.size_bytes ?? 0), 0);
    const lastSync = [...files].sort((a, b) =>
      b.uploaded_at.localeCompare(a.uploaded_at),
    )[0]?.uploaded_at;
    return { key, title, size, count: files.length, lastSync };
  });

  // SVG donut
  const R = 54;
  const C = 2 * Math.PI * R;
  const dashOffset = C - (usedPct / 100) * C;

  return (
    <div className="flex flex-col gap-6">
      {/* Status bar */}
      <div className="flex items-center gap-3 px-4 py-2.5 bg-[rgba(14,14,14,0.6)] border border-outline-variant/30 rounded-lg">
        <span className="w-2 h-2 rounded-full bg-[#e9c349] shadow-[0_0_8px_#e9c349]" />
        <span className="text-[10px] font-bold uppercase tracking-widest text-tertiary">
          Drive Kernel Online
        </span>
        <span className="text-tertiary opacity-30">{'//'}</span>
        <span className="text-[10px] font-bold uppercase tracking-widest text-tertiary">
          Node_Storage_Active
        </span>
        {usedPct > 70 && (
          <span className="ml-auto px-2 py-0.5 rounded-full bg-[#ff5c00]/15 border border-[#ff5c00]/30 text-[9px] font-bold uppercase tracking-widest text-[#ff5c00]">
            {usedPct}% Alocado
          </span>
        )}
      </div>

      {/* Top row: Telemetry + Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Storage Telemetry */}
        <div className="lg:col-span-2 bg-[rgba(42,42,42,0.7)] backdrop-blur-xl border border-outline-variant/50 rounded-xl p-6 shadow-[inset_0_0_20px_rgba(255,92,0,0.03)]">
          <h3 className="text-sm font-semibold text-on-surface mb-5 flex items-center gap-2">
            <span className="material-symbols-outlined text-[#e9c349] text-[16px]">storage</span>
            Storage Telemetry
          </h3>
          <div className="flex items-center gap-8 flex-wrap">
            {/* Donut */}
            <div className="relative shrink-0">
              <svg width="130" height="130" viewBox="0 0 130 130">
                <circle
                  cx="65" cy="65" r={R}
                  fill="none"
                  stroke="rgba(255,255,255,0.04)"
                  strokeWidth="14"
                />
                <circle
                  cx="65" cy="65" r={R}
                  fill="none"
                  stroke="#ff5c00"
                  strokeWidth="14"
                  strokeDasharray={C}
                  strokeDashoffset={dashOffset}
                  strokeLinecap="round"
                  transform="rotate(-90 65 65)"
                  style={{ filter: "drop-shadow(0 0 8px rgba(255,92,0,0.6))", transition: "stroke-dashoffset 0.8s ease" }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-base font-bold text-on-surface">{fmtBytes(totalUsed)}</span>
                <span className="text-[9px] font-bold uppercase tracking-widest text-tertiary">usado</span>
              </div>
            </div>

            {/* Stats */}
            <div className="flex flex-col gap-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-tertiary">
                  Capacidade Total
                </p>
                <p className="text-xl font-bold text-on-surface mt-0.5">{fmtBytes(QUOTA_BYTES)}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-tertiary">
                  Disponível
                </p>
                <p className="text-xl font-bold text-[#e9c349] mt-0.5">{fmtBytes(available)}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-tertiary">
                  Drive Health
                </p>
                <p className={`text-sm font-bold mt-0.5 ${healthColor}`}>{health}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Volume Distribution */}
        <div className="bg-[rgba(42,42,42,0.7)] backdrop-blur-xl border border-outline-variant/50 rounded-xl p-6 shadow-[inset_0_0_20px_rgba(255,92,0,0.03)]">
          <h3 className="text-sm font-semibold text-on-surface mb-5 flex items-center gap-2">
            <span className="material-symbols-outlined text-[#e9c349] text-[16px]">pie_chart</span>
            Distribuição
          </h3>
          {byType.some((t) => t.total > 0) ? (
            <div className="flex flex-col gap-4">
              {byType
                .filter((t) => t.total > 0)
                .map(({ type, total, count }) => {
                  const pct = totalUsed > 0 ? Math.round((total / totalUsed) * 100) : 0;
                  return (
                    <div key={type}>
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-tertiary">
                          {TYPE_LABELS[type]}
                        </span>
                        <span className="text-[10px] font-bold text-on-surface">
                          {fmtBytes(total)}
                        </span>
                      </div>
                      <div className="h-1.5 bg-surface-container-high/40 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{
                            width: `${pct}%`,
                            backgroundColor: TYPE_COLORS[type],
                            boxShadow: `0 0 6px ${TYPE_COLORS[type]}60`,
                          }}
                        />
                      </div>
                      <p className="text-[9px] text-tertiary mt-0.5">{count} arquivo{count !== 1 ? "s" : ""}</p>
                    </div>
                  );
                })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-32 text-center">
              <span className="material-symbols-outlined text-[32px] text-tertiary">pie_chart</span>
              <p className="text-[10px] text-tertiary font-bold uppercase tracking-widest mt-2">
                Sem dados
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Secure Partitions */}
      <div className="bg-[rgba(42,42,42,0.7)] backdrop-blur-xl border border-outline-variant/50 rounded-xl p-6 shadow-[inset_0_0_20px_rgba(255,92,0,0.03)]">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-sm font-semibold text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-[#e9c349] text-[16px]">folder_special</span>
            Partições Seguras
          </h3>
          <span className="text-[10px] font-bold uppercase tracking-widest text-tertiary">
            {attachments.length} arquivo{attachments.length !== 1 ? "s" : ""}
          </span>
        </div>

        {partitions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-[10px] font-bold uppercase tracking-widest text-tertiary border-b border-outline-variant/30">
                  <th className="text-left pb-2 pr-6">Directory_ID</th>
                  <th className="text-left pb-2 pr-6">Arquivos</th>
                  <th className="text-right pb-2 pr-6">Tamanho</th>
                  <th className="text-right pb-2">Última Sync</th>
                </tr>
              </thead>
              <tbody>
                {partitions.map((p) => (
                  <tr
                    key={p.key}
                    className="border-b border-outline-variant/10 hover:bg-surface-container/20 transition"
                  >
                    <td className="py-3 pr-6 font-mono text-[#ffb59a] text-[11px] truncate max-w-[200px]">
                      /mrr/{p.title.toLowerCase().replace(/[\s-]+/g, "_").slice(0, 24)}
                    </td>
                    <td className="py-3 pr-6 text-tertiary">{p.count}</td>
                    <td className="py-3 pr-6 text-right text-on-surface">{fmtBytes(p.size)}</td>
                    <td className="py-3 text-right text-tertiary">
                      {p.lastSync
                        ? new Date(p.lastSync).toLocaleDateString("pt-BR", {
                            day: "2-digit",
                            month: "short",
                            year: "2-digit",
                          })
                        : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <span className="material-symbols-outlined text-[48px] text-tertiary">folder_open</span>
            <p className="text-[10px] text-tertiary font-bold uppercase tracking-widest mt-3">
              Nenhum arquivo no Drive
            </p>
            <p className="text-xs text-tertiary mt-1">
              Faça upload de arquivos nas suas campanhas para vê-los aqui.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
