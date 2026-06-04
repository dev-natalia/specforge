import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Step1Project } from "@/components/wizard/steps/Step1Project";
import { useWizardStore } from "@/lib/wizard/store";

describe("Step1Project", () => {
  beforeEach(() => {
    useWizardStore.getState().reset();
  });

  it("atualiza o store ao digitar nome e descrição", () => {
    render(<Step1Project />);

    fireEvent.change(screen.getByLabelText(/Nome do projeto/i), {
      target: { value: "Minha API" },
    });
    fireEvent.change(screen.getByLabelText(/Descrição/i), {
      target: { value: "Uma API de teste" },
    });

    const state = useWizardStore.getState().formData;
    expect(state.projectName).toBe("Minha API");
    expect(state.description).toBe("Uma API de teste");
  });

  it("permite escolher o tipo de projeto", () => {
    render(<Step1Project />);
    fireEvent.change(screen.getByLabelText(/Tipo de projeto/i), {
      target: { value: "CLI" },
    });
    expect(useWizardStore.getState().formData.projectType).toBe("CLI");
  });
});
