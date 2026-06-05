# 014 - Clarification Depth Rules

## Status

Draft

---

# Purpose

This document defines the operational rules used to determine clarification depth within Progressive Specification.

While the Progressive Clarification Specification defines the philosophy and lifecycle of clarification, this document defines the measurable rules used to decide:

- How much clarification is required
- When clarification should stop
- When clarification should continue
- When assumptions are acceptable
- When confidence is sufficient
- When scope escalation should occur

This specification provides the execution logic behind the Clarification Engine.

---

# Overview

The central challenge of clarification is balancing:

Understanding
vs
Friction

Too little clarification produces poor outputs.

Too much clarification produces user fatigue.

The Clarification Depth Engine exists to find the optimal balance.

---

# Core Principle

Clarification depth should be proportional to risk.

Not proportional to curiosity.

---

# Clarification Depth Model

Depth is determined by four variables:

1. Scope
2. Ambiguity
3. Risk
4. Confidence

---

# Clarification Depth Formula

Conceptually:

Clarification Depth

=

Scope Complexity
+ Ambiguity Level
+ Risk Level
− Confidence Level

---

# Depth Levels

The engine defines five depth levels.

---

## Level 0 — No Clarification

Generation begins immediately.

Used when:

- Request is explicit
- Risk is negligible
- Scope is obvious

Example:

"Add loading spinner to login page."

---

## Level 1 — Minimal Clarification

One or two questions.

Used when:

- Minor ambiguity exists
- Risk remains low

Example:

"Add export button."

Questions:

- Which data should be exported?

---

## Level 2 — Basic Clarification

Several questions.

Used when:

- Requirements affect implementation
- Scope still small

Example:

"Create notification system."

---

## Level 3 — Structured Clarification

Focused discovery process.

Used when:

- Multiple components involved
- Design decisions required

Typically Feature scope.

---

## Level 4 — Deep Clarification

Comprehensive discovery process.

Used when:

- Product scope
- Strategic decisions
- Architectural uncertainty

---

# Scope-Based Defaults

## Story

Default Depth:

Level 1

---

Allowed Range:

Level 0 to Level 2

---

## Feature

Default Depth:

Level 2

---

Allowed Range:

Level 1 to Level 3

---

## Product

Default Depth:

Level 4

---

Allowed Range:

Level 3 to Level 4

---

# Ambiguity Scoring

The engine should assign ambiguity scores.

---

## Low Ambiguity

Characteristics:

- Clear behavior
- Clear actors
- Clear outcome

Score:

1

---

## Moderate Ambiguity

Characteristics:

- Missing implementation details
- Missing constraints

Score:

2

---

## High Ambiguity

Characteristics:

- Undefined behavior
- Undefined users
- Undefined requirements

Score:

3

---

## Extreme Ambiguity

Characteristics:

- Multiple interpretations
- Contradictions
- Undefined objectives

Score:

4

---

# Risk Scoring

The engine should assign risk scores.

---

## Low Risk

Examples:

UI tweaks

Text changes

Simple validations

Score:

1

---

## Medium Risk

Examples:

Business rules

Integrations

User workflows

Score:

2

---

## High Risk

Examples:

Authentication

Payments

Data migration

Score:

3

---

## Critical Risk

Examples:

Security

Compliance

Infrastructure

Architecture

Score:

4

---

# Confidence Model

Confidence represents how well the system understands the request.

---

## Confidence Factors

Understanding of:

- Objective
- Actors
- Requirements
- Constraints
- Expected behavior

---

# Confidence Levels

## Low Confidence

Below 60%

Generation prohibited.

---

## Moderate Confidence

60% to 79%

Additional clarification recommended.

---

## High Confidence

80% to 89%

Generation generally permitted.

---

## Very High Confidence

90%+

Generation recommended.

---

# Scope Confidence Thresholds

## Story

80%

---

## Feature

85%

---

## Product

90%

---

# Clarification Decision Matrix

Low Ambiguity
+
Low Risk

→ Generate

---

High Ambiguity
+
Low Risk

→ Clarify Briefly

---

Low Ambiguity
+
High Risk

→ Clarify Carefully

---

High Ambiguity
+
High Risk

→ Deep Clarification

---

# Assumption Rules

The engine may replace clarification with assumptions.

Only if all conditions are true.

---

## Condition 1

Risk is low.

---

## Condition 2

Assumption is reversible.

---

## Condition 3

Alternative interpretations are limited.

---

## Condition 4

Assumption is documented.

---

# Assumption Examples

Valid:

Loading indicator
→ Spinner

---

Valid:

Primary button
→ Standard button style

---

Invalid:

Authentication
→ OAuth

---

Invalid:

Payment Provider
→ Stripe

---

# Clarification Escalation Rules

Depth should increase when:

- Ambiguity increases
- Risk increases
- Scope expands
- Contradictions appear

---

# Clarification Reduction Rules

Depth should decrease when:

- Confidence rises
- Existing context exists
- Existing project knowledge exists
- Similar work already exists

---

# Context Reuse Rules

Existing knowledge should reduce questioning.

Examples:

Known Architecture

Known User Roles

Known Business Rules

Known Integrations

---

# Clarification Budget

The engine should operate with a clarification budget.

---

## Story Budget

0 to 5 questions

---

## Feature Budget

3 to 10 questions

---

## Product Budget

10 to 30 questions

---

# Budget Override Rules

The engine may exceed budget when:

- Critical ambiguity exists
- Critical risk exists
- Contradictions remain unresolved

---

# Question Prioritization

Questions should be ordered by impact.

---

Priority 1

Blocks generation.

---

Priority 2

Changes implementation.

---

Priority 3

Changes design.

---

Priority 4

Changes future evolution.

---

Priority 5

Nice-to-have information.

---

# Clarification Termination Rules

The engine should stop when:

- Confidence threshold reached
- Clarification budget exhausted
- Remaining ambiguity low impact
- User requests generation

---

# User Override Rules

Users may explicitly choose:

Generate Now

Result:

Remaining assumptions documented.

Generation proceeds.

---

# Failure Prevention Rules

The engine should never:

- Ask the same question twice
- Ask speculative roadmap questions
- Ask questions unrelated to outputs
- Delay generation unnecessarily

---

# Metrics

The engine should track:

- Average questions per scope
- Clarification completion rate
- User abandonment rate
- Confidence accuracy
- Assumption accuracy
- Regeneration frequency

---

# Validation Rules

The Clarification Engine is considered healthy when:

- Story workflows remain fast
- Feature workflows remain focused
- Product workflows remain comprehensive
- User fatigue remains low
- Specification quality remains high

---

# Relationship With Progressive Clarification

Progressive Clarification Specification:

Defines philosophy.

---

Clarification Depth Rules:

Defines execution behavior.

---

Together they form the complete Clarification Engine.

---

# Closing Statement

The purpose of clarification is not information collection.

The purpose of clarification is uncertainty reduction.

The Clarification Depth Rules ensure that questioning remains proportional to scope, ambiguity, and risk.

By applying measurable depth controls, Specforge can maximize understanding while minimizing friction, enabling faster and more reliable specification generation.
