import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { NewCampaignForm } from "./new-form";

export const metadata: Metadata = { title: "Nova campanha" };

export default async function NewCampaignPage() {
  const supabase = await createClient();
  const { data: rawProtocols } = await supabase
    .from("protocols")
    .select("id, name, slug")
    .eq("is_active", true)
    .order("name");

  // Pin "Arquivo Pessoal" first
  const protocols = [...(rawProtocols ?? [])].sort((a, b) => {
    const aIsPersonal = a.slug === "arquivo-pessoal" || a.slug === "generico";
    const bIsPersonal = b.slug === "arquivo-pessoal" || b.slug === "generico";
    if (aIsPersonal) return -1;
    if (bIsPersonal) return 1;
    return 0;
  });

  return (
    <div className="mx-auto max-w-2xl">
      <Link
        href="/dashboard"
        className="mb-6 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-tertiary hover:text-[#ffb59a] transition-colors"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Voltar
      </Link>
      <p className="text-[10px] font-bold uppercase tracking-widest text-[#ff5c00] mb-1">Nova Campanha</p>
      <h1 className="font-display text-[30px] font-semibold tracking-tight text-on-surface leading-tight">
        Selecione o protocolo
      </h1>
      <p className="text-sm text-tertiary mt-1">
        Escolha o protocolo e configure os detalhes da sua campanha de bounty.
      </p>

      <NewCampaignForm protocols={protocols ?? []} />
    </div>
  );
}
