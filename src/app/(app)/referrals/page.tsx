import type { Metadata } from "next";
import Link from "next/link";
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
      <div className="flex items-end justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#ff5c00] mb-1">
            Programa de Indicação
          </p>
          <h1 className="font-display text-[30px] font-semibold tracking-tight text-on-surface leading-tight">
            Referrals
          </h1>
          <p className="text-sm text-tertiary mt-1">
            Seus links de indicação salvos por protocolo. Copie e compartilhe a qualquer momento.
          </p>
        </div>
        <Link
          href="/referrals/points"
          className="flex items-center gap-2 px-4 py-2.5 rounded border border-[rgba(255,92,0,0.3)] text-[#ffb59a] text-xs font-bold uppercase tracking-widest hover:bg-[rgba(255,92,0,0.08)] transition-all"
        >
          <span className="material-symbols-outlined text-[16px]">emoji_events</span>
          Meus Pontos
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 px-1 py-1 rounded-full" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", width: "fit-content" }}>
        <span className="px-5 py-2 rounded-full bg-[#ff5c00] text-white text-xs font-bold uppercase tracking-widest">
          Links Salvos
        </span>
        <Link
          href="/referrals/points"
          className="px-5 py-2 rounded-full text-tertiary text-xs font-bold uppercase tracking-widest hover:text-[#ffb59a] transition-colors"
        >
          Pontos
        </Link>
      </div>

      <ReferralsList
        referrals={(referrals ?? []) as unknown as Parameters<typeof ReferralsList>[0]["referrals"]}
        protocols={protocols ?? []}
      />
    </div>
  );
}
