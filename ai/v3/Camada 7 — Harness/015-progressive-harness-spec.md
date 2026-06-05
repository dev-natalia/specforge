# 015 - Progressive Harness Specification

## Status

Draft

---

# Purpose

This document defines how Harness Engineering operates within Progressive Specification.

The purpose of the Progressive Harness Model is to adapt AI operational guidance to the scope of the initiative while preserving the core Harness Engineering philosophy introduced in Specforge V2.

Harnesses should remain scope-aware, artifact-aware, and knowledge-driven.

The amount of guidance should scale with complexity.

---

# Overview

Specforge V2 introduced the concept of Harness Engineering.

A Harness is operationalized engineering knowledge designed to guide AI systems during implementation.

Harnesses consume:

- Knowledge
- Specifications
- Decisions
- Rules
- Constraints
- Context

and transform them into execution guidance.

Progressive Specification preserves this model.

The difference introduced by V3 is that Harnesses adapt to scope.

---

# Core Principle

Harnesses are derived artifacts.

Harnesses never become the source of truth.

Specifications remain authoritative.

Knowledge remains primary.

---

# Harness Philosophy

The purpose of a Harness is not to describe a system.

The purpose of a Harness is to guide implementation.

A Harness should answer:

- What should be built?
- What constraints exist?
- What rules must be respected?
- How should AI behave?
- How should implementation decisions be made?

---

# Progressive Harness Model

Harness generation varies according to scope.

Story
→ Lightweight Guidance

Feature
→ Implementation Guidance

Product
→ Governance Guidance

---

# Scope Comparison

## Story

Goal:

Accelerate implementation.

---

## Feature

Goal:

Coordinate implementation.

---

## Product

Goal:

Govern implementation.

---

# Story Harness

## Purpose

Provide focused implementation guidance.

---

## Inputs

Story Specification

Requirements

Acceptance Criteria

Tasks

---

## Outputs

CLAUDE.md

Cursor Rules

Provider Instructions

---

## Characteristics

Small

Focused

Task-Oriented

Low Governance

---

## Content Areas

Objective

Requirements

Acceptance Criteria

Implementation Constraints

Task Context

---

## Excluded Areas

Architecture

Security Governance

Product Strategy

Long-Term Planning

---

## Example

Add CSV Export Button

Harness should focus exclusively on:

- CSV generation
- Acceptance criteria
- Task execution

---

# Feature Harness

## Purpose

Coordinate implementation across multiple components.

---

## Inputs

Feature Specification

Requirements

Design Decisions

Contracts

Tasks

---

## Outputs

CLAUDE.md

Cursor Rules

Provider Instructions

---

## Characteristics

Moderate Size

Integration-Aware

Design-Aware

Cross-Component Guidance

---

## Content Areas

Feature Objective

Requirements

Design Considerations

Contracts

Integration Rules

Acceptance Criteria

Task Context

---

## Optional Areas

Architecture Notes

Security Notes

Risk Notes

---

## Example

Google Authentication

Harness should guide:

- OAuth implementation
- Account linking rules
- Contract behavior
- Integration behavior

---

# Product Harness

## Purpose

Operationalize engineering governance.

---

## Inputs

Knowledge Model

Discoveries

Decisions

Context Packages

Specifications

Tasks

---

## Outputs

CLAUDE.md

Cursor Rules

Agent Rules

Provider Outputs

---

## Characteristics

Comprehensive

Knowledge-Aware

Architecture-Aware

Governance-Oriented

---

## Content Areas

Knowledge Context

Architectural Principles

Requirements

Design Rules

Security Rules

Testing Expectations

Operational Rules

Governance Rules

Task Context

---

## Example

CRM Platform

Harness should guide:

- Architectural consistency
- Security compliance
- Engineering standards
- Task execution

---

# Harness Composition Model

Harnesses are assembled from modules.

---

## Core Modules

Objective Module

Requirements Module

Task Module

---

## Extended Modules

Design Module

Contracts Module

Architecture Module

Security Module

Testing Module

Governance Module

---

# Module Activation Rules

## Story

Activate:

Objective

Requirements

Tasks

---

## Feature

Activate:

Objective

Requirements

Design

Contracts

Tasks

---

## Product

Activate:

All modules

---

# Harness Generation Workflow

Specifications
↓
Harness Composition
↓
Provider Adaptation
↓
Provider Artifact

---

# Provider Independence

Harnesses should remain provider-agnostic.

The Harness Model should not depend on:

- Claude
- GPT
- Gemini
- Cursor

Provider-specific adaptations occur later.

---

# Provider Outputs

The same Harness should support:

CLAUDE.md

Cursor Rules

GPT Instructions

Gemini Instructions

Future Providers

---

# Context Compression

Harnesses must apply Context Compression principles.

---

## Goal

Maximize signal density.

Minimize token waste.

---

## Requirements

Remove duplication.

Remove redundant explanations.

Preserve essential knowledge.

---

# Knowledge Preservation Rules

Harness generation must preserve:

Discoveries

Decisions

Constraints

Requirements

Architectural rationale

when available.

---

# Traceability Rules

Harness content should reference:

Requirements

Decisions

Tasks

Specifications

when possible.

---

# Harness Quality Rules

A Harness should:

- Be actionable.
- Be concise.
- Be implementation-oriented.
- Be traceable.
- Be context-aware.

---

# Harness Anti-Patterns

The engine should avoid:

---

## Documentation Dumps

Copying entire specifications.

---

## Context Inflation

Including unnecessary information.

---

## Hidden Decisions

Omitting important decisions.

---

## Scope Leakage

Including Product guidance inside Story Harnesses.

---

# Harness Escalation

Story
→ Feature

Additional modules introduced:

Design

Contracts

Integration Guidance

---

Feature
→ Product

Additional modules introduced:

Architecture

Security

Governance

Knowledge Context

---

# Harness Reduction

When scope decreases:

Unnecessary modules removed.

Knowledge remains preserved.

---

# Agent Behavior Rules

Harnesses may define:

Expected Behaviors

Quality Expectations

Implementation Standards

Validation Expectations

---

# Harness Validation

The system should validate:

1. Required modules exist.
2. Forbidden modules absent.
3. Traceability preserved.
4. Scope compatibility maintained.
5. Context compression applied.

---

# Success Metrics

The Progressive Harness Model is successful when:

- AI implementation quality improves.
- Context size decreases.
- Guidance relevance increases.
- Scope-appropriate outputs are produced.
- Provider portability remains intact.

---

# Relationship With V2

V2 introduced:

Harness Engineering.

V3 introduces:

Progressive Harness Engineering.

The underlying philosophy remains unchanged.

Only the amount of guidance adapts to scope.

---

# Architectural Relationship

Knowledge
↓
Specifications
↓
Progressive Harness Composition
↓
Provider Adapters
↓
Provider Outputs

The Progressive Harness Model acts as the bridge between engineering knowledge and AI execution.

---

# Closing Statement

Harnesses are one of the most important operational artifacts within Specforge.

They transform engineering understanding into implementation guidance.

Progressive Harness Engineering extends this concept by ensuring that the amount of guidance produced matches the size of the problem being solved.

Small initiatives receive focused guidance.

Large initiatives receive governance-aware guidance.

In every case, the Harness remains a derived artifact whose purpose is to operationalize knowledge and accelerate successful implementation.
