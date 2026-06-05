import { describe, it, expect } from "vitest";
import {
  listPlugins,
  getPlugin,
  registerPlugin,
} from "@/lib/plugins/registry";

describe("plugin registry", () => {
  it("registra os 7 tipos de spec como built-ins", () => {
    const specTypes = listPlugins("specType");
    expect(specTypes).toHaveLength(7);
    const design = specTypes.find((p) => p.specType === "design");
    expect(design?.predecessors).toContain("requirements");
  });

  it("registra validators, provider de geração e 4 adapters de saída", () => {
    expect(listPlugins("validator").length).toBeGreaterThanOrEqual(2);
    expect(listPlugins("generationProvider")[0]?.id).toBe("anthropic");
    expect(listPlugins("outputAdapter")).toHaveLength(4);
  });

  it("permite estender com um plugin custom", () => {
    registerPlugin({
      id: "custom-gate",
      name: "Gate custom",
      version: "0.1.0",
      category: "validator",
      run: () => ({ results: [], outcome: "pass" }),
    });
    expect(getPlugin("validator", "custom-gate")?.name).toBe("Gate custom");
  });
});
