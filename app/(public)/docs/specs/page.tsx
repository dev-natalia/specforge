import { DocTitle, Lead, H2, P, Callout, CodeBlock } from "@/components/docs/primitives";
import { ItemDocCard } from "@/components/docs/ItemDoc";
import { SPEC_ITEMS } from "@/lib/docs/items";

export default function SpecsDocsPage() {
  return (
    <>
      <DocTitle>Guia das Specs</DocTitle>
      <Lead>
        Specs são artefatos <strong>derivados</strong> do conhecimento, gerados em
        cascata: cada uma usa as anteriores como contexto e cita os IDs de origem.
        Você gera por tipo ou todas de uma vez.
      </Lead>

      <H2 id="cascata">A cascata</H2>
      <CodeBlock>{`Requisitos → Design → Arquitetura → Contratos → Edge Cases → Segurança → Testes`}</CodeBlock>
      <P>
        Regenerar uma spec preserva o ID e incrementa a versão (<code>v2</code>,{" "}
        <code>v3</code>…). Cada arquivo é exportado em{" "}
        <code>specs/001-&lt;slug&gt;/</code>.
      </P>
      <Callout>
        Os <strong>quality gates de specs</strong> verificam conteúdo, origem
        (traceRefs) e a presença da base da cascata (Requisitos). Uma spec sem
        origem é sinalizada como &quot;revision&quot;.
      </Callout>

      <H2 id="tipos">Os 7 tipos</H2>
      <div className="space-y-4">
        {SPEC_ITEMS.map((item) => (
          <ItemDocCard key={item.id} item={item} />
        ))}
      </div>
    </>
  );
}
