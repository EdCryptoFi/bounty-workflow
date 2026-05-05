"use client";

import { useTransition } from "react";
import { startCheckoutAction } from "@/lib/settings/actions";

export function CheckoutButton({ paymentsEnabled }: { paymentsEnabled: boolean }) {
  const [pending, start] = useTransition();

  function handleClick() {
    start(async () => {
      const res = await startCheckoutAction();
      if (res.ok) window.location.href = res.url;
      else alert(res.error);
    });
  }

  if (!paymentsEnabled) {
    return (
      <div className="text-center py-3 rounded-lg border border-outline-variant/30 text-xs text-tertiary">
        Pagamentos em breve
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={pending}
      className="w-full py-3.5 bg-[#ff5c00] hover:bg-[#ff7b33] text-white text-sm font-bold uppercase tracking-widest rounded-lg transition-all duration-300 hover:shadow-[0_0_25px_rgba(255,92,0,0.4)] active:scale-95 disabled:opacity-60 flex items-center justify-center gap-2"
    >
      {pending ? (
        <>
          <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
          Redirecionando...
        </>
      ) : (
        <>
          <span className="material-symbols-outlined text-[18px]">credit_card</span>
          Assinar Agora — R$29,90/mês
        </>
      )}
    </button>
  );
}
