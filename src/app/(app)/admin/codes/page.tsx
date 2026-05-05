import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { PageHeader, buttonClasses } from "@/components/ui";
import { CreateCodeForm } from "./create-code-form";
import { DeleteCodeButton } from "./delete-code-button";

export const metadata: Metadata = { title: "Admin · Códigos de Ativação" };
export const dynamic = "force-dynamic";

export default async function AdminCodesPage() {
  const supabase = await createClient();
  const { data: codes } = await supabase
    .from("activation_codes")
    .select("id, code, days_free, created_at, used_by, used_at")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Códigos de Ativação"
        subtitle="Gere códigos para estender trials de usuários. Cada código é de uso único."
      />

      <CreateCodeForm />

      <div className="overflow-hidden rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
            <tr>
              <th className="px-4 py-3 text-left">Código</th>
              <th className="px-4 py-3 text-left">Dias Grátis</th>
              <th className="px-4 py-3 text-left">Criado em</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {(codes ?? []).map((c) => (
              <tr key={c.id} className="border-t border-border">
                <td className="px-4 py-3 font-mono font-bold text-[#ff5c00]">{c.code}</td>
                <td className="px-4 py-3 text-center font-bold">{c.days_free}</td>
                <td className="px-4 py-3 text-muted-foreground text-xs">
                  {new Date(c.created_at).toLocaleDateString("pt-BR")}
                </td>
                <td className="px-4 py-3">
                  {c.used_by ? (
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-muted text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                      Usado · {c.used_at ? new Date(c.used_at).toLocaleDateString("pt-BR") : ""}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[rgba(233,195,73,0.1)] border border-[rgba(233,195,73,0.3)] text-[10px] font-bold uppercase tracking-widest text-[#e9c349]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#e9c349]" />
                      Disponível
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  {!c.used_by && <DeleteCodeButton id={c.id} code={c.code} />}
                </td>
              </tr>
            ))}
            {(codes ?? []).length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-sm text-muted-foreground">
                  Nenhum código criado ainda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
