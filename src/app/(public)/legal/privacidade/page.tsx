import Link from "next/link";
import type { Metadata } from "next";
import { PublicHeader } from "@/components/public/public-header";

export const metadata: Metadata = {
  title: "Política de Privacidade",
  description:
    "Como o Bounty WorkFlow coleta, usa e protege os seus dados — compatível com a LGPD.",
};

const LAST_UPDATE = "18 de abril de 2026";

export default function PrivacidadePage() {
  return (
    <main className="min-h-screen bg-background">
      <PublicHeader />

      <article className="container mx-auto max-w-3xl py-12 sm:py-20">
        <header className="mb-10">
          <p className="text-sm text-muted-foreground">Última atualização: {LAST_UPDATE}</p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight">Política de Privacidade</h1>
          <p className="mt-4 text-muted-foreground">
            Sua privacidade importa. Esta política explica, em português claro, quais dados o
            Bounty WorkFlow coleta, por quê, com quem compartilha e quais são seus direitos
            segundo a Lei Geral de Proteção de Dados (LGPD — Lei 13.709/2018).
          </p>
        </header>

        <div className="space-y-8 text-foreground">
          <Section title="1. Quem é o controlador">
            <p>
              O Bounty WorkFlow é operado de forma autônoma por <strong>Ed</strong>. Para fins da
              LGPD, Ed atua como <strong>controlador</strong> dos dados pessoais tratados neste
              Serviço. Contato:{" "}
              <a
                href="mailto:cryptolairbr@gmail.com"
                className="text-mint-600 underline-offset-4 hover:underline"
              >
                cryptolairbr@gmail.com
              </a>
              .
            </p>
          </Section>

          <Section title="2. Quais dados coletamos">
            <p>Coletamos o mínimo possível. Dividimos em três categorias:</p>

            <h3 className="mt-4 font-semibold">2.1 Dados de cadastro</h3>
            <ul className="mt-2 list-disc space-y-1 pl-6">
              <li>Email</li>
              <li>Nome (se fornecido via Google/X durante o OAuth)</li>
              <li>Foto de perfil (opcional, via OAuth)</li>
              <li>Senha, armazenada de forma criptografada (bcrypt + salt pelo Supabase)</li>
            </ul>

            <h3 className="mt-4 font-semibold">2.2 Dados de uso do app</h3>
            <ul className="mt-2 list-disc space-y-1 pl-6">
              <li>Campanhas de bounty que você cadastra (título, protocolo, deadline, notas)</li>
              <li>Tarefas, anexos e comentários criados por você</li>
              <li>
                Endereços de carteira cripto <em>que você optar por adicionar</em> — são dados
                públicos, mas ficam associados ao seu perfil só pra sua própria organização
              </li>
            </ul>

            <h3 className="mt-4 font-semibold">2.3 Dados técnicos</h3>
            <ul className="mt-2 list-disc space-y-1 pl-6">
              <li>Endereço IP (logs de segurança, retidos por até 30 dias)</li>
              <li>User-Agent do navegador</li>
              <li>Cookies de sessão (para manter você logado — não usamos cookies de rastreio)</li>
            </ul>

            <p className="mt-4">
              <strong>O que NÃO coletamos:</strong> dados bancários (pagamento é feito
              diretamente no Mercado Pago), localização precisa, contatos do seu dispositivo,
              dados de comportamento de navegação fora do nosso app.
            </p>
          </Section>

          <Section title="3. Para que usamos seus dados">
            <ul className="list-disc space-y-2 pl-6">
              <li>
                <strong>Autenticação e segurança:</strong> manter sua sessão ativa, prevenir
                fraudes e acessos indevidos.
              </li>
              <li>
                <strong>Prestação do serviço:</strong> exibir suas campanhas, disparar lembretes
                por email, gerar exports CSV.
              </li>
              <li>
                <strong>Comunicação operacional:</strong> avisos importantes sobre a conta
                (cobrança, mudança de termos, incidentes de segurança).
              </li>
              <li>
                <strong>Melhoria do produto:</strong> análise agregada e anônima de uso, sem
                cruzamento com sua identidade.
              </li>
              <li>
                <strong>Cumprimento legal:</strong> responder a ordens judiciais ou obrigações
                legais quando aplicável.
              </li>
            </ul>
            <p className="mt-4">
              <strong>Bases legais (art. 7º da LGPD):</strong> execução de contrato (o próprio
              Serviço), legítimo interesse (segurança e melhoria) e cumprimento de obrigação
              legal. Nunca vendemos dados e não usamos seus dados pra publicidade direcionada.
            </p>
          </Section>

          <Section title="4. Com quem compartilhamos">
            <p>
              Compartilhamos dados apenas com operadores essenciais pra fazer o Serviço
              funcionar. Cada um tem sua própria política de privacidade:
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-6">
              <li>
                <strong>Supabase</strong> (banco de dados e autenticação) —{" "}
                <a
                  href="https://supabase.com/privacy"
                  target="_blank"
                  rel="noreferrer"
                  className="text-mint-600 underline-offset-4 hover:underline"
                >
                  supabase.com/privacy
                </a>
              </li>
              <li>
                <strong>Vercel</strong> (hospedagem) —{" "}
                <a
                  href="https://vercel.com/legal/privacy-policy"
                  target="_blank"
                  rel="noreferrer"
                  className="text-mint-600 underline-offset-4 hover:underline"
                >
                  vercel.com/legal/privacy-policy
                </a>
              </li>
              <li>
                <strong>Resend</strong> (envio de email) —{" "}
                <a
                  href="https://resend.com/privacy"
                  target="_blank"
                  rel="noreferrer"
                  className="text-mint-600 underline-offset-4 hover:underline"
                >
                  resend.com/privacy
                </a>
              </li>
              <li>
                <strong>Mercado Pago</strong> (processamento de pagamento) —{" "}
                <a
                  href="https://www.mercadopago.com.br/ajuda/politica-privacidade_299"
                  target="_blank"
                  rel="noreferrer"
                  className="text-mint-600 underline-offset-4 hover:underline"
                >
                  mercadopago.com.br/ajuda/politica-privacidade
                </a>
              </li>
              <li>
                <strong>Google</strong> e <strong>X (Twitter)</strong> — apenas se você escolher
                logar via OAuth; recebemos email, nome e avatar.
              </li>
            </ul>
            <p className="mt-3">
              Nunca compartilhamos seus dados com terceiros pra fins de marketing. Todo
              compartilhamento é estritamente operacional.
            </p>
          </Section>

          <Section title="5. Transferência internacional">
            <p>
              Alguns dos operadores listados acima (Vercel, Supabase, Resend) armazenam dados em
              servidores fora do Brasil (principalmente EUA e UE). Todos eles oferecem garantias
              compatíveis com a LGPD e GDPR. Ao usar o Serviço, você concorda com essa
              transferência.
            </p>
          </Section>

          <Section title="6. Quanto tempo guardamos">
            <ul className="list-disc space-y-2 pl-6">
              <li>
                <strong>Conta ativa:</strong> mantemos enquanto você usa o Serviço.
              </li>
              <li>
                <strong>Conta encerrada:</strong> export CSV fica disponível por 30 dias; depois,
                todos os dados pessoais são excluídos em até 90 dias (exceto o que a lei obriga a
                reter — ex: registros fiscais).
              </li>
              <li>
                <strong>Logs técnicos (IP, User-Agent):</strong> 30 dias.
              </li>
              <li>
                <strong>Registros fiscais/contábeis:</strong> 5 anos (obrigação legal).
              </li>
            </ul>
          </Section>

          <Section title="7. Seus direitos (LGPD)">
            <p>A LGPD te garante — e nós respeitamos — os seguintes direitos:</p>
            <ul className="mt-3 list-disc space-y-2 pl-6">
              <li>
                <strong>Confirmação e acesso:</strong> saber se tratamos seus dados e pedir cópia.
              </li>
              <li>
                <strong>Correção:</strong> atualizar dados incompletos ou desatualizados.
              </li>
              <li>
                <strong>Anonimização, bloqueio ou eliminação:</strong> de dados excessivos ou
                tratados em desconformidade.
              </li>
              <li>
                <strong>Portabilidade:</strong> receber seus dados em formato estruturado (CSV).
              </li>
              <li>
                <strong>Eliminação:</strong> pedir exclusão dos dados pessoais tratados com base
                no consentimento.
              </li>
              <li>
                <strong>Informação sobre compartilhamento:</strong> saber com quem compartilhamos.
              </li>
              <li>
                <strong>Revogação do consentimento:</strong> quando aplicável.
              </li>
            </ul>
            <p className="mt-4">
              Pra exercer qualquer direito, mande email para{" "}
              <a
                href="mailto:cryptolairbr@gmail.com"
                className="text-mint-600 underline-offset-4 hover:underline"
              >
                cryptolairbr@gmail.com
              </a>{" "}
              com o assunto &quot;LGPD — [seu pedido]&quot;. Respondemos em até 15 dias.
            </p>
          </Section>

          <Section title="8. Segurança">
            <p>
              Aplicamos medidas técnicas e organizacionais razoáveis pra proteger seus dados:
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-6">
              <li>Tráfego 100% sobre HTTPS (TLS 1.2+).</li>
              <li>Senhas armazenadas com hash bcrypt + salt (nunca em texto puro).</li>
              <li>
                Row-level security (RLS) no banco: cada usuário só acessa seus próprios dados.
              </li>
              <li>Tokens de API criptografados, rotação periódica.</li>
              <li>Logs de auditoria pra acessos administrativos.</li>
            </ul>
            <p className="mt-4">
              Apesar disso, nenhum sistema é 100% à prova. Se detectarmos um incidente de
              segurança que afete seus dados, notificaremos você e a ANPD (Autoridade Nacional de
              Proteção de Dados) conforme a LGPD.
            </p>
          </Section>

          <Section title="9. Crianças e adolescentes">
            <p>
              O Serviço é destinado a maiores de 18 anos. Não coletamos conscientemente dados de
              menores. Se identificar que uma criança nos forneceu dados, entre em contato que
              excluiremos imediatamente.
            </p>
          </Section>

          <Section title="10. Cookies">
            <p>
              Usamos apenas <strong>cookies estritamente necessários</strong> para manter sua
              sessão logada e lembrar sua preferência de tema (claro/escuro). Não usamos cookies
              de rastreamento, nem compartilhamos cookies com terceiros. Não precisa de banner de
              consentimento porque esses cookies são considerados essenciais.
            </p>
          </Section>

          <Section title="11. Alterações nesta política">
            <p>
              Esta política pode ser atualizada periodicamente. Quando houver mudanças
              relevantes, notificaremos por email e atualizaremos a data &quot;Última
              atualização&quot; no topo desta página.
            </p>
          </Section>

          <Section title="12. Contato e encarregado (DPO)">
            <p>
              Como projeto autônomo, a função de encarregado de dados (DPO) é exercida pelo
              próprio operador, Ed. Para qualquer questão relacionada a privacidade ou LGPD:
            </p>
            <p className="mt-2">
              <a
                href="mailto:cryptolairbr@gmail.com"
                className="text-mint-600 underline-offset-4 hover:underline"
              >
                cryptolairbr@gmail.com
              </a>
            </p>
          </Section>
        </div>
      </article>

      <footer className="border-t border-border bg-card/30">
        <div className="container mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 py-8 text-sm text-muted-foreground">
          <span>© {new Date().getFullYear()} Bounty WorkFlow — por Ed</span>
          <nav className="flex flex-wrap items-center gap-4">
            <Link href="/como-funciona" className="hover:text-foreground">
              Como funciona
            </Link>
            <Link href="/legal/termos" className="hover:text-foreground">
              Termos de uso
            </Link>
          </nav>
        </div>
      </footer>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
      <div className="mt-3 text-muted-foreground">{children}</div>
    </section>
  );
}
