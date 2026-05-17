import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateAuthUrl } from "@/lib/x-api/oauth";
import { rateLimit, tooManyRequests } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const limit = rateLimit(`x-auth-url:${user.id}`, 5, 60_000);
  if (!limit.ok) return tooManyRequests(limit.retryAfterMs);

  try {
    const { url } = await generateAuthUrl(user.id);
    return NextResponse.json({ url });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erro ao gerar URL de autenticação";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
