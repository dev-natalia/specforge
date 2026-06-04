"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useWizardStore } from "@/lib/wizard/store";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { Card, CardContent } from "@/components/ui/Card";
import { FilePreview } from "@/components/preview/FilePreview";
import { CustomTopics } from "@/components/wizard/CustomTopics";
import { ClarifyQuestions } from "@/components/wizard/ClarifyQuestions";
import { generateSpecs } from "@/lib/api-client";
import { getStoredKey } from "@/lib/byok";

function SummaryRow({ label, value }: { label: string; value?: string }) {
  if (!value || value.trim() === "") return null;
  return (
    <div className="flex flex-col gap-0.5 border-b border-slate-100 py-2 last:border-0 sm:flex-row sm:gap-2">
      <dt className="w-48 shrink-0 text-sm font-medium text-slate-500">
        {label}
      </dt>
      <dd className="whitespace-pre-wrap text-sm text-slate-800">{value}</dd>
    </div>
  );
}

export function Step5SpecReview() {
  const formData = useWizardStore((state) => state.formData);
  const specs = useWizardStore((state) => state.generatedSpecs);
  const setSpecs = useWizardStore((state) => state.setSpecs);
  const setHarness = useWizardStore((state) => state.setHarness);
  const nextStep = useWizardStore((state) => state.nextStep);
  const prevStep = useWizardStore((state) => state.prevStep);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [byokActive, setByokActive] = useState(true);

  useEffect(() => {
    setByokActive(Boolean(getStoredKey()));
  }, []);

  async function handleGenerate() {
    setLoading(true);
    setError(null);
    try {
      const files = await generateSpecs(formData);
      setSpecs(files);
      // Specs novos invalidam harness anterior.
      setHarness(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha ao gerar specs.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">
          Review & Gerar Specs
        </h2>
        <p className="text-sm text-slate-500">
          Revise o resumo e gere os specs do seu projeto.
        </p>
      </div>

      <Card>
        <CardContent>
          <dl>
            <SummaryRow label="Nome" value={formData.projectName} />
            <SummaryRow label="Descrição" value={formData.description} />
            <SummaryRow label="Tipo" value={formData.projectType} />
            <SummaryRow label="Linguagem" value={formData.language} />
            <SummaryRow label="Frameworks" value={formData.frameworks} />
            <SummaryRow label="Runtime" value={formData.runtime} />
            <SummaryRow label="Banco" value={formData.database} />
            <SummaryRow
              label="Convenções"
              value={formData.architectureConventions}
            />
            <SummaryRow label="Constraints" value={formData.constraints} />
            <SummaryRow
              label="Estrutura de pastas"
              value={formData.folderStructure}
            />
            <SummaryRow
              label="Inputs/Outputs"
              value={formData.behaviorExamples}
            />
            <SummaryRow
              label="Regras de negócio"
              value={formData.businessRules}
            />
            <SummaryRow label="Edge cases" value={formData.edgeCases} />
          </dl>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <ClarifyQuestions />
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <CustomTopics />
        </CardContent>
      </Card>

      {!byokActive && (
        <div className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-center text-sm text-amber-800">
          Você precisa configurar sua chave da Anthropic para gerar.{" "}
          <Link href="/settings" className="font-medium underline">
            Configurar agora
          </Link>
        </div>
      )}

      {error && (
        <div className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          <p>{error}</p>
        </div>
      )}

      {!specs && (
        <div className="flex flex-col items-center gap-2">
          <Button
            size="lg"
            onClick={handleGenerate}
            disabled={loading || !byokActive}
          >
            {loading && <Spinner className="h-4 w-4" />}
            {loading ? "Gerando specs..." : "Gerar Specs"}
          </Button>
          <p className="text-center text-xs text-slate-400">
            A geração usa IA e pode levar vários minutos. Não feche a página.
          </p>
        </div>
      )}

      {specs && (
        <div className="space-y-4">
          <h3 className="font-medium text-slate-800">Specs gerados</h3>
          <FilePreview files={specs} />
        </div>
      )}

      <div className="flex items-center justify-between border-t border-slate-200 pt-4">
        <Button variant="outline" onClick={prevStep}>
          Anterior
        </Button>
        <div className="flex gap-2">
          {specs && (
            <Button
              variant="outline"
              onClick={handleGenerate}
              disabled={loading || !byokActive}
            >
              Regenerar
            </Button>
          )}
          <Button onClick={nextStep} disabled={!specs || loading}>
            Aprovar e Continuar
          </Button>
        </div>
      </div>
    </div>
  );
}
