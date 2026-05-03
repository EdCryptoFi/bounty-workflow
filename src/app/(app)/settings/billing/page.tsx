import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { paymentsEnabled } from "@/lib/payments/config";
import { UpgradeButton } from "./upgrade-button";
import { PageHeader, Card, Badge, type BadgeTone } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function BillingPage() {
  const { user } = await requireUser();
  const supabase = await createClient();

  const { data: billing } = await supabase
    .from("v_user_billing")
    .select("tier, trial_ends_at, derived_status")
    .eq("id", user.id)
    .maybeSingle();

  const { data: sub } = await supabase
    .from("subscriptions")
    .select("provider, status, current_period_end, cancel_at_period_end, plan_code")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false })
    .maybeSingle();

  const status = billing?.derived_status ?? "free";
  const trialEnds = billing?.trial_ends_at ? new Date(billing.trial_ends_at) : null;

  const statusTone: Record<string, BadgeTone> = {
    active: "success",
    trialing: "info",
    past_due: "warning",
    canceled: "neutral",
    free: "neutral",
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Billing" subtitle="Gerencie sua assinatura e plano." />

      <Card as="section">
        <div className="flex items-center justify-between">
          <div>
            <div className="typo-section-label">Plano atual</div>
            <div className="mt-1 text-2xl font-semibold capitalize">
              {billing?.tier ?? "free"}
            </div>
          </div>
          <Badge tone={statusTone[status] ?? "neutral"}>
            {status}
          </Badge>
        </div>

        <dl className="mt-6 grid gap-4 text-sm sm:grid-cols-2">
          {trialEnds && (
            <div>
              <dt className="typo-section-label">Trial termina em</dt>
              <dd className="mt-0.5 font-medium">{trialEnds.toLocaleDateString("pt-BR")}</dd>
            </div>
          )}
          {sub?.current_period_end && (
            <div>
              <dt className="typo-section-label">Próxima renovação</dt>
              <dd className="mt-0.5 font-medium">
                {new Date(sub.current_period_end).toLocaleDateString("pt-BR")}
              </dd>
            </div>
          )}
          {sub?.provider && (
            <div>
              <dt className="typo-section-label">Provider</dt>
              <dd className="mt-0.5 font-medium capitalize">{sub.provider}</dd>
            </div>
          )}
          {sub?.cancel_at_period_end && (
            <div className="sm:col-span-2">
              <dd className="rounded-md border border-warning/30 bg-warning-soft px-3 py-2 text-xs text-warning-foreground">
                Sua assinatura está marcada para cancelamento no fim do período.
              </dd>
            </div>
          )}
        </dl>
      </Card>

      <Card as="section">
        <h2 className="typo-h3">Pro</h2>
        <p className="mt-1 typo-caption">
          Campanhas ilimitadas, lembretes por email, export CSV, histórico completo.
        </p>
        <ul className="mt-4 space-y-1.5 text-sm">
          <li>· Campanhas ilimitadas</li>
          <li>· Notificações por email</li>
          <li>· Export CSV do histórico</li>
          <li>· Suporte prioritário</li>
        </ul>
        <div className="mt-5">
          <UpgradeButton enabled={paymentsEnabled && status !== "active"} />
          {!paymentsEnabled && (
            <p className="mt-2 text-xs text-muted-foreground">
              Pagamentos serão ativados em breve. Seu trial continua valendo.
            </p>
          )}
        </div>
      </Card>

      <p className="text-xs text-muted-foreground">
        Dúvidas?{" "}
        <Link href="mailto:suporte@bountyworkflow.app" className="underline">
          Fale com a gente
        </Link>
        .
      </p>
    </div>
  );
}
