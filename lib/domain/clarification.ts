// Clarification (ai/v2 — 17 / 36-clarification-engine). Incerteza detectada
// antes da geração. Respostas viram conhecimento durável (não somem no chat).
import { z } from "zod";
import { traceableSchema } from "@/lib/domain/traceability";

export const clarificationCategorySchema = z.enum([
  "missingInfo",
  "ambiguity",
  "contradiction",
  "assumption",
  "constraintGap",
  "scopeGap",
  "decisionGap",
  "riskGap",
]);
export type ClarificationCategory = z.infer<typeof clarificationCategorySchema>;

export const clarificationPrioritySchema = z.enum([
  "critical",
  "high",
  "medium",
  "low",
]);
export type ClarificationPriority = z.infer<typeof clarificationPrioritySchema>;

export const clarificationStatusSchema = z.enum(["open", "answered", "closed"]);
export type ClarificationStatus = z.infer<typeof clarificationStatusSchema>;

export const clarificationSchema = traceableSchema.extend({
  kind: z.literal("clarification"),
  category: clarificationCategorySchema,
  // Por que a pergunta existe (contexto da incerteza).
  context: z.string().default(""),
  question: z.string().min(1),
  // Por que a resposta importa (consequência de não responder).
  impact: z.string().default(""),
  priority: clarificationPrioritySchema.default("medium"),
  answer: z.string().default(""),
  status: clarificationStatusSchema.default("open"),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type Clarification = z.infer<typeof clarificationSchema>;

// Ordem de prioridade para ordenação/decisão (critical primeiro).
export const PRIORITY_ORDER: Record<ClarificationPriority, number> = {
  critical: 0,
  high: 1,
  medium: 2,
  low: 3,
};
