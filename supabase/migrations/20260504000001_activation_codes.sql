-- =====================================================================
-- Activation Codes — trial extension codes managed by admin
-- =====================================================================

create table if not exists public.activation_codes (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  days_free integer not null default 7 check (days_free > 0 and days_free <= 365),
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  used_by uuid references auth.users(id) on delete set null,
  used_at timestamptz
);

create index if not exists activation_codes_code_idx on public.activation_codes(code);
create index if not exists activation_codes_used_by_idx on public.activation_codes(used_by);

alter table public.activation_codes enable row level security;
alter table public.activation_codes force row level security;

-- Only admins can manage codes
drop policy if exists activation_codes_admin_all on public.activation_codes;
create policy activation_codes_admin_all on public.activation_codes
  for all
  using (public.is_admin());

-- Users can read only their own used code (to display in settings)
drop policy if exists activation_codes_user_select on public.activation_codes;
create policy activation_codes_user_select on public.activation_codes
  for select
  using (used_by = auth.uid());

-- Add applied_code_id to users table to track which code was applied
alter table public.users
  add column if not exists applied_code_id uuid references public.activation_codes(id) on delete set null;
