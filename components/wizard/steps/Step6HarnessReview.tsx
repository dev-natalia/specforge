"use client";

import { useState } from "react";
import { useWizardStore } from "@/lib/wizard/store";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { FilePreview } from "@/components/preview/FilePreview";
import { Card, CardContent } from "@/components/ui/Card";
import { ConsistencyAnalysis } from "@/components/wizard/ConsistencyAnalysis";
import { generateHarness } from "@/lib/api-client";

export function Step6HarnessReview() {
  const formData = useWizardStore((state) => state.formData);
  const specs = useWizardStore((state) => state.generatedSpecs);
  const harness = useWizardStore((state) => state.generatedHarness);
  const setHarness = useWizardStore((state) => state.setHarness);
  const nextStep = useWizardStore((state) => state.nextStep);
  const prevStep = useWizardStore((state) => state.prevStep);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleGenerate() {
    if (!specs) {
      setError("Gere os specs antes de gerar o harness.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const files = await generateHarness(formData, specs);
      setHarness(files);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha ao gerar harness.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">Gerar Harness</h2>
        <p className="text-sm text-slate-500">
          Com os specs aprovados, gere o harness (CLAUDE.md, configs, hooks).
        </p>
      </div>

      {error && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      {!harness && (
        <div className="flex justify-center">
          <Button size="lg" onClick={handleGenerate} disabled={loading}>
            {loading && <Spinner className="h-4 w-4" />}
            {loading ? "Gerando harness..." : "Gerar Harness"}
          </Button>
        </div>
      )}

      {harness && (
        <div className="space-y-4">
          <h3 className="font-medium text-slate-800">Harness gerado</h3>
          <FilePreview files={harness} />
        </div>
      )}

      {harness && specs && (
        <Card>
          <CardContent>
            <ConsistencyAnalysis specs={specs} harness={harness} />
          </CardContent>
        </Card>
      )}

      <div className="flex items-center justify-between border-t border-slate-200 pt-4">
        <Button variant="outline" onClick={prevStep}>
          Anterior
        </Button>
        <div className="flex gap-2">
          {harness && (
            <Button
              variant="outline"
              onClick={handleGenerate}
              disabled={loading}
            >
              Regenerar
            </Button>
          )}
          <Button onClick={nextStep} disabled={!harness || loading}>
            Aprovar e Baixar
          </Button>
        </div>
      </div>
    </div>
  );
}
