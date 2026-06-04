// Camada de geração do lado do cliente. NÃO há servidor nosso: tudo roda no
// navegador (a chamada à Anthropic é browser → API, com a chave BYOK), e o zip
// é montado no cliente com JSZip.
import type {
  GeneratedFile,
  WizardFormData,
  AnalysisFinding,
} from "@/lib/types";
import { getStoredKey } from "@/lib/byok";
import { AppError } from "@/lib/errors";
import {
  generateSpecFiles,
  generateHarnessFiles,
  generateClarifications as runClarifications,
  analyzeConsistency as runAnalyze,
  validateApiKey,
} from "@/lib/ai/generate";
import { generateZip, safeZipFilename } from "@/lib/zip/generate-zip";

// Obtém a chave BYOK do navegador ou lança um erro acionável.
function requireKey(): string {
  const key = getStoredKey();
  if (!key) {
    throw new AppError(
      "INVALID_API_KEY",
      "Configure sua chave da Anthropic em Configurações para gerar.",
    );
  }
  return key;
}

export async function generateSpecs(
  formData: WizardFormData,
): Promise<GeneratedFile[]> {
  return generateSpecFiles(formData, requireKey());
}

export async function generateHarness(
  formData: WizardFormData,
  specs: GeneratedFile[],
): Promise<GeneratedFile[]> {
  return generateHarnessFiles(formData, specs, requireKey());
}

export async function generateClarifications(
  formData: WizardFormData,
): Promise<string[]> {
  return runClarifications(formData, requireKey());
}

export async function analyzeConsistency(
  specs: GeneratedFile[],
  harness: GeneratedFile[],
): Promise<AnalysisFinding[]> {
  return runAnalyze(specs, harness, requireKey());
}

// Testa uma chave específica (ainda não necessariamente salva).
export async function validateAnthropicKey(key: string): Promise<void> {
  await validateApiKey(key);
}

/**
 * Gera o zip no navegador e dispara o download.
 */
export async function downloadZip(
  files: Array<{ path: string; content: string }>,
  name?: string,
): Promise<void> {
  const bytes = await generateZip(files);
  const filename = safeZipFilename(name ?? "projeto");
  const blob = new Blob([bytes], { type: "application/zip" });

  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}
