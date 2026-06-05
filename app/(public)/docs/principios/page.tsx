import { DocTitle, Lead, H2, P, Callout } from "@/components/docs/primitives";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

const PRINCIPLES: { n: string; title: string; body: string }[] = [
  { n: "01", title: "Knowledge First", body: "Conhecimento é o ativo primário. Tudo o mais deriva dele. Se uma feature melhora specs mas enfraquece a preservação de conhecimento, ela é rejeitada." },
  { n: "02", title: "Preservar Racional", body: "Uma decisão sem racional é incompleta. Preserve contexto, alternativas, tradeoffs e o porquê — não só o que foi decidido." },
  { n: "03", title: "Contexto Durável", body: "Contexto deve sobreviver às conversas. Nenhum conhecimento crítico deve existir apenas no histórico de chat." },
  { n: "04", title: "Provider Agnóstico", body: "Conhecimento deve sobreviver à troca de provider de IA. Os artefatos permanecem úteis se você muda de agente." },
  { n: "05", title: "Local First", body: "Projetos pertencem aos usuários. Features que exigem propriedade centralizada são fortemente escrutinadas." },
  { n: "06", title: "Transparência", body: "Saídas geradas devem ser compreensíveis. Evite geração caixa-preta." },
  { n: "07", title: "Rastreabilidade", body: "Todo artefato importante é rastreável à sua origem: requisitos → decisões → discoveries → princípios." },
  { n: "08", title: "Simplicidade", body: "Complexidade precisa se justificar. Prefira a solução mais simples que preserve a qualidade do conhecimento." },
  { n: "09", title: "Inteligência guiada por humanos", body: "O usuário é a autoridade final. A IA sugere; o humano decide." },
  { n: "10", title: "Contexto antes do código", body: "A qualidade do código vem depois da qualidade do contexto. Contexto supera geração direta de código." },
];

const NON_NEGOTIABLES = [
  "Free Forever",
  "Open Source",
  "BYOK (traga sua chave)",
  "Provider Agnóstico",
  "Local First",
  "Propriedade do usuário",
  "Legível por humanos",
];

const FILTERS = [
  "Isso melhora a preservação de conhecimento?",
  "Isso melhora a qualidade do contexto?",
  "Isso reduz ambiguidade?",
  "Isso ajuda a IA a gerar melhores resultados?",
  "Isso se alinha ao Knowledge First?",
];

export default function PrinciplesPage() {
  return (
    <>
      <DocTitle>Princípios &amp; Constraints</DocTitle>
      <Lead>
        Os princípios definem <em>como</em> o SpecForge se comporta; as constraints
        definem suas fronteiras. Juntos, mantêm o produto fiel à missão.
      </Lead>

      <H2 id="principios">Os 10 princípios</H2>
      <div className="grid gap-3 sm:grid-cols-2">
        {PRINCIPLES.map((p) => (
          <Card key={p.n}>
            <CardContent>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-slate-400">{p.n}</span>
                <h3 className="font-semibold text-slate-900">{p.title}</h3>
              </div>
              <p className="mt-1 text-sm text-slate-600">{p.body}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <H2 id="non-negotiables">Não-negociáveis</H2>
      <P>
        Constraints não são limitações a superar — são decisões de design
        intencionais. Qualquer proposta que as viole exige justificativa explícita.
      </P>
      <div className="flex flex-wrap gap-2">
        {NON_NEGOTIABLES.map((c) => (
          <Badge key={c} variant="default">
            {c}
          </Badge>
        ))}
      </div>

      <H2 id="filtros">Filtro de decisão</H2>
      <P>Antes de adicionar qualquer feature, o projeto pergunta:</P>
      <Card>
        <CardContent>
          <ul className="space-y-1.5 text-sm text-slate-600">
            {FILTERS.map((f) => (
              <li key={f}>☐ {f}</li>
            ))}
          </ul>
        </CardContent>
      </Card>
      <Callout>
        Se a resposta for &quot;não&quot; para a maioria, a feature deve ser
        reconsiderada. Sucesso não é medido por código gerado, e sim por
        conhecimento, intenção, arquitetura e rastreabilidade preservados.
      </Callout>
    </>
  );
}
