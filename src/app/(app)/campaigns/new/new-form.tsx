"use client";

import { useFormState, useFormStatus } from "react-dom";
import {
  createCampaignAction,
  type CreateCampaignState,
} from "@/lib/campaigns/actions";

type ProtocolOption = { id: string; name: string };

export function NewCampaignForm({ protocols }: { protocols: ProtocolOption[] }) {
  const [state, action] = useFormState<CreateCampaignState, FormData>(
    createCampaignAction,
    null,
  );

  return (
    <form action={action} className="mt-8 flex flex-col gap-5">
      {/* 1º — Protocolo */}
      <Field>
        <label htmlFor="protocol_id" className="text-[10px] font-bold uppercase tracking-widest text-tertiary">
          Protocolo
        </label>
        <select
          id="protocol_id"
          name="protocol_id"
          className="rounded-lg border border-outline-variant/50 bg-surface-container/50 px-3 py-2.5 text-sm text-on-surface outline-none transition focus:border-[#ff5c00]/60 focus:ring-1 focus:ring-[#ff5c00]/40 appearance-none"
          style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23888' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E\")", backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center" }}
        >
          <option value="">— Selecione o protocolo —</option>
          {protocols.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </Field>

      {/* Título */}
      <Field>
        <label htmlFor="title" className="text-[10px] font-bold uppercase tracking-widest text-tertiary">
          Título <span className="text-[#ff5c00]">*</span>
        </label>
        <input
          id="title"
          name="title"
          required
          maxLength={120}
          placeholder="Ex: Airdrop LayerZero — fase 2"
          className="rounded-lg border border-outline-variant/50 bg-surface-container/50 px-3 py-2.5 text-sm text-on-surface placeholder:text-tertiary outline-none transition focus:border-[#ff5c00]/60 focus:ring-1 focus:ring-[#ff5c00]/40"
        />
      </Field>

      {/* Descrição */}
      <Field>
        <label htmlFor="description" className="text-[10px] font-bold uppercase tracking-widest text-tertiary">
          Descrição
        </label>
        <textarea
          id="description"
          name="description"
          rows={7}
          maxLength={2000}
          placeholder="O que precisa ser feito? Descreva etapas, links, instruções... (seu Workflow personalizado)"
          className="rounded-lg border border-outline-variant/50 bg-surface-container/50 px-3 py-2.5 text-sm text-on-surface placeholder:text-tertiary outline-none transition focus:border-[#ff5c00]/60 focus:ring-1 focus:ring-[#ff5c00]/40 resize-y min-h-[112px]"
        />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        {/* Deadline */}
        <Field>
          <label htmlFor="deadline" className="text-[10px] font-bold uppercase tracking-widest text-tertiary">
            Deadline
          </label>
          <input
            id="deadline"
            name="deadline"
            type="date"
            className="rounded-lg border border-outline-variant/50 bg-surface-container/50 px-3 py-2.5 text-sm text-on-surface outline-none transition focus:border-[#ff5c00]/60 focus:ring-1 focus:ring-[#ff5c00]/40"
          />
        </Field>

        {/* Valor */}
        <Field>
          <label htmlFor="estimated_value_brl" className="text-[10px] font-bold uppercase tracking-widest text-tertiary">
            Valor estimado (USD)
          </label>
          <input
            id="estimated_value_brl"
            name="estimated_value_brl"
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            className="rounded-lg border border-outline-variant/50 bg-surface-container/50 px-3 py-2.5 text-sm text-on-surface placeholder:text-tertiary outline-none transition focus:border-[#ff5c00]/60 focus:ring-1 focus:ring-[#ff5c00]/40"
          />
        </Field>
      </div>

      {state?.error && (
        <div className="rounded-lg border border-red-900/40 bg-red-900/20 px-3 py-2 text-xs text-red-300">
          {state.error}
        </div>
      )}

      <Submit />
    </form>
  );
}

function Field({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col gap-1.5">{children}</div>;
}

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#ff5c00] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#ff7b33] hover:shadow-[0_0_20px_rgba(255,92,0,0.4)] active:scale-95 disabled:opacity-60"
    >
      {pending ? "Criando..." : "Criar campanha"}
    </button>
  );
}
