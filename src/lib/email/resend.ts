/**
 * Resend — envio de email transacional.
 * Lazy: só importa o SDK se RESEND_API_KEY estiver setado.
 * Assim podemos rodar o cron sem email configurado (só marca sent=false).
 */

export type SendEmailInput = {
  to: string;
  subject: string;
  text: string;
  html?: string;
};

export type SendResult =
  | { ok: true; id: string }
  | { ok: false; error: string };

export async function sendEmail(input: SendEmailInput): Promise<SendResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM ?? "Bounty WorkFlow <no-reply@bountyworkflow.app>";

  if (!apiKey) {
    return { ok: false, error: "RESEND_API_KEY não configurado" };
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: input.to,
        subject: input.subject,
        text: input.text,
        html: input.html,
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      return { ok: false, error: `Resend HTTP ${res.status}: ${body.slice(0, 200)}` };
    }

    const data = (await res.json()) as { id: string };
    return { ok: true, id: data.id };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Erro desconhecido",
    };
  }
}
