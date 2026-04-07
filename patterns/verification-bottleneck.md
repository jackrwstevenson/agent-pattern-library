---
name: Verification Bottleneck
description: Recognise that verification, not generation, is the throughput constraint in agent-assisted development, and organise work around human review capacity.
category: Scale
maturity: assess
---

# Verification Bottleneck

> **In plain terms:** AI agents produce code faster than anyone can meaningfully check it. The temptation is to let them run flat out and review later, but unchecked output compounds errors faster than it delivers value. The real constraint on throughput is how much you can verify, not how much you can generate.
>
> **What is it?** Organising agent-assisted development around human verification capacity rather than generation speed, treating review as the primary constraint and adjusting concurrency accordingly.
> **What's in it for you?** Work stays verifiable. You avoid the trap of impressive-looking output that nobody has actually confirmed is correct.
> **What are the trade-offs?** Throughput is deliberately capped below what generation capacity allows; feels like leaving performance on the table.

The bottleneck has moved. In traditional development, writing code was the slow part. With agents, generation is near-instant. The new constraint is knowing, with confidence, that the output is correct.

This shift is easy to miss because the old bottleneck was visible (waiting for code to be written) and the new one is invisible (code that looks right but hasn't been verified). Osmani puts it directly: agents produce impressive output at incredible speed; knowing with confidence if output is correct is the hard part.

The danger is not that agents produce bad code. It is that they produce plausible code at a rate that overwhelms the verification process, and errors compound faster than they are caught.

## How It Works

### Verification Is Harder Than It Looks

Several factors make agent output harder to verify than human-written code.

_Tests passing before a change does not mean tests catch regressions from that change._ Existing test suites validate existing behaviour. An agent can introduce subtle regressions that no existing test covers, and the green CI check creates false confidence.

_Agents write technically valid tests that miss important cases._ An agent tasked with writing tests produces tests that pass. But passing is not the same as meaningful coverage. The agent writes tests for the code it generated, which may share the same blind spots.

_Context limitations mean agents miss constraints outside their current view._ A change that is locally correct can violate invariants maintained by code the agent never saw. In multi-agent setups, where each agent sees only its owned files, this risk compounds.

### Spec Quality as Fleet Multiplier

In single-agent work, a vague spec produces one vaguely wrong implementation. In multi-agent work, a vague spec produces N implementations diverging in N different directions. Each agent interprets the ambiguity slightly differently, and the resulting integration is worse than any individual output.

This is the amplification effect: spec quality multiplies across the fleet. Strong engineers get _more_ leverage from agents, not less, because their precise specifications produce precise implementations everywhere. Weak specifications do not just waste one agent's time; they waste every agent's time simultaneously.

### Review Capacity Determines WIP

The practical implication is that WIP limits for agent work should be set by human review capacity, not by compute. Osmani recommends 3-5 simultaneous agents as the sweet spot — not because more agents are technically difficult to run, but because that is the ceiling on how many streams of work a developer can meaningfully verify.

More agents producing unreviewed output is not parallelism. It is a queue of unverified work that creates an illusion of progress while deferring the actual work (verification) to an ever-growing backlog.

### Comprehension Debt

There is a deeper risk beyond immediate verification. When agents generate code faster than you can understand it, you accumulate _comprehension debt_: the gap between what your system does and what you understand about it. Unlike technical debt, which degrades the code, comprehension debt degrades _you_. You lose the ability to fix, extend, or know when the system is broken.

The siren song is generation speed. The discipline is building fewer features and maintaining understanding, rather than shipping everything the agents can produce.

### The Factory Mindset

Osmani frames this as a mental model shift: from writing code to building the factory that builds the code. The developer's job is not production work — it is designing the production process, writing precise specs, and verifying output. The six-step cycle is Plan (write specs with acceptance criteria), Spawn (create the team and assign agents), Monitor (check progress every 5-10 minutes, resolve blockers), Verify (run tests, review code — this is the bottleneck), Integrate (merge branches, resolve conflicts), and Retro (update the context library with patterns learned).

Verification is step four, but it is the step that gates everything else.

## The Trade-offs

The benefits are in sustainable throughput. Work stays verifiable. Errors are caught before they compound. Comprehension of the system is maintained. And specs improve because they have to — vague specs visibly fail when amplified across a fleet.

The costs are in perceived speed. Capping concurrency at review capacity means you are not using the full generation capacity available to you. On any given day, you could have shipped more features by running more agents. The argument is that unchecked output is not progress, but it does not always feel that way.

There is also a team dynamics cost. Developers accustomed to measuring productivity by code output may find the shift to verification-centric work unsatisfying, even though it produces better outcomes.

## When to Use It

This pattern matters whenever you are running multiple agents in parallel, or when a single agent produces output faster than you can review it. It is especially relevant for teams adopting [Agent Team](agent-team.md) workflows, where the temptation to add more agents is constant.

It pairs with [Validation Constraint](validation-constraint.md), which addresses _how_ to verify (tests, not line review), while this pattern addresses _why_ verification is the constraint and how to organise around it. It informs [Agent Team](agent-team.md) WIP limits and kill criteria. And it reinforces [Specify Plan Ship](specify-plan-ship.md)'s emphasis on spec quality, since spec precision is the single highest-leverage investment when specs multiply across a fleet.

## Maturity

**Assess.** The insight that verification is the bottleneck is widely recognised among practitioners running multi-agent workflows, and the practical implications (WIP limits, spec quality as multiplier, comprehension debt) are being articulated by multiple independent sources. But the organisational patterns for managing verification-constrained throughput are still emerging.

## Further Reading

- [The Code Agent Orchestra](https://addyosmani.com/blog/code-agent-orchestra/) - Addy Osmani on verification as the bottleneck, the factory model, and spec quality as fleet multiplier
