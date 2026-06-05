# 008 - Progressive Pipeline Specification

## Status

Draft

---

# Purpose

This document defines the Progressive Pipeline architecture used by Specforge V3.

The Progressive Pipeline is responsible for determining which stages of the generation process should be executed based on the selected scope.

Its purpose is to ensure that:

- Small initiatives remain lightweight.
- Medium initiatives receive sufficient planning.
- Large initiatives receive complete engineering governance.

The pipeline adapts process depth while preserving a unified Knowledge First architecture.

---

# Overview

Specforge V2 introduced a single generation pipeline:

Intent
→ Clarification
→ Knowledge
→ Specifications
→ Harnesses
→ Tasks
→ Provider Outputs
→ Implementation

While effective for products, this approach applies the same process regardless of scope.

Progressive Specification introduces adaptive pipelines.

Different scopes execute different subsets of the generation process.

---

# Progressive Pipeline Concept

The platform does not operate with multiple engines.

The platform operates with one engine and multiple pipeline profiles.

Each profile activates a different set of stages.

---

# Objectives

The Progressive Pipeline must:

1. Preserve Knowledge First.
2. Reduce unnecessary process overhead.
3. Prevent documentation waste.
4. Support future scope expansion.
5. Maintain architectural consistency.
6. Generate only necessary artifacts.

---

# Pipeline Components

The generation engine is composed of reusable stages.

These stages may or may not execute depending on scope.

---

## Stage 1 — Intent Capture

Purpose:

Understand what the user wants to create.

Examples:

- Story
- Feature
- Product

---

Outputs:

- Initial Request
- Candidate Scope
- User Intent

---

## Stage 2 — Scope Resolution

Purpose:

Determine which scope profile should be applied.

Possible Results:

- Story
- Feature
- Product

---

Outputs:

- Final Scope
- Pipeline Profile

---

## Stage 3 — Clarification

Purpose:

Reduce ambiguity.

Collect missing information.

Validate assumptions.

---

Outputs:

- Clarified Intent
- Clarified Requirements

---

## Stage 4 — Knowledge Collection

Purpose:

Capture relevant discoveries, decisions, constraints, and context.

---

Outputs:

- Discoveries
- Decisions
- Context

---

## Stage 5 — Specification Generation

Purpose:

Generate specification artifacts.

---

Outputs:

- Requirements
- Design
- Architecture
- Contracts
- Security
- Testing

Depending on scope.

---

## Stage 6 — Harness Generation

Purpose:

Generate AI operational guidance.

---

Outputs:

- CLAUDE.md
- Cursor Rules
- Agent Instructions

or equivalent outputs.

---

## Stage 7 — Task Generation

Purpose:

Transform specifications into executable work.

---

Outputs:

- Tasks
- Work Breakdown
- Implementation Plan

---

## Stage 8 — Provider Output Generation

Purpose:

Generate provider-specific artifacts.

---

Outputs:

- Claude Artifacts
- GPT Artifacts
- Cursor Artifacts
- Future Providers

---

# Story Pipeline

## Purpose

Optimize for speed and implementation readiness.

---

## Workflow

Intent
→ Scope Resolution
→ Clarification
→ Requirements
→ Harness
→ Tasks
→ Provider Outputs

---

## Enabled Stages

Intent Capture

Scope Resolution

Clarification

Specification Generation (Requirements Only)

Harness Generation

Task Generation

Provider Output Generation

---

## Disabled Stages

Knowledge Collection

Architecture Generation

Design Generation

Security Generation

Context Package Generation

---

## Primary Goal

Reach implementation readiness as quickly as possible.

---

# Feature Pipeline

## Purpose

Provide implementation planning for meaningful capabilities.

---

## Workflow

Intent
→ Scope Resolution
→ Clarification
→ Knowledge Collection
→ Requirements
→ Design
→ Contracts
→ Harness
→ Tasks
→ Provider Outputs

---

## Enabled Stages

Intent Capture

Scope Resolution

Clarification

Knowledge Collection

Requirements

Design

Contracts

Harness

Tasks

Provider Outputs

---

## Optional Stages

Architecture

Security

Risk Analysis

---

## Primary Goal

Produce a complete feature implementation blueprint.

---

# Product Pipeline

## Purpose

Provide complete engineering planning and governance.

---

## Workflow

Intent
→ Scope Resolution
→ Clarification
→ Knowledge Collection
→ Requirements
→ Design
→ Architecture
→ Contracts
→ Security
→ Testing
→ Harness
→ Tasks
→ Provider Outputs

---

## Enabled Stages

All stages.

---

## Primary Goal

Produce a complete knowledge-driven engineering plan.

---

# Pipeline Comparison

## Clarification Depth

Story:

Low

---

Feature:

Medium

---

Product:

High

---

## Knowledge Collection

Story:

Minimal

---

Feature:

Moderate

---

Product:

Extensive

---

## Documentation Volume

Story:

Low

---

Feature:

Medium

---

Product:

High

---

## Governance

Story:

Low

---

Feature:

Medium

---

Product:

High

---

# Pipeline Invariants

The following rules apply to every pipeline.

---

## Knowledge First

No pipeline may bypass understanding.

---

## Clarification First

No specification should be generated before clarification.

---

## Tasks Are Derived

Tasks must be generated from specifications.

Never directly from intent.

---

## Harness Is Derived

Harnesses must be generated from specifications.

Never directly from intent.

---

## Traceability

Outputs should preserve relationships whenever possible.

---

# Pipeline Escalation

The platform may escalate pipelines when scope changes.

---

## Story → Feature

Additional stages enabled:

Knowledge Collection

Design

Contracts

---

## Feature → Product

Additional stages enabled:

Architecture

Security

Comprehensive Testing

Context Packages

Governance

---

# Pipeline Reduction

The platform may reduce scope when appropriate.

When reduction occurs:

- Unnecessary stages are skipped.
- Existing knowledge is preserved.
- Existing decisions are preserved.

---

# Failure Handling

If clarification reveals insufficient information:

Pipeline execution should pause.

The platform should request additional information before continuing.

---

# Extension Model

Future versions may introduce additional profiles.

Examples:

Task Pipeline

Epic Pipeline

Platform Pipeline

Program Pipeline

The architecture should remain extensible.

---

# Success Criteria

The Progressive Pipeline is successful when:

- Story workflows feel lightweight.
- Feature workflows feel complete.
- Product workflows feel comprehensive.
- Users receive only necessary artifacts.
- Process complexity matches scope.
- Knowledge First remains preserved.

---

# Architectural Relationship

The Progressive Pipeline acts as the orchestration layer between:

Scope Model
↓
Artifact Matrix
↓
Generation Engine

The Scope Model determines what the initiative is.

The Artifact Matrix determines which artifacts may exist.

The Progressive Pipeline determines how those artifacts are produced.

---

# Closing Statement

The Progressive Pipeline is the execution backbone of Progressive Specification.

It transforms scope awareness into process awareness.

By activating only the stages required for the selected scope, Specforge can maintain engineering rigor while eliminating unnecessary complexity.

This enables the platform to remain both scalable and efficient while preserving the Knowledge First philosophy established by Specforge V2.
