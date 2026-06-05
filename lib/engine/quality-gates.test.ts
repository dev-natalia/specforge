import { describe, it, expect } from "vitest";
import {
  runKnowledgeGates,
  runSpecGates,
  worstOutcome,
} from "@/lib/engine/quality-gates";
import { emptySnapshot, type Project } from "@/lib/domain/project";
import type { Decision, Discovery, ProductDna } from "@/lib/domain/knowledge";

const now = "2026-06-05T00:00:00.000Z";
const project: Project = {
  id: "PROJ-001",
  name: "Demo",
  slug: "demo",
  description: "",
  createdAt: now,
  updatedAt: now,
};

describe("worstOutcome", () => {
  it("retorna o pior outcome", () => {
    expect(worstOutcome(["pass", "warning", "revision"])).toBe("revision");
    expect(worstOutcome(["pass", "pass"])).toBe("pass");
    expect(worstOutcome(["warning", "blocked"])).toBe("blocked");
  });
});

describe("runKnowledgeGates", () => {
  it("acusa falta de Product DNA como warning", () => {
    const report = runKnowledgeGates(emptySnapshot(project));
    const identity = report.results.find((r) => r.id === "identity-coverage");
    expect(identity?.outcome).toBe("warning");
  });

  it("acusa decisão sem racional como revision", () => {
    const snapshot = emptySnapshot(project);
    const decision: Decision = {
      kind: "decision",
      id: "DEC-001",
      title: "X",
      category: "product",
      context: "",
      decision: "fazer X",
      rationale: "",
      alternatives: [],
      tradeoffs: "",
      consequences: "",
      version: 1,
      traceRefs: [],
      createdAt: now,
      updatedAt: now,
    };
    snapshot.knowledge.push(decision);
    const report = runKnowledgeGates(snapshot);
    const gate = report.results.find((r) => r.id === "decision-rationale");
    expect(gate?.outcome).toBe("revision");
    expect(report.outcome).toBe("revision");
  });

  it("passa quando há DNA, decisão com racional e discovery com fonte", () => {
    const snapshot = emptySnapshot(project);
    const dna: ProductDna = {
      kind: "productDna",
      id: "DNA-001",
      mission: "m",
      vision: "",
      problemStatement: "",
      audience: "",
      coreBeliefs: [],
      principles: [],
      constraints: [],
      nonGoals: [],
      personality: [],
      decisionFilters: [],
      traceRefs: [],
      createdAt: now,
      updatedAt: now,
    };
    const discovery: Discovery = {
      kind: "discovery",
      id: "DISC-001",
      title: "d",
      category: "user",
      description: "",
      source: "entrevista",
      evidence: "",
      implications: "",
      confidence: "low",
      traceRefs: [],
      createdAt: now,
      updatedAt: now,
    };
    snapshot.knowledge.push(dna, discovery);
    const report = runKnowledgeGates(snapshot);
    expect(report.outcome).toBe("pass");
  });
});

describe("runSpecGates", () => {
  it("acusa spec sem origem como revision", () => {
    const snapshot = emptySnapshot(project);
    snapshot.specifications.push({
      kind: "specification",
      id: "SPEC-001",
      specType: "requirements",
      title: "Requisitos",
      status: "draft",
      version: 1,
      content: "# Requisitos",
      traceRefs: [],
      createdAt: now,
      updatedAt: now,
    });
    const report = runSpecGates(snapshot);
    expect(report.results.find((r) => r.id === "spec-origin")?.outcome).toBe("revision");
  });

  it("passa quando a spec tem conteúdo e origem", () => {
    const snapshot = emptySnapshot(project);
    snapshot.specifications.push({
      kind: "specification",
      id: "SPEC-001",
      specType: "requirements",
      title: "Requisitos",
      status: "draft",
      version: 1,
      content: "# Requisitos\nRF-001",
      traceRefs: ["DEC-001"],
      createdAt: now,
      updatedAt: now,
    });
    expect(runSpecGates(snapshot).outcome).toBe("pass");
  });
});

describe("gates scope-aware (V3)", () => {
  it("Story não cobra Product DNA (sem gate de identidade)", () => {
    const report = runKnowledgeGates(emptySnapshot(project), "story");
    expect(report.results.find((r) => r.id === "identity-coverage")).toBeUndefined();
    expect(report.outcome).toBe("pass");
  });

  it("Product continua cobrando Product DNA", () => {
    const report = runKnowledgeGates(emptySnapshot(project), "product");
    expect(report.results.find((r) => r.id === "identity-coverage")?.outcome).toBe("warning");
  });

  it("Feature não tem gate de base de cascata, mas valida o spec consolidado", () => {
    const snapshot = emptySnapshot(project);
    snapshot.consolidatedSpecs.push({
      kind: "consolidatedSpec",
      id: "CSPEC-001",
      format: "feature",
      title: "Feature Specification",
      status: "draft",
      version: 1,
      content: "# Feature Specification",
      traceRefs: [], // sem origem → revision
      createdAt: now,
      updatedAt: now,
    });
    const report = runSpecGates(snapshot, "feature");
    expect(report.results.find((r) => r.id === "spec-foundation")).toBeUndefined();
    expect(report.results.find((r) => r.id === "spec-origin")?.outcome).toBe("revision");
  });

  it("Story passa com spec consolidado completo", () => {
    const snapshot = emptySnapshot(project);
    snapshot.consolidatedSpecs.push({
      kind: "consolidatedSpec",
      id: "CSPEC-001",
      format: "story",
      title: "Story Specification",
      status: "draft",
      version: 1,
      content: "# Story Specification\nREQ-001",
      traceRefs: ["DISC-001"],
      createdAt: now,
      updatedAt: now,
    });
    expect(runSpecGates(snapshot, "story").outcome).toBe("pass");
  });
});
