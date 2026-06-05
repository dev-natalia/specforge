// Extrai a seção "Perguntas em aberto" do markdown de uma spec gerada. A IA
// registra ali tudo que não conseguiu definir a partir do conhecimento (em vez
// de inventar). Essas perguntas viram cards respondíveis na UI — a resposta vira
// conhecimento e a regeneração da spec incorpora.

// Cabeçalho da seção (pt/en), em qualquer nível markdown.
const HEADING_RE = /^#{1,6}\s+/;
const OPEN_HEADING_RE = /^#{1,6}\s*(perguntas?\s+em\s+aberto|open\s+questions)\s*:?\s*$/i;
// Linhas vazias/placeholder que indicam "não há perguntas".
const EMPTY_RE = /^\(?\s*(nenhuma|nenhum|none|n\/?a|sem\s+perguntas)/i;

/** Remove marcador de lista (-, *, +) ou numeração (1. / 1)) do início. */
function stripBullet(line: string): string {
  return line
    .replace(/^[-*+]\s+/, "")
    .replace(/^\d+[.)]\s+/, "")
    .trim();
}

/**
 * Lê as perguntas em aberto do conteúdo markdown de uma spec. Captura os itens
 * sob o cabeçalho "Perguntas em aberto" até o próximo cabeçalho.
 */
export function extractOpenQuestions(content: string): string[] {
  const lines = content.split(/\r?\n/);
  const out: string[] = [];
  let capturing = false;

  for (const raw of lines) {
    const line = raw.trim();
    if (!capturing) {
      if (OPEN_HEADING_RE.test(line)) capturing = true;
      continue;
    }
    // Próximo cabeçalho encerra a seção.
    if (HEADING_RE.test(line)) break;
    if (!line) continue;
    const item = stripBullet(line);
    if (!item || EMPTY_RE.test(item)) continue;
    out.push(item);
  }
  return out;
}
