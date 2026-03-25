---
name: Confidence-Gated Validation
description: Use numeric confidence scores with calibrated thresholds and independent verification agents to filter findings, reducing false positives without losing real issues.
category: Safety
maturity: trial
---

# Confidence-Gated Validation

> **In plain terms:** AI code review finds lots of "issues" - but many are false alarms. After enough false alarms, teams stop reading. This pattern assigns confidence scores to each finding, filters out low-confidence noise, and sends surviving findings to an independent verifier before bothering a human.
>
> **What is it?** Numeric confidence scoring with calibrated thresholds, plus independent verification agents that validate each finding before it reaches a human reviewer.
> **What's in it for you?** Dramatically fewer false positives in AI-powered code review, rebuilding trust in automated findings.
> **What are the trade-offs?** Roughly doubles compute cost for review, and calibrating the confidence scale requires iteration.

Agent-powered code review has a false positive problem. An agent scanning a pull request will identify dozens of potential issues, many of which are not actually problems. Style preferences reported as bugs. Pre-existing code flagged as if the author introduced it. Patterns that look wrong in isolation but are correct in context. The volume of noise erodes trust quickly: after dismissing the tenth false alarm, reviewers stop reading the agent's output entirely.

The standard response is to tune the prompt: add "only report real bugs" or "be conservative." This helps marginally but does not solve the problem, because confidence is not binary. An agent may be 95% sure about a null pointer dereference and 40% sure about a naming convention violation. Treating both findings equally wastes human attention on the latter while correctly surfacing the former.

## How It Works

The approach introduces two mechanisms: numeric confidence scoring with calibrated thresholds, and independent verification agents that validate each finding before it reaches a human.

### Confidence Scoring

Each finding produced by an agent carries a numeric confidence score, typically 0 to 100. The score represents the agent's assessment of how likely the finding is to be a genuine issue worth acting on.

The scores are only useful if they are calibrated. An uncalibrated score of "75" means nothing. Calibration is achieved by providing explicit examples at each level in the scoring prompt:

- **0**: "I see a pattern that might be worth mentioning but I'm not sure it's even relevant"
- **25**: "This looks unusual but could easily be intentional or context-dependent"
- **50**: "This is probably an issue but I can see reasonable arguments for why it might be fine"
- **75**: "I'm fairly confident this is a real issue; I'd want someone to look at it"
- **100**: "This is definitely a bug; I can trace the failure path concretely"

A threshold, typically 80, filters out findings below the confidence floor. The exact threshold is less important than the calibration: teams should adjust based on observed false positive rates.

### Independent Verification

Confidence scoring alone is insufficient because agents are not well-calibrated about their own certainty. An agent that assigns 90% confidence to a finding may still be wrong. The second mechanism addresses this: each finding that passes the confidence threshold is sent to a separate, independent verification agent.

The verification agent receives the finding, the relevant code context, and a specific mandate: determine whether this finding is genuine. It has no knowledge of the other findings and no incentive to confirm the original agent's assessment. If the verification agent disagrees, the finding is dropped.

This two-pass structure, generate then verify, catches a class of false positives that single-pass review cannot: issues that look plausible in the diff but dissolve when you read the surrounding code.

### What Not to Flag

Equally important to scoring and verification is an explicit negative constraint: a list of things the agent must not flag. Every effective implementation includes one. Typical entries include pre-existing issues not introduced by the current change, problems that linters and type checkers already catch, style preferences and naming conventions, and code that is intentionally unusual with a comment explaining why.

This negative constraint reduces the volume of findings that need scoring and verification, improving both cost efficiency and signal quality.

## The Trade-offs

The benefits are significant. False positive rates drop substantially, often by an order of magnitude compared to single-pass review. Human reviewers trust the output because the findings that survive are overwhelmingly genuine. The confidence scores provide a natural prioritisation: a reviewer can address the 95s before the 82s. And the verification pass catches context-dependent false positives that no amount of prompt tuning would eliminate.

The costs are primarily in compute and latency. Every finding above the threshold triggers a verification agent, which reads code and reasons about it. For a review with 20 initial findings, this might mean 12 verification calls after threshold filtering. The total cost is roughly double that of single-pass review. Latency increases correspondingly, though verification calls can run in parallel. And calibrating the confidence scale requires iteration: the initial examples will be wrong, and teams need to adjust based on observed precision and recall.

## When to Use It

This pattern is essential for agent-powered code review pipelines where false positives have already eroded trust, high-volume review workflows where human attention is the bottleneck, and any agent pipeline where the cost of a false positive (wasted human time, alert fatigue) exceeds the cost of a verification pass.

It's unnecessary for low-volume workflows where a human can quickly assess a handful of findings, tasks where false positives are cheap to dismiss, and environments where a single-pass agent already achieves acceptable precision.

This extends [Post-Inference Validation](post-inference-validation.md) from deterministic rules to agent-based verification. [Tiered Model Routing](tiered-model-routing.md) can optimise the cost structure by using cheaper models for the initial sweep and more capable models for verification. And the negative constraint list draws from the same instinct as [Runtime Guardrails](runtime-guardrails.md): it is often easier to specify what the system must not do than what it should.

## Maturity

**Trial.** The two-pass structure with confidence scoring demonstrably reduces false positives in code review pipelines. The main challenge is calibration: the confidence scale must be tuned to the specific domain, and recalibrated as models improve. Teams that track precision and recall across their review pipeline manage this well. Teams that deploy it without measurement risk either filtering too aggressively (missing real issues) or too permissively (not solving the false positive problem).

## Further Reading

- [Claude Code Plugins](https://github.com/anthropics/claude-code/tree/main/plugins) - Multiple plugins (code-review, feature-dev, pr-review-toolkit) demonstrate confidence-gated validation with calibrated scoring and independent verification agents
