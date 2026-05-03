# Avaliação Completa — Bounty WorkFlow

**Data:** 17/04/2026
**Escopo:** 8 módulos de especificação (MODULE_01 a MODULE_08)
**Metodologia:** 3 agentes paralelos (Segurança, Arquitetura, Produto/UX-CRO) + revisão consolidada
**Stack avaliada:** Next.js 14 (App Router) + Supabase + TypeScript + Stripe/Asaas/Coinbase + Resend + Vercel + Sentry

---

## Sumário Executivo

O projeto tem decomposição modular sólida, base de segurança (RLS) presente e uma escolha de diferenciação forte (workflow visual via react-flow em um nicho cripto BR mal servido). No entanto, existem **quatro vulnerabilidades críticas bloqueantes para produção**, **duplicação de estado** entre `users` e `subscriptions`, **ausência de camada de domínio** (service/repository) e **lacunas de produto** que inviabilizam crescimento pós-launch (trial curto demais, zero event tracking, sem pricing público, sem mobile/push).

Prioridade imediata: corrigir C1–C5 de segurança antes de qualquer outro trabalho. Em paralelo, padronizar route groups do App Router, remover duplicação de `subscription_status` e adicionar event tracking + template de onboarding.

---

## 1. SEGURANÇA

### CRÍTICO (bloqueantes para produção)

**C1 — RLS da tabela `users` expõe PII de todos os usuários (MOD 01)**
A policy `read_trial_public FOR SELECT USING (true)` libera `SELECT *` na tabela inteira. RLS opera por linha, não por coluna — o comentário "apenas colunas não sensíveis" é falso.
*Correção:* drop da policy, criar VIEW `users_public` com colunas seguras, `ALTER TABLE users FORCE ROW LEVEL SECURITY`.

**C2 — RLS de `subscriptions` expõe dados financeiros globais (MOD 06)**
`read_status_public FOR SELECT USING (true)` expõe `user_id`, `provider`, `status`, `current_period_end` de todos. Competidores levantam MRR/churn; atacantes segmentam pagantes.
*Correção:* remover policy; usar VIEW ou coluna derivada em `users` se precisar de badge público.

**C3 — Policy `protocols_admin` com `auth.role()='service_role'` não protege (MOD 04)**
Service role faz bypass de RLS no PostgREST; a policy é letra morta. Se `JWT_SECRET` vazar, escrita total no catálogo = supply-chain (protocolos de phishing).
*Correção:* tabela `user_roles(user_id, role)` + policy baseada em `EXISTS (... role='admin')`. Nunca expor service_role no client.

**C4 — Account takeover via webhook Stripe (MOD 06)**
`getUserByEmail` confiando em `customer_email` do evento permite atacante com e-mail não verificado herdar conta existente.
*Correção:* usar `client_reference_id = user.id` na criação do Checkout Session + exigir `email_confirmed_at`.

**C5 — Webhooks sem idempotência/HMAC estrito (MOD 06)**
Spec diz "Verificação HMAC mencionada" sem detalhe. Falta `constructEvent`/`timingSafeEqual`, tabela `webhook_events(event_id PK)` para idempotência e janela de timestamp anti-replay.
*Correção:* `INSERT` no `webhook_events` antes de processar (PK duplicada = já processado).

### ALTO

- **A1 — IDOR em `attachments`**: RLS por `user_id` mas sem validar `campaign_id` do dono. Usar `EXISTS` em campaigns.
- **A2 — Timing attack em `CRON_SECRET`**: trocar `===` por `crypto.timingSafeEqual` e validar header `x-vercel-cron`.
- **A3 — Upload de arquivos**: validar magic bytes server-side, servir de subdomínio separado, `X-Content-Type-Options: nosniff`, bloquear `.svg`/`.html`, nomes UUID.
- **A4 — CSV Injection no export (MOD 07)**: valores com `=+-@` executam fórmulas. Prefixar `'` em valores suspeitos e escapar `"`.
- **A5 — Rate-limit só por IP em `/api/auth/*` (5/min)**: contornável com botnet. Combinar IP + email + Turnstile após N falhas, bloquear domínios descartáveis, verificação de email antes do trial.
- **A6 — `log_statement='all'` em dev**: vaza PII e tokens. `'none'` ou `'ddl'` em produção; usar `pgaudit` se necessário.

