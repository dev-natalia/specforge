# 013 - Progressive Clarification Specification

## Status

Draft

---

# Purpose

This document defines the Progressive Clarification Engine used by Specforge V3.

The Clarification Engine is responsible for reducing ambiguity, discovering missing information, validating assumptions, and collecting the minimum amount of information required to generate useful outputs.

Unlike traditional requirement gathering systems, the objective is not to maximize information collection.

The objective is to maximize understanding while minimizing user effort.

---

# Overview

One of the most common failure modes in AI-assisted engineering is premature generation.

The pattern typically follows:

Incomplete Input
→ Hidden Assumptions
→ Incorrect Understanding
→ Poor Specifications
→ Poor Implementation

The Clarification Engine exists to interrupt this sequence.

---

# Core Principle

The goal is not to ask more questions.

The goal is to ask the right questions.

---

# Clarification Philosophy

Progressive Clarification follows four principles:

1. Clarify only when necessary.
2. Stop as soon as sufficient understanding exists.
3. Adapt questioning depth to scope.
4. Optimize for implementation readiness.

---

# Clarification Objectives

The engine should:

- Reduce ambiguity.
- Discover missing requirements.
- Surface assumptions.
- Identify contradictions.
- Identify dependencies.
- Increase specification quality.

The engine should not:

- Conduct interviews.
- Generate unnecessary conversations.
- Collect information without purpose.
- Create process friction.

---

# Clarification Lifecycle

The clarification process follows the following stages.

---

## Stage 1 — Intent Understanding

Determine what the user wants to achieve.

Questions:

What is being built?

Why is it needed?

What outcome is expected?

---

## Stage 2 — Ambiguity Detection

Detect vague statements.

Examples:

"Improve login"

"Make reporting better"

"Create notifications"

These statements require additional clarification.

---

## Stage 3 — Information Gap Detection

Determine what information is missing.

Examples:

- User roles
- Data requirements
- Integrations
- Constraints

---

## Stage 4 — Assumption Validation

Validate assumptions before generation.

Example:

Assumption:

Authentication means OAuth.

Validation:

Ask user before proceeding.

---

## Stage 5 — Clarification Completion

Determine whether enough understanding exists to continue.

---

# Clarification Levels

The clarification process varies by scope.

---

# Story Clarification

## Objective

Reach implementation readiness as quickly as possible.

---

## Strategy

Minimal questioning.

Only ask questions that directly affect implementation.

---

## Typical Question Count

Target:

0 to 5 questions

Maximum:

5 questions

---

## Information Required

Objective

Expected behavior

Acceptance criteria

---

## Information Typically Ignored

Architecture

Long-term strategy

Product vision

Future roadmap

---

## Example

Input:

"Add CSV export button."

Questions:

- Which data should be exported?
- Where should the button appear?

Generation begins immediately afterward.

---

# Feature Clarification

## Objective

Understand capability design and integration requirements.

---

## Strategy

Moderate questioning.

Focus on behavior and interactions.

---

## Typical Question Count

Target:

3 to 10 questions

Maximum:

10 questions

---

## Information Required

Requirements

Actors

Integrations

Constraints

Expected behavior

---

## Example

Input:

"Add Google authentication."

Questions:

- Existing authentication method?
- Supported user roles?
- Account linking behavior?
- Required providers?

---

# Product Clarification

## Objective

Understand the system before specification generation.

---

## Strategy

Deep discovery process.

---

## Typical Question Count

Target:

10 to 30 questions

No hard limit.

---

## Information Required

Vision

Goals

Users

Business model

Constraints

Requirements

Risks

Architecture concerns

---

## Example

Input:

"Create a CRM platform."

Multiple clarification rounds expected.

---

# Clarification Completion Rules

The engine must determine when enough understanding exists.

---

## Rule

Generation should begin when confidence exceeds the required threshold.

Not when all possible information has been collected.

---

# Confidence Thresholds

Story:

80% confidence

---

Feature:

85% confidence

---

Product:

90% confidence

---

# Ambiguity Categories

The engine should classify ambiguity.

---

## Functional Ambiguity

Behavior unclear.

Example:

"Export data."

Which data?

---

## Actor Ambiguity

Users unclear.

Example:

"Allow editing."

Who can edit?

---

## Data Ambiguity

Data unclear.

Example:

"Store customer information."

Which fields?

---

## Integration Ambiguity

External systems unclear.

Example:

"Connect to payments."

Which provider?

---

## Constraint Ambiguity

Restrictions unclear.

Example:

"Must be secure."

Define security requirements.

---

# Clarification Priority Rules

Not all ambiguity requires clarification.

---

## High Priority

Must block generation.

Examples:

- Missing core behavior
- Missing actors
- Contradictory requirements

---

## Medium Priority

May trigger clarification.

Examples:

- Edge cases
- Optional integrations

---

## Low Priority

Should not block generation.

Examples:

- Cosmetic details
- Future enhancements

---

# Clarification Stopping Rules

The engine must stop asking questions when:

- Confidence threshold reached.
- Remaining ambiguity is low impact.
- User explicitly requests generation.
- Additional questions provide minimal value.

---

# Anti-Interrogation Rules

The platform must actively avoid excessive questioning.

---

## Rule 1

Never ask a question whose answer will not affect generation.

---

## Rule 2

Never ask for information already provided.

---

## Rule 3

Never ask speculative future questions.

---

## Rule 4

Prefer assumptions over questions when risk is low.

Document assumptions.

---

## Rule 5

Batch questions when possible.

Avoid one-question conversations.

---

# Assumption Model

The engine may create assumptions.

Requirements:

- Assumption explicitly documented.
- Assumption low risk.
- Assumption reversible.

---

## Example

Input:

"Add loading indicator."

Assumption:

Standard spinner.

No clarification required.

---

# Clarification Escalation

Additional clarification may be triggered when:

- Contradictions detected.
- Scope changes.
- New artifacts become required.
- Risk level increases.

---

# Clarification Reduction

Clarification should reduce when:

- Scope decreases.
- Confidence increases.
- Similar context already exists.

---

# Knowledge Reuse

Existing knowledge should reduce clarification effort.

Examples:

- Existing project context.
- Existing requirements.
- Existing decisions.
- Existing architecture.

---

# Clarification Outputs

The engine produces:

- Clarified Intent
- Clarified Requirements
- Assumptions
- Open Questions
- Confidence Score

---

# Success Metrics

The Clarification Engine is successful when:

- Fewer unnecessary questions are asked.
- Specification quality increases.
- User effort decreases.
- Scope-appropriate questioning occurs.
- Generation starts earlier.
- Ambiguity-related failures decrease.

---

# Failure Conditions

The engine has failed when:

- Excessive questioning occurs.
- Critical ambiguity remains unresolved.
- Contradictions are ignored.
- Incorrect assumptions dominate outputs.

---

# Relationship With Progressive Specification

Scope Model
↓
Artifact Matrix
↓
Pipeline Composition
↓
Clarification Engine
↓
Generation

The Clarification Engine determines when the pipeline has enough understanding to proceed.

---

# Closing Statement

The Progressive Clarification Engine exists to solve a fundamental tension:

More questions increase understanding.

More questions also increase friction.

The objective of Progressive Clarification is to find the optimal balance between these forces.

The engine should ask as little as possible while learning as much as necessary.

Its success is measured not by how many questions it asks, but by how quickly it enables high-quality generation.
