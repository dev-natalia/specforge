// Scope Classification Engine V3 (ai/v3 — 006-scope-classification). Modo
// híbrido: a IA SUGERE o scope (story/feature/product) com confiança e sinais; a
// usuária confirma na UI. Classifica o problema, não o tamanho do texto.
import { z } from "zod";
import { AppError } from "@/lib/errors";
import { parseJsonObject } from "@/lib/providers/parse";
import { defaultProvider } from "@/lib/providers/registry";
import { scopeSchema, compareScope, type Scope } from "@/lib/domain/scope";
import type { ScopeClassification } from "@/lib/domain/initiative";
import type { ProjectSnapshot } from "@/lib/domain/project";
import type { EngineOptions } from "@/lib/engine/clarification";
import {
  CLASSIFY_SYSTEM_PROMPT,
  buildClassifyUserPrompt,
} from "@/lib/engine/prompts";

// Normaliza a confiança vinda da IA: aceita 0..1 ou 0..100 (vira 0..1).
function normalizeConfidence(value: unknown): number {
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n)) return 0.5;
  const scaled = n > 1 ? n / 100 : n;
  return Math.min(1, Math.max(0, scaled));
}

const classifyResultSchema = z.object({
  scope: scopeSchema,
  confidence: z.unknown().transform(normalizeConfidence),
  reason: z.string().default(""),
  signals: z.array(z.string()).default([]),
});

/**
 * Faz o parse robusto da resposta da IA numa ScopeClassification.
 * `overridden` nasce false (vira true se a usuária trocar o scope sugerido).
 */
export function parseScopeClassification(raw: string): ScopeClassification {
  const parsed = parseJsonObject(raw);
  const result = classifyResultSchema.safeParse(parsed);
  if (!result.success) {
    throw new AppError(
      "AI_ERROR",
      "A IA retornou um formato de classificação inesperado. Tente novamente.",
      { cause: parsed },
    );
  }
  return {
    suggested: result.data.scope,
    confidence: result.data.confidence,
    reason: result.data.reason,
    signals: result.data.signals,
    overridden: false,
  };
}

// Confiança mínima para sugerir uma mudança de scope (evita flip-flop por ruído).
export const SCOPE_CHANGE_MIN_CONFIDENCE = 0.6;

// Recomendação de escalação/redução de scope (doc 016/017). Nunca aplicada
// silenciosamente — a UI mostra e a usuária confirma.
export interface ScopeRecommendation {
  direction: "escalate" | "reduce";
  from: Scope;
  to: Scope;
  classification: ScopeClassification;
}

/**
 * Decide se uma reclassificação sugere mudar o scope atual. Retorna null quando
 * o scope sugerido é o mesmo ou a confiança é insuficiente para recomendar.
 */
export function recommendScopeChange(
  current: Scope,
  classification: ScopeClassification,
): ScopeRecommendation | null {
  if (classification.suggested === current) return null;
  if (classification.confidence < SCOPE_CHANGE_MIN_CONFIDENCE) return null;
  const direction = compareScope(classification.suggested, current) > 0 ? "escalate" : "reduce";
  return { direction, from: current, to: classification.suggested, classification };
}

/** Classifica o scope de uma intenção (modo híbrido: sugestão para confirmar). */
export async function classifyScope(
  intent: string,
  options: EngineOptions,
  snapshot?: ProjectSnapshot,
): Promise<ScopeClassification> {
  const provider = options.provider ?? defaultProvider();
  const text = await provider.generateText(
    {
      system: CLASSIFY_SYSTEM_PROMPT,
      prompt: buildClassifyUserPrompt(intent, snapshot),
      maxTokens: 600,
    },
    { apiKey: options.apiKey },
  );
  return parseScopeClassification(text);
}
