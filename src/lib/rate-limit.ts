/**
 * In-memory sliding-window rate limiter.
 *
 * Works within a single serverless instance. For multi-instance coordination
 * (production at scale), replace the store with Upstash Redis or Vercel KV.
 *
 * Usage:
 *   const result = rateLimit(`ip:${ip}`, 60, 60_000); // 60 req/min
 *   if (!result.ok) return new Response("Too Many Requests", { status: 429, headers: { "Retry-After": String(Math.ceil(result.retryAfterMs / 1000)) } });
 */

type Entry = { count: number; reset: number };

const store = new Map<string, Entry>();
let cleanupTick = 0;

function pruneExpired() {
  if (++cleanupTick % 200 !== 0) return;
  const now = Date.now();
  for (const [k, v] of store) {
    if (now > v.reset) store.delete(k);
  }
}

export type RateLimitOk = { ok: true; remaining: number; reset: number };
export type RateLimitDenied = { ok: false; retryAfterMs: number; reset: number };
export type RateLimitResult = RateLimitOk | RateLimitDenied;

/**
 * @param key     Unique bucket key — e.g. `ip:1.2.3.4` or `user:uuid`
 * @param limit   Max requests allowed in the window
 * @param windowMs Window size in milliseconds
 */
export function rateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  pruneExpired();
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now > entry.reset) {
    const reset = now + windowMs;
    store.set(key, { count: 1, reset });
    return { ok: true, remaining: limit - 1, reset };
  }

  if (entry.count >= limit) {
    return { ok: false, retryAfterMs: entry.reset - now, reset: entry.reset };
  }

  entry.count++;
  return { ok: true, remaining: limit - entry.count, reset: entry.reset };
}

/** Extract client IP from a Next.js/Edge Request, respecting Vercel proxy headers. */
export function getClientIp(request: { headers: { get(name: string): string | null } }): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown"
  );
}

/** Build a standard 429 Response with Retry-After header. */
export function tooManyRequests(retryAfterMs: number): Response {
  return new Response(
    JSON.stringify({ error: "Too many requests. Please slow down.", code: "rate_limited" }),
    {
      status: 429,
      headers: {
        "Content-Type": "application/json",
        "Retry-After": String(Math.ceil(retryAfterMs / 1000)),
      },
    },
  );
}
