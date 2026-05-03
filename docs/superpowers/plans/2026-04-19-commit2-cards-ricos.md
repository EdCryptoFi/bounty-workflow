# Commit 2 — Card rico + Modal Nova Tarefa + react-rnd + painel Info

> **For agentic workers:** Este plano usa checkboxes (`- [ ]`) pra tracking por step. Recomendado executar task-a-task com TDD.

**Goal:** Transformar o detalhe de campanha num workspace visual: cards grandes com Briefings variáveis, status toggles (Planejamento/Publicação/Feito), troféu com valor USD/X, drag & resize livre no canvas (react-rnd) e painel lateral Info (Login/Blockchain/Wallet).

**Architecture:**
- Extensão do schema `steps` com colunas semânticas pra briefings, status triplo, trophy e posição no canvas.
- Nova tabela `campaign_info` 1-1 com campaigns pra guardar Login/Blockchain/Wallet (separada pra RLS limpa e evitar inchar `campaigns`).
- Dois novos componentes client: `TaskCardRich` (substitui TaskCard antigo) e `WorkflowCanvasRnd` (substitui WorkflowCanvas com XYFlow). Antigo XYFlow sai de cena nesta rota — fica só se formos reusar em outra view (provavelmente não).
- Reutiliza `useOptimistic` + server actions já existentes em `lib/campaigns/actions.ts`.

**Tech Stack:**
- Next.js 14 App Router + Server Components
- Supabase SSR (RLS force)
- react-rnd 10.x (drag + resize livres)
- Tailwind + classes mint existentes
- lucide-react (ícones)
- zod (validação)

---

## File Structure

**Novos:**
- `supabase/migrations/20260419000002_commit2_cards_rich.sql` — schema
- `src/components/campaigns/task-card-rich.tsx` — card drag/resize + briefings + trophy
- `src/components/campaigns/workflow-canvas-rnd.tsx` — canvas novo com react-rnd
- `src/components/campaigns/new-task-modal.tsx` — modal Nova Tarefa com status toggle
- `src/components/campaigns/info-panel.tsx` — painel Login/Blockchain/Wallet
- `src/components/campaigns/trophy-toggle.tsx` — botão troféu com popover USD/X
- `src/lib/campaigns/info-actions.ts` — server actions upsert info
- `src/lib/campaigns/rich-actions.ts` — server actions add/update/delete briefing, trophy, position
- `src/lib/campaigns/queries-rich.ts` — helper pra buscar steps + info em 1 roundtrip

**Modificados:**
- `src/app/(app)/campaigns/[id]/page.tsx` — nova layout: canvas-rnd + painel lateral Info
- `src/lib/types.ts` — StepStatus novo + campos ricos em Step + tipo `CampaignInfo`
- `src/lib/campaigns/actions.ts` — manter retrocompat (pode ficar intacto)
- `src/components/campaigns/add-step-form.tsx` — deletar no final (substituído por NewTaskModal)
- `src/components/campaigns/task-card.tsx` — deletar no final (substituído)
- `src/components/campaigns/workflow-canvas.tsx` — deletar no final (substituído)
- `package.json` — + react-rnd
- `pnpm-lock.yaml` — regen

---

## Schema — novas colunas/tabelas

**Tabela `steps` (existente) ganha:**
- `briefings jsonb not null default '[]'` — array `[{id, label, content}]` ilimitado
- `status_v2 text` — novo enum textual `'planning' | 'publishing' | 'done'` (mantém `status` antigo pra migração suave)
- `trophy_value_usd numeric(12,2)` — nullable
- `trophy_multiplier_x numeric(6,2)` — nullable ("2.5x" etc)
- `canvas_x integer not null default 0`
- `canvas_y integer not null default 0`
- `canvas_w integer not null default 320`
- `canvas_h integer not null default 220`

**Tabela nova `campaign_info` (1-1 com campaigns):**
```sql
create table public.campaign_info (
  campaign_id uuid primary key references public.campaigns(id) on delete cascade,
  login text,
  blockchain_ref text,   -- só referência textual
  wallet text,
  updated_at timestamptz not null default now()
);
```

RLS: policy baseada em `exists (select 1 from campaigns c where c.id = campaign_info.campaign_id and c.user_id = auth.uid())`.

---

## Task 1 — Migration SQL + tipos TS

**Files:**
- Create: `supabase/migrations/20260419000002_commit2_cards_rich.sql`
- Modify: `src/lib/types.ts` — adicionar novos tipos

- [ ] **Step 1: Criar migration**

Arquivo `supabase/migrations/20260419000002_commit2_cards_rich.sql`:

```sql
-- Commit 2 — Cards ricos + trophy + canvas free + painel Info
begin;

-- ============ steps: campos ricos ============
alter table public.steps
  add column if not exists briefings jsonb not null default '[]'::jsonb,
  add column if not exists status_v2 text check (status_v2 in ('planning','publishing','done')),
  add column if not exists trophy_value_usd numeric(12,2),
  add column if not exists trophy_multiplier_x numeric(6,2),
  add column if not exists canvas_x integer not null default 0,
  add column if not exists canvas_y integer not null default 0,
  add column if not exists canvas_w integer not null default 320,
  add column if not exists canvas_h integer not null default 220;

-- backfill status_v2 a partir de status antigo
update public.steps
   set status_v2 = case
     when status = 'done' then 'done'
     when status = 'in_progress' then 'publishing'
     else 'planning'
   end
 where status_v2 is null;

alter table public.steps
  alter column status_v2 set default 'planning',
  alter column status_v2 set not null;

-- ============ campaign_info: 1-1 ============
create table if not exists public.campaign_info (
  campaign_id uuid primary key references public.campaigns(id) on delete cascade,
  login text,
  blockchain_ref text,
  wallet text,
  updated_at timestamptz not null default now()
);

alter table public.campaign_info enable row level security;
alter table public.campaign_info force row level security;

drop policy if exists campaign_info_owner_select on public.campaign_info;
create policy campaign_info_owner_select on public.campaign_info
  for select to authenticated
  using (exists (
    select 1 from public.campaigns c
     where c.id = campaign_info.campaign_id and c.user_id = auth.uid()
  ));

drop policy if exists campaign_info_owner_upsert on public.campaign_info;
create policy campaign_info_owner_upsert on public.campaign_info
  for all to authenticated
  using (exists (
    select 1 from public.campaigns c
     where c.id = campaign_info.campaign_id and c.user_id = auth.uid()
  ))
  with check (exists (
    select 1 from public.campaigns c
     where c.id = campaign_info.campaign_id and c.user_id = auth.uid()
  ));

-- Trigger pra updated_at
create or replace function public.tg_campaign_info_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end; $$;

drop trigger if exists tg_campaign_info_updated_at on public.campaign_info;
create trigger tg_campaign_info_updated_at
  before update on public.campaign_info
  for each row execute function public.tg_campaign_info_updated_at();

commit;
```

