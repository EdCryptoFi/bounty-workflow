# 07 — UI Redesign + Timeline Fix (Blueprint)

> Status: blueprint pré-implementação. Documento serve como contrato pra dois sub-agentes paralelos (A: design system core, B: refactor páginas + timeline).
> Escopo: corrigir bug crítico da timeline + extrair design tokens + padronizar tipografia/espaçamento/cards/botões em todas as telas autenticadas e públicas.
> Não-escopo: mexer em RLS, server actions, schema do banco, integrações de pagamento.

---

## 1. Diagnóstico — bug da timeline ("728011d atrás")

### 1.1 Sintoma
Print mostra a campanha "aaa" com deadline "01/02/33" exibindo `01 fev (728011d atrás)`.
728.011 dias ≈ 1994 anos → indica que a data persistida no banco está com **ano 33** (33 d.C.), não 2033.

### 1.2 Causa raiz — três bugs em cascata

**Bug 1 — validação ausente no insert.** `src/lib/campaigns/actions.ts:12`
```ts
deadline: z.string().optional(),   // aceita qualquer string
```
Linha 37: `deadline: parsed.data.deadline || null`. Se o navegador não normaliza o `<input type="date">` (Safari antigo, autofill, paste manual com `dd/mm/yy`), `"33-02-01"` passa direto. Postgres aceita `'33-02-01'::date` e armazena como `0033-02-01`.

**Bug 2 — cálculo sem sanity-check.** `src/lib/campaigns/queries.ts:21-24`
```ts
const days_to_deadline = c.deadline
  ? Math.ceil((new Date(c.deadline).getTime() - now) / (1000 * 60 * 60 * 24))
  : null;
```
`new Date("0033-02-01")` retorna timestamp negativo de ~62 bilhões → diff gigante → `-728011`.

**Bug 3 — formatador não trata data inválida.** `src/components/campaigns/timeline.tsx:132-140`
Sem `isNaN(d.getTime())` ou range check. `Intl.DateTimeFormat` com data ano 33 imprime "01 fev" (sem o ano), o que esconde o problema.

Mesmo padrão repetido em:
- `src/app/(app)/campaigns/[id]/page.tsx:24-26`
- `src/app/(app)/archive/page.tsx:84`

### 1.3 Fix mínimo (sem alterar schema)

**a) Validar no insert** (`actions.ts:12`):
```ts
deadline: z.string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Formato inválido")
  .refine((s) => {
    const y = Number(s.slice(0, 4));
    return y >= 2000 && y <= 2100;
  }, "Ano fora do intervalo")
  .optional()
  .or(z.literal("")),
```

**b) Helper centralizado** em `src/lib/campaigns/date-utils.ts` (novo):
```ts
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
```

**c) Usar em queries.ts** e em todo display.

**d) SQL one-shot pra higienizar dados existentes**:
```sql
UPDATE campaigns
SET deadline = NULL
WHERE deadline IS NOT NULL
  AND (extract(year from deadline) < 2000 OR extract(year from deadline) > 2100);
```

---

## 2. Inconsistências encontradas (auditoria)

### 2.1 Page padding / wrapper
| Arquivo | Wrapper |
|---|---|
| `dashboard/page.tsx:13` | `space-y-6` (herda do shell) |
| `archive/page.tsx:24` | `mx-auto max-w-5xl space-y-6 p-6` (padding duplicado) |
| `settings/*/page.tsx` | `mx-auto max-w-3xl space-y-6 p-6` (idem) |
| `admin/protocols/page.tsx:18` | `space-y-6` |
| `reminders/page.tsx:34` | `space-y-8` (gap divergente) |
| `campaigns/[id]/page.tsx:29` | `space-y-6` |

### 2.2 Botão primário "mint" — 6 variantes
Padding varia de `px-3 py-2` até `px-6 py-3`; tipografia oscila entre `text-sm font-medium` e sem classe; `rounded-lg` consistente mas tamanho não.

### 2.3 Botão secundário ("Export", "Voltar") — 4 variantes

### 2.4 Cards — 4 radius (`xl`, `2xl`, `3xl`) + 6 paddings

### 2.5 Headings — `font-semibold` (app) vs `font-bold` (landing); h2 entre `text-sm uppercase`, `text-lg`, `text-3xl`

### 2.6 "Section header" uppercase muted — duplicado em 6 arquivos copy-paste

### 2.7 Inputs — 9 ocorrências da mesma combinação

### 2.8 Badges/pills — 5 implementações diferentes (StatusBadge, StatusPill x2, inline, TrialBadge)

### 2.9 Empty states — 5 variações

### 2.10 Cores hard-coded fora do design system (amber, blue, slate direto)

---

## 3. Design tokens propostos

### 3.1 CSS vars (`src/app/globals.css`)

