import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Protocolos" };
export const revalidate = 3600;

const PROTOCOL_ICONS: Record<string, string> = {
  clasho: "sports_esports",
  kreators: "auto_awesome",
  magverse: "view_in_ar",
  rally: "rocket_launch",
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
            <a
              key={p.id}
              href={p.website_url ?? "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="group p-[1px] rounded-xl bg-gradient-to-br from-[rgba(233,195,73,0.15)] to-transparent hover:from-[rgba(255,181,154,0.22)] transition-all duration-300 block"
            >
              <div className="bg-[rgba(42,42,42,0.7)] backdrop-blur-xl rounded-[calc(0.75rem-1px)] p-6 flex flex-col gap-4 hover:shadow-[inset_0_0_15px_rgba(255,92,0,0.08),0_0_30px_rgba(255,92,0,0.1)] transition-all duration-300 h-full">
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
                  {p.category && (
                    <p className="text-[10px] font-bold uppercase tracking-widest text-tertiary mt-1">
                      {p.category}
                    </p>
                  )}
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
          );
        })}
      </div>

      {/* Empty state */}
      {(protocols ?? []).length === 0 && (
        <div className="p-[1px] rounded-xl bg-gradient-to-br from-[rgba(91,65,55,0.3)] to-transparent">
          <div className="bg-surface-container-highest/60 backdrop-blur-xl rounded-[calc(0.75rem-1px)] p-16 text-center">
            <span className="material-symbols-outlined text-[48px] text-tertiary block mb-4">
              description
            </span>
            <p className="text-sm text-tertiary">Nenhum protocolo disponível no momento.</p>
          </div>
        </div>
      )}
    </div>
  );
}
