# Specforge V2 Clarification Engine

## Status

Accepted

## Purpose

This document defines the Clarification Engine V2 used by Specforge.

The Clarification Engine is responsible for identifying missing information, ambiguities, contradictions and hidden assumptions before knowledge, specifications or implementation artifacts are generated.

Its purpose is to maximize specification quality by reducing uncertainty at the source.

The Clarification Engine transforms incomplete intent into actionable understanding.

---

# Introduction

Most project failures begin long before implementation.

Common causes include:

- missing requirements
- ambiguous requirements
- conflicting expectations
- hidden assumptions
- incomplete context

AI systems amplify these problems.

Poor input produces poor output.

The Clarification Engine exists to detect and resolve uncertainty before it propagates through the system.

---

# Definition

## Clarification

Clarification is the process of transforming uncertainty into explicit knowledge.

A clarification process answers:

- What information is missing?
- What assumptions are being made?
- What contradictions exist?
- Which decisions remain unresolved?

Clarification precedes specification generation.

---

# Core Hypothesis

Clarification quality directly influences specification quality.

Relationship:

Intent
↓
Clarification
↓
Knowledge
↓
Specifications
↓
Implementation

Better questions produce better systems.

---

# Responsibilities

The Clarification Engine exists to:

- detect ambiguity
- detect missing information
- detect contradictions
- reduce assumptions
- improve specification quality
- improve implementation quality
- preserve project intent

---

# Inputs

The Clarification Engine may consume:

- Product Vision
- Product DNA
- Discoveries
- Decisions
- Context Packages
- Requirements
- Existing Specifications
- User Conversations

---

# Clarification Categories

## Missing Information

Required information not provided.

Examples:

- missing actors
- missing workflows
- missing constraints

---

## Ambiguity

Multiple valid interpretations exist.

Examples:

- unclear behavior
- vague requirements
- undefined terminology

---

## Contradictions

Conflicting information exists.

Examples:

- incompatible requirements
- conflicting constraints
- conflicting decisions

---

## Hidden Assumptions

Information assumed but never stated.

Examples:

- user expectations
- technical assumptions
- operational assumptions

---

## Scope Gaps

Important areas not covered.

Examples:

- security gaps
- testing gaps
- operational gaps

---

# Clarification Lifecycle

Intent
↓
Analysis
↓
Gap Detection
↓
Question Generation
↓
Resolution
↓
Knowledge Update

Clarification should continuously improve project understanding.

---

# Clarification Analysis

The engine should evaluate:

## Completeness

Is required information present?

## Consistency

Does information agree?

## Specificity

Is information precise enough?

## Testability

Can outcomes be validated?

## Traceability

Can reasoning be explained?

---

# Question Generation

Questions should be:

## Relevant

Address meaningful uncertainty.

## Actionable

Enable progress.

## Specific

Avoid vague wording.

## Prioritized

Focus on high-impact gaps first.

---

# Clarification Priority Model

## Critical

Blocks specification generation.

Examples:

- unknown business objective
- unknown actor
- conflicting requirements

---

## High

Creates significant risk.

Examples:

- undefined workflow
- missing security expectation

---

## Medium

Useful but not blocking.

Examples:

- optimization preferences
- implementation preferences

---

## Low

Nice-to-have information.

---

# Question Structure

Every clarification question should contain:

## Question ID

Example:

CLAR-001

## Category

## Context

Why the question exists.

## Question

The actual question.

## Impact

Why the answer matters.

## Priority

Critical, High, Medium or Low.

---

# Clarification Rules

The engine should:

- prefer clarification over assumption
- explain why questions exist
- group related questions
- avoid duplicate questions
- preserve resolved answers

---

# Resolution Handling

When clarification is resolved:

Resolution
↓
Knowledge Update
↓
Discovery Creation
↓
Decision Creation (if needed)
↓
Specification Update

Answers should become durable knowledge.

---

# Knowledge Integration

Resolved clarifications may create:

- Discoveries
- Decisions
- Context Packages
- Specification Updates

Clarification should feed the knowledge model.

---

# Clarification Quality Standards

Questions should be:

## Necessary

Address meaningful uncertainty.

## Explainable

Reason for asking is visible.

## Traceable

Linked to source artifacts.

## Prioritized

Ordered by impact.

## Non-Repetitive

Previously answered questions should not reappear.

---

# Validation Rules

The Clarification Engine should pass:

- Ambiguity Detection Validation
- Missing Information Validation
- Contradiction Detection Validation
- Question Quality Validation
- Prioritization Validation
- Traceability Validation

---

# Anti-Patterns

## Assumption First

Assuming instead of asking.

## Question Flooding

Asking everything at once.

## Low-Value Questions

Questions with no impact.

## Missing Context

Questions without explanation.

## Lost Answers

Resolved clarifications not preserved.

---

# Relationship With Other Artifacts

Intent
↓
Clarification Engine
↓
Knowledge Model
↓
Specifications
↓
Harnesses
↓
Implementation

Clarification improves every downstream artifact.

---

# AI Responsibilities

AI systems using the Clarification Engine should:

- identify uncertainty
- identify contradictions
- identify missing information
- explain risks
- preserve answers

AI should optimize for understanding before generation.

---

# Future Evolution

Future versions may introduce:

- automated ambiguity scoring
- contradiction graphs
- adaptive questioning
- clarification analytics
- domain-specific question generators

---

# Long-Term Vision

Projects should become progressively clearer over time.

Every clarification should improve organizational knowledge.

Questions should become assets rather than interruptions.

---

# Final Statement

Specifications fail when assumptions replace understanding.

The Clarification Engine exists to expose uncertainty before it becomes defects.

The goal is not to ask more questions.

The goal is to ask the right questions at the right time.
