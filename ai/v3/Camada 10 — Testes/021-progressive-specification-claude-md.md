# 021 - Progressive Specification CLAUDE.md Definition

## Status

Draft

---

# Purpose

This document defines the canonical CLAUDE.md behavior for Specforge V3.

Unlike previous specifications that describe architecture, workflows, or artifacts, this document defines how an AI agent should operate when executing Progressive Specification.

Its purpose is to transform the entire V3 architecture into a practical operating model.

This specification acts as the blueprint for the final generated CLAUDE.md artifact.

---

# Overview

Progressive Specification is built on a simple idea:

Different engineering problems require different amounts of process.

The role of the AI is not to maximize documentation.

The role of the AI is to apply the correct amount of rigor for the current scope.

The CLAUDE.md generated from this specification becomes the operational engine responsible for executing that philosophy.

---

# Core Philosophy

The AI must always follow the following principles.

---

## Knowledge First

Understand before generating.

Never generate specifications before sufficient understanding exists.

---

## Right-Sized Process

Apply the minimum process required for the selected scope.

---

## Generate Only What Is Needed

Only generate artifacts permitted by the Artifact Matrix.

---

## Progressive Complexity

Process complexity should scale with initiative complexity.

---

## Preserve Traceability

Maintain relationships between generated artifacts whenever possible.

---

## Preserve Existing Knowledge

Reuse available knowledge before asking new questions.

---

# Scope Awareness

Every request must operate within one of three scopes.

---

## Story

Small implementation task.

Examples:

- Add button
- Fix bug
- Add validation
- Add endpoint parameter

---

## Feature

New capability for an existing system.

Examples:

- OAuth Authentication
- Notification Center
- Reporting Module
- Audit Logging

---

## Product

Complete system or major initiative.

Examples:

- CRM
- Marketplace
- ERP
- SaaS Platform

---

# Mandatory Operating Workflow

For every request:

1. Analyze Intent
2. Determine Scope
3. Clarify Ambiguity
4. Resolve Required Artifacts
5. Generate Artifacts
6. Generate Harness
7. Generate Tasks
8. Validate Outputs

No steps may be skipped unless explicitly permitted by scope rules.

---

# Classification Rules

The AI must:

- Classify based on initiative scope.
- Consider context.
- Consider complexity.
- Consider risk.

The AI must not:

- Classify based on text length.
- Classify based only on keywords.

---

# Clarification Rules

The AI should ask only questions that materially affect outputs.

---

Story

Target:

0–5 questions

---

Feature

Target:

3–10 questions

---

Product

Target:

10–30 questions

---

The AI must stop asking questions once sufficient confidence exists.

---

# Confidence Thresholds

Story:

80%

---

Feature:

85%

---

Product:

90%

---

Generation may begin when confidence exceeds the threshold.

---

# Story Rules

When operating in Story scope:

Generate:

- Story Specification
- Tasks
- Harness

Do not generate:

- Architecture
- Security
- Product Vision

Prefer assumptions when risk is low.

Prioritize implementation readiness.

---

# Feature Rules

When operating in Feature scope:

Generate:

- Feature Specification
- Requirements
- Design
- Contracts
- Tasks
- Harness

Generate Architecture or Security only when justified.

Focus on capability delivery.

---

# Product Rules

When operating in Product scope:

Execute the complete Specforge V2 architecture.

Generate:

- Knowledge Artifacts
- Specifications
- Harnesses
- Tasks

Preserve governance and traceability.

---

# Artifact Rules

The AI must obey the Artifact Matrix.

Required artifacts must exist.

Forbidden artifacts must not exist.

Optional artifacts require justification.

---

# Traceability Rules

Maintain relationships between:

Requirements
↓
Acceptance Criteria
↓
Tasks
↓
Harnesses

Whenever possible.

---

# Harness Rules

Harnesses are derived artifacts.

Specifications remain the source of truth.

Harnesses should:

- Preserve decisions
- Preserve constraints
- Preserve requirements
- Apply context compression

Harnesses should not duplicate entire specifications.

---

# Escalation Rules

The AI may recommend escalation.

The AI must not silently escalate.

---

Required:

Explain:

- Why escalation is recommended
- Which signals triggered escalation

---

# Reduction Rules

The AI may recommend scope reduction.

The AI must not silently reduce scope.

---

Required:

Explain:

- Why reduction is recommended
- Which assumptions changed

---

# Existing Project Rules

Before clarification:

Search for:

- Existing requirements
- Existing architecture
- Existing decisions
- Existing specifications

Reuse existing context whenever possible.

---

# Knowledge Reuse Rules

If information already exists:

Do not ask for it again.

Reduce clarification effort.

---

# Regeneration Rules

When requirements change:

Prefer selective regeneration.

Avoid regenerating unrelated artifacts.

Preserve traceability.

Preserve existing knowledge.

---

# Output Rules

Generated outputs should be:

Clear

Actionable

Traceable

Scope-appropriate

Implementation-ready

---

Avoid:

Documentation inflation

Scope inflation

Process inflation

---

# Transparency Rules

The AI should explain:

- Scope decisions
- Clarification decisions
- Escalation decisions
- Reduction decisions

when relevant.

---

# Failure Handling

When confidence is insufficient:

Request clarification.

---

When requirements are contradictory:

Resolve contradictions before generation.

---

When scope is uncertain:

Perform scope clarification before proceeding.

---

# Validation Checklist

Before completing generation verify:

- Scope is correct
- Required artifacts exist
- Forbidden artifacts absent
- Traceability preserved
- Outputs are complete
- Outputs are consistent

---

# Success Criteria

The AI is successful when:

- Scope feels appropriate
- Clarification feels proportional
- Outputs are useful
- Knowledge is preserved
- Implementation can begin confidently

---

# Relationship With Progressive Specification

This document operationalizes:

001 Vision

002 Principles

003 Scope Model

005 Artifact Matrix

008 Progressive Pipeline

009 Composition Rules

010 Story Specification

011 Feature Specification

012 Product Profile

013 Clarification

014 Clarification Depth

015 Progressive Harness

016 Agent Rules

017 Generation Orchestrator

018 UI

019 Feedback

020 Testing

---

# Future Evolution

Future versions may introduce:

- Epic Scope
- Program Scope
- Platform Scope

The CLAUDE.md generated from this specification should remain extensible.

---

# Closing Statement

The purpose of the Specforge V3 CLAUDE.md is not to generate documents.

Its purpose is to apply the correct amount of engineering rigor to the problem being solved.

Every decision should optimize for understanding, implementation readiness, traceability, and knowledge preservation.

The AI should always seek the smallest process capable of producing a successful outcome.

Understand first.

Generate second.

Generate only what is needed.
