import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/server";
import { toCsv } from "@/lib/export/csv";
import { log } from "@/lib/logger";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("waitlist_subscribers")
    .select("name, email, twitter_handle, referral_source, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    log.error("[export/waitlist] query error", error);
    return NextResponse.json({ error: "Falha ao exportar lista." }, { status: 500 });
  }

  const header = ["name", "email", "twitter_handle", "referral_source", "created_at"];
  const rows = (data ?? []).map((s) => [
    s.name,
    s.email,
    s.twitter_handle ?? "",
    s.referral_source ?? "",
    s.created_at,
  ]);

  const csv = toCsv(header, rows);
  const ts = new Date().toISOString().slice(0, 10);
  const filename = `bountyworkflow-waitlist-${ts}.csv`;

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
