import { DocTitle, Lead, Callout } from "@/components/docs/primitives";
import { ItemDocCard } from "@/components/docs/ItemDoc";
import { ARTIFACT_ITEMS } from "@/lib/docs/items";

export default function ArtifactsDocsPage() {
  return (
    <>
      <DocTitle>Harness, Adapters &amp; Tasks</DocTitle>
      <Lead>
        Os artefatos finais do pipeline: o harness provider-neutro, as agent rules,
        os 4 adapters de saída, o grafo de tasks e os mecanismos transversais
        (quality gates e rastreabilidade).
      </Lead>

      <Callout tone="slate">
        Geração de <strong>harness</strong> e <strong>tasks</strong> usa a IA (BYOK).
        Os <strong>adapters de saída</strong> são transformações puras — não gastam
        IA nem exigem chave.
      </Callout>

      <div className="space-y-4">
        {ARTIFACT_ITEMS.map((item) => (
          <ItemDocCard key={item.id} item={item} />
        ))}
      </div>
    </>
  );
}
