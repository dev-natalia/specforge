import { DocTitle, Lead, H2, P, Callout, CodeBlock } from "@/components/docs/primitives";
import { Card, CardContent } from "@/components/ui/Card";

const STAGES: { n: string; title: string; body: string }[] = [
  { n: "1", title: "Captura de intenção", body: "Você descreve o que quer construir, em linguagem natural. Entrada bruta, ainda não estruturada." },
  { n: "2", title: "Scope", body: "A IA sugere o scope (Story, Feature ou Product); você confirma. Ele define a profundidade do processo." },
  { n: "3", title: "Clarificação", body: "A IA detecta lacunas e ambiguidades e levanta perguntas — em quantidade proporcional ao scope." },
  { n: "4", title: "Conhecimento", body: "Respostas e descrição viram descobertas, decisões, DNA do Produto e restrições — a fonte de verdade." },
  { n: "5", title: "Specs", body: "O conhecimento gera as specs — documento consolidado (Story/Feature) ou cascata por-tipo (Product) — rastreáveis às origens." },
  { n: "6", title: "Harness", body: "As specs viram o ambiente operacional do agente (camadas progressivas + agent rules)." },
  { n: "7", title: "Tasks", body: "As specs viram um grafo de tarefas executáveis com dependências e critérios de aceite." },
  { n: "8", title: "Exportar", body: "O harness é traduzido para CLAUDE.md, .cursor/rules, GPT e Gemini, e tudo sai num .zip (com specforge.json para reimportar)." },
];

export default function FlowPage() {
  return (
    <>
      <DocTitle>Fluxo &amp; ciclo de vida</DocTitle>
      <Lead>
        O conhecimento não nasce pronto: ele evolui por estágios, ficando mais
        claro, durável e rastreável a cada passo.
      </Lead>

      <H2 id="ciclo">Ciclo de vida do conhecimento</H2>
      <P>
        Informação temporária deve virar entendimento permanente. Quanto mais longe
        avança no ciclo, mais valiosa ela se torna:
      </P>
      <CodeBlock>{`Conversa
  → Observação
    → Discovery        (o que aprendemos?)
      → Decisão        (o que escolhemos e por quê?)
        → Conhecimento (entendimento conectado)
          → Context Package (o que a IA precisa saber?)
            → Harness  (como a IA deve agir?)
              → Implementação
                → Feedback → (novo conhecimento)`}</CodeBlock>
      <Callout>
        O loop nunca fecha de vez: a implementação gera feedback, que gera novas
        observações, discoveries e decisões. O valor do SpecForge cresce conforme o
        conhecimento se acumula.
      </Callout>

      <H2 id="pipeline">O pipeline de geração (8 estágios)</H2>
      <P>
        No app, esse ciclo é operacionalizado por um pipeline determinístico. Cada
        estágio consome a saída do anterior e passa por um quality gate — geração
        sem validação é proibida.
      </P>
      <Callout>
        O pipeline é <strong>adaptativo</strong>: o scope define quanto dele roda. Uma
        Story pula descoberta profunda, arquitetura e segurança; um Product roda tudo.
        É o <strong>Progressive Specification</strong> — veja o Guia de uso e os Casos
        de uso para o passo a passo por scope.
      </Callout>
      <div className="grid gap-3">
        {STAGES.map((s) => (
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

      <Callout tone="slate">
        Tudo isso roda <strong>no seu navegador</strong>, local-first: o
        conhecimento persiste no IndexedDB e a geração é uma chamada direta à
        Anthropic com a sua chave (BYOK).
      </Callout>
    </>
  );
}
