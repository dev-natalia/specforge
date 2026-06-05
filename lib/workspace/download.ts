// Download do projeto como .zip de arquivos (export local-first).
// Reúne os arquivos legíveis + specforge.json e empacota no navegador.
import { exportProjectFiles } from "@/lib/storage/export";
import { generateZip, safeZipFilename } from "@/lib/zip/generate-zip";
import type { ProjectSnapshot } from "@/lib/domain/project";

export async function downloadProjectZip(snapshot: ProjectSnapshot): Promise<void> {
  const files = exportProjectFiles(snapshot);
  const bytes = await generateZip(files);
  const blob = new Blob([bytes], { type: "application/zip" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = safeZipFilename(snapshot.project.name);
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}
