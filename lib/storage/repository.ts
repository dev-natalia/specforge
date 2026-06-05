// Repositório local-first (ai/v2 — 39-storage-model). Persiste o snapshot do
// projeto no IndexedDB com upsert idempotente, versionamento por artefato e
// histórico append-only para recuperação.
import {
  getDb,
  artifactKey,
  type StoredArtifact,
  type HistoryRecord,
} from "@/lib/storage/db";
import {
  projectSnapshotSchema,
  emptySnapshot,
  ensureInitiatives,
  type Project,
  type ProjectSnapshot,
} from "@/lib/domain/project";

// Todo artefato durável tem discriminador `kind`, ID rastreável e timestamp.
interface DurableArtifact {
  kind: string;
  id: string;
  updatedAt?: string;
}

// Mapeia cada `kind` para a coleção correspondente do snapshot.
const KNOWLEDGE_KINDS = new Set([
  "discovery",
  "decision",
  "constraint",
  "principle",
  "risk",
  "assumption",
  "productDna",
  "contextPackage",
]);

/** Lista os metadados de todos os projetos. */
export async function listProjects(): Promise<Project[]> {
  const db = await getDb();
  return db.getAll("projects");
}

/** Busca os metadados de um projeto. */
export async function getProject(id: string): Promise<Project | undefined> {
  const db = await getDb();
  return db.get("projects", id);
}

/** Reúne todos os artefatos duráveis do snapshot em uma lista única. */
function flattenArtifacts(snapshot: ProjectSnapshot): DurableArtifact[] {
  return [
    ...snapshot.initiatives,
    ...snapshot.knowledge,
    ...snapshot.clarifications,
    ...snapshot.specifications,
    ...snapshot.consolidatedSpecs,
    ...snapshot.harnesses,
    ...snapshot.agentRules,
    ...snapshot.providerArtifacts,
    ...snapshot.tasks,
  ];
}

/**
 * Salva o snapshot inteiro: upsert do projeto, upsert idempotente de cada
 * artefato (bumpando `rev` + gravando histórico quando o conteúdo muda) e
 * remoção dos artefatos que sumiram do snapshot.
 */
export async function saveSnapshot(snapshot: ProjectSnapshot): Promise<void> {
  const parsed = projectSnapshotSchema.parse(snapshot);
  const db = await getDb();
  const projectId = parsed.project.id;
  const now = new Date().toISOString();

  const tx = db.transaction(["projects", "artifacts", "history"], "readwrite");
  const projects = tx.objectStore("projects");
  const artifacts = tx.objectStore("artifacts");
  const history = tx.objectStore("history");

  await projects.put(parsed.project);

  // Estado atual no banco, indexado por chave.
  const existing = await artifacts.index("by-project").getAll(projectId);
  const existingByKey = new Map<string, StoredArtifact>();
  for (const record of existing) existingByKey.set(record.key, record);

  const desiredKeys = new Set<string>();

  for (const artifact of flattenArtifacts(parsed)) {
    const key = artifactKey(projectId, artifact.kind, artifact.id);
    desiredKeys.add(key);
    const prev = existingByKey.get(key);
    const serialized = JSON.stringify(artifact);

    // Sem mudança → não reescreve nem versiona.
    if (prev && JSON.stringify(prev.data) === serialized) continue;

    const rev = prev ? prev.rev + 1 : 1;
    const record: StoredArtifact = {
      key,
      projectId,
      kind: artifact.kind,
      artifactId: artifact.id,
      rev,
      data: artifact,
      updatedAt: artifact.updatedAt ?? now,
    };
    await artifacts.put(record);
    const historyRecord: HistoryRecord = {
      projectId,
      artifactKey: key,
      rev,
      data: artifact,
      at: now,
    };
    await history.add(historyRecord);
  }

  // Remove artefatos que não estão mais no snapshot.
  for (const record of existing) {
    if (!desiredKeys.has(record.key)) {
      await artifacts.delete(record.key);
    }
  }

  await tx.done;
}

/** Reconstrói o snapshot de um projeto a partir do banco (ou null se não existe). */
export async function loadSnapshot(projectId: string): Promise<ProjectSnapshot | null> {
  const db = await getDb();
  const project = await db.get("projects", projectId);
  if (!project) return null;

  const records = await db.getAllFromIndex("artifacts", "by-project", projectId);
  const snapshot = emptySnapshot(project);

  for (const record of records) {
    const data = record.data;
    if (record.kind === "initiative") {
      snapshot.initiatives.push(data as never);
    } else if (KNOWLEDGE_KINDS.has(record.kind)) {
      snapshot.knowledge.push(data as never);
    } else if (record.kind === "clarification") {
      snapshot.clarifications.push(data as never);
    } else if (record.kind === "specification") {
      snapshot.specifications.push(data as never);
    } else if (record.kind === "consolidatedSpec") {
      snapshot.consolidatedSpecs.push(data as never);
    } else if (record.kind === "harness") {
      snapshot.harnesses.push(data as never);
    } else if (record.kind === "agentRules") {
      snapshot.agentRules.push(data as never);
    } else if (record.kind === "providerArtifact") {
      snapshot.providerArtifacts.push(data as never);
    } else if (record.kind === "task") {
      snapshot.tasks.push(data as never);
    }
  }

  // Valida/coage tudo de volta para os tipos de domínio e aplica a migração V3
  // (projetos legados ganham uma iniciativa product que adota os artefatos).
  return ensureInitiatives(projectSnapshotSchema.parse(snapshot));
}

/** Apaga um projeto e todos os seus artefatos e histórico. */
export async function deleteProject(projectId: string): Promise<void> {
  const db = await getDb();
  const tx = db.transaction(["projects", "artifacts", "history"], "readwrite");
  await tx.objectStore("projects").delete(projectId);

  const artifacts = tx.objectStore("artifacts");
  for (const key of await artifacts.index("by-project").getAllKeys(projectId)) {
    await artifacts.delete(key);
  }
  const history = tx.objectStore("history");
  for (const key of await history.index("by-project").getAllKeys(projectId)) {
    await history.delete(key);
  }
  await tx.done;
}

/** Retorna o histórico (revisões) de um artefato específico. */
export async function artifactHistory(
  projectId: string,
  kind: string,
  artifactId: string,
): Promise<HistoryRecord[]> {
  const db = await getDb();
  const key = artifactKey(projectId, kind, artifactId);
  const records = await db.getAllFromIndex("history", "by-artifact", key);
  return records.sort((a, b) => a.rev - b.rev);
}
