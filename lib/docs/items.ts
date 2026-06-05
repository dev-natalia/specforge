// Conteúdo dos guias de itens da documentação. Cada item explica um objeto do
// projeto (o que é, campos, quando usar) com um exemplo concreto.
import type { ItemDoc } from "@/components/docs/ItemDoc";

// ── Itens de conhecimento (Camada 2) ───────────────────────────────────────
export const KNOWLEDGE_ITEMS: ItemDoc[] = [
  {
    id: "discovery",
    name: "Discovery",
    idPrefix: "DISC-",
    answers: "O que aprendemos?",
    what: "Um aprendizado durável obtido em pesquisa, conversa, experimento ou feedback. É a origem da maioria das decisões — preserva o insight que motivou uma escolha.",
    when: "Sempre que você descobre algo sobre usuários, produto, tecnologia, arquitetura ou negócio que deveria sobreviver à conversa.",
    fields: [
      { name: "category", desc: "user, product, technical, architecture, business ou process" },
      { name: "description", desc: "o que foi aprendido" },
      { name: "evidence", desc: "o que sustenta o aprendizado" },
      { name: "implications", desc: "por que isso importa" },
      { name: "confidence", desc: "low / medium / high" },
    ],
    example: `DISC-014 — Usuários ignoram configurações avançadas
Categoria: user · Confiança: high
Descrição: em 8 de 10 sessões, ninguém abriu "Avançado".
Evidência: testes de usabilidade (jun/2026).
Implicações: padrões devem funcionar sem configuração.`,
    tip: "Uma discovery sem evidência é só uma opinião. Registre a fonte.",
  },
  {
    id: "decision",
    name: "Decision",
    idPrefix: "DEC-",
    answers: "O que escolhemos e por quê?",
    what: "Uma escolha do projeto com o raciocínio preservado: contexto, alternativas, tradeoffs e racional. Evita que decisões sejam relitigadas e que o 'porquê' se perca.",
    when: "Quando uma escolha de produto, arquitetura, tecnologia ou processo é tomada e precisa permanecer explicável meses depois.",
    fields: [
      { name: "context", desc: "que problema motivou a decisão" },
      { name: "decision", desc: "o que foi escolhido" },
      { name: "rationale", desc: "por que (obrigatório)" },
      { name: "alternatives", desc: "opções rejeitadas" },
      { name: "tradeoffs", desc: "benefícios e custos aceitos" },
    ],
    example: `DEC-003 — Adotar BYOK
Contexto: não queremos virar plataforma de billing de IA.
Decisão: o usuário traz a própria chave da Anthropic.
Racional: custo zero de operação; conhecimento portável.
Alternativas: revenda de tokens; tier gratuito limitado.
Tradeoffs: setup inicial um pouco mais complexo.`,
    tip: "Decisão sem racional é incompleta. O SpecForge marca isso num quality gate.",
  },
  {
    id: "productDna",
    name: "Product DNA",
    idPrefix: "DNA-",
    answers: "Quem é o projeto?",
    what: "A identidade do projeto: missão, visão, problema, público, princípios, constraints e não-objetivos. É o objeto de mais alto nível — tudo abaixo deve se alinhar a ele.",
    when: "Defina cedo, um por projeto. Ele governa specs, harness e decisões e previne a deriva de produto.",
    fields: [
      { name: "mission", desc: "por que o produto existe" },
      { name: "vision", desc: "que futuro busca criar" },
      { name: "audience", desc: "para quem é" },
      { name: "principles", desc: "regras de decisão" },
      { name: "constraints", desc: "limites inegociáveis" },
      { name: "nonGoals", desc: "o que o produto nunca deve ser" },
    ],
    example: `DNA-001
Missão: preservar conhecimento de engenharia para IA.
Público: devs individuais que se importam com arquitetura.
Princípios: Knowledge First; Preservar Racional.
Constraints: Local First; BYOK; Free Forever.
Não-objetivos: gerência de projetos; billing de IA.`,
    tip: "Use o Product DNA como filtro: a feature melhora preservação de conhecimento e qualidade de contexto?",
  },
  {
    id: "constraint",
    name: "Constraint",
    idPrefix: "CONST-",
    answers: "Que limites existem?",
    what: "Um limite inegociável — técnico, de negócio ou de produto. Constraints não são obstáculos: são decisões de design que mantêm o projeto focado.",
    when: "Quando há uma fronteira que não deve ser cruzada sem aprovação explícita.",
    fields: [
      { name: "statement", desc: "o enunciado do limite" },
      { name: "rationale", desc: "por que ele existe" },
    ],
    example: `CONST-002 — Local First
Enunciado: o conhecimento vive em arquivos/IndexedDB do usuário.
Racional: portabilidade e propriedade do usuário; sem lock-in.`,
    tip: "Constraints viram regras no harness — o agente passa a respeitá-las automaticamente.",
  },
  {
    id: "clarification",
    name: "Clarification",
    idPrefix: "CLAR-",
    answers: "O que falta saber?",
    what: "Uma incerteza detectada antes da geração: lacuna, ambiguidade, contradição ou suposição oculta. A IA levanta perguntas priorizadas; a resposta vira conhecimento durável.",
    when: "Logo após descrever a intenção do projeto. Prefira clarificar a deixar a IA assumir.",
    fields: [
      { name: "category", desc: "missingInfo, ambiguity, contradiction, assumption, scopeGap, decisionGap…" },
      { name: "priority", desc: "critical, high, medium, low" },
      { name: "context", desc: "por que a pergunta existe" },
      { name: "impact", desc: "consequência de não responder" },
      { name: "answer", desc: "sua resposta → vira discovery/decision" },
    ],
    example: `CLAR-001 (prioridade: critical · decisionGap)
Pergunta: qual mecanismo de persistência usar?
Contexto: o app exige dados duráveis, mas nada foi definido.
Impacto: afeta arquitetura, deploy e portabilidade.
Resposta: "IndexedDB local-first" → vira DEC-00X.`,
    tip: 'Responder e clicar em "Virar conhecimento" fecha a pergunta e cria a discovery/decisão.',
  },
];

