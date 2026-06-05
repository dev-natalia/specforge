# Specforge V2 Decision Records

## Status

Accepted

## Purpose

This document defines the Decision Record model used by Specforge.

Decision Records are durable knowledge artifacts responsible for preserving project decisions and the reasoning behind them.

The purpose of a Decision Record is not merely to record a choice.

Its purpose is to preserve understanding.

Future developers should be able to understand:

- what was decided
- why it was decided
- which alternatives existed
- which tradeoffs were accepted
- which discoveries influenced the decision

Decision Records are one of the most important mechanisms for preventing knowledge decay.

---

# Introduction

Most projects remember decisions.

Few projects remember reasoning.

Teams often know:

"What was chosen?"

but cannot answer:

"Why was it chosen?"

Over time this creates:

- repeated discussions
- architecture drift
- conflicting implementations
- loss of confidence

Decision Records exist to preserve decision context.

---

# Definition

## Decision Record

A Decision Record is a durable representation of a project decision and its supporting rationale.

A Decision Record answers:

- What did we choose?
- Why did we choose it?

A Decision Record is not a task.

A Decision Record is not a requirement.

A Decision Record is not implementation.

A Decision Record is preserved reasoning.

---

# Core Hypothesis

Every important project decision should be explainable.

Discovery
↓
Decision
↓
Specification
↓
Harness
↓
Implementation

If decisions survive but rationale disappears, project understanding degrades.

---

# Why Decision Records Matter

Projects continuously make decisions.

Examples:

- product decisions
- architecture decisions
- technology decisions
- process decisions
- business decisions

Without Decision Records:

- rationale disappears
- assumptions become invisible
- tradeoffs are forgotten
- discussions repeat

---

# Decision Categories

## Product Decision

Examples:

- Free Forever
- BYOK
- No Login

## Technical Decision

Examples:

- FastAPI
- PostgreSQL
- Monolithic Architecture

## Architecture Decision

Examples:

- Modular Monolith
- Event Driven Architecture

## Process Decision

Examples:

- Spec Driven Development
- Knowledge First Architecture

## Business Decision

Examples:

- Open Source
- Community Driven Development

---

# Decision Structure

Every Decision Record should contain:

## Decision ID

Example:

DEC-001

## Title

Short description.

## Status

- Proposed
- Accepted
- Superseded
- Rejected
- Deprecated

## Date

Date of creation.

## Category

- Product
- Technical
- Architecture
- Process
- Business

## Context

What problem are we solving?

## Decision

What was chosen?

## Rationale

Why was it chosen?

## Alternatives Considered

Rejected options.

## Tradeoffs

Benefits and costs.

## Consequences

Expected impacts.

## Related Discoveries

Linked discoveries.

## Related Constraints

Linked constraints.

## Related Principles

Linked principles.

## Related Specifications

Linked specifications.

---

# Decision Lifecycle

Problem
↓
Discovery
↓
Proposal
↓
Decision
↓
Implementation
↓
Review

Not every proposal becomes a decision.

Not every decision survives forever.

---

# Decision States

## Proposed

Under evaluation.

## Accepted

Approved and active.

## Superseded

Replaced by a newer decision.

## Rejected

Considered but not adopted.

## Deprecated

No longer recommended.

---

# Relationship With Discoveries

Discoveries answer:

"What did we learn?"

Decisions answer:

"What did we choose?"

Relationship:

Discovery
↓
influences
↓
Decision

---

# Relationship With Specifications

Decision
↓
Specification

Specifications should be derived from decisions.

---

# Relationship With Harnesses

Decision
↓
Harness

Harnesses should inherit project decisions.

---

# Decision Quality Evaluation

A Decision Record is high quality when:

- context is preserved
- rationale is preserved
- alternatives are documented
- tradeoffs are explicit
- consequences are understood
- traceability exists

---

# Preservation Rules

Always preserve:

- rationale
- alternatives
- tradeoffs
- consequences
- related discoveries

---

# Decision Anti-Patterns

## Decision Without Rationale

Recording a choice without explanation.

## Missing Alternatives

Documenting only the chosen solution.

## Hidden Tradeoffs

Pretending a decision has no cost.

## Untraceable Decisions

Recording decisions without context.

## Forgotten Decisions

Leaving decisions trapped inside conversations.

---

# AI Responsibilities

AI systems using Specforge should:

- identify candidate decisions
- recommend Decision Record creation
- connect decisions to discoveries
- connect decisions to specifications
- preserve rationale
- preserve tradeoffs

Human validation is always required.

---

# Future Evolution

Future versions may introduce:

- automatic decision extraction
- decision impact analysis
- contradiction detection
- dependency mapping
- decision health scoring

---

# Decision Hierarchy

Vision
↓
Product DNA
↓
Principles
↓
Constraints
↓
Decisions
↓
Specifications

Lower levels must not contradict higher levels.

---

# Final Statement

Decisions are the mechanism through which knowledge becomes action.

Discoveries explain what was learned.

Decision Records explain what was chosen.

Specifications explain what must be built.

Harnesses explain how AI should behave.

Without Decision Records, projects lose their reasoning.

Specforge preserves that reasoning as a first-class asset.
