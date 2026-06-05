# 016 - Agent Rules Progressive Specification

## Status

Draft

---

# Purpose

This document defines the behavioral rules that AI agents must follow when operating within Progressive Specification.

These rules ensure that all AI-powered workflows remain aligned with:

- Knowledge First
- Right-Sized Process
- Progressive Complexity
- Generate Only What Is Needed

The objective is to prevent agents from introducing unnecessary complexity, skipping required rigor, or violating scope boundaries.

---

# Overview

Progressive Specification depends heavily on AI agents.

Agents participate in:

- Classification
- Clarification
- Knowledge Generation
- Specification Generation
- Harness Generation
- Task Generation

Without behavioral constraints, agents may:

- Over-generate artifacts
- Under-generate artifacts
- Escalate scope unnecessarily
- Ignore required governance
- Produce inconsistent outputs

These rules exist to prevent those failure modes.

---

# Core Principle

Agents must adapt to scope.

Scope must not adapt to agents.

---

The selected scope determines behavior.

Agents must not independently expand process complexity.

---

# Agent Responsibilities

Agents are responsible for:

- Understanding intent
- Classifying scope
- Clarifying ambiguity
- Generating artifacts
- Preserving traceability
- Preserving knowledge

Agents are not responsible for redefining scope objectives.

---

# Universal Rules

The following rules apply to every agent.

---

## Rule 1 — Knowledge First

Agents must prioritize understanding before generation.

---

Forbidden

Generate specifications without understanding intent.

---

Required

Clarify when understanding is insufficient.

---

# Rule 2 — Scope Compliance

Agents must respect the selected scope.

---

Story

Must remain Story.

---

Feature

Must remain Feature.

---

Product

Must remain Product.

---

Agents must not silently expand scope.

---

# Rule 3 — Generate Only What Is Needed

Agents should generate the minimum artifact set required by the Artifact Matrix.

---

Forbidden

Creating additional specifications without justification.

---

# Rule 4 — Preserve Traceability

Generated outputs should maintain relationships.

---

Requirements
↓
Acceptance Criteria
↓
Tasks
↓
Harness

---

Whenever possible.

---

# Rule 5 — Preserve Existing Knowledge

Agents must reuse available knowledge.

---

Forbidden

Ignoring existing context.

---

Required

Reuse:

- Discoveries
- Decisions
- Existing Specifications
- Existing Harnesses

---

# Story Mode Rules

## Purpose

Keep Story workflows lightweight.

---

# Rule S1

Do not generate Architecture Specifications.

---

# Rule S2

Do not generate Security Specifications.

---

# Rule S3

Do not generate Product Vision artifacts.

---

# Rule S4

Limit clarification to implementation-relevant questions.

---

# Rule S5

Prioritize implementation readiness over completeness.

---

# Rule S6

Prefer assumptions when risk is low.

---

# Rule S7

Avoid introducing Feature-level governance.

---

# Feature Mode Rules

## Purpose

Enable capability delivery.

---

# Rule F1

Generate Design artifacts when required.

---

# Rule F2

Generate Contracts when interfaces exist.

---

# Rule F3

Capture important implementation decisions.

---

# Rule F4

Consider integration impacts.

---

# Rule F5

Do not generate Product Vision artifacts.

---

# Rule F6

Do not initiate full knowledge discovery processes.

---

# Rule F7

Escalate only when architectural concerns become significant.

---

# Product Mode Rules

## Purpose

Enable complete engineering planning.

---

# Rule P1

Perform comprehensive clarification.

---

# Rule P2

Perform knowledge discovery.

---

# Rule P3

Capture decisions.

---

# Rule P4

Preserve rationale.

---

# Rule P5

Generate governance artifacts.

---

# Rule P6

Maintain architectural consistency.

---

# Rule P7

Maintain long-term traceability.

---

# Classification Rules

Agents participating in classification must:

- Use Scope Classification Rules.
- Evaluate complexity.
- Evaluate risk.
- Evaluate context.

---

Forbidden

Classify using keywords only.

---

# Clarification Rules

Agents participating in clarification must:

- Ask only relevant questions.
- Stop when confidence is sufficient.
- Respect clarification budgets.

---

Forbidden

Interrogation behavior.

---

Forbidden

Collecting information without purpose.

---

# Generation Rules

Agents generating artifacts must:

- Follow artifact templates.
- Follow artifact definitions.
- Follow scope restrictions.

---

Forbidden

Generating artifacts not permitted by scope.

---

# Harness Rules

Agents generating Harnesses must:

- Treat specifications as source of truth.
- Preserve decisions.
- Preserve constraints.
- Apply context compression.

---

Forbidden

Copying specifications directly into Harnesses.

---

# Task Generation Rules

Agents generating tasks must:

- Derive tasks from requirements.
- Preserve traceability.
- Avoid speculative work.

---

Forbidden

Generating tasks directly from intent.

---

# Escalation Rules

Agents may recommend escalation.

Agents may not silently escalate.

---

Required

Explain:

- Why escalation is suggested.
- Which signals triggered escalation.

---

# Reduction Rules

Agents may recommend reduction.

Agents may not silently reduce scope.

---

Required

Explain:

- Why reduction is suggested.
- Which assumptions changed.

---

# Assumption Rules

Agents may create assumptions when:

- Risk is low.
- Assumptions are reversible.
- Assumptions are documented.

---

Forbidden

Hidden assumptions.

---

# Transparency Rules

Agents should explain:

- Scope decisions
- Clarification decisions
- Escalation decisions
- Reduction decisions

when relevant.

---

# Context Reuse Rules

Agents should actively reuse:

Existing Project Context

Existing Requirements

Existing Decisions

Existing Architecture

Existing Specifications

---

This reduces clarification effort.

---

# Anti-Bloat Rules

Agents must actively resist:

- Documentation inflation
- Scope inflation
- Process inflation
- Clarification inflation

---

The goal is usefulness.

Not volume.

---

# Consistency Rules

All agents must produce outputs compatible with:

Scope Model

Artifact Matrix

Pipeline Rules

Harness Rules

Clarification Rules

---

# Conflict Resolution Rules

When rules conflict:

Apply precedence:

1. Knowledge First
2. Scope Compliance
3. Generate Only What Is Needed
4. Preserve Traceability
5. Preserve Existing Knowledge

---

# Validation Rules

Before completing work, agents should validate:

- Scope compatibility
- Artifact compatibility
- Traceability
- Completeness
- Consistency

---

# Failure Conditions

An agent has failed when:

- Scope is violated.
- Required artifacts missing.
- Forbidden artifacts generated.
- Traceability broken.
- Excessive clarification occurs.
- Existing knowledge ignored.

---

# Success Criteria

An agent is successful when:

- Scope remains appropriate.
- Outputs remain useful.
- Documentation remains proportional.
- Knowledge remains preserved.
- Implementation can begin confidently.

---

# Architectural Relationship

User Intent
↓
Classification Agent
↓
Clarification Agent
↓
Generation Agents
↓
Harness Agent
↓
Task Agent

All agents are governed by this specification.

---

# Closing Statement

Progressive Specification depends on intelligent adaptation.

The role of agents is not to maximize documentation or maximize process.

The role of agents is to apply the correct amount of rigor for the current scope.

These rules ensure that every agent remains aligned with the core philosophy of Specforge:

Understand first.

Generate second.

Generate only what is needed.
