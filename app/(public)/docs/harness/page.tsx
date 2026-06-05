import { DocTitle, Lead, H2, P, Callout } from "@/components/docs/primitives";
import { Card, CardContent } from "@/components/ui/Card";

export default function HarnessPage() {
  return (
    <>
      <DocTitle>Harness Engineering</DocTitle>
      <Lead>
        Você dá um prompt — &quot;construa um app full stack com auth, dashboard e
        Stripe&quot; — e o agente gera código por 40 minutos. No fim, um diff de 3.000
        linhas: metade funciona, metade não compila, feature duplicada, teste
        sobrescrito. Isso não é bug do modelo. É falta de <strong>harness</strong>.
      </Lead>

      <P>
        Os modelos de hoje são muito capazes. O problema é que ninguém ensinou o
        agente <em>como trabalhar</em>. A diferença entre quem constrói sistemas
        inteiros com IA e quem só gera trechos tem nome: Harness Engineering.
      </P>

      <H2 id="oque">O que é (e por que agora)</H2>
      <P>
        O <strong>modelo</strong> é a LLM (Claude, GPT, Gemini). O{" "}
        <strong>harness</strong> é todo o resto ao redor: instruções, estrutura do
        repositório, linters, testes, arquivos de progresso, scripts de setup — o
        ambiente operacional que envolve o modelo.
      </P>
      <Callout>
        Pense no modelo como um engenheiro brilhante recém-contratado. Capaz de
        escrever qualquer coisa — mas, largado num repositório sem README, sem
        arquitetura, sem CI e sem testes, vai fazer bobagem. Não por ser burro, mas
        por não ter <strong>contexto</strong>. O harness é o <strong>onboarding</strong>{" "}
        desse engenheiro.
      </Callout>

      <H2 id="controle">Feed forward e feedback</H2>
      <P>Há dois jeitos de controlar um sistema:</P>
      <div className="grid gap-3 sm:grid-cols-2">
        <Card>
          <CardContent>
            <h3 className="font-semibold text-slate-900">Feed forward (preventivo)</h3>
            <p className="text-sm text-slate-600">
              Instruções <em>antes</em> da execução: a spec, as regras de
              arquitetura, o harness — tudo que orienta o agente antes de escrever
              uma linha.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <h3 className="font-semibold text-slate-900">Feedback (corretivo)</h3>
            <p className="text-sm text-slate-600">
              Observar o resultado <em>depois</em> e corrigir: sensores — linters,
              testes, type checkers, agente revisor — que detectam erro e permitem
              autocorreção.
            </p>
          </CardContent>
        </Card>
      </div>
      <Callout>
        É o GPS do carro: <strong>feed forward</strong> é a rota traçada antes de
        sair; <strong>feedback</strong> é detectar que você saiu dela e recalcular.
        Só com a rota, você se perde no primeiro erro; só com o recálculo, anda sem
        direção. Precisa dos dois.
      </Callout>

      <H2 id="falhas">Como agentes falham sem harness</H2>
      <ul className="space-y-2.5 text-sm text-slate-600">
        <li><strong>One-shot hero.</strong> Tenta implementar tudo de uma vez, estoura o contexto e deixa features pela metade.</li>
        <li><strong>Vitória prematura.</strong> Declara &quot;pronto&quot; quando não está — se perde num contexto enorme.</li>
        <li><strong>Amnésia entre sessões.</strong> Cada sessão começa do zero; o agente gasta metade dos tokens só entendendo o estado atual.</li>
        <li><strong>Falso &quot;concluído&quot;.</strong> Marca como pronto sem testar — roda um curl, vê um 200 e segue. O que força não é a instrução, são os sensores (0/1).</li>
        <li><strong>Um único processo.</strong> Um só agente implementa e julga. O caminho é separar: um agente implementa, outro valida.</li>
        <li><strong>Slop acumulado.</strong> Compila, mas viola a arquitetura e duplica lógica; cada sessão piora 5% até o sistema ficar horrível.</li>
      </ul>

      <H2 id="specforge">Como o SpecForge se encaixa</H2>
      <P>
        SDD é <strong>metade do harness</strong> (o feed forward: planeja, quebra em
        tasks, define o que &quot;pronto&quot; significa). O SpecForge gera a outra
        metade a partir do conhecimento:
      </P>
      <ul className="list-disc space-y-1.5 pl-5 text-slate-600">
        <li>
          Um <strong>harness</strong> de 9 camadas (identidade, comportamento,
          arquitetura, segurança, testes, documentação, qualidade, revisão, execução)
          + comportamentos proibidos.
        </li>
        <li>
          <strong>Agent Rules</strong> provider-neutras — a constituição
          comportamental do agente.
        </li>
        <li>
          <strong>4 adapters de saída</strong>: o mesmo harness vira{" "}
          <code>CLAUDE.md</code>, <code>.cursor/rules</code>, instruções de GPT e
          Gemini — troque de agente sem refazer a engenharia.
        </li>
        <li>
          Um <strong>grafo de tasks</strong> com dependências e critérios de aceite.
        </li>
      </ul>
      <Callout>
        O fundamento: um agente que implementa e outro que valida; todo o contexto
        garantindo que a implementação vá no caminho certo; e sinais (guard rails)
        do outro lado garantindo que tudo passa — sem deixar o julgamento só na mão
        da gente. O que fica para o seu repositório é o passo de <em>execução</em>.
      </Callout>
    </>
  );
}
