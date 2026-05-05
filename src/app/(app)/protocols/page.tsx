import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { GlowCard } from "@/components/ui/glow-card";

export const metadata: Metadata = { title: "Protocolos" };
export const revalidate = 3600;

const PROTOCOL_ICONS: Record<string, string> = {
  clasho: "sports_esports",
  kreators: "auto_awesome",
  magverse: "view_in_ar",
  rally: "rocket_launch",
  zealy: "leaderboard",
  layer3: "layers",
  galxe: "public",
  intract: "hub",
  guild: "shield",
  galxe_quest: "explore",
  questn: "task_alt",
  crew3: "groups",
  crew: "groups",
  rep3: "verified",
  lens: "camera",
  farcaster: "rss_feed",
  mirror: "article",
  twitter: "tag",
  discord: "chat",
  telegram: "send",
  github: "code",
  snapshot: "how_to_vote",
  tally: "how_to_vote",
  commonwealth: "forum",
  dework: "work",
  coordinape: "share",
  wonderverse: "travel_explore",
  layer0: "layers",
  superfluid: "water",
  optimism: "bolt",
  arbitrum: "swap_horiz",
  polygon: "hexagon",
  ethereum: "currency_bitcoin",
  solana: "flash_on",
  aptos: "diamond",
  sui: "water_drop",
  near: "near_me",
  cosmos: "public",
};

export default async function ProtocolsPage() {
  const supabase = await createClient();
  const { data: protocols } = await supabase
    .from("protocols")
    .select("id, slug, name, description, category, website_url")
    .eq("is_active", true)
    .order("name");

  return (
    <div className="max-w-[1200px] mx-auto flex flex-col gap-8">
      {/* Header */}
      <div>
        <h1 className="font-display text-[30px] font-semibold tracking-tight text-on-surface leading-tight">
          Catálogo de Protocolos
        </h1>
        <p className="text-sm text-tertiary mt-1">
          Selecione um protocolo para acessar e iniciar sua missão de bounty.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {(protocols ?? []).map((p) => {
          const icon = PROTOCOL_ICONS[p.slug] ?? "description";
          return (
            <GlowCard key={p.id} className="group block">
              <a
                href={p.website_url ?? "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="block h-full"
              >
              <div className="bg-[rgba(42,42,42,0.7)] backdrop-blur-xl rounded-[11px] p-6 flex flex-col gap-4 h-full">
                {/* Icon */}
                <div className="w-12 h-12 shrink-0 bg-surface-container-highest/50 rounded-xl border border-[rgba(233,195,73,0.2)] flex items-center justify-center group-hover:border-[rgba(255,92,0,0.4)] transition-colors">
                  <span className="material-symbols-outlined text-[#e9c349] text-[22px] group-hover:text-[#ff5c00] transition-colors filled">
                    {icon}
                  </span>
                </div>

                {/* Info */}
                <div className="flex-1">
                  <p className="font-semibold text-on-surface group-hover:text-[#ffb59a] transition-colors text-base">
                    {p.name}
                  </p>
                  {p.description && (
                    <p className="text-xs text-tertiary mt-2 line-clamp-2 leading-relaxed">
                      {p.description}
                    </p>
                  )}
                </div>

                {/* CTA */}
                <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-tertiary group-hover:text-[#ffb59a] transition-colors">
                  <span>Acessar</span>
                  <span className="material-symbols-outlined text-[14px] group-hover:translate-x-0.5 transition-transform">
                    arrow_forward
                  </span>
                </div>
              </div>
              </a>
            </GlowCard>
          );
        })}
      </div>

      {/* Empty state */}
      {(protocols ?? []).length === 0 && (
        <GlowCard>
          <div className="bg-surface-container-highest/60 backdrop-blur-xl rounded-[11px] p-16 text-center">
            <span className="material-symbols-outlined text-[48px] text-tertiary block mb-4">
              description
            </span>
            <p className="text-sm text-tertiary">Nenhum protocolo disponível no momento.</p>
          </div>
        </GlowCard>
      )}
    </div>
  );
}