// ── Specs (Camada 4) — os 7 tipos em cascata ────────────────────────────────
export const SPEC_ITEMS: ItemDoc[] = [
  {
    id: "requirements",
    name: "1. Requirements",
    idPrefix: "SPEC-",
    what: "O que o sistema deve fazer, do ponto de vista de produto/negócio. Base da cascata — todas as outras specs derivam dela.",
    fields: [
      { name: "Requisitos funcionais", desc: "RF-### com descrição, racional e prioridade" },
      { name: "Não-funcionais", desc: "performance, segurança, acessibilidade…" },
      { name: "Critérios de aceite", desc: "Given / When / Then" },
      { name: "Fora de escopo", desc: "seção obrigatória" },
    ],
    example: `# Requirements
## Funcionais
- RF-001 — Criar cobrança Pix (valor, chave, expiração 30min) [crítico]
## Critérios de aceite
- Dado um valor válido, quando POST /payments, então status PENDING.
_Origens: DEC-003, DISC-014_`,
  },
  {
    id: "design",
    name: "2. Design",
    what: "Como a solução se comporta: jornada do usuário, fluxos, telas, estados, validações e tratamento de erro. Entre requisitos e arquitetura.",
    fields: [
      { name: "User journey / flows", desc: "trigger, passos, caminhos alternativos" },
      { name: "Modelo de estados", desc: "transições explícitas" },
      { name: "Estados de tela", desc: "vazio, erro, loading" },
    ],
    example: `# Design
## Fluxo: criar cobrança
Abrir → preencher valor → validar → persistir → exibir QR.
## Estados
Draft → Pending → Paid → (Expired)`,
  },
  {
    id: "architecture",
    name: "3. Architecture",
    idPrefix: "ARCH-",
    what: "A estrutura técnica: componentes, responsabilidades, fronteiras de domínio, dados, integrações e comunicação.",
    fields: [
      { name: "Componentes", desc: "responsabilidade, inputs/outputs, deps, ownership" },
      { name: "Fronteiras de domínio", desc: "o que pertence (e o que não)" },
      { name: "Arquitetura de dados", desc: "entidades, ownership, fluxo" },
    ],
    example: `# Architecture
## Componentes
- PaymentService — cria cobranças, owner do agregado Payment.
- WebhookHandler — valida assinatura do PSP, atualiza status.
## Comunicação: request-response síncrono + webhook assíncrono.`,
  },
  {
    id: "contracts",
    name: "4. Contracts",
    idPrefix: "CON-",
    what: "Os acordos de comunicação: APIs, eventos, comandos, queries, schemas, validações e erros. Implementação-independente.",
    fields: [
      { name: "API", desc: "endpoint, auth, request/response, erros" },
      { name: "Schemas", desc: "campo, tipo, obrigatório, restrições" },
      { name: "Compatibilidade", desc: "versionamento e deprecação" },
    ],
    example: `# Contracts
## POST /payments
Auth: Bearer · Idempotency-Key obrigatório
Request: { amount:int>0, pixKey:string }
Response 201: { id, status:"PENDING", qrCode }
Erros: 400 invalid_amount, 409 duplicate_key`,
  },
  {
    id: "edgeCases",
    name: "5. Edge Cases",
    idPrefix: "EDGE-",
    what: "Cenários excepcionais e de fronteira: entradas inválidas, concorrência, falhas de integração, limites. Reduz defeitos fora do happy path.",
    fields: [
      { name: "Categorias", desc: "input, estado, concorrência, integração, dados, segurança…" },
      { name: "Por caso", desc: "cenário, trigger, comportamento esperado, severidade, mitigação" },
    ],
    example: `# Edge Cases
## EDGE-INT-001 — PSP indisponível (severidade: alta)
Cenário: webhook não chega em 30min.
Esperado: marcar como EXPIRED; permitir reconciliação manual.
Mitigação: job de varredura + retry idempotente.`,
  },
  {
    id: "security",
    name: "6. Security",
    idPrefix: "SEC-",
    what: "O modelo de segurança: ativos, ameaças, trust boundaries, autenticação/autorização, proteção de dados e gestão de segredos.",
    fields: [
      { name: "Inventário de ativos", desc: "o que precisa de proteção" },
      { name: "Modelo de ameaças", desc: "ameaça, superfície, impacto, mitigação" },
      { name: "AuthN / AuthZ", desc: "como se autentica e autoriza" },
    ],
    example: `# Security
## Ameaça: IDOR em /payments/{id}
Mitigação: sempre filtrar por usuário dono do recurso.
## Segredos: chaves do PSP em variáveis de ambiente, nunca no código.`,
  },
  {
    id: "testing",
    name: "7. Testing",
    idPrefix: "TEST-",
    what: "A estratégia de validação: o que testar, como, e a matriz de rastreabilidade requisito → teste. Transforma expectativas em evidência.",
    fields: [
      { name: "Categorias", desc: "unit, integração, contrato, e2e, segurança, performance" },
      { name: "Cenários", desc: "TEST-SCN-### com pré-condições, ações, resultado" },
      { name: "Matriz", desc: "requisito → cenário de teste" },
    ],
    example: `# Testing
## TEST-SCN-001 — cobrança paga via webhook
Dado uma cobrança PENDING, quando chega webhook válido,
então status vira PAID. (cobre RF-002)`,
  },
];

