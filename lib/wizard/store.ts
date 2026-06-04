// Estado do wizard via Zustand (design.md). Mantido em memória durante a
// sessão (RF04.10) — sem persistência de rascunho na v1.
import { create } from "zustand";
import type {
  Clarification,
  CustomTopic,
  GeneratedFile,
  WizardFormData,
} from "@/lib/types";
import { FIRST_STEP, LAST_STEP } from "@/lib/wizard/steps";

const EMPTY_FORM: WizardFormData = {
  projectName: "",
  description: "",
  projectType: "FULLSTACK",
  language: "",
  frameworks: "",
  runtime: "",
  database: "",
  architectureConventions: "",
  constraints: "",
  folderStructure: "",
  behaviorExamples: "",
  businessRules: "",
  edgeCases: "",
  customTopics: [],
  clarifications: [],
};

function newTopicId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `topic-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

interface WizardState {
  step: number;
  formData: WizardFormData;
  generatedSpecs: GeneratedFile[] | null;
  generatedHarness: GeneratedFile[] | null;

  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  updateForm: (patch: Partial<WizardFormData>) => void;
  addCustomTopic: () => void;
  updateCustomTopic: (id: string, patch: Partial<Omit<CustomTopic, "id">>) => void;
  removeCustomTopic: (id: string) => void;
  setClarificationQuestions: (questions: string[]) => void;
  updateClarificationAnswer: (index: number, answer: string) => void;
  setSpecs: (files: GeneratedFile[] | null) => void;
  setHarness: (files: GeneratedFile[] | null) => void;
  hydrate: (data: Partial<WizardFormData>) => void;
  reset: () => void;
}

function clampStep(step: number): number {
  return Math.min(LAST_STEP, Math.max(FIRST_STEP, step));
}

export const useWizardStore = create<WizardState>((set) => ({
  step: FIRST_STEP,
  formData: { ...EMPTY_FORM },
  generatedSpecs: null,
  generatedHarness: null,

  setStep: (step) => set({ step: clampStep(step) }),
  nextStep: () => set((state) => ({ step: clampStep(state.step + 1) })),
  prevStep: () => set((state) => ({ step: clampStep(state.step - 1) })),
  updateForm: (patch) =>
    set((state) => ({ formData: { ...state.formData, ...patch } })),
  addCustomTopic: () =>
    set((state) => ({
      formData: {
        ...state.formData,
        customTopics: [
          ...(state.formData.customTopics ?? []),
          { id: newTopicId(), title: "", content: "" },
        ],
      },
    })),
  updateCustomTopic: (id, patch) =>
    set((state) => ({
      formData: {
        ...state.formData,
        customTopics: (state.formData.customTopics ?? []).map((topic) =>
          topic.id === id ? { ...topic, ...patch } : topic,
        ),
      },
    })),
  removeCustomTopic: (id) =>
    set((state) => ({
      formData: {
        ...state.formData,
        customTopics: (state.formData.customTopics ?? []).filter(
          (topic) => topic.id !== id,
        ),
      },
    })),
  setClarificationQuestions: (questions) =>
    set((state) => {
      // Preserva respostas já dadas para perguntas que se repetem.
      const previous = state.formData.clarifications ?? [];
      const clarifications: Clarification[] = questions.map((question) => {
        const existing = previous.find((c) => c.question === question);
        return { question, answer: existing?.answer ?? "" };
      });
      return { formData: { ...state.formData, clarifications } };
    }),
  updateClarificationAnswer: (index, answer) =>
    set((state) => {
      const clarifications = [...(state.formData.clarifications ?? [])];
      const current = clarifications[index];
      if (!current) return {};
      clarifications[index] = { ...current, answer };
      return { formData: { ...state.formData, clarifications } };
    }),
  setSpecs: (files) => set({ generatedSpecs: files }),
  setHarness: (files) => set({ generatedHarness: files }),
  hydrate: (data) =>
    set((state) => ({
      formData: { ...EMPTY_FORM, ...state.formData, ...data },
    })),
  reset: () =>
    set({
      step: FIRST_STEP,
      formData: { ...EMPTY_FORM },
      generatedSpecs: null,
      generatedHarness: null,
    }),
}));

/**
 * Valida se a etapa atual permite avançar (RF04.9).
 * Apenas etapas 1 e 2 têm campos obrigatórios.
 */
export function canAdvance(step: number, formData: WizardFormData): boolean {
  if (step === 1) {
    return (
      formData.projectName.trim().length > 0 &&
      formData.description.trim().length > 0
    );
  }
  if (step === 2) {
    return formData.language.trim().length > 0;
  }
  return true;
}