- [ ] **Step 2: Atualizar types.ts**

Edit em `src/lib/types.ts` — adicionar após `StepStatus`:

```ts
export type StepStatusV2 = "planning" | "publishing" | "done";

export type Briefing = {
  id: string;       // uuid ou nanoid client-side
  label: string;    // "Briefing 1", "Briefing 2", ou custom
  content: string;
};

export type CampaignInfo = {
  campaign_id: string;
  login: string | null;
  blockchain_ref: string | null;
  wallet: string | null;
  updated_at: string;
};
```

Modificar o tipo `Step` adicionando:

```ts
export type Step = {
  // ... campos existentes
  briefings: Briefing[];
  status_v2: StepStatusV2;
  trophy_value_usd: string | null;        // numeric vem como string
  trophy_multiplier_x: string | null;
  canvas_x: number;
  canvas_y: number;
  canvas_w: number;
  canvas_h: number;
};
```

- [ ] **Step 3: Rodar typecheck pra garantir que nada quebrou**

Run: `pnpm typecheck`
Expected: zero erros. Se aparecer "Property 'briefings' is missing" em algum consumer, é esperado — vamos resolver nas próximas tasks.

- [ ] **Step 4: Commit**

```bash
git add supabase/migrations/20260419000002_commit2_cards_rich.sql src/lib/types.ts
git commit -m "feat(db): commit 2 schema — steps ricos + campaign_info + canvas free"
```

---

## Task 2 — Instalar react-rnd

**Files:**
- Modify: `package.json`
- Modify: `pnpm-lock.yaml`

- [ ] **Step 1: Instalar**

```bash
pnpm add react-rnd@10.5.2
```

- [ ] **Step 2: Verificar imports disponíveis**

```bash
node -e "console.log(Object.keys(require('react-rnd')))"
```

Expected: `[ 'Rnd', 'DraggableData', ... ]`

- [ ] **Step 3: Commit**

```bash
git add package.json pnpm-lock.yaml
git commit -m "chore(deps): add react-rnd@10.5.2"
```

---

## Task 3 — Server actions pra briefings, trophy e canvas position

**Files:**
- Create: `src/lib/campaigns/rich-actions.ts`

- [ ] **Step 1: Criar o arquivo**

`src/lib/campaigns/rich-actions.ts`:

