import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";

const STEPS = [
  {
    title: "1. Descreva o projeto",
    body: "Preencha um wizard guiado com stack, arquitetura e comportamento esperado.",
  },
  {
    title: "2. Gere specs e harness",
    body: "A IA cria specs (SDD) e o harness (CLAUDE.md, configs, hooks) prontos para uso.",
  },
  {
    title: "3. Baixe o .zip",
    body: "Receba toda a estrutura de arquivos para jogar direto no seu repositório.",
  },
];

const FEATURES = [
  {
    title: "Spec-Driven Development",
    body: "spec.md, requirements.md, design.md e tasks.md gerados a partir do seu contexto.",
  },
  {
    title: "Harness Engineering",
    body: "Guias e sensores que dão estrutura e confiança ao trabalho com agentes de IA.",
  },
  {
    title: "Compatível com qualquer agente",
    body: "Output funciona com Claude Code, Cursor, Copilot e outros.",
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
            Specs e harness para seus agentes de IA, em minutos
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
            O SpecForge gera specs no formato Spec-Driven Development e um harness
            pronto para uso. Baixe um .zip e comece a trabalhar com agentes de IA
            com estrutura e confiança.
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <Link href="/new">
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
