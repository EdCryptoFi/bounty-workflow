import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Dicas" };

const tips = [
  {
    id: "1",
    title: "Claude x LLMs",
    description: "Como diferentes modelos de IA se comparam e qual usar para suas campanhas de bounty.",
    url: "https://x.com/EdCriptoFi/status/2041849427199926311?s=20",
    tag: "IA & Ferramentas",
    icon: "psychology",
    color: "#ff5c00",
  },
];

export default function DicasPage() {
  return (
    <div className="max-w-[1200px] mx-auto flex flex-col gap-8">
      {/* Header */}
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-[#ff5c00] mb-1">
          Recursos
        </p>
        <h1 className="font-display text-[30px] font-semibold tracking-tight text-on-surface leading-tight">
          Dicas
        </h1>
        <p className="text-sm text-tertiary mt-1">
          Conteúdos selecionados para turbinar suas campanhas e estratégia.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {tips.map((tip) => (
          <Link
            key={tip.id}
            href={tip.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex flex-col gap-4 rounded-2xl p-6 border border-[rgba(255,92,0,0.14)] hover:border-[rgba(255,92,0,0.4)] transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,92,0,0.12)] hover:-translate-y-1"
            style={{
              background: "rgba(24,23,23,0.9)",
              backdropFilter: "blur(20px)",
            }}
          >
            {/* Glow top */}
            <div
              className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                background: "linear-gradient(to bottom, rgba(255,92,0,0.05) 0%, transparent 50%)",
              }}
            />

            {/* Icon + tag */}
            <div className="flex items-start justify-between relative z-10">
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: "rgba(255,92,0,0.1)", border: "1px solid rgba(255,92,0,0.2)" }}
              >
                <span className="material-symbols-outlined text-[22px]" style={{ color: tip.color }}>
                  {tip.icon}
                </span>
              </div>
              <span
                className="text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full"
                style={{ background: "rgba(255,92,0,0.08)", color: "#ffb59a", border: "1px solid rgba(255,92,0,0.15)" }}
              >
                {tip.tag}
              </span>
            </div>

            {/* Content */}
            <div className="flex flex-col gap-2 relative z-10 flex-1">
              <h3 className="text-base font-semibold text-on-surface group-hover:text-[#ffb59a] transition-colors">
                {tip.title}
              </h3>
              <p className="text-xs text-tertiary leading-relaxed flex-1">{tip.description}</p>
            </div>

            {/* Footer */}
            <div className="flex items-center gap-1.5 relative z-10">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#ff5c00]">
                Acessar
              </span>
              <span className="material-symbols-outlined text-[13px] text-[#ff5c00] group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </div>
          </Link>
        ))}

        {/* Placeholder — coming soon */}
        <div
          className="flex flex-col items-center justify-center gap-3 rounded-2xl p-6 border border-dashed min-h-[180px]"
          style={{ borderColor: "rgba(255,92,0,0.15)", background: "rgba(24,23,23,0.4)" }}
        >
          <span className="material-symbols-outlined text-[32px] text-tertiary">add_circle</span>
          <p className="text-[11px] font-bold uppercase tracking-widest text-tertiary text-center">
            Mais dicas em breve
          </p>
        </div>
      </div>
    </div>
  );
}
