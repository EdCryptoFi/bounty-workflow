# Deploy Report — Bounty WorkFlow

**Deploy:** 18 Apr 2026 · production · READY

## URLs
- **Produção:** https://bounty-workflow.vercel.app
- **Projeto Vercel:** `prj_iEiP85CukIWIzRsVOAnbQnHBYwDi` (owner: cryptolairbr-8192)
- **Supabase:** https://kjjaymadgmfmrvkraian.supabase.co

## Smoke tests (todos verdes)

| Endpoint | Esperado | Resultado |
|---|---|---|
| `GET /` | 200 landing | ✅ 200 |
| `GET /protocols` | 200 catálogo (12 protocolos) | ✅ 200, 42KB |
| `GET /auth/login` | 200 form | ✅ 200 |
| `GET /api/health` | 200 JSON | ✅ `{"ok":true,"env":"production"}` |
| `GET /dashboard` | 307 → /auth/login | ✅ 307 (middleware OK) |
| `GET /api/cron/reminders` (sem bearer) | 401 | ✅ |
| `GET /api/cron/reminders` (bearer errado) | 401 | ✅ |
| `GET /api/cron/reminders` (bearer ok) | 200 `{processed:0}` | ✅ |
| `POST /api/webhooks/stripe` (off) | 503 | ✅ |
| `POST /api/webhooks/asaas` (off) | 503 | ✅ |

## Módulos entregues

- ✅ M01 Auth — login/signup/magic-link/Google OAuth, callback anti-open-redirect
- ✅ M02 Layout — AppShell, Sidebar, TrialBadge, Mobile drawer
- ✅ M03 Campanhas — Timeline + WorkflowCanvas (react-flow) + TaskCards + AttachmentDropzone
- ✅ M04 Protocolos — catálogo público ISR + admin CRUD
- ✅ M05 Reminders — criar/listar/cancelar + cron diário (09:00 UTC — Hobby limita)
- ✅ M06 Pagamentos — Stripe + Asaas webhooks (HMAC timing-safe, idempotência via webhook_events, `client_reference_id = user.id` fix C4). **Feature flag OFF** — ligar quando Ed entregar as chaves.
- ✅ M07 Arquivo — /archive + unarchive + export CSV com escape anti-fórmula (fix A4)
- ✅ M08 Observabilidade — structured logger, error boundary, Sentry opcional, /api/health, CI GitHub Actions

## Vulnerabilidades críticas fixadas

| ID | Descrição | Fix |
|---|---|---|
| C1 | RLS não forçada | `force row level security` em todas as tabelas |
| C2 | Email case-sensitive uniqueness | `citext` |
| C3 | Storage bucket sem RLS | 4 policies por folder prefix = auth.uid() |
| C4 | Payment hijack via email replay | `client_reference_id` + `externalReference` = user.id |
| C5 | Webhook replay | `webhook_events` unique(provider, provider_event_id) |
| A1 | Trigger race | `SECURITY DEFINER` em `handle_new_user` |
| A3 | Admin gate fraco | `is_admin()` via `auth.jwt()` claim |
| A4 | CSV formula injection | prefixo `'` em `=+-@\t\r` |

## Env vars configuradas no Vercel (production + preview)

- ✅ `NEXT_PUBLIC_SUPABASE_URL`
- ✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- ✅ `SUPABASE_SERVICE_ROLE_KEY` (sensitive)
- ✅ `NEXT_PUBLIC_APP_URL`
- ✅ `NEXT_PUBLIC_PAYMENTS_ENABLED=false`
- ✅ `CRON_SECRET` (sensitive) — salvo também em `/tmp/bounty-cron-secret.txt` da sessão

## Pendente pro Ed

1. **Gerar token GitHub** com `repo:write` (o fine-grained atual só tem acesso a 3 repos existentes; não conseguiu criar `bounty-workflow`). Depois posso conectar o repo pro CI/CD rodar automático.
2. **Ativar pagamentos** quando tiver as chaves:
   - Stripe: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_PRICE_ID_MONTHLY`
   - Asaas: `ASAAS_API_KEY`, `ASAAS_WEBHOOK_TOKEN`, `ASAAS_ENV=sandbox|production`
   - Flipar `NEXT_PUBLIC_PAYMENTS_ENABLED=true`
3. **Configurar Resend** (`RESEND_API_KEY`, `RESEND_FROM`) pra emails de reminder saírem. Sem isso o cron marca como failed.
4. **Upgrade Vercel pra Pro** se quiser cron a cada 5min (hoje roda 1x/dia).
5. **Sentry** (opcional): setar `SENTRY_DSN` pra erros irem pra lá — logger já envia via HTTP.
