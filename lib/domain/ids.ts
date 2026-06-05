// IDs rastreáveis do modelo de conhecimento V2 (ai/v2 — Traceability Model).
// Cada artefato durável tem um ID com prefixo estável (DISC-001, DEC-002, ...)
// para que specs, harness e tasks possam referenciar suas origens.

// Tipos de artefato que participam da rastreabilidade.
export type ArtifactKind =
  | "project"
  | "initiative"
  | "discovery"
  | "decision"
  | "constraint"
  | "principle"
  | "risk"
  | "assumption"
  | "productDna"
  | "contextPackage"
  | "clarification"
  | "specification"
  | "consolidatedSpec"
  | "harness"
  | "agentRules"
  | "providerArtifact"
  | "task"
  | "qualityGate";

// Prefixo estável por tipo (ver docs da Camada 2/3/4 do v2).
export const ID_PREFIX: Record<ArtifactKind, string> = {
  project: "PROJ",
  initiative: "INIT",
  discovery: "DISC",
  decision: "DEC",
  constraint: "CONST",
  principle: "PRIN",
  risk: "RISK",
  assumption: "ASMP",
  productDna: "DNA",
  contextPackage: "CTX",
  clarification: "CLAR",
  specification: "SPEC",
  consolidatedSpec: "CSPEC",
  harness: "HAR",
  agentRules: "AGENT",
  providerArtifact: "ART",
  task: "TASK",
  qualityGate: "GATE",
};

const ID_PATTERN = /^([A-Z]+)-(\d+)$/;

/** Extrai o número sequencial de um ID (`DISC-014` → 14), ou null se não casar. */
export function idSequence(id: string): number | null {
  const match = ID_PATTERN.exec(id.trim());
  if (!match) return null;
  const value = Number.parseInt(match[2] as string, 10);
  return Number.isFinite(value) ? value : null;
}

/**
 * Gera o próximo ID para um tipo, dado o conjunto de IDs já existentes.
 * Calcula o maior sequencial atual do mesmo prefixo e soma 1, formatando com
 * pelo menos 3 dígitos (DISC-001, DISC-014, DISC-1000).
 */
export function nextId(kind: ArtifactKind, existingIds: Iterable<string>): string {
  const prefix = ID_PREFIX[kind];
  let max = 0;
  for (const id of existingIds) {
    const match = ID_PATTERN.exec(id.trim());
    if (!match || match[1] !== prefix) continue;
    const seq = Number.parseInt(match[2] as string, 10);
    if (Number.isFinite(seq) && seq > max) max = seq;
  }
  const next = max + 1;
  return `${prefix}-${String(next).padStart(3, "0")}`;
}

/** Verifica se um valor tem o formato de ID de artefato (`PREFIXO-000`). */
export function isArtifactId(value: string): boolean {
  return ID_PATTERN.test(value.trim());
}

/** Identificador interno único (chave de armazenamento), não rastreável ao usuário. */
export function newUid(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `uid-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
