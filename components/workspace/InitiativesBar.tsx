"use client";

// Barra de iniciativas (V3). Em Progressive Specification o projeto é um
// container de iniciativas, cada uma com seu scope. Aqui a usuária vê as
// iniciativas, escolhe a ativa (alvo das abas) e cria novas.
import { useState } from "react";
import { useWorkspaceStore } from "@/lib/workspace/store";
import { SCOPE_LABEL, type Scope } from "@/lib/domain/scope";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { NewInitiative } from "@/components/workspace/NewInitiative";
import type { ProjectSnapshot } from "@/lib/domain/project";

const SCOPE_BADGE: Record<Scope, "neutral" | "info" | "default"> = {
  story: "neutral",
  feature: "info",
  product: "default",
};

export function InitiativesBar({ snapshot }: { snapshot: ProjectSnapshot }) {
  const activeInitiativeId = useWorkspaceStore((s) => s.activeInitiativeId);
  const setActiveInitiative = useWorkspaceStore((s) => s.setActiveInitiative);
  const removeInitiative = useWorkspaceStore((s) => s.removeInitiative);

  const [creating, setCreating] = useState(false);
  const initiatives = snapshot.initiatives;

  function handleDelete(id: string, title: string) {
    const ok = window.confirm(
      `Excluir a iniciativa "${title}" e todos os seus artefatos (specs, harness, tasks)?\n\nEsta ação não pode ser desfeita.`,
    );
    if (ok) void removeInitiative(id);
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-medium uppercase tracking-wide text-slate-400">
          Iniciativas
        </span>
        {initiatives.map((initiative) => {
          const active = initiative.id === activeInitiativeId;
          return (
            <div
              key={initiative.id}
              className={
                "inline-flex items-center gap-1 rounded-full border pl-3 pr-1 text-sm transition-colors " +
                (active
                  ? "border-brand-500 bg-brand-50 text-brand-800"
                  : "border-slate-200 text-slate-600 hover:border-slate-300")
              }
            >
              <button
                type="button"
                onClick={() => setActiveInitiative(initiative.id)}
                className="flex items-center gap-2 py-1"
              >
                <span className="max-w-[14rem] truncate">{initiative.title}</span>
                <Badge variant={SCOPE_BADGE[initiative.scope]}>{SCOPE_LABEL[initiative.scope]}</Badge>
              </button>
              <button
                type="button"
                onClick={() => handleDelete(initiative.id, initiative.title)}
                aria-label={`Excluir iniciativa ${initiative.title}`}
                title="Excluir iniciativa"
                className="flex h-5 w-5 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-red-100 hover:text-red-600"
              >
                ×
              </button>
            </div>
          );
        })}
        {!creating && (
          <Button size="sm" variant="outline" onClick={() => setCreating(true)}>
            + Nova iniciativa
          </Button>
        )}
      </div>

      {initiatives.length === 0 && !creating && (
        <div className="rounded-lg border border-dashed border-slate-300 p-6 text-center">
          <p className="text-sm text-slate-500">
            Crie uma iniciativa para começar. O processo se adapta ao tamanho do problema
            (Story, Feature ou Product).
          </p>
          <Button className="mt-3" size="sm" onClick={() => setCreating(true)}>
            Criar primeira iniciativa
          </Button>
        </div>
      )}

      {creating && (
        <NewInitiative
          snapshot={snapshot}
          onDone={() => setCreating(false)}
          onCancel={() => setCreating(false)}
        />
      )}
    </div>
  );
}
