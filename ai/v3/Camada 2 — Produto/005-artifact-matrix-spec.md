# 005 - Artifact Matrix Specification

## Status

Draft

---

# Purpose

This document defines the official artifact generation matrix used by Progressive Specification.

The Artifact Matrix determines which artifacts are generated for each scope level:

- Story
- Feature
- Product

This specification acts as the primary governance mechanism preventing documentation bloat and ensuring compliance with the Right-Sized Process principle.

---

# Overview

One of the primary goals of Progressive Specification is to generate only the documentation that provides value for the selected scope.

Different scopes require different levels of rigor.

The platform must avoid:

- Under-documentation
- Over-documentation
- Unnecessary governance
- Missing implementation guidance

The Artifact Matrix defines the minimum and maximum artifact set permitted for each scope.

---

# Artifact Philosophy

## Principle

Artifacts exist to operationalize knowledge.

Artifacts are not goals.

Artifacts are outputs.

Knowledge remains the primary asset.

---

## Consequence

An artifact should only be generated if it contributes to:

- Understanding
- Decision making
- Implementation
- Governance
- Traceability

Otherwise it should not exist.

---

# Scope Levels

The matrix applies to:

- Story
- Feature
- Product

---

# Artifact Categories

Artifacts are organized into the following categories:

## Knowledge Artifacts

- Discoveries
- Decisions
- Context Packages

---

## Specification Artifacts

- Requirements
- Design
- Architecture
- Contracts
- Security
- Testing

---

## Execution Artifacts

- Tasks
- Harnesses

---

## Governance Artifacts

- Risk Analysis
- Migration Notes
- Traceability Records

---

# Official Artifact Matrix

| Artifact | Story | Feature | Product |
|-----------|-----------|-----------|-----------|
| Story Spec | Required | Optional | Optional |
| Feature Spec | Not Allowed | Required | Optional |
| Product Vision | Not Allowed | Not Allowed | Required |
| Discoveries | Optional | Optional | Required |
| Decisions | Optional | Required | Required |
| Context Packages | Not Allowed | Optional | Required |
| Requirements Spec | Required | Required | Required |
| Design Spec | Not Allowed | Required | Required |
| Architecture Spec | Not Allowed | Optional | Required |
| Contracts Spec | Not Allowed | Required | Required |
| Security Spec | Not Allowed | Optional | Required |
| Testing Spec | Basic | Standard | Comprehensive |
| Tasks | Required | Required | Required |
| Harness | Required | Required | Required |
| Risk Analysis | Not Allowed | Optional | Required |
| Migration Notes | Not Allowed | Optional | Optional |
| Traceability Records | Optional | Required | Required |

---

# Story Profile

## Goal

Minimize process overhead.

---

## Required Artifacts

Story Specification

Requirements

Tasks

Harness

Basic Testing Specification

---

## Optional Artifacts

Decisions

Discoveries

Traceability

---

## Forbidden Artifacts

Architecture

Security

Contracts

Product Vision

Context Packages

Risk Analysis

---

## Rationale

Stories should optimize for implementation speed.

Additional artifacts must only appear when explicitly justified.

---

# Feature Profile

## Goal

Provide implementation planning for meaningful capabilities.

---

## Required Artifacts

Feature Specification

Requirements

Design

Contracts

Tasks

Harness

Testing

Decisions

Traceability

---

## Optional Artifacts

Architecture

Security

Risk Analysis

Migration Notes

Discoveries

Context Packages

---

## Forbidden Artifacts

Product Vision

---

## Rationale

Features require more structure than stories but should remain focused on implementation rather than product discovery.

---

# Product Profile

## Goal

Provide complete engineering planning and governance.

---

## Required Artifacts

Product Vision

Discoveries

Decisions

Context Packages

Requirements

Design

Architecture

Contracts

Security

Testing

Tasks

Harness

Risk Analysis

Traceability

---

## Optional Artifacts

Migration Notes

Story Specifications

Feature Specifications

---

## Rationale

Products require comprehensive understanding, planning, and governance.

---

# Testing Specification Levels

## Story

Basic

Contains:

- Acceptance criteria
- Validation checklist
- Smoke testing guidance

---

## Feature

Standard

Contains:

- Acceptance criteria
- Integration testing
- Edge cases
- Validation strategy

---

## Product

Comprehensive

Contains:

- Functional testing
- Integration testing
- Security testing
- Performance testing
- Reliability testing
- Operational testing

---

# Harness Generation Rules

Harness generation is mandatory for all scopes.

Story Harness:

Focused on implementation execution.

---

Feature Harness:

Focused on implementation and integration.

---

Product Harness:

Focused on architecture, governance, and consistency.

---

# Artifact Dependency Rules

Certain artifacts require the existence of other artifacts.

---

## Design Requires

Requirements

---

## Architecture Requires

Requirements

Design

---

## Contracts Require

Requirements

---

## Security Requires

Requirements

Design

---

## Tasks Require

Requirements

---

## Harness Requires

Requirements

and

Tasks

at minimum.

---

# Conditional Artifact Generation

The platform may generate optional artifacts when justified.

Examples:

Feature → Security

when:

- Authentication involved
- Authorization involved
- Sensitive data involved

---

Feature → Architecture

when:

- Multiple services involved
- Major technical decisions required

---

Story → Decision

when:

- Tradeoffs exist
- Alternatives were evaluated

---

# Artifact Escalation

Artifacts may appear automatically during scope escalation.

Example:

Story
→ Feature

New artifacts introduced:

- Design
- Contracts
- Decisions
- Traceability

---

Feature
→ Product

New artifacts introduced:

- Vision
- Architecture
- Security
- Context Packages
- Risk Analysis

---

# Artifact Reduction

When scope decreases:

Unnecessary artifacts should not be generated.

Previously generated artifacts should remain preserved.

Knowledge must never be lost.

---

# Artifact Ownership

Each artifact belongs to a specific responsibility layer.

Requirements:

Defines what.

---

Design:

Defines behavior.

---

Architecture:

Defines structure.

---

Contracts:

Defines interfaces.

---

Security:

Defines protections.

---

Testing:

Defines validation.

---

Tasks:

Defines execution.

---

Harness:

Defines AI operational guidance.

---

# Governance Rules

The platform must validate:

1. Required artifacts exist.
2. Forbidden artifacts are absent.
3. Dependencies are satisfied.
4. Optional artifacts are justified.

---

# Success Criteria

The Artifact Matrix is successful when:

- Stories remain lightweight.
- Features remain focused.
- Products remain comprehensive.
- Documentation waste is minimized.
- Required governance is preserved.
- Generated outputs match user expectations.

---

# Closing Statement

The Artifact Matrix is the enforcement mechanism behind Progressive Specification.

It ensures that every scope receives the correct amount of structure, guidance, governance, and documentation.

By controlling which artifacts may exist at each scope level, the platform can maintain a balance between implementation speed and engineering rigor while preserving the Knowledge First philosophy of Specforge.