### MÉDIO

- **M1** — Middleware Next como única barreira: toda rota `/api` deve revalidar sessão server-side.
- **M2** — `/api/layout/user` vazando `subscription_status` amplia enumeração de premium.
- **M3** — Garantir que Supabase client use cookies adapter (não localStorage) para tokens.
- **M4** — Healthcheck sem try/catch e usando `SELECT users` (caro + vaza schema em erro).
- **M5** — Soft delete + LGPD art. 18 IV: precisa endpoint de purge real < 72h.
- **M6** — RLS deve considerar `archived` para evitar IDOR em restauração.
- **M7** — Sentry `tracesSampleRate: 0.1` captura URLs/headers/body: `beforeSend` com scrub, `sendDefaultPii: false`.

### BAIXO

- `robots.txt` não é controle de segurança; adicionar `X-Robots-Tag: noindex` nas rotas privadas.
- Backup S3: exigir SSE-KMS, Object Lock, MFA delete, restauração testada trimestralmente.
- Webhooks sem CORS (server-to-server); demais rotas autenticadas com `X-Requested-With` + checagem de `Origin`.
- CI que falha build se `NEXT_PUBLIC_*` bater regex de secret.
- E-mails com `List-Unsubscribe` (Resend suporta), registrar consentimento LGPD art. 8º.

---

## 2. ARQUITETURA

### Pontos fortes

Separação modular clara, RLS como primeira linha de defesa, multi-provedor de pagamento bem unificado (`provider` + `provider_sub_id`), SEO dual-mode no módulo de protocols (rota pública + gestão interna), infra madura (Sentry, Upstash, Zod, cron com secret), `planning_json` em jsonb permitindo evolução sem migrations.

### Problemas estruturais

Path `/app/app/...` é ambíguo: o idiomático Next.js 14 é `/app/(app)/dashboard/page.tsx` usando route group sem segmento na URL. Mistura de Route Handlers com fluxo Supabase Auth (SDK já faz login no client) é redundante. `WorkflowCanvas` provavelmente 100% client-side sem separação de repository/service. `planning_json` sem Zod versionado = drift entre UI e persistência. Webhooks em 3 rotas separadas sem handler unificado nem fila de retry. `permanent delete` sem cascade deixa `steps`, `attachments` e `reminders` órfãos. `supabase db push` direto em produção sem shadow DB nem rollback.

### Inconsistências entre módulos

Múltiplos enums de status declarados como `text` e não Postgres ENUM — "active" aparece em domínios com semânticas distintas. Sem `supabase gen types typescript` em CI — types manuais divergem do schema. Convenção de rotas mista: REST (`/api/campaigns`), RPC (`/api/planning/copy`), job (`/api/cron/reminders`) sem documentação.

### Gaps de schema

FKs sem `ON DELETE` explícito (SET NULL/CASCADE/RESTRICT). `steps(campaign_id, order_index)` sem UNIQUE composto — reordenação paralela corrompe. Índices faltando: `reminders(status, trigger_at)`, `campaigns(user_id, status, archived_at)`, `attachments(campaign_id)`, `subscriptions(user_id, status)`. `protocols.id` sem confirmação de `uuid PRIMARY KEY`. `attachments` sem `bucket`, `path`, `mime_type`, `size_bytes`, `checksum`. `notification_logs` mencionado no MOD 05 mas sem schema. Duplicação `users.subscription_status` + `subscriptions.status` = dessincronização garantida.

### Padrões faltando

Server Actions (Next 14+) para mutações internas em vez de Route Handlers. Camada `/lib/db/repositories/` encapsulando queries. DTOs Zod de input/output. Types gerados do DB (`supabase gen types`). Testing (Vitest unit + Playwright e2e) bloqueando merge. Structured logging com request_id (pino). Feature flags para rollout.

### Escalabilidade

