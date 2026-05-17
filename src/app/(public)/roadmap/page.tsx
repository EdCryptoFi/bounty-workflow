import type { Metadata } from "next";
import Link from "next/link";
import { RoadmapTimeline } from "@/components/public/roadmap-timeline";
import { PublicHeader } from "@/components/public/public-header";

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

      {/* Animated blobs */}
      <div className="aqua-blob pointer-events-none fixed" style={{ width: 600, height: 600, background: "#ff5c00", top: -150, right: -80, zIndex: 0 }} />
      <div className="aqua-blob aqua-blob--2 pointer-events-none fixed" style={{ width: 480, height: 480, background: "#ff8a3a", bottom: -60, left: -80, zIndex: 0 }} />

      <PublicHeader />

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
