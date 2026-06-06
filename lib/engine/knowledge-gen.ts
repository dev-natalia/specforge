// Knowledge Generation (Fase 2 — Estágio 3 do pipeline). Extrai conhecimento
// durável (discoveries/decisions/constraints) da intenção do projeto. Sugestões
// são revisadas pelo usuário antes de virarem conhecimento (Human-Guided).
import { z } from "zod";
import { AppError } from "@/lib/errors";
import { parseJsonObject } from "@/lib/providers/parse";
import { defaultProvider } from "@/lib/providers/registry";
import {
  KNOWLEDGE_SYSTEM_PROMPT,
  buildKnowledgeUserPrompt,
} from "@/lib/engine/prompts";
import type { EngineOptions, KnowledgeDraft } from "@/lib/engine/clarification";

const suggestionSchema = z.object({
  kind: z.enum(["discovery", "decision", "constraint"]),
  title: z.string().min(1),
  summary: z.string().default(""),
  rationale: z.string().default(""),
  category: z.string().optional(),
});

const DISCOVERY_CATEGORIES = new Set([
  "user",
  "product",
  "technical",
  "architecture",
  "business",
  "process",
]);
const DECISION_CATEGORIES = new Set([
  "product",
  "technical",
  "architecture",
  "process",
  "business",
]);

// Sugestão de conhecimento com rótulo amigável para revisão na UI.
export interface KnowledgeSuggestion extends KnowledgeDraft {
  label: string;
}

/** Faz o parse da resposta da IA em sugestões de conhecimento normalizadas. */
export function parseKnowledgeSuggestions(raw: string): KnowledgeSuggestion[] {
  const parsed = parseJsonObject(raw);
  const list = (parsed as { suggestions?: unknown }).suggestions;
  if (!Array.isArray(list)) {
    throw new AppError(
      "AI_ERROR",
      "A IA retornou um formato inesperado. Tente novamente.",
      { cause: parsed },
    );
  }

  const suggestions: KnowledgeSuggestion[] = [];
  for (const item of list) {
    const result = suggestionSchema.safeParse(item);
    if (!result.success) continue;
    const s = result.data;

    if (s.kind === "discovery") {
      const category = s.category && DISCOVERY_CATEGORIES.has(s.category) ? s.category : "product";
      suggestions.push({
        kind: "discovery",
        label: s.title,
        data: { title: s.title, category, description: s.summary },
      });
    } else if (s.kind === "decision") {
      const category = s.category && DECISION_CATEGORIES.has(s.category) ? s.category : "product";
      suggestions.push({
        kind: "decision",
        label: s.title,
        data: {
          title: s.title,
          category,
          decision: s.summary,
          rationale: s.rationale,
        },
      });
    } else {
      suggestions.push({
        kind: "constraint",
        label: s.title,
        data: { title: s.title, statement: s.summary, rationale: s.rationale },
      });
    }
  }
  return suggestions;
}

/** Sugere conhecimento durável a partir da descrição do projeto (BYOK). */
export async function suggestKnowledge(
  description: string,
  options: EngineOptions,
): Promise<KnowledgeSuggestion[]> {
  const provider = options.provider ?? defaultProvider();
  const text = await provider.generateText(
    {
      system: KNOWLEDGE_SYSTEM_PROMPT,
      prompt: buildKnowledgeUserPrompt(description),
      maxTokens: 2500,
    },
    { apiKey: options.apiKey },
  );
  return parseKnowledgeSuggestions(text);
}
