# Handoff — Deploy do Bounty WorkFlow

**Status:** Fase 1 concluída, Fase 2 parcialmente escrita. Bloqueado por allowlist do sandbox Cowork na conversa anterior. Nova conversa precisa herdar a allowlist atualizada.

---

## Contexto curto

Ed (cryptolairbr@gmail.com) quer deploy completo do Bounty WorkFlow — SaaS de caçadores de bounties cripto BR. Stack: Next.js 14 App Router + Supabase + Stripe/Asaas + Resend + Vercel + Sentry. 8 módulos especificados nos `Qwen_txt_*.txt`. Avaliação completa em `AVALIACAO_COMPLETA.md` com 5 vulnerabilidades críticas (C1-C5) que devem ser fixadas ANTES de deploy.

Mockup de UI já aprovado pelo Ed: **timeline por deadline** como view default + **workflow visual (react-flow)** como drill-down ao clicar numa campanha. Referência em `pipeline-mockup-v2.html`.

## Decisões tomadas pelo Ed

- **Repo GitHub:** `bounty-workflow` (público)
- **Supabase:** usar projeto existente `kjjaymadgmfmrvkraian` (Ed confirmou que está vazio)
- **Domínio:** `.vercel.app` grátis por enquanto
- **Escopo:** produto completo (8 módulos + pagamentos)
- **Execução:** Claude opera tudo por API, Ed só entra quando precisar (cadastro Stripe/Asaas)

## Tokens

Os tokens de acesso não são armazenados aqui por segurança. Configure-os como variáveis de ambiente locais ou via painel da Vercel/Supabase.

**Variáveis necessárias:** `GITHUB_TOKEN`, `VERCEL_TOKEN`, `SUPABASE_ACCESS_TOKEN`  
**Supabase project ref:** `kjjaymadgmfmrvkraian`

## O que já foi feito

- ✅ Mockup de UI com 3 variações + versão v2 interativa aprovada
- ✅ `supabase/migrations/20260417000001_initial_schema.sql` com schema completo + fixes C1-C5, A1, A3 (**já escrito, revisar e aplicar**)
- ✅ Tasks criadas no TodoList (Fases 1-7)

## O que falta

### Antes de escrever qualquer coisa:
1. Validar os 3 tokens com as chamadas acima
2. `GET https://api.supabase.com/v1/projects/kjjaymadgmfmrvkraian/` pra ver se está mesmo vazio
3. Listar tabelas existentes pra confirmar que podemos aplicar a migration sem conflito

### Fase 2 (já comecei):
4. Revisar `supabase/migrations/20260417000001_initial_schema.sql`
5. Aplicar migration no projeto Supabase via `POST https://api.supabase.com/v1/projects/kjjaymadgmfmrvkraian/database/query`
6. Verificar que RLS está forçada em todas as tabelas

### Fase 3:
7. Scaffold Next.js 14 com route groups `(app)`, `(auth)`, `(public)`
8. Instalar deps: `@supabase/ssr`, `@supabase/supabase-js`, `@xyflow/react`, `zod`, `tailwindcss`, `shadcn/ui`, `lucide-react`, `@sentry/nextjs`
9. Módulo 01 (auth): `/auth/login`, `/auth/signup`, callback, middleware
10. Módulo 02 (layout): AppShell, Sidebar, TrialBadge, Mobile drawer

### Fase 4:
11. Módulo 03: Timeline + WorkflowCanvas (react-flow) + TaskCard + AttachmentDropzone
12. Módulo 04: Catálogo de protocolos público + admin
13. Módulo 05: Reminders com cron (`/api/cron/reminders`)

### Fase 5 (requer Ed pra cadastro Stripe/Asaas):
14. Webhooks com HMAC + idempotência (C5)
15. Checkout via `client_reference_id = user.id` (C4)
16. Asaas (PIX BR)

### Fase 6:
17. Módulo 07: Arquivo + export CSV com escape de fórmulas (A4)
18. Módulo 08: Sentry, cron, CI, structured logs

### Fase 7:
19. Criar repo GitHub `bounty-workflow`
20. Push do código
21. Criar projeto Vercel vinculado ao repo
22. Set env vars via API Vercel
23. Trigger deploy
24. Smoke test

## Allowlist do sandbox

Ed já liberou "All domains" em Settings → Capabilities → Domain allowlist. A nova conversa deve herdar. Se falhar com `cowork-egress-blocked`, avisar e pedir pra reiniciar o app de novo.

## Arquivos relevantes

- `AVALIACAO_COMPLETA.md` — vulnerabilidades e roadmap
- `Qwen_txt_20260417_*.txt` — specs dos 8 módulos
- `Ui.png` — paleta visual (verde menta)
- `pipeline-mockup-v2.html` — UX aprovada (timeline + drill-down)
- `supabase/migrations/20260417000001_initial_schema.sql` — schema com fixes

## Tom e estilo

- Ed prefere português, respostas diretas, sem formalidade
- Quer o mínimo de trabalho manual — "eu quero que vc faça tudo sozinho"
- Confia em recomendações mas gosta de ver opções antes de decidir (use AskUserQuestion pras encruzilhadas)
- Adiciona TodoList pra cada fase pra ele acompanhar
