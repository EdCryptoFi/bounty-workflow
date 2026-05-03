-- =====================================================================
-- Adiciona 'mercadopago' ao enum subscription_provider
-- (Decisão do produto: substituir Asaas por Mercado Pago)
-- =====================================================================

alter type subscription_provider add value if not exists 'mercadopago';
