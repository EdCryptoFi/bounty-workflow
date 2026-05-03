/**
 * Helpers de idempotência pra webhooks.
 * Usa a tabela `webhook_events` (provider + event_id unique) pra garantir
 * que o mesmo evento nunca seja processado duas vezes.
 *
 * Fluxo canônico:
 *   const seen = await wasSeen(supabase, provider, eventId);
 *   if (seen) return NextResponse.json({ status: "duplicate" });
 *   // ... processa ...
 *   await markProcessed(supabase, provider, eventId, payload);
 */
import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Tenta registrar o evento (provider, provider_event_id, event_type).
 * Retorna `true` se inseriu (processa), `false` se já existia (duplicate).
 *
 * Usa INSERT com unique constraint — atômico, sem race.
 */
export async function claimEvent(
  supabase: SupabaseClient,
  provider: "stripe" | "mercadopago",
  providerEventId: string,
  eventType: string,
  payload: unknown,
): Promise<boolean> {
  const { error } = await supabase.from("webhook_events").insert({
    provider,
    provider_event_id: providerEventId,
    event_type: eventType,
    payload_json: payload as Record<string, unknown>,
  });
  if (!error) return true;
  if (error.code === "23505") return false; // unique_violation → duplicate
  // Outro erro: loga e re-levanta
  console.error("[idempotency] claim error", error);
  throw new Error(`idempotency claim failed: ${error.message}`);
}

/**
 * Marca o evento como processado (ou com erro).
 */
export async function finalizeEvent(
  supabase: SupabaseClient,
  provider: "stripe" | "mercadopago",
  providerEventId: string,
  result: { ok: true } | { ok: false; error: string },
): Promise<void> {
  const update: Record<string, unknown> = {
    processed_at: new Date().toISOString(),
  };
  if (!result.ok) update.error_message = result.error.slice(0, 500);

  const { error } = await supabase
    .from("webhook_events")
    .update(update)
    .eq("provider", provider)
    .eq("provider_event_id", providerEventId);

  if (error) console.error("[idempotency] finalize error", error);
}
