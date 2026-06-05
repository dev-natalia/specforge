# Specforge V2 Provider Adapters

## Status

Accepted

## Purpose

This document defines the Provider Adapter model used by Specforge.

Provider Adapters are responsible for transforming provider-independent harnesses into provider-specific operational artifacts.

Its purpose is to ensure that project knowledge, specifications and behavioral rules remain stable while execution environments vary.

Provider Adapters separate engineering intent from provider implementation details.

---

# Introduction

AI providers evolve continuously.

Examples:

- Claude
- GPT
- Gemini
- Cursor
- Roo Code
- Future Providers

Each provider introduces:

- different context models
- different prompt formats
- different rule systems
- different execution environments

Projects should not need to redesign their engineering process every time a provider changes.

Provider Adapters exist to solve this problem.

---

# Definition

## Provider Adapter

A Provider Adapter is a transformation layer that converts a provider-neutral Harness into a provider-specific operational artifact.

A Provider Adapter answers:

- How should this harness be represented?
- Which provider capabilities exist?
- Which provider limitations exist?
- How should execution rules be translated?

Provider Adapters preserve intent while adapting format.

---

# Core Hypothesis

Knowledge
↓
Specifications
↓
Harness
↓
Provider Adapter
↓
Provider Artifact
↓
Execution

Harnesses define intent.

Adapters define translation.

---

# Responsibilities

Provider Adapters exist to:

- preserve engineering intent
- preserve agent behavior
- preserve traceability
- preserve security requirements
- preserve testing requirements
- adapt execution formats
- minimize provider lock-in

---

# Inputs

Provider Adapters may consume:

- Harnesses
- Agent Rules
- Context Packages
- Specifications
- Provider Profiles

---

# Provider Profile Model

Every provider should define a profile.

## Provider ID

Example:

PROVIDER-CLAUDE

## Provider Name

Example:

Claude

## Provider Category

Examples:

- Agent
- Editor
- Chat
- Autonomous Agent

## Context Capabilities

Defines:

- context size
- retrieval capabilities
- memory capabilities

## Rule Capabilities

Defines:

- instruction support
- rule files
- system prompts

## Execution Capabilities

Defines:

- file editing
- tool usage
- planning support

---

# Adapter Architecture

Harness
↓
Adapter Layer
↓
Provider Artifact

The Adapter Layer is responsible for translation.

---

# Translation Responsibilities

Adapters should translate:

## Identity Layer

Project identity.

## Context Layer

Relevant knowledge.

## Specification Layer

Authoritative specifications.

## Execution Layer

Behavioral expectations.

## Validation Layer

Quality requirements.

## Preservation Layer

Knowledge preservation rules.

---

# Supported Provider Outputs

## Claude Adapter

Output:

CLAUDE.md

## Cursor Adapter

Output:

.cursor/rules

## GPT Adapter

Output:

GPT Instructions

## Gemini Adapter

Output:

Gemini Instructions

## Future Providers

Output defined by provider profile.

---

# Translation Rules

Adapters should preserve:

- meaning
- intent
- priorities
- constraints
- quality requirements

Adapters should not preserve implementation-specific formatting.

---

# Capability Mapping

Harness Requirement
↓
Provider Capability
↓
Adaptation Strategy

Missing capabilities should be compensated for whenever possible.

---

# Context Adaptation

Adapters should optimize context for provider constraints.

Examples:

- context limits
- retrieval limits
- memory limitations

Adaptation should preserve critical information.

---

# Rule Adaptation

Agent Rules should be translated into provider-native formats.

Examples:

- markdown files
- rule files
- system prompts
- structured instructions

Behavior should remain consistent.

---

# Quality Preservation

Adapters should preserve:

- quality gates
- security requirements
- testing requirements
- traceability requirements

Quality should survive translation.

---

# Knowledge Preservation

Adapters should preserve:

- discoveries
- decisions
- rationale
- constraints

Knowledge should not be lost during transformation.

---

# Provider Independence

The Harness should never depend on a provider.

Correct:

Harness
↓
Adapter
↓
Provider

Incorrect:

Harness
↓
Provider-Specific Logic

Provider-specific behavior belongs inside adapters.

---

# Validation Rules

Provider Adapters should pass:

- Intent Preservation Validation
- Rule Preservation Validation
- Security Preservation Validation
- Testing Preservation Validation
- Traceability Preservation Validation
- Capability Mapping Validation

---

# Anti-Patterns

## Provider-Centric Harnesses

Harnesses tied to specific providers.

## Intent Loss

Translation changes meaning.

## Rule Loss

Behavioral rules disappear.

## Quality Loss

Quality requirements omitted.

## Provider Lock-In

Project dependent on a single provider.

---

# Relationship With Other Artifacts

Knowledge
↓
Specifications
↓
Harness
↓
Provider Adapter
↓
Provider Artifact
↓
Execution

Adapters connect provider-independent knowledge with provider-specific environments.

---

# AI Responsibilities

AI systems implementing adapters should:

- preserve intent
- preserve behavior
- preserve quality standards
- preserve security requirements
- preserve traceability

Translation quality is more important than format fidelity.

---

# Future Evolution

Future versions may introduce:

- adapter inheritance
- adapter composition
- capability negotiation
- adapter scoring
- automatic provider detection

---

# Long-Term Vision

Projects should be able to switch AI providers without redesigning their operational model.

Engineering standards should outlive tools.

Provider Adapters make this possible.

---

# Final Statement

Harnesses define intent.

Providers define execution environments.

Provider Adapters bridge the gap.

The goal is not provider compatibility.

The goal is provider independence.
