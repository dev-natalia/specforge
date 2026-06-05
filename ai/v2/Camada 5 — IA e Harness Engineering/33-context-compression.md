# Specforge V2 Context Compression

## Status

Accepted

## Purpose

This document defines the Context Compression model used by Specforge.

Context Compression is responsible for reducing context size while preserving project understanding, decision quality and execution consistency.

Its purpose is to maximize useful knowledge density inside limited AI context windows.

Context Compression transforms large project knowledge into compact operational context.

---

# Introduction

AI systems operate within finite context windows.

Projects do not.

As projects evolve:

- knowledge grows
- decisions accumulate
- specifications expand
- tasks multiply

Without compression:

- context becomes expensive
- context becomes noisy
- context becomes fragmented

Context Compression exists to preserve understanding while minimizing context usage.

---

# Definition

## Context Compression

Context Compression is the process of reducing context volume while preserving decision-relevant knowledge.

A compression strategy answers:

- What knowledge is important?
- What knowledge is obsolete?
- What knowledge can be summarized?
- What knowledge must remain intact?

Compression should preserve meaning rather than text.

---

# Core Hypothesis

Raw Knowledge
↓
Compression
↓
Operational Context
↓
AI Execution

The goal is not smaller context.

The goal is higher signal density.

---

# Responsibilities

Context Compression exists to:

- reduce token usage
- preserve critical knowledge
- preserve project intent
- preserve architectural understanding
- preserve decision rationale
- reduce context noise

---

# Compression Principles

## Meaning Over Text

Preserve meaning.

Discard unnecessary wording.

## Decisions Over Discussion

Preserve outcomes.

Compress conversations.

## Relevance Over Completeness

Preserve useful knowledge.

Discard inactive knowledge.

## Freshness Over History

Recent validated knowledge has priority.

## Traceability Over Memorization

Preserve references.

Avoid duplicating information.

---

# Compression Layers

## Layer 1 — Raw Knowledge

Examples:

- conversations
- notes
- discussions
- documents

Highest detail.

Lowest efficiency.

## Layer 2 — Discoveries

Validated learnings extracted from raw knowledge.

## Layer 3 — Decisions

Approved outcomes.

## Layer 4 — Context Packages

Grouped knowledge optimized for usage.

## Layer 5 — Active Context

Current execution context.

Smallest form.

Highest relevance.

---

# Compression Targets

The following artifacts should be compressible.

## Conversations

Compress into discoveries and decisions.

## Specifications

Compress into summaries and references.

## Tasks

Compress into execution state.

## Decisions

Compress into decision records.

## Historical Context

Compress into archives.

---

# Context Categories

## Active Context

Required now.

Highest priority.

## Relevant Context

Potentially useful.

Medium priority.

## Historical Context

Rarely needed.

Low priority.

## Archived Context

Reference only.

Lowest priority.

---

# Compression Strategies

## Summarization

Convert verbose content into concise representations.

## Deduplication

Remove repeated information.

## Consolidation

Merge related knowledge.

## Reference Extraction

Replace repeated content with references.

## Priority Filtering

Remove low-value information.

---

# Context Package Model

Example:

Architecture Package
├── Decisions
├── Constraints
├── Patterns
└── Active Concerns

Packages should be independently loadable.

---

# Decision Preservation Rules

Decisions should never be discarded.

Decisions may be compressed.

Decision rationale should remain recoverable.

---

# Architecture Preservation Rules

Architecture intent should never be lost.

Architecture summaries should preserve:

- boundaries
- ownership
- communication rules
- constraints

---

# Security Preservation Rules

Security knowledge should not be aggressively compressed.

Security context has high preservation priority.

---

# Traceability Preservation

Compressed context should preserve links to:

- discoveries
- decisions
- specifications
- tasks

Compression should never destroy traceability.

---

# Dynamic Context Assembly

Task
↓
Determine Relevant Knowledge
↓
Load Context Packages
↓
Compress Further If Necessary
↓
Build Operational Context

Context should be task-specific.

---

# Context Budgeting

Every execution should have a context budget.

Example categories:

- Identity Budget
- Architecture Budget
- Security Budget
- Task Budget
- Historical Budget

Budgets should prioritize relevance.

---

# Compression Quality Standards

Compressed context should be:

## Accurate

Meaning preserved.

## Dense

Minimal redundancy.

## Traceable

References preserved.

## Recoverable

Original sources accessible.

## Actionable

Useful for execution.

---

# Validation Rules

Compressed context should pass:

- Meaning Preservation Validation
- Traceability Validation
- Architecture Preservation Validation
- Security Preservation Validation
- Relevance Validation
- Redundancy Validation

---

# Anti-Patterns

## Blind Summarization

Reducing text without preserving meaning.

## Decision Loss

Discarding important decisions.

## Architecture Loss

Discarding architectural intent.

## Security Loss

Discarding security knowledge.

## Context Hoarding

Keeping everything.

---

# Relationship With Other Artifacts

Knowledge
↓
Compression
↓
Context Packages
↓
Harness
↓
Execution

Compression enables scalable harnesses.

---

# AI Responsibilities

AI systems performing compression should:

- preserve meaning
- preserve decisions
- preserve traceability
- preserve architecture
- preserve security requirements

Compression should optimize understanding rather than token count.

---

# Future Evolution

Future versions may introduce:

- semantic compression scoring
- automatic package generation
- adaptive context budgets
- compression health metrics
- retrieval-aware compression

---

# Long-Term Vision

Projects should scale without overwhelming AI context windows.

Knowledge should become denser as projects mature.

Context should become smarter, not larger.

---

# Final Statement

Knowledge grows continuously.

Context windows do not.

Context Compression transforms expanding project knowledge into compact, high-signal operational context that remains useful throughout the project lifecycle.
