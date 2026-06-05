# Specforge V2 Harness Model

## Status

Accepted

## Purpose

This document defines the Harness Model used by Specforge.

The Harness Model is responsible for transforming project knowledge and specifications into an operational environment that guides AI behavior during implementation.

Its purpose is to ensure that AI systems operate consistently, safely and predictably across a project lifecycle.

Harnesses are the primary mechanism through which Specforge operationalizes engineering knowledge.

---

# Introduction

Most AI-assisted development relies on prompts.

Prompts are temporary.

Prompts are conversation artifacts.

Projects require durable operational guidance.

Specforge introduces Harnesses as persistent execution environments that preserve project knowledge, engineering standards and behavioral expectations.

Harnesses are not prompts.

Harnesses are operational engineering assets.

---

# Definition

## Harness

A Harness is a structured operational artifact that governs how an AI system should behave while working on a project.

A Harness answers:

- What knowledge should be used?
- What behaviors are allowed?
- What behaviors are prohibited?
- Which quality standards apply?
- Which specifications are authoritative?

Harnesses transform static specifications into active execution guidance.

---

# Core Hypothesis

Consistent AI behavior requires consistent operational context.

Relationship:

Knowledge
↓
Specifications
↓
Harness
↓
AI Execution
↓
Implementation

Harnesses are the bridge between planning and execution.

---

# Responsibilities

Harnesses exist to:

- preserve project identity
- preserve engineering standards
- preserve architectural decisions
- preserve security requirements
- preserve testing requirements
- preserve traceability
- reduce hallucinations
- reduce implementation drift

---

# Inputs

Harnesses may consume:

- Product DNA
- Core Principles
- Discoveries
- Decisions
- Requirements Specifications
- Design Specifications
- Architecture Specifications
- Contracts Specifications
- Edge Cases Specifications
- Security Specifications
- Testing Specifications
- Task Generation Artifacts

---

# Harness Components

## Identity Layer

Defines:

- project identity
- mission
- values
- product DNA

Purpose:

Prevent implementation drift.

---

## Context Layer

Defines:

- relevant knowledge
- discoveries
- decisions
- active context packages

Purpose:

Provide understanding.

---

## Specification Layer

Defines authoritative specifications.

Examples:

- requirements
- design
- architecture
- contracts
- security
- testing

Purpose:

Define expected outcomes.

---

## Execution Layer

Defines implementation guidance.

Examples:

- coding expectations
- workflow expectations
- task execution rules

Purpose:

Guide implementation.

---

## Validation Layer

Defines verification requirements.

Examples:

- quality gates
- testing requirements
- review requirements

Purpose:

Prevent low-quality outputs.

---

## Preservation Layer

Defines context preservation mechanisms.

Examples:

- traceability requirements
- decision references
- rationale preservation

Purpose:

Prevent knowledge loss.

---

# Harness Structure

Every Harness should contain:

## Harness ID

Example:

HAR-001

## Title

Short description.

## Purpose

Reason for existence.

## Scope

Where the Harness applies.

## Active Knowledge Sources

Referenced knowledge artifacts.

## Active Specifications

Referenced specifications.

## Execution Rules

Behavioral guidance.

## Validation Rules

Quality expectations.

## Traceability Rules

Reference preservation requirements.

## Constraints

Operational boundaries.

## Prohibited Behaviors

Explicit anti-patterns.

---

# Harness Categories

## Project Harness

Project-wide operational guidance.

## Feature Harness

Feature-specific guidance.

## Architecture Harness

Architecture-focused guidance.

## Security Harness

Security-focused guidance.

## Testing Harness

Testing-focused guidance.

## Review Harness

Review-focused guidance.

---

# Execution Rules

Harnesses should define:

## Allowed Behaviors

Examples:

- ask clarification questions
- challenge assumptions
- preserve traceability

## Required Behaviors

Examples:

- reference specifications
- validate requirements
- generate tests

## Prohibited Behaviors

Examples:

- invent requirements
- bypass security requirements
- ignore quality gates

---

# Traceability Requirements

Harnesses should preserve links to:

- discoveries
- decisions
- specifications
- tasks

No generated artifact should become disconnected from its origins.

---

# Quality Integration

Harnesses should enforce:

- Quality Gates
- Security Requirements
- Testing Requirements
- Traceability Requirements

Harnesses are responsible for operational enforcement.

---

# Provider Independence

Harnesses should remain provider-neutral.

Supported examples:

- Claude
- GPT
- Gemini
- Cursor
- Roo Code
- Future providers

Harnesses should outlive individual AI systems.

---

# Harness Lifecycle

Knowledge
↓
Harness Generation
↓
Validation
↓
Execution
↓
Evolution
↓
Regeneration

Harnesses should evolve with project knowledge.

---

# Validation Rules

Harnesses should pass:

- Knowledge Coverage Validation
- Specification Coverage Validation
- Traceability Validation
- Quality Validation
- Security Validation
- Contradiction Validation

---

# Anti-Patterns

## Prompt Harness

Treating prompts as harnesses.

## Knowledge Loss

Ignoring project knowledge.

## Specification Drift

Ignoring specifications.

## Provider Lock-In

Harness tied to one provider.

## Missing Validation

No quality enforcement.

---

# Relationship With Other Artifacts

Knowledge
↓
Specifications
↓
Harness
↓
Tasks
↓
Implementation

Harnesses operationalize knowledge.

Tasks operationalize implementation.

---

# AI Responsibilities

AI systems operating under a Harness should:

- preserve knowledge
- preserve rationale
- preserve traceability
- preserve security requirements
- preserve testing requirements
- preserve quality standards

AI should treat Harness guidance as authoritative.

---

# Future Evolution

Future versions may introduce:

- harness composition
- harness inheritance
- harness health scoring
- harness drift detection
- harness analytics

---

# Long-Term Vision

Harnesses should become reusable operational assets.

Teams should be able to change AI providers without rebuilding project guidance.

Knowledge should remain stable even when tools change.

Harnesses make this possible.

---

# Final Statement

Specifications define what should be built.

Tasks define how work is executed.

Harnesses define how AI should behave while executing that work.

Harnesses are not prompts.

Harnesses are operational engineering environments that transform project knowledge into consistent AI execution.
