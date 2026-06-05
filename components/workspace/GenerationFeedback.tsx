"use client";

// Feedback de geração (ai/v3 — 019). Mostra o log rolante de eventos de geração
// (o que foi gerado/pulado, decisões de scope) + um resumo de validação. Dá
// transparência ao processo sem inflar a tela: aparece só quando há atividade.
import { useWorkspaceStore } from "@/lib/workspace/store";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import type { FeedbackStatus } from "@/lib/workspace/feedback";

const STATUS_ICON: Record<FeedbackStatus, string> = {
  done: "✓",
  failed: "✗",
  skipped: "⊘",
  info: "•",
};

const STATUS_COLOR: Record<FeedbackStatus, string> = {
  done: "text-green-600",
  failed: "text-red-600",
  skipped: "text-slate-400",
  info: "text-blue-600",
};

function time(at: string): string {
  return new Date(at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export function GenerationFeedback() {
  const feedback = useWorkspaceStore((s) => s.feedback);
  const clearFeedback = useWorkspaceStore((s) => s.clearFeedback);
  const invariantIssues = useWorkspaceStore((s) => s.invariantIssues);

  if (feedback.length === 0) return null;

  const issues = invariantIssues();

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-slate-800">Atividade de geração</h3>
        <Button variant="ghost" size="sm" onClick={clearFeedback}>
          Limpar
        </Button>
      </div>

      <ul className="mt-2 space-y-1">
        {feedback.map((event) => (
          <li key={event.id} className="flex items-center gap-2 text-sm">
            <span className={`font-bold ${STATUS_COLOR[event.status]}`}>
              {STATUS_ICON[event.status]}
            </span>
            <span className="text-slate-700">{event.label}</span>
            {event.detail && <span className="text-xs text-slate-400">{event.detail}</span>}
            <span className="ml-auto text-xs text-slate-300">{time(event.at)}</span>
          </li>
        ))}
      </ul>

      {/* Resumo de validação (doc 019 — Validation Feedback) */}
      <div className="mt-3 border-t border-slate-100 pt-2">
        {issues.length === 0 ? (
          <Badge variant="success">Validação ok · rastreabilidade íntegra</Badge>
        ) : (
          <Badge variant="warning">
            {issues.length} alerta(s) de validação — veja o cabeçalho
          </Badge>
        )}
      </div>
    </div>
  );
}
