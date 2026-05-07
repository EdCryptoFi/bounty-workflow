"use client";

import { useState, useTransition, useActionState } from "react";
import { addReferralAction, deleteReferralAction, type ReferralState } from "@/lib/referrals/actions";

type Protocol = { id: string; name: string; logo_url: string | null; website_url: string | null };
type Referral = {
  id: string;
  url: string;
  label: string | null;
  protocol_id: string | null;
  protocol: Protocol | null;
  created_at: string;
};

export function ReferralsList({
  referrals,
  protocols,
}: {
  referrals: Referral[];
  protocols: Protocol[];
}) {
  const [items, setItems] = useState(referrals);
  const [showModal, setShowModal] = useState(false);
  const [, startTransition] = useTransition();

  function onAdded() {
    setShowModal(false);
    // revalidatePath via server action already refreshes — but we also optimistically close modal
  }

  function handleDelete(id: string) {
    setItems((prev) => prev.filter((r) => r.id !== id));
    startTransition(() => deleteReferralAction(id));
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-tertiary">{items.length} referral{items.length !== 1 ? "s" : ""} salvo{items.length !== 1 ? "s" : ""}</p>
        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-[#ff5c00] px-4 py-2 text-xs font-bold uppercase tracking-widest text-white transition hover:bg-[#ff7b33] hover:shadow-[0_0_20px_rgba(255,92,0,0.4)] active:scale-95"
        >
          <span className="material-symbols-outlined text-[16px]">add</span>
          Adicionar
        </button>
      </div>

      {/* Empty state */}
      {items.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-outline-variant/30 py-16 text-center">
          <span className="material-symbols-outlined text-[40px] text-tertiary">redeem</span>
          <p className="text-sm font-semibold text-on-surface">Nenhum referral salvo</p>
          <p className="text-xs text-tertiary">Adicione seus links de referral para ter sempre à mão.</p>
        </div>
      )}

      {/* Grid */}
      {items.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((r) => (
            <ReferralCard key={r.id} referral={r} onDelete={() => handleDelete(r.id)} />
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <AddReferralModal
          protocols={protocols}
          onClose={() => setShowModal(false)}
          onSuccess={onAdded}
        />
      )}
    </div>
  );
}

function ReferralCard({ referral, onDelete }: { referral: Referral; onDelete: () => void }) {
  const [copied, setCopied] = useState(false);

  const label = referral.label ?? referral.protocol?.name ?? "Referral";
  const logoUrl = referral.protocol?.website_url
    ? `https://www.google.com/s2/favicons?sz=32&domain=${new URL(referral.protocol.website_url).hostname}`
    : null;

  function copy() {
    navigator.clipboard.writeText(referral.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div
      className="relative flex flex-col gap-4 rounded-2xl border border-[rgba(255,92,0,0.14)] p-5 transition-all hover:border-[rgba(255,92,0,0.35)] hover:-translate-y-0.5"
      style={{ background: "rgba(24,23,23,0.9)", backdropFilter: "blur(20px)" }}
    >
      {/* Delete */}
      <button
        type="button"
        onClick={onDelete}
        className="absolute right-3 top-3 rounded p-1 text-tertiary hover:text-red-400 transition-colors"
        aria-label="Remover"
      >
        <span className="material-symbols-outlined text-[16px]">close</span>
      </button>

      {/* Protocol identity */}
      <div className="flex items-center gap-3">
        {logoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={logoUrl} alt="" className="h-8 w-8 rounded-lg object-contain bg-surface-container p-1" />
        ) : (
          <div className="h-8 w-8 rounded-lg bg-[rgba(255,92,0,0.1)] border border-[rgba(255,92,0,0.2)] flex items-center justify-center">
            <span className="material-symbols-outlined text-[16px] text-[#ff5c00]">redeem</span>
          </div>
        )}
        <div className="min-w-0">
          <p className="text-sm font-semibold text-on-surface truncate">{label}</p>
          {referral.protocol && (
            <p className="text-[10px] font-bold uppercase tracking-widest text-tertiary">{referral.protocol.name}</p>
          )}
        </div>
      </div>

      {/* URL */}
      <p className="text-[11px] text-tertiary truncate rounded bg-surface-container/50 px-2.5 py-1.5 border border-outline-variant/30">
        {referral.url}
      </p>

      {/* Actions */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={copy}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-outline-variant/40 bg-surface-container/50 py-2 text-[11px] font-bold uppercase tracking-widest text-tertiary hover:text-[#ff5c00] hover:border-[#ff5c00]/40 transition-all"
        >
          <span className="material-symbols-outlined text-[14px]">{copied ? "check" : "content_copy"}</span>
          {copied ? "Copiado!" : "Copiar"}
        </button>
        <a
          href={referral.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-1.5 rounded-lg border border-outline-variant/40 bg-surface-container/50 px-3 py-2 text-[11px] font-bold uppercase tracking-widest text-tertiary hover:text-[#ffb59a] hover:border-[#ff5c00]/40 transition-all"
        >
          <span className="material-symbols-outlined text-[14px]">open_in_new</span>
        </a>
      </div>
    </div>
  );
}

function AddReferralModal({
  protocols,
  onClose,
  onSuccess,
}: {
  protocols: Protocol[];
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [state, action, pending] = useActionState<ReferralState, FormData>(addReferralAction, null);

  if (state === null && !pending) {
    // already handled by onSuccess below
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md rounded-2xl border border-outline-variant/50 bg-[rgba(22,22,22,0.98)] p-6 shadow-[0_0_60px_rgba(255,92,0,0.15)] flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-on-surface">Novo Referral</h3>
          <button type="button" onClick={onClose} className="text-tertiary hover:text-on-surface transition">
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <form
          action={async (fd) => {
            await action(fd);
            onSuccess();
          }}
          className="flex flex-col gap-4"
        >
          {/* Protocol */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-tertiary">Protocolo</label>
            <select
              name="protocol_id"
              className="rounded-lg border border-outline-variant/50 bg-[rgba(22,22,22,0.98)] px-3 py-2.5 text-sm text-on-surface outline-none transition focus:border-[#ff5c00]/60 focus:ring-1 focus:ring-[#ff5c00]/40"
            >
              <option value="">— Selecione o protocolo —</option>
              {protocols.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          {/* Label personalizado */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-tertiary">
              Nome personalizado <span className="normal-case text-[9px] text-tertiary/60 font-normal tracking-normal">— opcional</span>
            </label>
            <input
              name="label"
              maxLength={100}
              placeholder="Ex: Meu link Arbitrum"
              className="rounded-lg border border-outline-variant/50 bg-surface-container/50 px-3 py-2.5 text-sm text-on-surface placeholder:text-tertiary outline-none transition focus:border-[#ff5c00]/60 focus:ring-1 focus:ring-[#ff5c00]/40"
            />
          </div>

          {/* URL */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-tertiary">
              Link de referral <span className="text-[#ff5c00]">*</span>
            </label>
            <input
              name="url"
              type="url"
              required
              placeholder="https://..."
              className="rounded-lg border border-outline-variant/50 bg-surface-container/50 px-3 py-2.5 text-sm text-on-surface placeholder:text-tertiary outline-none transition focus:border-[#ff5c00]/60 focus:ring-1 focus:ring-[#ff5c00]/40"
            />
          </div>

          {state?.error && (
            <p className="text-xs text-red-400">{state.error}</p>
          )}

          <div className="flex gap-3 justify-end pt-1">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-sm text-tertiary hover:text-on-surface border border-outline-variant/50 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={pending}
              className="inline-flex items-center gap-2 rounded-lg bg-[#ff5c00] px-5 py-2 text-sm font-bold text-white transition hover:bg-[#ff7b33] hover:shadow-[0_0_15px_rgba(255,92,0,0.4)] disabled:opacity-60 active:scale-95"
            >
              {pending ? "Salvando..." : "Salvar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
