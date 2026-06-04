"use client";

import { WIZARD_STEPS } from "@/lib/wizard/steps";
import { Progress } from "@/components/ui/Progress";
import { cn } from "@/lib/utils/cn";

interface WizardStepperProps {
  currentStep: number;
}

export function WizardStepper({ currentStep }: WizardStepperProps) {
  const total = WIZARD_STEPS.length;
  const percent = ((currentStep - 1) / (total - 1)) * 100;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-slate-700">
          Etapa {currentStep} de {total}
        </span>
        <span className="text-slate-500">
          {WIZARD_STEPS[currentStep - 1]?.title}
        </span>
      </div>

      <Progress value={percent} />

      <ol className="hidden grid-cols-7 gap-1 sm:grid">
        {WIZARD_STEPS.map((step) => {
          const state =
            step.id < currentStep
              ? "done"
              : step.id === currentStep
                ? "current"
                : "todo";
          return (
            <li
              key={step.id}
              className="flex flex-col items-center gap-1 text-center"
            >
              <span
                className={cn(
                  "grid h-7 w-7 place-items-center rounded-full text-xs font-semibold",
                  state === "done" && "bg-brand-600 text-white",
                  state === "current" &&
                    "border-2 border-brand-600 text-brand-700",
                  state === "todo" && "border border-slate-300 text-slate-400",
                )}
              >
                {state === "done" ? "✓" : step.id}
              </span>
              <span
                className={cn(
                  "text-[11px]",
                  state === "current"
                    ? "font-medium text-slate-700"
                    : "text-slate-400",
                )}
              >
                {step.shortTitle}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
