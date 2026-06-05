# Specforge V2 Domain Model

## Status

Accepted

## Purpose

This document defines the Domain Model for Specforge V2.

The Domain Model is responsible for describing the core business entities, aggregates, relationships and ownership boundaries that compose the Specforge platform.

Its purpose is to establish a shared understanding of the business domain independently of implementation details.

---

# Introduction

Specforge is fundamentally a knowledge system.

Everything in the platform revolves around transforming raw information into structured engineering assets.

Examples:

- knowledge
- specifications
- harnesses
- tasks
- provider artifacts

The Domain Model defines how these concepts relate to one another.

---

# Core Domain Hypothesis

Knowledge is the root entity of the system.

Relationship:

Project
↓
Knowledge
↓
Specifications
↓
Harnesses
↓
Tasks
↓
Provider Outputs

Every major artifact originates from knowledge.

---

# Domain Overview

Primary aggregates:

- Project
- Knowledge
- Specification
- Harness
- Task
- Provider Artifact

Supporting entities:

- Discovery
- Decision
- Context Package
- Clarification
- Quality Gate
- Provider Profile

---

# Project Aggregate

## Purpose

Represents the highest-level organizational boundary.

## Responsibilities

Owns:

- knowledge
- specifications
- harnesses
- tasks
- settings

## Identity

Project ID

## Relationships

Project
├── Knowledge
├── Specifications
├── Harnesses
├── Tasks
└── Provider Configurations

---

# Knowledge Aggregate

## Purpose

Represents preserved project understanding.

## Responsibilities

Owns:

- discoveries
- decisions
- context packages

Knowledge is the primary source of truth.

---

# Discovery Entity

## Purpose

Represents a validated learning.

## Examples

- user preference
- technical finding
- business insight

## Attributes

- Discovery ID
- Title
- Description
- Source
- Status
- Created At

---

# Decision Entity

## Purpose

Represents an approved outcome.

## Examples

- architecture decision
- product decision
- process decision

## Attributes

- Decision ID
- Title
- Rationale
- Alternatives Considered
- Status
- Version

---

# Context Package Entity

## Purpose

Represents reusable operational knowledge.

## Examples

- architecture package
- onboarding package
- security package

## Attributes

- Package ID
- Name
- Category
- Contents
- Version

---

# Clarification Aggregate

## Purpose

Represents unresolved uncertainty.

## Responsibilities

Owns:

- questions
- resolutions
- priority metadata

## Lifecycle

Open
↓
Answered
↓
Knowledge Update
↓
Closed

---

# Specification Aggregate

## Purpose

Represents formalized engineering intent.

## Supported Types

- Requirements
- Design
- Architecture
- Contracts
- Edge Cases
- Security
- Testing

## Attributes

- Specification ID
- Type
- Version
- Status
- References

---

# Harness Aggregate

## Purpose

Represents operational AI guidance.

## Responsibilities

Owns:

- execution rules
- validation rules
- context references

## Relationships

Harness
├── Agent Rules
├── Context References
├── Specifications
└── Provider Adapters

---

# Task Aggregate

## Purpose

Represents executable implementation work.

## Responsibilities

Owns:

- task graph
- dependencies
- acceptance criteria

## Relationships

Task
├── Specifications
├── Decisions
├── Testing Requirements
└── Security Requirements

---

# Quality Gate Entity

## Purpose

Represents validation requirements.

## Examples

- specification quality
- security quality
- testing quality
- traceability quality

## Attributes

- Gate ID
- Category
- Validation Rules
- Severity

---

# Provider Profile Aggregate

## Purpose

Represents provider capabilities.

## Examples

- Claude
- GPT
- Gemini
- Cursor

## Attributes

- Provider ID
- Name
- Capabilities
- Constraints
- Supported Outputs

---

# Provider Artifact Entity

## Purpose

Represents provider-specific outputs.

## Examples

- CLAUDE.md
- .cursor/rules
- GPT Instructions

## Relationships

Provider Artifact
↓
Generated From
↓
Harness

---

# Domain Relationships

Project
↓
Knowledge
├── Discoveries
├── Decisions
└── Context Packages

Knowledge
↓
Specifications

Specifications
↓
Harnesses

Specifications
↓
Tasks

Harnesses
↓
Provider Artifacts

---

# Ownership Rules

## Project Owns Knowledge

Knowledge cannot exist outside a project.

## Knowledge Owns Discoveries

Discoveries belong to knowledge.

## Knowledge Owns Decisions

Decisions belong to knowledge.

## Specifications Depend On Knowledge

Specifications are derived artifacts.

## Harnesses Depend On Specifications

Harnesses consume specifications.

## Provider Artifacts Depend On Harnesses

Provider outputs are generated artifacts.

---

# Aggregate Boundaries

The following aggregates should remain independent:

- Project
- Knowledge
- Specification
- Harness
- Task
- Provider Profile

Cross-aggregate communication should occur through references.

---

# Invariants

The following rules must always be true.

## Every Project Has Knowledge

## Every Specification References Knowledge

## Every Harness References Specifications

## Every Task References Specifications

## Every Provider Artifact References A Harness

## Every Decision Has Rationale

---

# Traceability Model

Every artifact should support:

- origin tracking
- dependency tracking
- generation tracking
- version tracking

Traceability is a domain concern.

---

# Versioning Model

The following entities are versioned:

- Knowledge
- Decisions
- Specifications
- Harnesses
- Provider Artifacts

Version history should remain recoverable.

---

# Validation Rules

The Domain Model should pass:

- Aggregate Boundary Validation
- Ownership Validation
- Relationship Validation
- Traceability Validation
- Versioning Validation

---

# Anti-Patterns

## Multiple Sources Of Truth

Knowledge duplicated across entities.

## Orphan Artifacts

Artifacts without references.

## Circular Ownership

Aggregates owning each other.

## Hidden Relationships

Relationships not represented in the model.

---

# Relationship With Other Artifacts

Vision
↓
Knowledge Model
↓
System Architecture
↓
Domain Model
↓
Storage Model
↓
Implementation

The Domain Model defines the business structure of Specforge.

---

# Future Evolution

Future versions may introduce:

- Knowledge Graphs
- Multi-Project Relationships
- Shared Context Libraries
- Artifact Marketplaces
- Agent Collaboration Models

---

# Long-Term Vision

The Domain Model should remain stable even as implementation technologies change.

Business concepts should outlive frameworks, databases and providers.

---

# Final Statement

The Domain Model defines the language of Specforge.

It establishes the entities, relationships and ownership rules that allow knowledge to evolve into specifications, harnesses and executable engineering assets.
