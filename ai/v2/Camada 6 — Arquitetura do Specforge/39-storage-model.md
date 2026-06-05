# Specforge V2 Storage Model

## Status

Accepted

## Purpose

This document defines the Storage Model for Specforge V2.

The Storage Model is responsible for defining how domain entities, knowledge artifacts, specifications, harnesses and generated assets are persisted, versioned and recovered.

Its purpose is to ensure durability, traceability, consistency and long-term preservation of project knowledge.

---

# Introduction

Knowledge is the primary asset of Specforge.

Storage is not merely persistence.

Storage is responsible for:

- preservation
- traceability
- versioning
- recovery
- auditability

The Storage Model must support decades of project evolution without losing critical information.

---

# Storage Principles

## Knowledge First

Knowledge artifacts are first-class citizens.

---

## Traceability Everywhere

Every stored artifact must be traceable.

---

## Immutable History

Historical states should remain recoverable.

---

## Version Everything

Critical artifacts should support versioning.

---

## Provider Independence

Storage should not depend on provider-specific formats.

---

# Storage Domains

The system stores:

- Projects
- Knowledge
- Discoveries
- Decisions
- Context Packages
- Clarifications
- Specifications
- Harnesses
- Tasks
- Provider Artifacts

---

# Project Storage

## Purpose

Represents the root storage boundary.

## Stored Data

- Project Metadata
- Settings
- Ownership Information
- Lifecycle Metadata

## Identity

Project ID

---

# Knowledge Storage

## Purpose

Stores durable project understanding.

## Stored Data

- Discoveries
- Decisions
- Context Packages
- Knowledge Metadata

Knowledge storage acts as the primary source of truth.

---

# Discovery Storage

## Stored Attributes

- Discovery ID
- Title
- Description
- Source
- Validation Status
- Tags
- Created At
- Updated At

## Requirements

Discoveries must remain traceable to their source.

---

# Decision Storage

## Stored Attributes

- Decision ID
- Title
- Rationale
- Alternatives Considered
- Constraints
- Status
- Version

## Requirements

Decision history must remain recoverable.

---

# Context Package Storage

## Stored Attributes

- Package ID
- Name
- Category
- Included Knowledge
- Version

## Requirements

Packages should support regeneration.

---

# Clarification Storage

## Stored Attributes

- Clarification ID
- Question
- Context
- Resolution
- Status
- Priority

## Requirements

Resolved clarifications must remain searchable.

---

# Specification Storage

## Purpose

Stores generated specifications.

## Supported Types

- Requirements
- Design
- Architecture
- Contracts
- Edge Cases
- Security
- Testing

## Stored Attributes

- Specification ID
- Type
- Version
- Status
- Source References
- Generated Content

---

# Harness Storage

## Purpose

Stores generated harnesses.

## Stored Attributes

- Harness ID
- Type
- Version
- References
- Generated Content

---

# Task Storage

## Purpose

Stores implementation plans.

## Stored Attributes

- Task ID
- Title
- Dependencies
- Acceptance Criteria
- Status
- References

---

# Provider Artifact Storage

## Purpose

Stores provider-specific outputs.

## Examples

- CLAUDE.md
- .cursor/rules
- GPT Instructions

## Stored Attributes

- Artifact ID
- Provider
- Version
- Source Harness
- Generated Content

---

# Versioning Model

The following entities must be versioned:

- Knowledge
- Decisions
- Specifications
- Harnesses
- Provider Artifacts

Versioning should support:

- historical recovery
- comparison
- rollback
- auditing

---

# Snapshot Model

Snapshots capture project state at a point in time.

A snapshot may include:

- knowledge state
- specification state
- harness state
- task state

Snapshots support recovery and reproducibility.

---

# Traceability Storage

Every artifact should store:

## Origin References

Where it came from.

## Dependency References

What it depends on.

## Generation References

How it was created.

## Version References

Historical lineage.

---

# Audit Model

The system should store:

- creation events
- update events
- deletion events
- generation events

Audit records should be immutable.

---

# Search Requirements

Stored artifacts should support:

- full-text search
- tag search
- relationship search
- traceability search

Knowledge retrieval is a core capability.

---

# Archival Model

Artifacts may transition to archival storage.

Examples:

- deprecated decisions
- obsolete specifications
- historical snapshots

Archived artifacts remain recoverable.

---

# Storage Relationships

Project
↓
Knowledge
↓
Specifications
↓
Harnesses
↓
Provider Artifacts

Tasks may reference all layers.

---

# Consistency Requirements

The storage model should guarantee:

## Referential Integrity

## Version Integrity

## Traceability Integrity

## Recovery Integrity

---

# Scalability Requirements

The storage model should support:

- millions of artifacts
- long-lived projects
- large knowledge bases
- extensive version histories

---

# Security Requirements

Stored data should support:

- encryption at rest
- encryption in transit
- access control
- auditability

Security applies across all storage domains.

---

# Recovery Requirements

Recovery should support:

- artifact restoration
- version restoration
- snapshot restoration
- project restoration

Recovery must preserve traceability.

---

# Validation Rules

The Storage Model should pass:

- Referential Integrity Validation
- Versioning Validation
- Traceability Validation
- Recovery Validation
- Audit Validation
- Scalability Validation

---

# Anti-Patterns

## Mutable History

Historical data overwritten.

---

## Orphan Records

Artifacts without references.

---

## Knowledge Loss

Critical knowledge not persisted.

---

## Traceability Gaps

Broken references.

---

## Provider Coupling

Storage tied to provider-specific formats.

---

# Relationship With Other Artifacts

System Architecture
↓
Domain Model
↓
Storage Model
↓
Generation Pipeline
↓
Implementation

The Storage Model defines how domain concepts are persisted.

---

# Future Evolution

Future versions may introduce:

- graph storage
- event sourcing
- distributed storage
- semantic indexing
- knowledge lineage visualization

---

# Long-Term Vision

The Storage Model should ensure that project knowledge remains durable, recoverable and explainable throughout the lifetime of a project.

Storage should preserve not only artifacts, but also the reasoning that created them.

---

# Final Statement

Knowledge has little value if it cannot be preserved.

The Storage Model ensures that discoveries, decisions, specifications and harnesses remain durable assets that survive time, tooling changes and organizational evolution.
