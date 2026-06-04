// Highlighter Shiki compartilhado (singleton) para o preview de arquivos.
// O shiki é ESM-only e só é usado no cliente (useEffect), então é importado
// de forma lazy (dynamic import) para não entrar no grafo de módulos do SSR.
import type { Highlighter } from "shiki";

const THEME = "github-light";

const LANGS = [
  "markdown",
  "yaml",
  "json",
  "typescript",
  "javascript",
  "tsx",
  "bash",
  "toml",
  "ini",
] as const;

let highlighterPromise: Promise<Highlighter> | null = null;

function getHighlighter(): Promise<Highlighter> {
  if (!highlighterPromise) {
    highlighterPromise = import("shiki").then((shiki) =>
      shiki.createHighlighter({
        themes: [THEME],
        langs: [...LANGS],
      }),
    );
  }
  return highlighterPromise;
}

// Normaliza a linguagem informada para uma suportada pelo Shiki.
function normalizeLang(language: string): string {
  const lang = language.toLowerCase();
  const map: Record<string, string> = {
    md: "markdown",
    yml: "yaml",
    ts: "typescript",
    js: "javascript",
    sh: "bash",
    shell: "bash",
  };
  const resolved = map[lang] ?? lang;
  return (LANGS as readonly string[]).includes(resolved) ? resolved : "markdown";
}

/** Converte código-fonte em HTML destacado. */
export async function highlightCode(
  code: string,
  language: string,
): Promise<string> {
  const highlighter = await getHighlighter();
  return highlighter.codeToHtml(code, {
    lang: normalizeLang(language),
    theme: THEME,
  });
}
