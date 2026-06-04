import type { Metadata } from "next";
import Link from "next/link";
import { FilePreview } from "@/components/preview/FilePreview";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import type { GeneratedFile } from "@/lib/types";
import {
  WIZARD_GUIDE,
  CUSTOM_TOPICS_GUIDE,
  type FieldGuide,
} from "@/lib/docs/wizard-guide";

export const metadata: Metadata = {
  title: "Documentação — SpecForge",
  description:
    "Guia completo de Spec-Driven Development, Harness Engineering e do wizard, campo a campo.",
};

const TOC: Array<{ href: string; label: string }> = [
  { href: "#sdd", label: "1. Spec-Driven Development" },
  { href: "#sdd-guardrails", label: "1.1 O ponto central: guardrails" },
  { href: "#sdd-fluxo", label: "1.2 O fluxo, fase a fase" },
  { href: "#sdd-artefatos", label: "1.3 Os artefatos em Markdown" },
  { href: "#sdd-papel", label: "1.4 De escrevedor de código a analista" },
  { href: "#sdd-limites", label: "1.5 Onde o SDD chega ao limite" },
  { href: "#harness", label: "2. Harness Engineering" },
  { href: "#harness-oque", label: "2.1 O que é (e por que agora)" },
  { href: "#harness-controle", label: "2.2 Feed forward e feedback" },
  { href: "#harness-falhas", label: "2.3 Como agentes falham sem harness" },
  { href: "#harness-juntos", label: "2.4 SDD é metade do harness" },
  { href: "#harness-pratica", label: "2.5 O fundamento na prática" },
  { href: "#wizard", label: "3. Guia do wizard, campo a campo" },
  { href: "#usar", label: "4. Como usar as specs geradas" },
  { href: "#modelo", label: "5. Modelo e configuração da geração" },
  { href: "#exemplos", label: "6. Exemplos de output" },
];

const EXAMPLE_FILES: GeneratedFile[] = [
  {
    name: "spec.md",
    path: "specs/001-pagamentos-pix/spec.md",
    language: "markdown",
    content: `# Spec — API de Pagamentos Pix

## Visão
Serviço que recebe cobranças via Pix, concilia pagamentos e notifica o lojista.

## User Stories
- Como lojista, quero criar uma cobrança para receber de um cliente.
- Como sistema, quero confirmar o pagamento via webhook do PSP.

## Critérios de Aceite
- [ ] POST /payments cria cobrança com status PENDING
- [ ] Webhook válido muda o status para PAID
- [ ] Idempotência garantida via Idempotency-Key
`,
  },
  {
    name: "requirements.md",
    path: "specs/001-pagamentos-pix/requirements.md",
    language: "markdown",
    content: `# Requirements

## Funcionais
- RF01 — Criar cobrança Pix (valor, chave, expiração de 30 min)
- RF02 — Receber e validar webhook do PSP
- RF03 — Conciliar pagamento com o extrato

## Não-Funcionais
- RNF01 — Idempotência em retries
- RNF02 — Nunca logar dados sensíveis do pagador
`,
  },
  {
    name: "CLAUDE.md",
    path: "CLAUDE.md",
    language: "markdown",
    content: `# CLAUDE.md — Guia do agente

## Stack Obrigatória
- TypeScript estrito; validação com Zod em toda borda.

## Regras Invioláveis
- Sempre filtrar recursos por usuário (evitar IDOR).
- Nunca logar PII ou dados de cartão.
- Webhooks: validar assinatura antes de processar.

## O que NÃO fazer
- Não chamar serviços externos sem timeout.
`,
  },
  {
    name: "ci.yml",
    path: ".github/workflows/ci.yml",
    language: "yaml",
    content: `name: CI
on: [push, pull_request]
jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npm run lint
      - run: npm run typecheck
      - run: npm test
`,
  },
  {
    name: "PROGRESS.md",
    path: "PROGRESS.md",
    language: "markdown",
    content: `# Progresso

## Estado atual
Sprint 1 — cobranças Pix. Em andamento.

## Concluído
- [x] Modelo de dados (Payment)
- [x] POST /payments

## A fazer
- [ ] Webhook do PSP
- [ ] Conciliação

## Log
- 2026-06-03 — Spec aprovada; harness gerado.
`,
  },
];

