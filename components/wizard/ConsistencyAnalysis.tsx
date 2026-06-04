"use client";

import { useState } from "react";
import type { AnalysisFinding, GeneratedFile } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { Badge } from "@/components/ui/Badge";
import { analyzeConsistency } from "@/lib/api-client";

interface ConsistencyAnalysisProps {
  specs: GeneratedFile[];
  harness: GeneratedFile[];
}

const SEVERITY_VARIANT = {
  info: "info",
  warning: "warning",
  error: "default",
} as const;

const SEVERITY_LABEL = {
  info: "Info",
  warning: "Atenção",
  error: "Erro",
} as const;

// Passo opcional e informativo: cruza specs × harness e aponta divergências.
export function ConsistencyAnalysis({
  specs,
  harness,
}: ConsistencyAnalysisProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [findings, setFindings] = useState<AnalysisFinding[] | null>(null);

  async function handleAnalyze() {
    setLoading(true);
    setError(null);
    try {
      const result = await analyzeConsistency(specs, harness);
      setFindings(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha ao analisar.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-3">
      <div>
        <h3 className="font-medium text-slate-800">
          Análise de consistência{" "}
          <span className="font-normal text-slate-400">(opcional)</span>
        </h3>
        <p className="text-sm text-slate-500">
          Cruza os specs com o harness e aponta contradições ou lacunas. É
          informativo — não bloqueia o download.
        </p>
      </div>

      {error && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      {findings && (
        <ul className="space-y-2">
          {findings.map((finding, index) => (
            <li
              key={index}
              className="flex items-start gap-2 rounded-md border border-slate-200 px-3 py-2"
            >
              <Badge variant={SEVERITY_VARIANT[finding.severity]}>
                {SEVERITY_LABEL[finding.severity]}
              </Badge>
              <span className="text-sm text-slate-700">{finding.message}</span>
            </li>
          ))}
        </ul>
      )}

      <Button
        variant="outline"
        size="sm"
        onClick={handleAnalyze}
        disabled={loading}
      >
        {loading && <Spinner className="h-4 w-4" />}
        {loading
          ? "Analisando..."
          : findings
            ? "Analisar novamente"
            : "Analisar consistência"}
      </Button>
    </div>
  );
}
