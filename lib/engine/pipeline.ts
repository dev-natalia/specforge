// Progressive Pipeline V3 (ai/v3 — 008-progressive-pipeline / 009-composition).
// Um único engine, múltiplos perfis: o scope decide quais STAGES executam. Este
// módulo compõe o pipeline (stages habilitados, em ordem de dependência),
// suporta inserção condicional (ex.: Security quando há auth) e valida o plano.
//
// Camadas autoritativas: stages → 008/009; artefatos → 005 (artifact-matrix).
import type { Scope } from "@/lib/domain/scope";

// Stages reutilizáveis do engine (doc 008 — Pipeline Components).
export const STAGES = [
  "intentCapture",
  "scopeResolution",
  "clarification",
  "knowledgeCollection",
  "requirements",
  "design",
  "architecture",
  "contracts",
  "security",
  "testing",
  "harness",
  "tasks",
  "providerOutputs",
] as const;
export type Stage = (typeof STAGES)[number];

// Dependências de cada stage (doc 009 — Stage Dependency Rules). Um stage só
// executa depois que todas as suas dependências executaram.
export const STAGE_DEPENDENCIES: Record<Stage, Stage[]> = {
  intentCapture: [],
  scopeResolution: ["intentCapture"],
  clarification: ["intentCapture", "scopeResolution"],
  knowledgeCollection: ["clarification"],
  requirements: ["clarification"],
  design: ["requirements"],
  architecture: ["requirements", "design"],
  contracts: ["requirements"],
  security: ["requirements", "design"],
  testing: ["requirements"],
  harness: ["requirements"],
  tasks: ["requirements"],
  providerOutputs: ["harness", "tasks"],
};

export type StageAvailability = "required" | "optional" | "forbidden";

// Perfil de pipeline por scope (doc 008/009). Stages estruturais (intent,
// scope, clarification, providerOutputs) existem em todos os scopes.
export const STAGE_PROFILE: Record<Scope, Record<Stage, StageAvailability>> = {
  story: {
    intentCapture: "required",
    scopeResolution: "required",
    clarification: "required",
    knowledgeCollection: "forbidden",
    requirements: "required",
    design: "forbidden",
    architecture: "forbidden",
    contracts: "forbidden",
    security: "forbidden",
    testing: "optional",
    harness: "required",
    tasks: "required",
    providerOutputs: "required",
  },
  feature: {
    intentCapture: "required",
    scopeResolution: "required",
    clarification: "required",
    knowledgeCollection: "required",
    requirements: "required",
    design: "required",
    architecture: "optional",
    contracts: "required",
    security: "optional",
    testing: "required",
    harness: "required",
    tasks: "required",
    providerOutputs: "required",
  },
  product: {
    intentCapture: "required",
    scopeResolution: "required",
    clarification: "required",
    knowledgeCollection: "required",
    requirements: "required",
    design: "required",
    architecture: "required",
    contracts: "required",
    security: "required",
    testing: "required",
    harness: "required",
    tasks: "required",
    providerOutputs: "required",
  },
};

// Condições que ativam stages opcionais (doc 009 — Conditional Stage Activation).
export interface PipelineSignals {
  // Autenticação/autorização/dados sensíveis/regulatório → Security.
  security?: boolean;
  // Múltiplos serviços/decisões técnicas significativas/distribuído → Architecture.
  architecture?: boolean;
}

export interface ComposedPipeline {
  scope: Scope;
  // Stages habilitados, em ordem topológica válida.
  stages: Stage[];
}

export interface PipelineIssue {
  rule: string;
  message: string;
  stage?: Stage;
}

function availabilityOf(scope: Scope, stage: Stage): StageAvailability {
  return STAGE_PROFILE[scope][stage];
}

/** True se o stage pode executar no scope (required ou optional). */
export function isStageAllowed(scope: Scope, stage: Stage): boolean {
  return availabilityOf(scope, stage) !== "forbidden";
}

/** True se o stage é proibido no scope. */
export function isStageForbidden(scope: Scope, stage: Stage): boolean {
  return availabilityOf(scope, stage) === "forbidden";
}

/**
 * Compõe o pipeline para um scope. Inclui todos os stages `required` e os
 * `optional` cujo sinal condicional estiver presente. Os stages saem em ordem
 * topológica (dependências antes dos dependentes), seguindo a ordem de STAGES.
 */
export function composePipeline(scope: Scope, signals: PipelineSignals = {}): ComposedPipeline {
  const optionalEnabled: Partial<Record<Stage, boolean>> = {
    security: signals.security === true,
    architecture: signals.architecture === true,
    // Demais opcionais (ex.: testing em story) entram quando required no perfil.
  };

  const enabled = new Set<Stage>();
  for (const stage of STAGES) {
    const avail = availabilityOf(scope, stage);
    if (avail === "required") enabled.add(stage);
    else if (avail === "optional" && optionalEnabled[stage]) enabled.add(stage);
  }

  // STAGES já está em ordem de dependência; preservamos essa ordem.
  const stages = STAGES.filter((s) => enabled.has(s));
  return { scope, stages };
}

/**
 * Valida um conjunto de stages contra o scope: nenhum stage proibido e todas as
 * dependências presentes (doc 009 — Validation Rules / Invalid Pipeline).
 */
export function validatePipeline(scope: Scope, stages: Stage[]): PipelineIssue[] {
  const issues: PipelineIssue[] = [];
  const present = new Set(stages);

  for (const stage of stages) {
    if (isStageForbidden(scope, stage)) {
      issues.push({
        rule: "stage:forbidden",
        message: `Stage "${stage}" é proibido no scope ${scope}.`,
        stage,
      });
    }
    for (const dep of STAGE_DEPENDENCIES[stage]) {
      if (!present.has(dep)) {
        issues.push({
          rule: "stage:missingDependency",
          message: `Stage "${stage}" depende de "${dep}", ausente no pipeline.`,
          stage,
        });
      }
    }
  }

  return issues;
}
