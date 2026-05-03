import Link from "next/link";
import type { Metadata } from "next";
import { PublicHeader } from "@/components/public/public-header";

export const metadata: Metadata = {
  title: "Termos de uso",
  description: "Termos de uso do Bounty WorkFlow.",
};

const LAST_UPDATE = "18 de abril de 2026";

export default function TermosPage() {
  return (
    <main className="min-h-screen bg-background">
      <PublicHeader />

      <article className="container mx-auto max-w-3xl py-12 sm:py-20">
        <header className="mb-10">
          <p className="text-sm text-muted-foreground">Última atualização: {LAST_UPDATE}</p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight">Termos de Uso</h1>
          <p className="mt-4 text-muted-foreground">
            Estes termos regem o uso do Bounty WorkFlow. Leia com atenção — ao criar uma conta,
            você concorda com tudo que está aqui.
          </p>
        </header>

        <div className="prose prose-sm max-w-none space-y-8 text-foreground">
          <Section title="1. Sobre o serviço">
            <p>
              O <strong>Bounty WorkFlow</strong> (&quot;Serviço&quot;, &quot;app&quot;, &quot;nós&quot;) é uma aplicação web
              desenvolvida de forma independente por <strong>Ed</strong> (&quot;operador&quot;),
              disponibilizada em{" "}
              <Link href="/" className="text-mint-600 underline-offset-4 hover:underline">
                bounty-workflow.vercel.app
              </Link>
              . Trata-se de um projeto autônomo, sem personalidade jurídica constituída, oferecido
              na modalidade SaaS (software como serviço) para organizar campanhas de bounties
              cripto.
            </p>
          </Section>

          <Section title="2. Aceitação">
            <p>
              Ao se cadastrar, você declara ter pelo menos <strong>18 anos</strong>, capacidade
              civil plena e concorda com estes Termos e com a{" "}
              <Link
                href="/legal/privacidade"
                className="text-mint-600 underline-offset-4 hover:underline"
              >
                Política de Privacidade
              </Link>
              . Se não concordar com algum ponto, não use o Serviço.
            </p>
          </Section>

          <Section title="3. Conta de usuário">
            <ul className="list-disc space-y-2 pl-6">
              <li>
                A criação de conta requer email válido e senha forte (ou login via Google/X).
              </li>
              <li>
                Você é responsável por manter suas credenciais em segurança. Qualquer atividade na
                sua conta é considerada sua.
              </li>
              <li>
                É proibido criar múltiplas contas pra burlar limites, compartilhar conta com
                terceiros ou usar bots pra automatizar o Serviço.
              </li>
              <li>
                Podemos suspender ou encerrar contas que violem estes Termos, sem aviso prévio em
                casos graves (fraude, uso abusivo, prática ilegal).
              </li>
            </ul>
          </Section>

          <Section title="4. Plano gratuito e assinatura">
            <ul className="list-disc space-y-2 pl-6">
              <li>
                O Serviço oferece <strong>14 dias de trial gratuito</strong>, sem necessidade de
                cartão.
              </li>
              <li>
                Ao fim do trial, funcionalidades premium ficam disponíveis mediante assinatura
                mensal paga, com preço divulgado na página de upgrade.
              </li>
              <li>
                Pagamentos são processados pelo <strong>Mercado Pago</strong>. Não armazenamos
                dados de cartão de crédito nos nossos servidores.
              </li>
              <li>
                A cobrança é recorrente e renovada automaticamente no mesmo dia do mês, até que o
                usuário cancele.
              </li>
              <li>
                <strong>Cancelamento:</strong> pode ser feito a qualquer momento no painel. O
                acesso às funções premium continua até o fim do período já pago. Não há reembolso
                proporcional, mas também não há multa ou fidelidade.
              </li>
            </ul>
          </Section>

          <Section title="5. Uso aceitável">
            <p>Você concorda em NÃO usar o Serviço para:</p>
            <ul className="mt-3 list-disc space-y-2 pl-6">
              <li>Atividades ilegais, fraudulentas ou contrárias às leis brasileiras.</li>
              <li>
                Armazenar ou transmitir malware, phishing, conteúdo protegido por direito autoral
                sem autorização, ou material que promova ódio/violência.
              </li>
              <li>Sobrecarregar a infraestrutura (scraping agressivo, DDoS, spam de requisições).</li>
              <li>Engenharia reversa ou tentativa de burlar limites técnicos do Serviço.</li>
              <li>Revender ou repackage o acesso para terceiros sem autorização escrita.</li>
            </ul>
          </Section>

          <Section title="6. Conteúdo do usuário">
            <p>
              Você mantém <strong>100% da titularidade</strong> sobre os dados que inserir no
              Serviço (campanhas, anexos, notas, etc). Nós apenas armazenamos e processamos esses
              dados em seu nome, conforme a Política de Privacidade.
            </p>
            <p className="mt-3">
              Ao fazer upload de qualquer conteúdo, você declara ter os direitos necessários sobre
              ele e nos concede uma licença limitada, apenas para operar o Serviço (exibir,
              fazer backup, processar).
            </p>
          </Section>

          <Section title="7. Informações de bounties e recompensas">
            <p>
              O Serviço ajuda a <strong>organizar</strong> informações sobre bounties
              publicamente divulgados por protocolos cripto. Nós{" "}
              <strong>não somos responsáveis</strong> pela veracidade, pagamento, prazo ou regras
              de qualquer bounty externo. Cada protocolo define e opera seus próprios programas.
            </p>
            <p className="mt-3">
              O Serviço <strong>não é um aconselhamento financeiro</strong> nem promessa de
              ganhos. Resultados dependem do seu esforço, habilidade e das decisões dos
              protocolos-terceiros.
            </p>
          </Section>

          <Section title="8. Disponibilidade e limitações">
            <ul className="list-disc space-y-2 pl-6">
              <li>
                O Serviço é oferecido &quot;como está&quot;, sem garantias de disponibilidade
                ininterrupta, bugs zero ou compatibilidade com todos os dispositivos.
              </li>
              <li>
                Podemos realizar manutenção, atualizações ou alterações no Serviço sem aviso
                prévio.
              </li>
              <li>
                Lembretes por email são enviados em base &quot;best-effort&quot;. Você continua
                responsável por acompanhar seus deadlines — o app é um auxílio, não uma
                garantia.
              </li>
            </ul>
          </Section>

          <Section title="9. Limitação de responsabilidade">
            <p>
              Na máxima extensão permitida pela lei, o operador do Serviço{" "}
              <strong>não se responsabiliza</strong> por lucros cessantes, bounties perdidos,
              danos indiretos, incidentais ou consequenciais decorrentes do uso ou incapacidade
              de uso do Serviço.
            </p>
            <p className="mt-3">
              A responsabilidade total cumulativa, em qualquer hipótese, fica limitada ao valor
              efetivamente pago pelo usuário nos <strong>últimos 3 meses</strong>.
            </p>
          </Section>

          <Section title="10. Alterações nestes Termos">
            <p>
              Podemos atualizar estes Termos quando necessário. Mudanças relevantes serão
              comunicadas por email e/ou aviso dentro do app. O uso continuado após a notificação
              indica aceitação da nova versão.
            </p>
          </Section>

          <Section title="11. Rescisão">
            <p>
              Você pode encerrar a conta a qualquer momento. Podemos encerrar a sua se violar
              estes Termos. Em ambos os casos, seus dados ficam disponíveis para export via CSV
              por 30 dias antes da exclusão definitiva.
            </p>
          </Section>

          <Section title="12. Lei aplicável e foro">
            <p>
              Estes Termos são regidos pelas leis da <strong>República Federativa do Brasil</strong>.
              Fica eleito o foro do domicílio do operador para dirimir quaisquer conflitos, com
              renúncia a qualquer outro, por mais privilegiado que seja.
            </p>
          </Section>

          <Section title="13. Contato">
            <p>
              Dúvidas, reclamações ou solicitações relacionadas a estes Termos:{" "}
              <a
                href="mailto:cryptolairbr@gmail.com"
                className="text-mint-600 underline-offset-4 hover:underline"
              >
                cryptolairbr@gmail.com
              </a>
              .
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
            <Link href="/legal/privacidade" className="hover:text-foreground">
              Privacidade
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
