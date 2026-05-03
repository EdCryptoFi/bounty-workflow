import { createClient } from "@/lib/supabase/server";
import { Clock, CheckCircle2, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui";

/**
 * Badge de billing — lê v_user_billing (view segura, C2 fix).
 * Nunca expõe provider_sub_id, period_end ou dados financeiros.
 */
export async function TrialBadge() {
  const supabase = await createClient();
  const { data } = await supabase.from("v_user_billing").select("*").maybeSingle();

  if (!data) return null;

  if (data.billing_status === "active") {
    return (
      <Badge tone="mint" icon={<CheckCircle2 className="h-3 w-3" />}>
        Plano ativo
      </Badge>
    );
  }

  if (data.billing_status === "past_due") {
    return (
      <Link href="/settings/billing">
        <Badge tone="warning" icon={<AlertTriangle className="h-3 w-3" />}>
          Pagamento pendente
        </Badge>
      </Link>
    );
  }

  if (data.billing_status === "trialing") {
    return (
      <Link href="/settings/billing">
        <Badge tone="mint" icon={<Clock className="h-3 w-3" />}>
          {data.trial_days_left} {data.trial_days_left === 1 ? "dia" : "dias"} de trial
        </Badge>
      </Link>
    );
  }

  return (
    <Link href="/settings/billing">
      <Badge tone="danger" icon={<AlertTriangle className="h-3 w-3" />}>
        Trial expirado
      </Badge>
    </Link>
  );
}
