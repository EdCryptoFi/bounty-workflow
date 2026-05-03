import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Handler de callback OAuth + magic link.
 * Supabase redireciona pra cá com ?code=... (PKCE) e nós trocamos pela sessão.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");
  const errorDescription = searchParams.get("error_description");
  const next = searchParams.get("next") ?? "/dashboard";

  // Valida 'next' pra evitar open redirect
  const safeNext = next.startsWith("/") && !next.startsWith("//") ? next : "/dashboard";

  if (error) {
    const url = new URL("/auth/login", origin);
    url.searchParams.set("error", errorDescription ?? error);
    return NextResponse.redirect(url);
  }

  if (code) {
    const supabase = await createClient();
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
    if (!exchangeError) {
      return NextResponse.redirect(new URL(safeNext, origin));
    }
    const url = new URL("/auth/login", origin);
    url.searchParams.set("error", "Não foi possível completar o login. Tente de novo.");
    return NextResponse.redirect(url);
  }

  return NextResponse.redirect(new URL("/auth/login", origin));
}
