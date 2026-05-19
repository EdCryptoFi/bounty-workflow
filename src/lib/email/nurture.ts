"use server";

import { createAdminClient } from "@/lib/supabase/server";
import { sendEmail } from "@/lib/email/resend";
import { log } from "@/lib/logger";

type NurtureStep = 1 | 2 | 3;

const NURTURE_TEMPLATES: Record<NurtureStep, { subject: string; delayDays: number }> = {
  1: { subject: "Bem-vindo à lista de espera do Bounty WorkFlow 🚀", delayDays: 0 },
  2: { subject: "Dica de organização + convite especial 🤝", delayDays: 3 },
  3: { subject: "Último aviso: Acesso antecipado chegando! ⏳", delayDays: 7 },
};

function buildEmailBody(step: NurtureStep, name: string): { html: string; text: string } {
  const templates: Record<NurtureStep, { html: string; text: string }> = {
    1: {
      html: `
        <div style="font-family: 'Inter',-apple-system,sans-serif; max-width: 560px; margin: 0 auto; padding: 32px 24px; background: #0c0a07; color: #f7f5f2;">
          <div style="text-align: center; margin-bottom: 24px;">
            <img src="https://bountywork.xyz/logo-final.png" alt="Bounty WorkFlow" style="width: 64px; height: 64px; border-radius: 12px;" />
          </div>
          <h1 style="font-size: 22px; font-weight: 700; margin-bottom: 16px; color: #fff;">Bem-vindo ao Bounty WorkFlow, ${name}! 🚀</h1>
          <p style="font-size: 14px; line-height: 1.6; color: #e7e3dd; margin-bottom: 16px;">
            Você está oficialmente na lista de espera. Organizamos um <strong style="color: #ffb072;">guia exclusivo</strong> para você começar com o pé direito enquanto preparamos o lançamento.
          </p>
          <div style="background: rgba(255,92,0,0.08); border: 1px solid rgba(255,92,0,0.2); border-radius: 12px; padding: 16px; margin-bottom: 20px;">
            <p style="font-size: 13px; color: #ffb072; margin: 0; font-weight: 600;">🎁 Bônus imediato</p>
            <p style="font-size: 13px; color: #e7e3dd; margin: 8px 0 0;">Baixe nosso template de organização de bounties no Notion:</p>
            <a href="https://bountywork.xyz/pre-lancamento" style="display: inline-block; margin-top: 10px; padding: 10px 20px; background: #ff5c00; color: #fff; border-radius: 999px; text-decoration: none; font-size: 12px; font-weight: 700;">Baixar Template Grátis →</a>
          </div>
          <p style="font-size: 12px; color: #5a554c;">Fique ligado — em breve você receberá mais novidades.</p>
        </div>
      `,
      text: `Bem-vindo ao Bounty WorkFlow, ${name}!\n\nVocê está na lista de espera. Enquanto preparamos o lançamento, baixe nosso template de organização de bounties:\nhttps://bountywork.xyz/pre-lancamento`,
    },
    2: {
      html: `
        <div style="font-family: 'Inter',-apple-system,sans-serif; max-width: 560px; margin: 0 auto; padding: 32px 24px; background: #0c0a07; color: #f7f5f2;">
          <h1 style="font-size: 22px; font-weight: 700; margin-bottom: 16px; color: #fff;">Dica de ouro, ${name} 🤝</h1>
          <p style="font-size: 14px; line-height: 1.6; color: #e7e3dd; margin-bottom: 16px;">
            Sabia que hunters organizados entregam <strong style="color: #ffb072;">87% mais bounties no prazo</strong>? 
            A chave é ter um sistema antes de começar.
          </p>
          <div style="background: rgba(255,92,0,0.08); border: 1px solid rgba(255,92,0,0.2); border-radius: 12px; padding: 16px; margin-bottom: 20px;">
            <p style="font-size: 13px; color: #fff; margin: 0; font-weight: 600;">🗓️ Convite especial</p>
            <p style="font-size: 13px; color: #e7e3dd; margin: 8px 0 0;">Vamos fazer um Twitter Spaces nesta sexta às 20h BRT para discutir o futuro dos bounties no Brasil. Você é nosso convidado!</p>
            <a href="https://bountywork.xyz/pre-lancamento" style="display: inline-block; margin-top: 10px; padding: 10px 20px; background: #ff5c00; color: #fff; border-radius: 999px; text-decoration: none; font-size: 12px; font-weight: 700;">Confirmar Presença →</a>
          </div>
        </div>
      `,
      text: `Dica de ouro, ${name}!\n\nSabia que hunters organizados entregam 87% mais bounties no prazo?\n\nConvite especial: Twitter Spaces nesta sexta às 20h BRT.\nConfirme presença: https://bountywork.xyz/pre-lancamento`,
    },
    3: {
      html: `
        <div style="font-family: 'Inter',-apple-system,sans-serif; max-width: 560px; margin: 0 auto; padding: 32px 24px; background: #0c0a07; color: #f7f5f2;">
          <h1 style="font-size: 22px; font-weight: 700; margin-bottom: 16px; color: #fff;">Último aviso, ${name} ⏳</h1>
          <p style="font-size: 14px; line-height: 1.6; color: #e7e3dd; margin-bottom: 16px;">
            O acesso antecipado está quase chegando. Quem está na lista de espera terá <strong style="color: #ffb072;">prioridade máxima</strong>.
          </p>
          <div style="background: rgba(255,92,0,0.08); border: 1px solid rgba(255,92,0,0.2); border-radius: 12px; padding: 16px; margin-bottom: 20px;">
            <p style="font-size: 13px; color: #fff; margin: 0; font-weight: 600;">🎯 Giveaway exclusivo</p>
            <p style="font-size: 13px; color: #e7e3dd; margin: 8px 0 0;">Os primeiros 50 inscritos ganharão 1 mês de trial grátis sem precisar de cartão de crédito!</p>
          </div>
          <p style="font-size: 14px; color: #e7e3dd;">Compartilhe seu link de indicação e suba na fila:</p>
          <a href="https://bountywork.xyz/pre-lancamento" style="display: inline-block; margin-top: 8px; margin-bottom: 20px; padding: 10px 20px; background: #ff5c00; color: #fff; border-radius: 999px; text-decoration: none; font-size: 12px; font-weight: 700;">Indicar Amigos →</a>
        </div>
      `,
      text: `Último aviso, ${name}!\n\nO acesso antecipado está quase chegando. Os primeiros 50 inscritos ganharão 1 mês de trial grátis!\n\nIndique amigos: https://bountywork.xyz/pre-lancamento`,
    },
  };

  return templates[step];
}

