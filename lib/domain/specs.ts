// Sistema de Specs V2 (ai/v2 — Camada 4). Specs são artefatos DERIVADOS do
// conhecimento, gerados em cascata e sempre rastreáveis às suas origens.
// O conteúdo formal de cada spec vive no markdown gerado (`content`); aqui fica
// o envelope comum: tipo, metadados, status e rastreabilidade.
import { z } from "zod";
import { traceableSchema } from "@/lib/domain/traceability";

// Os 7 tipos de spec, na ordem da cascata (21..27 do v2).
export const specTypeSchema = z.enum([
  "requirements",
  "design",
  "architecture",
  "contracts",
  "edgeCases",
  "security",
  "testing",
]);
export type SpecType = z.infer<typeof specTypeSchema>;

// Ordem canônica da cascata: cada spec pode depender das anteriores.
export const SPEC_CASCADE: SpecType[] = [
  "requirements",
  "design",
  "architecture",
  "contracts",
  "edgeCases",
  "security",
  "testing",
];

export const SPEC_FILENAME: Record<SpecType, string> = {
  requirements: "requirements.md",
  design: "design.md",
  architecture: "architecture.md",
  contracts: "contracts.md",
  edgeCases: "edge-cases.md",
  security: "security.md",
  testing: "testing.md",
};

export const SPEC_LABEL: Record<SpecType, string> = {
  requirements: "Requisitos",
  design: "Design",
  architecture: "Arquitetura",
  contracts: "Contratos",
  edgeCases: "Edge Cases",
  security: "Segurança",
  testing: "Testes",
};

export const specStatusSchema = z.enum([
  "draft",
  "proposed",
  "approved",
  "implemented",
  "deprecated",
]);
export type SpecStatus = z.infer<typeof specStatusSchema>;

export const specificationSchema = traceableSchema
  .extend({
    kind: z.literal("specification"),
    specType: specTypeSchema,
    title: z.string().min(1),
    status: specStatusSchema.default("draft"),
    version: z.number().int().positive().default(1),
    // Conteúdo completo do arquivo de spec em markdown.
    content: z.string().default(""),
    createdAt: z.string(),
    updatedAt: z.string(),
  });
export type Specification = z.infer<typeof specificationSchema>;

/** Retorna os tipos de spec que precedem `type` na cascata. */
export function specPredecessors(type: SpecType): SpecType[] {
  const index = SPEC_CASCADE.indexOf(type);
  return index <= 0 ? [] : SPEC_CASCADE.slice(0, index);
}
