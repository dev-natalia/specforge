import { describe, it, expect } from "vitest";
import { checkTraceIntegrity, type Traceable } from "@/lib/domain/traceability";

function node(id: string, refs: string[] = []): Traceable {
  return { id, traceRefs: refs };
}

describe("checkTraceIntegrity", () => {
  it("não acusa problemas num grafo íntegro", () => {
    const issues = checkTraceIntegrity([
      node("DISC-001"),
      node("DEC-001", ["DISC-001"]),
      node("SPEC-001", ["DEC-001"]),
    ]);
    expect(issues).toHaveLength(0);
  });

  it("detecta referência quebrada", () => {
    const issues = checkTraceIntegrity([node("DEC-001", ["DISC-999"])]);
    expect(issues).toEqual([
      expect.objectContaining({ kind: "broken", id: "DEC-001" }),
    ]);
  });

  it("detecta artefato órfão quando origem é exigida", () => {
    const issues = checkTraceIntegrity([node("SPEC-001")], ["SPEC-001"]);
    expect(issues).toEqual([
      expect.objectContaining({ kind: "orphan", id: "SPEC-001" }),
    ]);
  });

  it("detecta ciclo de rastreabilidade", () => {
    const issues = checkTraceIntegrity([
      node("A-001", ["A-002"]),
      node("A-002", ["A-001"]),
    ]);
    expect(issues.some((i) => i.kind === "cycle")).toBe(true);
  });
});
