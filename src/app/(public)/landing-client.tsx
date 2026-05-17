"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { CheckCircle2, ArrowUpRight, X } from "lucide-react";
import { motion, AnimatePresence, useMotionValue, useTransform, type Variants } from "motion/react";

/* ─────────────────────────────────────────────────────────────────────────────
   AQUA DESIGN SYSTEM — CSS keyframes injected once
───────────────────────────────────────────────────────────────────────────── */
const AQUA_CSS = `
  @keyframes aquaBlob {
    0%   { transform: translate(0,0) scale(1) rotate(0deg); }
    50%  { transform: translate(10%,8%) scale(1.15) rotate(40deg); }
    100% { transform: translate(-6%,12%) scale(0.95) rotate(-25deg); }
  }
  @keyframes aquaCubeFloat {
    0%   { transform: rotateX(-15deg) rotateY(-24deg) translateY(0px); }
    100% { transform: rotateX(-17deg) rotateY(-20deg) translateY(-10px); }
  }
  @keyframes aquaCubeShine {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }
  @keyframes aquaTicker {
    from { transform: translateX(0); }
    to   { transform: translateX(-50%); }
  }
  @keyframes aquaWf {
    from { transform: scaleY(0.45); }
    to   { transform: scaleY(1.1); }
  }
  @keyframes aquaPulse {
    0%   { box-shadow: 0 0 0 0 rgba(52,208,95,0.65); }
    70%  { box-shadow: 0 0 0 10px rgba(52,208,95,0); }
    100% { box-shadow: 0 0 0 0 rgba(52,208,95,0); }
  }
  @keyframes aquaShimmer {
    0%   { background-position: -200% 0; }
    100% { background-position:  200% 0; }
  }
  @keyframes goldShimmerLanding {
    0%   { background-position: 200% center; opacity: 0; }
    20%  { opacity: 1; }
    50%  { background-position: -200% center; opacity: 0.6; }
    80%  { opacity: 0; }
    100% { background-position: -200% center; opacity: 0; }
  }
  @keyframes fireGlowNav {
    0%, 100% { opacity: 0.7; filter: drop-shadow(0 0 4px rgba(255,92,0,0.3)); }
    50%       { opacity: 1;   filter: drop-shadow(0 0 8px rgba(255,92,0,0.7)); }
  }
`;