// ── Artefatos finais (Camada 5/6) ──────────────────────────────────────────
export const ARTIFACT_ITEMS: ItemDoc[] = [
  {
    id: "harness",
    name: "Harness",
    idPrefix: "HAR-",
    answers: "Como a IA deve se comportar?",
    what: "O ambiente operacional provider-neutro derivado do conhecimento + specs. Nove camadas (Identidade, Comportamento, Arquitetura, Segurança, Testes, Documentação, Qualidade, Revisão, Execução) + comportamentos proibidos.",
    when: "Depois das specs. É a base de onde saem os artefatos por agente.",
    fields: [
      { name: "layers", desc: "regras por dimensão (identidade, segurança, testes…)" },
      { name: "prohibited", desc: "anti-padrões explícitos" },
    ],
    example: `HAR-001 (v1)
Identidade: Local-first, BYOK, Free Forever.
Segurança: validar toda entrada; nunca logar segredos.
Proibido: inventar requisitos; ignorar a arquitetura.`,
  },
  {
    id: "agent-rules",
    name: "Agent Rules",
    idPrefix: "AGENT-",
    answers: "Regras do agente",
    what: "A constituição comportamental provider-neutra: regras que todo agente deve seguir, independentemente do provider. Geradas junto com o harness.",
    fields: [{ name: "rules", desc: "lista de regras acionáveis" }],
    example: `AGENT-001
1. Prefira clarificação a suposição.
2. Preserve rastreabilidade (cite IDs de origem).
3. Mudou comportamento? Atualize os testes.`,
  },
  {
    id: "provider-artifacts",
    name: "Provider Adapters",
    idPrefix: "ART-",
    answers: "Um harness, 4 saídas",
    what: "A tradução do harness para cada agente — transformação pura, sem IA e sem chave. CLAUDE.md, .cursor/rules, GPT_INSTRUCTIONS.md e GEMINI_INSTRUCTIONS.md.",
    when: "Após gerar o harness. Troque de provider sem refazer a engenharia.",
    fields: [
      { name: "claude", desc: "CLAUDE.md" },
      { name: "cursor", desc: ".cursor/rules" },
      { name: "gpt", desc: "GPT_INSTRUCTIONS.md" },
      { name: "gemini", desc: "GEMINI_INSTRUCTIONS.md" },
    ],
    example: `# CLAUDE.md
Projeto: Meu App — Local-first
## Identidade
- Local-first, BYOK, Free Forever.
## Proibido
- Inventar requisitos.
_Rastreabilidade: HAR-001_`,
  },
  {
    id: "task",
    name: "Task",
    idPrefix: "TASK-",
    answers: "Como executar?",
    what: "A menor unidade de trabalho executável, derivada das specs. Carrega objetivo, dependências, critérios de aceite e expectativas de teste/segurança.",
    when: "Depois das specs, para transformar o plano em execução por humanos ou agentes.",
    fields: [
      { name: "category", desc: "foundation, feature, architecture, security, testing…" },
      { name: "dependencies", desc: "IDs de tasks predecessoras (grafo)" },
      { name: "acceptanceCriteria", desc: "como saber que está pronto" },
    ],
    example: `TASK-002 — Implementar POST /payments [feature]
Depende de: TASK-001
Critérios: cria cobrança PENDING; idempotência via header.
Origens: SPEC-004 (Contracts), SPEC-001 (Requirements)`,
  },
  {
    id: "quality-gates",
    name: "Quality Gates",
    answers: "Está bom para avançar?",
    what: "Checkpoints de validação que avaliam completude, consistência e rastreabilidade. Resultado: pass < warning < revision < blocked. Geração sem validação é proibida.",
    when: "Automático — aparecem no topo do workspace apontando o que falta.",
    fields: [
      { name: "knowledge", desc: "identidade, racional, evidência, integridade" },
      { name: "spec", desc: "conteúdo, origem, base da cascata" },
    ],
    example: `Quality gates (conhecimento)
- Identidade (Product DNA): warning — projeto sem Product DNA.
- Racional das decisões: revision — DEC-002 sem racional.`,
  },
  {
    id: "traceability",
    name: "Rastreabilidade & IDs",
    answers: "De onde veio? O que depende disso?",
    what: "Todo artefato derivado mantém referências às suas origens via IDs estáveis (DISC-, DEC-, SPEC-, HAR-, TASK-…). O sistema detecta refs quebradas, órfãos e ciclos.",
    when: "Sempre. É a costura que torna o output explicável.",
    example: `DISC-014 → DEC-003 → SPEC-001 → HAR-001 → TASK-002
Cada seta é uma referência verificável (traceRef).`,
    tip: "O badge no cabeçalho do projeto fica verde quando a rastreabilidade está íntegra.",
  },
];