```ts
"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { requireUser } from "@/lib/auth";

// ========== Briefings ==========

const briefingSchema = z.object({
  step_id: z.string().uuid(),
  id: z.string().min(1),
  label: z.string().min(1).max(40),
  content: z.string().max(4000),
});

export async function upsertBriefingAction(input: z.infer<typeof briefingSchema>) {
  await requireUser();
  const parsed = briefingSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" };

  const supabase = createClient();
  // Busca step, atualiza array in-memory e salva (RLS garante ownership)
  const { data: step, error: qErr } = await supabase
    .from("steps")
    .select("id, campaign_id, briefings")
    .eq("id", parsed.data.step_id)
    .maybeSingle();
  if (qErr || !step) return { error: qErr?.message ?? "Step não encontrado" };

  type B = { id: string; label: string; content: string };
  const briefings: B[] = Array.isArray(step.briefings) ? (step.briefings as B[]) : [];
  const idx = briefings.findIndex((b) => b.id === parsed.data.id);
  const next = {
    id: parsed.data.id,
    label: parsed.data.label,
    content: parsed.data.content,
  };
  if (idx >= 0) briefings[idx] = next;
  else briefings.push(next);

  const { error } = await supabase
    .from("steps")
    .update({ briefings })
    .eq("id", parsed.data.step_id);
  if (error) return { error: error.message };

  revalidatePath(`/campaigns/${step.campaign_id}`);
  return { ok: true };
}

export async function deleteBriefingAction(stepId: string, briefingId: string) {
  await requireUser();
  const supabase = createClient();
  const { data: step } = await supabase
    .from("steps")
    .select("id, campaign_id, briefings")
    .eq("id", stepId)
    .maybeSingle();
  if (!step) return { error: "Step não encontrado" };

  type B = { id: string; label: string; content: string };
  const briefings: B[] = Array.isArray(step.briefings) ? (step.briefings as B[]) : [];
  const next = briefings.filter((b) => b.id !== briefingId);

  const { error } = await supabase
    .from("steps")
    .update({ briefings: next })
    .eq("id", stepId);
  if (error) return { error: error.message };

  revalidatePath(`/campaigns/${step.campaign_id}`);
  return { ok: true };
}

// ========== Status V2 ==========

const statusSchema = z.object({
  step_id: z.string().uuid(),
  status: z.enum(["planning", "publishing", "done"]),
});

export async function setStepStatusV2Action(input: z.infer<typeof statusSchema>) {
  await requireUser();
  const parsed = statusSchema.safeParse(input);
  if (!parsed.success) return { error: "Status inválido" };

  const supabase = createClient();
  const { data: step } = await supabase
    .from("steps")
    .select("id, campaign_id")
    .eq("id", parsed.data.step_id)
    .maybeSingle();
  if (!step) return { error: "Step não encontrado" };

  const { error } = await supabase
    .from("steps")
    .update({
      status_v2: parsed.data.status,
      // mantém `status` antigo sincronizado pra views legadas:
      status:
        parsed.data.status === "done"
          ? "done"
          : parsed.data.status === "publishing"
            ? "in_progress"
            : "todo",
      completed_at: parsed.data.status === "done" ? new Date().toISOString() : null,
    })
    .eq("id", parsed.data.step_id);
  if (error) return { error: error.message };

  revalidatePath(`/campaigns/${step.campaign_id}`);
  return { ok: true };
}

// ========== Trophy ==========

const trophySchema = z.object({
  step_id: z.string().uuid(),
  value_usd: z.number().nullable(),
  multiplier_x: z.number().nullable(),
});

export async function setTrophyAction(input: z.infer<typeof trophySchema>) {
  await requireUser();
  const parsed = trophySchema.safeParse(input);
  if (!parsed.success) return { error: "Valor inválido" };

  const supabase = createClient();
  const { data: step } = await supabase
    .from("steps")
    .select("id, campaign_id")
    .eq("id", parsed.data.step_id)
    .maybeSingle();
  if (!step) return { error: "Step não encontrado" };

  const { error } = await supabase
    .from("steps")
    .update({
      trophy_value_usd: parsed.data.value_usd,
      trophy_multiplier_x: parsed.data.multiplier_x,
    })
    .eq("id", parsed.data.step_id);
  if (error) return { error: error.message };

  revalidatePath(`/campaigns/${step.campaign_id}`);
  return { ok: true };
}

// ========== Canvas position/size (drag & resize) ==========

const canvasSchema = z.object({
  step_id: z.string().uuid(),
  x: z.number().int(),
  y: z.number().int(),
  w: z.number().int().min(200).max(1200),
  h: z.number().int().min(120).max(900),
});

export async function setCanvasFrameAction(input: z.infer<typeof canvasSchema>) {
  await requireUser();
  const parsed = canvasSchema.safeParse(input);
  if (!parsed.success) return { error: "Frame inválido" };

  const supabase = createClient();
  const { error } = await supabase
    .from("steps")
    .update({
      canvas_x: parsed.data.x,
      canvas_y: parsed.data.y,
      canvas_w: parsed.data.w,
      canvas_h: parsed.data.h,
    })
    .eq("id", parsed.data.step_id);
  if (error) return { error: error.message };

  // Não revalida — drag acontece centenas de vezes; o cliente já sabe o state
  return { ok: true };
}

// ========== Nova tarefa com status ==========

const newTaskSchema = z.object({
  campaign_id: z.string().uuid(),
  title: z.string().min(1).max(200),
  description: z.string().max(1000).optional(),
  due_date: z.string().optional(),
  status: z.enum(["planning", "publishing", "done"]).default("planning"),
});

export async function createRichStepAction(formData: FormData) {
  await requireUser();
  const raw = Object.fromEntries(formData);
  const parsed = newTaskSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
  }

  const supabase = createClient();
  const { data: max } = await supabase
    .from("steps")
    .select("order_index")
    .eq("campaign_id", parsed.data.campaign_id)
    .order("order_index", { ascending: false })
    .limit(1)
    .maybeSingle();

  const nextIdx = ((max?.order_index as number | undefined) ?? -1) + 1;

  // posicionamento inicial em grade 3 colunas
  const col = nextIdx % 3;
  const row = Math.floor(nextIdx / 3);

  const { error } = await supabase.from("steps").insert({
    campaign_id: parsed.data.campaign_id,
    title: parsed.data.title,
    description: parsed.data.description || null,
    due_date: parsed.data.due_date || null,
    order_index: nextIdx,
    status: parsed.data.status === "done" ? "done" : parsed.data.status === "publishing" ? "in_progress" : "todo",
    status_v2: parsed.data.status,
    canvas_x: col * 340,
    canvas_y: row * 240,
    canvas_w: 320,
    canvas_h: 220,
    briefings: [],
  });

  if (error) return { error: error.message };

  revalidatePath(`/campaigns/${parsed.data.campaign_id}`);
  return { ok: true };
}
```

- [ ] **Step 2: Typecheck**

Run: `pnpm typecheck`
Expected: zero erros

- [ ] **Step 3: Commit**

```bash
git add src/lib/campaigns/rich-actions.ts
git commit -m "feat(campaigns): server actions para briefings, status v2, trophy e canvas frame"
```

---

## Task 4 — Server actions de CampaignInfo

**Files:**
- Create: `src/lib/campaigns/info-actions.ts`

- [ ] **Step 1: Criar arquivo**

```ts
"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { requireUser } from "@/lib/auth";

const infoSchema = z.object({
  campaign_id: z.string().uuid(),
  login: z.string().max(500).nullable().optional(),
  blockchain_ref: z.string().max(500).nullable().optional(),
  wallet: z.string().max(500).nullable().optional(),
});

export async function upsertCampaignInfoAction(formData: FormData) {
  await requireUser();
  const raw = Object.fromEntries(formData);
  const parsed = infoSchema.safeParse({
    campaign_id: raw.campaign_id,
    login: raw.login ? String(raw.login) : null,
    blockchain_ref: raw.blockchain_ref ? String(raw.blockchain_ref) : null,
    wallet: raw.wallet ? String(raw.wallet) : null,
  });
  if (!parsed.success) return { error: "Dados inválidos" };

  const supabase = createClient();
  const { error } = await supabase
    .from("campaign_info")
    .upsert(
      {
        campaign_id: parsed.data.campaign_id,
        login: parsed.data.login || null,
        blockchain_ref: parsed.data.blockchain_ref || null,
        wallet: parsed.data.wallet || null,
      },
      { onConflict: "campaign_id" },
    );
  if (error) return { error: error.message };

  revalidatePath(`/campaigns/${parsed.data.campaign_id}`);
  return { ok: true };
}
```

