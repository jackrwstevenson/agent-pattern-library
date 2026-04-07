---
name: Agent Team
description: Coordinate a small team of specialised agents through shared task lists, file ownership, and peer messaging for safe parallel execution.
category: Scale
maturity: assess
---

# Agent Team

> **In plain terms:** Running many AI agents in parallel sounds powerful, but without coordination they create merge conflicts, duplicate work, and break each other's changes. An agent team uses a lead agent to decompose work into owned tasks that specialist agents execute concurrently, coordinating through a shared task list and direct messaging.
>
> **What is it?** A structured team of 3-5 specialised agents coordinating through shared task lists, file ownership, peer-to-peer messaging, and worktree isolation.
> **What's in it for you?** Three focused agents consistently outperform one generalist working three times as long, with engineers focused on review rather than implementation.
> **What are the trade-offs?** Coordination infrastructure adds complexity; integration failures are common without rigorous guardrails and disciplined file ownership.

Scaling from one agent to many creates coordination problems that are harder than they first appear. Multiple agents working on the same codebase simultaneously produce merge conflicts that require manual resolution. Without visibility into what others are doing, agents solve the same problems independently. And independently correct changes combine into broken states at integration time.

The naive approach of "just run more agents" quickly degrades. Conflict resolution and rework consume the time gained from parallelism. Beyond a handful of concurrent agents, throughput plateaus or declines. A single agent hits three walls: context overload (large codebases overwhelm one context window), no specialisation (one agent juggling data layer, API, UI, and tests), and no coordination (even with spawned helpers, they cannot communicate or share a task list).

## How It Works

The approach deploys a structured team: a lead agent decomposes work into non-overlapping tasks, specialist agents execute those tasks in parallel, and coordination happens through shared infrastructure rather than through the lead. Human engineers remain in the loop to review, approve, and intervene on accuracy-sensitive, security-sensitive, and architecture-sensitive changes.

### Three-Layer Architecture

The most effective implementations converge on a three-layer structure.

_Layer 1: Team Lead._ A single coordinating agent decomposes work, creates the task list, reviews plans, and synthesises results. The lead is the only agent visible to the human operator. It never writes production code directly.

_Layer 2: Shared Task List._ A structured task registry with statuses (pending, in_progress, completed, blocked), explicit dependency tracking, and file locking. When an upstream task completes, blocked downstream tasks auto-unblock. This is the coordination backbone, without it, agents duplicate work or step on each other's files.

_Layer 3: Worker Agents._ Independent agent instances, each with its own context window, claiming tasks from the shared list. Workers run in isolated git worktrees (see below) and self-coordinate through peer-to-peer messaging rather than routing everything through the lead.

### Coordination Primitives

Three mechanisms keep agents from colliding.

_File ownership._ Each task explicitly declares which files the assigned agent may modify. No two agents edit the same file concurrently. This is enforced through the shared task list, not through trust.

_Peer-to-peer messaging._ Workers communicate directly with each other, a backend agent sends the API contract to the frontend agent without the lead acting as intermediary. This prevents the lead from becoming a bottleneck and lets agents share interface agreements as they emerge.

_Dependency resolution._ Tasks declare what they block and what blocks them. The task list resolves these automatically: when the data-layer agent marks its API endpoint complete, the test-writing agent's blocked task auto-transitions to claimable.

### Worktree Isolation

Each worker agent operates in its own git worktree, a lightweight, independent working copy of the repository on a dedicated branch. This provides conflict-free parallel execution without any merge coordination during work. Integration becomes an explicit phase after work completes, not a continuous hazard.

The lifecycle is straightforward: spin up a worktree and branch for a task, let the agent work in isolation, rebase and merge when done, clean up finished worktrees. Most multi-agent orchestration tools (Conductor, Agent Teams, Vibe Kanban, Claude Squad) handle this automatically.

### Hierarchical Decomposition

For large efforts, a flat team breaks down, one lead managing six or more specialists fragments the lead's context and creates coordination overhead. The remedy is teams of teams.

Instead of the lead spawning six workers directly, it spawns two or three feature leads. Each feature lead decomposes its scope into two or three specialists. The parent orchestrator manages only the feature leads, never seeing specialist details. This gives three levels of decomposition without exploding any single agent's context, mirroring the organisational structure that works in human teams (VP to tech lead to engineer).

