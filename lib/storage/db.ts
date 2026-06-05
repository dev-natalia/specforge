// Storage local-first V2 (ai/v2 — 39-storage-model). Conhecimento é File-Based
// e Local First: persiste no IndexedDB do navegador (versionado), nunca num
// servidor nosso. Este módulo abre o banco e descreve os object stores.
import { openDB, type DBSchema, type IDBPDatabase } from "idb";
import type { Project } from "@/lib/domain/project";

export const DB_NAME = "specforge";
export const DB_VERSION = 1;

// Registro genérico de artefato durável (conhecimento, spec, harness, task...).
// Chave determinística `${projectId}:${kind}:${artifactId}` → upsert idempotente.
export interface StoredArtifact {
  key: string;
  projectId: string;
  kind: string;
  artifactId: string;
  rev: number;
  data: unknown;
  updatedAt: string;
}

// Histórico append-only para recuperação (Immutable History / Version Everything).
export interface HistoryRecord {
  projectId: string;
  artifactKey: string;
  rev: number;
  data: unknown;
  at: string;
}

interface SpecforgeDB extends DBSchema {
  projects: {
    key: string;
    value: Project;
  };
  artifacts: {
    key: string;
    value: StoredArtifact;
    indexes: { "by-project": string };
  };
  history: {
    key: number;
    value: HistoryRecord;
    indexes: { "by-project": string; "by-artifact": string };
  };
}

export type SpecforgeDatabase = IDBPDatabase<SpecforgeDB>;

let dbPromise: Promise<SpecforgeDatabase> | null = null;

/** Abre (memoizado) o banco IndexedDB. Só funciona no navegador. */
export function getDb(): Promise<SpecforgeDatabase> {
  if (typeof indexedDB === "undefined") {
    return Promise.reject(
      new Error("IndexedDB indisponível (este código roda apenas no navegador)."),
    );
  }
  if (!dbPromise) {
    dbPromise = openDB<SpecforgeDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains("projects")) {
          db.createObjectStore("projects", { keyPath: "id" });
        }
        if (!db.objectStoreNames.contains("artifacts")) {
          const store = db.createObjectStore("artifacts", { keyPath: "key" });
          store.createIndex("by-project", "projectId");
        }
        if (!db.objectStoreNames.contains("history")) {
          const store = db.createObjectStore("history", {
            keyPath: "id",
            autoIncrement: true,
          });
          store.createIndex("by-project", "projectId");
          store.createIndex("by-artifact", "artifactKey");
        }
      },
    });
  }
  return dbPromise;
}

/** Monta a chave determinística de um artefato dentro de um projeto. */
export function artifactKey(projectId: string, kind: string, artifactId: string): string {
  return `${projectId}:${kind}:${artifactId}`;
}

// Permite resetar a conexão memoizada (testes).
export function _resetDbForTests(): void {
  dbPromise = null;
}
