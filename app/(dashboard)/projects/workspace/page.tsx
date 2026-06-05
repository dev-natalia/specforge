"use client";

// Página estática do workspace (export estático). O ID do projeto vem da query
// string (?id=PROJ-001), pois IDs nascem em runtime no navegador (IndexedDB) e
// não existem em build time — por isso não usamos rota dinâmica [id].
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Workspace } from "@/components/workspace/Workspace";

function WorkspaceFromQuery() {
  const params = useSearchParams();
  const id = params.get("id");
  if (!id) {
    return (
      <div className="space-y-3">
        <p className="text-sm text-slate-500">Projeto não especificado.</p>
        <Link href="/projects" className="text-sm font-medium text-brand-600 underline">
          Voltar aos projetos
        </Link>
      </div>
    );
  }
  return <Workspace projectId={id} />;
}

export default function WorkspacePage() {
  return (
    <Suspense fallback={<p className="text-sm text-slate-500">Carregando…</p>}>
      <WorkspaceFromQuery />
    </Suspense>
  );
}
