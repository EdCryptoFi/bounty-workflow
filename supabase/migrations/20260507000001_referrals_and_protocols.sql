-- New protocols
insert into public.protocols (slug, name, description, website_url, is_active)
values
  ('first-dollar', 'First Dollar', null, 'https://app.firstdollar.money/bounties', true),
  ('xeet',         'Xeet',         null, 'https://www.xeet.ai',                   true),
  ('mindo-ai',     'Mindo AI',     null, 'https://mindoshare.ai',                 true),
  ('wallchain',    'WallChain',    null, 'https://quacks.app',                    true)
on conflict (slug) do update
  set website_url = excluded.website_url,
      is_active   = true;

-- Referrals table
create table if not exists public.referrals (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.users(id) on delete cascade,
  protocol_id uuid references public.protocols(id) on delete set null,
  label       text,
  url         text not null,
  created_at  timestamptz not null default now()
);

alter table public.referrals enable row level security;

create policy "referrals_self" on public.referrals
  for all using (auth.uid() = user_id);
