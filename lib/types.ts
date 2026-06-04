// Tipos de domínio compartilhados entre cliente e servidor.

export type ProjectType =
  | "API_REST"
  | "FRONTEND"
  | "FULLSTACK"
  | "LIBRARY"
  | "CLI"
  | "OTHER";

// Tópico adicional criado pelo usuário no final do wizard, para cobrir
// informações que ele acha que ficaram faltando.
export interface CustomTopic {
  id: string;
  title: string;
  content: string;
}

// Pergunta de clarificação levantada pela IA + a resposta do usuário.
export interface Clarification {
  question: string;
  answer: string;
}

// Achado da análise de consistência entre specs e harness.
export type AnalysisSeverity = "info" | "warning" | "error";

export interface AnalysisFinding {
  severity: AnalysisSeverity;
  message: string;
}

// Arquivo gerado pela IA, usado no preview e no zip.
export interface GeneratedFile {
  name: string;
  path: string;
  content: string;
  language: string;
}

// Dados coletados nas etapas 1-4 do wizard.
export interface WizardFormData {
  projectName: string;
  description: string;
  projectType: ProjectType;
  language: string;
  frameworks?: string;
  runtime?: string;
  database?: string;
  architectureConventions?: string;
  constraints?: string;
  folderStructure?: string;
  behaviorExamples?: string;
  businessRules?: string;
  edgeCases?: string;
  customTopics?: CustomTopic[];
  clarifications?: Clarification[];
}
