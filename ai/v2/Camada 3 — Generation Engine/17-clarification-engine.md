# Specforge V2 Clarification Engine

## Status

Accepted

## Purpose

This document defines the Clarification Engine used by Specforge.

The Clarification Engine is responsible for identifying uncertainty, ambiguity, missing information and hidden assumptions before specification generation.

Its purpose is to improve knowledge quality before implementation artifacts are generated.

The Clarification Engine exists because missing information is often more dangerous than incorrect information.

Rather than silently inventing answers, Specforge should actively seek clarification.

---

# Introduction

Most AI-assisted development workflows follow:

Idea
↓
Prompt
↓
Specification

When information is missing, AI systems frequently compensate by making assumptions.

This behavior creates:

- incorrect requirements
- invalid architecture decisions
- hidden constraints
- implementation drift
- inconsistent outputs

Specforge introduces a different philosophy:

Unknown information should be clarified rather than invented.

---

# Core Principle

When confidence is low, ask.

The engine should prefer:

- questions over assumptions
- validation over invention
- certainty over speed

---

# Core Hypothesis

Knowledge Gaps
↓
Ambiguity
↓
Incorrect Assumptions
↓
Poor Specifications

The Clarification Engine exists to break this chain.

---

# Responsibilities

The Clarification Engine exists to:

- identify missing information
- identify ambiguity
- identify contradictions
- identify hidden assumptions
- improve knowledge quality
- improve specification quality
- improve AI reliability

---

# Engine Inputs

The engine may analyze:

- Product DNA
- Vision
- Constraints
- Discoveries
- Decisions
- Existing Specifications
- Context Packages
- User Requests

The engine should evaluate both the presence and absence of information.

---

# Clarification Philosophy

The goal is not to ask more questions.

The goal is to ask better questions.

A single high-value clarification is more useful than twenty low-value clarifications.

---

# Clarification Categories

## Missing Information

Required information does not exist.

## Ambiguity

Multiple interpretations are possible.

## Assumption Detection

The system detects implied but undocumented beliefs.

## Constraint Gaps

Implementation boundaries are unclear.

## Scope Gaps

Feature boundaries are unclear.

## Decision Gaps

Important decisions have not been made.

## Traceability Gaps

Requirements exist without identifiable origins.

## Risk Gaps

Known uncertainties are undocumented.

---

# Clarification Pipeline

Knowledge Analysis
↓
Gap Detection
↓
Gap Classification
↓
Question Generation
↓
Question Prioritization
↓
User Clarification
↓
Knowledge Update
↓
Specification Generation

---

# Phase 01 — Knowledge Analysis

Analyze available knowledge.

Goal:

Build understanding of the project.

---

# Phase 02 — Gap Detection

Identify missing information.

Questions:

- What information is required?
- What information is absent?

---

# Phase 03 — Gap Classification

Possible classifications:

- Missing Information
- Ambiguity
- Assumption
- Constraint Gap
- Scope Gap
- Decision Gap
- Traceability Gap
- Risk Gap

---

# Phase 04 — Question Generation

Questions should be:

- specific
- actionable
- contextual
- high impact

Questions should avoid:

- generic wording
- unnecessary complexity
- duplicate requests

---

# Phase 05 — Question Prioritization

Priority Levels:

## Critical

Generation should stop.

## High

Strongly recommended.

## Medium

Useful but not mandatory.

## Low

Optional improvement.

---

# Clarification Decision Model

Possible outcomes:

## Proceed

No meaningful uncertainty detected.

## Proceed With Warnings

Generation possible but risks exist.

## Clarification Recommended

Knowledge quality would improve significantly.

## Clarification Required

Generation should pause.

Critical uncertainty exists.

---

# Clarification Quality Requirements

A high-quality clarification question should:

## Explain Why

The user should understand why the question matters.

## Explain Impact

The user should understand the consequence of not answering.

## Avoid Assumptions

The question should not contain hidden conclusions.

## Be Actionable

The user should be able to answer clearly.

---

# Example

Poor Question:

What database should we use?

Better Question:

The current specification requires data persistence, but no storage technology has been defined.

This affects architecture, deployment and scalability decisions.

Which storage approach should be considered for this project?

---

# Knowledge Updates

Clarification answers should not remain inside conversations.

Answers should become knowledge.

Possible destinations:

- Discovery
- Decision
- Constraint
- Specification Update

---

# Clarification Success Metrics

The Clarification Engine is successful when:

- assumptions decrease
- ambiguity decreases
- contradictions decrease
- specification quality increases
- implementation rework decreases

---

# Failure Modes

## Question Flooding

Asking too many low-value questions.

## Cosmetic Clarification

Questions that do not improve outcomes.

## Hidden Assumptions

The engine assumes information instead of asking.

## Clarification Ignorance

Questions are asked but answers are never preserved.

## Knowledge Isolation

Answers remain trapped inside conversations.

---

# AI Responsibilities

AI systems implementing the Clarification Engine should:

- identify uncertainty
- explain uncertainty
- generate targeted questions
- prioritize high-impact clarifications
- preserve clarification outcomes
- avoid inventing information

The engine should optimize for understanding rather than speed.

---

# Future Evolution

Future versions may introduce:

- clarification scoring
- adaptive questioning
- clarification coverage analysis
- ambiguity detection models
- contradiction detection
- automated knowledge updates

---

# Long-Term Vision

The long-term goal is not to generate more specifications.

The long-term goal is to generate better specifications.

The Clarification Engine is the primary mechanism through which Specforge improves knowledge before generation occurs.

---

# Final Statement

Most AI systems attempt to answer questions.

Specforge should excel at identifying unanswered questions.

The quality of a specification is often determined by the questions asked before it is generated.

The Clarification Engine ensures that uncertainty becomes understanding before implementation begins.
