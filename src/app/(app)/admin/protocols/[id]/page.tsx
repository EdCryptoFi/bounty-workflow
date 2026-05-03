import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { ProtocolForm } from "../form";
import type { Protocol } from "@/lib/types";

export const metadata: Metadata = { title: "Editar protocolo" };

export default async function EditProtocolPage({ params }: { params: { id: string } }) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("protocols")
    .select("*")
    .eq("id", params.id)
    .maybeSingle();

  if (!data) notFound();

  return (
    <div className="mx-auto max-w-2xl">
      <Link
        href="/admin/protocols"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Voltar
      </Link>
      <h1 className="mb-6 text-2xl font-semibold tracking-tight">Editar protocolo</h1>
      <ProtocolForm protocol={data as Protocol} />
    </div>
  );
}
