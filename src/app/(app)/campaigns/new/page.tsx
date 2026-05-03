import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { NewCampaignForm } from "./new-form";

export const metadata: Metadata = { title: "Nova campanha" };

export default async function NewCampaignPage() {
  const supabase = await createClient();
  const { data: protocols } = await supabase
    .from("protocols")
    .select("id, name")
    .eq("is_active", true)
    .order("name");

  return (
    <div className="mx-auto max-w-2xl">
      <Link
        href="/dashboard"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Voltar
      </Link>
      <h1 className="text-2xl font-semibold tracking-tight">Nova campanha</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Crie uma nova caça de bounty. Você pode adicionar tarefas e anexos depois.
      </p>

      <NewCampaignForm protocols={protocols ?? []} />
    </div>
  );
}
