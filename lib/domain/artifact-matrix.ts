// Artifact Matrix V3 (ai/v3 — 005-artifact-matrix). Mecanismo de governança
// anti-bloat: define quais artefatos podem existir em cada scope
// (required / optional / forbidden) e as dependências entre eles.
// "Generate Only What Is Needed" — todo artefato precisa ter propósito.
import type { Scope } from "@/lib/domain/scope";

// Tipos de artefato governados pela matriz (vocabulário do doc 005). É um
// vocabulário próprio da matriz — o mapeamento para os SpecType do engine V2
// vive em SPEC_MATRIX_KEY abaixo.
export const ARTIFACT_TYPES = [
  "storySpec",
  "featureSpec",
  "productVision",
  "discoveries",
  "decisions",
  "contextPackages",
  "requirements",
  "design",
  "architecture",
  "contracts",
  "security",
  "testing",
  "tasks",
  "harness",
  "riskAnalysis",
  "migrationNotes",
  "traceability",
] as const;
export type ArtifactType = (typeof ARTIFACT_TYPES)[number];

// Disponibilidade de um artefato dentro de um scope.
// - required: deve ser gerado.
// - optional: pode ser gerado quando justificado (geração condicional, doc 005).
// - forbidden: nunca pode existir nesse scope (anti-bloat).
export type ArtifactAvailability = "required" | "optional" | "forbidden";

// A matriz oficial do doc 005. `testing` é sempre permitido (o nível varia, ver
// TESTING_LEVEL); aqui marcamos como required para que esteja sempre presente.
export const ARTIFACT_MATRIX: Record<ArtifactType, Record<Scope, ArtifactAvailability>> = {
  storySpec: { story: "required", feature: "optional", product: "optional" },
  featureSpec: { story: "forbidden", feature: "required", product: "optional" },
  productVision: { story: "forbidden", feature: "forbidden", product: "required" },
  discoveries: { story: "optional", feature: "optional", product: "required" },
  decisions: { story: "optional", feature: "required", product: "required" },
  contextPackages: { story: "forbidden", feature: "optional", product: "required" },
  requirements: { story: "required", feature: "required", product: "required" },
  design: { story: "forbidden", feature: "required", product: "required" },
  architecture: { story: "forbidden", feature: "optional", product: "required" },
  contracts: { story: "forbidden", feature: "required", product: "required" },
  security: { story: "forbidden", feature: "optional", product: "required" },
  testing: { story: "required", feature: "required", product: "required" },
  tasks: { story: "required", feature: "required", product: "required" },
  harness: { story: "required", feature: "required", product: "required" },
  riskAnalysis: { story: "forbidden", feature: "optional", product: "required" },
  migrationNotes: { story: "forbidden", feature: "optional", product: "optional" },
  traceability: { story: "optional", feature: "required", product: "required" },
};

// Nível da Testing Spec por scope (doc 005 — Testing Specification Levels).
export type TestingLevel = "basic" | "standard" | "comprehensive";
export const TESTING_LEVEL: Record<Scope, TestingLevel> = {
  story: "basic",
  feature: "standard",
  product: "comprehensive",
};

// Dependências entre artefatos (doc 005 — Artifact Dependency Rules / doc 009).
// Um artefato só pode ser gerado se todas as suas dependências existirem.
export const ARTIFACT_DEPENDENCIES: Partial<Record<ArtifactType, ArtifactType[]>> = {
  design: ["requirements"],
  architecture: ["requirements", "design"],
  contracts: ["requirements"],
  security: ["requirements", "design"],
  testing: ["requirements"],
  tasks: ["requirements"],
  harness: ["requirements"],
};

/** Disponibilidade de um artefato em um scope. */
export function availability(scope: Scope, artifact: ArtifactType): ArtifactAvailability {
  return ARTIFACT_MATRIX[artifact][scope];
}

/** True se o artefato pode existir no scope (required ou optional). */
export function isAllowed(scope: Scope, artifact: ArtifactType): boolean {
  return availability(scope, artifact) !== "forbidden";
}

/** True se o artefato é obrigatório no scope. */
export function isRequired(scope: Scope, artifact: ArtifactType): boolean {
  return availability(scope, artifact) === "required";
}

/** True se o artefato é proibido no scope. */
export function isForbidden(scope: Scope, artifact: ArtifactType): boolean {
  return availability(scope, artifact) === "forbidden";
}

/** Lista de artefatos obrigatórios do scope. */
export function requiredArtifacts(scope: Scope): ArtifactType[] {
  return ARTIFACT_TYPES.filter((a) => isRequired(scope, a));
}

/** Lista de artefatos opcionais do scope. */
export function optionalArtifacts(scope: Scope): ArtifactType[] {
  return ARTIFACT_TYPES.filter((a) => availability(scope, a) === "optional");
}

/** Lista de artefatos proibidos do scope. */
export function forbiddenArtifacts(scope: Scope): ArtifactType[] {
  return ARTIFACT_TYPES.filter((a) => isForbidden(scope, a));
}

// Mapeia os SpecType do engine V2 para a chave correspondente na matriz V3.
// `edgeCases` não tem entrada própria no doc 005 e recebe tratamento dedicado
// (EDGE_CASES_AVAILABILITY) para não vazar para o scope leve (story).
import type { SpecType } from "@/lib/domain/specs";
export const SPEC_MATRIX_KEY: Record<Exclude<SpecType, "edgeCases">, ArtifactType> = {
  requirements: "requirements",
  design: "design",
  architecture: "architecture",
  contracts: "contracts",
  security: "security",
  testing: "testing",
};

// Edge Cases é spec pesada: ausente em story, condicional em feature, exigida em
// product (mesma curva de design/security).
export const EDGE_CASES_AVAILABILITY: Record<Scope, ArtifactAvailability> = {
  story: "forbidden",
  feature: "optional",
  product: "required",
};

/** Disponibilidade de uma spec do engine V2 no scope dado. */
export function specAvailability(scope: Scope, specType: SpecType): ArtifactAvailability {
  if (specType === "edgeCases") return EDGE_CASES_AVAILABILITY[scope];
  return availability(scope, SPEC_MATRIX_KEY[specType]);
}

/** True se uma spec do engine V2 pode ser gerada no scope dado. */
export function isSpecAllowed(scope: Scope, specType: SpecType): boolean {
  return specAvailability(scope, specType) !== "forbidden";
}
