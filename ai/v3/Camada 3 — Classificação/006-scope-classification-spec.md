# 006 - Scope Classification Specification

## Status

Draft

---

# Purpose

This document defines the Scope Classification Engine used by Progressive Specification.

The Scope Classification Engine is responsible for determining whether a user request should be processed as:

- Story
- Feature
- Product

The accuracy of scope classification directly affects clarification depth, artifact generation, harness generation, governance level, and overall user experience.

This specification defines the rules, signals, heuristics, confidence models, escalation paths, and validation mechanisms used to perform classification.

---

# Overview

Progressive Specification is built around the idea that different engineering problems require different processes.

Before the system can select an appropriate workflow, it must first understand the size and nature of the problem.

The Scope Classification Engine exists to make that determination.

---

# Core Principle

Classify the problem being solved.

Not the amount of text provided.

---

## Example

Input:

"Create a CRM platform."

Very short description.

Classification:

Product

---

Input:

"Add a button that exports data."

Also short.

Classification:

Story

---

Classification should depend on scope, not description length.

---

# Classification Objectives

The engine must:

- Determine the appropriate scope.
- Minimize misclassification.
- Avoid unnecessary process.
- Preserve implementation quality.
- Support future scope escalation.
- Support future scope reduction.

---

# Supported Scopes

The engine officially supports:

- Story
- Feature
- Product

No other classifications are valid in V3.

---

# Classification Workflow

The classification process follows the sequence below.

User Intent
↓
Intent Analysis
↓
Signal Extraction
↓
Scope Scoring
↓
Confidence Calculation
↓
Classification
↓
Validation

---

# Intent Analysis

The engine begins by understanding the user request.

Examples:

Add button.

Add OAuth.

Build CRM.

---

The objective is to identify:

- Desired outcome
- Scope indicators
- Complexity indicators
- Risk indicators

---

# Signal Extraction

The engine extracts classification signals.

Signals are grouped into categories.

---

## Scope Signals

Indicators of problem size.

---

Examples

Single screen

Single endpoint

Single workflow

Single component

---

Strong Story indicators.

---

Examples

Multiple workflows

Multiple integrations

Multiple components

---

Strong Feature indicators.

---

Examples

Platform

System

Product

Marketplace

CRM

ERP

---

Strong Product indicators.

---

# Complexity Signals

Indicators of implementation complexity.

---

Low Complexity

UI changes

Small bug fixes

Simple validations

---

Medium Complexity

Authentication

Integrations

Reporting

Notifications

---

High Complexity

Architecture

Distributed systems

Multi-domain systems

Platform creation

---

# Risk Signals

Indicators of implementation risk.

---

Low Risk

UI improvements

Content changes

Minor enhancements

---

Medium Risk

Business logic

External integrations

User management

---

High Risk

Security

Payments

Compliance

Infrastructure

---

# Scope Scoring Model

The engine assigns scores to each scope.

---

## Story Score

Based on:

Localized impact

Limited complexity

Low governance

Minimal integrations

---

## Feature Score

Based on:

Cross-component impact

Capability delivery

Design requirements

Integration requirements

---

## Product Score

Based on:

System creation

Architecture

Governance

Knowledge discovery

Strategic planning

---

# Story Indicators

The following signals strongly suggest Story scope.

---

Examples

Add button

Add field

Add validation

Fix bug

Improve loading state

Add filter

Add endpoint parameter

Refactor method

---

Characteristics

Single implementation objective

Localized impact

Minimal discovery

---

# Feature Indicators

The following signals strongly suggest Feature scope.

---

Examples

OAuth

Notifications

Reporting

Audit logging

Payment integration

Search system

Preference management

Role management

---

Characteristics

Capability creation

Multiple components

Integration concerns

Design considerations

---

# Product Indicators

The following signals strongly suggest Product scope.

---

Examples

Build CRM

Create ERP

Build marketplace

Create SaaS platform

Design banking platform

Create developer portal

