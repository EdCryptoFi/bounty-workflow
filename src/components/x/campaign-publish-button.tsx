"use client";

import { useState } from "react";
import { PublishModal } from "./publish-modal";

type CampaignPublishButtonProps = {
  campaignTitle: string;
  stepsDone: number;
  stepsTotal: number;
  accounts: Array<{
    id: string;
    x_username: string;
    x_name: string | null;
    x_avatar_url: string | null;
  }>;
};

export function CampaignPublishButton({
  campaignTitle,
  stepsDone,
  stepsTotal,
  accounts,
}: CampaignPublishButtonProps) {
  const [showModal, setShowModal] = useState(false);

  const defaultText = stepsDone > 0
    ? `🔥 Acabei de completar ${stepsDone}/${stepsTotal} tarefas em "${campaignTitle}"! ` +
      `Bounty WorkFlow me ajudou a organizar tudo. #BountyHunter #Crypto`
    : `📋 Iniciei uma nova campanha: "${campaignTitle}"! ` +
      `Organizando tudo no Bounty WorkFlow. #BountyHunter #Crypto`;

  return (
    <>
      <button
        type="button"
        onClick={() => setShowModal(true)}
        disabled={accounts.length === 0}
        className="flex items-center gap-2 rounded-xl px-4 py-2 text-[11px] font-bold uppercase tracking-widest transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
        style={{ background: "#ff5c00", color: "#fff" }}
      >
        <span className="material-symbols-outlined text-[16px]">post_add</span>
        Publicar no X
      </button>

      <PublishModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        accounts={accounts}
        defaultText={defaultText}
      />
    </>
  );
}
