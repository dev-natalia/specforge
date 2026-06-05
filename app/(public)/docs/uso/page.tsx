import { DocTitle, Lead, H2, P, Callout, CodeBlock } from "@/components/docs/primitives";
import { Card, CardContent } from "@/components/ui/Card";

// Comparativo dos três scopes (Progressive Specification).
const SCOPES: {
  name: string;
  tag: string;
  what: string;
  questions: string;
  outputs: string;
}[] = [
  {
    name: "Story",
    tag: "⚡ pequeno",
    what: "Tarefa pequena e localizada: um botão, uma validação, um bug.",
    questions: "0–5 perguntas · confiança 80%",
    outputs: "Story Spec (documento único) · Tasks · Harness leve",
  },
  {
    name: "Feature",
    tag: "🔧 médio",
    what: "Nova capacidade num sistema existente: autenticação, notificações, relatórios.",
    questions: "3–10 perguntas · confiança 85%",
    outputs: "Feature Spec (com design + contratos) · Tasks · Harness de integração",
  },
  {
    name: "Product",
    tag: "🏗 grande",
    what: "Sistema completo ou iniciativa de grande porte: CRM, marketplace, ERP.",
    questions: "10–30 perguntas · confiança 90%",
    outputs: "Conhecimento + 7 specs em cascata · Tasks · Harness de governança",
  },
];

const STEPS: { n: string; title: string; body: string }[] = [
  {
    n: "1",
    title: "Crie um projeto",
    body: "O projeto é um container. Ele guarda uma ou mais iniciativas e todo o conhecimento que você acumula — tudo local-first, no seu navegador.",
  },
  {
    n: "2",
    title: "Crie uma iniciativa",
    body: "Descreva o que você quer construir em linguagem natural. Cada iniciativa é uma unidade de trabalho com seu próprio scope e seus próprios artefatos.",
  },
  {
    n: "3",
    title: "Defina o scope",
    body: "Clique em \"Sugerir scope com IA\": ela recomenda Story, Feature ou Product com confiança e os sinais que detectou. Você confirma ou troca — a escolha é sempre sua.",
  },
  {
    n: "4",
    title: "Clarifique",
    body: "A IA levanta as perguntas que faltam, em quantidade proporcional ao scope (uma Story recebe poucas; um Product, muitas). Cada resposta vira conhecimento durável.",
  },
  {
    n: "5",
    title: "Gere",
    body: "Use \"Gerar tudo do scope\" para rodar o pipeline inteiro numa ação (specs → harness → tasks → artefatos), acompanhando a timeline ao vivo. Ou gere item a item.",
  },
  {
    n: "6",
    title: "Reavalie o scope (se preciso)",
    body: "Se a clarificação revelar que o problema é maior ou menor que o esperado, \"Reavaliar scope\" sugere escalar ou reduzir — com explicação, nunca em silêncio. O conhecimento é preservado.",
  },
  {
    n: "7",
    title: "Revise e exporte",
    body: "Confira o painel de atividade e a validação (rastreabilidade íntegra), e exporte o .zip com as specs, o harness e os artefatos por provider (CLAUDE.md, .cursor/rules…).",
  },
];

export default function UsoPage() {
  return (
    <>
      <DocTitle>Guia de uso</DocTitle>
      <Lead>
        O SpecForge adapta o processo ao tamanho do problema. Você não é obrigado a
        criar um produto inteiro para adicionar um botão — nem a tratar um produto
        como se fosse uma tarefa simples. Esse é o princípio do{" "}
        <strong>Progressive Specification</strong>: o processo certo para o problema
        certo.
      </Lead>

      <H2 id="escala">1. Escolha a escala do problema</H2>
      <P>
        Toda iniciativa pertence a um de três níveis de scope. O scope governa quantas
        perguntas a IA faz, quais artefatos são gerados e quão rigoroso é o harness.
      </P>
      <div className="grid gap-3">
        {SCOPES.map((s) => (
          <Card key={s.name}>
            <CardContent>
              <div className="flex flex-wrap items-baseline gap-2">
                <h3 className="font-semibold text-slate-900">{s.name}</h3>
                <span className="text-xs text-slate-400">{s.tag}</span>
              </div>
              <p className="mt-1 text-sm text-slate-600">{s.what}</p>
              <p className="mt-2 text-xs text-slate-500">
                <strong>Clarificação:</strong> {s.questions}
              </p>
              <p className="text-xs text-slate-500">
                <strong>Gera:</strong> {s.outputs}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
      <Callout>
        Classifique o <strong>problema</strong>, não o tamanho do texto. &quot;Criar um
        CRM&quot; é curto e é Product; &quot;adicionar um botão que exporta os
        resultados filtrados em CSV&quot; é longo e é Story.
      </Callout>

      <H2 id="fluxo">2. O fluxo, passo a passo</H2>
      <P>
        Independentemente do scope, a jornada é a mesma — só a profundidade muda. Da
        ideia ao plano de implementação:
      </P>
      <div className="grid gap-3">
        {STEPS.map((s) => (
          <Card key={s.n}>
            <CardContent>
              <div className="flex items-start gap-3">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-700">
                  {s.n}
                </span>
                <div>
                  <h3 className="font-semibold text-slate-900">{s.title}</h3>
                  <p className="text-sm text-slate-600">{s.body}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <H2 id="artefatos">3. O que cada scope gera</H2>
      <P>
        Uma matriz de artefatos garante que nada é gerado em excesso. O que é{" "}
        <em>proibido</em> num scope nem aparece como opção — uma Story não recebe
        especificação de arquitetura ou segurança.
      </P>
      <CodeBlock>{`Artefato            Story     Feature    Product
─────────────────────────────────────────────────
Especificação       Story     Feature    7 specs em
                    Spec      Spec       cascata
Design                 –      (na spec)  Design Spec
Arquitetura            ✗      opcional   Architecture
Contratos              ✗      (na spec)  Contracts
Segurança              ✗      opcional   Security
Testes              básico    padrão     completo
Tasks                  ✓         ✓          ✓
Harness             6 cam.    8 cam.     9 camadas`}</CodeBlock>
      <Callout tone="slate">
        Em Story e Feature, a especificação é um <strong>documento único
        consolidado</strong> (a Feature Spec já inclui as seções de design e
        contratos). Em Product, roda a cascata completa de 7 specs por-tipo — o
        processo original do SpecForge, preservado integralmente.
      </Callout>

      <H2 id="escalar">4. Escalar e reduzir</H2>
      <P>
        Trabalho de engenharia evolve. O que começa como Story pode virar Feature; o
        que parecia Product pode ser só uma Story. O botão{" "}
        <strong>Reavaliar scope</strong> reclassifica a iniciativa com o conhecimento
        já acumulado e sugere a mudança:
      </P>
      <CodeBlock>{`"Adicionar autenticação"   →  Story
  ↓ clarificação revela OAuth, papéis, sessões
Recomendação: escalar  →  Feature   (você confirma)

"Construir plataforma de relatórios"  →  Product
  ↓ clarificação revela: um relatório, uma tela
Recomendação: reduzir  →  Story      (você confirma)`}</CodeBlock>
      <P>
        A mudança nunca é silenciosa, e <strong>nenhum conhecimento é perdido</strong>:
        o histórico de scope fica registrado na iniciativa.
      </P>

      <Callout>
        Tudo roda <strong>no seu navegador</strong>, local-first: o conhecimento
        persiste no IndexedDB e a geração é uma chamada direta à Anthropic com a sua
        chave (BYOK). Recarregar a página não perde nada.
      </Callout>
    </>
  );
}
