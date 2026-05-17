import { z } from "zod";

/**
 * Valida env vars em runtime. Falha cedo se algo essencial estiver faltando.
 * NEXT_PUBLIC_* ficam disponíveis no client também.
 */
// Helper: trata string vazia como undefined (útil pra vars opcionais com .env "CHAVE=")
const optStr = (min = 0) =>
  z
    .string()
    .transform((s) => (s.length === 0 ? undefined : s))
    .pipe(min > 0 ? z.string().min(min).optional() : z.string().optional())
    .optional();

const serverSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(20),
  SUPABASE_SERVICE_ROLE_KEY: optStr(20),
  NEXT_PUBLIC_APP_URL: optStr(),
  CRON_SECRET: optStr(16),
  ADMIN_EMAIL: optStr(),
  RESEND_API_KEY: optStr(),
  RESEND_FROM: optStr(),
  NEXT_PUBLIC_PAYMENTS_ENABLED: z.enum(["true", "false"]).default("false"),
  NEXT_PUBLIC_GA_ID: optStr(),
  STRIPE_SECRET_KEY: optStr(),
  STRIPE_WEBHOOK_SECRET: optStr(),
  STRIPE_PRICE_ID_MONTHLY: optStr(),
  STRIPE_PRICE_ID_YEARLY: optStr(),
  MERCADOPAGO_ACCESS_TOKEN: optStr(),
  MERCADOPAGO_WEBHOOK_SECRET: optStr(),
  MERCADOPAGO_PRICE_MONTHLY_BRL: optStr(),
  GROQ_API_KEY: optStr(),
  GEMINI_API_KEY: optStr(),
  MISTRAL_API_KEY: optStr(),

  X_CLIENT_ID: optStr(),
  X_CLIENT_SECRET: optStr(),
});

const clientSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(20),
  NEXT_PUBLIC_APP_URL: z.string().url().optional(),
  NEXT_PUBLIC_PAYMENTS_ENABLED: z.enum(["true", "false"]).default("false"),
  NEXT_PUBLIC_GA_ID: z.string().optional(),
});

const isServer = typeof window === "undefined";

const parsed = isServer
  ? serverSchema.safeParse(process.env)
  : clientSchema.safeParse({
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
      NEXT_PUBLIC_PAYMENTS_ENABLED: process.env.NEXT_PUBLIC_PAYMENTS_ENABLED,
      NEXT_PUBLIC_GA_ID: process.env.NEXT_PUBLIC_GA_ID,
    });

if (!parsed.success) {
  console.error("❌ Invalid env vars:", parsed.error.flatten().fieldErrors);
  throw new Error("Invalid environment configuration");
}

export const env = parsed.data;
export const paymentsEnabled = env.NEXT_PUBLIC_PAYMENTS_ENABLED === "true";
