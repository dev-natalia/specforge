// Primitivos de apresentação da documentação (sem estado — server components).
import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

export function DocTitle({ children }: { children: ReactNode }) {
  return <h1 className="text-3xl font-bold tracking-tight text-slate-900">{children}</h1>;
}

export function Lead({ children }: { children: ReactNode }) {
  return <p className="mt-3 text-lg text-slate-600">{children}</p>;
}

export function H2({ id, children }: { id?: string; children: ReactNode }) {
  return (
    <h2
      id={id}
      className="scroll-mt-24 border-b border-slate-200 pb-2 text-2xl font-bold text-slate-900"
    >
      {children}
    </h2>
  );
}

export function H3({ id, children }: { id?: string; children: ReactNode }) {
  return (
    <h3 id={id} className="scroll-mt-24 text-lg font-semibold text-slate-900">
      {children}
    </h3>
  );
}

export function P({ children }: { children: ReactNode }) {
  return <p className="text-slate-600">{children}</p>;
}

export function Callout({
  children,
  tone = "brand",
}: {
  children: ReactNode;
  tone?: "brand" | "amber" | "slate";
}) {
  const tones = {
    brand: "border-brand-200 bg-brand-50 text-brand-900",
    amber: "border-amber-200 bg-amber-50 text-amber-900",
    slate: "border-slate-200 bg-slate-50 text-slate-700",
  };
  return (
    <div className={cn("rounded-lg border p-4 text-sm", tones[tone])}>{children}</div>
  );
}

export function CodeBlock({ children }: { children: string }) {
  return (
    <pre className="overflow-auto rounded-lg border border-slate-200 bg-slate-50 p-4 text-xs leading-relaxed text-slate-700">
      {children}
    </pre>
  );
}
