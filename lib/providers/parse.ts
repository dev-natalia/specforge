// Parsing canônico das respostas da IA (provider-neutro). Tolera cercas de
// código e prosa residual e recorta o objeto JSON. Substitui as cópias locais
// de lib/ai/generate.ts (que serão removidas na limpeza da Fase 5).
import { AppError } from "@/lib/errors";

/**
 * Extrai e parseia o objeto JSON do texto da IA, tolerando cercas de código
 * (apenas quando envolvem todo o conteúdo) e prosa residual.
 */
export function parseJsonObject(raw: string): unknown {
  let text = raw.trim();

  // Remove a cerca apenas se ela envolve TODO o conteúdo (resposta começa com ```).
  if (text.startsWith("```")) {
    text = text
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/```\s*$/i, "")
      .trim();
  }

  // Recorta do primeiro `{` ao último `}` — robusto a cercas internas.
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start !== -1 && end !== -1 && end > start) {
    text = text.slice(start, end + 1);
  }

  try {
    return JSON.parse(text);
  } catch (cause) {
    throw new AppError(
      "AI_ERROR",
      "A IA retornou um formato inesperado. Tente regenerar.",
      { cause },
    );
  }
}

/**
 * Recupera os objetos JSON COMPLETOS de dentro do primeiro array do texto,
 * tolerando truncamento (quando a IA é cortada por limite de tokens e o JSON do
 * todo não fecha). É string-aware: chaves dentro de strings não contam. A última
 * `{...}` incompleta é descartada.
 */
export function salvageArrayObjects(raw: string): unknown[] {
  const arrStart = raw.indexOf("[");
  if (arrStart < 0) return [];
  const objs: unknown[] = [];
  let depth = 0;
  let start = -1;
  let inString = false;
  let escape = false;
  for (let i = arrStart + 1; i < raw.length; i++) {
    const ch = raw[i];
    if (inString) {
      if (escape) escape = false;
      else if (ch === "\\") escape = true;
      else if (ch === '"') inString = false;
      continue;
    }
    if (ch === '"') {
      inString = true;
    } else if (ch === "{") {
      if (depth === 0) start = i;
      depth++;
    } else if (ch === "}") {
      depth--;
      if (depth === 0 && start >= 0) {
        try {
          objs.push(JSON.parse(raw.slice(start, i + 1)));
        } catch {
          // objeto inválido — ignora
        }
        start = -1;
      }
    }
  }
  return objs;
}

/** Lê um array de strings de um campo (`{ [field]: string[] }`). */
export function parseStringArray(raw: string, field: string): string[] {
  const parsed = parseJsonObject(raw);
  const value = (parsed as Record<string, unknown>)[field];
  if (!Array.isArray(value)) {
    throw new AppError(
      "AI_ERROR",
      "A IA retornou um formato inesperado. Tente novamente.",
      { cause: parsed },
    );
  }
  return value.filter((v): v is string => typeof v === "string" && v.trim().length > 0);
}
