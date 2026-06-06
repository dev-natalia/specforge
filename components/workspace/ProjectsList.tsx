"use client";

// Lista de projetos do workspace + criação + import (Fase 1). Tudo local-first:
// projetos vivem no IndexedDB do navegador.
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useWorkspaceStore } from "@/lib/workspace/store";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Card, CardContent } from "@/components/ui/Card";

export function ProjectsList() {
  const router = useRouter();
  const projects = useWorkspaceStore((s) => s.projects);
  const refreshProjects = useWorkspaceStore((s) => s.refreshProjects);
  const createProject = useWorkspaceStore((s) => s.createProject);
  const deleteProject = useWorkspaceStore((s) => s.deleteProject);
  const importProject = useWorkspaceStore((s) => s.importProject);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    void refreshProjects();
  }, [refreshProjects]);

  async function handleCreate() {
    if (!name.trim()) return;
    setBusy(true);
    setError(null);
    try {
      const id = await createProject(name, description);
      router.push(`/projects/workspace?id=${id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha ao criar projeto.");
    } finally {
      setBusy(false);
    }
  }

  async function handleImport(file: File) {
    setBusy(true);
    setError(null);
    try {
      // Limite de tamanho: evita travar a aba com um arquivo enorme.
      const MAX_BYTES = 10 * 1024 * 1024; // 10 MB
      if (file.size > MAX_BYTES) {
        setError("Arquivo muito grande (máximo 10 MB).");
        return;
      }
      const text = await file.text();
      const id = await importProject(text);
      router.push(`/projects/workspace?id=${id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha ao importar projeto.");
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Projetos</h1>
          <p className="text-sm text-slate-500">
            Conhecimento durável, no seu navegador. Specs e harness derivam daqui.
          </p>
        </div>
        <div>
          <input
            ref={fileRef}
            type="file"
            accept="application/json,.json"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void handleImport(file);
            }}
          />
          <Button variant="outline" size="sm" onClick={() => fileRef.current?.click()} disabled={busy}>
            Importar projeto
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="space-y-3">
          <h2 className="font-medium text-slate-800">Novo projeto</h2>
          <Input label="Nome" value={name} onChange={(e) => setName(e.target.value)} placeholder="Meu app" />
          <Textarea
            label="Descrição (opcional)"
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="flex justify-end">
            <Button onClick={handleCreate} disabled={busy || !name.trim()}>
              Criar projeto
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-2">
        {projects.length === 0 ? (
          <p className="rounded-lg border border-dashed border-slate-300 p-6 text-center text-sm text-slate-400">
            Nenhum projeto ainda. Crie o primeiro acima.
          </p>
        ) : (
          projects.map((project) => (
            <div
              key={project.id}
              className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-4"
            >
              <Link href={`/projects/workspace?id=${project.id}`} className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-slate-400">{project.id}</span>
                </div>
                <p className="font-medium text-slate-900">{project.name}</p>
                {project.description && (
                  <p className="truncate text-sm text-slate-500">{project.description}</p>
                )}
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => void deleteProject(project.id)}
                disabled={busy}
              >
                Remover
              </Button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
