---
name: Garbage Collection Agent
description: Deploy periodic agents that sweep codebases for inconsistencies, dead code, and documentation drift.
category: Evolution
maturity: trial
---

# Garbage Collection Agent

> **In plain terms:** AI-generated codebases accumulate entropy fast - stale documentation, dead code, architectural violations, inconsistencies between modules. Like garbage collection in a programming runtime, periodic agents sweep through and clean up, keeping the codebase healthy without expensive manual sprints.
>
> **What is it?** Periodic agents that sweep codebases for documentation drift, dead code, architectural violations, and inconsistencies, fixing low-risk issues automatically and flagging the rest.
> **What's in it for you?** Continuous codebase health management instead of expensive periodic cleanup sprints.
> **What are the trade-offs?** Infrastructure and compute costs for periodic sweeps; false positives waste human review time.

AI agents generate code faster than humans can review it. Over time, this accumulation produces a familiar kind of rot: documentation drifts from implementation, dead code lingers because nobody is confident enough to remove it, architectural constraint violations creep in between CI runs, and inconsistencies multiply across modules that were generated in separate sessions with slightly different context.

These problems aren't new. Every codebase accumulates entropy. But AI-generated codebases accumulate it faster, because the volume of output outpaces the human attention available to maintain it. The usual answer is periodic cleanup sprints, but those are expensive and infrequent, so debt compounds between them.

## How It Works

The approach deploys periodic agents that sweep through the codebase identifying inconsistencies, violations, and waste, then either fix them directly or raise them for human review.

Like garbage collection in a runtime, these agents run in the background on a schedule. They don't produce new features. They maintain the health of what already exists.

### What Gets Collected

*Documentation inconsistencies*: agents compare documentation against the code it describes, flagging or fixing descriptions that no longer match behaviour, API docs with wrong signatures, and READMEs that reference removed features.

*Architectural constraint violations*: agents run [Structural Constraint](structural-constraint.md) checks and remediate violations that have crept in since the last sweep. This catches drift that occurs between CI runs or in branches that bypassed checks.

*Dead code and unused dependencies*: agents identify code paths that are no longer reachable, exports that nothing imports, dependencies that nothing references, and configuration for features that have been removed.

*Inconsistencies across modules*: agents detect naming convention drift, duplicated logic across modules generated in separate sessions, divergent error handling patterns, and style inconsistencies that linters don't cover.

### Operating Model

The agents can run on a schedule (nightly, weekly) or triggered by events (after a large merge, after a certain volume of generated code). They produce either automated PRs with fixes for low-risk issues, or reports for human triage on higher-risk findings. The distinction matters: automatically removing dead code is usually safe, but reconciling divergent business logic across modules requires human judgement.

### The Virtuous Cycle

Birgitta Böckeler describes an iterative principle: when agents struggle with a particular class of problem, teams identify the missing tool or guardrail and have AI implement the fix. Garbage collection agents are both a product of this cycle and participants in it. They surface recurring problems, which informs improvements to context, linters, and constraints, which reduces the problems the next sweep finds.

## The Trade-offs

The benefits are significant for large, fast-moving codebases. Entropy is managed continuously rather than in expensive bursts. Documentation stays closer to reality. Dead code and unused dependencies don't accumulate. And the sweep results provide a health signal for the codebase that would otherwise be invisible.

The costs are real. The agents need infrastructure and compute to run periodic sweeps. False positives waste human review time, especially when the agent flags intentional variations as inconsistencies. Automated fixes carry risk if the agent misunderstands what's dead versus what's conditionally used. And writing effective sweep rules requires understanding the codebase well enough to distinguish signal from noise.

## When to Use It

This pattern pays off for codebases with high volumes of AI-generated code where entropy accumulates faster than manual review can manage, long-lived projects where documentation and code drift over time, teams using [Agent Team](agent-team.md) or similar multi-agent approaches that produce code in parallel sessions with potentially inconsistent context, and organisations where codebase health metrics matter for compliance or operational reasons.

It's unnecessary for small projects maintained by a single developer or agent, short-lived codebases where long-term maintenance isn't a concern, and teams where the volume of AI-generated code is low enough that manual review catches inconsistencies.

This builds on [Structural Constraint](structural-constraint.md) by periodically enforcing constraints beyond CI. It complements [Golden Path Anchor](golden-path-anchor.md), which detects drift from a reference application, while Garbage Collection Agent detects drift from the codebase's own internal consistency. And it supports [Regen](regen.md) by identifying the staleness that triggers regeneration.

## Maturity

**Trial.** The problem is real for high-volume AI-generated codebases and the solution is conceptually clean, but requires meaningful infrastructure to implement well. This is likely to become standard practice as AI-generated code volume increases.

## Further Reading

- [Harness Engineering](https://martinfowler.com/articles/exploring-gen-ai/harness-engineering.html) - Birgitta Böckeler
