---
name: Adversarial Agents
description: Set multiple agents on the same problem with competing hypotheses, using structured debate to fight anchoring bias and converge on stronger conclusions.
category: Workflow
maturity: assess
---

# Adversarial Agents

> **In plain terms:** A single AI investigating a problem finds one plausible answer and stops looking - like a detective who arrests the first suspect. This pattern sets multiple agents on the same problem with different starting theories, forcing them to challenge each other before reaching conclusions.
>
> **What is it?** Multiple agents investigating the same problem from competing hypotheses, with structured debate to eliminate anchoring bias.
> **What's in it for you?** Stronger conclusions on genuinely ambiguous problems, with fewer blind spots from premature closure.
> **What are the trade-offs?** Token cost scales with the number of agents; on clear-cut problems the debate is pure overhead.

A single agent investigating a problem finds a plausible explanation and stops looking. This is not a bug in the model; it is how inference works. The first coherent theory anchors all subsequent reasoning. Evidence that supports the theory is noticed; evidence that contradicts it is explained away or ignored. The phenomenon is well-documented in human cognition, where it is called anchoring bias. In agents, the effect is more pronounced because there is no colleague to say "have you considered the alternative?"

The usual mitigation is prompting: "consider multiple hypotheses" or "play devil's advocate with yourself." This helps marginally. But asking a single reasoning process to genuinely argue against its own conclusion is like asking someone to tickle themselves. The adversarial pressure is simulated, not real.

The structural fix is to use multiple agents, each investigating the same problem from a different starting hypothesis, and have them challenge each other's conclusions directly.

## How It Works

The approach assigns the same problem to multiple agents, each with a different investigative angle or starting hypothesis. The agents work independently, then share findings and actively attempt to disprove each other's conclusions. A synthesis step extracts whatever consensus survives the debate.

### Competing Hypotheses

The strongest application is debugging, where root cause analysis is notoriously vulnerable to premature closure. Rather than one agent investigating linearly, multiple agents each receive a different hypothesis to pursue. One investigates a race condition. Another explores a configuration error. A third looks at an upstream dependency change. Each builds evidence for its theory while actively looking for evidence that undermines the others.

The mechanism works because each agent has genuine incentive to find flaws in competing theories: its mandate is not just to build its own case, but to challenge the others. This creates real adversarial pressure, not the simulated kind that a single agent produces when asked to "consider alternatives."

### Structured Debate

Independent investigation alone is not enough. The agents must actually engage with each other's findings. This requires a communication channel, whether that is direct messaging between agents, a shared findings document, or a synthesis agent that collates and challenges.

The debate structure matters. Unstructured communication degrades into agents restating their positions. Effective implementations constrain the debate: each agent must respond to specific claims from the others, cite evidence for disagreements, and concede points when the evidence warrants it. The goal is convergence, not victory.

### Multi-Lens Review

The same principle applies to code review, architecture evaluation, and any assessment task where different perspectives reveal different problems. Rather than one agent reviewing from a general "find issues" stance, multiple agents each apply a specific lens: security implications, performance impact, test coverage, API design. Each lens produces findings that a generalist reviewer would deprioritise or miss entirely.

The key difference from simply running multiple review passes is that the agents are aware of each other's findings. A security reviewer who sees the performance reviewer's concerns can assess whether a proposed security fix would create a performance regression. This cross-pollination catches a class of issues that sequential independent passes miss.

### Synthesis

The final step is synthesis: extracting the conclusions that survived debate. This can be handled by the coordinating agent, by a dedicated synthesis agent, or by presenting the surviving findings directly to a human. The surviving conclusions are stronger than any single agent's output because they have been tested against genuine opposition.

Not every debate converges. When agents reach an impasse, this is itself useful information: it tells you the problem has genuine ambiguity that warrants human judgement rather than automated resolution.

## The Trade-offs

The benefits are in decision quality. Anchoring bias is structurally eliminated because no single theory dominates the investigation. False negatives decrease because multiple starting points explore more of the solution space. And the surviving conclusions carry higher confidence because they have withstood challenge.

The costs are substantial. Token usage scales linearly with the number of agents, and each agent needs enough context to reason about the full problem. Coordination overhead increases with team size; three focused agents typically outperform five scattered ones. The debate can fail to converge, consuming resources without producing a clear answer. And for problems with obvious causes, the adversarial structure is pure overhead: you don't need a debate to diagnose a null pointer exception.

There is also a subtler risk. Agents are persuasive. An agent defending the wrong hypothesis with confident reasoning can convince other agents (or the synthesis step) to accept an incorrect conclusion. The adversarial structure reduces anchoring bias but does not eliminate rhetorical bias. Human review of the surviving conclusions remains important, particularly for high-stakes decisions.

## When to Use It

This pattern suits debugging where the root cause is genuinely unclear and premature closure is a real risk, architectural decisions where multiple valid approaches exist and the trade-offs are complex, code review where different quality dimensions (security, performance, correctness) benefit from specialist attention, and any investigation where anchoring bias in a single agent would limit the solution space explored.

Avoid it for problems with obvious causes, where a single agent would reach the correct conclusion quickly. Avoid it when token cost is a constraint and the quality improvement does not justify the multiplied usage. And avoid it for tasks that are inherently sequential, where each step depends on the previous one and parallel investigation adds no value.

This complements [Agent Team](agent-team.md), which parallelises _different tasks_ across agents; Adversarial Agents puts _multiple agents on the same task_ with competing perspectives. [Confidence-Gated Validation](confidence-gated-validation.md) validates findings after the fact; this pattern generates stronger findings through structured opposition during investigation. And [Tiered Model Routing](tiered-model-routing.md) can optimise costs by using the deep tier only for agents doing the core investigation and cheaper tiers for synthesis and coordination.

## Maturity

**Assess.** The intellectual case is strong: anchoring bias is a documented failure mode of single-agent investigation, and adversarial structure is a well-understood countermeasure from fields as diverse as intelligence analysis (the Red Team), academic peer review, and legal proceedings. Early implementations in agent team frameworks show promise for debugging and code review. But evidence for when the technique reliably outperforms single-agent investigation, and when it merely multiplies cost, is still accumulating. Worth experimenting with on genuinely ambiguous problems; unnecessary for routine ones.

## Further Reading

- [Agent Teams](https://code.claude.com/docs/en/agent-teams) - Anthropic's experimental multi-agent coordination framework, including competing hypothesis debugging
- [Analysis of Competing Hypotheses](https://en.wikipedia.org/wiki/Analysis_of_competing_hypotheses) - Richards Heuer's structured analytic technique for intelligence analysis, the conceptual ancestor of this pattern
