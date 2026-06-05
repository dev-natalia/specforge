// Agregado Project V2 (ai/v2 — 38-domain-model). O Project é a fronteira
// organizacional de topo: possui conhecimento, specs, harness, tasks e
// artefatos de provider. Invariantes do Domain Model são checados aqui.
import { z } from "zod";
import { initiativeSchema, type Initiative } from "@/lib/domain/initiative";
import { knowledgeObjectSchema, type KnowledgeObject } from "@/lib/domain/knowledge";
import { clarificationSchema, type Clarification } from "@/lib/domain/clarification";
import { specificationSchema, type Specification } from "@/lib/domain/specs";
import { consolidatedSpecSchema, type ConsolidatedSpec } from "@/lib/domain/consolidated-spec";
import {
  harnessSchema,
  agentRulesSchema,
  providerArtifactSchema,
  type Harness,
  type AgentRules,
  type ProviderArtifact,
} from "@/lib/domain/harness";
import { taskSchema, type Task } from "@/lib/domain/task";
import { checkTraceIntegrity, type Traceable, type TraceIssue } from "@/lib/domain/traceability";
import { nextId } from "@/lib/domain/ids";
import { isSpecAllowed, isAllowed } from "@/lib/domain/artifact-matrix";

// Metadados do projeto (a "raiz" do agregado).
export const projectSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().default(""),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type Project = z.infer<typeof projectSchema>;

// Snapshot completo do projeto — usado pelo pipeline e pelo export/import.
// V3: `initiatives` são as unidades de trabalho (scope por iniciativa); os
// artefatos duráveis seguem achatados e ligados à iniciativa por `initiativeId`.
export const projectSnapshotSchema = z.object({
  project: projectSchema,
  initiatives: z.array(initiativeSchema).default([]),
  knowledge: z.array(knowledgeObjectSchema).default([]),
  clarifications: z.array(clarificationSchema).default([]),
  specifications: z.array(specificationSchema).default([]),
  consolidatedSpecs: z.array(consolidatedSpecSchema).default([]),
  harnesses: z.array(harnessSchema).default([]),
  agentRules: z.array(agentRulesSchema).default([]),
  providerArtifacts: z.array(providerArtifactSchema).default([]),
  tasks: z.array(taskSchema).default([]),
});
export type ProjectSnapshot = z.infer<typeof projectSnapshotSchema>;

export interface ProjectSnapshotInput {
  project: Project;
  initiatives?: Initiative[];
  knowledge?: KnowledgeObject[];
  clarifications?: Clarification[];
  specifications?: Specification[];
  consolidatedSpecs?: ConsolidatedSpec[];
  harnesses?: Harness[];
  agentRules?: AgentRules[];
  providerArtifacts?: ProviderArtifact[];
  tasks?: Task[];
}

/** Cria um snapshot vazio para um projeto recém-criado. */
export function emptySnapshot(project: Project): ProjectSnapshot {
  return {
    project,
    initiatives: [],
    knowledge: [],
    clarifications: [],
    specifications: [],
    consolidatedSpecs: [],
    harnesses: [],
    agentRules: [],
    providerArtifacts: [],
    tasks: [],
  };
}

/** Reúne todos os artefatos rastreáveis do snapshot numa lista única. */
export function collectTraceables(snapshot: ProjectSnapshot): Traceable[] {
  return [
    ...snapshot.knowledge,
    ...snapshot.clarifications,
    ...snapshot.specifications,
    ...snapshot.consolidatedSpecs,
    ...snapshot.harnesses,
    ...snapshot.agentRules,
    ...snapshot.providerArtifacts,
    ...snapshot.tasks,
  ];
}

export interface ProjectInvariantIssue {
  rule: string;
  message: string;
  id?: string;
}

/**
 * Valida os invariantes do Domain Model:
 * - specs/harness/tasks/artefatos derivados devem referenciar origens;
 * - rastreabilidade íntegra (sem refs quebradas/órfãs/ciclos);
 * - todo provider artifact referencia um harness.
 */
