# 004 - User Workflows Specification

## Status

Draft

---

# Purpose

This document defines the official user workflows supported by Progressive Specification.

The purpose of these workflows is to describe how users interact with Specforge V3 from the moment an idea is introduced until implementation artifacts are generated.

Unlike pipeline specifications, which describe internal execution behavior, this document focuses on the user experience and journey through the platform.

---

# Overview

Progressive Specification introduces three primary workflows:

- Story Workflow
- Feature Workflow
- Product Workflow

Each workflow is optimized for a different level of engineering complexity.

All workflows share the same underlying philosophy:

Knowledge First

However, the amount of process, clarification, and generated artifacts varies according to scope.

---

# Workflow Principles

All workflows must follow the following principles.

---

## Principle 1 — Minimize Friction

Users should reach value as quickly as possible.

---

## Principle 2 — Progressive Complexity

Additional process should appear only when justified.

---

## Principle 3 — Scope Awareness

The workflow should adapt to the size of the problem.

---

## Principle 4 — Knowledge First

Understanding must precede generation.

---

## Principle 5 — Implementation Readiness

Every workflow should ultimately produce implementation-ready outputs.

---

# Universal Workflow

All user journeys begin with the same entry point.

---

## Step 1 — User Intent

The user describes what they want to create.

Examples:

"Add CSV export button."

"Implement Google authentication."

"Create a CRM platform."

---

## Step 2 — Scope Determination

The system determines:

- Story
- Feature
- Product

using:

- User selection
- Automatic classification
- Hybrid classification

---

## Step 3 — Clarification

The system collects the minimum information necessary.

Depth depends on scope.

---

## Step 4 — Generation

Artifacts are generated.

---

## Step 5 — Delivery

Outputs are presented to the user.

---

# Story Workflow

## Purpose

Optimize for speed.

---

## User Profile

Typically:

Developer

Engineer

Technical Lead

Product Engineer

---

## Example Requests

Add export button.

Add validation.

Fix bug.

Add search field.

---

## Workflow

User Intent
↓
Story Classification
↓
Lightweight Clarification
↓
Story Specification
↓
Tasks
↓
Harness
↓
Provider Outputs

---

## User Expectations

Fast generation.

Minimal questioning.

Immediate implementation guidance.

---

## Generated Outputs

Story Specification

Tasks

Harness

Provider Outputs

---

## Typical Duration

Minutes.

---

# Feature Workflow

## Purpose

Coordinate capability implementation.

---

## User Profile

Typically:

Engineer

Tech Lead

Product Engineer

Feature Owner

---

## Example Requests

Add Google Authentication.

Add Payment Integration.

Create Notification System.

Create Audit Logging.

---

## Workflow

User Intent
↓
Feature Classification
↓
Feature Clarification
↓
Requirements
↓
Design
↓
Contracts
↓
Feature Specification
↓
Tasks
↓
Harness
↓
Provider Outputs

---

## User Expectations

Moderate questioning.

Clear implementation plan.

Cross-component visibility.

---

## Generated Outputs

Feature Specification

Requirements

Design

Contracts

Tasks

Harness

Provider Outputs

---

## Typical Duration

Minutes to hours.

---

# Product Workflow

## Purpose

Enable full engineering planning.

---

## User Profile

Typically:

Founder

Architect

Product Manager

Engineering Manager

Technical Lead

---

## Example Requests

Build CRM.

Create Marketplace.

Create ERP.

Create SaaS Platform.

---

## Workflow

User Intent
↓
Product Classification
↓
Deep Clarification
↓
Knowledge Collection
↓
Discoveries
↓
Decisions
↓
Context Packages
↓
Specifications
↓
Harnesses
↓
Tasks
↓
Provider Outputs

---

## User Expectations

Deep discovery.

Knowledge preservation.

Long-term planning.

Governance.

---

## Generated Outputs

Knowledge Artifacts

Specifications

Harnesses

Tasks

Provider Outputs

---

## Typical Duration

Hours to days.

---

# Manual Scope Workflow

## Purpose

Allow explicit user selection.

---

## Flow

Select Scope
↓
Story

or

Feature

or

Product
↓
Workflow Begins

---

## Benefits

Predictable behavior.

User control.

Reduced classification errors.

---

# Automatic Scope Workflow

## Purpose

Reduce decision burden.

---

## Flow

User Intent
↓
Scope Classification
↓
Recommended Scope
↓
Workflow Begins

---

## Benefits

Minimal effort.

Faster onboarding.

---

# Hybrid Scope Workflow

## Purpose

Combine automation and user control.

---

## Flow

User Intent
↓
Scope Classification
↓
Suggested Scope
↓
User Confirmation
↓
Workflow Begins

---

## Benefits

High accuracy.

High transparency.

---

# Scope Escalation Workflow

Users may discover additional complexity during clarification.

---

## Example

Initial Request

Add Authentication

---

Clarification Reveals

OAuth

Role Management

Session Management

Security Requirements

---

Result

Story
↓
Feature

---

# Product Escalation Workflow

Example

Initial Request

Create User Management

---

Discovery Reveals

Multiple Domains

Architecture Requirements

Governance Needs

---

Result

Feature
↓
Product

---

# Scope Reduction Workflow

Example

Initial Request

Build Reporting System

---

Clarification Reveals

Single Report

Single Screen

Single Endpoint

---

Result

Feature
↓
Story

---

# Regeneration Workflow

Users may modify requirements after generation.

---

## Flow

Generated Outputs
↓
User Feedback
↓
Clarification Update
↓
Artifact Regeneration

---

## Goal

Preserve continuity.

Avoid restarting work.

---

# Existing Project Workflow

Users may work within an existing project.

---

## Flow

Project Context
↓
New Request
↓
Scope Determination
↓
Clarification
↓
Generation

---

## Benefits

Context reuse.

Reduced questioning.

Improved consistency.

---

# Multi-Iteration Workflow

Progressive Specification supports iterative refinement.

---

## Example

Story
↓
Feature
↓
Product

---

Knowledge should remain reusable throughout the journey.

---

# Workflow Success Criteria

A workflow is successful when:

- Users understand the process.
- Clarification feels appropriate.
- Outputs match scope.
- Documentation feels proportional.
- Implementation can begin quickly.

---

# Workflow Failure Conditions

The workflow has failed when:

- Scope selection is incorrect.
- Clarification is excessive.
- Artifacts exceed scope needs.
- Artifacts lack required detail.
- Users abandon the process.

---

# Relationship With Other Specifications

Scope Model
↓
Determines Workflow

Artifact Matrix
↓
Determines Outputs

Pipeline Specification
↓
Determines Execution

Clarification Engine
↓
Determines Understanding

User Workflows
↓
Define Experience

---

# Closing Statement

The User Workflows define how Progressive Specification is experienced by users.

While the underlying architecture remains knowledge-driven and scope-aware, workflows translate those internal mechanisms into practical engineering journeys.

By providing dedicated paths for Story, Feature, and Product initiatives, Specforge can adapt itself to the true scale of the problem while preserving simplicity, clarity, and implementation readiness.
