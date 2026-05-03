import type { Metadata } from "next";
import Link from "next/link";
import { Plus, Pencil } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { DeleteProtocolButton } from "./delete-button";
import { PageHeader, Badge, buttonClasses } from "@/components/ui";

export const metadata: Metadata = { title: "Admin · Protocolos" };
export const dynamic = "force-dynamic";

export default async function AdminProtocolsPage() {
  const supabase = await createClient();
  const { data: protocols } = await supabase
    .from("protocols")
    .select("*")
    .order("name");

  return (
    <div className="space-y-6">
      <PageHeader
        title="Protocolos"
        subtitle="CRUD do catálogo público. Somente admins podem editar."
        actions={
          <Link href="/admin/protocols/new" className={buttonClasses("primary", "md")}>
            <Plus className="h-4 w-4" /> Novo
          </Link>
        }
      />

      <div className="overflow-hidden rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
            <tr>
              <th className="px-4 py-3 text-left">Nome</th>
              <th className="px-4 py-3 text-left">Slug</th>
              <th className="px-4 py-3 text-left">Categoria</th>
              <th className="px-4 py-3 text-left">Ativo</th>
              <th className="px-4 py-3 text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {(protocols ?? []).map((p) => (
              <tr key={p.id} className="border-t border-border">
                <td className="px-4 py-3 font-medium">{p.name}</td>
                <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                  {p.slug}
                </td>
                <td className="px-4 py-3 text-muted-foreground">{p.category ?? "—"}</td>
                <td className="px-4 py-3">
                  <Badge tone={p.is_active ? "mint" : "neutral"} size="xs">
                    {p.is_active ? "ativo" : "inativo"}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="inline-flex items-center gap-1">
                    <Link
                      href={`/admin/protocols/${p.id}`}
                      className="rounded p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                      aria-label="Editar"
                    >
                      <Pencil className="h-4 w-4" />
                    </Link>
                    <DeleteProtocolButton id={p.id} name={p.name} />
                  </div>
                </td>
              </tr>
            ))}
            {(protocols ?? []).length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-sm text-muted-foreground">
                  Nenhum protocolo cadastrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
