"use client";

// Formulários de criação/edição dos objetos de conhecimento (Fase 1).
// Cada form devolve um Record<string, unknown> pronto para addKnowledge/updateKnowledge.
import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";

// Converte texto multilinha ⇄ array de strings (para campos de lista).
function linesToArray(text: string): string[] {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}
function arrayToLines(value: unknown): string {
  return Array.isArray(value) ? value.join("\n") : "";
}

export interface RefOption {
  id: string;
  label: string;
}

// Seletor de referências de rastreabilidade (origens do artefato).
export function TraceRefPicker({
  options,
  value,
  onChange,
}: {
  options: RefOption[];
  value: string[];
  onChange: (next: string[]) => void;
}) {
  if (options.length === 0) {
    return (
      <p className="text-xs text-slate-400">
        Nenhum artefato disponível ainda para referenciar.
      </p>
    );
  }
  function toggle(id: string) {
    onChange(value.includes(id) ? value.filter((v) => v !== id) : [...value, id]);
  }
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-slate-700">Origens (rastreabilidade)</span>
      <div className="flex max-h-32 flex-wrap gap-2 overflow-y-auto rounded-md border border-slate-200 p-2">
        {options.map((option) => (
          <label
            key={option.id}
            className="inline-flex cursor-pointer items-center gap-1.5 text-xs text-slate-700"
          >
            <input
              type="checkbox"
              checked={value.includes(option.id)}
              onChange={() => toggle(option.id)}
            />
            <span className="font-mono text-[11px] text-slate-500">{option.id}</span>
            <span className="max-w-[10rem] truncate">{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

interface FormProps {
  initial?: Record<string, unknown>;
  refOptions: RefOption[];
  onSubmit: (data: Record<string, unknown>) => void;
  onCancel: () => void;
  submitting?: boolean;
}

function FormActions({
  onCancel,
  submitting,
  disabled,
}: {
  onCancel: () => void;
  submitting?: boolean;
  disabled?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-2 pt-1">
      <span className="text-xs text-slate-400">
        <span className="text-red-500">*</span> campo obrigatório
      </span>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" size="sm" disabled={submitting || disabled}>
          Salvar
        </Button>
      </div>
    </div>
  );
}

const DISCOVERY_CATEGORIES = [
  { value: "user", label: "Usuário" },
  { value: "product", label: "Produto" },
  { value: "technical", label: "Técnica" },
  { value: "architecture", label: "Arquitetura" },
  { value: "business", label: "Negócio" },
  { value: "process", label: "Processo" },
];
const CONFIDENCE = [
  { value: "low", label: "Baixa" },
  { value: "medium", label: "Média" },
  { value: "high", label: "Alta" },
];

export function DiscoveryForm({ initial, refOptions, onSubmit, onCancel, submitting }: FormProps) {
  const [title, setTitle] = useState((initial?.title as string) ?? "");
  const [category, setCategory] = useState((initial?.category as string) ?? "user");
  const [description, setDescription] = useState((initial?.description as string) ?? "");
  const [evidence, setEvidence] = useState((initial?.evidence as string) ?? "");
  const [implications, setImplications] = useState((initial?.implications as string) ?? "");
  const [source, setSource] = useState((initial?.source as string) ?? "");
  const [confidence, setConfidence] = useState((initial?.confidence as string) ?? "low");
  const [traceRefs, setTraceRefs] = useState<string[]>((initial?.traceRefs as string[]) ?? []);

  return (
    <form
      className="flex flex-col gap-3"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit({ title, category, description, evidence, implications, source, confidence, traceRefs });
      }}
    >
      <Input label="Título" value={title} onChange={(e) => setTitle(e.target.value)} required />
      <div className="grid gap-3 sm:grid-cols-2">
        <Select label="Categoria" options={DISCOVERY_CATEGORIES} value={category} onChange={(e) => setCategory(e.target.value)} />
        <Select label="Confiança" options={CONFIDENCE} value={confidence} onChange={(e) => setConfidence(e.target.value)} />
      </div>
      <Textarea label="O que foi aprendido" required value={description} onChange={(e) => setDescription(e.target.value)} />
      <Textarea label="Evidência" rows={2} value={evidence} onChange={(e) => setEvidence(e.target.value)} />
      <Textarea label="Implicações" rows={2} value={implications} onChange={(e) => setImplications(e.target.value)} />
      <Input label="Fonte" value={source} onChange={(e) => setSource(e.target.value)} />
      <TraceRefPicker options={refOptions} value={traceRefs} onChange={setTraceRefs} />
      <FormActions onCancel={onCancel} submitting={submitting} disabled={!title.trim() || !description.trim()} />
    </form>
  );
}

const DECISION_CATEGORIES = [
  { value: "product", label: "Produto" },
  { value: "technical", label: "Técnica" },
  { value: "architecture", label: "Arquitetura" },
  { value: "process", label: "Processo" },
  { value: "business", label: "Negócio" },
];

export function DecisionForm({ initial, refOptions, onSubmit, onCancel, submitting }: FormProps) {
  const [title, setTitle] = useState((initial?.title as string) ?? "");
  const [category, setCategory] = useState((initial?.category as string) ?? "product");
  const [context, setContext] = useState((initial?.context as string) ?? "");
  const [decision, setDecision] = useState((initial?.decision as string) ?? "");
  const [rationale, setRationale] = useState((initial?.rationale as string) ?? "");
  const [alternatives, setAlternatives] = useState(arrayToLines(initial?.alternatives));
  const [tradeoffs, setTradeoffs] = useState((initial?.tradeoffs as string) ?? "");
  const [consequences, setConsequences] = useState((initial?.consequences as string) ?? "");
  const [traceRefs, setTraceRefs] = useState<string[]>((initial?.traceRefs as string[]) ?? []);

  return (
    <form
      className="flex flex-col gap-3"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit({
          title, category, context, decision, rationale,
          alternatives: linesToArray(alternatives), tradeoffs, consequences, traceRefs,
        });
      }}
    >
      <Input label="Título" value={title} onChange={(e) => setTitle(e.target.value)} required />
      <Select label="Categoria" options={DECISION_CATEGORIES} value={category} onChange={(e) => setCategory(e.target.value)} />
      <Textarea label="Contexto (que problema resolve?)" value={context} onChange={(e) => setContext(e.target.value)} />
      <Textarea label="Decisão (o que foi escolhido?)" required value={decision} onChange={(e) => setDecision(e.target.value)} />
      <Textarea label="Racional (por quê?)" required value={rationale} onChange={(e) => setRationale(e.target.value)} />
      <Textarea label="Alternativas (uma por linha)" rows={2} value={alternatives} onChange={(e) => setAlternatives(e.target.value)} />
      <Textarea label="Tradeoffs" rows={2} value={tradeoffs} onChange={(e) => setTradeoffs(e.target.value)} />
      <Textarea label="Consequências" rows={2} value={consequences} onChange={(e) => setConsequences(e.target.value)} />
      <TraceRefPicker options={refOptions} value={traceRefs} onChange={setTraceRefs} />
      <FormActions onCancel={onCancel} submitting={submitting} disabled={!title.trim() || !decision.trim() || !rationale.trim()} />
    </form>
  );
}

export function ConstraintForm({ initial, refOptions, onSubmit, onCancel, submitting }: FormProps) {
  const [title, setTitle] = useState((initial?.title as string) ?? "");
  const [statement, setStatement] = useState((initial?.statement as string) ?? "");
  const [rationale, setRationale] = useState((initial?.rationale as string) ?? "");
  const [traceRefs, setTraceRefs] = useState<string[]>((initial?.traceRefs as string[]) ?? []);

  return (
    <form
      className="flex flex-col gap-3"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit({ title, statement, rationale, traceRefs });
      }}
    >
      <Input label="Título" value={title} onChange={(e) => setTitle(e.target.value)} required />
      <Textarea label="Enunciado" required value={statement} onChange={(e) => setStatement(e.target.value)} />
      <Textarea label="Racional" rows={2} value={rationale} onChange={(e) => setRationale(e.target.value)} />
      <TraceRefPicker options={refOptions} value={traceRefs} onChange={setTraceRefs} />
      <FormActions onCancel={onCancel} submitting={submitting} disabled={!title.trim() || !statement.trim()} />
    </form>
  );
}

