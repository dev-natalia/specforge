import { describe, it, expect } from "vitest";
import { canAdvance } from "@/lib/wizard/store";
import type { WizardFormData } from "@/lib/types";

const base: WizardFormData = {
  projectName: "",
  description: "",
  projectType: "FULLSTACK",
  language: "",
};

describe("canAdvance", () => {
  it("bloqueia etapa 1 sem nome e descrição", () => {
    expect(canAdvance(1, base)).toBe(false);
    expect(
      canAdvance(1, { ...base, projectName: "X", description: "Y" }),
    ).toBe(true);
  });

  it("bloqueia etapa 2 sem linguagem", () => {
    expect(canAdvance(2, base)).toBe(false);
    expect(canAdvance(2, { ...base, language: "TS" })).toBe(true);
  });

  it("permite etapas 3 e 4 livremente (campos opcionais)", () => {
    expect(canAdvance(3, base)).toBe(true);
    expect(canAdvance(4, base)).toBe(true);
  });
});
