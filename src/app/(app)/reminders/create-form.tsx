"use client";

import { useFormState, useFormStatus } from "react-dom";
import { createReminderAction, type ReminderState } from "@/lib/reminders/actions";

type CampaignOption = { id: string; title: string };

export function CreateReminderForm({ campaigns }: { campaigns: CampaignOption[] }) {
  const [state, action] = useFormState<ReminderState, FormData>(createReminderAction, null);

  return (
    <form action={action} className="grid gap-4 sm:grid-cols-2">
      <div className="flex flex-col gap-1.5 sm:col-span-2">
        <label htmlFor="message" className="text-sm font-medium">
          Mensagem
        </label>
        <input
          id="message"
          name="message"
          maxLength={500}
          placeholder="Ex: Checar bridge antes do fim do epoch"
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none ring-ring focus:ring-2"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="campaign_id" className="text-sm font-medium">
          Campanha
        </label>
        <select
          id="campaign_id"
          name="campaign_id"
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none ring-ring focus:ring-2"
        >
          <option value="">— Sem campanha —</option>
          {campaigns.map((c) => (
            <option key={c.id} value={c.id}>
              {c.title}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="channel" className="text-sm font-medium">
          Canal
        </label>
        <select
          id="channel"
          name="channel"
          defaultValue="email"
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none ring-ring focus:ring-2"
        >
          <option value="email">Email</option>
          <option value="in_app">In-app</option>
          <option value="push" disabled>
            Push (em breve)
          </option>
        </select>
      </div>

      <div className="flex flex-col gap-1.5 sm:col-span-2">
        <label htmlFor="trigger_at" className="text-sm font-medium">
          Data e hora
        </label>
        <input
          id="trigger_at"
          name="trigger_at"
          type="datetime-local"
          required
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none ring-ring focus:ring-2"
        />
      </div>

      {state?.error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive sm:col-span-2">
          {state.error}
        </div>
      )}
      {state?.ok && (
        <div className="rounded-lg border border-mint-200 bg-mint-50 px-3 py-2 text-xs text-mint-900 sm:col-span-2">
          {state.ok}
        </div>
      )}

      <div className="sm:col-span-2">
        <Submit />
      </div>
    </form>
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
      {pending ? "Agendando..." : "Agendar lembrete"}
    </button>
  );
}
