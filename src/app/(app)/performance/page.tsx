import type { Metadata } from "next";
import { requireUser } from "@/lib/auth";
import { getCampaignsForPerformance, type CampaignPerf } from "@/lib/campaigns/queries";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = { title: "Performance" };
export const dynamic = "force-dynamic";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatBRL(value: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);
}

function parseBRL(raw: string | null): number {
  const n = parseFloat(raw ?? "0");
  return isFinite(n) && n > 0 ? n : 0;
}

/** Returns the last `n` months as [{ key: "YYYY-MM", label: "Mmm/YY" }, ...] */
function lastNMonths(n: number): { key: string; label: string }[] {
  const result = [];
  const now = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const label = d.toLocaleDateString("pt-BR", { month: "short", year: "2-digit" });
    result.push({ key, label });
  }
  return result;
}

function monthKey(iso: string): string {
  return iso.slice(0, 7); // "YYYY-MM"
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function KpiCard({
  label,
  value,
  sub,
  tone = "default",
}: {
  label: string;
  value: string;
  sub?: string;
  tone?: "default" | "mint";
}) {
  return (
    <Card padding="tight" className="space-y-1">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p
        className={`text-3xl font-bold tracking-tight ${
          tone === "mint" ? "text-mint-700 dark:text-mint-300" : "text-foreground"
        }`}
      >
        {value}
      </p>
      {sub && <p className="text-[11px] text-muted-foreground">{sub}</p>}
    </Card>
  );
}

function EarningsChart({
  months,
  data,
}: {
  months: { key: string; label: string }[];
  data: Record<string, number>;
}) {
  const values = months.map((m) => data[m.key] ?? 0);
  const max = Math.max(...values, 1);
  const maxPx = 128;

  return (
    <div>
      <div className="flex h-32 items-end gap-2">
        {months.map((m, i) => {
          const val = values[i];
          const barPx = Math.round((val / max) * maxPx);
          return (
            <div key={m.key} className="group flex flex-1 flex-col items-center">
              <div
                className="w-full rounded-t bg-mint-500/70 transition-all group-hover:bg-mint-500"
                style={{ height: `${Math.max(barPx, val > 0 ? 6 : 1)}px` }}
              />
            </div>
          );
        })}
      </div>
      <div className="mt-1.5 flex gap-2">
        {months.map((m) => (
          <div key={m.key} className="flex-1 text-center text-[10px] text-muted-foreground">
            {m.label}
          </div>
        ))}
      </div>
    </div>
  );
}

type ProtocolRankEntry = { protocol_name: string; total: number };

function ProtocolRanking({ ranking }: { ranking: ProtocolRankEntry[] }) {
  const top = ranking.slice(0, 5);
  const others = ranking.slice(5).reduce((acc, r) => acc + r.total, 0);

  const GRADIENT_COLORS = [
    "from-purple-500 to-pink-500",
    "from-amber-500 to-orange-500",
    "from-sky-500 to-indigo-500",
    "from-emerald-500 to-teal-500",
    "from-rose-500 to-red-500",
  ];

  return (
    <ul className="mt-3 space-y-3">
      {top.map((r, i) => (
        <li key={r.protocol_name} className="flex items-center gap-2 text-sm">
          <span className="w-4 text-xs text-muted-foreground">{i + 1}</span>
          <div
            className={`grid h-5 w-5 shrink-0 place-items-center rounded bg-gradient-to-br ${GRADIENT_COLORS[i % GRADIENT_COLORS.length]} text-[10px] font-bold text-white`}
          >
            {r.protocol_name[0].toUpperCase()}
          </div>
          <span className="min-w-0 flex-1 truncate">{r.protocol_name}</span>
          <span className="font-semibold text-mint-700 dark:text-mint-300">
            {formatBRL(r.total)}
          </span>
        </li>
      ))}
      {others > 0 && (
        <li className="flex items-center gap-2 text-sm opacity-50">
          <span className="w-4 text-xs text-muted-foreground">{top.length + 1}</span>
          <div className="grid h-5 w-5 shrink-0 place-items-center rounded bg-muted text-[10px] font-bold">
            +
          </div>
          <span className="flex-1">outros</span>
          <span className="text-muted-foreground">{formatBRL(others)}</span>
        </li>
      )}
      {ranking.length === 0 && (
        <li className="text-xs text-muted-foreground">Nenhum protocolo com valor registrado.</li>
      )}
    </ul>
  );
}

function CampaignRow({ c }: { c: CampaignPerf }) {
  const value = parseBRL(c.estimated_value_brl);
  const isWon = value > 0;
  const isActive = !c.archived_at && c.status !== "completed";

  const closedAt = c.archived_at ?? (c.status === "completed" ? c.deadline : null);
  const closedLabel = closedAt
    ? new Date(closedAt).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })
    : "Em andamento";

  return (
    <tr className="border-b border-border last:border-0">
      <td className="px-4 py-3 font-medium">{c.title}</td>
      <td className="px-4 py-3 text-sm text-muted-foreground">{c.protocol_name ?? "—"}</td>
      <td className="px-4 py-3 text-sm text-muted-foreground">{closedLabel}</td>
      <td className="px-4 py-3 text-right">
        {isActive ? (
          <Badge tone="neutral" size="xs">
            em andamento
          </Badge>
        ) : isWon ? (
          <Badge tone="mint" size="xs">
            vencedor
          </Badge>
        ) : (
          <Badge tone="neutral" size="xs">
            não vencedor
          </Badge>
        )}
      </td>
      <td className="px-4 py-3 text-right text-sm">
        {isWon ? (
          <span className="font-semibold text-mint-700 dark:text-mint-300">
            {formatBRL(value)}
          </span>
        ) : (
          <span className="text-muted-foreground">—</span>
        )}
      </td>
    </tr>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function PerformancePage() {
  await requireUser();
  const campaigns = await getCampaignsForPerformance();

  // KPIs
  const total = campaigns.length;
  const totalEarned = campaigns.reduce((acc, c) => acc + parseBRL(c.estimated_value_brl), 0);
  const wonCount = campaigns.filter((c) => parseBRL(c.estimated_value_brl) > 0).length;
  const winRate = total === 0 ? 0 : Math.round((wonCount / total) * 100);
  const biggest = Math.max(...campaigns.map((c) => parseBRL(c.estimated_value_brl)), 0);

  // Chart: earnings by month (last 6 months)
  const months = lastNMonths(6);
  const earningsByMonth: Record<string, number> = {};
  for (const c of campaigns) {
    const key = monthKey(c.created_at);
    if (earningsByMonth[key] === undefined) earningsByMonth[key] = 0;
    earningsByMonth[key] += parseBRL(c.estimated_value_brl);
  }

  // Protocol ranking
  const rankMap = new Map<string, number>();
  for (const c of campaigns) {
    if (!c.protocol_name) continue;
    rankMap.set(c.protocol_name, (rankMap.get(c.protocol_name) ?? 0) + parseBRL(c.estimated_value_brl));
  }
  const ranking: ProtocolRankEntry[] = [...rankMap.entries()]
    .map(([protocol_name, total]) => ({ protocol_name, total }))
    .filter((r) => r.total > 0)
    .sort((a, b) => b.total - a.total);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Performance</h1>
        <p className="text-sm text-muted-foreground">
          Ganhos, taxa de vitória e ranking de campanhas.
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <KpiCard label="Campanhas" value={String(total)} sub="total cadastradas" />
        <KpiCard
          label="Total estimado"
          value={totalEarned > 0 ? formatBRL(totalEarned) : "—"}
          sub="soma das campanhas vencedoras"
          tone="mint"
        />
        <KpiCard
          label="Taxa de vitória"
          value={total === 0 ? "—" : `${winRate}%`}
          sub={total > 0 ? `${wonCount} de ${total}` : undefined}
        />
        <KpiCard
          label="Maior prêmio"
          value={biggest > 0 ? formatBRL(biggest) : "—"}
          sub="campanha de maior valor"
          tone={biggest > 0 ? "mint" : "default"}
        />
      </div>

      {/* Chart + Ranking */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card padding="tight" className="lg:col-span-2">
          <p className="font-semibold">Valor estimado por mês</p>
          <p className="mb-4 text-xs text-muted-foreground">Últimos 6 meses — agrupado por data de criação</p>
          <EarningsChart months={months} data={earningsByMonth} />
        </Card>

        <Card padding="tight">
          <p className="font-semibold">Ranking por protocolo</p>
          <p className="text-xs text-muted-foreground">Maior valor estimado acumulado</p>
          <ProtocolRanking ranking={ranking} />
        </Card>
      </div>

      {/* Campaigns table */}
      <Card padding="tight">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="font-semibold">Campanhas</p>
            <p className="text-xs text-muted-foreground">
              Histórico completo · {total} {total === 1 ? "campanha" : "campanhas"}
            </p>
          </div>
        </div>

        {campaigns.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            Nenhuma campanha cadastrada ainda.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-xs text-muted-foreground">
                  <th className="px-4 py-2 text-left font-medium">Campanha</th>
                  <th className="px-4 py-2 text-left font-medium">Protocolo</th>
                  <th className="px-4 py-2 text-left font-medium">Encerrada</th>
                  <th className="px-4 py-2 text-right font-medium">Resultado</th>
                  <th className="px-4 py-2 text-right font-medium">Valor</th>
                </tr>
              </thead>
              <tbody>
                {campaigns.map((c) => (
                  <CampaignRow key={c.id} c={c} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
