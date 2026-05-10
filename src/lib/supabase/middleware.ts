import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Refresh de sessão em cada request. Obrigatório pro Supabase SSR.
 * Rodado via src/proxy.ts — NUNCA remover.
 */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options });
          response = NextResponse.next({ request });
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: "", ...options });
          response = NextResponse.next({ request });
          response.cookies.set({ name, value: "", ...options });
        },
      },
    },
  );

  // Trigger refresh — se expirado, seta novos cookies
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  // Expose pathname to server components via header
  response.headers.set("x-pathname", pathname);

  // Proteção de rotas do grupo (app)
  const isAppRoute =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/campaigns") ||
    pathname.startsWith("/reminders") ||
    pathname.startsWith("/archive") ||
    pathname.startsWith("/settings") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/protocols") ||
    pathname === "/subscribe";

  if (isAppRoute && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  // Se já autenticado e tentando ver /auth/login, manda pra dashboard (ou /admin)
  if ((pathname === "/auth/login" || pathname === "/auth/signup") && user) {
    const url = request.nextUrl.clone();
    url.pathname = user.email === "bountyworkflow@proton.me" ? "/admin" : "/dashboard";
    return NextResponse.redirect(url);
  }

  return response;
}
