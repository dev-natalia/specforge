import { describe, it, expect } from "vitest";
import {
  HARNESS_LAYERS,
  activeHarnessLayers,
  isHarnessLayerActive,
} from "@/lib/domain/harness";

describe("harness progressivo — perfil de camadas por scope", () => {
  it("story é leve: sem architecture nem security", () => {
    expect(isHarnessLayerActive("story", "architecture")).toBe(false);
    expect(isHarnessLayerActive("story", "security")).toBe(false);
    expect(isHarnessLayerActive("story", "execution")).toBe(true);
    expect(isHarnessLayerActive("story", "identity")).toBe(true);
  });

  it("feature inclui architecture mas não security por padrão", () => {
    expect(isHarnessLayerActive("feature", "architecture")).toBe(true);
    expect(isHarnessLayerActive("feature", "security")).toBe(false);
    expect(isHarnessLayerActive("feature", "documentation")).toBe(true);
  });

  it("product ativa todas as camadas", () => {
    expect(activeHarnessLayers("product")).toEqual([...HARNESS_LAYERS]);
  });

  it("o número de camadas cresce com o scope", () => {
    expect(activeHarnessLayers("story").length).toBeLessThan(activeHarnessLayers("feature").length);
    expect(activeHarnessLayers("feature").length).toBeLessThan(activeHarnessLayers("product").length);
  });
});
