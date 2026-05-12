import { type NextRequest, NextResponse } from "next/server";
import { rateLimit, getClientIp, tooManyRequests } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * GET /api/health — ping básico pra uptime checks (UptimeRobot, BetterStack).
 * Rate limited: 60 req/min per IP to protect against polling abuse.
 */
export async function GET(request: NextRequest) {
  const ip = getClientIp(request);
  const limit = rateLimit(`health:${ip}`, 60, 60_000);
  if (!limit.ok) return tooManyRequests(limit.retryAfterMs);

  return NextResponse.json({
    ok: true,
    service: "bounty-workflow",
    env: process.env.VERCEL_ENV ?? process.env.NODE_ENV ?? "development",
    commit: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ?? null,
    ts: new Date().toISOString(),
  });
}