- [ ] **Step 2: Typecheck**

Run: `pnpm typecheck`

- [ ] **Step 3: Commit**

```bash
git add src/lib/campaigns/info-actions.ts
git commit -m "feat(campaigns): upsert campaign_info (login/blockchain/wallet)"
```

---

## Task 5 — Query rich (busca step + info)

**Files:**
- Create: `src/lib/campaigns/queries-rich.ts`

- [ ] **Step 1: Criar arquivo**

```ts
import { createClient } from "@/lib/supabase/server";
import { requireUser } from "@/lib/auth";
import type { Campaign, Step, Attachment, CampaignInfo } from "@/lib/types";

export async function getCampaignRich(id: string): Promise<
  | {
      campaign: Campaign;
      steps: Step[];
      attachments: Attachment[];
      info: CampaignInfo | null;
    }
  | null
> {
  const { user } = await requireUser();
  const supabase = createClient();

  const [{ data: campaign }, { data: steps }, { data: attachments }, { data: info }] =
    await Promise.all([
      supabase
        .from("campaigns")
        .select("*")
        .eq("id", id)
        .eq("user_id", user.id)
        .maybeSingle(),
      supabase
        .from("steps")
        .select("*")
        .eq("campaign_id", id)
        .order("order_index", { ascending: true }),
      supabase
        .from("attachments")
        .select("*")
        .eq("campaign_id", id)
        .order("uploaded_at", { ascending: false }),
      supabase
        .from("campaign_info")
        .select("*")
        .eq("campaign_id", id)
        .maybeSingle(),
    ]);

  if (!campaign) return null;

  return {
    campaign: campaign as Campaign,
    steps: (steps ?? []) as Step[],
    attachments: (attachments ?? []) as Attachment[],
    info: (info as CampaignInfo) ?? null,
  };
}
```

- [ ] **Step 2: Typecheck**
- [ ] **Step 3: Commit**

```bash
git add src/lib/campaigns/queries-rich.ts
git commit -m "feat(campaigns): getCampaignRich combinando steps + info + attachments"
```

---

## Task 6 — Componente TrophyToggle

**Files:**
- Create: `src/components/campaigns/trophy-toggle.tsx`

- [ ] **Step 1: Criar arquivo**

```tsx
"use client";

import { useState, useTransition } from "react";
import { Trophy } from "lucide-react";
import { cn } from "@/lib/utils";
import { setTrophyAction } from "@/lib/campaigns/rich-actions";

export function TrophyToggle({
  stepId,
  valueUsd,
  multiplierX,
}: {
  stepId: string;
  valueUsd: string | null;
  multiplierX: string | null;
}) {
  const [open, setOpen] = useState(false);
  const [usd, setUsd] = useState(valueUsd ?? "");
  const [mx, setMx] = useState(multiplierX ?? "");
  const [pending, start] = useTransition();

  const has = Boolean(valueUsd || multiplierX);

  function save() {
    start(async () => {
      await setTrophyAction({
        step_id: stepId,
        value_usd: usd.trim() ? Number(usd) : null,
        multiplier_x: mx.trim() ? Number(mx) : null,
      });
      setOpen(false);
    });
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium transition",
          has
            ? "bg-amber-100 text-amber-900 dark:bg-amber-900/40 dark:text-amber-200"
            : "bg-muted text-muted-foreground hover:bg-muted/80",
        )}
        aria-label="Trofeu da tarefa"
      >
        <Trophy className="h-3 w-3" />
        {has ? (
          <span>
            {valueUsd ? `$${Number(valueUsd).toLocaleString("en-US")}` : ""}
            {valueUsd && multiplierX ? " · " : ""}
            {multiplierX ? `${multiplierX}x` : ""}
          </span>
        ) : (
          <span>Troféu</span>
        )}
      </button>
      {open && (
        <div className="absolute right-0 top-full z-20 mt-1 w-56 space-y-2 rounded-lg border border-border bg-card p-3 shadow-lg">
          <label className="block text-[11px] font-medium uppercase text-muted-foreground">
            Valor USD
            <input
              type="number"
              step="0.01"
              min="0"
              value={usd}
              onChange={(e) => setUsd(e.target.value)}
              className="mt-1 w-full rounded-md border border-border bg-background px-2 py-1 text-sm"
              placeholder="500.00"
            />
          </label>
          <label className="block text-[11px] font-medium uppercase text-muted-foreground">
            Multiplicador X
            <input
              type="number"
              step="0.01"
              min="0"
              value={mx}
              onChange={(e) => setMx(e.target.value)}
              className="mt-1 w-full rounded-md border border-border bg-background px-2 py-1 text-sm"
              placeholder="2.5"
            />
          </label>
          <div className="flex gap-1">
            <button
              type="button"
              onClick={save}
              disabled={pending}
              className="flex-1 rounded-md bg-mint-600 px-2 py-1 text-xs font-medium text-white hover:bg-mint-700 disabled:opacity-60"
            >
              Salvar
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-md border border-border px-2 py-1 text-xs hover:bg-muted"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Typecheck**
- [ ] **Step 3: Commit**

```bash
git add src/components/campaigns/trophy-toggle.tsx
git commit -m "feat(campaigns): TrophyToggle com popover USD/X"
```

---

## Task 7 — Componente TaskCardRich

**Files:**
- Create: `src/components/campaigns/task-card-rich.tsx`

- [ ] **Step 1: Criar arquivo**

```tsx
"use client";

import { useState, useTransition } from "react";
import { Plus, Trash2, ChevronDown, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Step, Briefing, StepStatusV2 } from "@/lib/types";
import { TrophyToggle } from "./trophy-toggle";
import {
  upsertBriefingAction,
  deleteBriefingAction,
  setStepStatusV2Action,
} from "@/lib/campaigns/rich-actions";

