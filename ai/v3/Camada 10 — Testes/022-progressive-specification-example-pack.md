# 022 - Progressive Specification Example Pack

## Status

Draft

---

# Purpose

This document defines the official Example Pack for Progressive Specification.

The purpose of the Example Pack is to provide realistic examples demonstrating how Specforge V3 behaves across Story, Feature, and Product scopes.

Examples serve as:

- Documentation
- Training Material
- Validation Assets
- Acceptance Test References

The Example Pack acts as the practical companion to the architectural specifications.

---

# Overview

A specification describes rules.

Examples demonstrate behavior.

The Example Pack exists to answer:

"What should this actually look like?"

for each major workflow supported by Progressive Specification.

---

# Design Goals

Examples should:

- Be realistic.
- Be easy to understand.
- Cover all scopes.
- Demonstrate classification.
- Demonstrate clarification.
- Demonstrate artifact generation.
- Demonstrate escalation and reduction.

---

# Example Categories

The Example Pack contains:

1. Story Examples
2. Feature Examples
3. Product Examples
4. Escalation Examples
5. Reduction Examples
6. Existing Project Examples
7. Regeneration Examples

---

# Story Example 1

## User Request

Add CSV Export Button.

---

## Classification

Story

---

## Reason

Single UI action.

Single objective.

Localized impact.

---

## Clarification

Question:

Which data should be exported?

Answer:

Current search results.

---

## Generated Artifacts

Story Specification

Tasks

Harness

---

# Story Example 2

## User Request

Add validation to email field.

---

## Classification

Story

---

## Generated Artifacts

Story Specification

Tasks

Harness

---

# Story Example 3

## User Request

Fix duplicate order creation bug.

---

## Classification

Story

---

## Generated Artifacts

Story Specification

Tasks

Harness

---

# Feature Example 1

## User Request

Implement Google Authentication.

---

## Classification

Feature

---

## Reason

Authentication capability.

External integration.

Multiple workflows.

---

## Clarification

Questions:

Existing authentication method?

Account linking behavior?

Supported user roles?

---

## Generated Artifacts

Feature Specification

Requirements

Design

Contracts

Tasks

Harness

---

# Feature Example 2

## User Request

Create Notification Center.

---

## Classification

Feature

---

## Generated Artifacts

Feature Specification

Requirements

Design

Contracts

Tasks

Harness

---

# Feature Example 3

## User Request

Create Audit Logging System.

---

## Classification

Feature

---

## Generated Artifacts

Feature Specification

Requirements

Design

Contracts

Tasks

Harness

---

# Product Example 1

## User Request

Build CRM Platform.

---

## Classification

Product

---

## Clarification

Multiple discovery rounds.

---

## Generated Outputs

Knowledge Artifacts

Specifications

Harnesses

Tasks

---

# Product Example 2

## User Request

Create Marketplace Platform.

---

## Classification

Product

---

## Generated Outputs

Vision

Requirements

Architecture

Security

Testing

Harnesses

Tasks

---

# Product Example 3

## User Request

Create ERP System.

---

## Classification

Product

---

## Generated Outputs

Full Specforge V2 Process

---

# Escalation Example 1

## Initial Request

Add Authentication.

---

## Initial Classification

Story

---

## Clarification Reveals

OAuth

Role Management

Session Management

Security Requirements

---

## New Classification

Feature

---

## Reason

Capability creation and integration requirements detected.

---

# Escalation Example 2

## Initial Request

Create User Management.

---

## Initial Classification

Feature

---

## Discovery Reveals

Multiple domains

Architecture planning

Governance needs

---

## New Classification

Product

---

# Reduction Example 1

## Initial Request

Build Reporting Platform.

---

## Initial Classification

Product

---

## Clarification Reveals

Single report

Single endpoint

Single screen

---

## New Classification

Story

---

# Reduction Example 2

## Initial Request

Create Notification System.

---

## Initial Classification

Feature

---

## Clarification Reveals

Single email notification

Single trigger

---

## New Classification

Story

---

# Existing Project Example

## Project Context

CRM Platform

---

## Request

Add Export Button

---

## Classification

Story

---

## Reason

Classification applies to initiative.

Not project size.

---

# Knowledge Reuse Example

## Existing Context

Authentication Architecture Exists

---

## Request

Add Microsoft Authentication

---

## Behavior

Reuse existing architecture.

Reduce clarification.

Generate Feature artifacts.

---

# Regeneration Example

## Existing Artifacts

Requirements

Tasks

Harness

---

## Change Request

Add custom export columns.

---

## Expected Behavior

Requirements updated.

Tasks regenerated.

Harness updated.

Traceability preserved.

---

# Story Output Example

## Inputs

Add Export Button

---

## Outputs

Story Specification

Tasks

Harness

---

## Not Generated

Architecture

Security

Product Vision

---

# Feature Output Example

## Inputs

Implement OAuth Authentication

---

## Outputs

Feature Specification

Requirements

Design

Contracts

Tasks

Harness

---

## Optional

Security

Architecture

---

# Product Output Example

## Inputs

Build CRM

---

## Outputs

Knowledge

Requirements

Design

Architecture

Security

Testing

Harnesses

Tasks

---

# Clarification Example

## Story

Questions Asked:

2

---

## Feature

Questions Asked:

6

---

## Product

Questions Asked:

18

---

This demonstrates Progressive Clarification.

---

# Harness Example

## Story Harness

Focus:

Implementation

---

## Feature Harness

Focus:

Integration

---

## Product Harness

Focus:

Governance

---

# Classification Accuracy Examples

Correct Classification:

Add Button
→ Story

---

Google Authentication
→ Feature

---

CRM Platform
→ Product

---

# Validation Examples

## Story Validation

Required:

Requirements

Tasks

Harness

---

Forbidden:

Architecture

---

# Feature Validation

Required:

Design

Contracts

---

# Product Validation

Required:

Knowledge

Architecture

Security

Testing

---

# Acceptance Test Pack

The examples in this document should be used as reference acceptance tests for:

- Classification Engine
- Clarification Engine
- Artifact Generation
- Harness Generation
- Scope Escalation
- Scope Reduction

---

# Success Criteria

The Example Pack is successful when:

- Users understand scope differences.
- Developers understand expected behavior.
- Acceptance testing becomes easier.
- Documentation becomes easier to consume.

---

# Relationship With Other Specifications

The Example Pack demonstrates the behavior defined by:

001–021

through realistic scenarios.

---

# Closing Statement

The Example Pack exists to transform abstract specifications into observable behavior.

While architecture documents define how Progressive Specification works, examples demonstrate how it should behave in practice.

Together, the specifications and examples provide a complete understanding of Specforge V3 from both a design and execution perspective.
