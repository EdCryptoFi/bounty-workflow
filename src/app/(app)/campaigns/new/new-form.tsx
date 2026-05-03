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
    <form action={action} className="mt-8 space-y-4">
      <Field>
        <label htmlFor="title" className="text-sm font-medium">
          Título *
        </label>
        <input
          id="title"
          name="title"
          required
          maxLength={120}
          placeholder="Ex: Airdrop LayerZero — fase 2"
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none ring-ring transition focus:ring-2"
        />
      </Field>

      <Field>
        <label htmlFor="description" className="text-sm font-medium">
          Descrição
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          maxLength={2000}
          placeholder="O que precisa ser feito? Dicas, links..."
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none ring-ring transition focus:ring-2"
        />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field>
          <label htmlFor="protocol_id" className="text-sm font-medium">
            Protocolo
          </label>
          <select
            id="protocol_id"
            name="protocol_id"
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none ring-ring transition focus:ring-2"
          >
            <option value="">— Sem protocolo —</option>
            {protocols.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </Field>

        <Field>
          <label htmlFor="deadline" className="text-sm font-medium">
            Deadline
          </label>
          <input
            id="deadline"
            name="deadline"
            type="date"
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none ring-ring transition focus:ring-2"
          />
        </Field>
      </div>

      <Field>
        <label htmlFor="estimated_value_brl" className="text-sm font-medium">
          Valor estimado (USD)
        </label>
        <input
          id="estimated_value_brl"
          name="estimated_value_brl"
          type="number"
          step="0.01"
          min="0"
          placeholder="0.00"
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none ring-ring transition focus:ring-2"
        />
      </Field>

      {state?.error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive">
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
      className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-mint-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-mint-700 disabled:opacity-60"
    >
      {pending ? "Criando..." : "Criar campanha"}
    </button>
  );
}
