// Spec Generation Engine (ai/v2 — 16). Gera o conteúdo de uma spec a partir do
// Context Package (conhecimento) + specs anteriores da cascata, preservando
// rastreabilidade. Retorna conteúdo markdown + traceRefs (sem persistir).
import { defaultProvider } from "@/lib/providers/registry";
import type { ProjectSnapshot } from "@/lib/domain/project";
import type { SpecType } from "@/lib/domain/specs";
import { assembleKnowledgeContext } from "@/lib/engine/context-package";
import { specSystemPrompt, buildSpecUserPrompt } from "@/lib/engine/spec-prompts";
import type { EngineOptions } from "@/lib/engine/clarification";

export interface SpecPredecessor {
  id: string;
  type: SpecType;
  content: string;
}

export interface GeneratedSpec {
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

/**
 * Gera o conteúdo de uma spec. Os predecessores são as specs anteriores da
 * cascata (já geradas) usadas como contexto.
 */
export async function generateSpecContent(
  type: SpecType,
  snapshot: ProjectSnapshot,
  predecessors: SpecPredecessor[],
  options: EngineOptions,
): Promise<GeneratedSpec> {
  const provider = options.provider ?? defaultProvider();
  const context = assembleKnowledgeContext(snapshot);

  const text = await provider.generateText(
    {
      system: specSystemPrompt(type),
      prompt: buildSpecUserPrompt(
        type,
        context.text,
        predecessors.map((p) => ({ type: p.type, content: p.content })),
      ),
      maxTokens: 32000,
    },
    { apiKey: options.apiKey },
  );

  const traceRefs = [
    ...context.sourceRefs,
    ...predecessors.map((p) => p.id),
  ];
  return { content: stripWrappingFence(text), traceRefs };
}
