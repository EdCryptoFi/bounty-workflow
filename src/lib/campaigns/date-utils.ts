/**
 * Helpers seguros para deadline (date) do banco.
 * - Aceita só ISO YYYY-MM-DD com ano entre 2000 e 2100.
 * - Força T12:00:00 local pra evitar drift de timezone.
 */
export function parseDeadline(iso: string | null): Date | null {
  if (!iso) return null;
  const d = new Date(`${iso}T12:00:00`);
  if (isNaN(d.getTime())) return null;
  const y = d.getFullYear();
  if (y < 2000 || y > 2100) return null;
  return d;
}

export function daysUntil(iso: string | null): number | null {
  const d = parseDeadline(iso);
  if (!d) return null;
  const today = new Date();
  today.setHours(12, 0, 0, 0);
  return Math.round((d.getTime() - today.getTime()) / 86_400_000);
}

export function formatDeadlineLabel(iso: string | null): string {
  const d = parseDeadline(iso);
  if (!d) return "Sem prazo";
  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short" }).format(d);
}

export function formatDeadlineFull(iso: string | null): string {
  const d = parseDeadline(iso);
  if (!d) return "—";
  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" }).format(d);
}
