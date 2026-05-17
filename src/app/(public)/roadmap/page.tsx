import type { Metadata } from "next";
import Link from "next/link";
import { RoadmapTimeline } from "@/components/public/roadmap-timeline";

export const metadata: Metadata = {
  title: "Roadmap — Bounty WorkFlow",
  description:
    "Veja o que está por vir no Bounty WorkFlow: integração com X, marketing, Web3, gamificação e mais. Estamos só começando.",
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_APP_URL ?? "https://bountywork.xyz"}/roadmap`,
  },
  openGraph: {
    title: "Roadmap Bounty WorkFlow",
    description:
      "Estamos só começando. Veja o roadmap completo e fique por dentro do que está por vir.",
    url: `${process.env.NEXT_PUBLIC_APP_URL ?? "https://bountywork.xyz"}/roadmap`,
  },
};

export default function RoadmapPage() {
  return (
    <div
      className="min-h-screen flex flex-col text-on-surface antialiased overflow-x-hidden relative"
      style={{ backgroundColor: "#131313" }}
    >
      {/* Grid texture */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* Ambient glow */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 15% 20%, rgba(255,92,0,0.08) 0%, transparent 60%), radial-gradient(ellipse 50% 30% at 85% 80%, rgba(233,195,73,0.06) 0%, transparent 60%)",
        }}
      />

      {/* ── Fixed Header ── */}
      <header
        className="fixed z-50 top-0 left-0 right-0 flex justify-between items-center px-12 h-20 border-b border-zinc-800/50 shadow-[0_4px_30px_rgba(0,0,0,0.5)]"
        style={{ background: "rgba(9,9,9,0.70)", backdropFilter: "blur(24px)" }}
      >
        <Link href="/" className="flex items-center gap-3">
          <div className="relative w-10 h-10 shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-final.png" alt="Bounty Workflow" className="h-10 w-10 object-contain rounded-xl" />
            <div
              className="absolute inset-0 rounded-xl pointer-events-none"
              style={{
                background: "linear-gradient(110deg, transparent 20%, rgba(233,195,73,0.55) 50%, transparent 80%)",
                backgroundSize: "200% 100%",
                animation: "goldShimmerRoadmap 5s ease-in-out infinite",
              }}
            />
          </div>
          <span className="text-xl font-black tracking-tighter text-[#ff5c00]">
            Bounty Workflow
          </span>
        </Link>

        <style>{`
          @keyframes goldShimmerRoadmap {
            0% { background-position: 200% center; opacity: 0; }
            20% { opacity: 1; }
            50% { background-position: -200% center; opacity: 0.6; }
            80% { opacity: 0; }
            100% { background-position: -200% center; opacity: 0; }
          }
          @keyframes fireGlow {
            0%, 100% { opacity: 0.7; filter: drop-shadow(0 0 4px rgba(255,92,0,0.3)); }
            50% { opacity: 1; filter: drop-shadow(0 0 8px rgba(255,92,0,0.7)); }
          }
        `}</style>

        <nav className="hidden md:flex items-center gap-8">
          <Link href="/como-funciona" className="text-zinc-400 text-sm hover:text-[#ff7b33] transition-colors">
            Como funciona
          </Link>
          <Link
            href="/roadmap"
            className="flex items-center gap-1.5 text-sm font-medium transition-colors"
            style={{ color: "#ff5c00" }}
          >
            <span
              className="material-symbols-outlined text-[18px]"
              style={{ animation: "fireGlow 1.5s ease-in-out infinite" }}
            >
              local_fire_department
            </span>
            Roadmap
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link href="/auth/login" className="text-zinc-400 text-sm hover:text-[#ff7b33] transition-colors">
            Entrar
          </Link>
          <Link
            href="/auth/signup"
            className="px-5 py-2 bg-[#ff5c00] text-white text-xs font-bold uppercase tracking-widest rounded hover:bg-[#ff7b33] hover:shadow-[0_0_20px_rgba(255,92,0,0.4)] transition-all duration-300 active:scale-95"
          >
            Começar grátis
          </Link>
        </div>
      </header>

      <main className="flex-grow pt-32 pb-24 relative z-10">
        <RoadmapTimeline />
      </main>

      {/* Footer */}
      <footer
        className="relative z-10 border-t border-zinc-800/50 py-8"
        style={{ background: "rgba(9,9,9,0.5)" }}
      >
        <div className="max-w-[1200px] mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[11px] text-tertiary">
            &copy; {new Date().getFullYear()} Bounty WorkFlow. Todos os direitos reservados.
          </p>
          <div className="flex gap-4">
            <Link href="/legal/termos" className="text-[11px] text-tertiary hover:text-[#ff7b33] transition-colors">
              Termos
            </Link>
            <Link href="/legal/privacidade" className="text-[11px] text-tertiary hover:text-[#ff7b33] transition-colors">
              Privacidade
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
