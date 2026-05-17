import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { exchangeCode } from "@/lib/x-api/oauth";
import { getXUserInfo } from "@/lib/x-api/client";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state");
  const error = request.nextUrl.searchParams.get("error");

  if (error) {
    return NextResponse.redirect(
      new URL("/settings?x_error=" + encodeURIComponent(error), request.url),
    );
  }

  if (!code || !state) {
    return NextResponse.redirect(
      new URL("/settings?x_error=Parâmetros+ausentes", request.url),
    );
  }

  const supabase = await createClient();

  const { data: pending, error: lookupError } = await supabase
    .from("oauth_states")
    .select("*")
    .eq("state", state)
    .maybeSingle();

  if (lookupError || !pending) {
    return NextResponse.redirect(
      new URL("/settings?x_error=Estado+inválido+ou+expirado", request.url),
    );
  }

  if (new Date(pending.expires_at) < new Date()) {
    await supabase.from("oauth_states").delete().eq("id", pending.id);
    return NextResponse.redirect(
      new URL("/settings?x_error=Link+expirado,+tente+novamente", request.url),
    );
  }

  try {
    const tokens = await exchangeCode(code, pending.code_verifier);
    const xUser = await getXUserInfo(tokens.access_token);

    const tokenExpiresAt = tokens.expires_in
      ? new Date(Date.now() + tokens.expires_in * 1000).toISOString()
      : null;

    await supabase.from("user_x_accounts").upsert(
      {
        user_id: pending.user_id,
        x_user_id: xUser.data.id,
        x_username: xUser.data.username,
        x_name: xUser.data.name,
        x_avatar_url: xUser.data.profile_image_url ?? null,
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token ?? null,
        token_expires_at: tokenExpiresAt,
        is_active: true,
      },
      { onConflict: "user_id, x_user_id" },
    );

    await supabase.from("oauth_states").delete().eq("id", pending.id);

    return NextResponse.redirect(
      new URL("/settings?x_success=" + encodeURIComponent(xUser.data.username), request.url),
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erro desconhecido";
    await supabase.from("oauth_states").delete().eq("id", pending.id);
    return NextResponse.redirect(
      new URL("/settings?x_error=" + encodeURIComponent(message), request.url),
    );
  }
}
