# 007 - Scope Selection Experience Specification

## Status

Draft

---

# Purpose

This document defines the user experience for scope selection within Progressive Specification.

The purpose of the Scope Selection Experience is to ensure that users can easily choose, understand, validate, and adjust the scope of their initiative before generation begins.

This specification focuses on user interaction.

It does not define classification logic.

Classification logic is defined by the Scope Classification Specification.

---

# Overview

Progressive Specification introduces three scope levels:

- Story
- Feature
- Product

The Scope Selection Experience defines how users interact with these levels.

The experience must balance:

- Simplicity
- Accuracy
- Transparency
- User Control

---

# Core Principle

Users should understand why a scope was selected.

---

A scope decision should never feel mysterious.

Users should always know:

- Which scope is active
- Why it was selected
- How to change it

---

# Design Goals

The Scope Selection Experience must:

- Be easy to understand.
- Require minimal effort.
- Support automatic classification.
- Support manual selection.
- Support user overrides.
- Explain recommendations.
- Minimize onboarding friction.

---

# Supported Modes

The system supports three scope selection modes.

---

## Manual Mode

User selects scope directly.

---

## Automatic Mode

System selects scope automatically.

---

## Hybrid Mode

System recommends scope.

User confirms or changes it.

---

# Recommended Default

Hybrid Mode

---

## Rationale

Provides:

- Automation
- Transparency
- User control

while minimizing classification mistakes.

---

# Scope Introduction Experience

Users should be introduced to scope using simple language.

Avoid technical terminology.

---

Recommended descriptions:

---

## Story

Small implementation task.

Examples:

- Add button
- Fix bug
- Add validation

---

## Feature

New capability for an existing system.

Examples:

- Authentication
- Notifications
- Reporting

---

## Product

Complete system or major initiative.

Examples:

- CRM
- Marketplace
- ERP

---

# Entry Experience

The experience begins with a single input.

Example:

"What would you like to build?"

---

User enters:

Add Google Authentication.

---

Classification occurs.

---

# Automatic Classification Experience

Workflow:

User Input
↓
Classification
↓
Scope Assigned
↓
Generation Begins

---

## Advantages

Fastest workflow.

---

## Disadvantages

Less transparency.

Potential classification surprises.

---

# Manual Selection Experience

Workflow:

Select Scope
↓
Provide Request
↓
Generation Begins

---

## Advantages

Maximum control.

Predictable behavior.

---

## Disadvantages

Requires user knowledge.

May increase decision fatigue.

---

# Hybrid Selection Experience

Workflow:

User Input
↓
Classification
↓
Recommended Scope
↓
User Confirmation
↓
Generation Begins

---

## Advantages

High confidence.

High transparency.

User control.

---

## Recommended Message

Recommended Scope:

Feature

Reason:

Request appears to create a new capability involving authentication and external integrations.

---

# Scope Recommendation UI

The recommendation should include:

Selected Scope

Confidence

Explanation

Override Option

---

## Example

Recommended Scope:

Feature

Confidence:

88%

Reason:

Multiple components and integration requirements detected.

---

# Confidence Presentation

The user should understand certainty.

---

## High Confidence

90%+

Message:

"We are highly confident this is a Feature."

---

## Medium Confidence

70–89%

Message:

"This appears to be a Feature."

---

## Low Confidence

Below 70%

Message:

"We need additional information to determine scope."

---

# Scope Override Experience

Users must always be able to override scope.

---

Example

System:

Feature

User:

Story

---

Result

Story selected.

---

# Override Confirmation

When an override introduces risk, the system should explain consequences.

---

Example

User selects Story.

System recommendation:

Product.

---

Message:

This request may require architecture, governance, and extensive planning. Proceeding with Story may reduce specification depth.

---

# Scope Explanation Experience

The platform should explain scope decisions.

---

Example

Feature selected because:

- Multiple workflows detected.
- Authentication involved.
- External integration detected.

---

# Clarification-Driven Scope Selection

Sometimes scope cannot be determined immediately.

---

Workflow

User Intent
↓
Initial Classification
↓
Scope Uncertain
↓
Clarification Questions
↓
Scope Determined

---

# Scope Change Experience

Scope may change during clarification.

---

Example

Initial Scope:

Story

---

Clarification Reveals:

OAuth

Role Management

Session Management

Security Requirements

---

Result:

Feature

---

# User Messaging

Suggested Message:

Additional complexity was identified during clarification.

Recommended scope has changed from Story to Feature.

---

# Scope Reduction Experience

Scope may decrease.

---

Example

Initial Scope:

Product

---

Clarification Reveals:

Single page

Single endpoint

Single workflow

---

Result:

Story

---

Suggested Message:

The request appears smaller than initially expected.

Recommended scope has changed to Story.

---

# Existing Project Experience

Existing project context should not force scope.

---

Example

Project:

CRM

---

Request:

Add Export Button

---

Result:

Story

---

The experience should explain:

Scope reflects the initiative, not the surrounding project.

---

# Visual Design Recommendations

The interface should visually distinguish scope levels.

---

Suggested Representation

Story
● Small

Feature
● Medium

Product
● Large

---

Alternative Representation

Story
⚡

Feature
🔧

Product
🏗

---

# Progressive Disclosure

Additional explanations should appear only when needed.

---

Basic View

Scope

Confidence

Reason

---

Expanded View

Signals

Classification Details

Detected Complexity

Detected Risks

---

# User Trust Principles

Users should never feel:

- Locked into a scope.
- Surprised by scope.
- Confused by scope.

---

The experience should prioritize:

Clarity

Control

Predictability

---

# Accessibility Requirements

Scope explanations should:

- Use simple language.
- Avoid jargon.
- Be understandable by non-technical users.

---

# Success Criteria

The Scope Selection Experience is successful when:

- Users understand scope differences.
- Users trust recommendations.
- Overrides remain uncommon but available.
- Classification feels transparent.
- Workflow selection feels natural.

---

# Failure Conditions

The experience has failed when:

- Users do not understand scope.
- Users frequently override recommendations.
- Classification appears arbitrary.
- Scope changes feel surprising.

---

# Relationship With Other Specifications

Scope Classification
↓
Produces Recommendation

Scope Selection Experience
↓
Presents Recommendation

Pipeline Selection
↓
Uses Final Scope

Generation
↓
Produces Outputs

---

# Closing Statement

The Scope Selection Experience exists to make Progressive Specification understandable and approachable.

Even the most accurate classification engine provides little value if users do not understand or trust its decisions.

By combining automation, transparency, and user control, the Scope Selection Experience ensures that users remain confident in the workflow selected for their initiative while preserving the flexibility and scalability of Progressive Specification.
