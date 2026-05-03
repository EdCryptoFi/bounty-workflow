-- Higieniza deadlines absurdos (ano < 2000 ou > 2100) que entraram pela
-- ausência de validação Zod antes do refactor de 2026-04-23.
-- Rodar UMA VEZ no Supabase SQL Editor (service role).
UPDATE campaigns
SET deadline = NULL,
    updated_at = now()
WHERE deadline IS NOT NULL
  AND (extract(year from deadline)::int < 2000
       OR extract(year from deadline)::int > 2100);
