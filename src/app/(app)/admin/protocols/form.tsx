"use client";

import { useFormState, useFormStatus } from "react-dom";
import { upsertProtocolAction, type ProtocolFormState } from "@/lib/protocols/actions";
import type { Protocol } from "@/lib/types";

export function ProtocolForm({ protocol }: { protocol?: Protocol }) {
  const [state, action] = useFormState<ProtocolFormState, FormData>(
    upsertProtocolAction,
    null,
  );

  return (
    <form action={action} className="space-y-4">
      {protocol && <input type="hidden" name="id" value={protocol.id} />}

      <Field label="Nome *" htmlFor="name">
        <input
          id="name"
          name="name"
          required
          maxLength={100}
          defaultValue={protocol?.name ?? ""}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none ring-ring focus:ring-2"
        />
      </Field>

      <Field label="Slug *" htmlFor="slug">
        <input
          id="slug"
          name="slug"
          required
          pattern="[a-z0-9-]+"
          maxLength={60}
          placeholder="layerzero"
          defaultValue={protocol?.slug ?? ""}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 font-mono text-sm outline-none ring-ring focus:ring-2"
        />
      </Field>

      <Field label="Descrição" htmlFor="description">
        <textarea
          id="description"
          name="description"
          rows={3}
          maxLength={500}
          defaultValue={protocol?.description ?? ""}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none ring-ring focus:ring-2"
        />
      </Field>

      <Field label="Categoria" htmlFor="category">
        <input
          id="category"
          name="category"
          maxLength={50}
          defaultValue={protocol?.category ?? ""}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none ring-ring focus:ring-2"
        />
      </Field>

      <Field label="Website" htmlFor="website_url">
        <input
          id="website_url"
          name="website_url"
          type="url"
          defaultValue={protocol?.website_url ?? ""}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none ring-ring focus:ring-2"
        />
      </Field>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          name="is_active"
          defaultChecked={protocol?.is_active ?? true}
          className="h-4 w-4 rounded border-border text-mint-600 focus:ring-mint-500"
        />
        Ativo no catálogo público
      </label>

      {state?.error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive">
          {state.error}
        </div>
      )}

      <Submit />
    </form>
  );
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={htmlFor} className="text-sm font-medium">
        {label}
      </label>
      {children}
    </div>
  );
}

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex rounded-lg bg-mint-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-mint-700 disabled:opacity-60"
    >
      {pending ? "Salvando..." : "Salvar"}
    </button>
  );
}
