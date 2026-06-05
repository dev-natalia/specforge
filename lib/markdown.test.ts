import { describe, it, expect } from "vitest";
import { renderMarkdown } from "@/lib/markdown";

describe("renderMarkdown", () => {
  it("renderiza títulos", () => {
    expect(renderMarkdown("# Título")).toContain("<h1>Título</h1>");
    expect(renderMarkdown("### Sub")).toContain("<h3>Sub</h3>");
  });

  it("renderiza listas não-ordenadas e ordenadas", () => {
    expect(renderMarkdown("- a\n- b")).toBe("<ul><li>a</li><li>b</li></ul>");
    expect(renderMarkdown("1. a\n2. b")).toBe("<ol><li>a</li><li>b</li></ol>");
  });

  it("renderiza negrito, itálico e código inline", () => {
    expect(renderMarkdown("texto **forte**")).toContain("<strong>forte</strong>");
    expect(renderMarkdown("um `code` aqui")).toContain("<code>code</code>");
  });

  it("não corrompe números soltos no texto", () => {
    expect(renderMarkdown("versão 2 do produto")).toContain("versão 2 do produto");
  });

  it("renderiza bloco de código cercado", () => {
    const html = renderMarkdown("```\nconst x = 1;\n```");
    expect(html).toContain("<pre><code>const x = 1;</code></pre>");
  });

  it("escapa HTML (anti-XSS)", () => {
    const html = renderMarkdown("texto <script>alert(1)</script>");
    expect(html).not.toContain("<script>");
    expect(html).toContain("&lt;script&gt;");
  });

  it("bloqueia links com protocolo perigoso", () => {
    const html = renderMarkdown("[x](javascript:alert(1))");
    expect(html).not.toContain("javascript:");
    expect(html).toContain("x");
  });

  it("permite links http", () => {
    const html = renderMarkdown("[site](https://exemplo.com)");
    expect(html).toContain('href="https://exemplo.com"');
  });
});
