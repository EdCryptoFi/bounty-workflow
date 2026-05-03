import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { sendEmail } from "@/lib/email/resend";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * Vercel Cron → roda 1x/dia às 09:00 UTC (vercel.json).
 * (Plano Hobby só permite cron diário — pra 5min precisa do Pro.)
 * Autenticação: Authorization: Bearer $CRON_SECRET.
 *
 * Fluxo:
 * 1. Busca reminders pending com trigger_at <= now (limit 50)
 * 2. Pra cada um, busca email do user e envia
 * 3. Registra notification_log e marca reminder como sent/failed
 *
 * Usa admin client (service_role) pra bypassar RLS — o endpoint é protegido pelo CRON_SECRET.
 */
export async function GET(request: NextRequest) {
  const auth = request.headers.get("authorization");
  const secret = process.env.CRON_SECRET;

  if (!secret) {
    return NextResponse.json({ error: "CRON_SECRET não configurado" }, { status: 500 });
  }
  if (auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const supabase = createAdminClient();
  const now = new Date().toISOString();

  const { data: pending, error } = await supabase
    .from("reminders")
    .select("id, user_id, channel, trigger_at, message, campaign_id")
    .eq("status", "pending")
    .lte("trigger_at", now)
    .order("trigger_at", { ascending: true })
    .limit(50);

  if (error) {
    console.error("[cron/reminders] query error", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!pending || pending.length === 0) {
    return NextResponse.json({ processed: 0 });
  }

  let ok = 0;
  let failed = 0;

  for (const r of pending) {
    try {
      // Só email suportado por enquanto
      if (r.channel !== "email") {
        await supabase
          .from("reminders")
          .update({ status: "sent", sent_at: new Date().toISOString() })
          .eq("id", r.id);
        await supabase.from("notification_logs").insert({
          user_id: r.user_id,
          reminder_id: r.id,
          channel: r.channel,
          status: "skipped_channel_not_implemented",
          payload_json: { trigger_at: r.trigger_at },
        });
        ok += 1;
        continue;
      }

      // Pega email do user via auth.admin (não via public.users pra evitar
      // caso de linha ausente por race)
      const { data: authUser } = await supabase.auth.admin.getUserById(r.user_id);
      const to = authUser?.user?.email;

      if (!to) {
        await supabase
          .from("reminders")
          .update({ status: "failed", error_message: "user email não encontrado" })
          .eq("id", r.id);
        failed += 1;
        continue;
      }

      const subject = r.message?.slice(0, 120) ?? "Lembrete — Bounty WorkFlow";
      const text = [
        r.message ?? "Você tem um lembrete agendado.",
        "",
        "—",
        "Bounty WorkFlow · não responda este email.",
      ].join("\n");

      const send = await sendEmail({ to, subject, text });

      if (send.ok) {
        await supabase
          .from("reminders")
          .update({ status: "sent", sent_at: new Date().toISOString() })
          .eq("id", r.id);
        await supabase.from("notification_logs").insert({
          user_id: r.user_id,
          reminder_id: r.id,
          channel: "email",
          status: "sent",
          payload_json: { subject },
          provider_response_json: { provider: "resend", id: send.id },
        });
        ok += 1;
      } else {
        await supabase
          .from("reminders")
          .update({ status: "failed", error_message: send.error })
          .eq("id", r.id);
        await supabase.from("notification_logs").insert({
          user_id: r.user_id,
          reminder_id: r.id,
          channel: "email",
          status: "failed",
          payload_json: { subject },
          provider_response_json: { error: send.error },
        });
        failed += 1;
      }
    } catch (err) {
      failed += 1;
      const msg = err instanceof Error ? err.message : "erro desconhecido";
      console.error("[cron/reminders] processing error", r.id, msg);
      await supabase
        .from("reminders")
        .update({ status: "failed", error_message: msg })
        .eq("id", r.id);
    }
  }

  return NextResponse.json({ processed: pending.length, ok, failed });
}
