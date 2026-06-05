# 009 - Pipeline Composition Rules Specification

## Status

Draft

---

# Purpose

This document defines the formal composition rules used by the Progressive Pipeline Engine.

While the Progressive Pipeline Specification defines the available pipelines, this document defines how pipelines are assembled, validated, executed, and evolved.

Its purpose is to transform pipeline definitions into deterministic execution behavior.

---

# Overview

The Progressive Pipeline Engine is composed of reusable stages.

A pipeline is not a hardcoded workflow.

A pipeline is a composition of stages assembled according to scope, artifact requirements, dependencies, and governance rules.

The composition engine determines:

- Which stages execute
- Which stages are skipped
- Execution order
- Validation requirements
- Dependency enforcement
- Escalation behavior

---

# Design Goals

The composition engine must:

- Be deterministic
- Be extensible
- Be scope-aware
- Be artifact-aware
- Prevent invalid execution paths
- Preserve Knowledge First

---

# Core Concepts

## Pipeline

A pipeline is a collection of ordered stages.

Example:

Intent
→ Clarification
→ Requirements
→ Tasks
→ Harness

---

## Stage

A stage is an executable unit within a pipeline.

Examples:

- Intent Capture
- Scope Resolution
- Clarification
- Knowledge Collection
- Requirements Generation
- Design Generation
- Task Generation

---

## Composition

Composition is the process of selecting and ordering stages.

---

## Profile

A profile defines a valid pipeline configuration.

Supported profiles:

- Story
- Feature
- Product

---

# Stage Registry

The engine maintains a registry of available stages.

---

## Mandatory Stages

These stages must always exist in the registry.

- Intent Capture
- Scope Resolution
- Clarification
- Requirements Generation
- Harness Generation
- Task Generation

---

## Optional Stages

These stages may be activated by profile rules.

- Knowledge Collection
- Design Generation
- Architecture Generation
- Contracts Generation
- Security Generation
- Testing Generation
- Risk Analysis
- Context Package Generation

---

# Composition Lifecycle

Pipeline assembly occurs in the following sequence.

---

## Step 1 — Intent Registration

Capture user intent.

Output:

Intent Object

---

## Step 2 — Scope Resolution

Determine scope profile.

Output:

Story
Feature
Product

---

## Step 3 — Profile Loading

Load profile definition.

Output:

Profile Configuration

---

## Step 4 — Artifact Resolution

Determine required artifacts.

Output:

Artifact Set

---

## Step 5 — Stage Selection

Determine which stages are necessary.

Output:

Stage List

---

## Step 6 — Dependency Validation

Validate stage requirements.

Output:

Validated Pipeline

---

## Step 7 — Execution Planning

Build execution graph.

Output:

Execution Plan

---

## Step 8 — Execution

Run stages.

---

# Composition Rules

## Rule 1 — Scope Governs Composition

Scope is the primary composition driver.

The selected scope determines:

- Required stages
- Optional stages
- Forbidden stages

---

## Rule 2 — Artifact Requirements Override Preferences

Artifacts determine stage activation.

Example:

Design Artifact Required

→ Design Stage Must Execute

---

## Rule 3 — Dependencies Are Mandatory

A stage cannot execute if dependencies are missing.

---

## Rule 4 — Forbidden Stages Must Not Execute

Example:

Story Profile

Forbidden:

Architecture Stage

---

## Rule 5 — Order Must Be Preserved

Execution order is not arbitrary.

Dependencies define ordering.

---

# Stage Dependency Rules

## Clarification

Requires:

Intent Capture

Scope Resolution

---

## Knowledge Collection

Requires:

Clarification

---

## Requirements Generation

Requires:

Clarification

---

## Design Generation

Requires:

Requirements

---

## Architecture Generation

Requires:

Requirements

Design

---

## Contracts Generation

Requires:

Requirements

---

## Security Generation

Requires:

Requirements

Design

---

