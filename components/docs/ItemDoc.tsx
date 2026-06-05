// Card de documentação de um "item de projeto" (Discovery, Decision, spec, etc.)
// com explicação detalhada + exemplo. Orientado a dados (ver lib/docs/items.ts).
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export interface ItemField {
  name: string;
  desc: string;
}

export interface ItemDoc {
  id: string;
  name: string;
  idPrefix?: string;
  answers?: string;
  what: string;
  when?: string;
  fields?: ItemField[];
  example: string;
  tip?: string;
}

export function ItemDocCard({ item }: { item: ItemDoc }) {
  return (
    <Card id={item.id} className="scroll-mt-24">
      <CardContent className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-lg font-semibold text-slate-900">{item.name}</h3>
          {item.idPrefix && (
            <Badge variant="neutral">
              <span className="font-mono">{item.idPrefix}</span>
            </Badge>
          )}
          {item.answers && <Badge variant="info">{item.answers}</Badge>}
        </div>

        <p className="text-sm text-slate-600">
          <span className="font-medium text-slate-700">O que é: </span>
          {item.what}
        </p>

        {item.when && (
          <p className="text-sm text-slate-600">
            <span className="font-medium text-slate-700">Quando usar: </span>
            {item.when}
          </p>
        )}

        {item.fields && item.fields.length > 0 && (
          <div>
            <p className="text-sm font-medium text-slate-700">Campos:</p>
            <ul className="mt-1 space-y-1 text-sm text-slate-600">
              {item.fields.map((f) => (
                <li key={f.name}>
                  <span className="font-mono text-xs text-slate-500">{f.name}</span> — {f.desc}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Exemplo
          </p>
          <pre className="mt-1 overflow-auto rounded-md bg-slate-50 p-3 text-xs leading-relaxed text-slate-700">
            {item.example}
          </pre>
        </div>

        {item.tip && (
          <p className="text-sm text-brand-700">
            <span className="font-medium">Dica: </span>
            {item.tip}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
