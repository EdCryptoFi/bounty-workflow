-- =====================================================================
-- Bounty WorkFlow · Waitlist + Referral Enhancements
-- =====================================================================

-- Waitlist subscribers (pre-launch capture)
create table if not exists public.waitlist_subscribers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email citext not null unique,
  profile_type text not null check (profile_type in ('creator', 'hunter', 'both')),
  referral_source text,
  created_at timestamptz not null default now()
);

alter table public.waitlist_subscribers enable row level security;

-- Only admin can see waitlist data
create policy "waitlist_admin_all" on public.waitlist_subscribers
  for all using (public.is_admin());

-- Referral clicks tracking
create table if not exists public.referral_clicks (
  id uuid primary key default gen_random_uuid(),
  referrer_id uuid not null references public.users(id) on delete cascade,
  ip text,
  clicked_at timestamptz not null default now(),
  converted boolean not null default false
);

create index if not exists referral_clicks_referrer_idx on public.referral_clicks(referrer_id);
create index if not exists referral_clicks_converted_idx on public.referral_clicks(converted);

alter table public.referral_clicks enable row level security;

create policy "referral_clicks_read_own" on public.referral_clicks
  for select using (auth.uid() = referrer_id);

create policy "referral_clicks_insert_all" on public.referral_clicks
  for insert with check (true);

-- Email queue for nurture sequences
create table if not exists public.email_queue (
  id uuid primary key default gen_random_uuid(),
  to_email text not null,
  subject text not null,
  html_body text not null,
  text_body text not null,
  scheduled_for timestamptz not null default now(),
  sent_at timestamptz,
  error text,
  created_at timestamptz not null default now()
);

create index if not exists email_queue_schedule_idx on public.email_queue(sent_at, scheduled_for)
  where sent_at is null;

alter table public.email_queue enable row level security;

-- Only admin / service role accesses email queue
create policy "email_queue_admin_all" on public.email_queue
  for all using (public.is_admin());

-- Referral code and referred_by on users
alter table public.users
  add column if not exists referral_code text unique,
  add column if not exists referred_by uuid references public.users(id) on delete set null;

create index if not exists users_referral_code_idx on public.users(referral_code);
create index if not exists users_referred_by_idx on public.users(referred_by);

-- Generate referral_code for existing users
do $$
declare
  r record;
begin
  for r in select id, email from public.users where referral_code is null loop
    update public.users
    set referral_code = upper('BWF-' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 8))
    where id = r.id;
  end loop;
end $$;

-- Auto-generate referral_code on new user insert
create or replace function public.trigger_set_referral_code()
returns trigger language plpgsql as $$
begin
  if new.referral_code is null then
    new.referral_code = upper('BWF-' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 8));
  end if;
  return new;
end;
$$;

drop trigger if exists set_referral_code on public.users;
create trigger set_referral_code
  before insert on public.users
  for each row execute function public.trigger_set_referral_code();
