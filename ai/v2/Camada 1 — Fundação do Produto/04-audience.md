# Specforge V2 Audience

## Status

Accepted

## Purpose

This document defines the intended users of Specforge.

Understanding the audience is critical because product decisions should optimize for specific users rather than attempting to satisfy everyone.

Specforge should solve real problems for a clearly defined audience.

Whenever prioritization decisions are required, the needs of the primary audience should take precedence.

---

# Audience Philosophy

Specforge is not designed for everyone who uses AI.

Specforge is designed for people who build software with AI.

The goal is not to maximize adoption.

The goal is to maximize usefulness for developers who care about quality, consistency and maintainability.

---

# Primary Audience

## Individual Software Developers

This is the most important audience.

Everything in Specforge should be optimized for them first.

### Profile

Developers who:

- Build personal projects
- Build side projects
- Build startups
- Build internal tools
- Use AI regularly during development

### Characteristics

They:

- Understand software development
- Care about architecture
- Care about maintainability
- Want better AI outcomes
- Often work alone

### Current Workflow

Today their workflow often looks like:

Idea
↓
Prompt
↓
Claude / GPT
↓
Code

Over time this creates:

- Context loss
- Architectural inconsistencies
- Repeated explanations
- Poor traceability

### Desired Workflow

Specforge aims to help them evolve toward:

Idea
↓
Knowledge
↓
Specs
↓
Harness
↓
AI
↓
Code

---

# Secondary Audience

## Technical Leads

Technical leads frequently need to:

- Preserve architectural decisions
- Explain systems to others
- Create alignment

### Problems

- Knowledge spread across conversations
- Loss of rationale
- Difficult onboarding

### Desired Outcome

A durable source of truth that survives beyond meetings and chat sessions.

---

## Architects

Architects often care less about implementation speed and more about consistency.

### Problems

- Architecture drift
- Conflicting implementations
- Decision fragmentation

### Desired Outcome

A system that preserves architectural intent.

---

# Future Audience

These audiences may benefit from Specforge but are not primary targets.

## Small Engineering Teams

Teams experimenting with AI-assisted development.

## Startups

Organizations building products with small engineering groups.

## Consultants

Professionals managing multiple projects simultaneously.

---

# Audience Problems

## Problem 01 — Context Loss

Important information disappears inside chat history.

## Problem 02 — Repeated Explanations

Developers explain the same project repeatedly.

## Problem 03 — Inconsistent AI Outputs

Different sessions generate different results.

## Problem 04 — Lost Decisions

Teams remember decisions but forget rationale.

## Problem 05 — Architecture Drift

Projects become less coherent over time.

---

# Audience Goals

Users want:

- Better AI outputs
- Less repetition
- Better context
- Better traceability
- Better maintainability
- Better project understanding

Users do not necessarily want:

- More dashboards
- More project management tools
- More administration

---

# Non Target Audiences

## Non-Technical Users

Specforge assumes familiarity with software development concepts.

## General Productivity Users

People looking for task management, note-taking or productivity systems.

## AI Hobbyists Seeking Quick Code

Users looking for instant code generation without project structure.

## Enterprise Governance Teams

While they may benefit from Specforge, enterprise governance is not the primary focus of the product.

---

# User Maturity Model

## Level 1 — Prompt User

Uses AI primarily through isolated prompts.

Knowledge is stored in conversations.

## Level 2 — Structured User

Begins organizing requirements and documentation.

Some project context is preserved.

## Level 3 — Spec Driven User

Works through specifications before implementation.

AI receives structured context.

## Level 4 — Knowledge Driven User

Treats knowledge as the primary project asset.

Maintains decisions, rationale and context over time.

Specforge primarily aims to help users move from Levels 1–3 toward Level 4.

---

# Audience Success Criteria

Specforge is creating value when users:

- Spend less time re-explaining projects
- Produce more consistent AI outputs
- Preserve important decisions
- Maintain architectural coherence
- Feel more confident using AI for larger projects

---

# Product Design Implications

Because the primary audience is software developers:

- Simplicity is preferred over marketing features.
- Transparency is preferred over automation magic.
- Exportability is preferred over lock-in.
- Structure is preferred over convenience.
- Context quality is preferred over generation speed.

---

# Final Statement

Specforge is built for developers who believe that AI is most effective when guided by structured knowledge.

The ideal Specforge user is not someone trying to replace software engineering.

The ideal Specforge user is someone trying to improve software engineering with AI.
