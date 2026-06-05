import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";

const STEPS = [
  {
    title: "1. Capture conhecimento",
    body: "Descreva a intenção; a IA levanta clarificações e transforma respostas em discoveries e decisões duráveis.",
  },
  {
    title: "2. Gere specs em cascata",
    body: "Requisitos → Design → Arquitetura → Contratos → Edge Cases → Segurança → Testes, tudo rastreável ao conhecimento.",
  },
  {
    title: "3. Harness e tasks",
    body: "Gere o harness, os artefatos por agente (CLAUDE.md, .cursor/rules, GPT, Gemini) e o grafo de tasks. Exporte o .zip.",
  },
];

const FEATURES = [
  {
    title: "Knowledge First",
    body: "Conhecimento é o ativo durável. Specs, harness e tasks são artefatos derivados e rastreáveis.",
  },
  {
    title: "Local First",
    body: "Seus projetos vivem no navegador (IndexedDB), versionados. Exporte e reimporte como arquivos.",
  },
  {
    title: "Provider-agnóstico",
    body: "Um harness, quatro saídas: Claude, Cursor, GPT e Gemini.",
  },
  {
    title: "Sua chave, sem limites",
    body: "Use sua própria chave da Anthropic. Sem login e sem nada salvo nos nossos servidores.",
  },
];

export default function LandingPage() {
  return (
    <div>
      <section className="bg-gradient-to-b from-brand-50 to-white">
        <div className="mx-auto max-w-4xl px-4 py-20 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-brand-600">
            Especifique. Forje. Gere.
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Conhecimento durável para seus agentes de IA
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
            O SpecForge preserva o conhecimento do seu projeto e o transforma em
            specs, harness e tasks rastreáveis — o contexto que faz a IA gerar
            código consistente. Local-first, com a sua chave.
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <Link href="/projects">
              <Button size="lg">Começar agora</Button>
            </Link>
            <Link href="/docs">
              <Button size="lg" variant="outline">
                Ver documentação
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-16">
        <h2 className="text-center text-2xl font-bold text-slate-900">
          Como funciona
        </h2>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {STEPS.map((step) => (
            <Card key={step.title}>
              <CardContent>
                <h3 className="font-semibold text-slate-900">{step.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{step.body}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-5xl px-4 py-16">
          <h2 className="text-center text-2xl font-bold text-slate-900">
            O que você recebe
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {FEATURES.map((feature) => (
              <Card key={feature.title}>
                <CardContent>
                  <h3 className="font-semibold text-slate-900">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm text-slate-600">{feature.body}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
