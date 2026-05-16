import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { GlowCard } from "@/components/ui/glow-card";

export const metadata: Metadata = { title: "Protocolos" };
export const dynamic = "force-dynamic";

function getFavicon(websiteUrl: string | null): string | null {
  if (!websiteUrl) return null;
  try {
    const domain = new URL(websiteUrl).hostname;
    return `https://www.google.com/s2/favicons?sz=128&domain=${domain}`;
  } catch {
    return null;
  }
}

export default async function ProtocolsPage() {
  const supabase = await createClient();
  const { data: protocols } = await supabase
    .from("protocols")
    .select("id, slug, name, website_url, logo_url")
    .eq("is_active", true)
    .neq("slug", "arquivo-pessoal")
    .neq("slug", "generico")
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
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {(protocols ?? []).map((p) => {
          const logo = p.logo_url ?? getFavicon(p.website_url);
          return (
            <GlowCard key={p.id} className="group block">
              <a
                href={p.website_url ?? "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="block h-full"
              >
                <div className="bg-[rgba(42,42,42,0.7)] backdrop-blur-xl rounded-[11px] p-5 flex flex-col items-center gap-3 h-full">
                  {/* Logo */}
                  <div className="w-16 h-16 shrink-0 bg-surface-container-highest/50 rounded-2xl border border-[rgba(233,195,73,0.15)] flex items-center justify-center overflow-hidden group-hover:border-[rgba(255,92,0,0.35)] transition-colors">
                    {logo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={logo}
                        alt={p.name}
                        className="w-10 h-10 object-contain"
                      />
                    ) : (
                      <span className="text-[28px] font-bold text-tertiary select-none">
                        {p.name[0]}
                      </span>
                    )}
                  </div>

                  {/* Name */}
                  <p className="font-semibold text-on-surface group-hover:text-[#ffb59a] transition-colors text-sm text-center leading-snug">
                    {p.name}
                  </p>

                  {/* CTA */}
                  <div className="mt-auto flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-tertiary group-hover:text-[#ffb59a] transition-colors">
                    <span>Acessar</span>
                    <span className="material-symbols-outlined text-[12px] group-hover:translate-x-0.5 transition-transform">
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
            <p className="text-sm text-tertiary">Nenhum protocolo disponível no momento.</p>
          </div>
        </GlowCard>
      )}
    </div>
  );
}
