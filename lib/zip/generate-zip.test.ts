import { describe, it, expect } from "vitest";
import JSZip from "jszip";
import { generateZip, safeZipFilename } from "@/lib/zip/generate-zip";

describe("safeZipFilename", () => {
  it("gera slug seguro a partir do nome", () => {
    expect(safeZipFilename("Minha API de Pagamentos!")).toBe(
      "sdd-harness-minha-api-de-pagamentos.zip",
    );
  });

  it("usa fallback quando o nome fica vazio", () => {
    expect(safeZipFilename("@@@")).toBe("sdd-harness-projeto.zip");
  });
});

describe("generateZip", () => {
  it("empacota arquivos preservando a estrutura de pastas", async () => {
    const bytes = await generateZip([
      { path: "specs/001/spec.md", content: "# spec" },
      { path: "CLAUDE.md", content: "# harness" },
    ]);

    const zip = await JSZip.loadAsync(bytes);
    expect(zip.file("specs/001/spec.md")).not.toBeNull();
    expect(zip.file("CLAUDE.md")).not.toBeNull();
    const spec = await zip.file("specs/001/spec.md")?.async("string");
    expect(spec).toBe("# spec");
  });

  it("ignora paths vazios", async () => {
    const bytes = await generateZip([
      { path: "/", content: "x" },
      { path: "ok.txt", content: "y" },
    ]);
    const zip = await JSZip.loadAsync(bytes);
    expect(Object.keys(zip.files)).toEqual(["ok.txt"]);
  });

  it("remove segmentos de path traversal (anti zip-slip)", async () => {
    const bytes = await generateZip([
      { path: "../../etc/passwd", content: "x" },
      { path: "a/../../b.txt", content: "y" },
    ]);
    const zip = await JSZip.loadAsync(bytes);
    const names = Object.keys(zip.files);
    expect(names.some((n) => n.includes(".."))).toBe(false);
    expect(names).toContain("etc/passwd");
    expect(names).toContain("a/b.txt");
  });
});