/* ─────────────────────────────────────────────────────────────────────────────
   AuroraBg — animated SVG ribbons
───────────────────────────────────────────────────────────────────────────── */
function AuroraBg() {
  return (
    <svg
      aria-hidden="true"
      style={{
        position: "absolute", inset: 0, width: "100%", height: "100%",
        opacity: 0.65, mixBlendMode: "screen", pointerEvents: "none", zIndex: 0,
      }}
      preserveAspectRatio="none"
      viewBox="0 0 1400 900"
    >
      <defs>
        <linearGradient id="auro1" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%"   stopColor="#ff7a1f" stopOpacity="0"/>
          <stop offset="40%"  stopColor="#ff5c00" stopOpacity=".55"/>
          <stop offset="100%" stopColor="#ff5c00" stopOpacity="0"/>
        </linearGradient>
        <linearGradient id="auro2" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%"   stopColor="#ffaa54" stopOpacity="0"/>
          <stop offset="50%"  stopColor="#ffaa54" stopOpacity=".45"/>
          <stop offset="100%" stopColor="#ffaa54" stopOpacity="0"/>
        </linearGradient>
        <filter id="auroBlur"><feGaussianBlur stdDeviation="40"/></filter>
      </defs>
      <path filter="url(#auroBlur)" fill="url(#auro1)"
        d="M -100 300 C 200 200, 500 500, 900 300 S 1300 100, 1500 250 L 1500 420 C 1300 320, 900 520, 500 380 S 100 540, -100 460 Z">
        <animate attributeName="d" dur="14s" repeatCount="indefinite"
          values="M -100 300 C 200 200, 500 500, 900 300 S 1300 100, 1500 250 L 1500 420 C 1300 320, 900 520, 500 380 S 100 540, -100 460 Z;M -100 360 C 200 280, 500 420, 900 360 S 1300 180, 1500 320 L 1500 500 C 1300 400, 900 580, 500 440 S 100 580, -100 520 Z;M -100 300 C 200 200, 500 500, 900 300 S 1300 100, 1500 250 L 1500 420 C 1300 320, 900 520, 500 380 S 100 540, -100 460 Z"/>
      </path>
      <path filter="url(#auroBlur)" fill="url(#auro2)" opacity=".7"
        d="M -100 600 C 300 540, 600 720, 1000 620 S 1400 480, 1500 540 L 1500 720 C 1300 640, 900 820, 500 720 S 100 780, -100 740 Z">
        <animate attributeName="d" dur="18s" repeatCount="indefinite"
          values="M -100 600 C 300 540, 600 720, 1000 620 S 1400 480, 1500 540 L 1500 720 C 1300 640, 900 820, 500 720 S 100 780, -100 740 Z;M -100 640 C 300 580, 600 660, 1000 660 S 1400 540, 1500 600 L 1500 760 C 1300 700, 900 760, 500 760 S 100 740, -100 760 Z;M -100 600 C 300 540, 600 720, 1000 620 S 1400 480, 1500 540 L 1500 720 C 1300 640, 900 820, 500 720 S 100 780, -100 740 Z"/>
      </path>
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   GlassCard — translucent glass surface
───────────────────────────────────────────────────────────────────────────── */
function GlassCard({
  children, style, dark = false,
}: { children: React.ReactNode; style?: React.CSSProperties; dark?: boolean }) {
  return (
    <div style={{
      background: dark
        ? "linear-gradient(180deg, rgba(40,20,5,0.60) 0%, rgba(10,5,2,0.70) 100%)"
        : "linear-gradient(180deg, rgba(255,255,255,0.11) 0%, rgba(255,255,255,0.04) 100%)",
      border: "1px solid rgba(255,255,255,0.20)",
      backdropFilter: "blur(28px) saturate(160%)",
      WebkitBackdropFilter: "blur(28px) saturate(160%)",
      boxShadow: "0 1px 0 rgba(255,255,255,0.18) inset, 0 0 0 1px rgba(255,255,255,0.05) inset, 0 30px 60px -25px rgba(0,0,0,0.6), 0 10px 30px -10px rgba(0,0,0,0.45)",
      borderRadius: 22,
      position: "relative",
      overflow: "hidden",
      ...style,
    }}>
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: "linear-gradient(180deg, rgba(255,255,255,0.32) 0%, rgba(255,255,255,0) 28%)",
        mixBlendMode: "screen", opacity: 0.5,
      }}/>
      <div style={{ position: "relative", zIndex: 1, height: "100%" }}>{children}</div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   AquaIcon — liquid-glass orange SVG icons
───────────────────────────────────────────────────────────────────────────── */
function AquaIcon({ name, size = 56 }: { name: string; size?: number }) {
  const id = `ai-${name}`;
  const sp = { stroke: "#fff", strokeWidth: 4.5, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, fill: "none" as const };
  const glyphs: Record<string, React.ReactNode> = {
    calendar: <g {...sp}><rect x="28" y="32" width="44" height="38" rx="5"/><path d="M28 44H72"/><path d="M38 26V36"/><path d="M62 26V36"/><circle cx="42" cy="54" r="2" fill="#fff" stroke="none"/><circle cx="50" cy="54" r="2" fill="#fff" stroke="none"/><circle cx="58" cy="54" r="2" fill="#fff" stroke="none"/><circle cx="42" cy="62" r="2" fill="#fff" stroke="none"/><circle cx="50" cy="62" r="2" fill="#fff" stroke="none"/></g>,
    bell:     <g {...sp}><path d="M32 64H68L64 55V46a14 14 0 0 0-28 0v9Z"/><path d="M44 70a6 6 0 0 0 12 0"/></g>,
    tree:     <g {...sp}><circle cx="50" cy="30" r="6"/><circle cx="32" cy="64" r="6"/><circle cx="68" cy="64" r="6"/><path d="M50 36V46H32V58M50 46H68V58"/></g>,
    graph:    <g {...sp}><path d="M26 70H74"/><path d="M30 64L42 50L52 58L70 32"/><circle cx="70" cy="32" r="3" fill="#fff" stroke="none"/></g>,
    target:   <g {...sp}><circle cx="50" cy="50" r="20"/><circle cx="50" cy="50" r="11"/><circle cx="50" cy="50" r="3" fill="#fff" stroke="none"/></g>,
    wallet:   <g {...sp}><rect x="26" y="34" width="48" height="34" rx="5"/><path d="M26 44H62a6 6 0 0 1 0 12H26"/><circle cx="58" cy="50" r="2" fill="#fff" stroke="none"/></g>,
    spark:    <path d="M50 22L54 44L74 50L54 56L50 78L46 56L26 50L46 44Z" fill="#fff"/>,
    shield:   <g {...sp}><path d="M50 22L70 30V52c0 12-10 22-20 26-10-4-20-14-20-26V30Z"/><path d="M40 52L48 60L62 44"/></g>,
    play:     <path d="M40 30L70 50L40 70Z" fill="#fff"/>,
    rocket:   <g {...sp}><path d="M50 22c10 10 14 22 14 32v8H36v-8c0-10 4-22 14-32Z"/><circle cx="50" cy="44" r="5"/><path d="M36 56L28 64L34 66M64 56L72 64L66 66"/></g>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 100 100"
      style={{ filter: "drop-shadow(0 14px 24px rgba(255,92,0,0.45))", flexShrink: 0 }}>
      <defs>
        <linearGradient id={`${id}-g`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#ffc28a"/>
          <stop offset="35%"  stopColor="#ff7a1f"/>
          <stop offset="100%" stopColor="#8a2900"/>
        </linearGradient>
        <linearGradient id={`${id}-h`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="rgba(255,255,255,0.92)"/>
          <stop offset="100%" stopColor="rgba(255,255,255,0)"/>
        </linearGradient>
        <radialGradient id={`${id}-s`} cx="50%" cy="55%" r="55%">
          <stop offset="40%"  stopColor="rgba(0,0,0,0)"/>
          <stop offset="100%" stopColor="rgba(255,92,0,0.55)"/>
        </radialGradient>
        <filter id={`${id}-b`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1.4"/>
        </filter>
      </defs>
      <circle cx="50" cy="50" r="48" fill={`url(#${id}-s)`} opacity="0.7"/>
      <circle cx="50" cy="50" r="46" fill={`url(#${id}-g)`}/>
      <circle cx="50" cy="50" r="45.5" fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth="1"/>
      <ellipse cx="50" cy="28" rx="24" ry="10" fill={`url(#${id}-h)`} opacity="0.95"/>
      <ellipse cx="50" cy="83" rx="30" ry="7" fill="rgba(80,20,0,0.45)" filter={`url(#${id}-b)`}/>
      <g style={{ filter: "drop-shadow(0 1px 0 rgba(0,0,0,0.35))" }}>
        {glyphs[name] ?? <circle cx="50" cy="50" r="18" fill="#fff" opacity=".8"/>}
      </g>
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   AquaWaveform — animated equalizer bars
───────────────────────────────────────────────────────────────────────────── */
function AquaWaveform({ bars = 20, height = 28 }: { bars?: number; height?: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 3, height, width: "100%" }}>
      {Array.from({ length: bars }).map((_, i) => (
        <span key={i} style={{
          flex: 1, height: `${30 + (i % 7) * 8}%`, borderRadius: 3,
          background: "linear-gradient(180deg, #ffbb7a, #ff5c00)",
          boxShadow: "0 0 10px rgba(255,92,0,0.4)",
          animation: `aquaWf ${(1.1 + (i % 5) * 0.25).toFixed(2)}s ease-in-out ${(i * 0.04).toFixed(2)}s infinite alternate`,
          opacity: 0.9,
        }}/>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   GlowBar — shimmer progress bar
───────────────────────────────────────────────────────────────────────────── */
function GlowBar({ value }: { value: number }) {
  return (
    <div style={{ height: 8, borderRadius: 999, background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
      <div style={{
        height: "100%", width: `${value}%`,
        background: "linear-gradient(90deg, #ff9b50, #ff5c00 60%, #b83a00)",
        boxShadow: "0 0 18px rgba(255,92,0,0.55)", borderRadius: "inherit",
      }}>
        <div style={{
          width: "100%", height: "100%",
          background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)",
          backgroundSize: "200% 100%",
          animation: "aquaShimmer 2.2s linear infinite",
        }}/>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   LiveDot — pulsing live indicator
───────────────────────────────────────────────────────────────────────────── */
function LiveDot({ color = "#34d05f" }: { color?: string }) {
  return (
    <span style={{
      display: "inline-block", width: 8, height: 8, borderRadius: "50%",
      background: color, flexShrink: 0,
      animation: "aquaPulse 1.6s infinite",
    }}/>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   AquaCube — 3D CSS cube with logo on front face
───────────────────────────────────────────────────────────────────────────── */
function AquaCube({ size = 440 }: { size?: number }) {
  const face = Math.round(size * 0.74);
  const half = face / 2;
  const faceBase: React.CSSProperties = {
    position: "absolute", inset: 0, borderRadius: 38, backfaceVisibility: "hidden",
  };
  return (
    <div style={{
      perspective: 1500, perspectiveOrigin: "50% 38%",
      width: size, height: size, display: "grid", placeItems: "center",
    }}>
      <div style={{
        position: "relative", width: face, height: face,
        transformStyle: "preserve-3d",
        animation: "aquaCubeFloat 10s ease-in-out infinite alternate",
      }}>
        {/* FRONT — glossy jet-black with logo */}
        <div style={{
          ...faceBase,
          transform: `translateZ(${half}px)`,
          background: "radial-gradient(ellipse 90% 50% at 50% -10%, rgba(255,255,255,0.45), transparent 55%), radial-gradient(ellipse 70% 60% at 50% 110%, rgba(255,92,0,0.18), transparent 60%), linear-gradient(180deg, #2a2622 0%, #100d0a 28%, #060503 70%, #0a0805 100%)",
          boxShadow: "inset 0 1.5px 0 rgba(255,255,255,0.45), inset 0 -1px 0 rgba(255,138,40,0.15), inset 0 0 0 1px rgba(255,255,255,0.06), inset 0 -80px 100px rgba(0,0,0,0.7)",
          overflow: "hidden",
        }}>
          {/* specular gloss at top */}
          <div style={{ position: "absolute", left: "6%", right: "6%", top: "4%", height: "38%", borderRadius: "50%", background: "linear-gradient(180deg, rgba(255,255,255,0.55), rgba(255,255,255,0))", filter: "blur(2px)" }}/>
          {/* rotating light sweep */}
          <div style={{ position: "absolute", inset: "-10%", background: "conic-gradient(from 200deg at 30% 10%, transparent 0deg, rgba(255,255,255,0.18) 50deg, transparent 130deg)", mixBlendMode: "screen", opacity: 0.7, animation: "aquaCubeShine 14s linear infinite" }}/>
          {/* Logo */}
          <div style={{ position: "absolute", inset: "4% 6%", display: "grid", placeItems: "center", zIndex: 2 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-final.png" alt="Bounty Workflow"
              style={{ maxWidth: "88%", maxHeight: "92%", objectFit: "contain", filter: "drop-shadow(0 1px 0 rgba(255,255,255,0.08)) drop-shadow(0 8px 14px rgba(0,0,0,0.65))" }}/>
          </div>
        </div>
        {/* TOP */}
        <div style={{
          ...faceBase, transform: `rotateX(90deg) translateZ(${half}px)`,
          background: "radial-gradient(ellipse 60% 50% at 40% 30%, rgba(255,255,255,0.25), transparent 55%), linear-gradient(180deg, #3a342e 0%, #1a1611 60%, #0d0b08 100%)",
          boxShadow: "inset 0 2px 0 rgba(255,255,255,0.4), inset 0 0 60px rgba(255,138,40,0.12)",
        }}/>
        {/* RIGHT */}
        <div style={{
          ...faceBase, transform: `rotateY(90deg) translateZ(${half}px)`,
          background: "linear-gradient(90deg, #1c1814 0%, #0a0806 70%, #050402 100%)",
          boxShadow: "inset 0 2px 0 rgba(255,255,255,0.25), inset -40px 0 80px rgba(0,0,0,0.5)",
        }}/>
        {/* hidden back faces */}
        <div style={{ ...faceBase, transform: `rotateY(-90deg) translateZ(${half}px)`, opacity: 0 }}/>
        <div style={{ ...faceBase, transform: `rotateY(180deg) translateZ(${half}px)`, opacity: 0 }}/>
        <div style={{ ...faceBase, transform: `rotateX(-90deg) translateZ(${half}px)`, opacity: 0 }}/>
        {/* ground glow shadow */}
        <div style={{
          position: "absolute", left: "50%", bottom: "-12%", width: "120%", height: "18%",
          transform: "translateX(-50%)",
          background: "radial-gradient(ellipse at center, rgba(255,92,0,0.35) 0%, rgba(0,0,0,0.5) 30%, transparent 70%)",
          filter: "blur(24px)", zIndex: -1,
        }}/>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   LandingClient — main page component
───────────────────────────────────────────────────────────────────────────── */
export function LandingClient() {
  const [showDemo, setShowDemo] = useState(false);
  const [cookieAccepted, setCookieAccepted] = useState(true);

  useEffect(() => {
    setCookieAccepted(localStorage.getItem("cookie_consent") === "1");
  }, []);

  function acceptCookies() {
    localStorage.setItem("cookie_consent", "1");
    setCookieAccepted(true);
  }

  const PROTOCOLS = ["CLASHO","KREATORS","MAGVERSE","RALLY","STARKNET","ARBITRUM","OPTIMISM","BASE","SCROLL","ZKSYNC","MODE"];

  return (
    <div style={{
      position: "relative", minHeight: "100vh",
      background: "radial-gradient(120% 80% at 80% -10%, rgba(255,92,0,0.22), transparent 60%), radial-gradient(80% 60% at -10% 110%, rgba(255,138,40,0.18), transparent 60%), linear-gradient(180deg, #0c0a07 0%, #060403 100%)",
      color: "#f7f5f2", overflowX: "hidden",
    }}>
      <style>{AQUA_CSS}</style>

      {/* ── Animated bg blobs ── */}
      <div aria-hidden="true" style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
        <div style={{ position: "absolute", width: "60%", height: "60%", left: "60%", top: "-10%", background: "radial-gradient(closest-side, rgba(255,92,0,0.55), transparent 70%)", filter: "blur(60px)", opacity: 0.55, animation: "aquaBlob 18s ease-in-out infinite alternate" }}/>
        <div style={{ position: "absolute", width: "50%", height: "50%", left: "-10%", top: "60%", background: "radial-gradient(closest-side, rgba(255,170,80,0.45), transparent 70%)", filter: "blur(60px)", opacity: 0.45, animation: "aquaBlob 22s ease-in-out -8s infinite alternate" }}/>
      </div>

      {/* ── Noise grain ── */}
      <div aria-hidden="true" style={{ position: "fixed", inset: 0, pointerEvents: "none", opacity: 0.06, mixBlendMode: "overlay", zIndex: 0, backgroundImage: "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1   0 0 0 0 1   0 0 0 0 1   0 0 0 0.6 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")" }}/>

      {/* ── Aurora ── */}
      <div aria-hidden="true" style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
        <AuroraBg />
      </div>

      {/* ── Floating Pill Header ── */}
      <header style={{
        position: "fixed", top: 16, left: "50%", transform: "translateX(-50%)",
        width: "calc(100% - 40px)", maxWidth: 1200, zIndex: 50,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "10px 12px 10px 20px", borderRadius: 999,
        background: "linear-gradient(180deg, rgba(255,255,255,0.13), rgba(255,255,255,0.04))",
        border: "1px solid rgba(255,255,255,0.16)",
        boxShadow: "0 1px 0 rgba(255,255,255,0.18) inset, 0 0 0 1px rgba(255,255,255,0.06) inset, 0 30px 60px -25px rgba(0,0,0,0.6), 0 10px 30px -10px rgba(0,0,0,0.45)",
        backdropFilter: "blur(28px) saturate(160%)",
        WebkitBackdropFilter: "blur(28px) saturate(160%)",
      }}>
        {/* Logo wordmark */}
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
            <div style={{ position: "relative", width: 34, height: 34, flexShrink: 0 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo-final.png" alt="Bounty Workflow" style={{ width: 34, height: 34, objectFit: "contain", borderRadius: 9 }}/>
              <div style={{ position: "absolute", inset: 0, borderRadius: 9, background: "linear-gradient(110deg, transparent 20%, rgba(233,195,73,0.55) 50%, transparent 80%)", backgroundSize: "200% 100%", animation: "goldShimmerLanding 5s ease-in-out infinite", pointerEvents: "none" }}/>
            </div>
            <div style={{ lineHeight: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#fff", letterSpacing: ".02em" }}>Bounty</div>
              <div style={{ fontSize: 12, fontWeight: 600, background: "linear-gradient(180deg,#ffb072,#ff5c00)", WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>WorkFlow</div>
            </div>
          </Link>
          <div style={{ width: 1, height: 22, background: "rgba(255,255,255,0.12)" }}/>
          {/* Nav links */}
          <nav className="hidden md:flex" style={{ gap: 4, alignItems: "center", display: "flex" }}>
            {[
              { label: "Como funciona", href: "/como-funciona", active: true },
              { label: "Roadmap", href: "/roadmap", fire: true },
              { label: "Campaigns", href: "/campaigns" },
              { label: "Protocols", href: "/protocols" },
            ].map((item) => (
              <Link key={item.href} href={item.href} style={{
                height: 34, padding: "0 13px",
                display: "inline-flex", alignItems: "center", gap: 5, borderRadius: 999,
                color: item.active ? "#fff" : "#e7e3dd",
                fontWeight: 500, fontSize: 13, textDecoration: "none",
                background: item.active ? "linear-gradient(180deg, rgba(255,255,255,0.18), rgba(255,255,255,0.06))" : "transparent",
                boxShadow: item.active ? "0 1px 0 rgba(255,255,255,0.35) inset, 0 6px 16px -8px rgba(0,0,0,0.6)" : "none",
              }}>
                {item.fire && (
                  <span className="material-symbols-outlined" style={{ fontSize: 16, color: "#ff5c00", animation: "fireGlowNav 1.5s ease-in-out infinite" }}>
                    local_fire_department
                  </span>
                )}
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Auth */}
        <div style={{ display: "flex", gap: 8 }}>
          <Link href="/auth/login" style={{
            height: 36, padding: "0 14px", display: "inline-flex", alignItems: "center",
            borderRadius: 999, fontSize: 13, fontWeight: 500, color: "#e7e3dd", textDecoration: "none",
            background: "linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))",
            border: "1px solid rgba(255,255,255,0.10)",
            boxShadow: "0 1px 0 rgba(255,255,255,0.18) inset",
          }}>Entrar</Link>
          <Link href="/auth/signup" style={{
            height: 36, padding: "0 16px", display: "inline-flex", alignItems: "center",
            borderRadius: 999, fontSize: 13, fontWeight: 600, color: "#fff", textDecoration: "none",
            background: "linear-gradient(180deg, #ff9b50 0%, #ff6a14 38%, #d44600 100%)",
            boxShadow: "0 1px 0 rgba(255,255,255,0.65) inset, 0 -8px 12px rgba(0,0,0,0.18) inset, 0 8px 22px -6px rgba(255,92,0,0.65)",
            position: "relative", overflow: "hidden",
          }}>
            <span style={{ position: "absolute", left: "8%", right: "8%", top: 3, height: "38%", borderRadius: 999, background: "linear-gradient(180deg, rgba(255,255,255,0.7), rgba(255,255,255,0.05))", filter: "blur(.3px)" }}/>
            <span style={{ position: "relative" }}>Começar grátis →</span>
          </Link>
        </div>
      </header>

      {/* ── Main ── */}
      <main style={{ position: "relative", zIndex: 1, paddingTop: 96 }}>

        {/* ── Hero — 2-col: text left, 3D cube right ── */}
        <section className="max-w-[1400px] mx-auto px-6 lg:px-12" style={{ paddingTop: 64, paddingBottom: 40 }}>
          <div className="grid lg:grid-cols-2 gap-10 items-center">

            {/* LEFT — copy */}
            <div>
              {/* Chip badge */}
              <span style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                height: 28, padding: "0 12px", borderRadius: 999,
                fontSize: 11, fontWeight: 700, letterSpacing: ".06em", textTransform: "uppercase",
                color: "#ffd8b8",
                background: "linear-gradient(180deg, rgba(255,140,58,0.18), rgba(255,92,0,0.06))",
                border: "1px solid rgba(255,140,58,0.30)",
                boxShadow: "0 1px 0 rgba(255,255,255,0.18) inset",
                marginBottom: 28,
              }}>
                <LiveDot /> FEITO PARA HUNTERS DE BOUNTY CRIPTO
              </span>

              {/* Headline */}
              <h1 style={{
                fontFamily: "'SF Pro Display','Inter','Helvetica Neue',sans-serif",
                fontSize: "clamp(44px,5.5vw,88px)",
                fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 0.95,
                margin: "0 0 24px", color: "#f7f5f2",
              }}>
                Domine seu{" "}
                <span style={{
                  background: "linear-gradient(180deg, #ffb072 0%, #ff5c00 45%, #c23a00 100%)",
                  WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent",
                  filter: "drop-shadow(0 6px 28px rgba(255,92,0,0.35))",
                }}>
                  fluxo de trabalho
                </span>
                <br/>com precisão.
              </h1>

              {/* Body */}
              <p style={{ fontSize: 18, lineHeight: 1.55, color: "#e7e3dd", maxWidth: 520, margin: "0 0 32px", opacity: 0.85 }}>
                Nunca mais perca um bounty por prazo vencido. Organize protocolos, gerencie campanhas e receba alertas automáticos — tudo em uma plataforma feita para hunters sérios.
              </p>

              {/* CTA buttons */}
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 40 }}>
                {/* Primary aqua button */}
                <Link href="/auth/signup" style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  height: 52, padding: "0 28px", borderRadius: 999,
                  fontWeight: 600, fontSize: 16, color: "#fff", textDecoration: "none",
                  background: "linear-gradient(180deg, #ff9b50 0%, #ff6a14 38%, #d44600 100%)",
                  boxShadow: "0 1px 0 rgba(255,255,255,0.65) inset, 0 -8px 12px rgba(0,0,0,0.18) inset, 0 8px 22px -6px rgba(255,92,0,0.65), 0 18px 46px -16px rgba(0,0,0,0.8)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  position: "relative", overflow: "hidden",
                }}>
                  <span style={{ position: "absolute", left: "6%", right: "6%", top: 3, height: "38%", borderRadius: 999, background: "linear-gradient(180deg, rgba(255,255,255,0.7), rgba(255,255,255,0.05))", filter: "blur(.4px)" }}/>
                  <span style={{ position: "relative" }}>Começar grátis</span>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ position: "relative" }}>
                    <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </Link>
                {/* Ghost button */}
                <button type="button" onClick={() => setShowDemo(true)} style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  height: 52, padding: "0 24px", borderRadius: 999,
                  fontWeight: 600, fontSize: 16, color: "#f7f5f2", cursor: "pointer",
                  border: "1px solid rgba(255,255,255,0.15)",
                  background: "linear-gradient(180deg, rgba(255,255,255,0.10), rgba(255,255,255,0.03))",
                  backdropFilter: "blur(20px)",
                  boxShadow: "0 1px 0 rgba(255,255,255,0.22) inset, 0 12px 30px -16px rgba(0,0,0,0.7)",
                }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 20, color: "#e9c349" }}>play_circle</span>
                  Ver Demonstração
                </button>
              </div>

              {/* Social proof strip */}
              <div style={{ display: "flex", gap: 18, alignItems: "center" }}>
                <div style={{ display: "flex" }}>
                  {["#ff8a3a","#ffaa54","#c23a00","#ff5c00","#7a2400"].map((c, i) => (
                    <div key={i} style={{
                      width: 30, height: 30, borderRadius: "50%",
                      background: `linear-gradient(180deg, rgba(255,255,255,0.15), transparent), ${c}`,
                      border: "2px solid #0a0807", marginLeft: i ? -9 : 0,
                      boxShadow: "0 4px 10px rgba(0,0,0,.5)",
                    }}/>
                  ))}
                </div>
                <div style={{ fontSize: 13, color: "#e7e3dd", lineHeight: 1.4 }}>
                  <strong style={{ color: "#fff" }}>1.247 hunters</strong> ativos no Brasil<br/>
                  <span style={{ opacity: 0.65 }}>+ R$ 2.4M em recompensas rastreadas</span>
                </div>
              </div>
            </div>

            {/* RIGHT — 3D cube + floating glass cards */}
            <div className="relative hidden lg:block" style={{ height: 620 }}>
              {/* Cube centered */}
              <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center" }}>
                <AquaCube size={500} />
              </div>

              {/* Floating card 1 — campaign progress */}
              <GlassCard style={{ position: "absolute", left: 0, top: 24, width: 260, padding: 16, borderRadius: 20, transform: "rotate(-3deg)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 5, height: 22, padding: "0 10px", borderRadius: 999, fontSize: 10, fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase", color: "#ffd8b8", background: "rgba(255,92,0,0.12)", border: "1px solid rgba(255,140,58,0.25)" }}>ATIVA</span>
                  <span style={{ fontSize: 11, color: "#9d978d" }}>Vence em 18h</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <AquaIcon name="target" size={36}/>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "#fff" }}>Clasho — Thread X</div>
                    <div style={{ fontSize: 11, color: "#9d978d" }}>Recompensa · R$ 480</div>
                  </div>
                </div>
                <div style={{ marginTop: 14 }}>
                  <GlowBar value={72}/>
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, fontSize: 11 }}>
                    <span style={{ color: "#9d978d" }}>Rascunho · 3/5</span>
                    <span style={{ color: "#ff8a3a" }}>72%</span>
                  </div>
                </div>
              </GlassCard>

              {/* Floating card 2 — deadline alert */}
              <GlassCard style={{ position: "absolute", right: -8, top: 90, width: 234, padding: 14, borderRadius: 18, transform: "rotate(4deg)" }}>
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <AquaIcon name="bell" size={34}/>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: "#fff" }}>Deadline em 24h</div>
                    <div style={{ fontSize: 11, color: "#9d978d" }}>Kreators — Vídeo Reel</div>
                  </div>
                </div>
                <div style={{ marginTop: 10, fontSize: 10, color: "#ffd8b8", padding: "6px 8px", borderRadius: 8, background: "rgba(255,92,0,.12)", border: "1px solid rgba(255,138,40,.25)" }}>
                  Termina amanhã às 18h — ainda dá tempo
                </div>
              </GlassCard>

              {/* Floating card 3 — monthly stats */}
              <GlassCard style={{ position: "absolute", left: 20, bottom: 28, width: 210, padding: 16, borderRadius: 18, transform: "rotate(-2deg)" }}>
                <div style={{ fontSize: 11, color: "#9d978d", textTransform: "uppercase", letterSpacing: ".12em" }}>Este mês</div>
                <div style={{ fontSize: 30, fontWeight: 700, color: "#fff", letterSpacing: "-.02em", marginTop: 4 }}>R$ 3.240</div>
                <div style={{ marginTop: 8 }}>
                  <AquaWaveform bars={18} height={26}/>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, fontSize: 11 }}>
                  <span style={{ color: "#9d978d" }}>14 campanhas</span>
                  <span style={{ color: "#34d05f" }}>+38%</span>
                </div>
              </GlassCard>

              {/* Floating card 4 — payment */}
              <GlassCard style={{ position: "absolute", right: 6, bottom: 44, width: 210, padding: 14, borderRadius: 18, transform: "rotate(3deg)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <AquaIcon name="wallet" size={34}/>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: "#fff" }}>Pagamento recebido</div>
                    <div style={{ fontSize: 10, color: "#9d978d", fontFamily: "monospace" }}>0x4a…f29</div>
                  </div>
                </div>
                <div style={{ marginTop: 10, display: "flex", justifyContent: "space-between", fontSize: 12 }}>
                  <span style={{ color: "#9d978d" }}>MagVerse</span>
                  <span style={{ color: "#fff", fontWeight: 700 }}>+ 240 USDC</span>
                </div>
              </GlassCard>
            </div>
          </div>
        </section>

        {/* ── Protocol Ticker ── */}
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12" style={{ paddingBottom: 32 }}>
          <div style={{
            padding: "14px 24px", borderRadius: 24,
            border: "1px solid rgba(255,255,255,0.10)",
            background: "linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))",
            backdropFilter: "blur(16px)", overflow: "hidden",
            display: "flex", alignItems: "center", gap: 24,
          }}>
            <div style={{ fontSize: 10, color: "#ffb072", letterSpacing: ".22em", fontFamily: "monospace", flexShrink: 0, textTransform: "uppercase" }}>Protocolos</div>
            <div style={{ flex: 1, maskImage: "linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)", WebkitMaskImage: "linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)", overflow: "hidden" }}>
              <div style={{ display: "flex", gap: 48, animation: "aquaTicker 32s linear infinite", width: "max-content" }}>
                {[...PROTOCOLS, ...PROTOCOLS].map((p, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, color: "#fff", fontSize: 17, fontWeight: 600, whiteSpace: "nowrap" }}>
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#ff5c00", boxShadow: "0 0 10px #ff5c00", display: "inline-block" }}/>
                    {p}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Stats Bar ── */}
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12" style={{ paddingBottom: 56 }}>
          <div style={{ display: "flex", borderRadius: 20, overflow: "hidden", border: "1px solid rgba(255,255,255,0.08)" }}>
            {[
              { value: "500+", label: "Hunters organizando bounties", color: "#ff5c00" },
              { value: "40+",  label: "Protocolos suportados",        color: "#ffb072" },
              { value: "87%",  label: "Taxa de entrega no prazo",     color: "#ffb59a" },
            ].map((stat, i) => (
              <div key={stat.label} style={{
                flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
                padding: "28px 16px", textAlign: "center",
                background: "linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))",
                backdropFilter: "blur(16px)",
                borderRight: i < 2 ? "1px solid rgba(255,255,255,0.08)" : "none",
              }}>
                <span style={{ fontSize: 36, fontWeight: 700, color: stat.color, letterSpacing: "-.02em" }}>{stat.value}</span>
                <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".12em", color: "#9d978d" }}>{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Features Section ── */}
        <section className="max-w-[1400px] mx-auto px-6 lg:px-12" style={{ paddingBottom: 80 }}>
          {/* Section header */}
          <div style={{ marginBottom: 36 }}>
            <div style={{ fontFamily: "monospace", fontSize: 11, letterSpacing: ".32em", textTransform: "uppercase", color: "#ff8a3a", marginBottom: 12 }}>
              O FLUXO
            </div>
            <h2 style={{
              fontFamily: "'SF Pro Display','Inter',sans-serif",
              fontSize: "clamp(28px, 3.5vw, 52px)", fontWeight: 700, letterSpacing: "-0.03em",
              lineHeight: 1, margin: "0 0 10px",
            }}>
              Ferramentas de Próxima Geração.<br/>
              <span style={{
                background: "linear-gradient(180deg, #ffb072 0%, #ff5c00 45%, #c23a00 100%)",
                WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent",
                filter: "drop-shadow(0 4px 20px rgba(255,92,0,0.3))",
              }}>
                Orchestrate Work. Ship Faster.
              </span>
            </h2>
            <p style={{ fontSize: 14, color: "#9d978d" }}>Arquitetura modular para escalabilidade infinita.</p>
          </div>

          <motion.div initial="hidden" variants={staggerContainer} viewport={{ once: true }} whileInView="visible">
            {/* Row 1 */}
            <div className="grid md:grid-cols-3 gap-5 mb-5">
              <motion.div className="md:col-span-1" variants={fadeInUp}>
                <MotionBentoCard title="Rede de Protocolos" description="Conectado aos maiores protocolos DeFi e NFT do ecossistema. Um catálogo vivo, sempre atualizado." feature="protocols" href="/auth/signup"/>
              </motion.div>
              <motion.div className="md:col-span-2" variants={fadeInUp}>
                <MotionBentoCard title="Gestão de Campanhas" description="Orquestre cada campanha de bounty do início ao fim com total visibilidade e controle." feature="spotlight" spotlightItems={["Reordenação de etapas por drag & drop","Fluxo multi-status (Todo → Em Progresso → Concluído)","Campanhas vinculadas a protocolos","Rastreamento de prazo com alertas","Progresso visual por etapa"]} href="/auth/signup"/>
              </motion.div>
            </div>
            {/* Row 2 */}
            <div className="grid md:grid-cols-3 gap-5 mb-5">
              <motion.div className="md:col-span-2" variants={fadeInUp}>
                <MotionBentoCard title="Alertas Inteligentes" description="Sistema de alertas ciente de prazos que mantém sua equipe sempre no ritmo certo." feature="metrics" metrics={[{label:"Cobertura de prazos",value:95,suffix:"%"},{label:"Entrega no prazo",value:87,suffix:"%"},{label:"Resposta a alertas",value:78,suffix:"%"}]} href="/auth/signup"/>
              </motion.div>
              <motion.div className="md:col-span-1" variants={fadeInUp}>
                <MotionBentoCard title="Ciclo do Bounty" description="Da descoberta ao pagamento, cada etapa rastreada em tempo real." feature="timeline" timeline={[{year:"01",event:"Protocolo atribuído & campanha criada"},{year:"02",event:"Etapas definidas com prazos"},{year:"03",event:"Em execução — alertas ativos"},{year:"04",event:"Revisão & submissão"},{year:"05",event:"Pagamento confirmado"}]} href="/auth/signup"/>
              </motion.div>
            </div>
            {/* Row 3 */}
            <div className="grid md:grid-cols-3 gap-5">
              <motion.div variants={fadeInUp}>
                <MotionBentoCard title="Organização Total" description="Protocolos, steps, links e prazos em um só lugar. Zero planilha, zero caos." feature="spotlight" spotlightItems={["Links de evidência por campanha","Steps com status e prazos","Histórico completo de submissões","Protocolos organizados por categoria"]} href="/auth/signup"/>
              </motion.div>
              <motion.div variants={fadeInUp}>
                <MotionBentoCard title="Sistema de Indicação" description="Indique outros hunters e multiplique suas recompensas. Programa exclusivo para membros." feature="counter" statistic={{value:"2.4×",label:"MULTIPLICADOR DE RECOMPENSA",start:1.8,end:2.4,suffix:"×"}} href="/auth/signup"/>
              </motion.div>
              <motion.div variants={fadeInUp}>
                <MotionBentoCard title="Bounty AI — Algoritmo X" description="Analise seus posts com o algoritmo Phoenix (xAI 2026) antes de publicar. Score 0-100 em tempo real." feature="bountyai" href="/auth/signup"/>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* ── Pricing ── */}
        <section className="max-w-[1400px] mx-auto px-6 lg:px-12" style={{ paddingBottom: 96 }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <div style={{ fontFamily: "monospace", fontSize: 11, letterSpacing: ".32em", textTransform: "uppercase", color: "#ff8a3a", marginBottom: 12 }}>PLANOS</div>
            <h2 style={{ fontFamily: "'SF Pro Display','Inter',sans-serif", fontSize: 40, fontWeight: 700, letterSpacing: "-0.03em", margin: "0 0 8px" }}>Escolha o seu plano</h2>
            <p style={{ fontSize: 14, color: "#9d978d" }}>Comece grátis. Escale quando quiser.</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20, maxWidth: 1000, margin: "0 auto", alignItems: "start" }}>

            {/* ─ Trial ─ */}
            <GlassCard dark style={{ padding: 28, borderRadius: 24 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 6, height: 26, padding: "0 12px", borderRadius: 999, fontSize: 10, fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase", color: "#9d978d", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.14)" }}>
                  TRIAL
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "flex-end", gap: 8, marginBottom: 6 }}>
                <span style={{ fontSize: 42, fontWeight: 700, color: "#fff", letterSpacing: "-.02em" }}>Grátis</span>
              </div>
              <p style={{ fontSize: 12, color: "#9d978d", marginBottom: 20 }}>14 dias. Sem cartão de crédito.</p>
              <ul style={{ listStyle: "none", margin: "0 0 24px", padding: 0, display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  "Acesso completo ao PRO por 14 dias",
                  "Campanhas ilimitadas no período",
                  "Bounty AI incluso no trial",
                  "Todos os protocolos disponíveis",
                  "Sem cobrança até o prazo encerrar",
                ].map((f) => (
                  <li key={f} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 13, color: "#b0aaa2" }}>
                    <CheckCircle2 style={{ width: 14, height: 14, flexShrink: 0, color: "#9d978d", marginTop: 2 }}/>{f}
                  </li>
                ))}
              </ul>
              <Link href="/auth/signup" style={{
                display: "flex", alignItems: "center", justifyContent: "center",
                width: "100%", height: 46, borderRadius: 999,
                background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.18)",
                color: "#e7e3dd", fontSize: 12, fontWeight: 700, textTransform: "uppercase",
                letterSpacing: ".08em", textDecoration: "none",
              }}>
                Começar trial gratuito
              </Link>
            </GlassCard>

            {/* ─ PRO ─ */}
            <GlassCard dark style={{ padding: 28, borderRadius: 24 }}>
              <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 1, background: "linear-gradient(90deg, transparent, rgba(255,92,0,0.7), transparent)" }}/>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 6, height: 26, padding: "0 12px", borderRadius: 999, fontSize: 10, fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase", color: "#ff5c00", background: "rgba(255,92,0,0.08)", border: "1px solid rgba(255,92,0,0.4)" }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#ff5c00", boxShadow: "0 0 6px #ff5c00", display: "inline-block" }}/>PRO
                </span>
                <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".08em", color: "#e9c349" }}>MENSAL</span>
              </div>
              <div style={{ display: "flex", alignItems: "flex-end", gap: 8, marginBottom: 6 }}>
                <span style={{ fontSize: 42, fontWeight: 700, color: "#fff", letterSpacing: "-.02em" }}>R$ 39,90</span>
                <span style={{ fontSize: 13, color: "#9d978d", marginBottom: 9 }}>/mês</span>
              </div>
              <p style={{ fontSize: 12, color: "#9d978d", marginBottom: 20 }}>Faturado mensalmente. Cancele quando quiser.</p>
              <ul style={{ listStyle: "none", margin: "0 0 24px", padding: 0, display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  "Campanhas ilimitadas",
                  "Alertas automáticos de prazo",
                  "Bounty AI — Análise de Conteúdo",
                  "Referral system completo",
                  "Todos os protocolos suportados",
                  "Suporte prioritário",
                ].map((f) => (
                  <li key={f} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 13, color: "#e7e3dd" }}>
                    <CheckCircle2 style={{ width: 14, height: 14, flexShrink: 0, color: "#ff5c00", marginTop: 2 }}/>{f}
                  </li>
                ))}
              </ul>
              <Link href="/auth/signup" style={{
                display: "flex", alignItems: "center", justifyContent: "center",
                width: "100%", height: 46, borderRadius: 999,
                background: "linear-gradient(180deg, #ff9b50 0%, #ff6a14 38%, #d44600 100%)",
                boxShadow: "0 1px 0 rgba(255,255,255,0.55) inset, 0 6px 18px -4px rgba(255,92,0,0.55)",
                color: "#fff", fontSize: 12, fontWeight: 700, textTransform: "uppercase",
                letterSpacing: ".08em", textDecoration: "none", position: "relative", overflow: "hidden",
              }}>
                <span style={{ position: "absolute", left: "6%", right: "6%", top: 3, height: "36%", borderRadius: 999, background: "linear-gradient(180deg, rgba(255,255,255,0.65), transparent)", filter: "blur(.4px)" }}/>
                <span style={{ position: "relative" }}>Assinar PRO</span>
              </Link>
              <p style={{ textAlign: "center", fontSize: 10, color: "#9d978d", marginTop: 10 }}>Após 14 dias de trial gratuito.</p>
            </GlassCard>

            {/* ─ Hunter (Anual) ─ */}
            <div style={{ position: "relative" }}>
              {/* Glow ring behind card */}
              <div style={{ position: "absolute", inset: -2, borderRadius: 26, background: "linear-gradient(135deg, #ff5c00, #ff9b50, #ff5c00)", opacity: 0.5, filter: "blur(12px)", zIndex: 0, pointerEvents: "none" }}/>
              <GlassCard dark style={{ padding: 28, borderRadius: 24, position: "relative", zIndex: 1, border: "1px solid rgba(255,140,60,0.45)" }}>
                <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 1, background: "linear-gradient(90deg, transparent, rgba(255,160,80,0.9), transparent)" }}/>

                {/* Recomendado badge */}
                <div style={{ position: "absolute", top: -13, left: "50%", transform: "translateX(-50%)", zIndex: 2 }}>
                  <span style={{
                    display: "inline-flex", alignItems: "center", gap: 5,
                    padding: "4px 14px", borderRadius: 999, fontSize: 9, fontWeight: 800,
                    letterSpacing: ".14em", textTransform: "uppercase",
                    background: "linear-gradient(90deg, #ff6a14, #ff9b50)",
                    color: "#fff", boxShadow: "0 4px 14px rgba(255,92,0,0.55)",
                  }}>
                    ★ RECOMENDADO
                  </span>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, marginTop: 8 }}>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 6, height: 26, padding: "0 12px", borderRadius: 999, fontSize: 10, fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase", color: "#ffb059", background: "rgba(255,140,60,0.12)", border: "1px solid rgba(255,140,60,0.45)" }}>
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#ff9b50", boxShadow: "0 0 6px #ff9b50", display: "inline-block" }}/>HUNTER
                  </span>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".06em", color: "#4ade80", background: "rgba(74,222,128,0.10)", border: "1px solid rgba(74,222,128,0.28)", padding: "2px 8px", borderRadius: 999 }}>
                    −16% desc.
                  </span>
                </div>

                <div style={{ display: "flex", alignItems: "flex-end", gap: 8, marginBottom: 4 }}>
                  <span style={{ fontSize: 42, fontWeight: 700, color: "#fff", letterSpacing: "-.02em" }}>R$ 400</span>
                  <span style={{ fontSize: 13, color: "#9d978d", marginBottom: 9 }}>/ano</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                  <span style={{ fontSize: 12, color: "#ffb059", fontWeight: 600 }}>≈ R$ 33,33/mês</span>
                  <span style={{ fontSize: 11, color: "#9d978d" }}>·</span>
                  <span style={{ fontSize: 11, color: "#4ade80" }}>Economize R$ 78,80</span>
                </div>
                <p style={{ fontSize: 12, color: "#9d978d", marginBottom: 20 }}>Pagamento único anual.</p>

                <ul style={{ listStyle: "none", margin: "0 0 24px", padding: 0, display: "flex", flexDirection: "column", gap: 10 }}>
                  {[
                    { text: "Tudo do PRO mensal incluso", highlight: false },
                    { text: "Early access — novas features antes de todos", highlight: true },
                    { text: "Acesso antecipado a protocolos beta", highlight: true },
                    { text: "Badge exclusivo \"Hunter Verificado\" no perfil", highlight: true },
                    { text: "Relatórios avançados de performance anual", highlight: false },
                    { text: "Exportação CSV + JSON das campanhas", highlight: false },
                    { text: "Suporte VIP — resposta em até 4h", highlight: true },
                  ].map(({ text, highlight }) => (
                    <li key={text} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 13, color: highlight ? "#ffd9a8" : "#e7e3dd" }}>
                      <CheckCircle2 style={{ width: 14, height: 14, flexShrink: 0, color: "#ff9b50", marginTop: 2 }}/>{text}
                    </li>
                  ))}
                </ul>

                <Link href="/auth/signup" style={{
                  display: "flex", alignItems: "center", justifyContent: "center",
                  width: "100%", height: 46, borderRadius: 999,
                  background: "linear-gradient(180deg, #ffb870 0%, #ff7a1f 38%, #c93e00 100%)",
                  boxShadow: "0 1px 0 rgba(255,255,255,0.60) inset, 0 8px 24px -4px rgba(255,92,0,0.70)",
                  color: "#fff", fontSize: 12, fontWeight: 700, textTransform: "uppercase",
                  letterSpacing: ".08em", textDecoration: "none", position: "relative", overflow: "hidden",
                }}>
                  <span style={{ position: "absolute", left: "6%", right: "6%", top: 3, height: "36%", borderRadius: 999, background: "linear-gradient(180deg, rgba(255,255,255,0.70), transparent)", filter: "blur(.4px)" }}/>
                  <span style={{ position: "relative" }}>Assinar Hunter →</span>
                </Link>
                <p style={{ textAlign: "center", fontSize: 10, color: "#9d978d", marginTop: 10 }}>14 dias de trial. Cobrado anualmente.</p>
              </GlassCard>
            </div>

          </div>
        </section>
      </main>

      {/* ── Footer ── */}
      <footer style={{
        position: "relative", zIndex: 1,
        borderTop: "1px solid rgba(255,255,255,0.06)",
        padding: "24px 48px 32px",
        display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12,
        fontSize: 11, color: "#9d978d", fontFamily: "monospace", letterSpacing: ".12em",
      }}>
        <span>© {new Date().getFullYear()} BOUNTY WORKFLOW · BRASIL</span>
        <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
          <Link href="/legal/privacidade" style={{ color: "#9d978d", textDecoration: "none" }}>Privacidade</Link>
          <Link href="/legal/termos"      style={{ color: "#9d978d", textDecoration: "none" }}>Termos de Uso</Link>
          <span style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <LiveDot/> SISTEMA OPERACIONAL · v2.6
          </span>
        </div>
      </footer>

      {/* ── Cookie Consent ── */}
      <AnimatePresence>
        {!cookieAccepted && (
          <motion.div
            initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            style={{
              position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 100,
              padding: "16px 24px", display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap",
              borderTop: "1px solid rgba(255,255,255,0.08)",
              background: "rgba(10,8,6,0.97)", backdropFilter: "blur(20px)",
            }}
          >
            <div style={{ display: "flex", alignItems: "flex-start", gap: 12, flex: 1 }}>
              <span className="material-symbols-outlined" style={{ fontSize: 20, color: "#e9c349", flexShrink: 0, marginTop: 2 }}>cookie</span>
              <p style={{ fontSize: 12, color: "#9d978d", lineHeight: 1.6, margin: 0 }}>
                Usamos cookies essenciais para autenticação e cookies analíticos para melhorar a plataforma. Ao continuar, você concorda com nossa{" "}
                <Link href="/legal/privacidade" style={{ color: "#e9c349" }}>Política de Privacidade</Link>.
              </p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
              <Link href="/legal/privacidade" style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".1em", color: "#5a554c", textDecoration: "none" }}>Saiba mais</Link>
              <button type="button" onClick={acceptCookies} style={{
                padding: "8px 20px", background: "#ff5c00", color: "#fff",
                fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".1em",
                borderRadius: 999, border: "none", cursor: "pointer",
              }}>Aceitar</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Demo Pipeline Modal ── */}
      <AnimatePresence>
        {showDemo && <DemoPipelineModal onClose={() => setShowDemo(false)} />}
      </AnimatePresence>
    </div>
  );
}