### Three Tiers of Orchestration

Agent teams exist within a broader landscape of orchestration options, each suited to different contexts.

_Tier 1: In-process._ Subagents and agent teams running in a single terminal session. No external tooling required. Best for interactive work where the developer stays engaged.

_Tier 2: Local orchestrators._ Tools like Conductor, Vibe Kanban, and Claude Squad running 3-10 agents in isolated worktrees with visual dashboards and diff-first review UIs. Best for parallel feature sprints on known codebases.

_Tier 3: Cloud async._ [Detached Agent](detached-agent.md) platforms where tasks run in cloud VMs and return pull requests. Best for draining backlogs overnight.

Most teams use all three tiers: Tier 1 for interactive pairing, Tier 2 for parallel sprints, Tier 3 for overnight batch work.

### Guardrails

Explicit guardrails keep the team productive. Pre-commit checks and CI gates run before merges to main or release branches. Cyclomatic complexity, function length, and duplication thresholds block low-quality large commits. Automated AI pre-review agents annotate PRs and surface probable issues to human reviewers. And git-backed memory with a repository map and context-engineering layer ensures agents load only relevant context.

_WIP limits._ Run only 3-5 agents simultaneously, not because of compute, but because that is the ceiling on meaningful human review capacity. More agents producing unreviewed output is not parallelism; it is a queue of unverified work (see [Verification Bottleneck](verification-bottleneck.md)).

_Kill criteria._ When an agent iterates 3+ times on the same error, kill it and reassign the task to a fresh agent. Stuck agents rarely unstick themselves; they burn tokens repeating the same broken approach.

_Forced reflection._ Before each retry, require the agent to articulate what failed and what specific change would fix it. This substantially cuts stuck loops by making the agent self-correct rather than blindly repeating.

## The Trade-offs

Three focused agents consistently outperform one generalist working three times as long, for compounding reasons: parallelism (simultaneous work on frontend, backend, tests), specialisation (each agent sees only its owned files and writes better code), isolation (worktrees prevent merge conflicts during work), and compound learning (the [Context Library](context-library.md) accumulates patterns and gotchas across sessions, each session benefiting from previous ones).

Coordination infrastructure adds complexity beyond single-agent workflows. Tracing issues across team history is harder than single-agent debugging. Human review checkpoints add process overhead, though this is an acceptable trade-off for maintaining correctness. And the team is only as good as the task decomposition, poorly scoped tasks with overlapping file ownership collapse the benefits of isolation.

## When to Use It

This pattern works when you have both infrastructure and disciplined verification processes: explicit planning phases, pre-commit guardrails, CI that can reject noisy merges. The sweet spot is 3-5 specialised agents on work that decomposes naturally by file or module ownership. It suits organisations with work that benefits from specialisation across different subsystems.

Avoid it when you lack the processes to enforce guardrails, on small projects where coordination overhead exceeds benefits, with tightly-coupled code that resists decomposition, in brownfield projects with unclear boundaries, and for work requiring deep cross-cutting changes.

This builds on [Detached Agent](detached-agent.md) for async execution infrastructure. [Autonomous Agent](autonomous-agent.md) adds individual agent self-direction; teams add coordination across agents. [Context Library](context-library.md) and [Authoritative Source Anchor](authoritative-source-anchor.md) keep team output consistent and grounded. And [Agent Memory Graph](agent-memory-graph.md) provides the coordination primitives that teams need for parallel work.

## Maturity

**Assess.** Demonstrated in controlled settings with impressive throughput, and the coordination primitives (shared task lists, file locking, peer messaging) are now shipping in tools like Claude Code Agent Teams, Conductor, and Vibe Kanban. Most teams lack the guardrails and decomposition discipline to make this work reliably, but the infrastructure gap is closing fast.

## Further Reading

- [The Code Agent Orchestra](https://addyosmani.com/blog/code-agent-orchestra/) - Addy Osmani on multi-agent coordination, the three-tier orchestration landscape, and concrete coordination primitives
- [FastRender development approach](https://simonwillison.net/2026/Jan/23/fastrender/) - Wilson Lin's use of ~2,000 concurrent agents generating 30,000+ commits (via Simon Willison's Weblog)
