# Mercado Pago — Passo a Passo de Ativação

Guia pra ligar pagamentos reais no **bounty-workflow.vercel.app** via Mercado Pago (PIX/cartão/boleto recorrente).

**Tempo estimado:** 30-45 min.
**Pré-requisitos:** conta PJ ou CPF com dados completos, acesso ao Vercel do projeto.

---

## 1. Criar conta Mercado Pago Developers (5 min)

1. Acesse https://www.mercadopago.com.br/developers/pt
2. Clique **Entrar** (canto superior direito) → use a mesma conta que vai receber o dinheiro
3. Se ainda não tem conta MP: https://www.mercadopago.com.br/cadastro → preencha CPF/CNPJ → valide email
4. No painel dev, vai aparecer "Minhas aplicações" → clique **Criar aplicação**

### Dados da aplicação

| Campo | Valor |
|---|---|
| Nome | `Bounty WorkFlow` |
| Modelo de integração | **Pagamentos online** |
| Produto integrado | **Checkout Pro** (marque também **Assinaturas**) |
| URL do site | `https://bounty-workflow.vercel.app` |

Clique **Criar aplicação**.

---

## 2. Pegar as credenciais (3 min)

Dentro da aplicação recém-criada, menu lateral **Credenciais de produção**:

1. Clique **Ativar credenciais de produção** (se ainda não tiver) — MP pode pedir pra validar dados bancários aqui
2. Copie o **Access Token de produção** (começa com `APP_USR-...`) — **NÃO** o de teste
3. Guarde em local seguro (você vai colar no Vercel)

> ⚠️ **Access Token é secreto.** Nunca commite no Git nem compartilhe por chat.

---

## 3. Configurar webhook (5 min)

Ainda dentro da aplicação, menu lateral **Webhooks** → aba **Configuração**:

1. Em **Modo de produção**, clique **Configurar notificações**
2. **URL de produção:**

   ```
   https://bounty-workflow.vercel.app/api/webhooks/mercadopago
   ```

3. **Eventos** — marque apenas estes (os únicos que a app usa):
   - ☑ `Preapproval` (planos de assinatura)
   - ☑ `Subscription authorized payment` (cobranças recorrentes)
   - ☑ `Payment` (opcional, pra logar tentativas)

4. Clique **Salvar**

5. Aparecerá a aba **Chave secreta** — clique em **Gerar** (ou **Mostrar** se já existe) e **copie a chave secreta do webhook**. Guarde junto com o Access Token.

> Essa secret é o que o nosso código usa pra validar HMAC-SHA256 no header `x-signature`. Sem ela, o endpoint rejeita tudo (fix C2).

---

## 4. Adicionar envs no Vercel (5 min)

1. Acesse https://vercel.com/cryptolairbr-8192s-projects/bounty-workflow/settings/environment-variables
2. Adicione (ou edite) as seguintes, **todas em Production + Preview**:

| Nome | Valor | Sensível? |
|---|---|---|
| `MERCADOPAGO_ACCESS_TOKEN` | `APP_USR-xxxxx...` (do passo 2) | ✅ Sim |
| `MERCADOPAGO_WEBHOOK_SECRET` | `xxxxx...` (do passo 3) — **opcional**, ver nota abaixo | ✅ Sim |
| `MERCADOPAGO_PRICE_MONTHLY_BRL` | `29.90` (ou o preço que quiser) | Não |
| `NEXT_PUBLIC_PAYMENTS_ENABLED` | `true` | Não |

> Pra marcar como **sensível**: ao adicionar a env, clique no ícone do olho ou selecione "Sensitive". Uma vez sensível, ninguém (nem você) consegue ler o valor depois — só rotacionar.

> **Nota sobre `MERCADOPAGO_WEBHOOK_SECRET`:** é opcional. Quando ausente, o handler do webhook faz *fallback* validando cada evento na API do Mercado Pago (chama `GET /preapproval/{id}` com o access token — se retorna 200, o evento é legítimo). Essa é a configuração atual em produção, porque o painel MP não deixa copiar a secret após salvar em algumas contas. Quando houver oportunidade de capturar a secret (recriando o webhook), adicionar esta env **ativa HMAC** automaticamente — sem deploy.

---

## 5. Redeploy (2 min)

Opção A — pelo dashboard:
1. https://vercel.com/cryptolairbr-8192s-projects/bounty-workflow/deployments
2. No último deploy verde, clique nos 3 pontinhos → **Redeploy** → marque **Use existing Build Cache** → **Redeploy**