---

Characteristics

System creation

Knowledge discovery

Architecture planning

Governance needs

---

# Confidence Model

Classification produces a confidence score.

---

## Low Confidence

Below 60%

---

Behavior

Additional clarification required.

---

## Medium Confidence

60% to 79%

---

Behavior

Classification suggested.

Confirmation recommended.

---

## High Confidence

80% to 89%

---

Behavior

Classification likely correct.

---

## Very High Confidence

90%+

---

Behavior

Classification may proceed automatically.

---

# Classification Decision Rules

Highest scoring scope wins.

Provided confidence exceeds minimum threshold.

---

If confidence is insufficient:

Classification remains provisional.

Additional clarification required.

---

# Ambiguous Requests

Some requests may fit multiple scopes.

---

Example

Create reporting.

---

Possible interpretations

Single report

→ Story

Reporting module

→ Feature

Analytics platform

→ Product

---

Result

Clarification required.

---

# Classification Questions

When ambiguity exists, the engine should ask questions focused on scope.

---

Examples

Is this a single change or a new capability?

Does this affect multiple systems?

Is this part of an existing product?

Are you building a complete system?

---

# Escalation Detection

The engine should detect when scope grows.

---

Story Escalation Signals

Multiple components emerge.

Integration requirements appear.

Design decisions become significant.

---

Result

Story
→ Feature

---

Feature Escalation Signals

Architecture required.

Multiple domains emerge.

Knowledge discovery expands.

Strategic planning appears.

---

Result

Feature
→ Product

---

# Reduction Detection

The engine should also detect scope reduction.

---

Example

Initial request:

Build reporting platform.

---

Clarification reveals:

Single report.

Single endpoint.

Single page.

---

Result

Product
→ Story

---

# Existing Project Classification

Existing project context should influence classification.

---

Example

Existing CRM.

Request:

Add export button.

---

Classification:

Story

Not Product.

---

The engine should classify the initiative itself.

Not the surrounding project.

---

# Classification Constraints

The engine must not:

- Classify based on description length.
- Classify based on user role.
- Classify based on implementation effort alone.
- Classify based solely on keyword matching.

---

Classification must consider context.

---

# Classification Heuristics

The following heuristics should guide decisions.

---

If solving a localized problem

→ Story

---

If creating a capability

→ Feature

---

If creating or evolving a system

→ Product

---

# User Override

Users may override classification.

---

Example

System suggests:

Feature

User selects:

Story

---

Result

Story workflow executes.

---

Overrides should be preserved.

---

# Hybrid Classification

Recommended default behavior.

---

Workflow

User Intent
↓
Automatic Classification
↓
Suggested Scope
↓
User Confirmation

---

Benefits

Accuracy

Transparency

User Control

---

# Classification Validation

The engine should validate classification against:

Artifact Matrix

Pipeline Rules

Clarification Depth Rules

---

If contradictions appear:

Classification should be reevaluated.

---

# Classification Success Metrics

The engine is successful when:

- Scope matches user expectations.
- Clarification depth feels appropriate.
- Artifact volume feels appropriate.
- Escalation frequency remains reasonable.
- Reduction frequency remains reasonable.

---

# Failure Conditions

The engine has failed when:

- Stories become Products.
- Products become Stories.
- Excessive clarification occurs.
- Necessary governance is skipped.
- Documentation becomes disproportionate.

---

# Architectural Relationship

User Intent
↓
Scope Classification
↓
Scope Model
↓
Artifact Matrix
↓
Pipeline Selection
↓
Generation

The Scope Classification Engine acts as the entry point into Progressive Specification.

---

# Closing Statement

The Scope Classification Engine is responsible for one of the most important decisions within Specforge V3.

Every downstream behavior depends on selecting the correct scope.

By evaluating intent, complexity, risk, and context, the engine enables Progressive Specification to apply the right amount of process to every engineering initiative while preserving efficiency, clarity, and the Knowledge First philosophy.