```css
@layer base {
  :root {
    --success: 156 56% 46%;
    --success-foreground: 0 0% 100%;
    --success-soft: 152 76% 96%;

    --warning: 38 92% 50%;
    --warning-foreground: 26 83% 14%;
    --warning-soft: 48 96% 89%;

    --info: 217 91% 60%;
    --info-foreground: 0 0% 100%;
    --info-soft: 214 95% 93%;

    --danger: 0 72% 51%;
    --danger-foreground: 0 0% 100%;
    --danger-soft: 0 86% 97%;

    --page-px: 1.5rem;
    --page-py: 2rem;
    --section-gap: 1.5rem;
    --card-padding: 1.5rem;
    --card-padding-tight: 1rem;
    --card-padding-loose: 2rem;

    --radius-sm: 0.375rem;
    --radius-md: 0.5rem;
    --radius-lg: 0.75rem;
    --radius-xl: 1rem;
    --radius-2xl: 1.25rem;

    --shadow-sm: 0 1px 2px 0 hsl(0 0% 0% / 0.04);
    --shadow-md: 0 4px 12px -2px hsl(0 0% 0% / 0.08);
  }

  .dark {
    --success: 156 56% 58%;
    --success-soft: 168 67% 18% / 0.4;
    --warning: 38 92% 50%;
    --warning-soft: 26 83% 14% / 0.5;
    --info: 217 91% 60%;
    --info-soft: 222 47% 22%;
    --danger: 0 62% 55%;
    --danger-soft: 0 30% 18%;
    --shadow-sm: 0 1px 2px 0 hsl(0 0% 0% / 0.4);
    --shadow-md: 0 4px 12px -2px hsl(0 0% 0% / 0.5);
  }
}
```

### 3.2 Extend Tailwind

```ts
extend: {
  colors: {
    success: {
      DEFAULT: "hsl(var(--success) / <alpha-value>)",
      foreground: "hsl(var(--success-foreground) / <alpha-value>)",
      soft: "hsl(var(--success-soft) / <alpha-value>)",
    },
    warning: { /* idem */ },
    info: { /* idem */ },
    danger: { /* idem */ },
  },
  borderRadius: {
    sm: "var(--radius-sm)", md: "var(--radius-md)",
    lg: "var(--radius-lg)", xl: "var(--radius-xl)", "2xl": "var(--radius-2xl)",
  },
  boxShadow: { sm: "var(--shadow-sm)", md: "var(--shadow-md)" },
}
```

### 3.3 Tipografia (utilitários `@layer components`)

```css
.typo-h1 { @apply text-3xl font-semibold tracking-tight sm:text-4xl; }
.typo-h2 { @apply text-2xl font-semibold tracking-tight; }
.typo-h3 { @apply text-lg font-semibold; }
.typo-section-label { @apply text-xs font-semibold uppercase tracking-wide text-muted-foreground; }
.typo-body { @apply text-sm text-foreground; }
.typo-caption { @apply text-xs text-muted-foreground; }
.typo-label { @apply text-sm font-medium; }
.typo-hero { @apply text-4xl font-bold tracking-tight sm:text-6xl; }
.typo-hero-sub { @apply text-lg text-muted-foreground sm:text-xl; }
```

### 3.4 Decisão sobre radius padrão
- **Cards de conteúdo** → `rounded-xl` (único).
- **Botões/inputs** → `rounded-lg`.
- **Pills/badges** → `rounded-full`.
- **Hero blocks** → `rounded-2xl` (exceção).
- **Eliminar** `rounded-3xl` e `rounded-lg` em cards.

---

## 4. Componentes-base a criar

Pasta nova: `src/components/ui/`

### 4.1 `<PageHeader title subtitle actions back? />`

### 4.2 `<Card variant padding />`
- `default` → `border bg-card`
- `muted` → `bg-muted/30 border`
- `dashed` → `border-dashed bg-muted/20`
- Sempre `rounded-xl`.

### 4.3 `<Button variant size asChild iconLeft iconRight loading />`
- Variantes: primary, secondary, ghost, danger, link
- Sizes: sm (h-8), md (h-10, default), lg (h-12)

### 4.4 `<Badge tone size icon />`
- Tones: neutral, success, warning, info, danger, mint
- Sizes: xs (10px), sm (12px, default)

### 4.5 `<EmptyState icon title description action size />`

### 4.6 `<SectionHeader label count actions />`

### 4.7 `<Field id label hint error />` + helper `inputClasses`

---

## 5. Timeline nova — estrutura

### 5.1 Recomendação: **Híbrido lista vertical + bucket**

> Lista vertical agrupada por bucket (preserva mental model atual) + gutter cronológico à esquerda com data e contador + card largo único à direita (não grid de 3 colunas).

Justificativa:
- Use case típico: 3–10 campanhas em paralelo. Grid de 3 colunas desperdiça espaço.
- Card largo dá mais espaço pra título, descrição, progresso, valor.
- Mais expansível (acordeon, swipe, drag-and-drop futuro).

### 5.2 Wireframe

