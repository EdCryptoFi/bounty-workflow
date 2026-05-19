"use client";

import { useState } from "react";
import Link from "next/link";
import { useFormStatus, useFormState } from "react-dom";
import { joinWaitlistAction, type WaitlistState } from "@/lib/waitlist/actions";

const AQUA_CSS = `
  @keyframes aquaBlob {
    0%   { transform: translate(0,0) scale(1) rotate(0deg); }
    50%  { transform: translate(10%,8%) scale(1.15) rotate(40deg); }
    100% { transform: translate(-6%,12%) scale(0.95) rotate(-25deg); }
  }
  @keyframes aquaPulse {
    0%   { box-shadow: 0 0 0 0 rgba(52,208,95,0.65); }
    70%  { box-shadow: 0 0 0 10px rgba(52,208,95,0); }
    100% { box-shadow: 0 0 0 0 rgba(52,208,95,0); }
  }
  @keyframes goldShimmerPL {
    0%   { background-position: 200% center; opacity: 0; }
    20%  { opacity: 1; }
    50%  { background-position: -200% center; opacity: 0.6; }
    80%  { opacity: 0; }
    100% { background-position: -200% center; opacity: 0; }
  }
  @keyframes countUp {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
  }
`;

function LiveDot() {
  return (
    <span style={{
      display: "inline-block", width: 8, height: 8, borderRadius: "50%",
      background: "#34d05f", flexShrink: 0,
      animation: "aquaPulse 1.6s infinite",
    }} />
  );
}

