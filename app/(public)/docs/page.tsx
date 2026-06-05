import Link from "next/link";
import { DocTitle, Lead, H2, P, Callout, CodeBlock } from "@/components/docs/primitives";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

const IS = [
  "Um sistema de preservação de conhecimento",
  "Um gerador de specs (derivadas do conhecimento)",
  "Um gerador de contexto para IA",
  "Um gerador de harness (ambiente operacional do agente)",
  "Uma ponte entre conhecimento humano e implementação por IA",
];

const IS_NOT = [
  "Um gerador de código",
  "Uma plataforma de gestão de projetos / tickets",
  "Um wiki de documentação",
  "Uma dependência SaaS hospedada",
  "Um substituto do julgamento humano",
];

export default function DocsOverviewPage() {
  return (
    <>
      <DocTitle>O que é o SpecForge</DocTitle>
      <Lead>
        O SpecForge é um sistema <strong>Knowledge First</strong> para
        desenvolvimento de software com IA. Ele preserva o conhecimento do seu
        projeto e o transforma no contexto que a IA precisa para gerar código de
        qualidade de forma consistente.
      </Lead>

      <Callout>
        O objetivo não é gerar código. É gerar o <strong>contexto</strong> que
        faz sistemas de IA gerarem bom código de forma previsível. Código é um
        artefato derivado; conhecimento é o ativo.
      </Callout>

      <H2 id="problema">O problema</H2>
      <P>
        Ferramentas de IA aceleram muito o desenvolvimento, mas a maioria dos devs
        interage com a IA por prompts isolados:{" "}
        <em>ideia → prompt → IA → código</em>. Funciona para tarefas pequenas. À
        medida que o projeto cresce, surgem problemas sérios:
      </P>
      <ul className="list-disc space-y-1.5 pl-5 text-slate-600">
        <li>
          <strong>Perda de contexto</strong> — decisões ficam soterradas no
          histórico de chat; semanas depois ninguém lembra o porquê.
        </li>
        <li>
          <strong>Saídas inconsistentes</strong> — prompts diferentes produzem
          arquiteturas diferentes; a IA não tem um entendimento estável do projeto.
        </li>
        <li>
          <strong>Deriva de arquitetura</strong> — sem fonte de verdade, o projeto
          perde coerência aos poucos.
        </li>
        <li>
          <strong>Explicações repetidas</strong> — você reexplica os mesmos
          conceitos a cada nova sessão.
        </li>
      </ul>
      <Callout tone="slate">
        O gargalo do desenvolvimento com IA não é mais a inteligência do modelo —
        é a <strong>qualidade do contexto</strong> entregue a ele. Melhor contexto
        produz melhores resultados.
      </Callout>

      <H2 id="solucao">A solução</H2>
      <P>
        Em vez de <em>ideia → prompt → código</em>, o SpecForge propõe um fluxo em
        que o conhecimento é o ativo primário e tudo o mais é derivado dele:
      </P>
      <CodeBlock>{`Ideia → Conhecimento → Specs → Harness → IA → Código`}</CodeBlock>
      <P>
        O conhecimento (discoveries, decisões, Product DNA, constraints) vira a
        fonte de verdade. Specs, harness e tasks são artefatos derivados e
        rastreáveis. Cada decisão de implementação consegue ser explicada de volta
        ao conhecimento que a originou.
      </P>

      <H2 id="e">O que o SpecForge é</H2>
      <div className="grid gap-3 sm:grid-cols-2">
        <Card>
          <CardContent>
            <p className="mb-2 text-sm font-semibold text-green-700">É</p>
            <ul className="space-y-1.5 text-sm text-slate-600">
              {IS.map((x) => (
                <li key={x}>✓ {x}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <p className="mb-2 text-sm font-semibold text-red-700">Não é</p>
            <ul className="space-y-1.5 text-sm text-slate-600">
              {IS_NOT.map((x) => (
                <li key={x}>✕ {x}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <H2 id="comecar">Por onde começar</H2>
      <P>
        Se você quer pôr a mão na massa, vá direto ao{" "}
        <strong>Guia de uso</strong> — o passo a passo do sistema — e aos{" "}
        <strong>Casos de uso</strong>, com três exemplos completos (Story, Feature e
        Produto). Para entender o que guia o produto, comece pelos Princípios.
      </P>
      <div className="flex flex-wrap gap-3">
        <Link href="/docs/uso">
          <Button>Guia de uso</Button>
        </Link>
        <Link href="/docs/casos">
          <Button variant="outline">Casos de uso</Button>
        </Link>
        <Link href="/projects">
          <Button variant="outline">Abrir o workspace</Button>
        </Link>
      </div>
    </>
  );
}
