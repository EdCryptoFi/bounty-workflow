import Link from "next/link";
import { Sparkles } from "lucide-react";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { buttonClasses } from "@/components/ui";

/**
 * Header das páginas públicas (landing, como-funciona, legal).
 * Mantém nav + CTA + toggle de tema consistente em todas.
 */
export function PublicHeader() {
  return (
    <header className="container flex h-16 items-center justify-between">
      <Link href="/" className="flex items-center gap-2 font-semibold">
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-mint-500 text-white">
          <Sparkles className="h-4 w-4" />
        </span>
        <span>Bounty WorkFlow</span>
      </Link>
      <nav className="flex items-center gap-3 text-sm">
        <Link
          href="/como-funciona"
          className="hidden text-muted-foreground hover:text-foreground sm:inline"
        >
          Como funciona
        </Link>
        <Link href="/auth/login" className="text-muted-foreground hover:text-foreground">
          Entrar
        </Link>
        <Link href="/auth/signup" className={buttonClasses("primary", "sm")}>
          Começar grátis
        </Link>
        <ThemeToggle />
      </nav>
    </header>
  );
}
