// Scope Model V3 (ai/v3 — 003-scope-model). Progressive Specification adapta o
// processo ao tamanho do problema. Três níveis oficiais, em ordem crescente de
// complexidade/rigor. Este módulo é a fonte de verdade do scope: rótulos,
// limiares de confiança e orçamento de clarificação por nível.
import { z } from "zod";

export const scopeSchema = z.enum(["story", "feature", "product"]);
export type Scope = z.infer<typeof scopeSchema>;

// Ordem canônica (Story ⊂ Feature ⊂ Product). Cada nível contém as capacidades
// do anterior e adiciona estrutura. Usada para escalação/redução e comparação.
export const SCOPE_ORDER: Scope[] = ["story", "feature", "product"];

export const SCOPE_LABEL: Record<Scope, string> = {
  story: "Story",
  feature: "Feature",
  product: "Product",
};

export const SCOPE_DESCRIPTION: Record<Scope, string> = {
  story: "Tarefa pequena e localizada de implementação.",
  feature: "Nova capacidade adicionada a um sistema existente.",
  product: "Sistema completo ou iniciativa de grande porte.",
};

// Limiar mínimo de confiança para iniciar a geração (021/006/014).
// Story 80% · Feature 85% · Product 90%.
export const CONFIDENCE_THRESHOLD: Record<Scope, number> = {
  story: 0.8,
  feature: 0.85,
  product: 0.9,
};

// Orçamento de perguntas de clarificação por scope (013/014).
// Alvo mínimo/máximo de perguntas antes de gerar.
export const CLARIFICATION_BUDGET: Record<Scope, { min: number; max: number }> = {
  story: { min: 0, max: 5 },
  feature: { min: 3, max: 10 },
  product: { min: 10, max: 30 },
};

/** Índice ordinal do scope (story=0, feature=1, product=2). */
export function scopeRank(scope: Scope): number {
  return SCOPE_ORDER.indexOf(scope);
}

/** Compara dois scopes: <0 se a é menor, 0 igual, >0 se a é maior. */
export function compareScope(a: Scope, b: Scope): number {
  return scopeRank(a) - scopeRank(b);
}

/** True se `confidence` (0..1) atinge o limiar do scope para gerar. */
export function meetsConfidenceThreshold(scope: Scope, confidence: number): boolean {
  return confidence >= CONFIDENCE_THRESHOLD[scope];
}

/** O próximo scope acima (escalação), ou null se já é o topo (product). */
export function escalatedScope(scope: Scope): Scope | null {
  const next = SCOPE_ORDER[scopeRank(scope) + 1];
  return next ?? null;
}

/** O scope imediatamente abaixo (redução), ou null se já é o menor (story). */
export function reducedScope(scope: Scope): Scope | null {
  const rank = scopeRank(scope);
  return rank <= 0 ? null : (SCOPE_ORDER[rank - 1] as Scope);
}
