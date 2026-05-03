import Link from "next/link";
import { Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 text-center">
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-mint-50 text-mint-700">
          <Compass className="h-6 w-6" />
        </div>
        <h1 className="mt-4 text-lg font-semibold">Página não encontrada</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Essa página sumiu, foi arquivada ou nunca existiu.
        </p>
        <div className="mt-6 flex justify-center gap-2">
          <Link
            href="/"
            className="rounded-lg bg-mint-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-mint-700"
          >
            Voltar pro início
          </Link>
          <Link
            href="/dashboard"
            className="rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium transition hover:bg-muted"
          >
            Abrir app
          </Link>
        </div>
      </div>
    </div>
  );
}
