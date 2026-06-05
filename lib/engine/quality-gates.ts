// Quality Gates V2 (ai/v2 — 19-quality-gates). Checkpoints de validação que
// avaliam completude, consistência e rastreabilidade dos artefatos antes de
// avançar no pipeline. Geração sem validação é proibida.
import {
  checkProjectInvariants,
  type ProjectSnapshot,
} from "@/lib/domain/project";
import { SPEC_LABEL } from "@/lib/domain/specs";
import { CONSOLIDATED_SPEC_LABEL } from "@/lib/domain/consolidated-spec";
import type { Scope } from "@/lib/domain/scope";

export type GateOutcome = "pass" | "warning" | "revision" | "blocked";

const OUTCOME_RANK: Record<GateOutcome, number> = {
  pass: 0,
  warning: 1,
  revision: 2,
  blocked: 3,
};

export interface GateIssue {
  message: string;
  id?: string;
}

export interface GateResult {
  id: string;
  label: string;
  outcome: GateOutcome;
  issues: GateIssue[];
}

export interface QualityReport {
  results: GateResult[];
  // Pior resultado entre os gates (define se o artefato pode prosseguir).
  outcome: GateOutcome;
}

/** Retorna o pior outcome de uma lista (pass < warning < revision < blocked). */
export function worstOutcome(outcomes: GateOutcome[]): GateOutcome {
  return outcomes.reduce<GateOutcome>(
    (worst, current) => (OUTCOME_RANK[current] > OUTCOME_RANK[worst] ? current : worst),
    "pass",
  );
}

function gate(
  id: string,
  label: string,
  issues: GateIssue[],
  failOutcome: GateOutcome,
): GateResult {
  return {
    id,
    label,
    outcome: issues.length === 0 ? "pass" : failOutcome,
    issues,
  };
}

/**
 * Gates da camada de conhecimento (Knowledge Quality Gates do v2).
 * Avalia identidade, racional de decisões, evidência de discoveries e a
 * integridade de rastreabilidade do projeto.
 *
 * V3: scope-aware. A cobertura de identidade (Product DNA) só é exigida em
 * Product — Story/Feature não devem ser cobradas por isso (rigor proporcional).
 */
export function runKnowledgeGates(snapshot: ProjectSnapshot, scope?: Scope): QualityReport {
  const results: GateResult[] = [];

  // Identity Coverage — existe Product DNA? Só relevante para Product (ou quando
  // não há scope definido: comportamento project-wide do V2).
  if (scope === undefined || scope === "product") {
    const hasDna = snapshot.knowledge.some((k) => k.kind === "productDna");
    results.push(
      gate(
        "identity-coverage",
        "Identidade (Product DNA)",
        hasDna ? [] : [{ message: "Projeto sem Product DNA definido." }],
        "warning",
      ),
    );
  }

  // Decision Rationale — toda decisão preserva o porquê.
  const decisionIssues: GateIssue[] = snapshot.knowledge
    .filter((k) => k.kind === "decision")
    .filter((k) => k.kind === "decision" && k.rationale.trim() === "")
    .map((k) => ({ message: `${k.id} sem racional.`, id: k.id }));
  results.push(
    gate("decision-rationale", "Racional das decisões", decisionIssues, "revision"),
  );

  // Discovery Evidence — discoveries têm fonte ou evidência.
  const discoveryIssues: GateIssue[] = snapshot.knowledge
    .filter((k) => k.kind === "discovery")
    .filter(
      (k) =>
        k.kind === "discovery" &&
        k.source.trim() === "" &&
        k.evidence.trim() === "",
    )
    .map((k) => ({ message: `${k.id} sem fonte/evidência.`, id: k.id }));
  results.push(
    gate("discovery-evidence", "Evidência das discoveries", discoveryIssues, "warning"),
  );

  // Traceability Integrity — refs quebradas/órfãs/ciclos.
  const invariant = checkProjectInvariants(snapshot);
  const broken = invariant.filter(
    (i) => i.rule.startsWith("trace:broken") || i.rule.startsWith("trace:cycle"),
  );
  const orphan = invariant.filter((i) => i.rule.startsWith("trace:orphan"));
  results.push(
    gate(
      "traceability-integrity",
      "Integridade de rastreabilidade",
      broken.map((i) => ({ message: i.message, id: i.id })),
      "blocked",
    ),
  );
  results.push(
    gate(
      "traceability-origin",
      "Origens de artefatos derivados",
      orphan.map((i) => ({ message: i.message, id: i.id })),
      "revision",
    ),
  );

  return { results, outcome: worstOutcome(results.map((r) => r.outcome)) };
}

/**
 * Gates da camada de specs (Specification Gates do v2). Avalia conteúdo, origem
 * (rastreabilidade) e cobertura da base da cascata (requisitos).
 *
 * V3: scope-aware. Considera tanto specs por-tipo quanto specs consolidados
 * (Story/Feature). A base da cascata (Requisitos) só é exigida em Product —
 * Story/Feature usam um documento consolidado, não a cascata.
 */
export function runSpecGates(snapshot: ProjectSnapshot, scope?: Scope): QualityReport {
  const results: GateResult[] = [];

  // Lista unificada: specs por-tipo + consolidados.
  const allSpecs = [
    ...snapshot.specifications.map((s) => ({
      id: s.id,
      label: SPEC_LABEL[s.specType],
      content: s.content,
      traceRefs: s.traceRefs,
    })),
    ...snapshot.consolidatedSpecs.map((s) => ({
      id: s.id,
      label: CONSOLIDATED_SPEC_LABEL[s.format],
      content: s.content,
      traceRefs: s.traceRefs,
    })),
  ];

  const emptyIssues: GateIssue[] = allSpecs
    .filter((s) => s.content.trim() === "")
    .map((s) => ({ message: `${s.id} (${s.label}) sem conteúdo.`, id: s.id }));
  results.push(gate("spec-content", "Conteúdo das specs", emptyIssues, "revision"));

  const originIssues: GateIssue[] = allSpecs
    .filter((s) => s.traceRefs.length === 0)
    .map((s) => ({ message: `${s.id} sem origem (traceRefs).`, id: s.id }));
  results.push(gate("spec-origin", "Origem das specs", originIssues, "revision"));

  // Base da cascata: só faz sentido em Product (ou sem scope — V2).
  if (scope === undefined || scope === "product") {
    const hasRequirements = snapshot.specifications.some((s) => s.specType === "requirements");
    results.push(
      gate(
        "spec-foundation",
        "Base da cascata (Requisitos)",
        snapshot.specifications.length > 0 && !hasRequirements
          ? [{ message: "Há specs sem a Requirements Specification (base da cascata)." }]
          : [],
        "warning",
      ),
    );
  }

  return { results, outcome: worstOutcome(results.map((r) => r.outcome)) };
}
