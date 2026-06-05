import { DocTitle, Lead, H2, P, Callout, CodeBlock } from "@/components/docs/primitives";
import { Card, CardContent } from "@/components/ui/Card";

const STAGES: { n: string; title: string; body: string }[] = [
  { n: "1", title: "Captura de intenção", body: "Você descreve o projeto em linguagem natural. Entrada bruta, ainda não estruturada." },
  { n: "2", title: "Clarificação", body: "A IA detecta lacunas, ambiguidades e contradições e levanta perguntas priorizadas." },
  { n: "3", title: "Conhecimento", body: "Respostas e descrição viram discoveries, decisões, Product DNA e constraints — a fonte de verdade." },
  { n: "4", title: "Specs", body: "O conhecimento gera as 7 specs em cascata, cada uma rastreável às origens." },
  { n: "5", title: "Harness", body: "As specs viram o ambiente operacional do agente (camadas + agent rules)." },
  { n: "6", title: "Tasks", body: "As specs viram um grafo de tasks executáveis com dependências e critérios de aceite." },
  { n: "7", title: "Adaptação de provider", body: "O harness é traduzido para CLAUDE.md, .cursor/rules, GPT e Gemini." },
  { n: "8", title: "Entrega", body: "Tudo é exportado num .zip (com specforge.json para reimportar)." },
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