/* ── Demo Pipeline Modal ──────────────────────────────────────────── */
const PIPELINE_STEPS = [
  { number: "01", icon: "hub",                 title: "Escolha um Protocolo",       desc: "Acesse o Catálogo e selecione o protocolo do bounty — cada um com logo e link oficial.",                                                                                                   highlight: false },
  { number: "02", icon: "add_circle",          title: "Crie uma Campanha",          desc: "Nome claro, protocolo selecionado e prazo final definido. Sua campanha nasce organizada.",                                                                                                 highlight: false },
  { number: "03", icon: "account_tree",        title: "Monte o Fluxo de Etapas",    desc: "Adicione steps dentro da campanha — cada um com título, data e status independente.",                                                                                                      highlight: false },
  { number: "04", icon: "edit_note",           title: "Gerencie o Status",          desc: "Todo → Em Progresso → Concluído. Mude rapidamente sem abrir modais.",                                                                                                                       highlight: false },
  { number: "05", icon: "notifications_active",title: "Configure Lembretes",        desc: "Alertas automáticos 48h antes dos prazos. Nunca perca uma entrega crítica.",                                                                                                               highlight: false },
  { number: "06", icon: "inventory_2",         title: "Finalize e Arquive",         desc: "Campanha entregue? Arquive com um clique. Histórico completo como portfólio.",                                                                                                              highlight: false },
  { number: "07", icon: "bolt",                title: "Bounty AI — Algoritmo X",    desc: "Analise cada post antes de publicar. Score 0-100 baseado no algoritmo Phoenix (xAI, 2026). Detecta links, hashtags, threads e sugere reescrita com IA.",                                  highlight: true  },
];

