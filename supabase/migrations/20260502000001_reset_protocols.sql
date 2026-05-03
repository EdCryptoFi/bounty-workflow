-- =====================================================================
-- Reset completo dos protocolos — remove blockchain, insere novos
-- =====================================================================

delete from public.protocols;

insert into public.protocols (slug, name, description, category, website_url, is_active)
values
  ('clasho', 'Clasho',
   'Plataforma de bounties e missões gamificadas. Entre pelo link de convite e comece a ganhar.',
   'Gaming', 'https://clasho.com/invite/EJGSME4W', true),

  ('kreators', 'Kreators',
   'Ecossistema de criadores com recompensas e programas de bounty para conteúdo Web3.',
   'Creator Economy', 'https://www.kreators.world', true),

  ('magverse', 'MagVerse',
   'Metaverso modular com quests, missões e recompensas para exploradores.',
   'Metaverse', 'https://console.magverse.io?invite_code=GC8HYB', true),

  ('rally', 'Rally',
   'Plataforma de crescimento social com bounties e recompensas por engajamento.',
   'Social', 'https://waitlist.rally.fun/joinme/edcriptofi', true)

on conflict (slug) do update
  set name        = excluded.name,
      description = excluded.description,
      category    = excluded.category,
      website_url = excluded.website_url,
      is_active   = excluded.is_active,
      updated_at  = now();
