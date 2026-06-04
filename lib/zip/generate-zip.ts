// Geração de .zip server-side via JSZip (CLAUDE.md: nunca no cliente).
import JSZip from "jszip";

export interface ZipEntry {
  path: string;
  content: string;
}

/**
 * Empacota os arquivos num zip preservando a estrutura de pastas dos `path`.
 * Retorna um Uint8Array pronto para enviar como resposta de download.
 */
export async function generateZip(entries: ZipEntry[]): Promise<ArrayBuffer> {
  const zip = new JSZip();

  for (const entry of entries) {
    // Normaliza separadores e remove segmentos de path traversal (`..`, `.`)
    // para evitar zip-slip ao extrair em outra máquina.
    const normalized = entry.path
      .replace(/\\/g, "/")
      .split("/")
      .filter((segment) => segment && segment !== "." && segment !== "..")
      .join("/");
    if (normalized.length === 0) continue;
    zip.file(normalized, entry.content);
  }

  return zip.generateAsync({
    type: "arraybuffer",
    compression: "DEFLATE",
    compressionOptions: { level: 6 },
  });
}

/** Sanitiza o nome do projeto para uso seguro em nome de arquivo. */
export function safeZipFilename(projectName: string): string {
  const slug = projectName
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
  return `sdd-harness-${slug || "projeto"}.zip`;
}
