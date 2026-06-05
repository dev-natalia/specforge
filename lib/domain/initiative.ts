// Initiative V3 (ai/v3 — scope por iniciativa). Em Progressive Specification o
// projeto vira um container: cada Initiative é uma unidade de trabalho com seu
// próprio scope (Story/Feature/Product) e seu conjunto de artefatos. A
// classificação aplica-se à iniciativa, não ao tamanho do projeto (doc 006/022).
//
// A Initiative guarda apenas METADADOS. Os artefatos duráveis (knowledge, specs,
// harness, tasks, ...) continuam armazenados de forma achatada no snapshot e são
// ligados à iniciativa pelo campo `initiativeId` (ver traceability.ts).
import { z } from "zod";
import { scopeSchema } from "@/lib/domain/scope";

// Estágio do ciclo de vida da iniciativa.
export const initiativeStatusSchema = z.enum([
  "draft", // criada, scope ainda em definição
  "clarifying", // coletando informação
  "generating", // gerando artefatos
  "generated", // artefatos prontos
  "archived",
]);
export type InitiativeStatus = z.infer<typeof initiativeStatusSchema>;

// Resultado da classificação de scope (híbrido: IA sugere, usuária confirma).
// `overridden` registra que a escolha final divergiu da sugestão da IA.
export const scopeClassificationSchema = z.object({
  suggested: scopeSchema,
  confidence: z.number().min(0).max(1),
  reason: z.string().default(""),
  // Sinais de scope/complexidade/risco detectados (doc 006), p/ transparência.
  signals: z.array(z.string()).default([]),
  overridden: z.boolean().default(false),
});
export type ScopeClassification = z.infer<typeof scopeClassificationSchema>;

// Entrada do histórico de mudança de scope (escalação/redução). Persistida na
// iniciativa para preservar como o scope evoluiu (doc 016/018).
export const scopeChangeSchema = z.object({
  from: scopeSchema,
  to: scopeSchema,
  at: z.string(),
  reason: z.string().default(""),
  confidence: z.number().min(0).max(1).optional(),
});
export type ScopeChange = z.infer<typeof scopeChangeSchema>;

export const initiativeSchema = z.object({
  kind: z.literal("initiative"),
  id: z.string(),
  title: z.string().min(1),
  // Descrição/intenção original que originou a iniciativa.
  intent: z.string().default(""),
  // Scope efetivo (confirmado). Governa pipeline, matriz e clarificação.
  scope: scopeSchema,
  classification: scopeClassificationSchema.optional(),
  // Histórico de escalações/reduções (mais antigo → mais recente).
  scopeHistory: z.array(scopeChangeSchema).default([]),
  status: initiativeStatusSchema.default("draft"),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type Initiative = z.infer<typeof initiativeSchema>;
