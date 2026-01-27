# Autonomous Agent

> **Pattern in Research**: This pattern describes a direction rather than current best practice. The prerequisites are steep, the tooling is immature, and **human review of all agent contributions remains essential**. Treat this as a lens for evaluating where agentic tooling is headed, not a recommendation for immediate adoption.

## Problem

Current AI coding tools are **reactive**; you prompt, they respond. The human remains the scheduler, deciding what gets worked on and when. This creates bottlenecks:

- **Human as dispatcher**: Every task requires someone to assign it
- **Priority blindness**: Agent doesn't know what's burning vs. what can wait
- **No self-awareness**: Agent can't tell if its work is actually helping
- **Context amnesia**: Each session starts fresh, no accumulated understanding

Scaling AI-assisted development requires moving beyond "human prompts, agent executes" toward agents that can autonomously select, prioritise, and validate their own work.

## Solution

Enable agents to operate as self-sustaining contributors by implementing three capabilities: **Task Selection**, **Outcome Monitoring**, and **Operating Values**.

### The Scaling Paradox

Full autonomy promises to remove human scheduling as a bottleneck. But today, **human review of all agent output is non-negotiable**; code review, PR approval, and verification remain essential guardrails.

This creates a tension: agents can select and execute more work, but humans must still review everything. The bottleneck shifts from "deciding what to work on" to "reviewing what was done." True scaling requires advances in:

- Agent reliability (fewer mistakes to catch)
- Automated verification (tests, static analysis, formal methods)
- Trust calibration (knowing when human review can be lighter-touch)

Until then, this pattern increases throughput modestly while introducing coordination overhead.

### The Three Capabilities

**Task Selection**: Agent pulls tasks from backlogs and correctly prioritises work.

- Before: You prompt the agent and it does a task
- After: Agent selects what to work on based on priority, urgency, and capacity
- Today's reality: Agent proposes what to work on; human approves before execution

**Outcome Monitoring**: Agent observes the world to understand if it's fulfilling its purpose.

- Before: Agent prioritises well, but customer pain points are invisible
- After: Agent reacts to signals; incidents, feedback, metrics; and adjusts focus
- Today's reality: Monitoring surfaces issues; humans decide the response

**Operating Values**: Agent operates under defined principles, rules, and working agreements.

- Not a separate capability but woven through everything
- Values should be in productive tension: "think big" vs "deliver quickly"
- Provides the framework for resolving prioritisation conflicts

### Prerequisites

You cannot skip to autonomous operation. The progression matters:

1. **Reliable coordination must work first**: Git, tests, type systems, linters; the agent must reliably avoid breaking things and respect team constraints before it can choose what to work on
2. **Task selection and monitoring arrive together**: An agent that prioritises without monitoring will optimise for the wrong things; monitoring without prioritisation leads to thrashing
3. **Values exist from the start**: Even basic coordination requires some operating principles. Values become explicit as autonomy increases

### Implementation Approach

Given current limitations, a realistic implementation keeps humans in the loop at key gates:

**For Task Selection**:

- Connect agent to issue tracker / backlog
- Agent _proposes_ next task based on priority signals
- Human approves before execution begins
- Start with low-risk task types; expand scope as trust builds

**For Outcome Monitoring**:

- Ops monitoring and observability integration
- Customer/stakeholder feedback channels (Slack, support tickets)
- Agent surfaces observations; humans interpret and act
- Over time, agent may suggest responses for human approval

**For Operating Values**:

- Document values explicitly, including tensions
- Capture in CLAUDE.md or similar living document
- Review and refine based on monitoring observations
- Accept that values evolve; it's not set-and-forget

### Why This Is Hard Today

Most agentic coding tools are designed to keep the user in control. This is intentional:

- Reliable coordination is largely unsolved at scale
- Autonomous operation requires arriving at multiple capabilities simultaneously
- Products can't easily offer this in ways customers can integrate
- Trust must be earned incrementally
- **Human review remains the primary quality gate**, limiting throughput gains

This pattern describes a destination. The journey requires patience.

## Costs & Benefits

### Benefits

- **Reduces scheduling overhead**: Agent proposes work, human just approves/rejects
- **Responsive to real signals**: Priorities adjust based on actual impact
- **Accumulated context**: Agent builds understanding over time
- **Prepares for future**: Establishes infrastructure for greater autonomy as tooling matures

### Costs

- **High prerequisites**: Requires solid coordination foundation first
- **Complex integration**: Needs connections to backlogs, monitoring, feedback channels
- **Review bottleneck**: Human review still required; throughput gains are modest
- **Trust calibration**: Too much autonomy too soon leads to wasted effort or damage
- **Ongoing governance**: Operating values require maintenance as context evolves

## When to Use

- Mature teams with established CI/CD, testing, and code review practices
- High volume of well-defined, low-risk tasks that follow patterns
- When human _scheduling_ (not review) is the primary bottleneck
- Organisations ready to invest in agent infrastructure
- Teams willing to maintain human review as a hard constraint

## When NOT to Use

- Early-stage projects where requirements are still forming
- Teams without solid coordination foundations (tests, CI, code review)
- When you haven't yet established clear values and priorities
- If you expect this to eliminate human review (it won't)

## Related Patterns

- **Detached Agent**: Provides the execution infrastructure; Autonomous Agent adds task selection
- **Context Library**: Informs operating values with "what good looks like"
- **Skills Library**: Enables consistent coordination
- **Golden Path Anchor**: A form of outcome monitoring for drift detection

## Sources

- [The Levels of Agentic Coding](https://timkellogg.me/blog/2026/01/20/agentic-coding-vsm), Tim Kellogg
- Viable System Model, Stafford Beer (1971)
