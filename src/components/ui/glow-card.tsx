"use client";

import { useEffect, useRef, type ReactNode } from "react";

export function GlowCard({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sync = (e: PointerEvent) => {
      if (!ref.current) return;
      ref.current.style.setProperty("--x", e.clientX.toFixed(2));
      ref.current.style.setProperty("--xp", (e.clientX / window.innerWidth).toFixed(2));
      ref.current.style.setProperty("--y", e.clientY.toFixed(2));
      ref.current.style.setProperty("--yp", (e.clientY / window.innerHeight).toFixed(2));
    };
    document.addEventListener("pointermove", sync);
    return () => document.removeEventListener("pointermove", sync);
  }, []);

  return (
    <div
      ref={ref}
      data-glow
      className={`rounded-xl relative ${className}`}
      style={
        {
          "--base": "21",
          "--spread": "15",
          "--radius": "12",
          "--border": "1",
          "--backup-border": "rgba(91,65,55,0.4)",
          "--size": "280",
          "--outer": "1",
          "--border-size": "calc(var(--border, 1) * 1px)",
          "--spotlight-size": "calc(var(--size, 280) * 1px)",
          "--hue": "calc(var(--base) + (var(--xp, 0) * var(--spread, 0)))",
          backgroundImage:
            "radial-gradient(var(--spotlight-size) var(--spotlight-size) at calc(var(--x, 0) * 1px) calc(var(--y, 0) * 1px), hsl(var(--hue, 21) 100% 50% / 0.06), transparent)",
          backgroundSize:
            "calc(100% + (2 * var(--border-size))) calc(100% + (2 * var(--border-size)))",
          backgroundPosition: "50% 50%",
          backgroundAttachment: "fixed",
          border: "var(--border-size) solid var(--backup-border)",
        } as React.CSSProperties
      }
    >
      <div data-glow />
      {children}
    </div>
  );
}
