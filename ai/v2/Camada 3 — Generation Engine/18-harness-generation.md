# Specforge V2 Harness Generation

## Status

Accepted

## Purpose

This document defines the Harness Generation Engine used by Specforge.

The Harness Generation Engine is responsible for transforming project knowledge into operational AI execution systems.

Harnesses are not prompts.

Harnesses are not specifications.

Harnesses are reusable operational environments that define how AI systems should behave when working on a project.

The purpose of a Harness is to ensure that AI behavior remains aligned with project identity, architecture, quality standards and engineering expectations.

---

# Introduction

Most AI-assisted development workflows rely on prompts.

Prompts are temporary.

Prompts solve individual interactions.

Harnesses solve entire development workflows.

The relationship is:

Knowledge
↓
Context Package
↓
Specification
↓
Harness
↓
AI Execution

A Harness transforms project understanding into execution behavior.

---

# Definition

## Harness

A Harness is a structured operational layer that governs AI behavior within a project.

A Harness answers:

- How should the AI think?
- How should the AI build?
- How should the AI validate?
- How should the AI review?
- What should the AI avoid?

A Harness is an AI operating environment.

---

# Core Hypothesis

The consistency of AI outputs is determined more by operational guidance than by individual prompts.

Knowledge
↓
Harness
↓
AI Behavior
↓
AI Outputs

Better Harnesses create more predictable outcomes.

---

# Harness Responsibilities

- preserve project identity
- preserve engineering standards
- preserve architectural consistency
- preserve security expectations
- preserve testing standards
- preserve quality requirements
- reduce AI drift
- reduce prompt duplication

---

# Harness Architecture

Harness
├── Identity Layer
├── Behavioral Layer
├── Architecture Layer
├── Security Layer
├── Testing Layer
├── Documentation Layer
├── Quality Layer
├── Review Layer
└── Execution Layer

---

# Identity Layer

Derived from:

- Vision
- Product DNA
- Principles

Examples:

- Free Forever
- Open Source
- BYOK
- Local First

---

# Behavioral Layer

Examples:

- Prefer clarification over assumptions
- Preserve rationale
- Preserve traceability
- Avoid hidden decisions

---

# Architecture Layer

Examples:

- Modular architecture
- Separation of concerns
- Domain-first organization
- Explicit boundaries

---

# Security Layer

Examples:

- Never expose secrets
- Never log credentials
- Validate all user input
- Escape user-generated content
- Follow OWASP principles
- Apply least privilege

---

# Testing Layer

Examples:

- Unit tests required
- Critical flows require integration tests
- Edge cases must be covered
- Acceptance criteria must be validated

---

# Documentation Layer

Examples:

- Public APIs documented
- Decisions linked to ADRs
- Traceability preserved
- Complex logic explained

---

# Quality Layer

Examples:

- No critical lint violations
- No failing tests
- No unresolved security findings
- Specification alignment maintained

---

# Review Layer

Examples:

- Verify requirements alignment
- Verify architecture alignment
- Verify traceability
- Verify testing coverage

---

# Execution Layer

Examples:

- Code generation
- Refactoring
- Test generation
- Architecture design
- Documentation generation

---

# Harness Inputs

- Product DNA
- Principles
- Constraints
- Discoveries
- Decisions
- Specifications
- Context Packages

---

# Harness Generation Pipeline

Knowledge Collection
↓
Context Selection
↓
Behavior Extraction
↓
Layer Construction
↓
Harness Validation
↓
Harness Output

---

# Harness Structure

Every generated Harness should contain:

- Purpose
- Identity Rules
- Behavioral Rules
- Architecture Rules
- Security Rules
- Testing Rules
- Documentation Rules
- Quality Gates
- Review Rules
- Forbidden Behaviors
- Traceability References

---

# Provider Independence

Supported targets include:

- Claude
- GPT
- Gemini
- Cursor
- Roo Code
- Future AI systems

---

# Harness Validation

Every Harness should pass:

- Product DNA Alignment
- Principle Alignment
- Constraint Compliance
- Security Coverage
- Testing Coverage
- Documentation Coverage
- Quality Gate Coverage
- Contradiction Detection

---

# Synchronization Rules

Harnesses should be regenerated whenever:

- Product DNA changes
- Principles change
- Constraints change
- Major decisions change
- Specifications change

---

# Harness Anti-Patterns

- Prompt Dumping
- Security Omission
- Testing Omission
- Quality Blindness
- AI Lock-In
- Harness Drift

---

# AI Responsibilities

AI systems implementing Harness Generation should:

- preserve identity
- preserve constraints
- preserve rationale
- preserve architecture
- preserve security requirements
- preserve testing requirements
- preserve quality expectations

---

# Future Evolution

Future versions may introduce:

- harness scoring
- harness health metrics
- harness drift detection
- provider adapters
- harness optimization
- quality coverage scoring

---

# Long-Term Vision

Harnesses should become durable engineering assets.

A mature project should be able to onboard a new AI system by providing:

- Knowledge Layer
- Context Package
- Harness

without rebuilding instructions from scratch.

Harnesses become the operational memory of the project.

---

# Final Statement

Knowledge explains understanding.

Context Packages deliver understanding.

Specifications define implementation.

Harnesses define behavior.

A Harness is not a prompt.

A Harness is the operational layer that transforms project knowledge into predictable AI execution.

This is the foundation of Harness Engineering.
