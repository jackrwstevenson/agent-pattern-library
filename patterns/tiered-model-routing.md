---
name: Tiered Model Routing
description: Match model capability and cost to each step in a workflow, using cheap models for simple decisions and expensive models for deep reasoning.
category: Scale
maturity: trial
---

# Tiered Model Routing

The default approach to model selection is to pick the most capable model and use it for everything. This is wasteful. A code review pipeline that uses a frontier model to check whether a pull request is already closed is spending serious money on a boolean question. Conversely, a pipeline that uses a cheap model to find subtle concurrency bugs is saving money it will spend later on missed defects.

The mismatch matters more than it first appears. Cost scales linearly with usage, but capability requirements vary enormously across the steps of a single workflow. A gate check ("is this PR a draft?") needs pattern matching. An architectural review needs genuine reasoning. Treating both the same is like hiring a structural engineer to check whether the front door is locked.

## Sketch

_Sketch coming soon._

## How It Works

The approach assigns a model tier to each step in a workflow based on the cognitive demands of that step, not on a blanket quality preference.

### Three Tiers

In practice, most workflows need three tiers. A _fast tier_ handles cheap, high-volume decisions: gate checks, file listing, format validation, simple classification. These are tasks where the answer is nearly always obvious and the cost of a wrong answer is low. Small, fast models excel here.

A _reasoning tier_ handles pattern matching, code exploration, compliance checks, and structured analysis. These tasks require following instructions carefully and producing structured output, but don't demand creative insight. Mid-range models handle them well.

A _deep tier_ handles tasks where genuine reasoning matters: finding subtle bugs, detecting security vulnerabilities, evaluating architectural trade-offs, and making judgement calls about code quality. These are the tasks where model capability directly determines output quality. Frontier models earn their cost here.

### Assignment Criteria

The key question for each step is: _what is the cognitive floor?_ What is the cheapest model that can perform this step reliably? Assign that tier, not the ceiling.

Gate checks and boolean decisions belong in the fast tier. Structured analysis with clear rubrics belongs in the reasoning tier. Open-ended judgement calls belong in the deep tier. When uncertain, start with the reasoning tier and promote to deep only if quality is demonstrably insufficient.

### Parallel Fan-out

Tiered routing compounds with parallelism. A code review pipeline might fan out four agents in parallel: two reasoning-tier agents auditing compliance against documented standards, and two deep-tier agents hunting for bugs. The compliance agents run at a fraction of the cost while the deep agents do the expensive work. The total cost is substantially lower than running all four at the deep tier, with no measurable loss in quality on the compliance checks.

## The Trade-offs

The benefits are primarily economic. Cost drops significantly because most steps in a typical workflow don't need frontier reasoning. Latency improves because smaller models respond faster, and gate checks that short-circuit the pipeline save the cost of all subsequent steps. And the approach forces you to think carefully about what each step actually requires, which often reveals steps that are unnecessary.

The costs are in calibration and maintenance. You need to determine the right tier for each step, which requires testing. Model capabilities shift with each release, so tier assignments need periodic review. The routing logic adds infrastructure complexity. And there is a genuine risk of under-provisioning: assigning a step to the fast tier when it actually needs reasoning produces silent quality degradation that is harder to detect than a loud failure.

## When to Use It

This pattern pays for itself on multi-step agent workflows where different steps have clearly different cognitive demands, high-volume pipelines where cost scales with usage, and workflows with natural gate checks that can short-circuit expensive downstream processing.

It's unnecessary for single-step interactions, low-volume workflows where cost is not a concern, and tasks where every step genuinely requires deep reasoning.

This complements [Deterministic Orchestration](deterministic-orchestration.md), which provides the pipeline structure that tiered routing optimises. [Agent Swarm](agent-swarm.md) benefits from tiered routing when planning agents and worker agents have different capability requirements. And [Confidence-Gated Validation](confidence-gated-validation.md) can use cheaper models for the initial finding pass and more capable models for the validation pass.

## Maturity

**Trial.** The technique is well-understood and demonstrably effective in multi-step code review and feature development pipelines. The main risk is under-provisioning, where a step is assigned too cheap a model and quality degrades silently. Teams that monitor per-step quality metrics manage this well; teams that don't may be saving money they'll spend on missed defects.

## Further Reading

- [Claude Code Plugins](https://github.com/anthropics/claude-code/tree/main/plugins) - Anthropic's open-source plugins demonstrate tiered model routing across code review, feature development, and PR analysis workflows
