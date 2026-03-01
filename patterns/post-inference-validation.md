# Post-Inference Validation

## Sketch

![Post-Inference Validation](../docs/assets/post-inference-validation.png)

## Problem

Runtime guardrails reduce but cannot eliminate problematic output. Even with controls during inference:

- **Guardrail gaps**: No single set of filters catches every failure mode; novel phrasings, edge cases, and context-dependent risks slip through
- **Compliance requirements**: Regulated industries need demonstrable, auditable proof that output was validated, not just that controls were configured
- **Separation of concerns**: Validation logic coupled to the model host is harder to audit, version, and update independently
- **Accountability gap**: Without structured validation records, organisations cannot explain why a given output was surfaced or blocked

A second, independent validation layer is needed between inference and the user.

## Solution

Place an independent validation pipeline after the model produces text. Output must pass through a series of gates before it is surfaced to users or downstream systems.

### Gates

**Deterministic rule checks**: Regex and DSL-based rules that enforce hard constraints. Examples include blocking financial-advice phrasing, enforcing contractual wording restrictions, and validating output format. These are fast, predictable, and easy to audit.

**PII re-detection and redaction**: A second-pass PII detector that catches exposures missed by runtime controls. Operates independently with its own detection models and patterns, providing defence in depth for sensitive data.

**Contextual verification**: Checks that claims in the output are supported by the supplied context or data. Techniques include citation matching, evidence anchoring, and semantic similarity scoring against source documents. Catches confabulation that contextual grounding missed.

**Risk scoring and explainability tags**: Attaches a compliance or confidence score and provenance metadata to each output. Records why the output passed or failed each gate, supporting downstream decisions and regulatory review.

**Escalation workflows**: Automatically routes uncertain or high-risk outputs to human reviewers or stricter validation policies. Configurable thresholds determine when automated approval is sufficient and when human judgement is required.

### Architecture

This validation layer intentionally runs outside the model host (e.g., external to Bedrock or equivalent) to preserve separation of concerns, simplify audits, and meet regulator expectations.

Implement as an auditable pipeline with:

- **Immutable logs**: Every validation decision recorded with input, output, gate results, and timestamps
- **Policy versioning**: Validation rules versioned and tracked so you can reconstruct what policy was active for any historical output
- **Review trails**: Clear provenance linking each output to the gates it passed, the scores it received, and any human review decisions

This architecture lets you demonstrate controls, decisions, and provenance during compliance reviews without coupling your audit story to a specific model provider.

## Costs and Benefits

### Benefits

- **Defence in depth**: Catches failures that runtime guardrails miss
- **Auditable by design**: Immutable logs and policy versioning satisfy regulatory requirements
- **Provider independence**: Validation logic is decoupled from the model host, surviving provider switches
- **Explainable decisions**: Every output carries provenance metadata explaining why it was approved or blocked
- **Graduated response**: Risk scoring and escalation allow nuanced handling rather than binary pass/fail

### Costs

- **Additional latency**: A second validation pass adds time between generation and delivery
- **Pipeline complexity**: Maintaining validation rules, detection models, escalation workflows, and logging infrastructure
- **Human reviewer bottleneck**: Escalation workflows require staffed review queues; without capacity planning, these become blocking
- **Rule maintenance**: Deterministic rules need continuous updates as requirements, regulations, and threat patterns evolve

## When to Use

- Regulated industries where audit trails and demonstrable controls are mandatory
- Customer-facing applications where output quality directly affects trust and liability
- High-stakes domains (healthcare, finance, legal) where confabulation or data leakage has material consequences
- Multi-model architectures where outputs from different providers need consistent validation

## When Not to Use

- Low-risk internal tools where the overhead outweighs the compliance benefit
- Prototyping and experimentation where speed matters more than auditability
- Applications where runtime guardrails alone provide sufficient control

## Related Patterns

- [Runtime Guardrails](runtime-guardrails.md): Complementary first layer that prevents problematic output during generation; together they form defence in depth
- [Validation Constraint](validation-constraint.md): Validates agent-generated code through tests; Post-Inference Validation validates generated text through an auditable pipeline

## Sources

- [Amazon Bedrock Guardrails](https://docs.aws.amazon.com/bedrock/latest/userguide/guardrails.html) - AWS
