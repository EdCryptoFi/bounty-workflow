import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  let body: { accountId?: unknown };
  try {
    body = await request.json();
  } catch {
    body = {};
  }

  const accountId = typeof body.accountId === "string" ? body.accountId : null;

  const query = supabase.from("user_x_accounts").delete().eq("user_id", user.id);
  if (accountId) {
    query.eq("id", accountId);
  }

  const { error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