function DemoPipelineModal({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose}/>
      <motion.div
        className="relative z-10 w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl"
        initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
        style={{ background: "rgba(14,13,13,0.98)", border: "1px solid rgba(255,92,0,0.25)", boxShadow: "0 0 80px rgba(255,92,0,0.15)" }}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between px-8 py-5 border-b border-zinc-800/60"
          style={{ background: "rgba(14,13,13,0.98)", backdropFilter: "blur(20px)" }}>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#ff5c00] mb-0.5">Pipeline completo</p>
            <h2 className="text-xl font-bold text-on-surface">Do protocolo ao Bounty AI — 7 passos</h2>
          </div>
          <button type="button" onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-tertiary hover:text-on-surface hover:bg-zinc-800 transition">
            <X className="w-4 h-4"/>
          </button>
        </div>
        <div className="px-8 py-8">
          <div className="relative">
            <div className="absolute left-[27px] top-0 bottom-0 w-[2px]" style={{ background: "linear-gradient(to bottom, rgba(255,92,0,0.5), rgba(233,195,73,0.6))" }}/>
            <div className="flex flex-col gap-0">
              {PIPELINE_STEPS.map((step, i) => (
                <motion.div key={step.number} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.06 * i, duration: 0.35 }}
                  className={`relative flex gap-5 pb-6 ${step.highlight ? "pb-4" : ""}`}>
                  <div className="relative z-10 shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center"
                    style={step.highlight
                      ? { background: "linear-gradient(135deg, rgba(255,92,0,0.2), rgba(233,195,73,0.15))", border: "2px solid rgba(233,195,73,0.5)", boxShadow: "0 0 24px rgba(233,195,73,0.2)" }
                      : { background: "rgba(255,92,0,0.08)", border: "1px solid rgba(255,92,0,0.2)" }}>
                    <span className="material-symbols-outlined text-[24px]" style={{ color: step.highlight ? "#e9c349" : "#ff5c00" }}>{step.icon}</span>
                  </div>
                  <div className={`flex-1 rounded-xl p-4 ${step.highlight ? "relative overflow-hidden" : ""}`}
                    style={step.highlight
                      ? { background: "linear-gradient(135deg, rgba(255,92,0,0.07), rgba(233,195,73,0.05))", border: "1px solid rgba(233,195,73,0.3)", boxShadow: "0 0 30px rgba(233,195,73,0.06)" }
                      : { background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
                    {step.highlight && <div className="absolute inset-x-0 top-0 h-[1px]" style={{ background: "linear-gradient(90deg, transparent, rgba(233,195,73,0.6), transparent)" }}/>}
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-black tracking-widest px-2 py-0.5 rounded-full"
                        style={step.highlight ? { background: "rgba(233,195,73,0.15)", color: "#e9c349", border: "1px solid rgba(233,195,73,0.3)" } : { background: "rgba(255,92,0,0.1)", color: "#ff5c00", border: "1px solid rgba(255,92,0,0.2)" }}>
                        STEP {step.number}
                      </span>
                      {step.highlight && <span className="text-[10px] font-bold uppercase tracking-widest text-[#e9c349] flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-[#e9c349] animate-pulse"/>Destaque</span>}
                    </div>
                    <h3 className="font-semibold text-base mb-1" style={{ color: step.highlight ? "#e9c349" : "var(--color-on-surface)" }}>{step.title}</h3>
                    <p className="text-sm text-tertiary leading-relaxed">{step.desc}</p>
                    {step.highlight && (
                      <div className="mt-3 flex gap-3">
                        <div className="flex items-center gap-1.5 rounded-lg px-3 py-1.5" style={{ background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)" }}>
                          <span className="w-2 h-2 rounded-full bg-[#22c55e]"/><span className="text-[10px] font-bold text-[#22c55e] uppercase tracking-widest">Score A — 90/100</span>
                        </div>
                        <div className="flex items-center gap-1.5 rounded-lg px-3 py-1.5" style={{ background: "rgba(255,92,0,0.08)", border: "1px solid rgba(255,92,0,0.2)" }}>
                          <span className="material-symbols-outlined text-[12px] text-[#ff5c00]">auto_fix_high</span>
                          <span className="text-[10px] font-bold text-[#ff5c00] uppercase tracking-widest">Reescrita com IA</span>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
        <div className="px-8 pb-8 flex gap-4">
          <Link href="/auth/signup" onClick={onClose} className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-[#ff5c00] hover:bg-[#ff7b33] text-white text-sm font-bold uppercase tracking-widest rounded-lg transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,92,0,0.4)]">
            Começar grátis — 14 dias
          </Link>
          <Link href="/como-usar" onClick={onClose} className="px-6 py-3.5 text-sm font-bold uppercase tracking-widest rounded-lg border border-zinc-700 text-tertiary hover:text-on-surface hover:border-zinc-500 transition-all">
            Tutorial completo
          </Link>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ── Motion variants ──────────────────────────────────────────────── */
const fadeInUp: Variants = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};
const staggerContainer: Variants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.2 } },
};

/* ── Bento sub-components ─────────────────────────────────────────── */
function BentoSpotlight({ items }: { items: string[] }) {
  return (
    <ul className="mt-3 space-y-2">
      {items.map((item, i) => (
        <motion.li key={item} className="flex items-center gap-2" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 * i }}>
          <CheckCircle2 className="h-4 w-4 shrink-0 text-[#ff5c00]"/>
          <span className="text-sm text-tertiary">{item}</span>
        </motion.li>
      ))}
    </ul>
  );
}

function BentoMetrics({ metrics }: { metrics: Array<{ label: string; value: number; suffix?: string }> }) {
  return (
    <div className="mt-4 space-y-3">
      {metrics.map((m, i) => (
        <motion.div key={m.label} className="space-y-1" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 * i }}>
          <div className="flex justify-between text-xs">
            <span className="font-medium text-tertiary">{m.label}</span>
            <span className="font-semibold text-[#ffb59a]">{m.value}{m.suffix}</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full" style={{ background: "rgba(255,92,0,0.12)" }}>
            <motion.div className="h-full rounded-full" style={{ background: "linear-gradient(90deg, #ff5c00, #ffb59a)" }}
              initial={{ width: 0 }} animate={{ width: `${m.value}%` }} transition={{ duration: 1.2, ease: "easeOut", delay: 0.15 * i }}/>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function BentoTimeline({ items }: { items: Array<{ year: string; event: string }> }) {
  return (
    <div className="relative mt-3">
      <div className="absolute top-0 bottom-0 left-[9px] w-[2px]" style={{ background: "rgba(255,92,0,0.2)" }}/>
      {items.map((item, i) => (
        <motion.div key={item.year} className="relative mb-3 flex gap-3" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 * i }}>
          <div className="z-10 mt-0.5 h-5 w-5 shrink-0 rounded-full border-2 flex items-center justify-center" style={{ borderColor: "rgba(255,92,0,0.5)", background: "rgba(255,92,0,0.1)" }}/>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-[#ff5c00]">{item.year}</div>
            <div className="text-xs text-tertiary mt-0.5">{item.event}</div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function BentoCounter({ start, end, suffix }: { start: number; end: number; suffix: string }) {
  const [count, setCount] = useState(start);
  useEffect(() => {
    const duration = 2000; const fps = 1000 / 60; const frames = Math.round(duration / fps);
    let frame = 0;
    const id = setInterval(() => {
      frame++;
      const p = 1 - (1 - frame / frames) ** 3;
      setCount(Math.min(start + (end - start) * p, end));
      if (frame === frames) clearInterval(id);
    }, fps);
    return () => clearInterval(id);
  }, [start, end]);
  return (
    <div className="mt-4 flex items-baseline gap-1">
      <span className="font-bold text-4xl" style={{ color: "#ff5c00" }}>{count % 1 === 0 ? count.toFixed(0) : count.toFixed(1)}</span>
      <span className="text-2xl font-bold text-[#ffb59a]">{suffix}</span>
    </div>
  );
}

function BentoProtocols() {
  const protocols = [
    { name: "Nano Creators", domain: "nanoscreators.xyz" },
    { name: "CryptokMe",     domain: "cryptok.me" },
    { name: "Earn",          domain: "superteam.fun" },
    { name: "CreatorVerse",  domain: "thecreatorverse.xyz" },
    { name: "DRiP",          domain: "drip.haus" },
    { name: "40+",           domain: null },
  ];
  return (
    <div className="mt-4 grid grid-cols-3 gap-3">
      {protocols.map((p) => (
        <motion.div key={p.name} className="flex flex-col items-center gap-1.5 rounded-xl p-2.5 transition-all duration-300"
          style={{ background: "rgba(255,92,0,0.06)", border: "1px solid rgba(255,92,0,0.12)" }}
          whileHover={{ borderColor: "rgba(255,92,0,0.35)", background: "rgba(255,92,0,0.1)" }}>
          <div className="h-8 w-8 rounded-full overflow-hidden flex items-center justify-center" style={{ background: "rgba(255,92,0,0.1)" }}>
            {p.domain
              // eslint-disable-next-line @next/next/no-img-element
              ? <img src={`https://www.google.com/s2/favicons?sz=64&domain=${p.domain}`} alt={p.name} className="w-5 h-5 object-contain"/>
              : <span className="text-[#ff5c00] text-xs font-bold">+</span>
            }
          </div>
          <span className="text-[9px] font-bold uppercase tracking-widest text-tertiary text-center leading-tight">{p.name}</span>
        </motion.div>
      ))}
    </div>
  );
}

function BentoAI() {
  return (
    <div className="mt-4 flex flex-col gap-2">
      <div className="flex items-center justify-between mb-1">
        <span className="text-[10px] font-bold uppercase tracking-widest text-tertiary">Score Phoenix</span>
        <span className="text-lg font-bold" style={{ color: "#22c55e" }}>82<span className="text-xs text-tertiary font-normal">/100</span></span>
      </div>
      <div className="h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
        <motion.div className="h-full rounded-full" style={{ background: "#22c55e" }} initial={{ width: 0 }} animate={{ width: "82%" }} transition={{ duration: 1.2, ease: "easeOut" }}/>
      </div>
      <div className="grid grid-cols-2 gap-1.5 mt-1">
        {[{ label: "Thread" },{ label: "Sem links" },{ label: "Hashtags 2" },{ label: "3 Emojis" }].map((h) => (
          <div key={h.label} className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5" style={{ background: "rgba(34,197,94,0.06)", border: "1px solid rgba(34,197,94,0.15)" }}>
            <span className="material-symbols-outlined text-[11px] text-[#22c55e]">check_circle</span>
            <span className="text-[10px] font-semibold text-[#22c55e]">{h.label}</span>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-1.5 mt-1 rounded-lg px-3 py-2" style={{ background: "rgba(255,92,0,0.07)", border: "1px solid rgba(255,92,0,0.2)" }}>
        <span className="material-symbols-outlined text-[13px] text-[#ff5c00]">auto_fix_high</span>
        <span className="text-[10px] font-bold text-[#ff5c00] uppercase tracking-widest">Versão otimizada disponível</span>
      </div>
    </div>
  );
}

/* ── MotionBentoCard ─────────────────────────────────────────────── */
function MotionBentoCard({
  title, description, feature, spotlightItems, timeline, metrics, statistic, href,
}: {
  title: string; description: string;
  feature: "spotlight" | "metrics" | "timeline" | "counter" | "chart" | "protocols" | "bountyai";
  spotlightItems?: string[];
  timeline?: Array<{ year: string; event: string }>;
  metrics?: Array<{ label: string; value: number; suffix?: string }>;
  statistic?: { value: string; label: string; start: number; end: number; suffix: string };
  href: string;
}) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [2, -2]);
  const rotateY = useTransform(x, [-100, 100], [-2, 2]);
  const isAI = feature === "bountyai";

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const r = e.currentTarget.getBoundingClientRect();
    x.set(((e.clientX - r.left) / r.width - 0.5) * 100);
    y.set(((e.clientY - r.top) / r.height - 0.5) * 100);
  }
  function handleMouseLeave() { x.set(0); y.set(0); }

  const baseStyle: React.CSSProperties = {
    background: isAI
      ? "linear-gradient(180deg, rgba(40,20,5,0.65) 0%, rgba(10,5,2,0.75) 100%)"
      : "linear-gradient(180deg, rgba(255,255,255,0.09) 0%, rgba(255,255,255,0.03) 100%)",
    backdropFilter: "blur(28px) saturate(160%)",
    WebkitBackdropFilter: "blur(28px) saturate(160%)",
    border: isAI ? "1px solid rgba(233,195,73,0.22)" : "1px solid rgba(255,255,255,0.16)",
    boxShadow: "0 1px 0 rgba(255,255,255,0.14) inset, 0 30px 60px -25px rgba(0,0,0,0.55), 0 10px 24px -10px rgba(0,0,0,0.4)",
  };

  return (
    <motion.div className="h-full" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      variants={fadeInUp} whileHover={{ y: -4 }}>
      <Link href={href} className="group relative flex h-full min-h-[22rem] flex-col gap-3 rounded-2xl p-6 transition-all duration-500"
        style={{ ...baseStyle, transform: "translateZ(0)" }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.border = isAI ? "1px solid rgba(233,195,73,0.48)" : "1px solid rgba(255,255,255,0.28)";
          (e.currentTarget as HTMLElement).style.boxShadow = "0 1px 0 rgba(255,255,255,0.18) inset, 0 30px 60px -25px rgba(0,0,0,0.6), 0 0 30px rgba(255,92,0,0.08)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.border = isAI ? "1px solid rgba(233,195,73,0.22)" : "1px solid rgba(255,255,255,0.16)";
          (e.currentTarget as HTMLElement).style.boxShadow = "0 1px 0 rgba(255,255,255,0.14) inset, 0 30px 60px -25px rgba(0,0,0,0.55), 0 10px 24px -10px rgba(0,0,0,0.4)";
        }}>
        {/* specular top edge */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[1px] rounded-t-2xl"
          style={{ background: isAI ? "linear-gradient(90deg, transparent, rgba(233,195,73,0.5), transparent)" : "linear-gradient(90deg, transparent, rgba(255,255,255,0.22), transparent)" }}/>
        <div className="pointer-events-none absolute inset-0 rounded-2xl"
          style={{ background: isAI ? "linear-gradient(to bottom, rgba(233,195,73,0.04) 0%, transparent 40%)" : "linear-gradient(to bottom, rgba(255,255,255,0.04) 0%, transparent 36%)" }}/>

        <div className="relative z-10 flex h-full flex-col" style={{ transform: "translateZ(20px)" }}>
          <div className="flex items-start justify-between mb-1">
            <div className="flex items-center gap-2">
              {isAI && <span className="material-symbols-outlined text-[18px] text-[#e9c349]">bolt</span>}
              <h3 className="font-semibold text-xl tracking-tight" style={{ color: isAI ? "#e9c349" : "var(--color-on-surface)" }}>{title}</h3>
            </div>
            <ArrowUpRight className="h-5 w-5 text-tertiary opacity-0 transition-opacity duration-200 group-hover:opacity-100 shrink-0 mt-0.5"/>
          </div>
          <p className="text-sm text-tertiary leading-relaxed">{description}</p>

          {feature === "spotlight"  && spotlightItems && <BentoSpotlight items={spotlightItems}/>}
          {feature === "metrics"    && metrics         && <BentoMetrics metrics={metrics}/>}
          {feature === "timeline"   && timeline        && <BentoTimeline items={timeline}/>}
          {feature === "protocols"                     && <BentoProtocols/>}
          {feature === "bountyai"                      && <BentoAI/>}
          {(feature === "counter" || feature === "chart") && statistic && (
            <div className="mt-auto pt-4">
              <BentoCounter start={statistic.start} end={statistic.end} suffix={statistic.suffix}/>
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#e9c349] mt-1">{statistic.label}</p>
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
