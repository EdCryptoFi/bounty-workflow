"use client";

import { useState } from "react";
import { GlowCard } from "@/components/ui/glow-card";
import { ProfilePanel } from "./profile-panel";
import { BillingPanel } from "./billing-panel";
import { DrivePanel, type AttachmentRow } from "./drive-panel";
import { ActivationCodePanel } from "./activation-code-panel";

type Tab = "settings" | "billing" | "drive";

const TABS: { id: Tab; label: string; subtitle: string; icon: string }[] = [
  { id: "settings", label: "Settings", subtitle: "Perfil e segurança", icon: "manage_accounts" },
  { id: "billing", label: "Pagamento", subtitle: "Plano e faturamento", icon: "credit_card" },
  { id: "drive", label: "Drive", subtitle: "Armazenamento", icon: "folder_open" },
];

type SettingsTabsProps = {
  profile: {
    full_name: string | null;
    handle: string | null;
    avatar_url: string | null;
    email: string;
  };
  billing: {
    tier: string;
    trialEnds: string | null;
    status: string;
    provider: string | null;
    periodEnd: string | null;
    cancelAtPeriodEnd: boolean;
    campaignCount: number;
    paymentsEnabled: boolean;
    walletAddress: string | null;
  };
  attachments: AttachmentRow[];
  appliedCode: string | null;
  trialEndsAt: string | null;
};

export function SettingsTabs({ profile, billing, attachments, appliedCode, trialEndsAt }: SettingsTabsProps) {
  const [active, setActive] = useState<Tab>("settings");

  return (
    <div className="flex flex-col gap-8">
      {/* Tab selector cards */}
      <div className="grid grid-cols-3 gap-4">
        {TABS.map((tab) => (
          <GlowCard
            key={tab.id}
            className={`cursor-pointer transition-all ${
              active === tab.id ? "shadow-[0_0_30px_rgba(255,92,0,0.2)]" : ""
            }`}
          >
            <button
              type="button"
              onClick={() => setActive(tab.id)}
              className={`w-full bg-[rgba(42,42,42,0.7)] backdrop-blur-xl rounded-[11px] p-5 flex items-center gap-4 transition-all text-left ${
                active === tab.id
                  ? "shadow-[inset_0_0_20px_rgba(255,92,0,0.08)]"
                  : "hover:bg-[rgba(52,52,52,0.5)]"
              }`}
            >
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-all ${
                  active === tab.id
                    ? "bg-[#ff5c00]/20 shadow-[0_0_15px_rgba(255,92,0,0.3)]"
                    : "bg-surface-container/50"
                }`}
              >
                <span
                  className={`material-symbols-outlined text-[20px] ${
                    active === tab.id ? "text-[#ff5c00]" : "text-tertiary"
                  }`}
                >
                  {tab.icon}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p
                  className={`text-sm font-semibold ${
                    active === tab.id ? "text-on-surface" : "text-tertiary"
                  }`}
                >
                  {tab.label}
                </p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-tertiary mt-0.5">
                  {tab.subtitle}
                </p>
              </div>
              {active === tab.id && (
                <span className="shrink-0 w-2 h-2 rounded-full bg-[#ff5c00] shadow-[0_0_8px_#ff5c00]" />
              )}
            </button>
          </GlowCard>
        ))}
      </div>

      {/* Panel content */}
      <div>
        {active === "settings" && (
          <div className="flex flex-col gap-6">
            <ProfilePanel profile={profile} />
            <ActivationCodePanel appliedCode={appliedCode} trialEndsAt={trialEndsAt} />
          </div>
        )}

        {active === "billing" && (
          <div className="flex flex-col gap-6">
            <BillingPanel
              tier={billing.tier}
              trialEnds={billing.trialEnds ? new Date(billing.trialEnds) : null}
              status={billing.status}
              provider={billing.provider}
              periodEnd={billing.periodEnd ? new Date(billing.periodEnd) : null}
              cancelAtPeriodEnd={billing.cancelAtPeriodEnd}
              campaignCount={billing.campaignCount}
              paymentsEnabled={billing.paymentsEnabled}
              walletAddress={billing.walletAddress}
            />
            <ActivationCodePanel appliedCode={appliedCode} trialEndsAt={trialEndsAt} />
          </div>
        )}

        {active === "drive" && <DrivePanel attachments={attachments} />}
      </div>
    </div>
  );
}