N+1 clássico em listagem de campanhas+steps+attachments. Realtime não mencionado — canvas colaborativo multi-aba quebra. Paginação cursor-based ausente. Cache de tags do App Router subutilizado (`revalidateTag('protocols')`). Cron síncrono processando todos reminders num endpoint único = timeout com 10k+ itens; usar Supabase Queues / Inngest. Storage sem política de lifecycle = custo linear.

### Top 10 melhorias arquiteturais

1. Padronizar route groups: mover `/app/app/*` para `/app/(app)/*`; criar `ARCHITECTURE.md`.
2. Eliminar duplicação: remover `users.subscription_status` e `users.trial_ends_at`; criar VIEW `v_user_billing`.
3. Schema hardening: UNIQUEs compostos, CASCADE explícito, índices, Postgres ENUMs.
4. `supabase gen types` em CI + `SupabaseClient<Database>` tipado.
5. Camada repository/service + Server Actions para mutações internas; Route Handlers só para webhooks/cron/API pública.
6. Tabela `webhook_events(provider, provider_event_id UNIQUE)` para idempotência + definir `notification_logs`.
7. Attachments completos: `(bucket, path, mime_type, size_bytes, checksum, uploaded_by)` + RLS no Supabase Storage espelhando campanhas.
8. Validação de `planning_json` com schema Zod versionado (`planning_v1`, `planning_v2`) + migração lazy.
9. CI/CD robusto: preview env por PR (Supabase branching + Vercel preview), `supabase db diff`, rollback, Vitest + Playwright obrigatórios.
10. Observabilidade + realtime: Supabase Realtime em `steps`/`attachments`; structured logs; SLO cron < 60s; dashboard Sentry de webhooks falhos.

---

## 3. PRODUTO / UX / CRO

### Avaliação geral

O produto ataca dor real no nicho cripto BR (caçadores de bounties operando em caos de planilhas e prints). Workflow visual é uma diferenciação ownable, difícil de replicar por concorrentes genéricos. Stack bem calibrada para BR (PIX via Asaas). Porém, o foco está em *o quê* e não em *como engajar*: faltam ativação (dashboard inicial será vazio), monetização transparente, mensuração (zero tracking) e viralidade. Trial de 5 dias é curto demais para workflow que depende de construir estrutura antes de ver valor. Sem mobile/push, contradiz a promessa de não perder deadline.

### Riscos principais

1. Trial curto + ativação fraca → conversão trial→paid provavelmente <8%.
2. Ausência de pricing público → fricção no topo do funil, impede price anchoring.
3. Zero event tracking → voa cego pós-launch, impossível priorizar fixes.
4. Sem push/mobile em produto cuja promessa é não perder deadline.
5. Catálogo de protocolos estático (admin-only) não escala vs Galxe/Layer3/CT.

### 15 melhorias priorizadas

**P0 — antes do launch**

1. Trial 14 dias (ou 7 + extensão por ação). Bounties têm ciclos semanais. +40–80% conversão esperada.
2. Template pré-populado no primeiro login (3 protocolos, nodes conectados). +30% D1 activation.
3. Pricing page pública com mensal/anual (anual ~30% off), FAQ, garantia 7 dias. +15–25% signup.
4. Event tracking (PostHog/Mixpanel): signup, first_node_created, first_reminder_set, checkout_started/completed, churn.
5. Checklist de ativação no dashboard (5 passos com progress bar). +25% ativação.

**P1 — primeiros 60 dias**

6. Push via PWA (service worker) — cobre 80% do mobile sem app nativo.
7. Streaks + badge de dias consecutivos (substitui trial badge pós-conversão).
8. Referral: 1 mês grátis para ambos lados, payout via credit. CAC -20%.
9. Relatório de ganhos com CSV para IR/declaração BR. Killer feature local.
10. Social proof na landing (contador de bounties, depoimentos, logos).
11. Onboarding com intent capture (quais protocolos? quantos bounties/mês? meta de ganho?) alimentando template.

**P2 — expansão 90+ dias**

12. Auto-detect bounties on-chain (wallet read-only + APIs Galxe/Layer3).
13. Calendário view alternativa ao react-flow + sync Google Calendar `.ics`.
14. Plano Team / shared workspace (guildas). ACV 3x.
15. Comunidade embutida (Discord widget ou feed anônimo de wins).

