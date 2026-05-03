"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

/**
 * Toggle claro/escuro. Usa `mounted` pra evitar hydration mismatch
 * (o tema só é conhecido no client).
 */
export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = theme === "dark";
  const next = isDark ? "light" : "dark";

  return (
    <button
      type="button"
      aria-label={`Mudar pra modo ${isDark ? "claro" : "escuro"}`}
      onClick={() => setTheme(next)}
      className={
        className ??
        "inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition hover:bg-muted hover:text-foreground"
      }
    >
      {mounted ? (
        isDark ? (
          <Sun className="h-4 w-4" />
        ) : (
          <Moon className="h-4 w-4" />
        )
      ) : (
        // Placeholder pre-mount pra manter layout estável
        <span className="h-4 w-4" />
      )}
    </button>
  );
}
