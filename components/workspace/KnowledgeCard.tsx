"use client";

// Card de exibição de um objeto de conhecimento, com ações de editar/remover.
// Colapsável: por padrão mostra só o cabeçalho (id, badge, título). Clicar no
// título expande os detalhes — mantém a lista limpa quando há muito conteúdo.
import { useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import type { KnowledgeObject } from "@/lib/domain/knowledge";

const CONFIDENCE_LABEL: Record<string, string> = { low: "Baixa", medium: "Média", high: "Alta" };

function Refs({ refs }: { refs: string[] }) {
  if (refs.length === 0) return null;
  return (
    <p className="mt-2 text-xs text-slate-400">
      Origens: <span className="font-mono">{refs.join(", ")}</span>
    </p>
  );
}

export function KnowledgeCard({
  item,
  onEdit,
  onRemove,
  open,
  onToggle,
}: {
  item: KnowledgeObject;
  onEdit: () => void;
  onRemove: () => void;
  // Controlado pelo pai (acordeão: um aberto por vez). Se omitido, o card
  // gerencia o próprio estado (uso isolado, ex.: Product DNA).
  open?: boolean;
  onToggle?: () => void;
}) {
  const [internalOpen, setInternalOpen] = useState(false);
  const controlled = open !== undefined;
  const expanded = controlled ? open : internalOpen;
  const toggle = () => (controlled ? onToggle?.() : setInternalOpen((v) => !v));
  const title = "title" in item ? item.title : "Product DNA";

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        {/* Cabeçalho clicável: alterna a expansão dos detalhes. */}
        <button
          type="button"
          onClick={toggle}
          aria-expanded={expanded}
          className="min-w-0 flex-1 text-left"
        >
          <div className="flex items-center gap-2">
            <span
              className={
                "text-xs text-slate-400 transition-transform " + (expanded ? "rotate-90" : "")
              }
              aria-hidden
            >
              ▸
            </span>
            <span className="font-mono text-xs text-slate-400">{item.id}</span>
            {item.kind === "discovery" && (
              <Badge variant="neutral">{CONFIDENCE_LABEL[item.confidence]}</Badge>
            )}
          </div>
          <h4 className="mt-1 truncate font-medium text-slate-900">{title}</h4>
        </button>
        <div className="flex shrink-0 gap-1">
          <Button variant="ghost" size="sm" onClick={onEdit}>
            Editar
          </Button>
          <Button variant="ghost" size="sm" onClick={onRemove}>
            Remover
          </Button>
        </div>
      </div>

      {/* Detalhes — só quando expandido. */}
      {expanded && (
        <div className="mt-2 border-t border-slate-100 pt-2">
          {item.kind === "discovery" && item.description && (
            <p className="whitespace-pre-wrap text-sm text-slate-600">{item.description}</p>
          )}
          {item.kind === "decision" && (
            <div className="space-y-1 text-sm text-slate-600">
              {item.decision && (
                <p>
                  <span className="font-medium">Decisão:</span> {item.decision}
                </p>
              )}
              {item.rationale && (
                <p>
                  <span className="font-medium">Racional:</span> {item.rationale}
                </p>
              )}
            </div>
          )}
          {item.kind === "constraint" && item.statement && (
            <p className="whitespace-pre-wrap text-sm text-slate-600">{item.statement}</p>
          )}
          {item.kind === "productDna" && (
            <div className="space-y-1 text-sm text-slate-600">
              {item.mission && (
                <p>
                  <span className="font-medium">Missão:</span> {item.mission}
                </p>
              )}
              {item.audience && (
                <p>
                  <span className="font-medium">Público:</span> {item.audience}
                </p>
              )}
            </div>
          )}

          <Refs refs={item.traceRefs} />
        </div>
      )}
    </div>
  );
}
