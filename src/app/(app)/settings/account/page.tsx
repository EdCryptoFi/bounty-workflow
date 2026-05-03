import { requireUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { PageHeader, Card } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const { user } = await requireUser();
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("users")
    .select("id, email, full_name, handle, avatar_url, created_at")
    .eq("id", user.id)
    .maybeSingle();

  return (
    <div className="space-y-6">
      <PageHeader title="Conta" subtitle="Dados da sua conta. Edição em breve." />

      <Card as="section">
        <dl className="grid gap-4 text-sm sm:grid-cols-2">
          <div>
            <dt className="typo-section-label">Email</dt>
            <dd className="mt-0.5 font-medium">{profile?.email ?? user.email}</dd>
          </div>
          <div>
            <dt className="typo-section-label">Handle</dt>
            <dd className="mt-0.5 font-medium">{profile?.handle ?? "—"}</dd>
          </div>
          <div>
            <dt className="typo-section-label">Nome</dt>
            <dd className="mt-0.5 font-medium">{profile?.full_name ?? "—"}</dd>
          </div>
          <div>
            <dt className="typo-section-label">Desde</dt>
            <dd className="mt-0.5 font-medium">
              {profile?.created_at
                ? new Date(profile.created_at).toLocaleDateString("pt-BR")
                : "—"}
            </dd>
          </div>
        </dl>
      </Card>
    </div>
  );
}
