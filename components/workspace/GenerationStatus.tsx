"use client";

// Status de geração: mostra os arquivos geráveis da iniciativa (especificação,
// harness, tasks, artefatos) e fica VERDE quando cada um é gerado. Substitui a
// visão de "pipeline" por um indicador concreto de progresso.
import { SCOPE_LABEL } from "@/lib/domain/scope";
import { CONSOLIDATED_SPEC_LABEL } from "@/lib/domain/consolidated-spec";
import type { ProjectSnapshot } from "@/lib/domain/project";

interface StatusItem {
  label: string;
  done: boolean;
  count?: number;
}

export function GenerationStatus({ snapshot }: { snapshot: ProjectSnapshot }) {
  const scope = snapshot.initiatives[0]?.scope;
  if (!scope) return null;

  // Story/Feature geram um documento consolidado; Product, a cascata por-tipo.
  const usesConsolidated = scope === "story" || scope === "feature";

  const items: StatusItem[] = [
    usesConsolidated
      ? {
          label: CONSOLIDATED_SPEC_LABEL[scope],
          done: snapshot.consolidatedSpecs.length > 0,
        }
      : {
          label: "Specs",
          done: snapshot.specifications.length > 0,
          count: snapshot.specifications.length || undefined,
        },
    { label: "Harness", done: snapshot.harnesses.length > 0 },
    {
      label: "Tasks",
      done: snapshot.tasks.length > 0,
      count: snapshot.tasks.length || undefined,
    },
    {
      label: "Artefatos de provider",
      done: snapshot.providerArtifacts.length > 0,
      count: snapshot.providerArtifacts.length || undefined,
    },
  ];

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <h3 className="text-sm font-medium text-slate-800">
        Status · scope {SCOPE_LABEL[scope]}
      </h3>
      <div className="mt-2 flex flex-wrap gap-2">
        {items.map((item) => (
          <span
            key={item.label}
            className={
              "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm " +
              (item.done
                ? "border-green-300 bg-green-50 text-green-800"
                : "border-slate-200 bg-slate-50 text-slate-400")
            }
          >
            <span className={item.done ? "text-green-600" : "text-slate-300"}>
              {item.done ? "✓" : "○"}
            </span>
            {item.label}
            {item.count ? ` (${item.count})` : ""}
          </span>
        ))}
      </div>
    </div>
  );
}