Opção B — me avisar que você fez as envs e eu redeployo via CLI em 1 min.

---

## 6. Testes de sanidade (10 min)

Com o deploy novo no ar, rode na ordem:

### 6.1 Verificar que o endpoint acorda

```bash
curl -i https://bounty-workflow.vercel.app/api/webhooks/mercadopago \
  -X POST -H 'content-type: application/json' -d '{}'
```

**Esperado:** `401 Unauthorized` (payload sem signature) — e **não mais** 503.

Se ainda retornar 503, a env `NEXT_PUBLIC_PAYMENTS_ENABLED=true` não propagou — force redeploy sem cache.

### 6.2 Teste real end-to-end

1. Acesse https://bounty-workflow.vercel.app e crie uma conta nova de teste
2. Vá em **Settings → Billing**
3. Clique **Fazer upgrade** → você deve ser redirecionado pro checkout do Mercado Pago
4. Use um **cartão de teste** do MP (não é produção ainda):
   - `5031 4332 1540 6351` Mastercard (approved)
   - CVV: `123`
   - Validade: qualquer data futura
   - Nome: `APRO` (força aprovação) ou `OTHE` (pending)
5. Após aprovar, você deve voltar em `/settings/billing?success=1`
6. No painel MP → aba **Notificações** → você verá o evento `preapproval` enviado → status `delivered`
7. No Supabase (SQL editor), rode:

   ```sql
   select id, user_id, provider, status, current_period_end
   from subscriptions
   order by created_at desc
   limit 5;
   ```

   A linha nova deve ter `provider = 'mercadopago'` e `status = 'active'`.

### 6.3 Teste de webhook duplicado (idempotência)

No painel MP → aba **Notificações** → clique em um evento → **Reenviar**.

No Supabase, rode:
```sql
select provider_event_id, count(*)
from webhook_events
where provider = 'mercadopago'
group by provider_event_id
having count(*) > 1;
```

Deve retornar **0 linhas** (idempotência OK).

---

## 7. Ativar modo produção real

Nos passos acima, o MP ainda pode estar em modo **sandbox** se você só tem credenciais de teste.

Pra receber dinheiro de verdade:

1. Painel MP → **Credenciais de produção** → precisa ter:
   - CPF/CNPJ validado
   - Dados bancários cadastrados (conta onde cai o dinheiro)
   - Documento comprobatório (selfie com RG ou contrato social)
2. MP libera em 24-72h normalmente
3. Depois disso, copie o **novo Access Token de produção** (não o de teste) e substitua no Vercel
4. Redeploy

---

## Troubleshooting

### "payments disabled" mesmo após set `NEXT_PUBLIC_PAYMENTS_ENABLED=true`
- Envs `NEXT_PUBLIC_*` só entram no bundle no build. Force redeploy **sem cache**.

### Webhook retorna 401 no painel MP
- Chave secreta copiada errada. Regenera no painel MP e atualiza `MERCADOPAGO_WEBHOOK_SECRET` no Vercel.
- Verifique que o header `x-signature` chega no formato `ts=<unix>,v1=<hex>` — o MP envia assim por padrão.

### Checkout abre mas falha ao criar assinatura
- `MERCADOPAGO_PRICE_MONTHLY_BRL` inválido ou faltando (deve ser número tipo `29.90`, ponto não vírgula)
- Access Token é de teste em conta sem produção liberada

### Usuário pagou mas `subscriptions` não atualizou
- Verifica `webhook_events` tem a linha com `error_message` null
- Se `error_message` não-null: olha o log → provavelmente `external_reference` veio null (bug de integração) ou usuário não existe

### "Preapproval pending" eterno
- MP às vezes demora 1-2h pra processar a primeira autorização de cartão
- Se passar de 2h: cancela a preapproval no painel MP e pede o usuário refazer

---

## Resumo das variáveis de ambiente

```bash
# Produção Mercado Pago
MERCADOPAGO_ACCESS_TOKEN=APP_USR-xxxxxxxxxxxxxxxx
MERCADOPAGO_WEBHOOK_SECRET=xxxxxxxxxxxxxxxxxx
MERCADOPAGO_PRICE_MONTHLY_BRL=29.90

# Ligar o feature flag
NEXT_PUBLIC_PAYMENTS_ENABLED=true
```

Isso é tudo. Qualquer erro nos testes, me manda o log / screenshot que eu diagnostico.
