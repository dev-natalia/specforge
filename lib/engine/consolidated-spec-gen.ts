// Geração do spec consolidado Story/Feature (ai/v3 — 010 / 011). Produz o
// markdown do documento único a partir da intenção + conhecimento da iniciativa,
// preservando rastreabilidade. Retorna conteúdo + traceRefs (sem persistir).
import { defaultProvider } from "@/lib/providers/registry";
import type { ProjectSnapshot } from "@/lib/domain/project";
import type { ConsolidatedSpecFormat } from "@/lib/domain/consolidated-spec";
import { assembleKnowledgeContext } from "@/lib/engine/context-package";
import {
  consolidatedSpecSystemPrompt,
  buildConsolidatedSpecUserPrompt,
} from "@/lib/engine/consolidated-spec-prompts";
import type { EngineOptions } from "@/lib/engine/clarification";

export interface GeneratedConsolidatedSpec {
  content: string;
  traceRefs: string[];
}

// Remove cercas de código que envolvem TODO o conteúdo (a IA às vezes embrulha).
function stripWrappingFence(text: string): string {
  const trimmed = text.trim();
  if (trimmed.startsWith("```")) {
    return trimmed
      .replace(/^```(?:markdown|md)?\s*/i, "")
      .replace(/```\s*$/i, "")
      .trim();
  }
  return trimmed;
}

/** Gera o markdown do spec consolidado para o formato (story/feature). */
export async function generateConsolidatedSpec(
  format: ConsolidatedSpecFormat,
  intent: string,
  snapshot: ProjectSnapshot,
  options: EngineOptions,
): Promise<GeneratedConsolidatedSpec> {
  const provider = options.provider ?? defaultProvider();
  const context = assembleKnowledgeContext(snapshot);

  const text = await provider.generateText(
    {
      system: consolidatedSpecSystemPrompt(format),
      prompt: buildConsolidatedSpecUserPrompt(format, intent, context.text),
      maxTokens: 8000,
    },
    { apiKey: options.apiKey },
  );

  return { content: stripWrappingFence(text), traceRefs: context.sourceRefs };
}
