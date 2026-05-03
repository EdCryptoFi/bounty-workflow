import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * GET /api/health — ping básico pra uptime checks (UptimeRobot, BetterStack).
 * Retorna 200 com info de versão.
 */
export async function GET() {
  return NextResponse.json({
    ok: true,
    service: "bounty-workflow",
    env: process.env.VERCEL_ENV ?? process.env.NODE_ENV ?? "development",
    commit: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ?? null,
    ts: new Date().toISOString(),
  });
}
