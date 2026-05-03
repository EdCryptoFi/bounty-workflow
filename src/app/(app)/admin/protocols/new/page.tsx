import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import { ProtocolForm } from "../form";

export const metadata: Metadata = { title: "Novo protocolo" };

export default function NewProtocolPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <Link
        href="/admin/protocols"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Voltar
      </Link>
      <h1 className="mb-6 text-2xl font-semibold tracking-tight">Novo protocolo</h1>
      <ProtocolForm />
    </div>
  );
}
