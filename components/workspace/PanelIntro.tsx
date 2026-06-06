// Intro curto no topo de cada painel/aba: "O que é isso?" — explica em uma frase
// o que aquela seção é, para orientar quem está usando.
import type { ReactNode } from "react";

export function PanelIntro({ children }: { children: ReactNode }) {
  return (
    <p className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-500">
      <span className="font-medium text-slate-600">O que é isso?</span> {children}
    </p>
  );
}
