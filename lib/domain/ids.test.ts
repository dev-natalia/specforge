import { describe, it, expect } from "vitest";
import { nextId, idSequence, isArtifactId } from "@/lib/domain/ids";

describe("ids", () => {
  it("calcula o próximo ID a partir do maior sequencial do mesmo prefixo", () => {
    expect(nextId("discovery", [])).toBe("DISC-001");
    expect(nextId("discovery", ["DISC-001", "DISC-014", "DEC-099"])).toBe("DISC-015");
    expect(nextId("decision", ["DISC-001", "DISC-014", "DEC-099"])).toBe("DEC-100");
  });

  it("ignora IDs de outros prefixos ao gerar", () => {
    expect(nextId("task", ["DISC-050", "SPEC-200"])).toBe("TASK-001");
  });

  it("extrai o sequencial de um ID", () => {
    expect(idSequence("DISC-014")).toBe(14);
    expect(idSequence("não-id")).toBeNull();
  });

  it("reconhece o formato de ID de artefato", () => {
    expect(isArtifactId("DEC-002")).toBe(true);
    expect(isArtifactId("foo")).toBe(false);
  });
});
