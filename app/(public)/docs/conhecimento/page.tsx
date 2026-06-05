import { DocTitle, Lead, Callout } from "@/components/docs/primitives";
import { ItemDocCard } from "@/components/docs/ItemDoc";
import { KNOWLEDGE_ITEMS } from "@/lib/docs/items";

export default function KnowledgeDocsPage() {
  return (
    <>
      <DocTitle>Guia do conhecimento</DocTitle>
      <Lead>
        Os objetos de conhecimento são o ativo durável do projeto. Cada um responde
        a uma pergunta diferente e é editável nas abas do workspace. Abaixo, o que é
        cada um, seus campos e um exemplo.
      </Lead>

      <Callout tone="slate">
        Além destes, o modelo prevê <strong>Principle</strong>, <strong>Risk</strong>{" "}
        e <strong>Assumption</strong> — disponíveis no domínio e usados internamente
        pelo Product DNA e pelos quality gates.
      </Callout>

      <div className="space-y-4">
        {KNOWLEDGE_ITEMS.map((item) => (
          <ItemDocCard key={item.id} item={item} />
        ))}
      </div>
    </>
  );
}
