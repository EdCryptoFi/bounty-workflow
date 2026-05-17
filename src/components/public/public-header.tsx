import Link from "next/link";

export function PublicHeader() {
  return (
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
              animation: "goldShimmerPH 5s ease-in-out infinite",
            }}
          />
        </div>
        <span className="text-xl font-black tracking-tighter text-[#ff5c00]">
          Bounty Workflow
        </span>
      </Link>

      <style>{`
        @keyframes goldShimmerPH {
          0% { background-position: 200% center; opacity: 0; }
          20% { opacity: 1; }
          50% { background-position: -200% center; opacity: 0.6; }
          80% { opacity: 0; }
          100% { background-position: -200% center; opacity: 0; }
        }
        @keyframes fireGlowPH {
          0%, 100% { opacity: 0.7; filter: drop-shadow(0 0 4px rgba(255,92,0,0.3)); }
          50% { opacity: 1; filter: drop-shadow(0 0 8px rgba(255,92,0,0.7)); }
        }
      `}</style>

      <nav className="hidden md:flex items-center gap-8">
        <Link href="/como-funciona" className="text-[#ff7b33] text-sm font-medium hover:text-[#ffb59a] transition-colors">
          Como funciona
        </Link>
        <Link
          href="/roadmap"
          className="flex items-center gap-1.5 text-sm font-medium transition-colors"
          style={{ color: "#ff5c00" }}
        >
          <span
            className="material-symbols-outlined text-[18px]"
            style={{ animation: "fireGlowPH 1.5s ease-in-out infinite" }}
          >
            local_fire_department
          </span>
          Roadmap
        </Link>
        <Link href="/auth/login" className="text-zinc-400 text-sm hover:text-[#ff7b33] transition-colors">
          Entrar
        </Link>
        <Link
          href="/auth/signup"
          className="px-5 py-2 bg-[#ff5c00] text-white text-xs font-bold uppercase tracking-widest rounded hover:bg-[#ff7b33] hover:shadow-[0_0_20px_rgba(255,92,0,0.4)] transition-all duration-300 active:scale-95"
        >
          Começar grátis
        </Link>
      </nav>
    </header>
  );
}
