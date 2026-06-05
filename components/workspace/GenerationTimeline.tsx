"use client";

// Timeline de geração (ai/v3 — 018). Mostra os passos do orquestrador com status
// ao vivo (pendente → rodando → concluído), dando visibilidade ao "Gerar tudo".
import { useWorkspaceStore } from "@/lib/workspace/store";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import type { RunStatus } from "@/lib/workspace/feedback";

const STATUS_ICON: Record<Exclude<RunStatus, "running">, string> = {
  pending: "○",
  done: "✓",
  skipped: "⊘",
  failed: "✗",
};

const STATUS_COLOR: Record<RunStatus, string> = {
  pending: "text-slate-300",
  running: "text-amber-600",
  done: "text-green-600",
  skipped: "text-slate-400",
  failed: "text-red-600",
};

export function GenerationTimeline() {
  const run = useWorkspaceStore((s) => s.run);
  const clearRun = useWorkspaceStore((s) => s.clearRun);

  if (!run) return null;

  const finished = Boolean(run.finishedAt);
  const failed = run.steps.some((s) => s.status === "failed");

  return (
    <div className="mt-3 rounded-md border border-slate-200 bg-slate-50 px-3 py-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wide text-slate-400">
          {finished ? (failed ? "Pipeline interrompido" : "Pipeline concluído") : "Gerando…"}
        </span>
        {finished && (
          <Button variant="ghost" size="sm" onClick={clearRun}>
            Limpar
          </Button>
        )}
      </div>
      <ul className="mt-1 space-y-1">
        {run.steps.map((step) => (
          <li key={step.key} className="flex items-center gap-2 text-sm">
            {step.status === "running" ? (
              <Spinner className="h-3.5 w-3.5 text-amber-600" />
            ) : (
              <span className={`w-3.5 text-center font-bold ${STATUS_COLOR[step.status]}`}>
                {STATUS_ICON[step.status]}
              </span>
            )}
            <span
              className={
                step.status === "pending" ? "text-slate-400" : "text-slate-700"
              }
            >
              {step.label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
