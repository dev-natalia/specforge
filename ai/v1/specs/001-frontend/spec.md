# Spec — SpecForge

> Especifique. Forje. Gere.

## Visão do Produto

SpecForge é uma aplicação web que guia o usuário por um wizard para coletar
informações sobre seu projeto de software e, a partir disso, gera:

1. **Specs** no formato Spec-Driven Development (spec.md, requirements.md,
   design.md, tasks.md)
2. **Harness Engineering** pronto para uso (CLAUDE.md, AGENTS.md com papéis
   implementador/validador, configs de lint, hooks/CI, testes estruturais,
   PROGRESS.md e script de bootstrap)

O output é um `.zip` com toda a estrutura de arquivos, compatível com qualquer
agente de IA (Claude Code, Cursor, Copilot, etc).

O app é **stateless** e **BYOK** (Bring Your Own Key): sem login, sem banco e
sem billing. Toda geração usa a chave da Anthropic do próprio usuário, que fica
apenas no navegador.

---

## Problema que Resolve

Desenvolvedores que querem adotar SDD e Harness Engineering perdem horas
configurando templates, escrevendo specs do zero e montando a estrutura de
controle (guias + sensores) para agentes de IA. O SpecForge automatiza esse
trabalho em minutos.

---

## Usuários

- **Desenvolvedor solo** que quer usar agentes de IA com mais estrutura
- **Tech lead** que quer padronizar o processo de specs do time
- **Iniciante em SDD/Harness** que quer aprender fazendo

---

## User Stories

### Educação
- Como visitante, quero entender SDD e Harness Engineering antes de usar, para
  saber se a ferramenta é útil para mim.
- Como visitante, quero ver exemplos reais de output, para saber o que vou
  receber.

### Chave da Anthropic (BYOK)
- Como usuário, quero informar minha própria chave da Anthropic, para gerar
  usando minha conta (pago a Anthropic direto).
- Como usuário, quero que a chave fique só no meu navegador e nunca passe por um
  servidor de terceiros, por privacidade.
- Como usuário, quero ser avisado para configurar a chave antes de criar um
  projeto, para não começar e travar no meio.

### Wizard de Criação
- Como usuário, quero preencher as informações do projeto em etapas guiadas.
- Como usuário, quero voltar para etapas anteriores e corrigir informações.
- Como usuário, quero um indicador de progresso.
- Como usuário, quero adicionar **tópicos livres** no final, para cobrir o que
  não coube nos campos padrão.

### Clarificação
- Como usuário, quero que a IA levante perguntas de ambiguidade antes de gerar,
  para preencher lacunas que eu não tinha pensado.

### Geração de Specs e Harness
- Como usuário, quero que a IA gere os specs automaticamente e fazer preview com
  syntax highlighting.
- Como usuário, quero poder regenerar se não gostar do resultado.
- Como usuário, quero que a IA gere o harness a partir dos specs aprovados.
- Como usuário, quero rodar uma **análise de consistência** entre specs e
  harness, para ver contradições ou lacunas.

### Download
- Como usuário, quero baixar um `.zip` com toda a estrutura, para jogar no meu
  repositório.

---

## Critérios de Aceite

### Chave / Acesso
- [ ] Tela de Configurações para informar, testar e remover a chave (localStorage)
- [ ] `/new` bloqueia o wizard até a chave estar configurada
- [ ] A chave nunca passa por servidor nosso nem é logada (geração é client-side)

### Wizard
- [ ] 7 etapas claramente definidas, com navegação e validação por etapa
- [ ] Estado persiste em memória ao navegar (não perde dados)
- [ ] Indicador visual de progresso
- [ ] Tópicos adicionais na etapa de review

### Geração
- [ ] Clarificação opcional (perguntas da IA) antes de gerar specs
- [ ] Geração de specs e harness via IA, com preview e regenerar
- [ ] Análise de consistência opcional após o harness

### Download
- [ ] Geração de `.zip` server-side com a estrutura completa
- [ ] Download disparado no browser

### Docs
- [ ] Página `/docs` explicando SDD, Harness Engineering e o wizard campo-a-campo
- [ ] Exemplos de output real

---

## Fora de Escopo

- Login / contas de usuário
- Persistência / histórico de projetos (app é stateless)
- Billing / planos pagos (geração é sempre BYOK)
- Editor inline dos arquivos gerados (apenas visualização)
- Integração direta com GitHub (push de arquivos)
- Orquestração runtime multi-agente (implementador × validador) — o SpecForge
  gera os arquivos; rodar os sensores e orquestrar fica no repositório do usuário
