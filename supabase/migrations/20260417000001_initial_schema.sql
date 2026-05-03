-- =====================================================================
-- Bounty WorkFlow · Schema inicial
-- Com correções das vulnerabilidades C1-C5 da AVALIACAO_COMPLETA.md
-- =====================================================================

-- Extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";
create extension if not exists "citext";

-- =====================================================================
-- ENUMS
-- =====================================================================
do $$ begin
  create type user_role as enum ('user', 'admin');
exception when duplicate_object then null; end $$;

do $$ begin
  create type subscription_provider as enum ('stripe', 'asaas', 'coinbase');
exception when duplicate_object then null; end $$;

do $$ begin
  create type subscription_status as enum ('trialing', 'active', 'past_due', 'canceled', 'incomplete');
exception when duplicate_object then null; end $$;

do $$ begin
  create type campaign_status as enum ('draft', 'active', 'completed', 'archived');
exception when duplicate_object then null; end $$;

do $$ begin
  create type step_status as enum ('todo', 'in_progress', 'done');
exception when duplicate_object then null; end $$;

do $$ begin
  create type attachment_type as enum ('image', 'link', 'pdf', 'other');
exception when duplicate_object then null; end $$;

do $$ begin
  create type reminder_channel as enum ('email', 'push', 'in_app');
exception when duplicate_object then null; end $$;

do $$ begin
  create type reminder_status as enum ('pending', 'sent', 'failed', 'snoozed', 'canceled');
exception when duplicate_object then null; end $$;

-- =====================================================================
-- USERS (MODULE_01) — C1 fix
-- =====================================================================
create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email citext not null unique,
  full_name text,
  avatar_url text,
  trial_ends_at timestamptz not null default (now() + interval '14 days'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists users_trial_ends_at_idx on public.users(trial_ends_at);

-- C1: FORCE RLS — nem o owner da tabela escapa sem policy
alter table public.users enable row level security;
alter table public.users force row level security;

-- Policies (restritivas): usuário só vê/edita a própria linha
drop policy if exists users_self_select on public.users;
create policy users_self_select on public.users
  for select using (auth.uid() = id);

drop policy if exists users_self_update on public.users;
create policy users_self_update on public.users
  for update using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists users_self_insert on public.users;
create policy users_self_insert on public.users
  for insert with check (auth.uid() = id);

-- C1: VIEW pública com APENAS colunas seguras, pra quando precisar mostrar perfil público
drop view if exists public.users_public cascade;
create view public.users_public as
  select id, full_name, avatar_url from public.users;

comment on view public.users_public is
  'View segura de usuários — expõe apenas campos não-sensíveis. Usar em perfis públicos.';

-- =====================================================================
-- USER_ROLES — C3 fix (admin via tabela, não via auth.role())
-- =====================================================================
create table if not exists public.user_roles (
  user_id uuid primary key references public.users(id) on delete cascade,
  role user_role not null default 'user',
  granted_at timestamptz not null default now(),
  granted_by uuid references public.users(id)
);

alter table public.user_roles enable row level security;
alter table public.user_roles force row level security;

drop policy if exists user_roles_self_read on public.user_roles;
create policy user_roles_self_read on public.user_roles
  for select using (auth.uid() = user_id);

-- Função helper pra checar admin (evita repetir EXISTS)
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = auth.uid() and role = 'admin'
  );
$$;

comment on function public.is_admin() is
  'C3: Retorna true se o usuário atual é admin. Usar em policies ao invés de auth.role().';

