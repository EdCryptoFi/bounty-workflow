import type { Metadata } from "next";
import { requireUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { paymentsEnabled } from "@/lib/payments/config";
import { SettingsTabs } from "@/components/settings/settings-tabs";

export const metadata: Metadata = { title: "Settings" };
export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const { user } = await requireUser();
  const supabase = await createClient();

  const [
    { data: profile },
    { data: billing },
    { data: sub },
    { count: campaignCount },
    { data: xAccounts },
  ] = await Promise.all([
    supabase
      .from("users")
      .select("full_name, handle, avatar_url, trial_ends_at, applied_code_id, wallet_address, referral_balance")
      .eq("id", user.id)
      .maybeSingle(),
    supabase
      .from("v_user_billing")
      .select("tier, trial_ends_at, derived_status")
      .eq("id", user.id)
      .maybeSingle(),
    supabase
      .from("subscriptions")
      .select("provider, status, current_period_end, cancel_at_period_end")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false })
      .maybeSingle(),
    supabase
      .from("campaigns")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .is("archived_at", null),
    supabase
      .from("user_x_accounts")
      .select("id, x_user_id, x_username, x_name, x_avatar_url, is_active")
      .eq("user_id", user.id)
      .eq("is_active", true),
  ]);

  // Fetch applied activation code if exists
  let appliedCode: string | null = null;
  if (profile?.applied_code_id) {
    const { data: codeRow } = await supabase
      .from("activation_codes")
      .select("code")
      .eq("id", profile.applied_code_id)
      .maybeSingle();
    appliedCode = codeRow?.code ?? null;
  }

  return (
    <div className="max-w-[1200px] mx-auto flex flex-col gap-6">
      <div>
        <h1 className="font-display text-[28px] font-semibold tracking-tight text-on-surface">
          Settings
        </h1>
        <p className="text-sm text-tertiary mt-1">
          Configure suas preferências, pagamento e armazenamento.
        </p>
      </div>

      <SettingsTabs
        profile={{
          full_name: profile?.full_name ?? null,
          handle: profile?.handle ?? null,
          avatar_url: profile?.avatar_url ?? null,
          email: user.email ?? "",
        }}
        billing={{
          tier: billing?.tier ?? "free",
          trialEnds: billing?.trial_ends_at ?? null,
          status: billing?.derived_status ?? "free",
          provider: sub?.provider ?? null,
          periodEnd: sub?.current_period_end ?? null,
          cancelAtPeriodEnd: sub?.cancel_at_period_end ?? false,
          campaignCount: campaignCount ?? 0,
          paymentsEnabled,
          walletAddress: (profile as { wallet_address?: string | null } | null)?.wallet_address ?? null,
          referralBalance: (profile as { referral_balance?: number | null } | null)?.referral_balance ?? 0,
        }}
        appliedCode={appliedCode}
        trialEndsAt={profile?.trial_ends_at ?? null}
        xAccounts={(xAccounts ?? []) as Array<{ id: string; x_username: string; x_name: string | null; x_avatar_url: string | null }>}
      />
    </div>
  );
}
