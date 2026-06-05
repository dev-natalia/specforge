// Harness + Provider Adapters V2 (ai/v2 — Camada 5/6).
// Harness é o ambiente operacional provider-neutro; os Provider Artifacts são a
// tradução para cada provider (CLAUDE.md, .cursor/rules, etc.).
import { z } from "zod";
import { traceableSchema } from "@/lib/domain/traceability";
import type { Scope } from "@/lib/domain/scope";

// Camadas do Harness (29-harness-model — Harness Architecture).
export const HARNESS_LAYERS = [
  "identity",
  "behavioral",
  "architecture",
  "security",
  "testing",
  "documentation",
  "quality",
  "review",
  "execution",
] as const;
export type HarnessLayer = (typeof HARNESS_LAYERS)[number];

// Harness Progressivo (ai/v3 — 015): as camadas ativas escalam com o scope.
// Story → guia leve (executar); Feature → coordenação (design/integração);
// Product → governança (todas as camadas, incl. arquitetura e segurança).
export const HARNESS_LAYER_PROFILE: Record<Scope, HarnessLayer[]> = {
  story: ["identity", "behavioral", "testing", "quality", "review", "execution"],
  feature: [
    "identity",
    "behavioral",
    "architecture",
    "testing",
    "documentation",
    "quality",
    "review",
    "execution",
  ],
  product: [...HARNESS_LAYERS],
};

/** Camadas do harness ativas para um scope (doc 015). */
export function activeHarnessLayers(scope: Scope): HarnessLayer[] {
  return HARNESS_LAYER_PROFILE[scope];
}

/** True se a camada do harness é ativa no scope. */
export function isHarnessLayerActive(scope: Scope, layer: HarnessLayer): boolean {
  return HARNESS_LAYER_PROFILE[scope].includes(layer);
}

const harnessLayersSchema = z.object({
  identity: z.string().default(""),
  behavioral: z.string().default(""),
  architecture: z.string().default(""),
  security: z.string().default(""),
  testing: z.string().default(""),
  documentation: z.string().default(""),
  quality: z.string().default(""),
  review: z.string().default(""),
  execution: z.string().default(""),
});

export const harnessSchema = traceableSchema.extend({
  kind: z.literal("harness"),
  title: z.string().min(1),
  purpose: z.string().default(""),
  scope: z.string().default(""),
  layers: harnessLayersSchema,
  // Comportamentos proibidos explícitos (anti-padrões).
  prohibited: z.array(z.string()).default([]),
  version: z.number().int().positive().default(1),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type Harness = z.infer<typeof harnessSchema>;

// Agent Rules (32-agent-rules) — constituição comportamental provider-neutra.
export const agentRulesSchema = traceableSchema.extend({
  kind: z.literal("agentRules"),
  rules: z.array(z.string()).default([]),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type AgentRules = z.infer<typeof agentRulesSchema>;

// Providers de saída suportados (os 4 adapters desta rodada).
export const providerSchema = z.enum(["claude", "cursor", "gpt", "gemini"]);
export type Provider = z.infer<typeof providerSchema>;

// Caminho de saída padrão de cada provider (35-provider-adapters).
export const PROVIDER_OUTPUT_PATH: Record<Provider, string> = {
  claude: "CLAUDE.md",
  cursor: ".cursor/rules",
  gpt: "GPT_INSTRUCTIONS.md",
  gemini: "GEMINI_INSTRUCTIONS.md",
};

export const PROVIDER_LABEL: Record<Provider, string> = {
  claude: "Claude",
  cursor: "Cursor",
  gpt: "GPT",
  gemini: "Gemini",
};

// Artefato gerado para um provider específico, traduzido do harness.
export const providerArtifactSchema = traceableSchema.extend({
  kind: z.literal("providerArtifact"),
  provider: providerSchema,
  path: z.string().min(1),
  content: z.string().default(""),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type ProviderArtifact = z.infer<typeof providerArtifactSchema>;
