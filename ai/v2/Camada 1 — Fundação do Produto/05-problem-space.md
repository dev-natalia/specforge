# Specforge V2 Problem Space

## Status

Accepted

## Purpose

This document defines the problem space that Specforge exists to address.

Its goal is to clearly identify the limitations of current AI-assisted development workflows and explain why a new approach is necessary.

A clear understanding of the problem space is required before evaluating features, architecture decisions or future roadmap initiatives.

Every feature in Specforge should solve at least one problem described in this document.

---

# Introduction

Artificial Intelligence has fundamentally changed software development.

Developers can now generate code, documentation, tests and architectural suggestions within seconds.

This has dramatically reduced the cost of implementation.

However, reducing implementation cost does not automatically reduce software complexity.

The bottleneck is no longer code generation.

The bottleneck is context generation.

---

# The Current State of AI Development

Most developers currently use AI through conversational interfaces.

The typical workflow looks like:

Idea
↓
Prompt
↓
AI
↓
Code

This workflow is fast, flexible and impressive, but introduces problems that become increasingly severe as projects grow.

---

# Problem 01 — Context Loss

The majority of project knowledge remains trapped inside conversations.

Developers discuss:

- requirements
- tradeoffs
- architecture
- constraints
- risks

but those discussions rarely become durable artifacts.

## Consequences

- Lost rationale
- Lost assumptions
- Lost alternatives
- Degraded project understanding

---

# Problem 02 — Repeated Explanations

Developers repeatedly explain the same project to AI systems.

Each new session requires rebuilding context.

## Consequences

- Wasted time
- Incomplete understanding
- Reduced productivity

---

# Problem 03 — Inconsistent Outputs

AI systems are highly dependent on context quality.

Different prompts often produce different outcomes.

## Consequences

- Inconsistent architecture
- Inconsistent code quality
- Conflicting decisions

---

# Problem 04 — Architecture Drift

Architectural intent gradually disappears over time.

AI agents optimize for immediate tasks rather than long-term consistency.

## Consequences

- Technical debt
- Reduced maintainability
- Contradictory implementations

---

# Problem 05 — Knowledge Decay

Projects accumulate code faster than understanding.

The implementation survives.

The reasoning disappears.

## Consequences

Future development becomes increasingly difficult.

---

# Problem 06 — Prompt Driven Development

Many developers unknowingly practice Prompt Driven Development.

Think
↓
Prompt
↓
Code

## Benefits

- Fast
- Flexible
- Easy to start

## Limitations

Does not naturally preserve:

- rationale
- decisions
- architecture
- constraints
- product identity

---

# Problem 07 — Lack of Governance

AI systems do not naturally understand project boundaries.

Without guidance they make assumptions.

## Consequences

- Requirements drift
- Architectural drift
- Inconsistent business rules

---

# Problem 08 — Knowledge Has No Home

Most ecosystems provide homes for:

- source code
- tests
- documentation

Few provide a dedicated home for project knowledge.

## Consequences

Knowledge becomes an accidental byproduct rather than a first-class asset.

---

# Existing Solutions

## Documentation Tools

Examples:

- Notion
- Confluence
- Markdown

Strength:
Durable documentation

Weakness:
Not optimized for AI consumption

## Project Management Tools

Examples:

- Jira
- Linear

Strength:
Task organization

Weakness:
Weak knowledge preservation

## AI Coding Tools

Examples:

- Claude Code
- Cursor
- Roo Code

Strength:
Implementation speed

Weakness:
Context durability

---

# Specforge Hypothesis

Better knowledge
↓
creates
↓
Better context
↓
creates
↓
Better AI outcomes

Specforge does not compete with AI systems.

It improves the information provided to them.

---

# Desired Future State

Instead of:

Idea
↓
Prompt
↓
AI
↓
Code

Developers should work through:

Idea
↓
Knowledge
↓
Specs
↓
Harness
↓
AI
↓
Code

Knowledge becomes durable.

Context becomes reusable.

AI becomes more predictable.

Projects become more maintainable.

---

# Success Criteria

The problems described in this document are considered solved when:

- important decisions remain discoverable
- rationale remains preserved
- developers stop rebuilding context repeatedly
- AI outputs become more consistent
- project understanding improves over time

---

# Final Statement

The future of AI-assisted development will not be defined solely by better models.

It will be defined by better context.

Specforge exists because context deserves the same level of engineering discipline that source code already receives.
