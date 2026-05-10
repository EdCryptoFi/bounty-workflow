-- New protocols: Nano Creators, AP, Earn, CryptokMe, CreatorVerse
INSERT INTO public.protocols (slug, name, website_url, is_active)
VALUES
  ('nano-creators',  'Nano Creators', 'https://nanoscreators.xyz',                true),
  ('ap-collective',  'AP',            'https://aicreators.apcollective.site',     true),
  ('superteam-earn', 'Earn',          'https://superteam.fun/earn/r/TBBF67D',    true),
  ('cryptokme',      'CryptokMe',     'https://cryptok.me',                       true),
  ('creatorverse',   'CreatorVerse',  'https://app.thecreatorverse.xyz/',         true)
ON CONFLICT (slug) DO NOTHING;
