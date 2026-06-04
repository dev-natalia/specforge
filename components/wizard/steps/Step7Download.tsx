"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useWizardStore } from "@/lib/wizard/store";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { FilePreview } from "@/components/preview/FilePreview";
import { downloadZip } from "@/lib/api-client";

export function Step7Download() {
  const router = useRouter();
  const formData = useWizardStore((state) => state.formData);
  const specs = useWizardStore((state) => state.generatedSpecs);
  const harness = useWizardStore((state) => state.generatedHarness);
  const reset = useWizardStore((state) => state.reset);
  const prevStep = useWizardStore((state) => state.prevStep);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const allFiles = useMemo(
    () => [...(specs ?? []), ...(harness ?? [])],
    [specs, harness],
  );

  async function handleDownload() {
    if (allFiles.length === 0) {
      setError("Nada para baixar — gere os specs e o harness primeiro.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await downloadZip(
        allFiles.map((file) => ({ path: file.path, content: file.content })),
        formData.projectName,
      );
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha ao baixar o zip.");
    } finally {
      setLoading(false);
    }
  }

  function handleNewProject() {
    reset();
    router.push("/new");
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">Download</h2>
        <p className="text-sm text-slate-500">
          Estrutura completa de arquivos pronta para o seu repositório.
        </p>
      </div>

      {error && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      {allFiles.length > 0 ? (
        <FilePreview files={allFiles} />
      ) : (
        <p className="text-sm text-slate-500">
          Volte e gere os specs e o harness.
        </p>
      )}

      <div className="flex items-center justify-between border-t border-slate-200 pt-4">
        <Button variant="outline" onClick={prevStep}>
          Anterior
        </Button>
        <div className="flex items-center gap-3">
          {done && (
            <Button variant="ghost" onClick={handleNewProject}>
              Novo projeto
            </Button>
          )}
          <Button
            size="lg"
            onClick={handleDownload}
            disabled={loading || allFiles.length === 0}
          >
            {loading && <Spinner className="h-4 w-4" />}
            {loading ? "Preparando..." : "Baixar .zip"}
          </Button>
        </div>
      </div>
    </div>
  );
}