-- =====================================================================
-- PROTOCOLS (MODULE_04) — C3 fix
-- =====================================================================
create table if not exists public.protocols (
  id uuid primary key default uuid_generate_v4(),
  slug text not null unique,
  name text not null,
  description text,
  logo_url text,
  chain text,
  category text,
  website_url text,
  deadline date,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists protocols_is_active_idx on public.protocols(is_active);
create index if not exists protocols_chain_idx on public.protocols(chain);
create index if not exists protocols_category_idx on public.protocols(category);

alter table public.protocols enable row level security;
alter table public.protocols force row level security;

-- Leitura pública (catálogo SEO)
drop policy if exists protocols_public_read on public.protocols;
create policy protocols_public_read on public.protocols
  for select using (is_active = true);

-- Escrita só admin (C3: via tabela user_roles, não auth.role())
drop policy if exists protocols_admin_insert on public.protocols;
create policy protocols_admin_insert on public.protocols
  for insert with check (public.is_admin());

drop policy if exists protocols_admin_update on public.protocols;
create policy protocols_admin_update on public.protocols
  for update using (public.is_admin()) with check (public.is_admin());

drop policy if exists protocols_admin_delete on public.protocols;
create policy protocols_admin_delete on public.protocols
  for delete using (public.is_admin());

-- =====================================================================
-- CAMPAIGNS (MODULE_03)
-- =====================================================================
create table if not exists public.campaigns (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.users(id) on delete cascade,
  protocol_id uuid references public.protocols(id) on delete set null,
  title text not null,
  description text,
  status campaign_status not null default 'draft',
  deadline date,
  planning_json jsonb default '{"version": 1}'::jsonb,
  estimated_value_brl numeric(12,2),
  network text,
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists campaigns_user_status_idx on public.campaigns(user_id, status);
create index if not exists campaigns_user_archived_idx on public.campaigns(user_id, archived_at);
create index if not exists campaigns_deadline_idx on public.campaigns(deadline) where archived_at is null;
create index if not exists campaigns_protocol_idx on public.campaigns(protocol_id);

alter table public.campaigns enable row level security;
alter table public.campaigns force row level security;

drop policy if exists campaigns_owner_all on public.campaigns;
create policy campaigns_owner_all on public.campaigns
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- =====================================================================
-- STEPS (MODULE_03)
-- =====================================================================
create table if not exists public.steps (
  id uuid primary key default uuid_generate_v4(),
  campaign_id uuid not null references public.campaigns(id) on delete cascade,
  order_index int not null,
  title text not null,
  description text,
  status step_status not null default 'todo',
  due_date date,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (campaign_id, order_index)  -- evita reordenação corrompida
);

create index if not exists steps_campaign_idx on public.steps(campaign_id);
create index if not exists steps_due_date_idx on public.steps(due_date) where status <> 'done';

alter table public.steps enable row level security;
alter table public.steps force row level security;

drop policy if exists steps_via_campaign on public.steps;
create policy steps_via_campaign on public.steps
  for all using (
    exists (select 1 from public.campaigns c where c.id = campaign_id and c.user_id = auth.uid())
  ) with check (
    exists (select 1 from public.campaigns c where c.id = campaign_id and c.user_id = auth.uid())
  );

-- =====================================================================
-- ATTACHMENTS (MODULE_03) — A1 fix (IDOR), A3 fix (uploads)
-- =====================================================================
create table if not exists public.attachments (
  id uuid primary key default uuid_generate_v4(),
  campaign_id uuid not null references public.campaigns(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  bucket text not null,
  path text not null,
  mime_type text,
  size_bytes bigint,
  checksum text,
  type attachment_type not null default 'other',
  metadata_json jsonb default '{}'::jsonb,
  uploaded_at timestamptz not null default now(),
  unique (bucket, path)
);

create index if not exists attachments_campaign_idx on public.attachments(campaign_id);
create index if not exists attachments_user_idx on public.attachments(user_id);

alter table public.attachments enable row level security;
alter table public.attachments force row level security;

-- A1 fix: valida TANTO user_id quanto ownership da campanha
drop policy if exists attachments_owner on public.attachments;
create policy attachments_owner on public.attachments
  for all using (
    auth.uid() = user_id
    and exists (select 1 from public.campaigns c where c.id = campaign_id and c.user_id = auth.uid())
  ) with check (
    auth.uid() = user_id
    and exists (select 1 from public.campaigns c where c.id = campaign_id and c.user_id = auth.uid())
  );

-- =====================================================================
-- REMINDERS (MODULE_05)
-- =====================================================================
create table if not exists public.reminders (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.users(id) on delete cascade,
  campaign_id uuid references public.campaigns(id) on delete cascade,
  step_id uuid references public.steps(id) on delete cascade,
  channel reminder_channel not null,
  trigger_at timestamptz not null,
  message text,
  status reminder_status not null default 'pending',
  sent_at timestamptz,
  error_message text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists reminders_scheduling_idx on public.reminders(status, trigger_at) where status = 'pending';
create index if not exists reminders_user_idx on public.reminders(user_id);
create index if not exists reminders_campaign_idx on public.reminders(campaign_id);

alter table public.reminders enable row level security;
alter table public.reminders force row level security;

drop policy if exists reminders_owner on public.reminders;
create policy reminders_owner on public.reminders
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- =====================================================================
-- NOTIFICATION_LOGS (MODULE_05)
-- =====================================================================
create table if not exists public.notification_logs (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.users(id) on delete cascade,
  reminder_id uuid references public.reminders(id) on delete set null,
  channel reminder_channel not null,
  payload_json jsonb,
  provider_response_json jsonb,
  status text not null,
  sent_at timestamptz not null default now()
);

create index if not exists notification_logs_user_idx on public.notification_logs(user_id, sent_at desc);

alter table public.notification_logs enable row level security;
alter table public.notification_logs force row level security;

drop policy if exists notification_logs_owner_read on public.notification_logs;
create policy notification_logs_owner_read on public.notification_logs
  for select using (auth.uid() = user_id);

-- =====================================================================
-- SUBSCRIPTIONS (MODULE_06) — C2 fix
-- =====================================================================
create table if not exists public.subscriptions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.users(id) on delete cascade,
  provider subscription_provider not null,
  provider_customer_id text,
  provider_sub_id text not null,
  status subscription_status not null default 'trialing',
  current_period_end timestamptz,
  cancel_at_period_end boolean not null default false,
  plan_code text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (provider, provider_sub_id)
);

create index if not exists subscriptions_user_status_idx on public.subscriptions(user_id, status);
create index if not exists subscriptions_provider_sub_idx on public.subscriptions(provider, provider_sub_id);

alter table public.subscriptions enable row level security;
alter table public.subscriptions force row level security;

-- C2 fix: NUNCA leitura pública. Só o dono vê.
drop policy if exists subscriptions_owner_read on public.subscriptions;
create policy subscriptions_owner_read on public.subscriptions
  for select using (auth.uid() = user_id);

-- Escrita: só via service role (webhooks). Nenhuma policy de INSERT/UPDATE para auth users.

-- View segura pra quando precisar só do status no layout (evita vazar period_end, provider_sub_id, etc)
create or replace view public.v_user_billing as
  select
    u.id as user_id,
    case
      when u.trial_ends_at > now() and not exists (select 1 from public.subscriptions s where s.user_id = u.id and s.status = 'active') then 'trialing'
      when exists (select 1 from public.subscriptions s where s.user_id = u.id and s.status = 'active') then 'active'
      when exists (select 1 from public.subscriptions s where s.user_id = u.id and s.status = 'past_due') then 'past_due'
      else 'expired'
    end as billing_status,
    u.trial_ends_at,
    greatest(0, extract(day from u.trial_ends_at - now())::int) as trial_days_left
  from public.users u;

comment on view public.v_user_billing is
  'C2: View segura de billing. Retorna só o status agregado, sem vazar dados financeiros.';

-- =====================================================================
-- WEBHOOK_EVENTS (MODULE_06) — C5 fix (idempotência)
-- =====================================================================
create table if not exists public.webhook_events (
  id uuid primary key default uuid_generate_v4(),
  provider subscription_provider not null,
  provider_event_id text not null,
  event_type text not null,
  payload_json jsonb not null,
  received_at timestamptz not null default now(),
  processed_at timestamptz,
  error_message text,
  unique (provider, provider_event_id)
);

create index if not exists webhook_events_processed_idx on public.webhook_events(processed_at) where processed_at is null;

alter table public.webhook_events enable row level security;
alter table public.webhook_events force row level security;

-- Nenhuma policy — apenas service role acessa (webhooks). RLS forçada bloqueia todo o resto.

comment on table public.webhook_events is
  'C5: Tabela de idempotência para webhooks. INSERT com ON CONFLICT DO NOTHING garante processamento único.';

-- =====================================================================
-- ARCHIVE (MODULE_07) — meta de campanhas arquivadas com retenção
-- =====================================================================
create table if not exists public.archive_exports (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.users(id) on delete cascade,
  format text not null check (format in ('csv', 'json')),
  filter_json jsonb,
  row_count int,
  file_path text,
  requested_at timestamptz not null default now(),
  completed_at timestamptz,
  expires_at timestamptz not null default (now() + interval '7 days')
);

create index if not exists archive_exports_user_idx on public.archive_exports(user_id, requested_at desc);

alter table public.archive_exports enable row level security;
alter table public.archive_exports force row level security;

drop policy if exists archive_exports_owner on public.archive_exports;
create policy archive_exports_owner on public.archive_exports
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- =====================================================================
-- TRIGGERS — updated_at automático
-- =====================================================================
create or replace function public.trigger_set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

do $$
declare r record;
begin
  for r in
    select table_name from information_schema.columns
    where table_schema = 'public' and column_name = 'updated_at'
  loop
    execute format(
      'drop trigger if exists set_updated_at on public.%I;
       create trigger set_updated_at before update on public.%I
       for each row execute function public.trigger_set_updated_at();',
      r.table_name, r.table_name
    );
  end loop;
end $$;

-- =====================================================================
-- TRIGGER — provisiona row em public.users quando auth.users cria
-- =====================================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.users (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'avatar_url'
  )
  on conflict (id) do nothing;

  insert into public.user_roles (user_id, role)
  values (new.id, 'user')
  on conflict (user_id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- =====================================================================
-- GRANT de leitura nas views (senão authenticated não consegue ler)
-- =====================================================================
grant select on public.users_public to anon, authenticated;
grant select on public.v_user_billing to authenticated;

-- =====================================================================
-- FIM da migration inicial.
-- Próximas migrations: seed de protocolos, storage buckets com RLS, etc.
-- =====================================================================
