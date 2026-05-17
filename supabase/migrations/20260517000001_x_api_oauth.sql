-- =====================================================================
-- X API OAuth 2.0 PKCE — user_x_accounts + oauth_states
-- Run in Supabase SQL Editor if not already applied
-- =====================================================================

-- OAuth pending states for PKCE flow (expire in 10 min)
create table if not exists public.oauth_states (
  id uuid primary key default gen_random_uuid(),
  state text not null unique,
  code_verifier text not null,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default (now() + interval '10 minutes')
);

create index if not exists oauth_states_state_idx on public.oauth_states(state);
create index if not exists oauth_states_user_id_idx on public.oauth_states(user_id);

alter table public.oauth_states enable row level security;
alter table public.oauth_states force row level security;

drop policy if exists oauth_states_user_policy on public.oauth_states;
create policy oauth_states_user_policy on public.oauth_states
  for all
  using (user_id = auth.uid());

-- User X accounts
create table if not exists public.user_x_accounts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  x_user_id text not null,
  x_username text not null,
  x_name text,
  x_avatar_url text,
  access_token text not null,
  refresh_token text,
  token_expires_at timestamptz,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id, x_user_id)
);

create index if not exists user_x_accounts_user_id_idx on public.user_x_accounts(user_id);

alter table public.user_x_accounts enable row level security;
alter table public.user_x_accounts force row level security;

drop policy if exists user_x_accounts_user_policy on public.user_x_accounts;
create policy user_x_accounts_user_policy on public.user_x_accounts
  for all
  using (user_id = auth.uid());

-- Auto-update updated_at
create or replace function public.update_user_x_accounts_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_user_x_accounts_updated_at on public.user_x_accounts;
create trigger trg_user_x_accounts_updated_at
  before update on public.user_x_accounts
  for each row
  execute function public.update_user_x_accounts_updated_at();
