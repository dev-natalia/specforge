import { DocTitle, Lead, H2, P, Callout, CodeBlock } from "@/components/docs/primitives";
import { ItemDocCard } from "@/components/docs/ItemDoc";
import { SPEC_ITEMS } from "@/lib/docs/items";

export default function SpecsDocsPage() {
  return (
    <>
      <DocTitle>Guia das Specs</DocTitle>
      <Lead>
        Specs são artefatos <strong>derivados</strong> do conhecimento e rastreáveis
        às origens. O <strong>formato depende do scope</strong> da iniciativa: um
        documento único consolidado (Story/Feature) ou a cascata por-tipo (Product).
      </Lead>

      <H2 id="formato">Dois formatos, por scope</H2>
      <P>
        Em Progressive Specification, a especificação se adapta ao tamanho do problema
        (veja o <strong>Guia de uso</strong>):
      </P>
      <CodeBlock>{`Story / Feature  →  1 documento consolidado (Story/Feature Specification)
Product          →  cascata de 7 specs por-tipo`}</CodeBlock>
      <P>
        Na <strong>Story/Feature Spec</strong>, tudo vive num só documento — objetivo,
        requisitos, fluxos e, na Feature, também design e contratos. Em{" "}
        <strong>Product</strong>, cada dimensão vira uma spec separada, em cascata.
      </P>

      <H2 id="cascata">A cascata (Product)</H2>
      <CodeBlock>{`Requisitos → Design → Arquitetura → Contratos → Edge Cases → Segurança → Testes`}</CodeBlock>
      <P>
        Cada spec usa as anteriores como contexto. Regenerar preserva o ID e incrementa
        a versão (<code>v2</code>, <code>v3</code>…). Os arquivos são exportados em{" "}
        <code>specs/001-&lt;slug&gt;/</code>.
      </P>
      <Callout>
        Os <strong>quality gates de specs</strong> verificam conteúdo e origem
        (traceRefs) — tanto da cascata quanto do documento consolidado. A base da
        cascata (Requisitos) só é exigida em Product. Specs sem origem viram
        &quot;revision&quot;.
      </Callout>
      <Callout tone="slate">
        Toda spec gerada lista <strong>perguntas em aberto</strong> — o que a IA não
        conseguiu definir a partir do conhecimento (em vez de inventar). No workspace,
        elas viram cards respondíveis: responda e regenere para incorporar.
      </Callout>

      <H2 id="tipos">Os 7 tipos (cascata)</H2>
      <div className="space-y-4">
        {SPEC_ITEMS.map((item) => (
          <ItemDocCard key={item.id} item={item} />
        ))}
      </div>
    </>
  );
}
