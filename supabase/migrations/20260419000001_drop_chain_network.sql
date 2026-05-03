-- Commit 1 — Remove blockchain metadata from schema
-- Request: "remover as blockchains" — as colunas `chain` em protocols
-- e `network` em campaigns não têm mais uso funcional. Bounty hunters
-- trabalham com o protocolo + recompensa em USD; a rede é detalhe
-- operacional que fica no wallet, não no workflow.

BEGIN;

-- protocols.chain -----------------------------------------------------------
ALTER TABLE public.protocols
  DROP COLUMN IF EXISTS chain;

-- campaigns.network ---------------------------------------------------------
ALTER TABLE public.campaigns
  DROP COLUMN IF EXISTS network;

COMMIT;