export function ProductDnaForm({ initial, onSubmit, onCancel, submitting }: FormProps) {
  const [mission, setMission] = useState((initial?.mission as string) ?? "");
  const [vision, setVision] = useState((initial?.vision as string) ?? "");
  const [problemStatement, setProblemStatement] = useState((initial?.problemStatement as string) ?? "");
  const [audience, setAudience] = useState((initial?.audience as string) ?? "");
  const [principles, setPrinciples] = useState(arrayToLines(initial?.principles));
  const [constraints, setConstraints] = useState(arrayToLines(initial?.constraints));
  const [nonGoals, setNonGoals] = useState(arrayToLines(initial?.nonGoals));

  return (
    <form
      className="flex flex-col gap-3"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit({
          mission, vision, problemStatement, audience,
          principles: linesToArray(principles),
          constraints: linesToArray(constraints),
          nonGoals: linesToArray(nonGoals),
          traceRefs: (initial?.traceRefs as string[]) ?? [],
        });
      }}
    >
      <Textarea label="Missão" rows={2} required value={mission} onChange={(e) => setMission(e.target.value)} />
      <Textarea label="Visão" rows={2} value={vision} onChange={(e) => setVision(e.target.value)} />
      <Textarea label="Problema" rows={2} value={problemStatement} onChange={(e) => setProblemStatement(e.target.value)} />
      <Input label="Público-alvo" value={audience} onChange={(e) => setAudience(e.target.value)} />
      <Textarea label="Princípios (um por linha)" rows={3} value={principles} onChange={(e) => setPrinciples(e.target.value)} />
      <Textarea label="Constraints (uma por linha)" rows={3} value={constraints} onChange={(e) => setConstraints(e.target.value)} />
      <Textarea label="Não-objetivos (um por linha)" rows={3} value={nonGoals} onChange={(e) => setNonGoals(e.target.value)} />
      <FormActions onCancel={onCancel} submitting={submitting} disabled={!mission.trim()} />
    </form>
  );
}