export async function queueNurtureEmail(
  toEmail: string,
  step: NurtureStep,
  name: string,
) {
  const supabase = createAdminClient();
  const template = NURTURE_TEMPLATES[step];
  const body = buildEmailBody(step, name);

  const scheduledFor = new Date();
  scheduledFor.setDate(scheduledFor.getDate() + template.delayDays);

  const { error } = await supabase.from("email_queue").insert({
    to_email: toEmail,
    subject: template.subject,
    html_body: body.html,
    text_body: body.text,
    scheduled_for: scheduledFor.toISOString(),
  });

  if (error) {
    log.error("[nurture] queue error", error, { email: toEmail, step });
  }
}

export async function queueFullNurtureSequence(toEmail: string, name: string) {
  const steps: NurtureStep[] = [1, 2, 3];
  for (const step of steps) {
    await queueNurtureEmail(toEmail, step, name);
  }
}

export async function sendDueNurtureEmails(): Promise<{ sent: number; failed: number }> {
  const supabase = createAdminClient();
  const now = new Date().toISOString();

  const { data: due, error } = await supabase
    .from("email_queue")
    .select("id, to_email, subject, html_body, text_body")
    .is("sent_at", null)
    .lte("scheduled_for", now)
    .order("scheduled_for", { ascending: true })
    .limit(50);

  if (error || !due) {
    log.error("[nurture/cron] query error", error);
    return { sent: 0, failed: 0 };
  }

  let sent = 0;
  let failed = 0;

  for (const email of due) {
    const result = await sendEmail({
      to: email.to_email,
      subject: email.subject,
      text: email.text_body,
      html: email.html_body,
    });

    if (result.ok) {
      await supabase
        .from("email_queue")
        .update({ sent_at: new Date().toISOString() })
        .eq("id", email.id);
      sent++;
    } else {
      await supabase
        .from("email_queue")
        .update({ error: result.error })
        .eq("id", email.id);
      failed++;
      log.error("[nurture/cron] send failed", result.error, { id: email.id });
    }
  }

  return { sent, failed };
}
