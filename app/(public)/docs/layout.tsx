import type { Metadata } from "next";
import { DocsSidebar } from "@/components/docs/DocsSidebar";
import { DocPager } from "@/components/docs/DocPager";

export const metadata: Metadata = {
  title: "Documentação — SpecForge",
  description:
    "O que é o SpecForge, seus princípios, o fluxo Knowledge First, Spec-Driven Development, Harness Engineering e o guia detalhado de cada item.",
};

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-6xl gap-8 px-4 py-10 lg:grid lg:grid-cols-[230px_1fr]">
      {/* Sidebar / índice */}
      <aside className="mb-8 lg:mb-0">
        <div className="lg:sticky lg:top-24">
          <DocsSidebar />
        </div>
      </aside>

      {/* Conteúdo */}
      <main className="min-w-0 max-w-3xl">
        <article className="space-y-5">{children}</article>
        <DocPager />
      </main>
    </div>
  );
}