function H2({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2
      id={id}
      className="scroll-mt-24 border-b border-slate-200 pb-2 text-2xl font-bold text-slate-900"
    >
      {children}
    </h2>
  );
}

function H3({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h3 id={id} className="scroll-mt-24 text-lg font-semibold text-slate-900">
      {children}
    </h3>
  );
}

function FieldGuideCard({ guide }: { guide: FieldGuide }) {
  return (
    <Card>
      <CardContent className="space-y-2">
        <div className="flex items-center gap-2">
          <h4 className="font-semibold text-slate-900">{guide.field}</h4>
          <Badge variant={guide.optional ? "neutral" : "info"}>
            {guide.optional ? "Opcional" : "Obrigatório"}
          </Badge>
        </div>
        <p className="text-sm text-slate-600">
          <span className="font-medium text-slate-700">O que é: </span>
          {guide.what}
        </p>
        <p className="text-sm text-slate-600">
          <span className="font-medium text-slate-700">
            Por que a IA precisa:{" "}
          </span>
          {guide.why}
        </p>
        <div className="rounded-md bg-slate-50 px-3 py-2 text-sm text-slate-700">
          <span className="font-medium text-slate-500">Exemplo: </span>
          {guide.example}
        </div>
        {guide.tip && (
          <p className="text-sm text-brand-700">
            <span className="font-medium">Dica: </span>
            {guide.tip}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

export default function DocsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <header className="space-y-3">
        <h1 className="text-3xl font-bold text-slate-900">Documentação</h1>
        <p className="text-lg text-slate-600">
          Como funcionam o <strong>Spec-Driven Development</strong> e o{" "}
          <strong>Harness Engineering</strong> — e como preencher cada etapa do
          wizard para gerar specs e harness de qualidade.
        </p>
      </header>

      {/* Índice */}
      <nav className="mt-8 rounded-lg border border-slate-200 bg-white p-5">
        <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
          Índice
        </p>
        <ul className="space-y-1.5">
          {TOC.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                className="text-sm text-brand-700 hover:underline"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* ===== 1. SDD ===== */}
      <section className="mt-12 space-y-4">
        <H2 id="sdd">1. Spec-Driven Development (SDD)</H2>
        <p className="text-slate-600">
          A primeira coisa a entender é que SDD{" "}
          <strong>não é uma ferramenta de fazer — é uma metodologia de como
          fazer</strong>. Ele usa conceitos de engenharia de prompt para
          automatizar uma ideia bem antiga: desenvolver a partir de
          especificação. Lá atrás, no waterfall, planejava-se por meses e, quando
          os documentos ficavam prontos, já não faziam mais sentido. O SDD
          retoma essa estrutura, mas em formato de prompt organizado, para que os
          agentes de IA trabalhem de forma correta.
        </p>
        <p className="text-slate-600">
          O cenário típico: chega um ticket simplista, mal escrito, sem deixar
          claro o que deve e o que não deve ser entregue. Por exemplo — &quot;quero
          um header com opções de login e registro, o logo do lado, e isso tem
          que ficar no topo o tempo todo&quot;. Parece suficiente, mas não é. O SDD
          pega esse texto em língua natural e o transforma em artefatos
          estruturados, levantando justamente as perguntas que ninguém fez.
        </p>

        <H3 id="sdd-guardrails">1.1 O ponto central: guardrails</H3>
        <p className="text-slate-600">
          Esse é o ponto mais importante de todo o processo. Se você não dá um{" "}
          <em>guideline</em> ao agente — se não especifica os limites dentro dos
          quais ele pode atuar —, ele começa a alucinar: gera código, gera
          código, gera código, e aquilo vira uma bagunça. Você perde o controle,
          não entende mais para onde está indo e acaba com retrabalho.
        </p>
        <Card className="border-brand-200 bg-brand-50">
          <CardContent>
            <p className="text-sm text-brand-900">
              O agente precisa de um <strong>guard rail</strong>: &quot;você só pode
              ir até aqui, não faça isso, faça aquilo, escreva o código dessa
              forma&quot;. Sem esse limite, velocidade vira desordem.
            </p>
          </CardContent>
        </Card>
        <p className="text-slate-600">
          Esses limites são definidos numa <strong>constituição</strong> — o
          conjunto de regras não-negociáveis do projeto: testes antes da
          implementação, princípios SOLID, padrão de nomes de variáveis,
          &quot;importe o namespace primeiro e use só o nome do modelo no código&quot;, e
          assim por diante. É a constituição que delimita a atuação do agente
          durante todo o processo.
        </p>

        <H3 id="sdd-fluxo">1.2 O fluxo, fase a fase</H3>
        <p className="text-slate-600">
          O SDD organiza o trabalho em fases bem definidas, do alvo à
          implementação. Cada fase produz um artefato que você revisa antes de
          seguir:
        </p>
        <div className="grid gap-3">
          <Card>
            <CardContent>
              <h4 className="font-semibold text-slate-900">1. Constituição</h4>
              <p className="text-sm text-slate-600">
                Define os guardrails: padrão de projeto, cobertura de teste
                desejada, o que deve ou não ser feito. É a base de tudo.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <h4 className="font-semibold text-slate-900">2. Especificação</h4>
              <p className="text-sm text-slate-600">
                Você descreve o problema em linguagem natural e ele vira uma
                especificação estruturada — com definição, perguntas para tirar
                ambiguidades e histórias de usuário.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <h4 className="font-semibold text-slate-900">
                3. Clarificação <Badge variant="neutral">opcional</Badge>
              </h4>
              <p className="text-sm text-slate-600">
                Entre a especificação e o planejamento: remove ambiguidades e
                questiona pontos que não ficaram claros no documento.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <h4 className="font-semibold text-slate-900">4. Planejamento</h4>
              <p className="text-sm text-slate-600">
                Planejamento técnico: pesquisa no código, olha a estrutura do
                banco e racionaliza tudo a partir da especificação.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <h4 className="font-semibold text-slate-900">5. Tarefas</h4>
              <p className="text-sm text-slate-600">
                Gera a lista de tarefas separada por fases — literalmente o que o
                agente vai seguir em cada parte do desenvolvimento.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <h4 className="font-semibold text-slate-900">
                6. Análise <Badge variant="neutral">opcional</Badge>
              </h4>
              <p className="text-sm text-slate-600">
                Depois das tarefas: revisa todos os artefatos gerados em busca de
                inconsistências.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <h4 className="font-semibold text-slate-900">7. Implementação</h4>
              <p className="text-sm text-slate-600">
                Escreve o código propriamente dito — com migrations, factories,
                seeders e cobertura de testes de front e back.
              </p>
            </CardContent>
          </Card>
        </div>
        <p className="text-slate-600">
          O exemplo do header ilustra o valor disso: a especificação e a
          clarificação levantam coisas que não estavam no ticket original — o
          header em todas as páginas, o avatar e o nome do usuário logado, o
          logout num popover. Detalhes que só apareceriam (tarde) durante a
          implementação.
        </p>

        <H3 id="sdd-artefatos">1.3 Os artefatos em Markdown</H3>
        <p className="text-slate-600">
          Todos os artefatos são arquivos <strong>Markdown (.md)</strong> a
          partir de templates que o próprio agente preenche. A constituição
          guarda o que não é negociável; a especificação descreve o problema e as
          histórias; o plano estrutura a execução; as tasks listam o trabalho. É
          esse mesmo conjunto que este site gera (spec.md, requirements.md,
          design.md, tasks.md) na etapa de specs.
        </p>

        <H3 id="sdd-papel">1.4 De escrevedor de código a analista</H3>
        <p className="text-slate-600">
          A parte mecânica é delegada à IA. Escrever um TDD para uma classe de
          serviço com 10 métodos poderia levar 3 ou 4 horas; a partir dos
          artefatos estruturados, isso sai em um minuto. O seu tempo migra para o
          que importa:
        </p>
        <Card className="border-brand-200 bg-brand-50">
          <CardContent>
            <p className="text-sm text-brand-900">
              Você deixa de ser apenas um <strong>escrevedor de código</strong>{" "}
              para virar um <strong>analista de sistemas</strong>: revisa a
              especificação, o plano e as tasks, define o padrão de projeto,
              escolhe a melhor saída para o problema e questiona quem abriu o
              ticket sobre o que ele não pensou.
            </p>
          </CardContent>
        </Card>
        <p className="text-slate-600">
          Isso também encurta o loop de feedback: em vez de implementar e só
          depois descobrir, com o PO/PM ou com o time de testes, que estava
          errado (o famoso vai-e-volta que custa caro), você valida a{" "}
          <em>especificação</em> antes de escrever o código. O problema é
          resolvido na fase certa — a de especificação. Uma dica prática de quem
          usa: modelos &quot;de pensamento&quot; (ex: Claude Opus) para
          especificação, planejamento e pesquisa no código; modelos mais rápidos
          (ex: Claude Sonnet) para escrever o código.
        </p>

        <H3 id="sdd-limites">1.5 Onde o SDD chega ao limite</H3>
        <p className="text-slate-600">
          A spec e a constituição dizem ao agente <em>para onde ir</em> e{" "}
          <em>o que evitar</em> — mas, conforme o projeto cresce, surgem lacunas
          que documentos sozinhos não cobrem: o agente pode desviar mesmo com as
          regras escritas, não há <strong>feedback contínuo</strong> e os limites
          não se aplicam de forma automática a cada mudança.
        </p>
        <Card className="border-brand-200 bg-brand-50">
          <CardContent>
            <p className="text-sm text-brand-900">
              É esse o ponto de partida do Harness Engineering: quando a spec
              sozinha não basta, você adiciona{" "}
              <strong>estrutura de controle</strong> ao redor do agente. SDD
              define o alvo; o harness garante que o caminho seja respeitado.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* ===== 2. HARNESS ===== */}
      <section className="mt-12 space-y-4">
        <H2 id="harness">2. Harness Engineering</H2>
        <p className="text-slate-600">
          Imagine a cena: você dá um prompt para um agente — &quot;construa uma
          aplicação full stack com autenticação, dashboard e integração com
          Stripe&quot;. O agente sai gerando código por 40 minutos. No fim, você abre
          um diff de 3.000 linhas: metade funciona, metade não compila, tem
          feature duplicada, ele sobrescreveu um teste, deletou outro, declarou
          tudo pronto — e gastou um monte de token.
        </p>
        <p className="text-slate-600">
          Isso <strong>não é um bug do modelo</strong>. Os modelos de hoje são
          muito capazes. O problema é que ninguém ensinou o agente{" "}
          <em>como trabalhar</em>. A OpenAI gerou 1 milhão de linhas sem nenhuma
          escrita por humano, e funcionou; a Anthropic fez agentes construírem
          apps inteiros em sessões de dias. A diferença entre o que elas fazem e o
          que a maioria de nós faz tem nome: <strong>Harness Engineering</strong>.
        </p>

        <H3 id="harness-oque">2.1 O que é (e por que agora)</H3>
        <p className="text-slate-600">
          O <strong>modelo</strong> é a LLM (Claude, GPT-5, o que for). O{" "}
          <strong>harness</strong> é todo o resto ao redor: as instruções, a
          estrutura do repositório, os linters, os testes, os arquivos de
          progresso, os scripts de setup — o ambiente operacional que envolve o
          modelo.
        </p>
        <Card className="border-brand-200 bg-brand-50">
          <CardContent>
            <p className="text-sm text-brand-900">
              Pense no modelo como um engenheiro brilhante recém-contratado.
              Capaz de escrever qualquer coisa — mas, largado num repositório sem
              README, sem arquitetura documentada, sem CI e sem testes, vai fazer
              bobagem. Não por ser burro, mas por não ter <strong>contexto</strong>.
              O harness é o <strong>onboarding</strong> desse engenheiro: o que
              transforma um modelo poderoso em um agente confiável.
            </p>
          </CardContent>
        </Card>
        <p className="text-slate-600">
          O tema explodiu no início de 2026 com posts da OpenAI, da Anthropic e do
          blog do Martin Fowler. A conclusão de todos é a mesma: o gargalo não é
          mais a inteligência do modelo — é a <strong>qualidade do ambiente</strong>{" "}
          onde ele opera. O harness reúne <em>feed forward</em> (guias, arquivos
          Markdown), <em>sensores</em> (o que dá feedback ao agente), além de{" "}
          <strong>memória</strong> e <strong>bootstrap</strong>.
        </p>

        <H3 id="harness-controle">2.2 Feed forward e feedback</H3>
        <p className="text-slate-600">
          A base vem da engenharia de controle: há dois jeitos de controlar um
          sistema.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <Card>
            <CardContent>
              <h4 className="font-semibold text-slate-900">
                Feed forward (preventivo)
              </h4>
              <p className="text-sm text-slate-600">
                Instruções <em>antes</em> da execução para aumentar a chance de
                dar certo: a spec, o AGENTS.md, as regras de arquitetura, as
                skills — tudo que orienta o agente antes de escrever uma linha.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <h4 className="font-semibold text-slate-900">
                Feedback (corretivo)
              </h4>
              <p className="text-sm text-slate-600">
                Observar o resultado <em>depois</em> e corrigir o que saiu errado:
                os sensores — linters, testes, type checkers, agente revisor —
                tudo que detecta erro e permite autocorreção.
              </p>
            </CardContent>
          </Card>
        </div>
        <Card className="border-brand-200 bg-brand-50">
          <CardContent>
            <p className="text-sm text-brand-900">
              É como o GPS do carro: <strong>feed forward</strong> é a rota
              traçada antes de sair; <strong>feedback</strong> é detectar que você
              saiu dela e recalcular em tempo real. Só com a rota, você se perde no
              primeiro erro; só com o recálculo, você anda sem direção. Precisa dos
              dois. Por isso a spec é <strong>feed forward puro</strong>: diz o que
              fazer, mas não verifica se foi feito do jeito certo.
            </p>
          </CardContent>
        </Card>

        <H3 id="harness-falhas">2.3 Como agentes falham sem harness</H3>
        <p className="text-slate-600">
          A Anthropic documentou padrões de falha previsíveis de agentes rodando
          sem harness:
        </p>
        <ul className="space-y-2.5 text-sm text-slate-600">
          <li>
            <strong>One-shot hero.</strong> Tenta implementar o app inteiro de uma
            vez, estoura a janela de contexto no meio e deixa features pela
            metade. <span className="text-slate-400">(SDD ajuda: planeja e quebra em tasks.)</span>
          </li>
          <li>
            <strong>Vitória prematura.</strong> Declara &quot;isso já está pronto&quot;
            quando não está — se perde num contexto enorme.{" "}
            <span className="text-slate-400">(SDD ajuda: define o que &quot;pronto&quot; significa.)</span>
          </li>
          <li>
            <strong>Amnésia entre sessões.</strong> Cada sessão começa do zero, sem
            memória do que veio antes; o agente gasta metade dos tokens só
            entendendo o estado atual. Exige progress files, disciplina de git e
            scripts de bootstrap que reconstroem o contexto.
          </li>
          <li>
            <strong>Falso &quot;concluído&quot;.</strong> Marca a feature como pronta sem
            testar de verdade — roda um curl, vê um 200 e segue. O que{" "}
            <em>força</em> não é a instrução, são os <strong>sensores</strong> (que
            retornam 0/1): o agente não pode ser o juiz, senão acha que está bom o
            suficiente sem rodar o teste.
          </li>
          <li>
            <strong>Um único processo.</strong> Um só agente implementa e julga. O
            caminho é separar: um processo orquestrador inicia um agente para{" "}
            <em>implementar</em> e outro, separado, para <em>validar</em> — missões
            diferentes. Quem recebe a missão de implementar faz de tudo para isso
            (até deletar código); quem recebe a de validar, idem.
          </li>
          <li>
            <strong>Slop acumulado.</strong> O código compila, mas viola a
            arquitetura, duplica lógica e não passa nos testes — e cada sessão
            piora. Perdendo 5% de qualidade por feature, um sistema inteiro termina
            horrível. O harness garante manter a qualidade a cada interação.
          </li>
        </ul>

        <H3 id="harness-juntos">2.4 SDD é metade do harness</H3>
        <p className="text-slate-600">
          Spec-Driven Development <strong>é um tipo de harness</strong> — e cobre
          boa parte do feed forward: planeja, quebra em tasks e define o que
          &quot;pronto&quot; significa. Isso já torna possível construir{" "}
          <em>funcionalidades inteiras</em> hoje. Mas, para construir{" "}
          <em>sistemas inteiros</em> de forma autônoma, faltam as outras peças:
          sensores que forçam (não só descrevem), memória entre sessões e a
          separação entre quem implementa e quem valida.
        </p>
        <Card className="border-brand-200 bg-brand-50">
          <CardContent>
            <p className="text-sm text-brand-900">
              Se você já usa SDD, parabéns — você já tem metade do harness. A outra
              metade são os sensores e a orquestração que garantem que o caminho
              foi de fato respeitado.
            </p>
          </CardContent>
        </Card>

        <H3 id="harness-pratica">2.5 O fundamento na prática</H3>
        <p className="text-slate-600">
          Na prática, um harness construído sobre SDD adiciona:
        </p>
        <ul className="list-disc space-y-1.5 pl-5 text-slate-600">
          <li>
            <strong>Progress files</strong> que guardam o estado entre sprints
            (grupos de tasks), marcando o que foi concluído e registrando um log.
          </li>
          <li>
            <strong>Contratos</strong> entre o agente que desenvolve e o que testa:
            no planejamento, o implementador lista o que vai fazer e o avaliador
            confirma que a lista bate com a spec — depois testa item a item, sem
            deixar nada escapar (e sem inventar trabalho fora do combinado).
          </li>
          <li>
            <strong>Orquestração com autocorreção</strong>: implementa → valida; se
            falhar, o orquestrador reinicia a construção para corrigir, até passar.
          </li>
          <li>
            <strong>Evaluation/QA dinâmica</strong>: testes de unidade, integração,
            Playwright — o que fizer sentido — com um score e um mínimo para passar.
          </li>
        </ul>
        <Card className="border-brand-200 bg-brand-50">
          <CardContent>
            <p className="text-sm text-brand-900">
              O fundamento do Harness Engineering: um agente que implementa e outro
              que valida; todo o contexto e a documentação garantindo que a
              implementação vá no caminho certo; e sinais (guard rails) rodando do
              outro lado para garantir que tudo passa — sem deixar o julgamento só
              na mão da gente.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <p className="text-sm text-slate-600">
              <strong>Como este site se encaixa:</strong> ele gera o ponto de
              partida do harness. Nas etapas 1–5 monta os specs (SDD) — com uma
              fase de <strong>clarificação</strong> em que a IA levanta as
              ambiguidades antes de gerar. Na etapa 6 gera os guias e sensores
              (CLAUDE.md; um <strong>AGENTS.md</strong> com os papéis separados de
              implementador e validador; configs de lint; hooks/CI; testes
              estruturais) e ainda <strong>memória/bootstrap</strong> (um{" "}
              <code>PROGRESS.md</code> e um script de bootstrap). Também há uma{" "}
              <strong>análise de consistência</strong> opcional que cruza specs ×
              harness. O que fica para o seu repositório é o passo de{" "}
              <em>execução</em>: rodar de fato esses sensores e operar a
              orquestração multi-agente (implementador × validador) em tempo de
              desenvolvimento.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* ===== 3. WIZARD ===== */}
      <section className="mt-12 space-y-6">
        <H2 id="wizard">3. Guia do wizard, campo a campo</H2>
        <p className="text-slate-600">
          A qualidade do output depende do que você informa. Abaixo, cada campo
          do wizard: o que é, por que a IA precisa dele, um exemplo bom e uma
          dica. Campos opcionais melhoram bastante o resultado — preencha o que
          fizer sentido.
        </p>

        {WIZARD_GUIDE.map((step) => (
          <div key={step.step} className="space-y-3">
            <H3 id={step.anchor}>{step.title}</H3>
            <p className="text-slate-600">{step.intro}</p>
            <div className="grid gap-3">
              {step.fields.map((field) => (
                <FieldGuideCard key={field.field} guide={field} />
              ))}
            </div>
          </div>
        ))}

        <div className="space-y-3">
          <H3 id="wizard-topicos">Tópicos adicionais</H3>
          <p className="text-slate-600">
            No final (etapa de review), você pode criar tópicos livres para tudo
            que não coube nos campos padrão.
          </p>
          <FieldGuideCard guide={CUSTOM_TOPICS_GUIDE} />
        </div>

        <div className="space-y-3">
          <H3 id="wizard-geracao">Etapas 5 a 7 — Clarificar, gerar e baixar</H3>
          <p className="text-slate-600">
            Na etapa 5 você revisa o resumo e, antes de gerar, pode usar a{" "}
            <strong>clarificação</strong>: a IA levanta as perguntas que
            provavelmente ficaram em aberto e você responde — exatamente a fase de{" "}
            <em>clarify</em> do SDD. Em seguida <strong>gera os specs</strong>{" "}
            (pode levar vários minutos). Na etapa 6, <strong>gera o harness</strong>{" "}
            a partir dos specs aprovados e pode rodar a{" "}
            <strong>análise de consistência</strong> (cruza specs × harness e
            aponta divergências). Por fim, na etapa 7, <strong>baixa um .zip</strong>{" "}
            com toda a estrutura pronta. Você pode <em>regenerar</em> em qualquer
            etapa se não gostar do resultado.
          </p>
          <Card className="border-brand-200 bg-brand-50">
            <CardContent>
              <p className="text-sm text-brand-900">
                As gerações usam a <strong>sua própria chave da Anthropic</strong>{" "}
                (BYOK), configurada em <strong>Configurações</strong> — ela fica
                só no seu navegador. O SpecForge é sem login e não guarda nada nos
                servidores: você gera e baixa o .zip.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* ===== 4. COMO USAR ===== */}
      <section className="mt-12 space-y-4">
        <H2 id="usar">4. Como usar as specs geradas</H2>
        <p className="text-slate-600">
          O <code>.zip</code> traz os specs e o harness numa estrutura pronta
          para o seu repositório. A ideia é que o seu agente de IA trabalhe a
          partir desses arquivos:
        </p>
        <Card>
          <CardContent>
            <pre className="overflow-auto text-xs text-slate-700">{`seu-projeto/
├─ specs/001-<projeto>/
│  ├─ spec.md  requirements.md  design.md  tasks.md
├─ CLAUDE.md          # guia principal (regras, o que NÃO fazer)
├─ AGENTS.md          # papéis: implementador e validador
├─ PROGRESS.md        # memória entre sessões
├─ .github/workflows/ci.yml   # sensores no CI
├─ .eslintrc / .prettierrc ...  # sensores de estilo
└─ scripts/bootstrap.*         # reconstrói o contexto`}</pre>
          </CardContent>
        </Card>
        <ol className="list-decimal space-y-2.5 pl-5 text-slate-600">
          <li>
            <strong>Extraia o zip</strong> na raiz do repositório (existente ou
            novo).
          </li>
          <li>
            <strong>Rode o bootstrap</strong> (<code>scripts/bootstrap.*</code>):
            instala dependências e prepara o ambiente.
          </li>
          <li>
            <strong>Aponte seu agente</strong> (Claude Code, Cursor, Copilot)
            para o <code>CLAUDE.md</code> e o <code>AGENTS.md</code> — são os
            guias que ele deve seguir.
          </li>
          <li>
            <strong>Implemente task a task</strong> pelo <code>tasks.md</code>,
            com o agente sempre olhando para os specs como referência.
          </li>
          <li>
            <strong>Deixe os sensores validarem</strong> cada mudança: lint,
            type-check, testes e o CI. Eles falham rápido quando algo sai do
            esperado.
          </li>
          <li>
            <strong>Atualize o <code>PROGRESS.md</code></strong> ao fim de cada
            sessão — é a memória que evita o agente começar do zero na próxima.
          </li>
          <li>
            <em>(Opcional)</em> monte a orquestração{" "}
            <strong>implementador × validador</strong> do <code>AGENTS.md</code>{" "}
            no seu fluxo, para autocorreção.
          </li>
        </ol>
        <Card className="border-brand-200 bg-brand-50">
          <CardContent>
            <p className="text-sm text-brand-900">
              A spec é a <strong>fonte da verdade</strong>: revise-a antes de
              deixar o agente codar. Se algo estiver fora, ajuste no SpecForge e
              regenere — é mais barato corrigir o documento do que o código.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* ===== 5. MODELO ===== */}
      <section className="mt-12 space-y-4">
        <H2 id="modelo">5. Modelo e configuração da geração</H2>
        <p className="text-slate-600">
          O SpecForge gera tudo com o <strong>Claude Opus 4.8</strong> da
          Anthropic — o modelo de raciocínio mais capaz para a parte de
          &quot;pensar&quot;: especificação, planejamento e análise. O mesmo modelo é
          usado em todas as etapas (clarificação, specs, harness e análise).
        </p>
        <Card>
          <CardContent className="space-y-2 text-sm text-slate-700">
            <div className="flex justify-between border-b border-slate-100 py-1.5">
              <span className="font-medium text-slate-500">Modelo</span>
              <span className="font-mono">claude-opus-4-8</span>
            </div>
            <div className="flex justify-between border-b border-slate-100 py-1.5">
              <span className="font-medium text-slate-500">
                max_tokens (specs / harness)
              </span>
              <span className="font-mono">16.000</span>
            </div>
            <div className="flex justify-between border-b border-slate-100 py-1.5">
              <span className="font-medium text-slate-500">
                max_tokens (clarify / analyze)
              </span>
              <span className="font-mono">1.500 / 2.000</span>
            </div>
            <div className="flex justify-between border-b border-slate-100 py-1.5">
              <span className="font-medium text-slate-500">temperature</span>
              <span className="font-mono">— (não enviado)</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="font-medium text-slate-500">formato de saída</span>
              <span className="font-mono">JSON → File[]</span>
            </div>
          </CardContent>
        </Card>
        <ul className="list-disc space-y-1.5 pl-5 text-slate-600">
          <li>
            <strong>Sem <code>temperature</code>:</strong> o Opus 4.8 não aceita
            esse parâmetro — a saída fica mais consistente e determinística.
          </li>
          <li>
            <strong>max_tokens alto nos specs/harness:</strong> os quatro
            arquivos em markdown completo são longos; a margem evita truncar o
            JSON.
          </li>
          <li>
            <strong>BYOK:</strong> a geração usa a <em>sua</em> chave da Anthropic
            — você paga os tokens diretamente à Anthropic. O modelo é fixo (não
            selecionável no momento).
          </li>
        </ul>
      </section>

      {/* ===== 6. EXEMPLOS ===== */}
      <section className="mt-12 space-y-4">
        <H2 id="exemplos">6. Exemplos de output</H2>
        <p className="text-slate-600">
          Um recorte do que é gerado para uma API de pagamentos Pix — specs (SDD)
          e harness lado a lado:
        </p>
        <FilePreview files={EXAMPLE_FILES} />
      </section>

      {/* CTA */}
      <section className="mt-12 rounded-lg border border-slate-200 bg-white p-6 text-center">
        <h2 className="text-xl font-semibold text-slate-900">
          Pronto para gerar o seu?
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Leva alguns minutos. Você revisa tudo antes de baixar.
        </p>
        <div className="mt-4">
          <Link href="/new">
            <Button size="lg">Começar o wizard</Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
