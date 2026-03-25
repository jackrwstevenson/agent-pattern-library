---
name: Generator-Evaluator Loop
description: Separate generation from evaluation into distinct agents, with criteria-based feedback driving iterative refinement of output quality.
category: Harness Engineering
maturity: trial
---

# Generator-Evaluator Loop

> **In plain terms:** When you ask an AI to build something and then grade its own work, it reliably gives itself high marks, even when the result is mediocre. This pattern puts a second agent in the role of critic, creating a feedback loop that drives genuine improvement.
>
> **What is it?** A multi-agent architecture where one agent generates output and a separate agent evaluates it against explicit criteria, with structured feedback flowing back to the generator across multiple iterations.
> **What's in it for you?** Substantially higher output quality, particularly for subjective dimensions like design and product polish that functional tests cannot capture.
> **What are the trade-offs?** Dramatic cost increase (easily 10-20x); the evaluator itself requires careful calibration to be useful.

Ask an agent to build something, then ask it to evaluate what it built. It will praise its own work confidently, even when a human observer would call the result mediocre. This is not a prompting failure. The same reasoning process that produced the output is poorly positioned to critique it. As Prithvi Rajasekaran of Anthropic's Labs team puts it, it is "like asking someone to tickle themselves."

The structural fix, inspired by Generative Adversarial Networks, is to separate the agent doing the work from the agent judging it. Tuning a standalone evaluator to be sceptical turns out to be far more tractable than making a generator critical of its own work. Once that external feedback exists, the generator has something concrete to iterate against.

## How It Works

The generator produces output. The evaluator grades it against explicit criteria and writes a detailed critique. That critique flows back as input for the next iteration. The cycle repeats until scores cross defined thresholds, or an iteration cap is reached.

Three design decisions determine whether this works.

### Criteria-Based Rubrics

"Is this design good?" is hard to answer consistently. "Does this follow our principles for good design?" gives the evaluator something concrete to grade against. The shift from open-ended assessment to criteria-based grading is what makes subjective quality tractable for an LLM evaluator.

The structure transfers across domains: explicit dimensions, weighted scoring, hard thresholds. Rajasekaran used four criteria for frontend design (design quality, originality, craft, functionality) and adapted them to product depth, functionality, visual design, and code quality for full-stack coding. The weighting matters. Weight the dimensions where the model is already strong and you get no lift. Weight the dimensions where it is bland and you push it toward risk-taking.

### Evaluator Interaction with Actual Output

Give the evaluator access to the running output, not just the source code. In Rajasekaran's work, the evaluator used browser automation to navigate the live application, clicking through features and testing endpoints before scoring. This catches issues that code review alone misses: a route ordering bug returning a 422, a delete handler whose conditions are never jointly satisfied. The evaluator found these because it was using the application, not reading it.

### Evaluator Calibration

Out of the box, an LLM evaluator is a poor QA agent. It identifies legitimate issues, then talks itself into deciding they are not a big deal. It tests superficially rather than probing edge cases.

The fix is iterative: read the evaluator's logs, find where its judgement diverges from yours, update its prompt. Few-shot examples with detailed score breakdowns reduce drift. This calibration is not optional. An uncalibrated evaluator adds cost without adding quality. But it is tractable, because the evaluator's prompt can be tuned independently against a clear objective: "does this assessment match mine?"

## The Trade-offs

The quality gains are categorical, not incremental. In Rajasekaran's comparison, a solo agent produced a game maker in 20 minutes for $9 where the central feature was broken. The three-agent harness ran for 6 hours at $200 and produced a working application with richer editors and a functional play mode.

The costs go beyond tokens. Calibration is real engineering work. Runs stretch to hours. The evaluator still misses things. And the generator tends toward increasing complexity across iterations, sometimes over-engineering solutions that were simpler and better in earlier rounds.

Whether the evaluator is worth its cost depends on where the task sits relative to what the model handles reliably solo. For tasks within that boundary, the evaluator is overhead. For tasks at the edge, it gives real lift. As models improve, that boundary moves (see [Harness Evolution](harness-evolution.md)).

## When to Use It

Use it for long-running autonomous sessions where quality matters more than speed, subjective dimensions that functional tests cannot capture, and complex applications where subtle integration bugs escape code review.

Skip it for well-defined tasks where a single agent reliably produces correct output, time-sensitive work, and domains where the model's baseline quality already meets your bar.

This complements [Adversarial Agents](adversarial-agents.md), which uses *competing hypotheses* to fight anchoring bias; Generator-Evaluator Loop uses a dedicated critic for *iterative refinement*. [Confidence-Gated Validation](confidence-gated-validation.md) gates findings with pass/fail scores; this pattern provides *detailed feedback* shaping the next iteration. [Deterministic Orchestration](deterministic-orchestration.md) can control the loop structure while leaving creative work to the agents.

## Maturity

**Trial.** Anthropic's Labs team has published concrete results across frontend design and full-stack coding. The principle that external evaluation is more tractable to tune than self-evaluation is well-supported and consistent with code review and QA in software development. But calibration is non-trivial, the cost multiplier is significant, and the boundary between "evaluator adds value" and "evaluator is overhead" shifts with each model improvement.

## Further Reading

- [Harness design for long-running application development](https://www.anthropic.com/engineering/harness-design-long-running-apps) - Prithvi Rajasekaran, Anthropic
- [Building Effective Agents](https://www.anthropic.com/research/building-effective-agents) - Anthropic
