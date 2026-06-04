// Metadados das 7 etapas do wizard (RF04).
export interface StepMeta {
  id: number;
  title: string;
  shortTitle: string;
}

export const WIZARD_STEPS: StepMeta[] = [
  { id: 1, title: "Projeto", shortTitle: "Projeto" },
  { id: 2, title: "Stack & Tech", shortTitle: "Stack" },
  { id: 3, title: "Arquitetura & Convenções", shortTitle: "Arquitetura" },
  { id: 4, title: "Comportamento Esperado", shortTitle: "Comportamento" },
  { id: 5, title: "Review & Gerar Specs", shortTitle: "Specs" },
  { id: 6, title: "Gerar Harness", shortTitle: "Harness" },
  { id: 7, title: "Download", shortTitle: "Download" },
];

export const FIRST_STEP = 1;
export const LAST_STEP = 7;