### Experimentos A/B recomendados

- Trial 5d vs 7d vs 14d → conversão trial→paid.
- Pricing mensal-first vs anual-first → ARPU.
- Hard paywall D5 vs soft paywall (3 nodes free forever) → conversão + signup.
- CTA "Assinar R$X/mês" vs "Plano anual (2 meses grátis)" → revenue per visitor.
- Dashboard vazio vs template vs template+vídeo 60s → D1 activation.
- Email trial dia 3: sem / "halfway" / case study → ativação D3–D5.
- Checkout PIX-first vs cartão-first → completion rate BR.

### Métricas-chave a trackear

- **Aquisição:** signup rate por canal, CAC por canal, time-to-signup.
- **Ativação (North Star candidato: "completou 1 ciclo de bounty no trial"):** D1 criou node, D3 agendou lembrete, D5 arquivou concluído.
- **Monetização:** trial→paid, checkout abandon por provedor, ARPU mensal vs anual, MRR/ARR/churn/NRR.
- **Retenção:** DAU/WAU/MAU, DAU/MAU ratio, streak distribution, cohort M1/M3/M6, feature adoption.
- **Produto:** nodes por usuário ativo, reminders disparados/completados/snoozed, p95 latency, Sentry error rate.
- **Viralidade:** K-factor, NPS, organic traffic em `/protocols/[slug]`.

---

## 4. ROADMAP DE AÇÃO PRIORIZADO

### Sprint 0 — Security hotfix (2–3 dias, BLOCKER)
Corrigir C1, C2, C3, C4, C5. Adicionar HMAC + idempotência em webhooks. Trocar `===` por `timingSafeEqual`. Hardening de upload (magic bytes, subdomínio, nosniff). CSV escape. Forçar RLS em todas as tabelas.

### Sprint 1 — Fundação arquitetural (1 semana)
Padronizar route groups `(app)`. Remover duplicação de `subscription_status`. Adicionar UNIQUEs, índices, CASCADEs. `supabase gen types` em CI. Schema de `notification_logs`, `webhook_events`, attachments completo. RLS no Supabase Storage.

### Sprint 2 — Domain layer + Server Actions (1 semana)
Criar `/lib/db/repositories/`. Migrar mutações internas para Server Actions. Zod schemas versionados para `planning_json`. Vitest setup.

### Sprint 3 — Preparação para launch (1 semana)
Trial 14d. Template pré-populado. Pricing page pública. Event tracking (PostHog). Checklist de ativação. Playwright e2e (login, checkout, criar campanha). CI bloqueante.

### Sprint 4 — Pós-launch growth (contínuo)
Push PWA, streaks, referral, relatório de ganhos, social proof. Rodar A/B tests do trial e paywall em ordem ortogonal.

---

## 5. VULNERABILIDADES BLOQUEANTES (resumo)

| ID | Descrição | Módulo |
|----|-----------|--------|
| C1 | RLS users expõe todos | 01 |
| C2 | RLS subscriptions expõe todas | 06 |
| C3 | `auth.role()='service_role'` não protege | 04 |
| C4 | Account takeover via email no webhook | 06 |
| C5 | Webhooks sem idempotência/HMAC estrito | 06 |

**Não faça deploy em produção antes de fechar essas cinco.**

---

## 6. CONCLUSÃO

Bounty WorkFlow tem fundação técnica competente e proposta de valor real. Os três agentes convergiram num mesmo diagnóstico: **execução sólida com lacunas táticas graves**. Em ordem de impacto: (1) segurança — 5 críticos que matam o produto no dia 1; (2) arquitetura — duplicação de estado e ausência de domain layer que viram débito técnico exponencial; (3) produto — faltam mecanismos básicos de ativação, monetização transparente e mensuração que determinam sobrevivência pós-launch.

Fechando as 4 vulnerabilidades críticas, os 10 itens arquiteturais top e as 5 melhorias P0 de produto antes do launch, o projeto sai do risco vermelho e entra numa trajetória defensável nos primeiros 90 dias.
