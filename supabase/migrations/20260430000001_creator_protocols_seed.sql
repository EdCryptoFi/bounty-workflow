-- Bounty WorkFlow · Protocolos do tipo Creator (acesso rápido com link direto)
-- Cada website_url é o link de convite/referral do usuário.

insert into public.protocols (slug, name, description, category, website_url, is_active)
values
  ('superteam-earn',
   'SuperTeam Earn',
   'Plataforma de bounties e grants do ecossistema Solana.',
   'Creator',
   'https://superteam.fun/earn/r/TBBF67D',
   true),

  ('rallys',
   'Rallys',
   'Plataforma de missões e recompensas para criadores de conteúdo.',
   'Creator',
   'https://waitlist.rally.fun/joinme/edcriptofi',
   true),

  ('kreators',
   'Kreators',
   'Programa KOL de bounties e campanhas pagas para criadores Web3.',
   'Creator',
   'https://www.kreators.world/kol/EdCriptoFi',
   true),

  ('clasho',
   'Clasho',
   'Plataforma de desafios e torneios com recompensas.',
   'Creator',
   'https://clasho.com/invite/EJGSME4W',
   true),

  ('magverse',
   'MagVerse',
   'Console de missões e recompensas no ecossistema MagVerse.',
   'Creator',
   'https://console.magverse.io?invite_code=GC8HYB',
   true),

  ('mindo-ai',
   'Mindo AI',
   'Plataforma de KOL e compartilhamento de conteúdo com IA.',
   'Creator',
   'https://mindoshare.ai/kol?ref=cmhqi5zs3046jmk3w5lovqvyw',
   true)

on conflict (slug) do update set
  name        = excluded.name,
  description = excluded.description,
  category    = excluded.category,
  website_url = excluded.website_url,
  is_active   = excluded.is_active;
