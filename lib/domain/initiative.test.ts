import { describe, it, expect } from "vitest";
import {
  emptySnapshot,
  ensureInitiatives,
  initiativeSnapshot,
  checkProjectInvariants,
  type Project,
  type ProjectSnapshot,
} from "@/lib/domain/project";
import type { Discovery } from "@/lib/domain/knowledge";
import type { Specification } from "@/lib/domain/specs";
import type { Initiative } from "@/lib/domain/initiative";

const now = "2026-06-05T00:00:00.000Z";

function makeProject(): Project {
  return { id: "PROJ-001", name: "Demo", slug: "demo", description: "", createdAt: now, updatedAt: now };
}

function discovery(id: string, initiativeId?: string): Discovery {
  return {
    kind: "discovery",
    id,
    title: id,
    category: "user",
    description: "",
    source: "",
    evidence: "",
    implications: "",
    confidence: "low",
    traceRefs: [],
    ...(initiativeId ? { initiativeId } : {}),
    createdAt: now,
    updatedAt: now,
  };
}

function spec(id: string, specType: Specification["specType"], initiativeId: string): Specification {
  return {
    kind: "specification",
    id,
    specType,
    title: specType,
    status: "draft",
    version: 1,
    content: "",
    traceRefs: ["DISC-001"],
    initiativeId,
    createdAt: now,
    updatedAt: now,
  };
}

function initiative(id: string, scope: Initiative["scope"]): Initiative {
  return {
    kind: "initiative",
    id,
    title: id,
    intent: "",
    scope,
    scopeHistory: [],
    status: "draft",
    createdAt: now,
    updatedAt: now,
  };
}

describe("ensureInitiatives (migração V3)", () => {
  it("não cria iniciativa para projeto novo vazio", () => {
    const migrated = ensureInitiatives(emptySnapshot(makeProject()));
    expect(migrated.initiatives).toHaveLength(0);
  });

  it("adota artefatos legados órfãos numa iniciativa product", () => {
    const snapshot: ProjectSnapshot = emptySnapshot(makeProject());
    snapshot.knowledge.push(discovery("DISC-001"));
    snapshot.knowledge.push(discovery("DISC-002"));

    const migrated = ensureInitiatives(snapshot);
    expect(migrated.initiatives).toHaveLength(1);
    const init = migrated.initiatives[0]!;
    expect(init.scope).toBe("product");
    expect(migrated.knowledge.every((k) => k.initiativeId === init.id)).toBe(true);
  });

  it("é idempotente: artefatos já marcados não mudam", () => {
    const snapshot: ProjectSnapshot = emptySnapshot(makeProject());
    snapshot.initiatives.push(initiative("INIT-001", "feature"));
    snapshot.knowledge.push(discovery("DISC-001", "INIT-001"));

    const migrated = ensureInitiatives(snapshot);
    expect(migrated).toBe(snapshot); // retorno cedo, sem cópia
    expect(migrated.initiatives).toHaveLength(1);
  });

  it("adota órfãos numa product existente em vez de criar outra", () => {
    const snapshot: ProjectSnapshot = emptySnapshot(makeProject());
    snapshot.initiatives.push(initiative("INIT-009", "product"));
    snapshot.knowledge.push(discovery("DISC-001")); // órfão

    const migrated = ensureInitiatives(snapshot);
    expect(migrated.initiatives).toHaveLength(1);
    expect(migrated.knowledge[0]?.initiativeId).toBe("INIT-009");
  });
});

describe("initiativeSnapshot (adapter por iniciativa)", () => {
  it("recorta os artefatos pela iniciativa", () => {
    const snapshot: ProjectSnapshot = emptySnapshot(makeProject());
    snapshot.initiatives.push(initiative("INIT-001", "story"), initiative("INIT-002", "feature"));
    snapshot.knowledge.push(discovery("DISC-001", "INIT-001"), discovery("DISC-002", "INIT-002"));

    const view = initiativeSnapshot(snapshot, "INIT-001");
    expect(view.initiatives.map((i) => i.id)).toEqual(["INIT-001"]);
    expect(view.knowledge.map((k) => k.id)).toEqual(["DISC-001"]);
  });
});

describe("invariantes V3", () => {
  it("acusa spec proibida pelo scope da iniciativa", () => {
    const snapshot: ProjectSnapshot = emptySnapshot(makeProject());
    snapshot.initiatives.push(initiative("INIT-001", "story"));
    snapshot.knowledge.push(discovery("DISC-001", "INIT-001"));
    snapshot.specifications.push(spec("SPEC-001", "architecture", "INIT-001"));

    const issues = checkProjectInvariants(snapshot);
    expect(issues.some((i) => i.rule === "matrix:forbiddenSpec" && i.id === "SPEC-001")).toBe(true);
  });

  it("aceita spec permitida pelo scope", () => {
    const snapshot: ProjectSnapshot = emptySnapshot(makeProject());
    snapshot.initiatives.push(initiative("INIT-001", "feature"));
    snapshot.knowledge.push(discovery("DISC-001", "INIT-001"));
    snapshot.specifications.push(spec("SPEC-001", "design", "INIT-001"));

    const issues = checkProjectInvariants(snapshot);
    expect(issues.some((i) => i.rule === "matrix:forbiddenSpec")).toBe(false);
  });

  it("acusa artefato apontando para iniciativa inexistente", () => {
    const snapshot: ProjectSnapshot = emptySnapshot(makeProject());
    snapshot.knowledge.push(discovery("DISC-001", "INIT-404"));

    const issues = checkProjectInvariants(snapshot);
    expect(issues.some((i) => i.rule === "initiative:brokenRef" && i.id === "DISC-001")).toBe(true);
  });
});
