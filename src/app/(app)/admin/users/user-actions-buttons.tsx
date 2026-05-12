"use client";

import { useState, useTransition } from "react";
import { banUserAction, unbanUserAction } from "@/lib/admin/user-actions";

export function UserActions({
  userId,
  isBanned,
  userName,
}: {
  userId: string;
  isBanned: boolean;
  userName: string;
}) {
  const [isPending, startTransition] = useTransition();
  const [showConfirm, setShowConfirm] = useState(false);

  function handleBanToggle() {
    if (!isBanned && !showConfirm) {
      setShowConfirm(true);
      return;
    }

    startTransition(async () => {
      if (isBanned) {
        const result = await unbanUserAction(userId);
        if (result.error) alert(result.error);
      } else {
        const result = await banUserAction(userId);
        if (result.error) alert(result.error);
      }
      setShowConfirm(false);
    });
  }

  if (showConfirm) {
    return (
      <div className="flex items-center gap-2 justify-end">
        <span className="text-[10px] text-red-400">Banir {userName.split(" ")[0]}?</span>
        <button
          onClick={handleBanToggle}
          disabled={isPending}
          className="px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-white bg-red-600 hover:bg-red-700 rounded transition-colors disabled:opacity-50"
        >
          {isPending ? "..." : "Sim"}
        </button>
        <button
          onClick={() => setShowConfirm(false)}
          className="px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-tertiary hover:text-on-surface rounded transition-colors"
        >
          Não
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 justify-end">
      <button
        onClick={handleBanToggle}
        disabled={isPending}
        className={`flex items-center gap-1 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded transition-all disabled:opacity-50 ${
          isBanned
            ? "text-[#22c55e] border border-[rgba(34,197,94,0.3)] hover:bg-[rgba(34,197,94,0.1)]"
            : "text-red-400 border border-red-900/40 hover:bg-red-900/20"
        }`}
      >
        <span className="material-symbols-outlined text-[14px]">
          {isBanned ? "person_add" : "person_off"}
        </span>
        {isPending ? "..." : isBanned ? "Desbanir" : "Banir"}
      </button>
    </div>
  );
}
