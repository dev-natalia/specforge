// Clarification Engine V2 (ai/v2 — 17 / 36). Detecta incerteza ANTES da geração
// e transforma respostas em conhecimento durável (não somem no chat).
import { z } from "zod";
import { AppError } from "@/lib/errors";
import { parseJsonObject, salvageArrayObjects } from "@/lib/providers/parse";
import { defaultProvider } from "@/lib/providers/registry";
import type { GenerationProvider } from "@/lib/providers/provider";
import {
  clarificationCategorySchema,
  clarificationPrioritySchema,
  PRIORITY_ORDER,
  type Clarification,
  type ClarificationCategory,
  type ClarificationPriority,
} from "@/lib/domain/clarification";
import type { ProjectSnapshot } from "@/lib/domain/project";
import { CLARIFICATION_BUDGET, type Scope } from "@/lib/domain/scope";
import {
  CLARIFY_SYSTEM_PROMPT,
  buildClarifyUserPrompt,
  clarifyBatchSize,
} from "@/lib/engine/prompts";
import type { KnowledgeKind } from "@/lib/domain/knowledge";

export interface EngineOptions {
  apiKey: string;
  provider?: GenerationProvider;
}

// Rascunho de clarificação (sem ID/timestamps — atribuídos ao salvar no projeto).
export interface ClarificationDraft {
  category: ClarificationCategory;
  context: string;
  question: string;
  impact: string;
  priority: ClarificationPriority;
}

const clarifyItemSchema = z.object({
  category: clarificationCategorySchema.catch("missingInfo"),
  context: z.string().default(""),
  question: z.string().min(1),
  impact: z.string().default(""),
  priority: clarificationPrioritySchema.catch("medium"),
});

/** Faz o parse robusto da resposta da IA em rascunhos de clarificação. */
export function parseClarifications(raw: string): ClarificationDraft[] {
  // Caminho normal: JSON completo. Se truncar (limite de tokens), recupera os
  // objetos completos do array em vez de falhar tudo.
  let list: unknown[];
  try {
    const parsed = parseJsonObject(raw);
    const arr = (parsed as { clarifications?: unknown }).clarifications;
    list = Array.isArray(arr) ? arr : salvageArrayObjects(raw);
  } catch {
    list = salvageArrayObjects(raw);
  }

  const drafts: ClarificationDraft[] = [];
  for (const item of list) {
    const result = clarifyItemSchema.safeParse(item);
    if (result.success) drafts.push(result.data);
  }
  if (drafts.length === 0) {
    throw new AppError(
      "AI_ERROR",
      "A IA retornou um formato inesperado. Tente novamente.",
      { cause: raw.slice(0, 200) },
    );
  }
  // Ordena por prioridade (critical primeiro).
  drafts.sort((a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]);
  return drafts;
}

/**
 * Detecta clarificações para a intenção do projeto + conhecimento atual.
 * Quando `scope` é informado, a profundidade e o orçamento de perguntas se
 * adaptam ao tamanho do problema (doc 013/014): o resultado é limitado ao teto
 * do scope (anti-interrogação).
 */
export async function detectClarifications(
  description: string,
  snapshot: ProjectSnapshot,
  options: EngineOptions,
  scope?: Scope,
): Promise<ClarificationDraft[]> {
  const provider = options.provider ?? defaultProvider();
  // Folga de tokens proporcional ao lote (cada pergunta ~400 tokens + overhead),
  // para o JSON não truncar no meio (causa de "formato inesperado").
  const maxTokens = scope ? clarifyBatchSize(scope) * 400 + 800 : 3500;
  const text = await provider.generateText(
    {
      system: CLARIFY_SYSTEM_PROMPT,
      prompt: buildClarifyUserPrompt(description, snapshot, scope),
      maxTokens,
    },
    { apiKey: options.apiKey },
  );
  const drafts = parseClarifications(text);
  // Aplica o teto do orçamento (as perguntas já vêm ordenadas por prioridade).
  return scope ? drafts.slice(0, CLARIFICATION_BUDGET[scope].max) : drafts;
}

// Conversão de uma clarificação respondida em rascunho de conhecimento.
export interface KnowledgeDraft {
  kind: KnowledgeKind;
  data: Record<string, unknown>;
}

/**
 * Transforma uma clarificação respondida em conhecimento durável:
 * decisionGap → decisão; demais → discovery. A resposta vira o conteúdo.
 */
export function clarificationToKnowledge(clar: Clarification): KnowledgeDraft | null {
  if (clar.answer.trim() === "") return null;
  const refs = clar.traceRefs;
  if (clar.category === "decisionGap") {
    return {
      kind: "decision",
      data: {
        title: clar.question,
        category: "product",
        context: clar.context,
        decision: clar.answer,
        rationale: clar.impact,
        traceRefs: refs,
      },
    };
  }
  return {
    kind: "discovery",
    data: {
      title: clar.question,
      category: "product",
      description: clar.answer,
      implications: clar.impact,
      traceRefs: refs,
    },
  };
}