## Testing Generation

Requires:

Requirements

---

## Harness Generation

Requires:

Requirements

---

## Task Generation

Requires:

Requirements

---

## Provider Output Generation

Requires:

Harness

Tasks

---

# Story Composition Rules

## Allowed Stages

Intent Capture

Scope Resolution

Clarification

Requirements

Harness

Tasks

Provider Outputs

---

## Forbidden Stages

Architecture

Security

Context Packages

Risk Analysis

---

## Optional Stages

Testing

Decisions

---

# Feature Composition Rules

## Allowed Stages

Intent Capture

Scope Resolution

Clarification

Knowledge Collection

Requirements

Design

Contracts

Harness

Tasks

Provider Outputs

---

## Optional Stages

Architecture

Security

Risk Analysis

Testing Extensions

---

## Forbidden Stages

Product Vision

---

# Product Composition Rules

## Allowed Stages

All registered stages.

---

## Restrictions

None.

---

# Dynamic Composition

The engine supports dynamic stage insertion.

---

## Example

Feature Pipeline

Security-sensitive feature detected.

Result:

Security Stage inserted.

---

## Example

Feature Pipeline

Complex integration detected.

Result:

Architecture Stage inserted.

---

# Conditional Stage Activation

Stages may activate when conditions are satisfied.

---

## Security Stage

Activate when:

- Authentication exists
- Authorization exists
- Sensitive data exists
- Regulatory requirements exist

---

## Architecture Stage

Activate when:

- Multiple services exist
- Significant technical decisions exist
- Distributed systems exist

---

## Risk Analysis Stage

Activate when:

- Business risk exists
- Operational risk exists
- Migration risk exists

---

# Escalation Rules

## Story → Feature

Additional stages inserted:

Knowledge Collection

Design

Contracts

---

## Feature → Product

Additional stages inserted:

Architecture

Security

Context Packages

Risk Analysis

Comprehensive Testing

---

# Reduction Rules

When scope decreases:

Unnecessary stages are removed.

Already generated knowledge remains preserved.

No knowledge loss is permitted.

---

# Validation Rules

Every composed pipeline must satisfy:

1. Scope validity
2. Artifact validity
3. Dependency validity
4. Ordering validity
5. Governance validity

---

# Invalid Pipeline Examples

Example 1:

Requirements
→ Tasks
→ Clarification

Invalid.

Clarification must occur first.

---

Example 2:

Architecture
without
Design

Invalid.

Architecture depends on Design.

---

Example 3:

Story
with
Architecture

Invalid.

Architecture forbidden.

---

# Execution Graph Model

Internally, the pipeline should be represented as a directed graph.

Nodes:

Stages

Edges:

Dependencies

This enables:

- Validation
- Dynamic insertion
- Future expansion
- Parallel execution opportunities

---

# Extensibility Rules

New stages may be introduced if:

- Dependencies are defined
- Scope compatibility is defined
- Artifacts are defined
- Governance rules are defined

---

# Future Compatibility

The composition engine must support future profiles such as:

- Task
- Epic
- Program
- Platform

without requiring architectural redesign.

---

# Success Criteria

The composition engine is successful when:

- Pipeline generation is deterministic.
- Invalid pipelines cannot execute.
- Scope rules remain enforced.
- Dependencies remain satisfied.
- Future stages can be added safely.
- Progressive Specification remains extensible.

---

# Architectural Relationship

Scope Model
↓
Artifact Matrix
↓
Pipeline Composition Rules
↓
Execution Plan
↓
Generation Engine

This document acts as the bridge between pipeline design and pipeline execution.

---

# Closing Statement

The Pipeline Composition Rules define how Progressive Specification becomes executable.

They ensure that pipeline construction remains predictable, valid, extensible, and aligned with the Knowledge First philosophy.

Without composition rules, pipelines are merely diagrams.

With composition rules, pipelines become deterministic engineering workflows.
