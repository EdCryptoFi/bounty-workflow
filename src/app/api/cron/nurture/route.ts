import { NextResponse, type NextRequest } from "next/server";
import { sendDueNurtureEmails } from "@/lib/email/nurture";
import { log } from "@/lib/logger";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * Cron endpoint para enviar emails de nutrição pendentes.
 * Protegido por CRON_SECRET.
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

  const result = await sendDueNurtureEmails();
  log.info("[cron/nurture] processed", result);

  return NextResponse.json(result);
}
