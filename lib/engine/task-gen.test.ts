import { describe, it, expect } from "vitest";
import { parseTaskDrafts } from "@/lib/engine/task-gen";

describe("parseTaskDrafts", () => {
  it("parseia tasks com defaults e dependsOn", () => {
    const raw = JSON.stringify({
      tasks: [
        { title: "Setup", category: "foundation", dependsOn: [] },
        { title: "Feature", category: "feature", dependsOn: [0], acceptanceCriteria: ["ok"] },
      ],
    });
    const drafts = parseTaskDrafts(raw);
    expect(drafts).toHaveLength(2);
    expect(drafts[1]?.dependsOn).toEqual([0]);
    expect(drafts[1]?.acceptanceCriteria).toEqual(["ok"]);
  });

  it("cai para categoria 'feature' quando inválida", () => {
    const raw = JSON.stringify({ tasks: [{ title: "X", category: "zzz" }] });
    expect(parseTaskDrafts(raw)[0]?.category).toBe("feature");
  });

  it("ignora itens sem título", () => {
    const raw = JSON.stringify({ tasks: [{ category: "feature" }, { title: "Ok" }] });
    expect(parseTaskDrafts(raw)).toHaveLength(1);
  });

  it("recupera tasks de um JSON truncado (estouro de tokens)", () => {
    const truncated =
      '{"tasks":[' +
      '{"title":"A","category":"foundation","dependsOn":[]},' +
      '{"title":"B","category":"feature","dependsOn":[0],"acceptanceCriteria":["ok"]},' +
      '{"title":"C incomple';
    const drafts = parseTaskDrafts(truncated);
    expect(drafts).toHaveLength(2); // a 3ª (incompleta) é descartada
    expect(drafts[1]?.dependsOn).toEqual([0]);
  });

  it("lança erro quando nada pôde ser recuperado", () => {
    expect(() => parseTaskDrafts("desculpe, não consigo")).toThrow();
  });
});