```
┌──────────────────────────────────────────────────────────────────┐
│ Timeline                                  [Export] [+ Nova]      │
│ Suas campanhas ordenadas por deadline.                           │
├──────────────────────────────────────────────────────────────────┤
│  ATRASADAS · 2                                                   │
│  ┌─ 28 jan ─┐  ┌──────────────────────────────────────────────┐  │
│  │ 3d atrás │  │ Bounty LayerZero — fase 2  [Ativa]           │  │
│  │  ●——     │  │ Mintar bridge tx + thread                    │  │
│  └──────────┘  │ ████████░░░░ 4/6 tarefas   R$ 500            │  │
│                └──────────────────────────────────────────────┘  │
│  HOJE · 1                                                        │
│  PRÓXIMOS 7 DIAS · 2                                             │
│  MAIS TARDE · 4    [▼ expandir]                                  │
│  SEM PRAZO · 0  (oculto se vazio)                                │
└──────────────────────────────────────────────────────────────────┘
```

### 5.3 Estrutura de arquivos

```
src/components/campaigns/timeline.tsx (reescrever)
  ├── <Timeline />
  ├── <TimelineBucket />     bucket header + lista + collapse
  ├── <TimelineRow />        gutter + card
  ├── <TimelineGutter />     badge de data + linha conectora
  └── <TimelineCard />       card largo
```

---

## 6. Plano de implementação — 2 sub-agentes paralelos

### Sub-agente A — Design system core
- `src/app/globals.css` — tokens CSS
- `tailwind.config.ts` — extend colors/radius/shadow
- `src/components/ui/{page-header,card,button,badge,empty-state,section-header,field}.tsx` (novos)
- `src/components/ui/index.ts` (re-exports)

Entrega: build verde, sem alterar páginas. Smoke: `pnpm typecheck && pnpm lint`.

### Sub-agente B — Refactor + timeline + fix bug

**Bloco 1 — Fix bug** (independente do A, vai antes):
- `src/lib/campaigns/date-utils.ts` (novo): parseDeadline, daysUntil
- `src/lib/campaigns/queries.ts`: usar daysUntil
- `src/lib/campaigns/actions.ts`: Zod refinement
- `src/components/campaigns/timeline.tsx`: formatDeadline defensivo
- `src/app/(app)/campaigns/[id]/page.tsx`: substituir cálculo
- `src/app/(app)/archive/page.tsx`: helper formatter

**Bloco 2 — Timeline nova** (depende A): reescrever timeline.tsx.

**Bloco 3 — Pages app** (depende A): dashboard, archive, reminders (page+form), admin/protocols (page+form), campaigns/new, campaigns/[id], settings/{,/account,/billing}.

**Bloco 4 — Public + auth** (depende A): (public)/page, como-funciona, public-header, login-form, signup-form, google-button, twitter-button.

**Bloco 5 — Shell** (depende A): sidebar, trial-badge, coming-soon (vira EmptyState), user-menu/topbar/drawer/searchbar (ajustes só de classes).

### Dependências
```
B-bloco-1 → INDEPENDENTE (fix bug, antes de tudo)
A          → tokens + componentes
B-blocos 2..5 ─→ todos dependem de A
```

### Critérios de "pronto"
- Zero `bg-mint-600 px-...` solto fora de `<Button>`.
- Zero `rounded-2xl` em card de conteúdo (só hero/empty).
- Zero `new Date(c.deadline)` fora de `date-utils.ts`.
- Build sem warnings novos.

---

## 7. Riscos e edge cases

### 7.1 Banco e RLS
- Migration de higienização (UPDATE deadline=NULL onde year<2000) precisa rodar uma vez via SQL Editor. Não é DDL. Risco baixo.
- Schema não muda. `Campaign.deadline: string | null` continua.

### 7.2 Timezone
- `date` no banco (sem hora). Cliente UTC-3. Fix: forçar `T12:00:00` no parse pra evitar drift de borda. Vercel Node em UTC, mas comparação é simétrica em ms.

### 7.3 Tailwind purge
- Não usar template literal pra cores (`bg-${tone}-soft`). Switch explícito.
- Safelist se necessário: `safelist: ["bg-success-soft","bg-warning-soft","bg-info-soft","bg-danger-soft"]`.

### 7.4 Dark mode
- Variantes `*-soft` em dark já têm overrides em `.dark`. Testar contraste de Badge tone="info".

### 7.5 Mobile
- Gutter da timeline 96px desktop / hidden em mobile (meta vira inline no card).
- `<PageHeader actions>` precisa `flex-wrap gap-3`.

### 7.6 Acessibilidade
- `<Button asChild>` com `<Link>` — não duplicar role.
- `<Badge>` decorativo, mas billing/status pode precisar `role="status"`.

### 7.7 Detecção de regressão
- Após refactor, grep `amber-|blue-(100|900)|slate-(100|700)` pra detectar sobras.

### 7.8 Out of scope
- WorkflowCanvasRnd, BriefingBadges, BriefingDetailModal — Commit 2.5 já fechou, ficam pra fase 2.
- CSV export, server actions, payments, RLS — não tocar.

---

## Resumo executável

1. **B-bloco-1 (fix bug)** — pode ir antes de A. ~1h.
2. **A (design system)** — tokens + 7 componentes. ~2h.
3. **B-blocos 2..5 (refactor)** — timeline nova + 14 páginas. ~4–6h.
4. **Smoke + build**.
