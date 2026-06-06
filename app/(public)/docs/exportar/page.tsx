import { DocTitle, Lead, H2, P, Callout, CodeBlock } from "@/components/docs/primitives";
import { Card, CardContent } from "@/components/ui/Card";

export default function ExportDocsPage() {
  return (
    <>
      <DocTitle>Exportar &amp; usar</DocTitle>
      <Lead>
        O botão <strong>Exportar .zip</strong> empacota o projeto inteiro: o
        conhecimento, as specs, o harness, os artefatos por agente e as tasks —
        tudo pronto para o seu repositório.
      </Lead>

      <H2 id="estrutura">Estrutura do .zip</H2>
      <CodeBlock>{`seu-projeto/
├─ specforge.json              # snapshot fiel (para reimportar)
├─ knowledge/
│  ├─ discovery/DISC-001.md
│  ├─ decision/DEC-001.md
│  └─ productDna/DNA-001.md
├─ specs/001-<slug>/
│  ├─ requirements.md  design.md  architecture.md
│  ├─ contracts.md  edge-cases.md  security.md  testing.md
│  └─ tasks.md
├─ CLAUDE.md                   # adapter Claude
├─ .cursor/rules               # adapter Cursor
├─ GPT_INSTRUCTIONS.md         # adapter GPT
├─ GEMINI_INSTRUCTIONS.md      # adapter Gemini
└─ MEMORY.md                   # decisões + tarefas realizadas (mantida viva)`}</CodeBlock>

      <H2 id="usar">Como usar no repositório</H2>
      <ol className="list-decimal space-y-2.5 pl-5 text-slate-600">
        <li><strong>Extraia o zip</strong> na raiz do repositório (novo ou existente).</li>
        <li>
          <strong>Aponte seu agente</strong> para o arquivo do provider que você usa
          (<code>CLAUDE.md</code>, <code>.cursor/rules</code>, etc.) — é o contrato
          operacional que ele deve seguir.
        </li>
        <li>
          <strong>Implemente task a task</strong> pelo <code>tasks.md</code>, sempre
          com as specs como referência.
        </li>
        <li>
          <strong>Use as specs como fonte de verdade.</strong> Se algo estiver fora,
          ajuste o conhecimento no SpecForge e regenere — é mais barato corrigir o
          documento do que o código.
        </li>
        <li>
          <strong>Registre no <code>MEMORY.md</code>.</strong> O harness obriga o
          agente a gravar ali toda decisão maior (arquitetura, contratos, segurança,
          tradeoffs) e toda tarefa realizada, usando os modelos de entrada incluídos
          — preserva o racional e o histórico, evitando drift ao longo da implementação.
        </li>
      </ol>

      <H2 id="roundtrip">Round-trip: reimportar</H2>
      <P>
        Em <strong>Projetos → Importar projeto</strong>, selecione o{" "}
        <code>specforge.json</code> de dentro do zip para recriar o projeto exatamente
        como estava — conhecimento, specs, harness e tasks. É a portabilidade
        File-Based: seu conhecimento é seu e viaja como arquivo.
      </P>

      <H2 id="modelo">Modelo &amp; configuração</H2>
      <P>
        A geração usa o <strong>Claude Opus 4.8</strong> (<code>claude-opus-4-8</code>)
        — o modelo de raciocínio para a parte de &quot;pensar&quot;: clarificar,
        especificar, planejar.
      </P>
      <Card>
        <CardContent className="space-y-2 text-sm text-slate-700">
          <div className="flex justify-between border-b border-slate-100 py-1.5">
            <span className="font-medium text-slate-500">Modelo</span>
            <span className="font-mono">claude-opus-4-8</span>
          </div>
          <div className="flex justify-between border-b border-slate-100 py-1.5">
            <span className="font-medium text-slate-500">temperature</span>
            <span className="font-mono">— (não enviado)</span>
          </div>
          <div className="flex justify-between border-b border-slate-100 py-1.5">
            <span className="font-medium text-slate-500">Geração</span>
            <span className="font-mono">navegador → Anthropic (BYOK)</span>
          </div>
          <div className="flex justify-between py-1.5">
            <span className="font-medium text-slate-500">Persistência</span>
            <span className="font-mono">IndexedDB (local-first)</span>
          </div>
        </CardContent>
      </Card>
      <Callout>
        A geração usa a <strong>sua própria chave da Anthropic</strong>, configurada
        em <strong>Configurações</strong> — ela fica só no seu navegador. Sem login,
        sem servidor no meio: a chave nunca passa por nós.
      </Callout>
    </>
  );
}
