import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function POST() {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const supabase = createAdminClient();

  const { data: current } = await supabase
    .from("app_config")
    .select("value")
    .eq("key", "launch_mode")
    .single();

  const nextValue = current?.value === true ? false : true;

  const { error } = await supabase
    .from("app_config")
    .upsert({ key: "launch_mode", value: nextValue, updated_at: new Date().toISOString() });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ launch_open: nextValue });
}
