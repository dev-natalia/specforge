// Guia campo-a-campo do wizard, usado na página /docs.
// Cada campo explica: o que é, por que a IA precisa, um exemplo bom e uma dica.

export interface FieldGuide {
  field: string;
  optional: boolean;
  what: string;
  why: string;
  example: string;
  tip?: string;
}

export interface StepGuide {
  step: number;
  anchor: string;
  title: string;
  intro: string;
  fields: FieldGuide[];
}

export const WIZARD_GUIDE: StepGuide[] = [
  {
    step: 1,
    anchor: "wizard-projeto",
    title: "Etapa 1 — Projeto",
    intro:
      "Define a identidade do projeto. É o ponto de partida que dá nome e propósito ao que será especificado.",
    fields: [
      {
        field: "Nome do projeto",
        optional: false,
        what: "Um nome curto e reconhecível para o projeto.",
        why: "Vira o slug das pastas de spec (specs/001-<slug>/) e o título dos arquivos gerados.",
        example: "API de Pagamentos Pix",
        tip: "Prefira algo específico ('Checkout B2B') em vez de genérico ('Backend').",
      },
      {
        field: "Descrição",
        optional: false,
        what: "Um parágrafo explicando o objetivo do projeto, o problema que resolve e quem usa.",
        why: "É o contexto mais importante para a IA: orienta visão, user stories e critérios de aceite.",
        example:
          "Serviço que recebe cobranças via Pix, concilia pagamentos com o extrato do PSP e notifica o lojista por webhook. Usado por lojas que vendem online e precisam confirmar pagamento em tempo real.",
        tip: "Responda 'o quê', 'para quem' e 'por quê'. Quanto mais concreto, melhores os specs.",
      },
      {
        field: "Tipo de projeto",
        optional: false,
        what: "A natureza do software: API REST, Frontend, Fullstack, Biblioteca, CLI ou Outro.",
        why: "Ajusta a estrutura dos specs e do harness (uma CLI não precisa de rotas; uma lib foca em API pública).",
        example: "API REST",
      },
    ],
  },
  {
    step: 2,
    anchor: "wizard-stack",
    title: "Etapa 2 — Stack & Tech",
    intro:
      "As tecnologias do projeto. Elas determinam as convenções, os linters e os exemplos de código que o harness vai gerar.",
    fields: [
      {
        field: "Linguagem principal",
        optional: false,
        what: "A linguagem central do projeto.",
        why: "Define a sintaxe dos exemplos, o tipo de testes e as ferramentas de lint/format do harness.",
        example: "TypeScript",
      },
      {
        field: "Frameworks / libs",
        optional: true,
        what: "Bibliotecas e frameworks principais que o projeto usa ou deve usar.",
        why: "Faz a IA gerar specs e harness coerentes com o ecossistema (ex: rotas no padrão do framework).",
        example: "Next.js 14 (App Router), Prisma, Zod, Vitest",
        tip: "Liste só o que é estrutural; não precisa enumerar toda dependência.",
      },
      {
        field: "Runtime",
        optional: true,
        what: "O ambiente de execução e versão.",
        why: "Influencia constraints de compatibilidade e scripts de CI no harness.",
        example: "Node.js 20",
      },
      {
        field: "Banco de dados",
        optional: true,
        what: "O mecanismo de persistência, se houver.",
        why: "Orienta o data-model nos specs e as regras de acesso a dados no harness.",
        example: "PostgreSQL via Prisma",
      },
    ],
  },
  {
    step: 3,
    anchor: "wizard-arquitetura",
    title: "Etapa 3 — Arquitetura & Convenções",
    intro:
      "As regras do jogo. Aqui você ensina ao agente como o time trabalha e o que nunca deve fazer — a base do harness.",
    fields: [
      {
        field: "Convenções de arquitetura / padrões do time",
        optional: true,
        what: "Padrões que o código deve seguir.",
        why: "Viram regras explícitas no CLAUDE.md/AGENTS.md, guiando o agente para o estilo do time.",
        example:
          "Server Components por padrão; validação com Zod em toda borda; lógica de negócio só em lib/, nunca em componentes.",
        tip: "Escreva como regras imperativas ('sempre…', 'use…'). É assim que o harness as aplica.",
      },
      {
        field: "Constraints técnicas / o que NÃO deve ser feito",
        optional: true,
        what: "Proibições e limites — o anti-padrão que você quer evitar.",
        why: "São os 'sensores' negativos do harness: o agente é instruído a nunca cruzar essas linhas.",
        example:
          "Não usar Pages Router; não chamar a IA do cliente; nunca logar dados sensíveis; nunca confiar só no ID do recurso (sempre filtrar por usuário).",
        tip: "Pense nos erros que você mais corrige em PRs e transforme cada um numa proibição.",
      },
      {
        field: "Estrutura de pastas preferida",
        optional: true,
        what: "Como o repositório deve ser organizado.",
        why: "A IA gera os arquivos seguindo essa árvore, mantendo consistência com o que você já tem.",
        example: "app/ (rotas), components/, lib/ (regras), prisma/, specs/",
      },
    ],
  },
  {
    step: 4,
    anchor: "wizard-comportamento",
    title: "Etapa 4 — Comportamento Esperado",
    intro:
      "O que o software faz na prática. Exemplos concretos tornam os specs precisos e testáveis.",
    fields: [
      {
        field: "Exemplos de inputs / outputs",
        optional: true,
        what: "Pares concretos de entrada e saída esperada.",
        why: "Permitem que a IA derive critérios de aceite verificáveis e casos de teste.",
        example:
          "POST /payments { amount: 1000, pixKey } → 201 { id, status: 'PENDING' }. Webhook recebido → status vira 'PAID'.",
        tip: "Mostre o caminho feliz e pelo menos um erro (ex: 422 para valor inválido).",
      },
      {
        field: "Regras de negócio principais",
        optional: true,
        what: "As políticas que governam o domínio.",
        why: "Viram requisitos funcionais explícitos, não suposições da IA.",
        example:
          "Pagamento acima de R$ 10.000 exige aprovação manual; cobranças expiram em 30 minutos; reembolso só dentro de 7 dias.",
      },
      {
        field: "Edge cases conhecidos",
        optional: true,
        what: "Situações de borda que costumam quebrar o sistema.",
        why: "A IA escreve requisitos e testes para esses casos em vez de ignorá-los.",
        example:
          "Idempotência em retries com a mesma Idempotency-Key; timeout do gateway; webhook duplicado; pagamento parcial.",
        tip: "Liste os bugs que já te morderam antes — são ouro para o harness.",
      },
    ],
  },
];

// Tópicos adicionais (criados na etapa de review).
export const CUSTOM_TOPICS_GUIDE: FieldGuide = {
  field: "Tópicos adicionais",
  optional: true,
  what: "Temas livres ({título, conteúdo}) que você cria quando sente que algo ficou de fora dos campos padrão.",
  why: "Entram no mesmo contexto enviado à IA, com a mesma sanitização — flexibilidade sem perder estrutura.",
  example:
    "Título: 'Observabilidade' — Conteúdo: 'Toda rota deve emitir trace e métrica de latência; erros vão para o Sentry com tag de tenant.'",
  tip: "Use para requisitos transversais: segurança, observabilidade, i18n, acessibilidade, compliance.",
};
