/**
 * Logger estruturado.
 *
 * Em produção no Vercel os logs caem direto no drainer do Vercel
 * (console.log → serverless logs). Usamos JSON estruturado pra
 * facilitar grep/queries.
 *
 * Se SENTRY_DSN estiver setado, erros também são enviados pro Sentry
 * via fetch HTTP direto (sem SDK — evita bundle extra).
 */

type Level = "debug" | "info" | "warn" | "error";

type LogPayload = Record<string, unknown>;

function write(level: Level, message: string, payload?: LogPayload) {
  const line = JSON.stringify({
    ts: new Date().toISOString(),
    level,
    message,
    ...(payload ?? {}),
  });
  if (level === "error") console.error(line);
  else if (level === "warn") console.warn(line);
  else console.log(line);
}

export const log = {
  debug: (msg: string, p?: LogPayload) => {
    if (process.env.NODE_ENV !== "production") write("debug", msg, p);
  },
  info: (msg: string, p?: LogPayload) => write("info", msg, p),
  warn: (msg: string, p?: LogPayload) => write("warn", msg, p),
  error: (msg: string, err?: unknown, p?: LogPayload) => {
    const errPayload =
      err instanceof Error
        ? { error: { name: err.name, message: err.message, stack: err.stack } }
        : err
          ? { error: err }
          : {};
    write("error", msg, { ...errPayload, ...(p ?? {}) });
    // Fire-and-forget pro Sentry se configurado
    if (process.env.SENTRY_DSN) {
      sendToSentry(msg, err, p).catch(() => {
        // swallow — não travar request por falha de logging
      });
    }
  },
};

/**
 * Envia evento pro Sentry via HTTP Store API.
 * DSN format: https://<publicKey>@o<org>.ingest.sentry.io/<projectId>
 */
async function sendToSentry(msg: string, err: unknown, p?: LogPayload) {
  const dsn = process.env.SENTRY_DSN;
  if (!dsn) return;

  let url: URL;
  try {
    url = new URL(dsn);
  } catch {
    return;
  }

  const publicKey = url.username;
  const projectId = url.pathname.replace(/^\//, "");
  const host = url.host;

  const envelope = {
    event_id: crypto.randomUUID().replace(/-/g, ""),
    timestamp: new Date().toISOString(),
    platform: "node",
    level: "error",
    logger: "bounty-workflow",
    message: { formatted: msg },
    environment: process.env.VERCEL_ENV ?? process.env.NODE_ENV ?? "development",
    release: process.env.VERCEL_GIT_COMMIT_SHA ?? undefined,
    exception: err instanceof Error
      ? {
          values: [
            {
              type: err.name,
              value: err.message,
              stacktrace: err.stack ? { frames: parseStack(err.stack) } : undefined,
            },
          ],
        }
      : undefined,
    extra: p,
  };

  await fetch(`https://${host}/api/${projectId}/store/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Sentry-Auth": `Sentry sentry_version=7, sentry_key=${publicKey}, sentry_client=bounty-workflow/1.0`,
    },
    body: JSON.stringify(envelope),
  });
}

function parseStack(stack: string) {
  // Parser bem básico — Sentry aceita frames mínimos
  return stack
    .split("\n")
    .slice(1, 20)
    .map((line) => {
      const match = /at (?:(.+?) )?\(?(.+?):(\d+):(\d+)\)?/.exec(line.trim());
      if (!match) return { filename: line.trim() };
      return {
        function: match[1],
        filename: match[2],
        lineno: parseInt(match[3]!, 10),
        colno: parseInt(match[4]!, 10),
      };
    });
}
