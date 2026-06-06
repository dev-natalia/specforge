"use client";

// Painel de Tasks (Fase 4). Gera o grafo de tasks a partir das specs, com
// dependências, critérios de aceite e rastreabilidade.
import { useState } from "react";
import Link from "next/link";
import { useWorkspaceStore } from "@/lib/workspace/store";
import { getStoredKey } from "@/lib/byok";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Spinner } from "@/components/ui/Spinner";
import type { ProjectSnapshot } from "@/lib/domain/project";

export function TasksPanel({ snapshot }: { snapshot: ProjectSnapshot }) {
  const generateTasks = useWorkspaceStore((s) => s.generateTasks);
  const appendTasks = useWorkspaceStore((s) => s.appendTasks);
  const [busy, setBusy] = useState<null | "replace" | "append">(null);
  const [error, setError] = useState<string | null>(null);
  const hasKey = Boolean(getStoredKey());

  async function run(mode: "replace" | "append") {
    const apiKey = getStoredKey();
    if (!apiKey) return;
    setBusy(mode);
    setError(null);
    try {
      if (mode === "append") await appendTasks({ apiKey });
      else await generateTasks({ apiKey });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha ao gerar tasks.");
    } finally {
      setBusy(null);
    }
  }

  // Story/Feature usam spec consolidado; Product, a cascata por-tipo.
  const noSpecs =
    snapshot.specifications.length === 0 && snapshot.consolidatedSpecs.length === 0;
  const hasTasks = snapshot.tasks.length > 0;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-slate-500">
          Tasks executáveis derivadas das specs, com dependências e rastreabilidade.
        </p>
        <div className="flex gap-2">
          {hasTasks && (
            <Button
              variant="outline"
              onClick={() => void run("append")}
              disabled={!hasKey || busy !== null || noSpecs}
            >
              {busy === "append" && <Spinner className="h-4 w-4" />}
              Gerar mais tasks
            </Button>
          )}
          <Button onClick={() => void run("replace")} disabled={!hasKey || busy !== null || noSpecs}>
            {busy === "replace" && <Spinner className="h-4 w-4" />}
            {hasTasks ? "Regenerar tasks" : "Gerar tasks"}
          </Button>
        </div>
      </div>

      {!hasKey && (
        <div className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
          Configure sua chave da Anthropic.{" "}
          <Link href="/settings" className="font-medium underline">
            Configurar
          </Link>
        </div>
      )}
      {noSpecs && (
        <p className="text-sm text-slate-400">Gere specs antes de gerar tasks.</p>
      )}
      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="grid gap-2">
        {snapshot.tasks.map((task) => (
          <div key={task.id} className="rounded-lg border border-slate-200 bg-white p-4">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-slate-400">{task.id}</span>
              <Badge variant="neutral">{task.category}</Badge>
              {task.dependencies.length > 0 && (
                <span className="text-xs text-slate-400">
                  depende de {task.dependencies.join(", ")}
                </span>
              )}
            </div>
            <h4 className="mt-1 font-medium text-slate-900">{task.title}</h4>
            {task.objective && <p className="mt-1 text-sm text-slate-600">{task.objective}</p>}
            {task.acceptanceCriteria.length > 0 && (
              <ul className="mt-2 list-disc pl-5 text-sm text-slate-600">
                {task.acceptanceCriteria.map((ac, i) => (
                  <li key={i}>{ac}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
