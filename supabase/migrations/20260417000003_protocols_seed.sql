-- =====================================================================
-- Bounty WorkFlow · Seed de protocolos iniciais
-- Lista curada de protocolos com bounty programs ativos.
-- =====================================================================

insert into public.protocols (slug, name, description, chain, category, website_url, is_active)
values
  ('layerzero', 'LayerZero',
   'Protocolo de interoperabilidade omnichain. Airdrops históricos + programas de bounty.',
   'Multi-chain', 'Interoperability', 'https://layerzero.network', true),
  ('zksync', 'zkSync Era',
   'L2 zero-knowledge rollup da Matter Labs. Airdrop e missions.',
   'Ethereum', 'Layer 2', 'https://zksync.io', true),
  ('starknet', 'Starknet',
   'L2 baseada em STARKs. Programas de quests e bounties recorrentes.',
   'Ethereum', 'Layer 2', 'https://starknet.io', true),
  ('scroll', 'Scroll',
   'zkEVM L2 EVM-equivalente. Marks e campanhas de engagement.',
   'Ethereum', 'Layer 2', 'https://scroll.io', true),
  ('linea', 'Linea',
   'L2 zkEVM da ConsenSys. Linea Voyage e campanhas sazonais.',
   'Ethereum', 'Layer 2', 'https://linea.build', true),
  ('base', 'Base',
   'L2 da Coinbase baseada em OP Stack. Quests e programas de builder.',
   'Ethereum', 'Layer 2', 'https://base.org', true),
  ('arbitrum', 'Arbitrum',
   'L2 optimistic rollup líder em TVL. Campanhas Odyssey e STIP.',
   'Ethereum', 'Layer 2', 'https://arbitrum.io', true),
  ('optimism', 'Optimism',
   'L2 optimistic rollup. Retroactive funding + quests.',
   'Ethereum', 'Layer 2', 'https://optimism.io', true),
  ('eigenlayer', 'EigenLayer',
   'Restaking protocol. Points program e missões.',
   'Ethereum', 'Restaking', 'https://eigenlayer.xyz', true),
  ('blast', 'Blast',
   'L2 com yield nativo. Blast Gold e pontos.',
   'Ethereum', 'Layer 2', 'https://blast.io', true),
  ('monad', 'Monad',
   'L1 EVM paralela de alta performance. Testnet aberta com quests.',
   'Standalone', 'Layer 1', 'https://monad.xyz', true),
  ('berachain', 'Berachain',
   'L1 Proof-of-Liquidity. Artio testnet e campanhas.',
   'Standalone', 'Layer 1', 'https://berachain.com', true)
on conflict (slug) do nothing;
