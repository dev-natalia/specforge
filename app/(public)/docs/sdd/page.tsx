import { DocTitle, Lead, H2, P, Callout } from "@/components/docs/primitives";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

const PHASES: { title: string; body: string; optional?: boolean }[] = [
  { title: "1. Constituição", body: "Define os guardrails: padrão de projeto, cobertura de teste desejada, o que deve ou não ser feito. É a base de tudo." },
  { title: "2. Especificação", body: "Você descreve o problema em linguagem natural e ele vira uma especificação estruturada — com definição, perguntas para tirar ambiguidades e histórias de usuário." },
  { title: "3. Clarificação", optional: true, body: "Entre a especificação e o planejamento: remove ambiguidades e questiona pontos que não ficaram claros." },
  { title: "4. Planejamento", body: "Planejamento técnico: pesquisa no código, olha a estrutura do banco e racionaliza tudo a partir da especificação." },
  { title: "5. Tarefas", body: "Gera a lista de tarefas separada por fases — o que o agente vai seguir em cada parte do desenvolvimento." },
  { title: "6. Análise", optional: true, body: "Depois das tarefas: revisa todos os artefatos gerados em busca de inconsistências." },
  { title: "7. Implementação", body: "Escreve o código — com migrations, factories, seeders e cobertura de testes." },
];

export default function SddPage() {
  return (
    <>
      <DocTitle>Spec-Driven Development</DocTitle>
      <Lead>
        SDD não é uma ferramenta de fazer — é uma <strong>metodologia de como
        fazer</strong>. Ele retoma a ideia de desenvolver a partir de
        especificação, mas em formato de prompt organizado, para que os agentes de
        IA trabalhem de forma correta.
      </Lead>

      <P>
        O cenário típico: chega um ticket simplista, mal escrito, sem deixar claro o
        que deve e o que não deve ser entregue — &quot;quero um header com login e
        registro, o logo do lado, fixo no topo&quot;. Parece suficiente, mas não é. O
        SDD pega esse texto em língua natural e o transforma em artefatos
        estruturados, levantando justamente as perguntas que ninguém fez.
      </P>

      <H2 id="guardrails">O ponto central: guardrails</H2>
      <P>
        Se você não dá um guideline ao agente — se não especifica os limites dentro
        dos quais ele pode atuar —, ele começa a alucinar: gera código, gera código,
        gera código, e aquilo vira uma bagunça. Você perde o controle e acaba com
        retrabalho.
      </P>
      <Callout>
        O agente precisa de um <strong>guard rail</strong>: &quot;você só pode ir até
        aqui, não faça isso, faça aquilo, escreva o código dessa forma&quot;. Sem esse
        limite, velocidade vira desordem.
      </Callout>
      <P>
        Esses limites vivem numa <strong>constituição</strong> — o conjunto de
        regras não-negociáveis do projeto: testes antes da implementação, princípios
        SOLID, padrão de nomes, e assim por diante. No SpecForge, esse papel é das{" "}
        <strong>constraints</strong> e do <strong>Product DNA</strong>, que depois
        viram regras no harness.
      </P>

      <H2 id="fluxo">O fluxo, fase a fase</H2>
      <P>Cada fase produz um artefato que você revisa antes de seguir:</P>
      <div className="grid gap-3">
        {PHASES.map((p) => (
          <Card key={p.title}>
            <CardContent>
              <h3 className="font-semibold text-slate-900">
                {p.title} {p.optional && <Badge variant="neutral">opcional</Badge>}
              </h3>
              <p className="text-sm text-slate-600">{p.body}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <P>
        O exemplo do header ilustra o valor: a especificação e a clarificação
        levantam coisas fora do ticket original — o header em todas as páginas, o
        avatar e o nome do usuário logado, o logout num popover. Detalhes que só
        apareceriam (tarde) durante a implementação.
      </P>

      <H2 id="papel">De escrevedor de código a analista</H2>
      <P>
        A parte mecânica é delegada à IA. O seu tempo migra para o que importa:
      </P>
      <Callout>
        Você deixa de ser apenas um <strong>escrevedor de código</strong> para virar
        um <strong>analista de sistemas</strong>: revisa a especificação, o plano e
        as tasks, define o padrão de projeto e questiona quem abriu o ticket sobre o
        que não foi pensado.
      </Callout>
      <P>
        Isso encurta o loop de feedback: em vez de implementar e só depois descobrir
        que estava errado (o vai-e-volta que custa caro), você valida a{" "}
        <em>especificação</em> antes de escrever código. Dica: modelos &quot;de
        pensamento&quot; (Claude Opus) para especificar/planejar; modelos rápidos
        (Sonnet) para escrever código.
      </P>

      <H2 id="limites">Onde o SDD chega ao limite</H2>
      <P>
        A spec e a constituição dizem ao agente <em>para onde ir</em> e{" "}
        <em>o que evitar</em> — mas, conforme o projeto cresce, surgem lacunas: o
        agente pode desviar mesmo com as regras escritas, não há feedback contínuo e
        os limites não se aplicam automaticamente a cada mudança.
      </P>
      <Callout>
        É o ponto de partida do <strong>Harness Engineering</strong>: quando a spec
        sozinha não basta, você adiciona estrutura de controle ao redor do agente.
        SDD define o alvo; o harness garante que o caminho seja respeitado.
      </Callout>
    </>
  );
}
