import { describe, it, expect } from "vitest";
import {
  scopeSchema,
  SCOPE_ORDER,
  CONFIDENCE_THRESHOLD,
  CLARIFICATION_BUDGET,
  scopeRank,
  compareScope,
  meetsConfidenceThreshold,
  escalatedScope,
  reducedScope,
} from "@/lib/domain/scope";

describe("scope model", () => {
  it("aceita os três scopes oficiais", () => {
    expect(scopeSchema.options).toEqual(["story", "feature", "product"]);
  });

  it("ordena story < feature < product", () => {
    expect(SCOPE_ORDER).toEqual(["story", "feature", "product"]);
    expect(scopeRank("story")).toBe(0);
    expect(scopeRank("product")).toBe(2);
    expect(compareScope("story", "product")).toBeLessThan(0);
    expect(compareScope("product", "feature")).toBeGreaterThan(0);
    expect(compareScope("feature", "feature")).toBe(0);
  });

  it("define limiares de confiança crescentes (80/85/90)", () => {
    expect(CONFIDENCE_THRESHOLD).toEqual({ story: 0.8, feature: 0.85, product: 0.9 });
  });

  it("avalia o limiar de confiança por scope", () => {
    expect(meetsConfidenceThreshold("story", 0.8)).toBe(true);
    expect(meetsConfidenceThreshold("story", 0.79)).toBe(false);
    expect(meetsConfidenceThreshold("product", 0.85)).toBe(false);
  });

  it("define orçamento de clarificação por scope", () => {
    expect(CLARIFICATION_BUDGET.story).toEqual({ min: 0, max: 5 });
    expect(CLARIFICATION_BUDGET.feature).toEqual({ min: 3, max: 10 });
    expect(CLARIFICATION_BUDGET.product).toEqual({ min: 10, max: 30 });
  });

  it("escala e reduz scope nas bordas", () => {
    expect(escalatedScope("story")).toBe("feature");
    expect(escalatedScope("feature")).toBe("product");
    expect(escalatedScope("product")).toBeNull();

    expect(reducedScope("product")).toBe("feature");
    expect(reducedScope("feature")).toBe("story");
    expect(reducedScope("story")).toBeNull();
  });
});
