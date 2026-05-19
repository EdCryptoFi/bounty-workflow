import type { Metadata } from "next";
import { createAdminClient } from "@/lib/supabase/server";
import { AdminLancamentoClient } from "./lancamento-client";

export const metadata: Metadata = { title: "Campanha de Lançamento — Admin" };
export const dynamic = "force-dynamic";

export default async function AdminLancamentoPage() {
  const supabase = createAdminClient();

  const [
    { data: subscribers },
    { count: totalCount },
    { data: recentSubscribers },
    { data: referralStats },
    { data: emailStats },
    { data: launchConfig },
  ] = await Promise.all([
    supabase
      .from("waitlist_subscribers")
      .select("id, name, email, twitter_handle, referral_source, created_at")
      .order("created_at", { ascending: false }),
    supabase
      .from("waitlist_subscribers")
      .select("*", { count: "exact", head: true }),
    supabase
      .from("waitlist_subscribers")
      .select("name, email, twitter_handle, created_at")
      .order("created_at", { ascending: false })
      .limit(10),
    supabase
      .from("referral_clicks")
      .select("id, converted"),
    supabase
      .from("email_queue")
      .select("id, to_email, subject, sent_at, error, scheduled_for, created_at")
      .order("created_at", { ascending: false })
      .limit(100),
    supabase
      .from("app_config")
      .select("value")
      .eq("key", "launch_mode")
      .single(),
  ]);

  const totalClicks = referralStats?.length ?? 0;
  const conversions = referralStats?.filter((c: { converted: boolean }) => c.converted).length ?? 0;
  const sentEmails = emailStats?.filter((e: { sent_at: string | null }) => e.sent_at).length ?? 0;
  const failedEmails = emailStats?.filter((e: { error: string | null }) => e.error).length ?? 0;
  const pendingEmails = (emailStats?.length ?? 0) - sentEmails - failedEmails;
  const launchOpen = launchConfig?.value === true;

  // Compute daily growth from subscribers data
  const growthMap = new Map<string, number>();
  for (const s of subscribers ?? []) {
    const day = new Date(s.created_at).toISOString().slice(0, 10);
    growthMap.set(day, (growthMap.get(day) ?? 0) + 1);
  }
  const growth = Array.from(growthMap.entries())
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date));

  return (
    <AdminLancamentoClient
      subscribers={subscribers ?? []}
      totalCount={totalCount ?? 0}
      recentSubscribers={recentSubscribers ?? []}
      totalClicks={totalClicks}
      conversions={conversions}
      sentEmails={sentEmails}
      failedEmails={failedEmails}
      pendingEmails={pendingEmails}
      launchOpen={launchOpen}
      emailStats={emailStats ?? []}
      dailyGrowth={growth}
    />
  );
}
