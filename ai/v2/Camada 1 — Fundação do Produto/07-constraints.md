# Specforge V2 Constraints

## Status

Accepted

## Purpose

This document defines the non-negotiable constraints of Specforge.

Constraints are not limitations to overcome.

They are intentional design decisions.

These constraints define the boundaries of the product and help prevent scope creep, architectural drift and unnecessary complexity.

Any proposal that violates these constraints requires explicit justification and review.

---

# Constraint Philosophy

Every product has constraints.

Successful products embrace their constraints.

Unsuccessful products fight them.

Specforge intentionally chooses a set of constraints that prioritize:

- simplicity
- ownership
- portability
- transparency
- sustainability

These constraints are part of the product identity.

---

# Product Constraints

## Constraint 01 — Free Forever

### Statement

Specforge must remain free to use.

### Rationale

The goal of Specforge is adoption and usefulness, not monetization.

### Implications

- No subscription plans
- No premium features
- No paywalls
- No usage tiers

### Accepted Tradeoff

Development speed may be slower than commercial competitors.

---

## Constraint 02 — Open Source

### Statement

Specforge must remain open source.

### Rationale

Knowledge preservation should not depend on proprietary systems.

### Implications

- Public repository
- Community contributions
- Transparent development

### Accepted Tradeoff

Competitors can reuse ideas.

---

## Constraint 03 — BYOK (Bring Your Own Key)

### Statement

Users provide their own AI provider credentials.

### Rationale

Specforge should not become an AI billing platform.

### Implications

- No token reselling
- No AI markup
- No centralized billing

### Accepted Tradeoff

Initial setup is slightly more complex.

---

## Constraint 04 — Provider Agnostic

### Statement

Specforge should support multiple AI providers.

### Rationale

Knowledge should remain portable.

### Supported Examples

- Claude
- GPT
- Gemini
- Open-source models
- Future providers

---

# Architecture Constraints

## Constraint 05 — Local First

Projects belong to users.

Knowledge should be stored in local project files whenever possible.

---

## Constraint 06 — File-Based Knowledge

Knowledge should exist as files.

Files are:

- versionable
- portable
- inspectable
- durable

---

## Constraint 07 — Human Readability

Generated artifacts must remain readable by humans.

---

# Product Scope Constraints

## Constraint 08 — Not a Project Management Tool

Specforge is not Jira.

Avoid:

- sprint management
- issue tracking
- velocity tracking

---

## Constraint 09 — Not a Documentation Wiki

Specforge is not Notion or Confluence.

---

## Constraint 10 — Not a Code Generator

Specforge generates context.

AI providers generate code.

---

# Operational Constraints

## Constraint 11 — Simplicity First

Every feature increases complexity.

Complexity must justify itself.

Evaluation:

1. Does it improve knowledge quality?
2. Does it improve context quality?
3. Does it improve AI outcomes?
4. Is there a simpler alternative?

---

## Constraint 12 — Transparency First

Users should understand:

- what was generated
- why it was generated
- which sources influenced it

---

## Constraint 13 — User Ownership

Users own their knowledge.

Users own their generated artifacts.

Users own their workflows.

---

# Future Constraint Evaluation

1. Does it respect Free Forever?
2. Does it respect Open Source?
3. Does it respect BYOK?
4. Does it remain Provider Agnostic?
5. Does it preserve Local First?
6. Does it maintain human readability?
7. Does it avoid becoming Jira?
8. Does it avoid becoming Notion?
9. Does it improve context quality?
10. Does it preserve user ownership?

---

# Non-Negotiables

- Free Forever
- Open Source
- BYOK
- Provider Agnostic
- Local First
- User Ownership
- Human Readability

---

# Final Statement

Constraints are not obstacles.

They are strategic decisions.

The purpose of these constraints is not to limit Specforge.

The purpose is to keep Specforge focused on its mission:

Transforming knowledge into high-quality context for AI-assisted software development.
