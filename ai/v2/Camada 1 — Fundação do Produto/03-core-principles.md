# Specforge V2 Core Principles

## Status

Accepted

## Purpose

This document formalizes the operational principles that guide the design, implementation and evolution of Specforge.

While the Vision explains why Specforge exists and Product DNA defines what Specforge is, Core Principles define how Specforge should behave.

Every feature, architecture decision, prompt, generation strategy and future enhancement should be evaluated against these principles.

When conflicts arise, these principles should be used as decision-making guidance.

---

# Principle 01 — Knowledge First

## Statement

Knowledge is the primary asset.

Everything else is derived from knowledge.

## Why

Most development tools treat artifacts as primary assets:

- Tickets
- Documents
- Specifications
- Code

Specforge treats knowledge as the primary asset.

Artifacts are merely representations of knowledge.

## Implications

Knowledge generates:

- Discoveries
- Decisions
- Specifications
- Context Packages
- Harnesses

Knowledge must never be discarded simply because a specification was generated.

## Operational Rule

If a feature improves specifications but weakens knowledge preservation, the feature should be rejected.

---

# Principle 02 — Preserve Rationale

## Statement

A decision without rationale is incomplete.

## Why

Many systems preserve outcomes but fail to preserve reasoning.

Over time, teams remember what was decided but forget why.

## Implications

Every significant decision should preserve:

- Context
- Problem
- Alternatives
- Chosen Solution
- Rationale
- Tradeoffs

## Operational Rule

Specforge should prioritize preserving reasoning over minimizing document size.

---

# Principle 03 — Durable Context

## Statement

Context should outlive conversations.

## Why

Chat sessions are temporary.

Projects are long-lived.

A project's understanding should not disappear when a conversation ends.

## Operational Rule

No critical project knowledge should exist exclusively inside a chat session.

---

# Principle 04 — AI Agnostic

## Statement

Knowledge should outlive AI providers.

## Operational Rule

Knowledge artifacts must remain useful if the user changes AI providers.

---

# Principle 05 — Local First

## Statement

Projects belong to users.

## Operational Rule

Features that require centralized ownership should be heavily scrutinized.

---

# Principle 06 — Transparency

## Statement

Generated outputs should be understandable.

## Operational Rule

Avoid black-box generation whenever possible.

---

# Principle 07 — Traceability

## Statement

Every important artifact should be traceable to its origin.

## Implications

Requirements should trace back to:
- knowledge
- discoveries
- decisions
- principles

Tasks should trace back to requirements.

Harnesses should trace back to specifications.

---

# Principle 08 — Simplicity Over Complexity

## Statement

Complexity must justify itself.

## Operational Rule

Default to the simplest solution that preserves knowledge quality.

---

# Principle 09 — Human-Guided Intelligence

## Statement

Humans remain responsible for decisions.

## Operational Rule

The user remains the final authority.

---

# Principle 10 — Context Before Code

## Statement

The quality of code is downstream from the quality of context.

## Operational Rule

Features that improve context should generally outrank features that directly target code generation.

---

# Principle Relationships

Knowledge First enables Durable Context.

Durable Context enables Traceability.

Traceability enables Transparency.

Transparency strengthens Human-Guided Intelligence.

Together these principles improve Context Quality.

Improved Context Quality leads to better AI outcomes.

---

# Principle Validation Checklist

Before implementing a feature ask:

1. Does this preserve knowledge?
2. Does this preserve rationale?
3. Does this improve context quality?
4. Does this remain provider agnostic?
5. Does this preserve local ownership?
6. Is it transparent?
7. Is it traceable?
8. Is it simpler than alternatives?
9. Does it keep humans in control?
10. Does it prioritize context over code?

---

# Final Statement

Specforge does not exist to automate software development.

Specforge exists to improve the quality of understanding that precedes software development.

Understanding produces knowledge.

Knowledge produces context.

Context guides AI.

AI produces code.
