// Task Generation V2 (ai/v2 — 28-task-generation). Tasks convertem specs em
// unidades executáveis com contexto, dependências e rastreabilidade.
import { z } from "zod";
import { traceableSchema } from "@/lib/domain/traceability";

export const taskCategorySchema = z.enum([
  "foundation",
  "feature",
  "architecture",
  "contract",
  "security",
  "testing",
  "documentation",
]);
export type TaskCategory = z.infer<typeof taskCategorySchema>;

export const taskStatusSchema = z.enum(["pending", "in_progress", "blocked", "done"]);
export type TaskStatus = z.infer<typeof taskStatusSchema>;

export const taskSchema = traceableSchema.extend({
  kind: z.literal("task"),
  title: z.string().min(1),
  category: taskCategorySchema,
  objective: z.string().default(""),
  description: z.string().default(""),
  // IDs de outras tasks que devem ser concluídas antes desta.
  dependencies: z.array(z.string()).default([]),
  acceptanceCriteria: z.array(z.string()).default([]),
  testingExpectations: z.string().default(""),
  securityExpectations: z.string().default(""),
  deliverables: z.array(z.string()).default([]),
  status: taskStatusSchema.default("pending"),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type Task = z.infer<typeof taskSchema>;

export interface TaskCycleIssue {
  message: string;
  cycle: string[];
}

/**
 * Ordena as tasks topologicamente respeitando `dependencies`. Retorna a ordem
 * de execução e quaisquer ciclos encontrados (que impedem ordenação completa).
 */
export function orderTasks(tasks: Task[]): {
  order: string[];
  cycles: TaskCycleIssue[];
} {
  const byId = new Map<string, Task>();
  for (const task of tasks) byId.set(task.id, task);

  const order: string[] = [];
  const cycles: TaskCycleIssue[] = [];
  const color = new Map<string, number>(); // 0 branco, 1 cinza, 2 preto

  const visit = (id: string, path: string[]): void => {
    color.set(id, 1);
    const task = byId.get(id);
    if (task) {
      for (const dep of task.dependencies) {
        if (!byId.has(dep)) continue; // dependência externa/inexistente: ignora
        const c = color.get(dep) ?? 0;
        if (c === 1) {
          const start = path.indexOf(dep);
          const cycle = start >= 0 ? path.slice(start) : [dep];
          cycles.push({
            message: `Ciclo de dependências: ${[...cycle, dep].join(" → ")}.`,
            cycle,
          });
        } else if (c === 0) {
          visit(dep, [...path, dep]);
        }
      }
    }
    color.set(id, 2);
    order.push(id);
  };

  for (const task of tasks) {
    if ((color.get(task.id) ?? 0) === 0) visit(task.id, [task.id]);
  }

  return { order, cycles };
}
