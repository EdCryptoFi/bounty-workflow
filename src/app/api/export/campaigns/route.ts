import { NextResponse, type NextRequest } from "next/server";
import { requireUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { toCsv } from "@/lib/export/csv";
import { rateLimit, tooManyRequests } from "@/lib/rate-limit";
import { log } from "@/lib/logger";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const VALID_SCOPES = ["all", "active", "archived"] as const;
type Scope = (typeof VALID_SCOPES)[number];

/**
 * GET /api/export/campaigns[?scope=archived|all|active]
 *
 * Exporta as campanhas do usuário como CSV com escape anti-fórmula (A4).
 * RLS garante que só as campanhas do próprio usuário vêm.
 * Rate limited: 10 exports per hour per user.
 */
export async function GET(request: NextRequest) {
  const { user } = await requireUser();

  const limit = rateLimit(`export:${user.id}`, 10, 60 * 60_000);
  if (!limit.ok) return tooManyRequests(limit.retryAfterMs);

  const rawScope = request.nextUrl.searchParams.get("scope") ?? "all";
  const scope: Scope = (VALID_SCOPES as readonly string[]).includes(rawScope)
    ? (rawScope as Scope)
    : "all";

  const supabase = await createClient();

  let query = supabase
    .from("campaigns")
    .select(
      `id, title, description, status, deadline, estimated_value_brl,
       archived_at, created_at, updated_at,
       protocol:protocols(name, slug)`,
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(2000);

  if (scope === "archived") {
    query = query.not("archived_at", "is", null);
  } else if (scope === "active") {
    query = query.is("archived_at", null);
  }

  const { data, error } = await query;
  if (error) {
    log.error("[export/campaigns] query error", error, { userId: user.id, scope });
    return NextResponse.json({ error: "Falha ao exportar campanhas." }, { status: 500 });
  }

  const header = [
    "id",
    "title",
    "description",
    "status",
    "deadline",
    "estimated_value_usd",
    "protocol",
    "archived_at",
    "created_at",
    "updated_at",
  ];

  const rows = (data ?? []).map((c) => {
    const protocol = Array.isArray(c.protocol) ? c.protocol[0] : c.protocol;
    return [
      c.id,
      c.title,
      c.description,
      c.status,
      c.deadline,
      c.estimated_value_brl,
      protocol?.name ?? "",
      c.archived_at,
      c.created_at,
      c.updated_at,
    ];
  });

  const csv = toCsv(header, rows);
  const ts = new Date().toISOString().slice(0, 10);
  const filename = `bountyworkflow-${scope}-${ts}.csv`;

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
