import { describe, it, expect } from "vitest";
import { parseFilesResponse } from "@/lib/ai/generate";

describe("parseFilesResponse", () => {
  it("parseia JSON puro com files", () => {
    const raw = JSON.stringify({
      files: [
        {
          name: "spec.md",
          path: "specs/001/spec.md",
          content: "# spec",
          language: "markdown",
        },
      ],
    });
    const files = parseFilesResponse(raw);
    expect(files).toHaveLength(1);
    expect(files[0]?.name).toBe("spec.md");
  });

  it("remove a cerca ```json que envolve todo o conteúdo", () => {
    const raw = "```json\n" + JSON.stringify({ files: [
      { name: "a.md", path: "a.md", content: "x", language: "markdown" },
    ] }) + "\n```";
    expect(parseFilesResponse(raw)).toHaveLength(1);
  });

  it("não se confunde com blocos ``` dentro do conteúdo dos arquivos", () => {
    const treeContent =
      "# tasks\n\n```\nsrc/\n├─ index.ts\n└─ app/\n```\nfim";
    const raw = JSON.stringify({
      files: [
        {
          name: "tasks.md",
          path: "specs/001/tasks.md",
          content: treeContent,
          language: "markdown",
        },
      ],
    });
    const files = parseFilesResponse(raw);
    expect(files).toHaveLength(1);
    expect(files[0]?.content).toBe(treeContent);
  });

  it("ignora prosa antes e depois do JSON", () => {
    const raw =
      'Aqui está o resultado:\n' +
      JSON.stringify({
        files: [
          { name: "a.md", path: "a.md", content: "x", language: "markdown" },
        ],
      }) +
      "\nEspero que ajude!";
    expect(parseFilesResponse(raw)).toHaveLength(1);
  });

  it("lança erro em resposta sem JSON válido", () => {
    expect(() => parseFilesResponse("desculpe, não consegui")).toThrow();
  });
});
