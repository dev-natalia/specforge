import { describe, it, expect } from "vitest";
import {
  composePipeline,
  validatePipeline,
  isStageAllowed,
  isStageForbidden,
  STAGE_DEPENDENCIES,
  type Stage,
} from "@/lib/engine/pipeline";

describe("progressive pipeline", () => {
  it("story compõe um pipeline leve sem stages pesados", () => {
    const { stages } = composePipeline("story");
    expect(stages).toContain("requirements");
    expect(stages).toContain("harness");
    expect(stages).toContain("tasks");
    expect(stages).not.toContain("design");
    expect(stages).not.toContain("architecture");
    expect(stages).not.toContain("security");
    expect(stages).not.toContain("knowledgeCollection");
  });

  it("feature inclui design e contracts, mas não security/architecture por padrão", () => {
    const { stages } = composePipeline("feature");
    expect(stages).toContain("design");
    expect(stages).toContain("contracts");
    expect(stages).toContain("knowledgeCollection");
    expect(stages).not.toContain("security");
    expect(stages).not.toContain("architecture");
  });

  it("feature ativa security quando há sinal de segurança (inserção condicional)", () => {
    const { stages } = composePipeline("feature", { security: true });
    expect(stages).toContain("security");
  });

  it("feature ativa architecture quando há sinal arquitetural", () => {
    const { stages } = composePipeline("feature", { architecture: true });
    expect(stages).toContain("architecture");
  });

  it("product habilita todos os stages", () => {
    const { stages } = composePipeline("product");
    expect(stages).toContain("security");
    expect(stages).toContain("architecture");
    expect(stages).toContain("knowledgeCollection");
    expect(stages).toContain("design");
  });

  it("respeita ordem topológica (dependência antes do dependente)", () => {
    const { stages } = composePipeline("product");
    const idx = (s: Stage) => stages.indexOf(s);
    for (const stage of stages) {
      for (const dep of STAGE_DEPENDENCIES[stage]) {
        expect(idx(dep)).toBeGreaterThanOrEqual(0);
        expect(idx(dep)).toBeLessThan(idx(stage));
      }
    }
  });

  it("pipelines compostos são sempre válidos", () => {
    for (const scope of ["story", "feature", "product"] as const) {
      const { stages } = composePipeline(scope, { security: true, architecture: true });
      expect(validatePipeline(scope, stages)).toHaveLength(0);
    }
  });

  it("validatePipeline acusa stage proibido", () => {
    const issues = validatePipeline("story", ["intentCapture", "scopeResolution", "clarification", "requirements", "architecture"]);
    expect(issues.some((i) => i.rule === "stage:forbidden" && i.stage === "architecture")).toBe(true);
  });

  it("validatePipeline acusa dependência ausente", () => {
    // design sem requirements.
    const issues = validatePipeline("feature", ["intentCapture", "scopeResolution", "clarification", "design"]);
    expect(issues.some((i) => i.rule === "stage:missingDependency" && i.stage === "design")).toBe(true);
  });

  it("isStageAllowed/isStageForbidden refletem o perfil", () => {
    expect(isStageForbidden("story", "architecture")).toBe(true);
    expect(isStageAllowed("story", "requirements")).toBe(true);
    expect(isStageAllowed("product", "security")).toBe(true);
  });
});
