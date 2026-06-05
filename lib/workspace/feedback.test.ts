import { describe, it, expect } from "vitest";
import {
  feedbackEvent,
  appendFeedback,
  FEEDBACK_LIMIT,
  type GenerationEvent,
} from "@/lib/workspace/feedback";

describe("generation feedback", () => {
  it("cria evento com id e timestamp", () => {
    const e = feedbackEvent("Harness", "done", "HAR-001");
    expect(e.label).toBe("Harness");
    expect(e.status).toBe("done");
    expect(e.detail).toBe("HAR-001");
    expect(e.id).toBeTruthy();
    expect(e.at).toBeTruthy();
  });

  it("faz prepend (mais recente primeiro)", () => {
    let log: GenerationEvent[] = [];
    log = appendFeedback(log, feedbackEvent("A", "done"));
    log = appendFeedback(log, feedbackEvent("B", "done"));
    expect(log.map((e) => e.label)).toEqual(["B", "A"]);
  });

  it("trunca ao limite", () => {
    let log: GenerationEvent[] = [];
    for (let i = 0; i < FEEDBACK_LIMIT + 5; i++) {
      log = appendFeedback(log, feedbackEvent(`E${i}`, "done"));
    }
    expect(log).toHaveLength(FEEDBACK_LIMIT);
    // O mais recente é o último inserido.
    expect(log[0]?.label).toBe(`E${FEEDBACK_LIMIT + 4}`);
  });
});
