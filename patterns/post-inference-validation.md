# Post-Inference Validation

Runtime guardrails reduce but cannot eliminate problematic output. No single set of filters catches every failure mode; novel phrasings, edge cases, and context-dependent risks slip through. Regulated industries need demonstrable, auditable proof that output was validated, not just that controls were configured. Validation logic coupled to the model host is harder to audit, version, and update independently. And without structured validation records, organisations cannot explain why a given output was surfaced or blocked.

A second, independent validation layer is needed between inference and the user.

## Sketch

![Post-Inference Validation](../docs/assets/post-inference-validation.png)

## How It Works

The approach places an independent validation pipeline after the model produces text. Output must pass through a series of gates before it is surfaced to users or downstream systems.

*Deterministic rule checks* use regex and DSL-based rules to enforce hard constraints. Examples include blocking financial-advice phrasing, enforcing contractual wording restrictions, and validating output format. These are fast, predictable, and easy to audit.

*PII re-detection and redaction* provides a second-pass PII detector that catches exposures missed by runtime controls. It operates independently with its own detection models and patterns, providing defence in depth for sensitive data.

*Contextual verification* checks that claims in the output are supported by the supplied context or data. Techniques include citation matching, evidence anchoring, and semantic similarity scoring against source documents. This catches confabulation that contextual grounding missed.

*Risk scoring and explainability tags* attach a compliance or confidence score and provenance metadata to each output. They record why the output passed or failed each gate, supporting downstream decisions and regulatory review.

*Escalation workflows* automatically route uncertain or high-risk outputs to human reviewers or stricter validation policies. Configurable thresholds determine when automated approval is sufficient and when human judgement is required.

### Architecture

This validation layer intentionally runs outside the model host (external to Bedrock or equivalent) to preserve separation of concerns, simplify audits, and meet regulator expectations.

The pipeline should be auditable by design. *Immutable logs* record every validation decision with input, output, gate results, and timestamps. *Policy versioning* tracks validation rules so you can reconstruct what policy was active for any historical output. *Review trails* provide clear provenance linking each output to the gates it passed, the scores it received, and any human review decisions.

This architecture lets you demonstrate controls, decisions, and provenance during compliance reviews without coupling your audit story to a specific model provider.

## The Trade-offs

The benefits are substantial. You catch failures that [Runtime Guardrails](runtime-guardrails.md) miss. Immutable logs and policy versioning satisfy regulatory requirements. Validation logic is decoupled from the model host, surviving provider switches. Every output carries provenance metadata explaining why it was approved or blocked. And risk scoring with escalation allows nuanced handling rather than binary pass/fail.

The costs centre on complexity. A second validation pass adds latency between generation and delivery. Maintaining validation rules, detection models, escalation workflows, and logging infrastructure is ongoing work. Escalation workflows require staffed review queues, and without capacity planning these become a bottleneck. And deterministic rules need continuous updates as requirements, regulations, and threat patterns evolve.

## When to Use It

This pattern is essential for regulated industries where audit trails and demonstrable controls are mandatory, customer-facing applications where output quality directly affects trust and liability, high-stakes domains where confabulation or data leakage has material consequences, and multi-model architectures where outputs from different providers need consistent validation.

It's unnecessary for low-risk internal tools where the overhead outweighs the compliance benefit, prototyping and experimentation where speed matters more than auditability, and applications where runtime guardrails alone provide sufficient control.

Together with [Runtime Guardrails](runtime-guardrails.md), this pattern forms defence in depth: guardrails prevent at generation time, validation catches what slips through. [Validation Constraint](validation-constraint.md) addresses a related problem for agent-generated code, validating through tests rather than an auditable pipeline.

## Further Reading

- [Amazon Bedrock Guardrails](https://docs.aws.amazon.com/bedrock/latest/userguide/guardrails.html) - AWS