export function checkProjectInvariants(snapshot: ProjectSnapshot): ProjectInvariantIssue[] {
  const issues: ProjectInvariantIssue[] = [];
  const harnessIds = new Set(snapshot.harnesses.map((h) => h.id));

  // Artefatos derivados que exigem origem.
  const requireOrigin: string[] = [
    ...snapshot.specifications.map((s) => s.id),
    ...snapshot.consolidatedSpecs.map((s) => s.id),
    ...snapshot.harnesses.map((h) => h.id),
    ...snapshot.tasks.map((t) => t.id),
    ...snapshot.providerArtifacts.map((a) => a.id),
  ];

  const traceIssues: TraceIssue[] = checkTraceIntegrity(
    collectTraceables(snapshot),
    requireOrigin,
  );
  for (const issue of traceIssues) {
    issues.push({ rule: `trace:${issue.kind}`, message: issue.message, id: issue.id });
  }

  // Todo provider artifact deve referenciar um harness existente.
  for (const artifact of snapshot.providerArtifacts) {
    const hasHarness = artifact.traceRefs.some((ref) => harnessIds.has(ref));
    if (!hasHarness) {
      issues.push({
        rule: "providerArtifact:requiresHarness",
        message: `${artifact.id} (${artifact.provider}) não referencia nenhum harness.`,
        id: artifact.id,
      });
    }
  }

  // V3: todo artefato deve apontar para uma iniciativa existente (após migração).
  const initiativeById = new Map(snapshot.initiatives.map((i) => [i.id, i]));
  for (const artifact of snapshotArtifacts(snapshot)) {
    if (!artifact.initiativeId) continue; // legado pré-migração: tolerado
    if (!initiativeById.has(artifact.initiativeId)) {
      issues.push({
        rule: "initiative:brokenRef",
        message: `${artifact.id} referencia iniciativa inexistente ${artifact.initiativeId}.`,
        id: artifact.id,
      });
    }
  }

  // V3: nenhuma spec proibida pelo scope da sua iniciativa (matriz de artefatos).
  for (const spec of snapshot.specifications) {
    const initiative = spec.initiativeId ? initiativeById.get(spec.initiativeId) : undefined;
    if (!initiative) continue;
    if (!isSpecAllowed(initiative.scope, spec.specType)) {
      issues.push({
        rule: "matrix:forbiddenSpec",
        message: `${spec.id} (${spec.specType}) é proibida no scope ${initiative.scope}.`,
        id: spec.id,
      });
    }
  }

  // V3: spec consolidado (story/feature) deve ser permitido pelo scope.
  for (const spec of snapshot.consolidatedSpecs) {
    const initiative = spec.initiativeId ? initiativeById.get(spec.initiativeId) : undefined;
    if (!initiative) continue;
    const key = spec.format === "story" ? "storySpec" : "featureSpec";
    if (!isAllowed(initiative.scope, key)) {
      issues.push({
        rule: "matrix:forbiddenSpec",
        message: `${spec.id} (${spec.format} spec) é proibido no scope ${initiative.scope}.`,
        id: spec.id,
      });
    }
  }

  return issues;
}

// ── Initiatives (V3) ────────────────────────────────────────────────────────

/** Reúne os artefatos duráveis (Traceables) do snapshot, sem as iniciativas. */
function snapshotArtifacts(snapshot: ProjectSnapshot): Traceable[] {
  return collectTraceables(snapshot);
}

/**
 * Migração local-first: garante que todo snapshot tenha ao menos uma Initiative.
 * Projetos legados (V2) têm artefatos achatados sem `initiativeId` — eles são
 * adotados por uma iniciativa `product` padrão, preservando o comportamento V2.
 * Idempotente: se já houver iniciativas e nenhum artefato órfão, devolve igual.
 */
export function ensureInitiatives(snapshot: ProjectSnapshot): ProjectSnapshot {
  const artifacts = snapshotArtifacts(snapshot);
  const untagged = artifacts.filter((a) => !a.initiativeId);

  // Nada a adotar: projeto novo/vazio ou já totalmente migrado. Não criamos
  // iniciativas especulativas — em V3 a iniciativa nasce com scope escolhido.
  if (untagged.length === 0) return snapshot;

  // Iniciativa de adoção: reutiliza a primeira product existente, ou cria uma.
  let target = snapshot.initiatives.find((i) => i.scope === "product");
  let initiatives = snapshot.initiatives;
  if (!target) {
    const now = snapshot.project.updatedAt || new Date().toISOString();
    target = {
      kind: "initiative",
      id: nextId("initiative", snapshot.initiatives.map((i) => i.id)),
      title: snapshot.project.name || "Iniciativa principal",
      intent: snapshot.project.description ?? "",
      scope: "product",
      scopeHistory: [],
      status: "generated",
      createdAt: snapshot.project.createdAt || now,
      updatedAt: now,
    };
    initiatives = [...snapshot.initiatives, target];
  }

  const targetId = target.id;
  const tag = <T extends Traceable>(items: T[]): T[] =>
    items.map((item) => (item.initiativeId ? item : { ...item, initiativeId: targetId }));

  return {
    ...snapshot,
    initiatives,
    knowledge: tag(snapshot.knowledge),
    clarifications: tag(snapshot.clarifications),
    specifications: tag(snapshot.specifications),
    consolidatedSpecs: tag(snapshot.consolidatedSpecs),
    harnesses: tag(snapshot.harnesses),
    agentRules: tag(snapshot.agentRules),
    providerArtifacts: tag(snapshot.providerArtifacts),
    tasks: tag(snapshot.tasks),
  };
}

/**
 * Recorta o snapshot para uma única iniciativa: filtra os artefatos pelo
 * `initiativeId`. O resultado tem o shape de ProjectSnapshot, de modo que o
 * engine V2 (spec/harness/task gen, quality gates) roda sem alteração por
 * iniciativa. Para iniciativas `product` isso é a execução V2 completa.
 */
export function initiativeSnapshot(
  snapshot: ProjectSnapshot,
  initiativeId: string,
): ProjectSnapshot {
  const belongs = <T extends Traceable>(items: T[]): T[] =>
    items.filter((item) => item.initiativeId === initiativeId);
  const initiative = snapshot.initiatives.find((i) => i.id === initiativeId);
  return {
    project: snapshot.project,
    initiatives: initiative ? [initiative] : [],
    knowledge: belongs(snapshot.knowledge),
    clarifications: belongs(snapshot.clarifications),
    specifications: belongs(snapshot.specifications),
    consolidatedSpecs: belongs(snapshot.consolidatedSpecs),
    harnesses: belongs(snapshot.harnesses),
    agentRules: belongs(snapshot.agentRules),
    providerArtifacts: belongs(snapshot.providerArtifacts),
    tasks: belongs(snapshot.tasks),
  };
}

/** Slug seguro a partir do nome do projeto (reuso da lógica do zip). */
export function projectSlug(name: string): string {
  return (
    name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || "projeto"
  );
}
