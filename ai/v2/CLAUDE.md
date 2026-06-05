# CLAUDE.md

## Project Identity

Project: Specforge

Mission:

Transform engineering knowledge into durable, traceable and executable assets.

Specforge exists to preserve project intelligence and transform it into specifications, harnesses and implementation guidance.

The primary asset of the system is knowledge.

Code is a downstream artifact.

---

## Core Principles

### Knowledge First

Knowledge is the source of truth.

Specifications, harnesses and tasks are derived artifacts.

### Preserve Traceability

Every generated artifact must remain connected to its source knowledge.

Maintain references whenever possible.

### Prefer Clarification Over Assumption

If information is missing:

Ask questions.

Do not invent requirements.

Do not silently assume behavior.

### Preserve Architectural Intent

Architecture decisions are authoritative.

Do not introduce architectural drift.

Do not violate boundaries without explicit approval.

### Preserve Security

Security requirements are mandatory.

Do not bypass validation, authorization or security constraints.

### Preserve Testing

Behavior changes require testing updates.

Testing is not optional.

---

## Authoritative Artifacts

The following artifacts are authoritative:

1. Product DNA
2. Core Principles
3. Discoveries
4. Decision Records
5. Requirements Specifications
6. Design Specifications
7. Architecture Specifications
8. Contracts Specifications
9. Security Specifications
10. Testing Specifications

When conflicts exist:

Latest approved specification wins.

If uncertainty remains:

Request clarification.

---

## Engineering Workflow

Understand Context
↓
Load Relevant Knowledge
↓
Validate Understanding
↓
Clarify Missing Information
↓
Generate Plan
↓
Implement
↓
Validate
↓
Update Traceability

Do not skip validation.

---

## Knowledge Rules

Always prioritize:

- approved discoveries
- approved decisions
- active context packages

Do not prioritize assumptions.

Do not prioritize undocumented behavior.

---

## Specification Rules

Treat specifications as source of truth.

Do not:

- invent requirements
- invent workflows
- invent contracts

When specifications are incomplete:

generate clarification requests.

---

## Architecture Rules

Preserve:

- module boundaries
- ownership boundaries
- dependency rules
- communication rules

Architecture changes require explicit intent.

---

## Contract Rules

Preserve:

- API contracts
- event contracts
- integration contracts

Breaking changes must be explicit.

---

## Security Rules

Always:

- validate inputs
- preserve authorization
- preserve authentication
- protect secrets

Never weaken security requirements without approval.

---

## Testing Rules

Generate:

- unit tests
- integration tests
- contract tests

when applicable.

Behavior modifications should be validated.

---

## Traceability Rules

Generated artifacts should reference:

- discoveries
- decisions
- requirements
- architecture
- contracts

Outputs should remain explainable.

---

## Task Execution Rules

Before implementation:

1. Understand the task
2. Load relevant specifications
3. Validate dependencies
4. Identify risks

After implementation:

1. Validate acceptance criteria
2. Validate testing requirements
3. Validate security requirements
4. Validate traceability

---

## Quality Gates

Before considering work complete:

- Requirements Alignment
- Architecture Alignment
- Security Alignment
- Testing Alignment
- Traceability Alignment

If any gate fails:

work is not complete.

---

## Anti-Patterns

Do not:

- invent requirements
- ignore specifications
- bypass architecture
- bypass security
- remove traceability
- perform unrelated refactors
- optimize prematurely

---

## Clarification Policy

When ambiguity exists:

Clarify > Assume

When requirements conflict:

Pause
↓
Explain Conflict
↓
Request Resolution

When information is missing:

Request clarification.

---

## Context Management

Treat context as a scarce resource.

Prioritize:

1. Active Task
2. Relevant Specifications
3. Decisions
4. Context Packages
5. Historical Knowledge

Prefer high-signal context.

---

## Success Criteria

Success is not measured by generated code.

Success is measured by:

- preserved knowledge
- preserved intent
- preserved architecture
- preserved security
- preserved traceability
- successful implementation outcomes

---

## Final Directive

Your responsibility is not merely to generate code.

Your responsibility is to preserve and operationalize engineering knowledge.

Every implementation decision should be explainable through project knowledge, specifications and approved decisions.
