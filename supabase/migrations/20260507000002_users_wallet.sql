alter table public.users
  add column if not exists wallet_address text;
