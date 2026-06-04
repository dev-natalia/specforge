"use client";

import { useWizardStore } from "@/lib/wizard/store";
import { WizardStepper } from "@/components/wizard/WizardStepper";
import { WizardNav } from "@/components/wizard/WizardNav";
import { Card, CardContent } from "@/components/ui/Card";
import { Step1Project } from "@/components/wizard/steps/Step1Project";
import { Step2Stack } from "@/components/wizard/steps/Step2Stack";
import { Step3Architecture } from "@/components/wizard/steps/Step3Architecture";
import { Step4Behavior } from "@/components/wizard/steps/Step4Behavior";
import { Step5SpecReview } from "@/components/wizard/steps/Step5SpecReview";
import { Step6HarnessReview } from "@/components/wizard/steps/Step6HarnessReview";
import { Step7Download } from "@/components/wizard/steps/Step7Download";
import { RequireApiKey } from "@/components/wizard/RequireApiKey";

export default function NewProjectPage() {
  const step = useWizardStore((state) => state.step);

  // Etapas 1-4 usam WizardNav; etapas 5-7 controlam o avanço internamente.
  const isFormStep = step >= 1 && step <= 4;

  return (
    <RequireApiKey>
      <div className="space-y-6">
        <WizardStepper currentStep={step} />

        <Card>
          <CardContent>
            {step === 1 && <Step1Project />}
            {step === 2 && <Step2Stack />}
            {step === 3 && <Step3Architecture />}
            {step === 4 && <Step4Behavior />}
            {step === 5 && <Step5SpecReview />}
            {step === 6 && <Step6HarnessReview />}
            {step === 7 && <Step7Download />}

            {isFormStep && (
              <div className="mt-6">
                <WizardNav />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </RequireApiKey>
  );
}
