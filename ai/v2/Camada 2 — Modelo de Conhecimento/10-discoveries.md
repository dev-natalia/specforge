# Specforge V2 Discoveries

## Status

Accepted

## Purpose

This document defines the Discovery model used by Specforge.

Discoveries represent learnings acquired during the lifecycle of a project.

They are one of the foundational knowledge objects within the Knowledge First Architecture.

The purpose of Discoveries is to preserve knowledge gained through research, experimentation, conversations, observations and feedback.

Without Discoveries, projects tend to preserve decisions while losing the insights that originally motivated those decisions.

---

# Introduction

Most projects capture decisions.

Few projects capture discoveries.

Teams remember:

"What was decided?"

but forget:

"What was learned?"

Specforge treats discoveries as first-class knowledge objects.

A Discovery is often the origin of future decisions.

---

# Definition

## Discovery

A Discovery is a durable learning that influences understanding of a project.

A Discovery answers:

"What did we learn?"

A Discovery is not a decision.

A Discovery is not a requirement.

A Discovery is not a task.

A Discovery is an insight.

---

# Core Hypothesis

Most important decisions originate from discoveries.

Discovery
↓
Decision
↓
Specification
↓
Implementation

If discoveries are lost, future developers lose access to the original learning process.

---

# Why Discoveries Matter

Projects accumulate knowledge through:

- conversations
- experiments
- prototypes
- user feedback
- technical investigations
- production incidents

Only the final decision often survives.

This creates knowledge decay.

---

# Discovery Characteristics

To qualify as a Discovery, information should be:

- Insightful
- Durable
- Actionable
- Traceable
- Contextual

---

# Discovery Categories

## User Discovery

Knowledge learned about users.

Examples:

- Users ignore advanced settings.
- Users struggle with onboarding.
- Users prefer examples over documentation.

## Product Discovery

Knowledge learned about the product.

Examples:

- Users understand Specifications but not ADRs.
- Product DNA explanations improve onboarding quality.

## Technical Discovery

Knowledge learned about technology.

Examples:

- FastAPI improves development speed.
- Local file storage is sufficient for MVP.

## Architecture Discovery

Knowledge learned about system design.

Examples:

- Event sourcing adds unnecessary complexity.
- Monolithic architecture is sufficient.

## Business Discovery

Knowledge learned about business constraints.

Examples:

- BYOK significantly reduces operating costs.
- Free Forever aligns with project goals.

## Process Discovery

Knowledge learned about workflows.

Examples:

- Clarification improves specification quality.
- Structured context reduces AI inconsistency.

---

# Discovery Structure

Every Discovery should contain:

## Discovery ID

Example:

DISC-001

## Title

Short description.

## Category

- User
- Product
- Technical
- Architecture
- Business
- Process

## Description

What was learned.

## Source

Examples:

- Interview
- Conversation
- Experiment
- Prototype
- User Feedback
- Research

## Evidence

Supporting information.

## Implications

Why this discovery matters.

## Confidence Level

- Low
- Medium
- High

## Related Decisions

Links to influenced decisions.

---

# Discovery Lifecycle

Observation
↓
Discovery
↓
Validation
↓
Decision Influence
↓
Knowledge

Not every observation becomes a Discovery.

Not every Discovery becomes a Decision.

---

# Discovery Sources

- Conversations
- Clarification Sessions
- Experiments
- User Feedback
- Production Usage
- Research

---

# Discovery Validation

## Low Confidence

Early observation.

## Medium Confidence

Multiple observations.

## High Confidence

Strong evidence.

Repeated validation.

---

# Discovery Relationships

Discovery
↓
Decision

Discovery
↓
Assumption Validation

Discovery
↓
Risk Identification

Discovery
↓
Specification Updates

---

# Discovery Preservation Rules

Always preserve:

- source
- evidence
- implications
- confidence
- related decisions

---

# Discovery Anti-Patterns

## Insight Without Evidence

Recording conclusions without support.

## Decision Disguised as Discovery

Mixing learning and decision making.

## Lost Discoveries

Leaving learnings trapped in conversations.

## Untraceable Discoveries

Recording discoveries without sources.

---

# Discovery Quality Evaluation

A Discovery is high quality when:

- it provides meaningful insight
- it includes evidence
- it has clear implications
- it is traceable
- it influences future understanding

---

# AI Responsibilities

AI systems using Specforge should:

- identify potential discoveries
- suggest discovery creation
- connect discoveries to decisions
- preserve discovery context
- avoid converting discoveries directly into decisions

The user remains responsible for validating discoveries.

---

# Future Evolution

Future versions may introduce:

- automatic discovery extraction
- discovery clustering
- duplicate detection
- discovery confidence scoring
- discovery relationship mapping

---

# Final Statement

Discoveries are the origin of learning.

Learning shapes decisions.

Decisions shape specifications.

Specifications shape implementations.

Without preserved discoveries, projects remember what was decided but forget what was learned.

Specforge preserves both.
