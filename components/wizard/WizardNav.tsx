"use client";

import { Button } from "@/components/ui/Button";
import { useWizardStore, canAdvance } from "@/lib/wizard/store";
import { FIRST_STEP } from "@/lib/wizard/steps";

// Navegação anterior/próximo para as etapas de formulário (1-4).
// Etapas 5-7 controlam o avanço pelos próprios botões de ação.
export function WizardNav() {
  const step = useWizardStore((state) => state.step);
  const formData = useWizardStore((state) => state.formData);
  const nextStep = useWizardStore((state) => state.nextStep);
  const prevStep = useWizardStore((state) => state.prevStep);

  const advanceAllowed = canAdvance(step, formData);

  return (
    <div className="flex items-center justify-between border-t border-slate-200 pt-4">
      <Button
        variant="outline"
        onClick={prevStep}
        disabled={step === FIRST_STEP}
      >
        Anterior
      </Button>
      <Button onClick={nextStep} disabled={!advanceAllowed}>
        Próximo
      </Button>
    </div>
  );
}
