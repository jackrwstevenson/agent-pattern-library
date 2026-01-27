# Agent Swarm

> **Pattern in Research**: This pattern describes a direction rather than current best practice. Demonstrated in specific high-resource contexts (dedicated hardware, thousands of concurrent agents) but not yet widely reproduced. Infrastructure requirements are steep, decomposition strategies are still being understood, and **human review remains essential** even if done via sampling. Treat this as a lens for evaluating where agentic tooling is headed, not a recommendation for immediate adoption.

## Problem

Scaling from one agent to many creates coordination problems. Multiple agents working on the same codebase simultaneously:

- **Merge conflicts**: Agents modify the same files, creating conflicts that require manual resolution
- **Duplicated work**: Without visibility into what others are doing, agents solve the same problems independently
- **Breaking changes**: One agent's refactoring invalidates another agent's in-flight work
- **Integration failures**: Independently correct changes combine into broken states

The naive approach of "just run more agents" quickly degrades. Conflict resolution and rework consume the time gained from parallelism. Beyond a handful of concurrent agents, throughput plateaus or declines.

## Solution

Deploy a hierarchical swarm of agents: planning agents decompose work into non-overlapping tasks, worker agents execute those tasks in parallel. The decomposition strategy minimises merge conflicts by design. Design the swarm so human engineers remain in the loop to review, approve, and intervene on accuracy, security, and/or architecture sensitive changes.

### How It Works

1. **Hierarchical structure**: Planning agents sit above worker agents in a tree
2. **Task decomposition**: Planners break complex work into discrete, non-overlapping assignments
3. **Parallel execution**: Workers execute assigned tasks concurrently
4. **Conflict minimisation**: Decomposition deliberately avoids simultaneous work on shared code
5. **Error tolerance**: Small errors in intermediate commits get fixed quickly rather than blocking progress
6. **Human-in-the-loop controls**: Human reviewers sample or are automatically flagged on high-risk changes (security, public APIs, architectural boundaries) and gate merges for release branches.

### Architecture

```
                    ┌─────────────┐
                    │   Planner   │
                    │   (root)    │
                    └──────┬──────┘
           ┌───────────────┼───────────────┐
           ▼               ▼               ▼
    ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
    │  Planner    │ │  Planner    │ │  Planner    │
    │ (subsystem) │ │ (subsystem) │ │ (subsystem) │
    └──────┬──────┘ └──────┬──────┘ └──────┬──────┘
           │               │               │
     ┌─────┼─────┐   ┌─────┼─────┐   ┌─────┼─────┐
     ▼     ▼     ▼   ▼     ▼     ▼   ▼     ▼     ▼
   Worker agents execute discrete, non-overlapping tasks
```

_Note: Exact hierarchy depth varies by implementation. FastRender used planners assigning to workers; the multi-tier structure above is illustrative._

Humans validate, approve, and merge high-risk or cross-cutting changes.

### Why This Works

The key insight is that **intelligent decomposition prevents coordination problems**. Rather than letting agents discover conflicts at merge time, planners proactively divide work so agents operate on disjoint code.

This works because:

- **Code is decomposable**: Most systems have natural boundaries (modules, files, functions)
- **Small errors are cheap**: Syntax errors and API mismatches get fixed in subsequent commits
- **Autonomous operation**: Once initiated, swarms can run for extended periods (up to a week) without human steering
- **Humans preserve judgment**: Agents reliably produce boilerplate, refactors, and optimisations at scale; human engineers focus on correctness, edge cases, security regressions, and architectural decisions.

## Costs and Benefits

### Benefits

- **Massive parallelism**: Thousands of concurrent contributors
- **Reduced wall-clock time**: Large projects complete in weeks instead of months
- **Subsystem isolation**: Dedicated machines per subsystem reduce interference
- **Error tolerance**: Individual errors get fixed in subsequent commits rather than halting progress
- **Human oversight where it matters**: Agents free engineers from repetitive work so humans can concentrate on review, security, and architectural integrity.

### Costs

- **Infrastructure complexity**: Orchestration, monitoring, and compute resources
- **Decomposition effort**: Requires understanding of codebase structure
- **Quality variance**: Output quality varies across agents and tasks
- **Debugging difficulty**: Tracing issues across swarm history is harder
- **Human review overhead**: Mandatory checkpoints and targeted reviews add process overhead, acceptable tradeoff to maintain correctness, security, and design intent.

## When to Use

- Large greenfield projects with clear architectural boundaries
- Codebases with naturally decomposable structure
- Projects where wall-clock time is a constraint
- Organisations with infrastructure to run many concurrent agents
- Work that benefits from specialisation (different agents for different subsystems)

## When NOT to Use

- Small projects where coordination overhead exceeds benefits
- Tightly-coupled code that resists decomposition
- Brownfield projects with unclear boundaries
- Teams without infrastructure to orchestrate multiple agents
- Work requiring deep cross-cutting changes

## Related Patterns

- [Detached Agent](detached-agent.md): Provides the async execution infrastructure swarms build on
- [Autonomous Agent](autonomous-agent.md): Individual agent self-direction; swarms add coordination across agents
- [Context Library](context-library.md): Shared standards keep swarm output consistent
- [Authoritative Source Anchor](authoritative-source-anchor.md): Shared specs ground swarm decisions

## Sources

- [FastRender development approach](https://simonwillison.net/2026/Jan/23/fastrender/) - Wilson Lin's use of ~2,000 concurrent agents generating 30,000+ commits