export function PreLancamentoClient({ initialCount, refCode }: { initialCount: number; refCode?: string }) {
  const [count] = useState(initialCount);
  const [state, action] = useFormState<WaitlistState, FormData>(joinWaitlistAction, null);

  return (
    <div style={{
      position: "relative", minHeight: "100vh",
      background: "radial-gradient(120% 80% at 80% -10%, rgba(255,92,0,0.22), transparent 60%), radial-gradient(80% 60% at -10% 110%, rgba(255,138,40,0.18), transparent 60%), linear-gradient(180deg, #0c0a07 0%, #060403 100%)",
      color: "#f7f5f2", overflowX: "hidden",
    }}>
      <style>{AQUA_CSS}</style>

      <div aria-hidden="true" style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
        <div style={{ position: "absolute", width: "60%", height: "60%", left: "60%", top: "-10%", background: "radial-gradient(closest-side, rgba(255,92,0,0.55), transparent 70%)", filter: "blur(60px)", opacity: 0.55, animation: "aquaBlob 18s ease-in-out infinite alternate" }} />
        <div style={{ position: "absolute", width: "50%", height: "50%", left: "-10%", top: "60%", background: "radial-gradient(closest-side, rgba(255,170,80,0.45), transparent 70%)", filter: "blur(60px)", opacity: 0.45, animation: "aquaBlob 22s ease-in-out -8s infinite alternate" }} />
      </div>

      <div aria-hidden="true" style={{ position: "fixed", inset: 0, pointerEvents: "none", opacity: 0.06, mixBlendMode: "overlay", zIndex: 0, backgroundImage: "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1   0 0 0 0 1   0 0 0 0 1   0 0 0 0.6 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")" }} />

      {/* Floating Pill Header */}
      <header style={{
        position: "fixed", top: 16, left: "50%", transform: "translateX(-50%)",
        width: "calc(100% - 40px)", maxWidth: 1200, zIndex: 50,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "10px 12px 10px 20px", borderRadius: 999,
        background: "linear-gradient(180deg, rgba(255,255,255,0.13), rgba(255,255,255,0.04))",
        border: "1px solid rgba(255,255,255,0.16)",
        boxShadow: "0 1px 0 rgba(255,255,255,0.18) inset, 0 30px 60px -25px rgba(0,0,0,0.6), 0 10px 30px -10px rgba(0,0,0,0.45)",
        backdropFilter: "blur(28px) saturate(160%)",
        WebkitBackdropFilter: "blur(28px) saturate(160%)",
      }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <div style={{ position: "relative", width: 34, height: 34, flexShrink: 0 }}>
            <img src="/logo-final.png" alt="Bounty Workflow" style={{ width: 34, height: 34, objectFit: "contain", borderRadius: 9 }} />
            <div style={{ position: "absolute", inset: 0, borderRadius: 9, background: "linear-gradient(110deg, transparent 20%, rgba(233,195,73,0.55) 50%, transparent 80%)", backgroundSize: "200% 100%", animation: "goldShimmerPL 5s ease-in-out infinite", pointerEvents: "none" }} />
          </div>
          <div style={{ lineHeight: 1 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#fff", letterSpacing: ".02em" }}>Bounty</div>
            <div style={{ fontSize: 12, fontWeight: 600, background: "linear-gradient(180deg,#ffb072,#ff5c00)", WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>WorkFlow</div>
          </div>
        </Link>
      </header>

      {/* Main Content */}
      <main style={{ position: "relative", zIndex: 1, paddingTop: 120 }}>
        <section className="max-w-[1200px] mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left — Copy */}
            <div>
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
                <LiveDot /> PRÉ-LANÇAMENTO
              </span>

              <h1 style={{
                fontFamily: "'SF Pro Display','Inter','Helvetica Neue',sans-serif",
                fontSize: "clamp(36px,5vw,72px)",
                fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 0.95,
                margin: "0 0 20px", color: "#f7f5f2",
              }}>
                Cansado de{" "}
                <span style={{ color: "#ff5c00" }}>perder prazos</span>
                {" "}de bounty?
              </h1>

              <p style={{ fontSize: 18, lineHeight: 1.55, color: "#e7e3dd", maxWidth: 520, margin: "0 0 12px", opacity: 0.85 }}>
                Organize protocolos, gerencie campanhas e receba alertas automáticos. Tudo em uma plataforma feita para hunters sérios do Brasil.
              </p>

              {/* Pain points */}
              <div style={{ margin: "24px 0 32px", display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  "❌ Planilhas perdidas e prazos estourados",
                  "❌ Alertas que nunca chegam na hora certa",
                  "❌ Zero visibilidade do seu pipeline de bounties",
                ].map((pain) => (
                  <div key={pain} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, color: "#b0aaa2" }}>
                    <span>{pain}</span>
                  </div>
                ))}
              </div>

              <p style={{ fontSize: 16, fontWeight: 600, color: "#ffb072", marginBottom: 8 }}>
                Chega de caos. Entre na lista de espera e seja o primeiro a usar.
              </p>

              {/* Social proof */}
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 32, padding: "16px 20px", borderRadius: 16, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                <div style={{ display: "flex" }}>
                  {["#ff8a3a","#ffaa54","#c23a00","#ff5c00","#7a2400"].map((c, i) => (
                    <div key={i} style={{ width: 28, height: 28, borderRadius: "50%", background: c, border: "2px solid #0a0807", marginLeft: i ? -8 : 0 }} />
                  ))}
                </div>
                <div style={{ fontSize: 13, color: "#e7e3dd" }}>
                  <strong style={{ color: "#fff" }}>{count > 0 ? count : "247"} criadores</strong> já estão na lista
                </div>
              </div>
            </div>

            {/* Right — Form */}
            <div>
              <div style={{
                background: "linear-gradient(180deg, rgba(40,20,5,0.60) 0%, rgba(10,5,2,0.70) 100%)",
                border: "1px solid rgba(255,255,255,0.20)",
                backdropFilter: "blur(28px) saturate(160%)",
                WebkitBackdropFilter: "blur(28px) saturate(160%)",
                boxShadow: "0 1px 0 rgba(255,255,255,0.18) inset, 0 30px 60px -25px rgba(0,0,0,0.6)",
                borderRadius: 24, padding: "36px 32px",
                position: "relative", overflow: "hidden",
              }}>
                <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "linear-gradient(180deg, rgba(255,255,255,0.32) 0%, rgba(255,255,255,0) 28%)", mixBlendMode: "screen", opacity: 0.5 }} />
                <div style={{ position: "relative", zIndex: 1 }}>
                  <h2 style={{ fontSize: 22, fontWeight: 700, color: "#fff", marginBottom: 6 }}>
                    Entrar na Lista de Espera
                  </h2>
                  <p style={{ fontSize: 13, color: "#9d978d", marginBottom: 24 }}>
                    Preencha seus dados e receba acesso antecipado.
                  </p>

                  <form action={action} className="flex flex-col gap-5">
                    {refCode && <input type="hidden" name="ref" value={refCode} />}
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="name" style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".1em", color: "#9d978d" }}>
                        Nome <span style={{ color: "#ff5c00" }}>*</span>
                      </label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        required
                        placeholder="Seu nome completo"
                        style={{
                          width: "100%", padding: "12px 14px", borderRadius: 12, fontSize: 14,
                          background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)",
                          color: "#fff", outline: "none",
                        }}
                        onFocus={(e) => e.currentTarget.style.borderColor = "rgba(255,92,0,0.5)"}
                        onBlur={(e) => e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"}
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="email" style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".1em", color: "#9d978d" }}>
                        Email <span style={{ color: "#ff5c00" }}>*</span>
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        placeholder="seu@email.com"
                        style={{
                          width: "100%", padding: "12px 14px", borderRadius: 12, fontSize: 14,
                          background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)",
                          color: "#fff", outline: "none",
                        }}
                        onFocus={(e) => e.currentTarget.style.borderColor = "rgba(255,92,0,0.5)"}
                        onBlur={(e) => e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"}
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="profile_type" style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".1em", color: "#9d978d" }}>
                        Perfil <span style={{ color: "#ff5c00" }}>*</span>
                      </label>
                      <select
                        id="profile_type"
                        name="profile_type"
                        required
                        style={{
                          width: "100%", padding: "12px 14px", borderRadius: 12, fontSize: 14,
                          background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)",
                          color: "#b0aaa2", outline: "none", appearance: "none",
                        }}
                        onFocus={(e) => e.currentTarget.style.borderColor = "rgba(255,92,0,0.5)"}
                        onBlur={(e) => e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"}
                      >
                        <option value="" disabled selected style={{ background: "#1a1714" }}>Selecione seu perfil</option>
                        <option value="creator" style={{ background: "#1a1714" }}>Criador de Conteúdo</option>
                        <option value="hunter" style={{ background: "#1a1714" }}>Bounty Hunter</option>
                        <option value="both" style={{ background: "#1a1714" }}>Ambos</option>
                      </select>
                    </div>

                    {state?.error && (
                      <div style={{ padding: "10px 14px", borderRadius: 10, fontSize: 13, background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#fca5a5" }}>
                        {state.error}
                      </div>
                    )}

                    {state?.ok && (
                      <div style={{ padding: "14px", borderRadius: 10, fontSize: 13, background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.3)", color: "#86efac", textAlign: "center", fontWeight: 600 }}>
                        ✅ {state.ok}
                      </div>
                    )}

                    {!state?.ok && <SubmitButton />}
                  </form>
                </div>
              </div>

              {/* Trust badges */}
              <div style={{ display: "flex", justifyContent: "center", gap: 24, marginTop: 24, fontSize: 11, color: "#5a554c" }}>
                <span>🔒 Dados seguros</span>
                <span>⚡ Sem spam</span>
                <span>🎯 Acesso antecipado</span>
              </div>
            </div>
          </div>

          {/* Benefits section */}
          <div style={{ marginTop: 80, marginBottom: 60 }}>
            <h2 style={{ textAlign: "center", fontSize: 28, fontWeight: 700, marginBottom: 40 }}>
              O que você vai ter
            </h2>
            <div className="grid md:grid-cols-3 gap-5">
              {[
                { icon: "notifications_active", title: "Alertas de Prazo", desc: "Notificações automáticas 48h antes de cada deadline. Nunca mais perca um bounty." },
                { icon: "account_tree", title: "Gestão de Campanhas", desc: "Organize cada bounty do início ao fim com pipeline visual, etapas e status." },
                { icon: "hub", title: "Rede de Protocolos", desc: "Conectado aos maiores protocolos. Catálogo vivo com links oficiais e informações." },
              ].map((benefit) => (
                <div key={benefit.title} style={{
                  padding: "28px 24px", borderRadius: 20,
                  background: "linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))",
                  border: "1px solid rgba(255,255,255,0.10)",
                  backdropFilter: "blur(16px)",
                  textAlign: "center",
                }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 36, color: "#ff5c00", marginBottom: 12, display: "block" }}>
                    {benefit.icon}
                  </span>
                  <h3 style={{ fontSize: 16, fontWeight: 600, color: "#fff", marginBottom: 8 }}>{benefit.title}</h3>
                  <p style={{ fontSize: 13, color: "#9d978d", lineHeight: 1.5 }}>{benefit.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer style={{
        position: "relative", zIndex: 1,
        borderTop: "1px solid rgba(255,255,255,0.06)",
        padding: "24px 48px 32px",
        display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12,
        fontSize: 11, color: "#9d978d",
      }}>
        <span>© {new Date().getFullYear()} BOUNTY WORKFLOW</span>
        <div style={{ display: "flex", gap: 24 }}>
          <Link href="/legal/privacidade" style={{ color: "#9d978d", textDecoration: "none" }}>Privacidade</Link>
          <Link href="/legal/termos" style={{ color: "#9d978d", textDecoration: "none" }}>Termos</Link>
        </div>
      </footer>
    </div>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      style={{
        width: "100%", padding: "14px", borderRadius: 999, border: "none", cursor: "pointer",
        fontSize: 14, fontWeight: 700, color: "#fff",
        background: "linear-gradient(180deg, #ff9b50 0%, #ff6a14 38%, #d44600 100%)",
        boxShadow: "0 1px 0 rgba(255,255,255,0.65) inset, 0 6px 18px -4px rgba(255,92,0,0.55)",
        opacity: pending ? 0.6 : 1,
      }}
    >
      {pending ? "Entrando na lista..." : "Quero acesso antecipado →"}
    </button>
  );
}
