-- Add P2P Kols and 3Look protocols
insert into public.protocols (slug, name, description, website_url, is_active)
values
  ('p2pkols', 'P2P Kols',  null, 'https://p2pkols.com',  true),
  ('3look',   '3Look',     null, 'https://3look.io',     true)
on conflict (slug) do update
  set website_url = excluded.website_url,
      is_active   = true;
