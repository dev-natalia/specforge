// Consolidated Spec V3 (ai/v3 — 010-story-spec / 011-feature-spec). Para os
// scopes Story e Feature, a especificação é um DOCUMENTO ÚNICO consolidado (não
// as specs por-tipo em cascata do V2). É um artefato derivado do conhecimento,
// rastreável, com o markdown completo no campo `content`.
import { z } from "zod";
import { traceableSchema } from "@/lib/domain/traceability";
import { specStatusSchema } from "@/lib/domain/specs";

// O formato do documento consolidado segue o scope da iniciativa.
export const consolidatedSpecFormatSchema = z.enum(["story", "feature"]);
export type ConsolidatedSpecFormat = z.infer<typeof consolidatedSpecFormatSchema>;

export const CONSOLIDATED_SPEC_LABEL: Record<ConsolidatedSpecFormat, string> = {
  story: "Story Specification",
  feature: "Feature Specification",
};

export const CONSOLIDATED_SPEC_FILENAME: Record<ConsolidatedSpecFormat, string> = {
  story: "story-spec.md",
  feature: "feature-spec.md",
};

export const consolidatedSpecSchema = traceableSchema.extend({
  kind: z.literal("consolidatedSpec"),
  format: consolidatedSpecFormatSchema,
  title: z.string().min(1),
  status: specStatusSchema.default("draft"),
  version: z.number().int().positive().default(1),
  // Markdown completo do documento consolidado.
  content: z.string().default(""),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type ConsolidatedSpec = z.infer<typeof consolidatedSpecSchema>;