/**
 * TaskCardRich — card expansível com Briefings variáveis, status dropdown
 * e trophy. Usado dentro do WorkflowCanvasRnd (drag/resize).
 *
 * Não renderiza seu próprio frame — width/height são controlados pelo parent
 * (react-rnd). Usa h-full e overflow-y-auto pra manter board no topo.
 */
export function TaskCardRich({ step }: { step: Step }) {
  const [briefings, setBriefings] = useState<Briefing[]>(step.briefings ?? []);
  const [status, setStatus] = useState<StepStatusV2>(step.status_v2);
  const [menuOpen, setMenuOpen] = useState(false);
  const [pending, start] = useTransition();

  function addBriefing() {
    const nextIndex = briefings.length + 1;
    const tmp: Briefing = {
      id: crypto.randomUUID(),
      label: `Briefing ${nextIndex}`,
      content: "",
    };
    setBriefings((b) => [...b, tmp]);
    start(async () => {
      await upsertBriefingAction({
        step_id: step.id,
        id: tmp.id,
        label: tmp.label,
        content: tmp.content,
      });
    });
  }

  function updateBriefing(id: string, patch: Partial<Briefing>) {
    setBriefings((bs) =>
      bs.map((b) => (b.id === id ? { ...b, ...patch } : b)),
    );
  }

  function commitBriefing(b: Briefing) {
    start(async () => {
      await upsertBriefingAction({
        step_id: step.id,
        id: b.id,
        label: b.label,
        content: b.content,
      });
    });
  }

  function removeBriefing(id: string) {
    setBriefings((bs) => bs.filter((b) => b.id !== id));
    start(async () => {
      await deleteBriefingAction(step.id, id);
    });
  }

  function setStatusUi(s: StepStatusV2) {
    setStatus(s);
    setMenuOpen(false);
    start(async () => {
      await setStepStatusV2Action({ step_id: step.id, status: s });
    });
  }

  return (
    <div
      className={cn(
        "flex h-full flex-col overflow-hidden rounded-2xl border bg-card shadow-sm transition",
        status === "done" && "border-mint-500",
        status === "publishing" && "border-amber-400",
        status === "planning" && "border-border",
      )}
    >
      {/* Header sticky — board no topo mesmo no scroll */}
      <header className="sticky top-0 z-10 flex items-center justify-between gap-2 border-b border-border bg-card/95 px-3 py-2 backdrop-blur">
        <h3 className="truncate text-sm font-semibold" title={step.title}>
          {step.title}
        </h3>
        <div className="flex shrink-0 items-center gap-1.5">
          <TrophyToggle
            stepId={step.id}
            valueUsd={step.trophy_value_usd}
            multiplierX={step.trophy_multiplier_x}
          />
          <div className="relative">
            <button
              type="button"
              onClick={() => setMenuOpen((o) => !o)}
              disabled={pending}
              className={cn(
                "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium",
                status === "done" &&
                  "bg-mint-100 text-mint-900 dark:bg-mint-900/50 dark:text-mint-200",
                status === "publishing" &&
                  "bg-amber-100 text-amber-900 dark:bg-amber-900/40 dark:text-amber-200",
                status === "planning" && "bg-muted text-muted-foreground",
              )}
            >
              {statusLabel(status)} <ChevronDown className="h-3 w-3" />
            </button>
            {menuOpen && (
              <div className="absolute right-0 top-full z-20 mt-1 w-36 rounded-lg border border-border bg-card p-1 shadow-lg">
                {(["planning", "publishing", "done"] as const).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setStatusUi(s)}
                    className={cn(
                      "flex w-full items-center gap-2 rounded-md px-2 py-1 text-left text-xs hover:bg-muted",
                      s === status && "bg-muted font-medium",
                    )}
                  >
                    {statusLabel(s)}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="flex-1 space-y-3 overflow-y-auto p-3">
        {step.description && (
          <p className="text-xs text-muted-foreground">{step.description}</p>
        )}

        {step.due_date && (
          <div className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">
            <Calendar className="h-3 w-3" />
            {new Date(step.due_date).toLocaleDateString("pt-BR", {
              day: "2-digit",
              month: "short",
            })}
          </div>
        )}

        <div className="space-y-2">
          {briefings.map((b) => (
            <div
              key={b.id}
              className="rounded-lg border border-border bg-background p-2"
            >
              <div className="mb-1 flex items-center justify-between gap-2">
                <input
                  value={b.label}
                  onChange={(e) => updateBriefing(b.id, { label: e.target.value })}
                  onBlur={() => commitBriefing(b)}
                  className="min-w-0 flex-1 border-none bg-transparent text-[11px] font-semibold uppercase tracking-wide text-muted-foreground focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => removeBriefing(b.id)}
                  className="rounded p-0.5 text-muted-foreground hover:bg-muted hover:text-destructive"
                  aria-label="Remover briefing"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
              <textarea
                value={b.content}
                onChange={(e) => updateBriefing(b.id, { content: e.target.value })}
                onBlur={() => commitBriefing(b)}
                rows={3}
                placeholder="Descreva…"
                className="w-full resize-none rounded-md border-none bg-transparent text-xs outline-none placeholder:text-muted-foreground/60"
              />
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={addBriefing}
          disabled={pending}
          className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-border py-1.5 text-[11px] text-muted-foreground transition hover:border-mint-300 hover:text-mint-700 dark:hover:text-mint-300"
        >
          <Plus className="h-3 w-3" />
          Briefing {briefings.length + 1}
        </button>
      </div>
    </div>
  );
}

function statusLabel(s: StepStatusV2): string {
  return s === "done" ? "Feito" : s === "publishing" ? "Publicação" : "Planejamento";
}
```

- [ ] **Step 2: Typecheck**
- [ ] **Step 3: Commit**

```bash
git add src/components/campaigns/task-card-rich.tsx
git commit -m "feat(campaigns): TaskCardRich com briefings variáveis, status dropdown e trophy"
```

---

## Task 8 — Componente WorkflowCanvasRnd

**Files:**
- Create: `src/components/campaigns/workflow-canvas-rnd.tsx`

- [ ] **Step 1: Criar arquivo**

```tsx
"use client";

import { useState, useTransition, useRef } from "react";
import { Rnd } from "react-rnd";
import type { Step } from "@/lib/types";
import { TaskCardRich } from "./task-card-rich";
import { setCanvasFrameAction } from "@/lib/campaigns/rich-actions";

type Frame = { x: number; y: number; w: number; h: number };

/**
 * WorkflowCanvasRnd — canvas com drag/resize livre.
 *
 * - Cada card é um <Rnd> cuja posição/tamanho bate com as colunas
 *   canvas_* da tabela steps.
 * - Debounce no commit pro server (250ms) pra não inundar Supabase
 *   durante drag contínuo.
 * - Área do canvas tem min-height calculado pra caber todos os cards
 *   + margem — permite scroll vertical se usuário arrastar pra longe.
 */
export function WorkflowCanvasRnd({ steps }: { steps: Step[] }) {
  const [frames, setFrames] = useState<Record<string, Frame>>(() =>
    Object.fromEntries(
      steps.map((s) => [
        s.id,
        { x: s.canvas_x, y: s.canvas_y, w: s.canvas_w, h: s.canvas_h },
      ]),
    ),
  );
  const timers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});
  const [, start] = useTransition();

  if (steps.length === 0) {
    return (
      <div className="grid h-[420px] place-items-center rounded-2xl border border-dashed border-border bg-muted/20">
        <p className="text-sm text-muted-foreground">
          Clique em “Nova tarefa” pra começar.
        </p>
      </div>
    );
  }

  function queueCommit(id: string, f: Frame) {
    clearTimeout(timers.current[id]);
    timers.current[id] = setTimeout(() => {
      start(async () => {
        await setCanvasFrameAction({
          step_id: id,
          x: Math.round(f.x),
          y: Math.round(f.y),
          w: Math.round(f.w),
          h: Math.round(f.h),
        });
      });
    }, 250);
  }

  // Bounds do canvas: maior (y+h) + 200px de margem
  const maxBottom = Object.values(frames).reduce(
    (m, f) => Math.max(m, f.y + f.h),
    600,
  );

  return (
    <div className="relative overflow-auto rounded-2xl border border-border bg-muted/10 p-4">
      <div className="relative" style={{ minHeight: maxBottom + 120, minWidth: 1100 }}>
        {steps.map((step) => {
          const f = frames[step.id];
          return (
            <Rnd
              key={step.id}
              size={{ width: f.w, height: f.h }}
              position={{ x: f.x, y: f.y }}
              minWidth={240}
              minHeight={160}
              maxWidth={800}
              maxHeight={800}
              bounds="parent"
              dragHandleClassName="rnd-drag"
              onDragStop={(_, d) => {
                const next = { ...f, x: d.x, y: d.y };
                setFrames((s) => ({ ...s, [step.id]: next }));
                queueCommit(step.id, next);
              }}
              onResizeStop={(_, __, ref, ___, pos) => {
                const next = {
                  w: parseInt(ref.style.width, 10),
                  h: parseInt(ref.style.height, 10),
                  x: pos.x,
                  y: pos.y,
                };
                setFrames((s) => ({ ...s, [step.id]: next }));
                queueCommit(step.id, next);
              }}
              className="group"
            >
              {/* invisible drag handle overlay on header so the header itself
                  fica utilizável; mas arrastar num espaço do header funciona */}
              <div className="rnd-drag absolute inset-x-0 top-0 z-10 h-9 cursor-grab active:cursor-grabbing" />
              <TaskCardRich step={{ ...step, canvas_x: f.x, canvas_y: f.y, canvas_w: f.w, canvas_h: f.h }} />
            </Rnd>
          );
        })}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Typecheck**

Run: `pnpm typecheck`
Expected: zero erros. react-rnd tem types próprios.

- [ ] **Step 3: Commit**

```bash
git add src/components/campaigns/workflow-canvas-rnd.tsx
git commit -m "feat(campaigns): WorkflowCanvasRnd com drag & resize livre (react-rnd)"
```

---

## Task 9 — Componente NewTaskModal

**Files:**
- Create: `src/components/campaigns/new-task-modal.tsx`

- [ ] **Step 1: Criar arquivo**

```tsx
"use client";

import { useState, useTransition } from "react";
import { X, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { createRichStepAction } from "@/lib/campaigns/rich-actions";
import type { StepStatusV2 } from "@/lib/types";

/**
 * NewTaskModal — modal de criação com 3 toggles de status.
 */
export function NewTaskModal({ campaignId }: { campaignId: string }) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<StepStatusV2>("planning");
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    fd.set("campaign_id", campaignId);
    fd.set("status", status);
    start(async () => {
      const res = await createRichStepAction(fd);
      if (res?.error) setError(res.error);
      else {
        setOpen(false);
        setStatus("planning");
        (e.target as HTMLFormElement).reset();
      }
    });
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-lg bg-mint-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-mint-700"
      >
        <Plus className="h-4 w-4" /> Nova tarefa
      </button>

      {open && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-xl">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="absolute right-4 top-4 rounded p-1 text-muted-foreground hover:bg-muted"
              aria-label="Fechar"
            >
              <X className="h-4 w-4" />
            </button>
            <h2 className="text-lg font-semibold tracking-tight">Nova tarefa</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Crie um card novo no canvas. Você pode editar tudo depois.
            </p>

            <form onSubmit={onSubmit} className="mt-5 space-y-4">
              <label className="block space-y-1">
                <span className="text-sm font-medium">Título *</span>
                <input
                  name="title"
                  required
                  maxLength={200}
                  placeholder="Ex: Quest ZK na Linea"
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-mint-500/30"
                />
              </label>

              <label className="block space-y-1">
                <span className="text-sm font-medium">Descrição</span>
                <textarea
                  name="description"
                  rows={2}
                  maxLength={1000}
                  className="w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-mint-500/30"
                />
              </label>

              <label className="block space-y-1">
                <span className="text-sm font-medium">Deadline</span>
                <input
                  name="due_date"
                  type="date"
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-mint-500/30"
                />
              </label>

              <div>
                <span className="text-sm font-medium">Status inicial</span>
                <div className="mt-2 grid grid-cols-3 gap-2">
                  {(
                    [
                      { v: "planning", label: "Planejamento" },
                      { v: "publishing", label: "Publicação" },
                      { v: "done", label: "Feito" },
                    ] as { v: StepStatusV2; label: string }[]
                  ).map((o) => (
                    <button
                      key={o.v}
                      type="button"
                      onClick={() => setStatus(o.v)}
                      className={cn(
                        "rounded-lg border px-3 py-2 text-xs font-medium transition",
                        status === o.v
                          ? "border-mint-500 bg-mint-50 text-mint-900 dark:bg-mint-900/30 dark:text-mint-200"
                          : "border-border bg-background text-muted-foreground hover:bg-muted",
                      )}
                    >
                      {o.label}
                    </button>
                  ))}
                </div>
              </div>

              {error && (
                <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive">
                  {error}
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-lg border border-border px-4 py-2 text-sm hover:bg-muted"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={pending}
                  className="rounded-lg bg-mint-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-mint-700 disabled:opacity-60"
                >
                  {pending ? "Criando..." : "Criar tarefa"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
```

- [ ] **Step 2: Typecheck**
- [ ] **Step 3: Commit**

```bash
git add src/components/campaigns/new-task-modal.tsx
git commit -m "feat(campaigns): NewTaskModal com toggle Planejamento/Publicação/Feito"
```

---

## Task 10 — Componente InfoPanel

**Files:**
- Create: `src/components/campaigns/info-panel.tsx`

- [ ] **Step 1: Criar arquivo**

```tsx
"use client";

import { useState, useTransition } from "react";
import { KeyRound, Link2, Wallet, Save } from "lucide-react";
import type { CampaignInfo } from "@/lib/types";
import { upsertCampaignInfoAction } from "@/lib/campaigns/info-actions";

export function InfoPanel({
  campaignId,
  initial,
}: {
  campaignId: string;
  initial: CampaignInfo | null;
}) {
  const [login, setLogin] = useState(initial?.login ?? "");
  const [blockchain, setBlockchain] = useState(initial?.blockchain_ref ?? "");
  const [wallet, setWallet] = useState(initial?.wallet ?? "");
  const [pending, start] = useTransition();
  const [saved, setSaved] = useState(false);

  function save() {
    const fd = new FormData();
    fd.set("campaign_id", campaignId);
    fd.set("login", login);
    fd.set("blockchain_ref", blockchain);
    fd.set("wallet", wallet);
    start(async () => {
      await upsertCampaignInfoAction(fd);
      setSaved(true);
      setTimeout(() => setSaved(false), 1500);
    });
  }

  return (
    <aside className="rounded-2xl border border-border bg-card p-4">
      <header className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold">Info</h3>
        <button
          type="button"
          onClick={save}
          disabled={pending}
          className="inline-flex items-center gap-1 rounded-md bg-mint-600 px-2 py-1 text-[11px] font-medium text-white hover:bg-mint-700 disabled:opacity-60"
        >
          <Save className="h-3 w-3" /> {saved ? "Salvo" : pending ? "Salvando" : "Salvar"}
        </button>
      </header>

      <Field icon={KeyRound} label="Login" value={login} onChange={setLogin} placeholder="email, user, @handle…" />
      <Field icon={Link2} label="Blockchain" value={blockchain} onChange={setBlockchain} placeholder="referência livre (só anotação)" />
      <Field icon={Wallet} label="Wallet" value={wallet} onChange={setWallet} placeholder="endereço, alias, nome…" />
    </aside>
  );
}

function Field({
  icon: Icon,
  label,
  value,
  onChange,
  placeholder,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="mb-3 block">
      <span className="mb-1 inline-flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
        <Icon className="h-3 w-3" /> {label}
      </span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={2}
        className="w-full resize-none rounded-md border border-border bg-background px-2 py-1.5 text-xs outline-none focus:ring-2 focus:ring-mint-500/30"
      />
    </label>
  );
}
```

- [ ] **Step 2: Typecheck**
- [ ] **Step 3: Commit**

```bash
git add src/components/campaigns/info-panel.tsx
git commit -m "feat(campaigns): InfoPanel (login/blockchain/wallet) com autosave manual"
```

---

## Task 11 — Integrar na página de campanha

**Files:**
- Modify: `src/app/(app)/campaigns/[id]/page.tsx`

- [ ] **Step 1: Substituir conteúdo**

Arquivo completo novo:

```tsx
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, Coins } from "lucide-react";
import { getCampaignRich } from "@/lib/campaigns/queries-rich";
import { requireUser } from "@/lib/auth";
import { WorkflowCanvasRnd } from "@/components/campaigns/workflow-canvas-rnd";
import { NewTaskModal } from "@/components/campaigns/new-task-modal";
import { InfoPanel } from "@/components/campaigns/info-panel";
import { AttachmentDropzone } from "@/components/campaigns/attachment-dropzone";

export const metadata: Metadata = { title: "Campanha" };
export const dynamic = "force-dynamic";

export default async function CampaignDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { user } = await requireUser();
  const data = await getCampaignRich(params.id);
  if (!data) notFound();

  const { campaign, steps, attachments, info } = data;
  const deadline = campaign.deadline ? new Date(campaign.deadline) : null;
  const daysLeft =
    deadline !== null
      ? Math.ceil((deadline.getTime() - Date.now()) / 86_400_000)
      : null;

  return (
    <div className="space-y-6">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Voltar pra timeline
      </Link>

      <header className="rounded-2xl border border-border bg-card p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              {campaign.title}
            </h1>
            {campaign.description && (
              <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
                {campaign.description}
              </p>
            )}
          </div>
          <div className="flex flex-col items-end gap-2 text-sm">
            {deadline && (
              <div className="inline-flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                {deadline.toLocaleDateString("pt-BR")}
                {daysLeft !== null && (
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs ${
                      daysLeft < 0
                        ? "bg-destructive/10 text-destructive"
                        : daysLeft <= 7
                          ? "bg-amber-100 text-amber-900"
                          : "bg-mint-50 text-mint-800"
                    }`}
                  >
                    {daysLeft < 0
                      ? `${Math.abs(daysLeft)}d atrás`
                      : daysLeft === 0
                        ? "hoje"
                        : `em ${daysLeft}d`}
                  </span>
                )}
              </div>
            )}
            {campaign.estimated_value_brl && (
              <div className="inline-flex items-center gap-2 text-muted-foreground">
                <Coins className="h-4 w-4" />
                $
                {Number(campaign.estimated_value_brl).toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                })}
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Workflow
        </h2>
        <NewTaskModal campaignId={campaign.id} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <WorkflowCanvasRnd steps={steps} />
        <InfoPanel campaignId={campaign.id} initial={info} />
      </div>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Anexos
        </h2>
        <AttachmentDropzone
          campaignId={campaign.id}
          userId={user.id}
          initial={attachments}
        />
      </section>
    </div>
  );
}
```

- [ ] **Step 2: Typecheck**

Run: `pnpm typecheck`
Expected: zero erros. Se sobrar import não usado (`TaskCard`, `AddStepForm`, `WorkflowCanvas`, `getCampaignById`), remover.

- [ ] **Step 3: Commit**

```bash
git add 'src/app/(app)/campaigns/[id]/page.tsx'
git commit -m "feat(campaigns): página usa canvas-rnd + modal + painel info"
```

---

## Task 12 — Remover componentes antigos substituídos

**Files:**
- Delete: `src/components/campaigns/task-card.tsx`
- Delete: `src/components/campaigns/add-step-form.tsx`
- Delete: `src/components/campaigns/workflow-canvas.tsx`

- [ ] **Step 1: Confirmar que ninguém importa**

```bash
grep -rn "task-card\"\|add-step-form\"\|workflow-canvas\"" src/
```

Expected: zero resultados (nenhuma referência aos antigos além das deleções).

- [ ] **Step 2: Deletar**

```bash
rm src/components/campaigns/task-card.tsx
rm src/components/campaigns/add-step-form.tsx
rm src/components/campaigns/workflow-canvas.tsx
```

- [ ] **Step 3: Typecheck + build**

```bash
pnpm typecheck
pnpm lint
```

Expected: zero erros. Se `@xyflow/react` vira dependency órfã, OK pra manter agora (pode ser útil no Commit 3). Fica marcado pra remover depois.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "chore(campaigns): remove TaskCard, AddStepForm e WorkflowCanvas antigos"
```

