import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { rateLimit, tooManyRequests } from "@/lib/rate-limit";
import { postTweet } from "@/lib/x-api/client";
import { refreshAccessToken } from "@/lib/x-api/oauth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const limit = rateLimit(`x-publish:${user.id}`, 10, 60_000);
  if (!limit.ok) return tooManyRequests(limit.retryAfterMs);

  let body: { text?: unknown; accountId?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Corpo inválido" }, { status: 400 });
  }

  const text = typeof body.text === "string" ? body.text.trim() : "";
  if (!text || text.length < 2) {
    return NextResponse.json({ error: "Texto muito curto" }, { status: 400 });
  }
  if (text.length > 280) {
    return NextResponse.json(
      { error: "Texto muito longo (máx 280 caracteres)" },
      { status: 400 },
    );
  }

  let accountId = typeof body.accountId === "string" ? body.accountId : null;

  const query = supabase
    .from("user_x_accounts")
    .select("*")
    .eq("user_id", user.id)
    .eq("is_active", true);

  if (accountId) {
    query.eq("id", accountId);
  }

  const { data: accounts, error: fetchError } = await query.limit(1);

  if (fetchError || !accounts || accounts.length === 0) {
    return NextResponse.json(
      { error: "Nenhuma conta X conectada. Conecte uma conta em Configurações > X." },
      { status: 400 },
    );
  }

  const account = accounts[0];

  async function attemptPost(token: string): Promise<ReturnType<typeof postTweet>> {
    return postTweet(token, text);
  }

  try {
    try {
      const result = await attemptPost(account.access_token);
      return NextResponse.json({
        tweet: result.data,
        account: { username: account.x_username },
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "";
      if (message.includes("401") && account.refresh_token) {
        const refreshed = await refreshAccessToken(account.refresh_token);
        const newExpiresAt = refreshed.expires_in
          ? new Date(Date.now() + refreshed.expires_in * 1000).toISOString()
          : null;

        await supabase
          .from("user_x_accounts")
          .update({
            access_token: refreshed.access_token,
            refresh_token: refreshed.refresh_token ?? account.refresh_token,
            token_expires_at: newExpiresAt,
          })
          .eq("id", account.id);

        const result = await attemptPost(refreshed.access_token);
        return NextResponse.json({
          tweet: result.data,
          account: { username: account.x_username },
        });
      }
      throw err;
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erro ao publicar";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
