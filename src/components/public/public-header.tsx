import Link from "next/link";

export function PublicHeader() {
  return (
    <>
      <style>{`
        @keyframes goldShimmerPH {
          0%, 70% { transform: translateX(-150%) skewX(-20deg); opacity: 0; }
          80% { opacity: 1; }
          100% { transform: translateX(250%) skewX(-20deg); opacity: 0; }
        }
        @keyframes fireGlowPH {
          0%, 100% { opacity: 0.7; filter: drop-shadow(0 0 4px rgba(255,92,0,0.3)); }
          50% { opacity: 1; filter: drop-shadow(0 0 8px rgba(255,92,0,0.7)); }
        }
      `}</style>
      <header className="fixed z-50 flex justify-center" style={{ top: 16, left: 0, right: 0 }}>
        <div
          className="glass flex justify-between items-center px-6 h-14 rounded-[999px]"
          style={{
            width: "calc(100% - 48px)",
            maxWidth: 900,
            borderColor: "rgba(255,255,255,0.16)",
            boxShadow: "0 1px 0 rgba(255,255,255,0.18) inset, 0 8px 32px rgba(0,0,0,0.55)",
          }}
        >
          <Link href="/" className="flex items-center gap-3 shrink-0">
            <div className="relative w-8 h-8">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo-final.png" alt="Bounty Workflow" className="h-8 w-8 object-contain rounded-lg" />
              <div
                className="absolute inset-0 rounded-lg pointer-events-none overflow-hidden"
                style={{ background: "linear-gradient(90deg, transparent, rgba(233,195,73,0.55), transparent)", animation: "goldShimmerPH 5s ease-in-out infinite" }}
              />
            </div>
            <span className="font-display text-sm font-bold text-white/90 hidden sm:block">
              Bounty <span style={{ color: "#ff7b33" }}>WorkFlow</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link href="/como-funciona" className="text-white/60 text-sm font-medium hover:text-[#ffb59a] transition-colors">
              Como funciona
            </Link>
            <Link href="/roadmap" className="flex items-center gap-1 text-sm font-medium text-white/60 hover:text-[#ffb59a] transition-colors">
              <span className="material-symbols-outlined text-[16px] text-[#ff5c00]" style={{ animation: "fireGlowPH 1.5s ease-in-out infinite" }}>
                local_fire_department
              </span>
              Roadmap
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <Link href="/auth/login" className="aqua-ghost-btn" style={{ padding: "7px 16px", fontSize: 12, borderRadius: 999 }}>
              Entrar
            </Link>
            <Link href="/auth/signup" className="aqua-pill-btn" style={{ padding: "7px 16px", fontSize: 12, borderRadius: 999 }}>
              Começar grátis →
            </Link>
          </div>
        </div>
      </header>
    </>
  );
}
