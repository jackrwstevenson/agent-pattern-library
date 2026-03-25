---
name: Eval-Driven Agent Development
description: Build automated test suites for the agent system itself, using repeated runs to handle variability and promoting passing tests into regression suites as the agent matures.
category: Harness Engineering
maturity: trial
---

# Eval-Driven Agent Development

> **In plain terms:** Without automated tests for the agent itself, teams get trapped in a reactive loop: users report a problem, the team fixes it, the fix breaks something else, and nobody knows until the next complaint. This pattern builds test suites for the agent system, not just for the code it produces.
>
> **What is it?** Automated test suites for AI agents, with agent-specific practices for handling variability, designing checks, and evolving suites over the agent's lifecycle.
> **What's in it for you?** Faster development cycles, confident model upgrades, and a shared definition of "good" that replaces guesswork with measurement.
> **What are the trade-offs?** Upfront investment in test design and checker calibration; suites require ongoing maintenance as the product and models evolve.

Teams building AI agents can get surprisingly far on manual testing and intuition. The breaking point comes when someone says "the agent feels worse after that change" and nobody can tell whether that is a real regression or noise. Each fix becomes a bet placed blind.

The instinct is to defer testing until later. This is backwards. Early on, product requirements naturally translate into test cases. Wait too long and you are reverse-engineering success criteria from a live system whose behaviour nobody fully understands.

Agent testing borrows from software testing but diverges in ways that matter. Give the same agent the same task twice and you may get different results, so a single attempt tells you very little. Success is often multidimensional and partially subjective. And agents regularly find valid solutions the test designer did not anticipate, so rigid assertions on expected paths penalise creativity rather than catch bugs.

## How It Works

### Check Results, Not Steps

The critical distinction is between what the agent _did_ (the full trace of its actions) and what it _produced_ (the final state in the environment). A flight-booking agent might say "Your flight has been booked" in its output, but the real question is whether a reservation actually exists in the database.

There is a common instinct to check that agents followed specific steps. Anthropic found this too rigid. The better default is to check what the agent produced, not the path it took. Did the code pass the tests? Did the database end up in the correct state? If the result is right, how the agent got there is its business. Add step-level checks only when the path genuinely matters for cost, latency, or compliance.

### Three Types of Checks

**Code-based checks** run automated tests, linters, and state verification against the agent's output. Fast, cheap, and they give the same answer every time. Their weakness is brittleness: they reject valid solutions that do not match expected patterns exactly.

**Model-based checks** use a second LLM to judge the agent's output against a written scoring guide (e.g. "did the agent respond with empathy?"). They handle nuance and subjective quality that automated tests cannot capture. Their weakness is inconsistency: the judge LLM needs to be tuned until its scores align with human judgement, and scoring each quality dimension with a separate judge produces more consistent results than asking one judge to score everything.

**Human checks** are the most reliable but slowest and most expensive. In a mature system their main role is spot-checking that the model-based checks still agree with human judgement, not reviewing every run directly.

Use code-based where possible, model-based where necessary, human for periodic spot-checks.

### Handling Variability

Give the same agent the same task ten times and it might succeed seven times. A single run tells you almost nothing. You need multiple runs per task to get a reliable picture of how often the agent succeeds.

The question then is what "success" means for your product. If the agent handles customer requests, it needs to succeed on nearly every attempt. There are different bars, and your test suite should measure the one that matches your use case.

### Stretch Tests vs Regression Tests

**Stretch tests** ask "What can this agent do well?" They should start with a low pass rate, giving teams a hill to climb.

**Regression tests** ask "Does it still handle what it used to?" They should have a nearly 100% pass rate. A decline signals something is broken.

The lifecycle connection is **promotion**: as stretch tests stabilise at high pass rates, they move into the regression suite. This keeps stretch suites focused on genuinely hard problems while the regression suite grows to protect established behaviour.

### Write Tests Before Features

Two engineers reading the same spec can come away with different interpretations of edge cases. A test suite resolves this ambiguity. Defining test cases and success criteria forces the team to specify what the agent should actually do, which is often harder than it sounds.

Stretch tests that start with a low pass rate also serve as bets on future model improvements. When a new model arrives, running the suite reveals which bets paid off. This directly enables [Harness Evolution](harness-evolution.md).

### Maintenance

A test suite is a living artefact. Two failure modes to watch for:

**Saturation**: the agent passes everything, leaving no signal for improvement. If your test suite cannot tell the difference between a good model and a better one, the tests are too easy. Write harder tests that target the agent's current weaknesses.

**Task quality decay**: ambiguity in test specifications becomes noise in metrics. A 0% pass rate across many runs usually signals a broken test, not an incapable agent.

The antidote to both is reading traces. You will not know if your checks work well without reading the agent's actions and scores from many runs.

## The Trade-offs

Benefits compound over the lifecycle. Failures become test cases, test cases prevent regressions, metrics replace guesswork. Model upgrades that would take weeks of manual testing can be evaluated in hours.

Costs are front-loaded. Test design, tuning model-based checks to agree with human judgement, and ongoing maintenance all require investment. Variability means enough runs for meaningful results, which multiplies compute. And false confidence from a bad test suite is worse than no test suite at all.

## When to Use It

Any team building an agent for production. Twenty to fifty test cases drawn from real failures is a strong starting point.

Especially valuable when multiple people iterate on the same agent, when you need to adopt new models quickly, and when product and research teams need a shared quality language.

This complements [Validation Constraint](validation-constraint.md) and [Structural Constraint](structural-constraint.md), which validate agent _outputs_ at runtime; this pattern validates the _agent system_ offline. It enables [Harness Evolution](harness-evolution.md) by providing the measurement layer for component decisions.

## Maturity

**Trial.** Well-established at Anthropic and companies building production agents (Descript, Bolt, Sierra). The underlying principles are proven; what is new is the agent-specific adaptation: handling variability across runs, checking results rather than steps, tuning LLM judges, and managing test saturation. Worth adopting for any agent headed to production.

## Further Reading

- [Demystifying Evals for AI Agents](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents) - Mikaela Grace, Jeremy Hadfield, Rodrigo Olivares, Jiri De Jonghe, Anthropic
- [Building Effective Agents](https://www.anthropic.com/research/building-effective-agents) - Anthropic
