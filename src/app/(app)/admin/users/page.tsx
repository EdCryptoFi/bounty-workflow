import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { GlowCard } from "@/components/ui/glow-card";
import { UserActions } from "./user-actions-buttons";

export const metadata: Metadata = { title: "Admin · Usuários" };
export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const supabase = await createClient();

  const { data: users } = await supabase
    .from("users")
    .select("id, email, full_name, created_at, banned_at, plan, trial_ends_at")
    .order("created_at", { ascending: false });

  const { data: { user: currentUser } } = await supabase.auth.getUser();

  return (
    <div className="max-w-[1400px] mx-auto flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#ff5c00] mb-1">
            Gerenciamento
          </p>
          <h1 className="font-display text-[30px] font-semibold tracking-tight text-on-surface leading-tight">
            Usuários
          </h1>
          <p className="text-sm text-tertiary mt-1">
            {users?.length ?? 0} usuários cadastrados
          </p>
        </div>
      </div>

      {/* Users table */}
      <GlowCard>
        <div
          className="rounded-[11px] overflow-hidden"
          style={{ background: "rgba(24,23,23,0.9)", backdropFilter: "blur(20px)" }}
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-[10px] font-bold uppercase tracking-widest text-tertiary border-b border-zinc-800/60">
                <tr>
                  <th className="px-5 py-4 text-left">Usuário</th>
                  <th className="px-5 py-4 text-left">Email</th>
                  <th className="px-5 py-4 text-left">Cadastro</th>
                  <th className="px-5 py-4 text-left">Plano</th>
                  <th className="px-5 py-4 text-left">Status</th>
                  <th className="px-5 py-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/40">
                {(users ?? []).map((u) => {
                  const isBanned = !!u.banned_at;
                  const isCurrentUser = u.id === currentUser?.id;
                  const initials = (
                    u.full_name?.split(" ").map((w: string) => w[0]).join("").slice(0, 2) ??
                    u.email?.[0] ??
                    "?"
                  ).toUpperCase();

                  const trialActive = u.trial_ends_at && new Date(u.trial_ends_at) > new Date();
                  const planLabel = u.plan === "premium" ? "Premium" : trialActive ? "Trial" : "Expirado";
                  const planColor = u.plan === "premium" ? "#e9c349" : trialActive ? "#ffb59a" : "#6b7280";

                  return (
                    <tr
                      key={u.id}
                      className={`hover:bg-[rgba(255,92,0,0.03)] transition-colors ${isBanned ? "opacity-60" : ""}`}
                    >
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0"
                            style={{
                              background: isBanned ? "rgba(239,68,68,0.2)" : "rgba(255,92,0,0.2)",
                              border: `1px solid ${isBanned ? "rgba(239,68,68,0.3)" : "rgba(255,92,0,0.3)"}`,
                            }}
                          >
                            {initials}
                          </div>
                          <span className="text-sm font-medium text-on-surface truncate max-w-[150px]">
                            {u.full_name ?? "—"}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-xs text-tertiary">{u.email}</td>
                      <td className="px-5 py-3 text-xs text-tertiary">
                        {new Date(u.created_at).toLocaleDateString("pt-BR")}
                      </td>
                      <td className="px-5 py-3">
                        <span
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest"
                          style={{ color: planColor, background: `${planColor}15`, border: `1px solid ${planColor}30` }}
                        >
                          {planLabel}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        {isBanned ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-900/20 border border-red-900/40 text-[10px] font-bold uppercase tracking-widest text-red-400">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                            Banido
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[rgba(34,197,94,0.1)] border border-[rgba(34,197,94,0.3)] text-[10px] font-bold uppercase tracking-widest text-[#22c55e]">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e]" />
                            Ativo
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-3 text-right">
                        {!isCurrentUser && (
                          <UserActions userId={u.id} isBanned={isBanned} userName={u.full_name ?? u.email} />
                        )}
                        {isCurrentUser && (
                          <span className="text-[10px] font-bold uppercase tracking-widest text-tertiary">
                            Você
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {(users ?? []).length === 0 && (
            <div className="px-6 py-12 text-center text-sm text-tertiary">
              Nenhum usuário cadastrado.
            </div>
          )}
        </div>
      </GlowCard>
    </div>
  );
}
