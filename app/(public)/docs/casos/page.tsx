import { DocTitle, Lead, H2, H3, P, Callout, CodeBlock } from "@/components/docs/primitives";

export default function CasosPage() {
  return (
    <>
      <DocTitle>Casos de uso</DocTitle>
      <Lead>
        Três jornadas completas, do mesmo botão ao sistema inteiro — para você ver
        como o processo se adapta à escala do problema. Siga junto no app: cada caso é
        reproduzível em minutos.
      </Lead>

      {/* ─────────────────────────── STORY ─────────────────────────── */}
      <H2 id="story">Caso 1 — Story: adicionar exportação CSV</H2>
      <P>
        Você tem um sistema rodando e quer adicionar um botão que exporta os
        resultados da busca em CSV. É uma mudança pequena e localizada.
      </P>

      <H3>Passo a passo</H3>
      <CodeBlock>{`1. Nova iniciativa
   Título: "Exportar CSV"
   Intenção: "Adicionar um botão que exporta os
              resultados da busca atual em CSV."

2. Sugerir scope com IA
   → Story · confiança 92%
   Sinais: ação única de UI · impacto localizado ·
           sem integração externa
   → você confirma.

3. Clarificação (2 perguntas — scope Story)
   • Quais colunas devem ser exportadas?
   • Exportar a página atual ou todos os resultados?
   Respostas viram discoveries.

4. Gerar tudo do scope
   ⏳ Especificação consolidada → ✓
   ⏳ Harness → ✓
   ⏳ Tasks → ✓
   ⏳ Artefatos de provider → ✓`}</CodeBlock>

      <H3>O que é gerado</H3>
      <CodeBlock>{`Story Specification (documento único)
  Objetivo · Problema · Escopo (in/out) ·
  Requisitos (REQ-001…) · Fluxo do usuário ·
  Critérios de aceite (AC-001…) · Testes (smoke)

Tasks  →  TASK-001 Adicionar botão na toolbar
          TASK-002 Gerar CSV no cliente
          TASK-003 Disparar download

Harness (6 camadas) → CLAUDE.md, .cursor/rules, …`}</CodeBlock>
      <Callout tone="slate">
        <strong>O que NÃO é gerado:</strong> arquitetura, segurança, visão de produto,
        cascata de specs. Numa Story isso seria desperdício — e o app nem oferece a
        opção (aparecem como &quot;fora do scope&quot;).
      </Callout>

      {/* ─────────────────────────── FEATURE ─────────────────────────── */}
      <H2 id="feature">Caso 2 — Feature: autenticação com Google</H2>
      <P>
        Agora uma capacidade nova: login com Google. Afeta múltiplos componentes,
        envolve integração externa e exige decisões de design.
      </P>

      <H3>Passo a passo</H3>
      <CodeBlock>{`1. Nova iniciativa
   Título: "Login com Google"
   Intenção: "Permitir que usuários entrem com a conta
              Google, vinculando a contas existentes."

2. Sugerir scope com IA
   → Feature · confiança 88%
   Sinais: capacidade nova · integração OAuth ·
           múltiplos fluxos (login, vínculo, sessão)
   → você confirma.

3. Clarificação (6 perguntas — scope Feature)
   • Já existe autenticação por e-mail/senha?
   • Como vincular uma conta Google a uma existente?
   • Quais papéis/permissões os usuários têm?
   • O que acontece se o e-mail do Google já existe?
   …respostas viram decisões e discoveries.

4. Gerar tudo do scope`}</CodeBlock>

      <H3>O que é gerado</H3>
      <CodeBlock>{`Feature Specification (documento único)
  Objetivo · Problema · Escopo · Stakeholders ·
  Requisitos · Fluxos (principal/alternativos/erro) ·
  Considerações de design · Requisitos de integração ·
  Contratos (OAuth, callbacks) · Decisões (DEC-001…) ·
  Critérios de aceite · Estratégia de testes

Tasks  →  grafo com dependências (OAuth antes do vínculo)
Harness (8 camadas, com integração)`}</CodeBlock>
      <Callout>
        Se durante a clarificação surgir necessidade de <strong>segurança</strong> ou{" "}
        <strong>arquitetura</strong> (ex.: gestão de sessão distribuída), o app pode
        sugerir <em>escalar para Product</em> — ou você gera essas specs como opcionais.
      </Callout>

      {/* ─────────────────────────── PRODUCT ─────────────────────────── */}
      <H2 id="produto">Caso 3 — Produto: plataforma de CRM</H2>
      <P>
        O caso completo: criar um CRM do zero. Alta incerteza, múltiplos domínios,
        decisões arquiteturais e necessidade de governança. Aqui o SpecForge roda o
        processo Knowledge First inteiro.
      </P>

      <H3>Passo a passo</H3>
      <CodeBlock>{`1. Nova iniciativa
   Título: "CRM"
   Intenção: "Construir uma plataforma de CRM para
              equipes de vendas B2B."

2. Sugerir scope com IA
   → Product · confiança 95%
   Sinais: criação de sistema · múltiplos domínios ·
           decisões arquiteturais · governança
   → você confirma.

3. Clarificação profunda (10–30 perguntas)
   Visão · público · modelo de negócio · domínios
   (contatos, pipeline, atividades) · integrações ·
   restrições · riscos · preocupações arquiteturais.
   → constrói o Product DNA, decisões e discoveries.

4. Gerar tudo do scope (cascata)`}</CodeBlock>

      <H3>O que é gerado</H3>
      <CodeBlock>{`Conhecimento
  Product DNA · Discoveries · Decisões · Constraints

Specs em cascata (7, cada uma rastreável à anterior)
  1. Requirements   5. Edge Cases
  2. Design         6. Security
  3. Architecture   7. Testing
  4. Contracts

Tasks  →  grafo completo por categoria
Harness (9 camadas, com governança) → 4 providers`}</CodeBlock>
      <Callout tone="slate">
        Product é a profundidade máxima — o processo original do SpecForge (V2),
        preservado. Story e Feature são caminhos mais curtos para o mesmo destino:
        um plano de implementação rastreável e pronto para a IA executar.
      </Callout>

      <H2 id="resumo">Resumo</H2>
      <CodeBlock>{`Mesmo sistema, três escalas:

  Story    →  minutos    →  1 spec + tasks + harness leve
  Feature  →  minutos/h  →  1 spec rica + tasks + harness
  Product  →  horas/dias →  conhecimento + 7 specs + governança

Comece pequeno. Escale quando — e só quando — for preciso.`}</CodeBlock>
    </>
  );
}