---

## Task 13 — Deploy + smoke test

**Files:** nenhum (só push)

- [ ] **Step 1: Push**

```bash
git push origin main
```

Aguardar Vercel pickar. Normalmente 60-90s.

- [ ] **Step 2: Rodar a migration no Supabase**

Abrir https://supabase.com/dashboard/project/kjjaymadgmfmrvkraian/sql/new e colar conteúdo de `supabase/migrations/20260419000002_commit2_cards_rich.sql`. Run.

- [ ] **Step 3: Smoke test**

```bash
for path in "/" "/auth/login" "/auth/signup" "/como-funciona" \
            "/legal/termos" "/legal/privacidade" "/dashboard" \
            "/projects" "/timeline" "/performance" "/api/health"; do
  code=$(curl -sk -o /dev/null -w "%{http_code}" "https://bounty-workflow.vercel.app$path")
  echo "$path → $code"
done
```

Expected: 200 nas públicas, 307 nas protegidas, 200 em /api/health.

- [ ] **Step 4: Teste manual (navegador)**

1. Login → Dashboard
2. Clicar em uma campanha existente
3. Verificar que canvas renderiza com cards existentes migrados
4. Clicar "Nova tarefa" → modal abre → criar com status "Publicação" → card aparece
5. Arrastar card → soltar → recarregar página → card mantém posição
6. Redimensionar card → recarregar → tamanho mantido
7. Adicionar 3 briefings → editar conteúdo → blur → recarregar → briefings salvos
8. Clicar troféu → digitar $500 e 2.5x → salvar → badge mostra "$500 · 2.5x"
9. Painel Info: digitar login, blockchain, wallet → Salvar → recarregar → preservado

