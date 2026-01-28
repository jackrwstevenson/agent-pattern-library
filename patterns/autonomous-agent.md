# Autonomous Agent

> **Pattern in Research**: This pattern describes a direction rather than current best practice. The prerequisites are steep, the tooling is immature, and **human review of all agent contributions remains essential**. Treat this as a lens for evaluating where agentic tooling is headed, not a recommendation for immediate adoption.

## Problem

Current AI coding tools are **reactive**: humans prompt, agents execute. The human remains the scheduler, deciding what gets worked on and when. This creates bottlenecks:

- **Human as dispatcher**: Every task requires someone to assign it
- **Priority blindness**: Agent doesn't know what's burning vs. what can wait
- **No self-awareness**: Agent can't tell if its work is actually helping

The same reactive pattern plagues maintenance and operations: dependency rot accumulates unnoticed, releases follow calendars rather than evidence, and governance is bolted on rather than built in.

## Solution

Enable agents to operate as self-sustaining contributors through three capabilities:

**Task Selection**: Agent proposes what to work on based on priority, urgency, and capacity. At maturity, agents scan codebases and runtime signals to spot dependency rot, outdated frameworks, and performance regressions, recommending targeted refactoring that keeps the tech estate lean.

**Outcome Monitoring**: Agent observes signals (incidents, feedback, metrics) and adjusts focus. At maturity, delivery becomes a closed-loop learning system where telemetry and user feedback prioritise features, tune rollouts, and trigger experiments automatically.

**Operating Values**: Agent operates under defined principles that provide the framework for resolving conflicts. Values should be in productive tension ("think big" vs "deliver quickly"). At maturity, this enables dynamic governance: continuous compliance checks, licence monitoring, and policy enforcement that adapt as the stack changes.

Together these capabilities turn shipped systems into self-improving platforms where architecture, delivery, and governance co-evolve.

### Sketch

![Autonomous Agent Sketch](assets/autonomous-agent.png)

### The Constraint

Full autonomy promises to remove human scheduling as a bottleneck. But today, **human review of all agent output is non-negotiable**; code review, PR approval, and verification remain essential guardrails.

This shifts the bottleneck from "deciding what to work on" to "reviewing what was done." True scaling requires advances in agent reliability, automated verification, and trust calibration. Until then, this pattern increases throughput modestly while introducing coordination overhead.

### Getting Started

The progression matters: reliable coordination (git, tests, linters) must work before agents choose their own work. Task selection and monitoring should arrive together; one without the other leads to optimising for the wrong things or thrashing.

**Task Selection**: Connect agent to issue tracker. Agent proposes next task; human approves before execution. Start with low-risk task types and expand as trust builds.

**Outcome Monitoring**: Integrate ops monitoring and feedback channels. Agent surfaces observations; humans interpret and act. Over time, agent suggests responses for human approval.

**Operating Values**: Document values explicitly in CLAUDE.md or similar. Include productive tensions. Review and refine based on monitoring; values evolve.

## Costs & Benefits

**Benefits**: Reduces scheduling overhead. Priorities adjust based on actual impact. Agent accumulates context over time. Establishes infrastructure for greater autonomy as tooling matures.

**Costs**: High prerequisites (solid coordination foundation). Complex integration (backlogs, monitoring, feedback channels). Human review still required. Operating values need ongoing maintenance.

## When to Use

- Mature teams with established CI/CD, testing, and code review
- High volume of well-defined, low-risk tasks
- When human scheduling (not review) is the bottleneck
- Teams willing to maintain human review as a hard constraint

## When NOT to Use

- Early-stage projects with forming requirements
- Teams without solid coordination foundations
- If you expect this to eliminate human review

## Related Patterns

- [Detached Agent](detached-agent.md): Execution infrastructure; Autonomous Agent adds task selection
- [Context Library](context-library.md): Informs operating values with "what good looks like"
- [Skills Library](skills-library.md): Enables consistent coordination
- [Golden Path Anchor](golden-path-anchor.md): Outcome monitoring for drift detection

## Sources

- [The Levels of Agentic Coding](https://timkellogg.me/blog/2026/01/20/agentic-coding-vsm), Tim Kellogg
- Viable System Model, Stafford Beer (1971)
