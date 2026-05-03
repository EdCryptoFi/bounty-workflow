"use client";

import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { Search } from "lucide-react";

/**
 * Busca global do topo.
 * Commit 1: navega para /dashboard?q=<termo> e deixa o Timeline filtrar server-side.
 * (Implementação completa de autocomplete entra no Commit 3.)
 */
export function SearchBar({
  placeholder = "Buscar campanhas, tarefas, protocolos…",
}: {
  placeholder?: string;
}) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // ⌘K / Ctrl+K foca o campo
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const term = q.trim();
    if (!term) return;
    router.push(`/dashboard?q=${encodeURIComponent(term)}`);
  }

  return (
    <form onSubmit={submit} className="relative flex-1 max-w-xl">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <input
        ref={inputRef}
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder={placeholder}
        className="h-10 w-full rounded-lg border border-border bg-card/60 pl-10 pr-14 text-sm placeholder:text-muted-foreground focus:border-mint-500 focus:outline-none focus:ring-2 focus:ring-mint-500/20"
        aria-label="Busca global"
      />
      <kbd className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 items-center gap-1 rounded border border-border bg-background px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground sm:inline-flex">
        ⌘K
      </kbd>
    </form>
  );
}
