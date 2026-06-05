// Generation Feedback (ai/v3 — 019). Registro central de eventos de geração:
// o que aconteceu, com que status. "Explique o que importa, esconda o resto."
// A UI assina este log para dar transparência ao processo (progresso/decisões).
import { newUid } from "@/lib/domain/ids";
import type { Scope } from "@/lib/domain/scope";

export type FeedbackStatus = "done" | "failed" | "skipped" | "info";

// ── Timeline de geração (ai/v3 — 018) ───────────────────────────────────────
// Durante o "Gerar tudo do scope", o store mantém um RUN com os passos
// planejados e o status ao vivo de cada um, para a UI mostrar uma timeline.
export type RunStatus = "pending" | "running" | "done" | "skipped" | "failed";

export interface RunStep {
  key: string;
  label: string;
  status: RunStatus;
}

export interface GenerationRun {
  scope: Scope;
  steps: RunStep[];
  startedAt: string;
  finishedAt?: string;
}

export interface GenerationEvent {
  id: string;
  label: string;
  status: FeedbackStatus;
  // Detalhe curto opcional (ex.: id do artefato, motivo do skip).
  detail?: string;
  at: string;
}

// Máximo de eventos mantidos (log rolante — só o recente importa).
export const FEEDBACK_LIMIT = 12;

/** Cria um evento de feedback com id/timestamp. */
export function feedbackEvent(
  label: string,
  status: FeedbackStatus,
  detail?: string,
): GenerationEvent {
  return { id: newUid(), label, status, detail, at: new Date().toISOString() };
}

/** Prepend do evento ao log, truncando ao limite. */
export function appendFeedback(
  log: GenerationEvent[],
  event: GenerationEvent,
): GenerationEvent[] {
  return [event, ...log].slice(0, FEEDBACK_LIMIT);
}
