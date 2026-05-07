import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { ReferralsList } from "./referrals-client";

export const metadata: Metadata = { title: "Referrals" };

export default async function ReferralsPage() {
  const supabase = await createClient();

  const [{ data: protocols }, { data: referrals }] = await Promise.all([
    supabase
      .from("protocols")
      .select("id, name, logo_url, website_url")
      .eq("is_active", true)
      .order("name"),
    supabase
      .from("referrals")
      .select("id, url, label, protocol_id, created_at, protocol:protocols(id, name, logo_url, website_url)")
      .order("created_at", { ascending: false }),
  ]);

  return (
    <div className="max-w-[1200px] mx-auto flex flex-col gap-8">
      {/* Header */}
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-[#ff5c00] mb-1">
          Meus Links
        </p>
        <h1 className="font-display text-[30px] font-semibold tracking-tight text-on-surface leading-tight">
          Referrals
        </h1>
        <p className="text-sm text-tertiary mt-1">
          Seus links de indicação salvos por protocolo. Copie e compartilhe a qualquer momento.
        </p>
      </div>

      <ReferralsList
        referrals={(referrals ?? []) as unknown as Parameters<typeof ReferralsList>[0]["referrals"]}
        protocols={protocols ?? []}
      />
    </div>
  );
}