- [ ] **Step 5: Marcar Commit 2 como done**

Atualizar TaskUpdate #28 → completed.

---

## Risk & Rollback

- **Se migração falhar:** `alter table ... drop column if exists ...` reverte. Versão antiga do front continua lendo colunas antigas (`status`, sem briefings).
- **Se drag/resize conflitar com scroll:** container usa `overflow-auto` e `bounds="parent"`; se der comportamento esquisito em mobile, remover `bounds` ou forçar `bounds=".campaign-canvas"`.
- **Payloads de posição:** debounce 250ms + sem revalidate no `setCanvasFrameAction`. Se ainda assim tiver flood, aumentar pra 500ms.
- **Compatibilidade com colunas antigas:** `setStepStatusV2Action` sincroniza `status` com `status_v2` pra não quebrar queries/views/export legadas.

---

## Self-Review

- ✓ Spec coverage: cards ricos (Task 7), briefings ilimitados (Task 7), status triplo (Task 3/7/9), trophy USD/X (Task 6), drag+resize (Task 8), modal novo (Task 9), painel Info (Task 10), integra tudo (Task 11). Board sticky no topo → Task 7 (`sticky top-0` no header).
- ✓ Placeholder scan: nenhum TBD/TODO.
- ✓ Type consistency: `StepStatusV2`, `Briefing`, `CampaignInfo` definidos na Task 1 e reusados corretamente nas Tasks 3, 6, 7, 9, 10. Assinaturas das server actions batem entre definição e consumo.
