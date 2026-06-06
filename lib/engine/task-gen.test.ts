import { describe, it, expect } from "vitest";
import { parseTaskDrafts, buildTaskUserPrompt, TASK_COUNT } from "@/lib/engine/task-gen";
import { emptySnapshot, type Project } from "@/lib/domain/project";

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

describe("buildTaskUserPrompt", () => {
  const project: Project = {
    id: "PROJ-001",
    name: "Demo",
    slug: "demo",
    description: "",
    createdAt: "2026-06-05T00:00:00.000Z",
    updatedAt: "2026-06-05T00:00:00.000Z",
  };

  it("usa a faixa de quantidade do scope", () => {
    const story = buildTaskUserPrompt(emptySnapshot(project), { scope: "story" });
    expect(story).toContain(`de ${TASK_COUNT.story.min} a ${TASK_COUNT.story.max} tasks`);
    const product = buildTaskUserPrompt(emptySnapshot(project), { scope: "product" });
    expect(product).toContain(`de ${TASK_COUNT.product.min} a ${TASK_COUNT.product.max} tasks`);
  });

  it("faixa cresce com o scope", () => {
    expect(TASK_COUNT.story.max).toBeLessThan(TASK_COUNT.feature.max);
    expect(TASK_COUNT.feature.max).toBeLessThan(TASK_COUNT.product.max);
  });

  it("no modo append, lista as tasks existentes para não repetir", () => {
    const prompt = buildTaskUserPrompt(emptySnapshot(project), {
      scope: "product",
      existingTitles: ["Setup do projeto", "Modelar dados"],
    });
    expect(prompt).toContain("NÃO repita");
    expect(prompt).toContain("Setup do projeto");
    expect(prompt).toContain("Modelar dados");
  });
});
