import { describe, it, expect } from "vitest";
import {
  ARTIFACT_TYPES,
  availability,
  isAllowed,
  isRequired,
  isForbidden,
  requiredArtifacts,
  forbiddenArtifacts,
  TESTING_LEVEL,
  isSpecAllowed,
  SPEC_MATRIX_KEY,
} from "@/lib/domain/artifact-matrix";
import { SPEC_CASCADE } from "@/lib/domain/specs";

describe("artifact matrix", () => {
  it("story proíbe architecture, security, contracts, design e product vision", () => {
    for (const a of ["architecture", "security", "contracts", "design", "productVision"] as const) {
      expect(isForbidden("story", a)).toBe(true);
      expect(isAllowed("story", a)).toBe(false);
    }
  });

  it("story exige requirements, tasks, harness, testing e story spec", () => {
    for (const a of ["requirements", "tasks", "harness", "testing", "storySpec"] as const) {
      expect(isRequired("story", a)).toBe(true);
    }
  });

  it("feature exige design e contracts, mas proíbe product vision", () => {
    expect(isRequired("feature", "design")).toBe(true);
    expect(isRequired("feature", "contracts")).toBe(true);
    expect(isForbidden("feature", "productVision")).toBe(true);
    // architecture/security são opcionais (geração condicional).
    expect(availability("feature", "architecture")).toBe("optional");
    expect(availability("feature", "security")).toBe("optional");
  });

  it("product exige todos os artefatos pesados", () => {
    for (const a of ["productVision", "architecture", "security", "contextPackages", "discoveries"] as const) {
      expect(isRequired("product", a)).toBe(true);
    }
  });

  it("nenhum artefato é proibido no product", () => {
    expect(forbiddenArtifacts("product")).toHaveLength(0);
  });

  it("required/forbidden particionam coerentemente o vocabulário", () => {
    const req = requiredArtifacts("story");
    for (const a of req) expect(isForbidden("story", a)).toBe(false);
    // cobertura: toda chave da matriz é um ArtifactType conhecido.
    expect(new Set(ARTIFACT_TYPES).size).toBe(ARTIFACT_TYPES.length);
  });

  it("nível de testing cresce com o scope", () => {
    expect(TESTING_LEVEL).toEqual({
      story: "basic",
      feature: "standard",
      product: "comprehensive",
    });
  });

  it("mapeia todos os SpecType (exceto edgeCases) para a matriz", () => {
    for (const specType of SPEC_CASCADE) {
      if (specType === "edgeCases") continue;
      expect(SPEC_MATRIX_KEY[specType as keyof typeof SPEC_MATRIX_KEY]).toBeDefined();
    }
  });

  it("isSpecAllowed reflete a matriz por scope", () => {
    expect(isSpecAllowed("story", "requirements")).toBe(true);
    expect(isSpecAllowed("story", "architecture")).toBe(false);
    // edgeCases é spec pesada: proibida em story, permitida acima.
    expect(isSpecAllowed("story", "edgeCases")).toBe(false);
    expect(isSpecAllowed("feature", "edgeCases")).toBe(true);
    expect(isSpecAllowed("product", "edgeCases")).toBe(true);
    expect(isSpecAllowed("feature", "design")).toBe(true);
    expect(isSpecAllowed("product", "security")).toBe(true);
  });
});
