// Objetos de Conhecimento V2 (ai/v2 — Camada 2: Modelo de Conhecimento).
// Conhecimento é o ativo primário; specs/harness/tasks derivam daqui.
// Schemas em zod (fonte de verdade de validação) + tipos inferidos.
import { z } from "zod";
import { traceableSchema } from "@/lib/domain/traceability";

// Carimbos de tempo ISO compartilhados por artefatos duráveis.
const timestampsSchema = z.object({
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const confidenceSchema = z.enum(["low", "medium", "high"]);
export type Confidence = z.infer<typeof confidenceSchema>;

// ── Discovery (10-discoveries) — "O que aprendemos?" ────────────────────────
export const discoveryCategorySchema = z.enum([
  "user",
  "product",
  "technical",
  "architecture",
  "business",
  "process",
]);
export type DiscoveryCategory = z.infer<typeof discoveryCategorySchema>;

export const discoverySchema = traceableSchema.merge(timestampsSchema).extend({
  kind: z.literal("discovery"),
  title: z.string().min(1),
  category: discoveryCategorySchema,
  description: z.string().default(""),
  source: z.string().default(""),
  evidence: z.string().default(""),
  implications: z.string().default(""),
  confidence: confidenceSchema.default("low"),
});
export type Discovery = z.infer<typeof discoverySchema>;

// ── Decision Record (11-decision-records) — "O que escolhemos e por quê?" ───
export const decisionCategorySchema = z.enum([
  "product",
  "technical",
  "architecture",
  "process",
  "business",
]);
export type DecisionCategory = z.infer<typeof decisionCategorySchema>;

export const decisionSchema = traceableSchema.merge(timestampsSchema).extend({
  kind: z.literal("decision"),
  title: z.string().min(1),
  category: decisionCategorySchema,
  context: z.string().default(""),
  decision: z.string().default(""),
  rationale: z.string().default(""),
  alternatives: z.array(z.string()).default([]),
  tradeoffs: z.string().default(""),
  consequences: z.string().default(""),
  version: z.number().int().positive().default(1),
});
export type Decision = z.infer<typeof decisionSchema>;

// ── Constraint — limites inegociáveis (07-constraints) ──────────────────────
export const constraintSchema = traceableSchema.merge(timestampsSchema).extend({
  kind: z.literal("constraint"),
  title: z.string().min(1),
  statement: z.string().default(""),
  rationale: z.string().default(""),
});
export type Constraint = z.infer<typeof constraintSchema>;

// ── Principle — regras permanentes de decisão (03-core-principles) ──────────
export const principleSchema = traceableSchema.merge(timestampsSchema).extend({
  kind: z.literal("principle"),
  title: z.string().min(1),
  statement: z.string().default(""),
  rationale: z.string().default(""),
});
export type Principle = z.infer<typeof principleSchema>;

// ── Risk — incertezas conhecidas ────────────────────────────────────────────
export const riskSchema = traceableSchema.merge(timestampsSchema).extend({
  kind: z.literal("risk"),
  title: z.string().min(1),
  description: z.string().default(""),
  likelihood: confidenceSchema.default("low"),
  impact: confidenceSchema.default("low"),
  mitigation: z.string().default(""),
});
export type Risk = z.infer<typeof riskSchema>;

// ── Assumption — crenças não validadas ──────────────────────────────────────
export const assumptionSchema = traceableSchema.merge(timestampsSchema).extend({
  kind: z.literal("assumption"),
  title: z.string().min(1),
  statement: z.string().default(""),
  validated: z.boolean().default(false),
});
export type Assumption = z.infer<typeof assumptionSchema>;

// ── Product DNA (12-product-dna-model) — identidade do projeto ──────────────
export const productDnaSchema = traceableSchema.merge(timestampsSchema).extend({
  kind: z.literal("productDna"),
  mission: z.string().default(""),
  vision: z.string().default(""),
  problemStatement: z.string().default(""),
  audience: z.string().default(""),
  coreBeliefs: z.array(z.string()).default([]),
  principles: z.array(z.string()).default([]),
  constraints: z.array(z.string()).default([]),
  nonGoals: z.array(z.string()).default([]),
  personality: z.array(z.string()).default([]),
  decisionFilters: z.array(z.string()).default([]),
});
export type ProductDna = z.infer<typeof productDnaSchema>;

// ── Context Package (13-context-packages) — conhecimento pronto p/ IA ───────
export const contextPackageCategorySchema = z.enum([
  "project",
  "feature",
  "architecture",
  "testing",
  "harness",
]);
export type ContextPackageCategory = z.infer<typeof contextPackageCategorySchema>;

export const contextPackageSchema = traceableSchema.merge(timestampsSchema).extend({
  kind: z.literal("contextPackage"),
  name: z.string().min(1),
  category: contextPackageCategorySchema,
  objective: z.string().default(""),
  purpose: z.string().default(""),
  requiredContext: z.array(z.string()).default([]),
  optionalContext: z.array(z.string()).default([]),
  excludedContext: z.array(z.string()).default([]),
  version: z.number().int().positive().default(1),
  generatedBy: z.string().default(""),
});
export type ContextPackage = z.infer<typeof contextPackageSchema>;

// União discriminada de todo objeto de conhecimento.
export const knowledgeObjectSchema = z.discriminatedUnion("kind", [
  discoverySchema,
  decisionSchema,
  constraintSchema,
  principleSchema,
  riskSchema,
  assumptionSchema,
  productDnaSchema,
  contextPackageSchema,
]);
export type KnowledgeObject = z.infer<typeof knowledgeObjectSchema>;
export type KnowledgeKind = KnowledgeObject["kind"];
