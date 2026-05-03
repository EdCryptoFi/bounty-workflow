"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";

/**
 * Global error boundary (client).
 * Next.js chama isso quando um RSC/Component crasha.
 *
 * Loga no console (que vira log do Vercel) e mostra UI amigável
 * com botão de reset.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Logar como JSON estruturado — o drainer do Vercel captura
    console.error(
      JSON.stringify({
        ts: new Date().toISOString(),
        level: "error",
        message: "unhandled client error",
        digest: error.digest,
        error: { name: error.name, message: error.message, stack: error.stack },
      }),
    );
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 text-center">
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-destructive/10 text-destructive">
          <AlertTriangle className="h-6 w-6" />
        </div>
        <h1 className="mt-4 text-lg font-semibold">Algo deu errado</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Uma falha inesperada aconteceu. Já registramos aqui e estamos vendo.
        </p>
        {error.digest && (
          <p className="mt-2 font-mono text-xs text-muted-foreground">
            ref: {error.digest}
          </p>
        )}
        <div className="mt-6 flex justify-center gap-2">
          <button
            onClick={() => reset()}
            className="rounded-lg bg-mint-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-mint-700"
          >
            Tentar de novo
          </button>
          <Link
            href="/"
            className="rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium transition hover:bg-muted"
          >
            Ir pro início
          </Link>
        </div>
      </div>
    </div>
  );
}
