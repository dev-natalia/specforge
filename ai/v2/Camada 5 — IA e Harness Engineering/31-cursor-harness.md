# Specforge V2 Cursor Harness

## Status

Accepted

## Purpose

This document defines the Cursor Harness used by Specforge.

The Cursor Harness is responsible for transforming project knowledge, specifications and execution rules into a Cursor-compatible operational environment.

Its purpose is to ensure that Cursor operates consistently with project architecture, specifications and engineering standards while working directly inside the development environment.

The Cursor Harness is an implementation of the generic Harness Model optimized for editor-centric workflows.

---

# Introduction

Cursor operates differently from standalone AI agents.

Cursor exists inside the development environment.

Its behavior is influenced by:

- open files
- selected code
- workspace structure
- active editing context

This creates both advantages and risks.

Advantages:

- immediate code visibility
- local context awareness
- fast iteration

Risks:

- local optimization
- architecture drift
- incomplete project understanding
- context fragmentation

The Cursor Harness exists to mitigate these risks.

---

# Definition

## Cursor Harness

A Cursor Harness is a Cursor-compatible operational artifact generated from project knowledge and specifications.

A Cursor Harness answers:

- What should Cursor prioritize?
- Which specifications are authoritative?
- Which architectural rules must be preserved?
- How should local edits align with project goals?

The Cursor Harness aligns editor-level actions with project-level intent.

---

# Core Hypothesis

Knowledge
↓
Specifications
↓
Harness
↓
Cursor Harness
↓
.cursor/rules
↓
Cursor Execution

The Cursor Harness transforms engineering knowledge into editor-compatible execution guidance.

---

# Responsibilities

The Cursor Harness exists to:

- preserve project architecture
- preserve project standards
- preserve specifications
- preserve traceability
- reduce local optimization bias
- reduce architectural drift
- improve implementation consistency

---

# Inputs

The Cursor Harness may consume:

- Product DNA
- Core Principles
- Discoveries
- Decisions
- Context Packages
- Requirements Specifications
- Design Specifications
- Architecture Specifications
- Contracts Specifications
- Security Specifications
- Testing Specifications
- Task Artifacts

---

# Cursor Harness Structure

## Project Identity

Defines:

- project purpose
- mission
- constraints
- product DNA

Purpose:

Prevent project drift.

---

## Architecture Preservation Rules

Defines:

- module boundaries
- domain ownership
- dependency rules
- communication rules

Purpose:

Prevent architecture degradation.

---

## Specification References

Defines authoritative artifacts.

Examples:

- requirements
- architecture
- contracts
- security

Purpose:

Provide source-of-truth guidance.

---

## Editing Rules

Defines expected editing behavior.

Examples:

- preserve existing conventions
- avoid unnecessary refactors
- avoid unrelated changes
- preserve interfaces

Purpose:

Guide editor interactions.

---

## Validation Rules

Defines output expectations.

Examples:

- tests required
- contract validation
- security validation
- architecture validation

Purpose:

Prevent low-quality changes.

---

## Prohibited Behaviors

Examples:

- architecture violations
- speculative refactors
- hidden breaking changes
- requirement invention

Purpose:

Prevent harmful edits.

---

# Cursor Rules Generation

The primary output of a Cursor Harness is:

.cursor/rules

Generated rules may contain:

- Project Context
- Engineering Principles
- Architecture Constraints
- Security Rules
- Testing Rules
- Traceability Rules
- Editing Rules
- Validation Rules

---

# Editor-Centric Challenges

The Cursor Harness should compensate for:

## Local Context Bias

Open files do not represent the entire project.

## Selection Bias

Selected code may not contain sufficient context.

## Architectural Blindness

Workspace visibility does not guarantee architecture awareness.

## Refactor Drift

Small edits can accumulate into architectural degradation.

---

# Editing Expectations

Cursor should:

## Minimize Unrelated Changes

Only modify what is necessary.

## Preserve Existing Contracts

Avoid accidental interface changes.

## Preserve Architecture

Respect architectural boundaries.

## Preserve Traceability

Maintain references and rationale.

## Preserve Testing

Update tests when behavior changes.

---

# Context Management

The Cursor Harness should prioritize:

1. Active Task
2. Relevant Specification
3. Architecture Rules
4. Contracts
5. Security Requirements
6. Historical Context

Context prioritization should reduce token waste.

---

# Workspace Awareness

Cursor should understand:

- repository structure
- module ownership
- domain boundaries
- active components

Workspace awareness should not replace specifications.

Specifications remain authoritative.

---

# Quality Integration

The Cursor Harness should enforce:

- Quality Gates
- Security Requirements
- Testing Requirements
- Architecture Constraints

Quality should be enforced before code generation.

---

# Traceability Requirements

Cursor-generated changes should reference:

- requirements
- architecture decisions
- contracts
- tasks

Changes should remain explainable.

---

# Knowledge Preservation

Cursor should preserve:

- rationale
- decisions
- architectural intent
- specification intent

Knowledge loss is considered a failure.

---

# Validation Rules

Cursor Harnesses should pass:

- Architecture Validation
- Specification Coverage Validation
- Quality Validation
- Security Validation
- Traceability Validation
- Workspace Consistency Validation

---

# Anti-Patterns

## File-Centric Development

Ignoring broader project context.

## Architecture Drift

Local optimizations harming architecture.

## Context Fragmentation

Changes made without understanding dependencies.

## Hidden Refactors

Unplanned structural modifications.

## Specification Ignorance

Ignoring authoritative artifacts.

---

# Relationship With Other Artifacts

Knowledge
↓
Specifications
↓
Harness Model
↓
Cursor Harness
↓
.cursor/rules
↓
Cursor Execution

The Cursor Harness operationalizes the Harness Model for editor-based AI workflows.

---

# AI Responsibilities

Cursor operating under a Harness should:

- preserve project intent
- preserve architecture
- preserve contracts
- preserve security requirements
- preserve testing requirements
- preserve traceability

Harness guidance should be treated as authoritative.

---

# Future Evolution

Future versions may introduce:

- rule composition
- dynamic workspace loading
- architecture-aware navigation
- harness scoring
- automated rule regeneration

---

# Long-Term Vision

Projects should be able to onboard Cursor instantly through generated harnesses.

Cursor should inherit project understanding automatically.

Developers should spend less time teaching context and more time building software.

---

# Final Statement

The Harness Model defines operational guidance.

The Cursor Harness adapts that guidance for editor-centric workflows.

The generated .cursor/rules become the operational contract between the project and Cursor.

The goal is not better autocomplete.

The goal is architecture-preserving implementation.
