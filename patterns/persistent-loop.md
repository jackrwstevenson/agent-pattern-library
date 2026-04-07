---
name: Persistent Loop
description: Run an agent in a loop until it can truthfully declare completion, with state persisted through files and honesty enforcement at the exit gate.
category: Harness Engineering
maturity: assess
---

# Persistent Loop

> **In plain terms:** Some tasks are too complex for a single AI pass but too unclear to plan upfront. This pattern runs the agent repeatedly with the same instructions, letting it pick up where it left off by reading its own files. A verification gate checks whether it's actually done.
>
> **What is it?** Running an agent in a loop, with each iteration starting fresh but discovering progress from previous iterations through files, until a verifiable completion condition is met.
> **What's in it for you?** Complex tasks complete without upfront decomposition, with each iteration getting a fresh context window.
> **What are the trade-offs?** Risk of repeated work across iterations and wasted compute; tasks that don't converge can burn resources.

Most agent workflows assume a single pass: the agent receives a task, does work, and finishes. When the task is too complex to complete in one pass, the usual response is either to break it into subtasks (adding orchestration complexity) or to let the agent run longer (trusting it to manage its own progress). Neither works well. Subtask decomposition requires understanding the task upfront, which is often the hard part. And long-running agents degrade: they lose track of earlier decisions, repeat work, and drift from the goal.

There is a simpler option. Run the agent repeatedly with the same prompt, letting it pick up where it left off by reading its own previous output from files. Each iteration starts fresh with full context capacity, but the accumulated work persists in the file system.

## How It Works

The approach runs an agent in a loop. Each iteration receives the same task prompt. The agent does work, modifying files in the repository. At the end of each iteration, a deterministic gate evaluates whether the task is complete. If not, the loop restarts with the same prompt. The agent discovers its progress by reading the files it modified in previous iterations.

### The Ralph Loop

Osmani describes a refined version of this pattern, originating with Geoffrey Huntley and Ryan Carson, that makes the cycle explicit: **Pick** the next task from a task file, **Implement** the change, **Validate** by running tests, types, and lint, **Commit** if checks pass (updating task status), and **Reset** by clearing the agent's context before starting fresh with the next task.

The key framing is _stateless-but-iterative_: the agent's context is wiped between iterations, avoiding hallucination accumulation and context degradation, but progress persists through git commits, the task state file, and the context library. Each iteration gets a fresh context window with full capacity, while the accumulated work remains in the file system.

### The Exit Gate

The critical mechanism is the exit gate. The agent declares completion by emitting a structured assertion: a specific statement that must be true for the task to be considered done. A deterministic check, not the agent itself, evaluates whether the assertion is justified.

The simplest form uses a promise tag. The task prompt includes a completion condition such as "all tests pass" or "the migration is complete." The agent emits a `<promise>` tag containing the condition only when it believes the condition is met. The exit gate extracts this tag, verifies the claim (by running tests, checking file state, or other deterministic checks), and either terminates the loop or restarts it.

### Honesty Enforcement

The most important constraint is that the agent must not lie to escape the loop. This sounds obvious, but agents under pressure to complete will sometimes declare success prematurely. The system prompt must make this explicit: the agent may only emit the completion assertion when the statement is completely and unequivocally true. Emitting a false assertion to exit the loop is a failure mode, not a success.

This constraint is easier to enforce than it sounds. When the exit gate independently verifies the assertion (running the test suite, for example), false declarations are caught. The agent learns, in context, that lying doesn't work.

### State Through Files

State management is deliberately simple. The agent's work product lives in the file system: code, tests, configuration, documentation. Each iteration reads these files to understand what has been done and what remains. There is no explicit state machine, no progress tracker, no coordination protocol. The files _are_ the state.

This simplicity is the pattern's main advantage over more sophisticated approaches. A [Generation Memory](generation-memory.md) log or [Agent Memory Graph](agent-memory-graph.md) provides richer coordination primitives, but requires infrastructure to maintain. The persistent loop needs nothing beyond a shell script and a file system.

### Iteration Limits and Kill Criteria

A hard iteration cap prevents runaway loops. The cap should be generous enough for legitimate work but firm enough to catch agents that are stuck. When the cap is hit, the system escalates to a human rather than continuing indefinitely. Tracking iteration counts in a simple state file provides visibility into how many attempts the task required.

Beyond the hard cap, Osmani recommends a softer kill-and-reassign rule: when an agent iterates 3+ times on the same error, kill it and reassign the task to a fresh agent rather than letting it continue. Stuck agents rarely unstick themselves; they repeat the same broken approach. A forced reflection step before each retry — requiring the agent to articulate what failed and what specific change would fix it — substantially cuts stuck loops by making self-correction explicit rather than hoping for it.

## The Trade-offs

The benefits are simplicity and resilience. The pattern requires minimal infrastructure: a loop, an exit gate, and a file system. Each iteration starts with a fresh context window, avoiding the quality degradation of long-running sessions. The agent naturally recovers from mistakes by reading corrected state on the next iteration. And the approach handles tasks whose scope is unclear, where upfront decomposition would be premature.

The costs are in efficiency and control. The agent may repeat work across iterations if it cannot efficiently determine what was already done. Each iteration pays the full cost of context loading. The pattern provides less visibility into progress than structured orchestration: you know how many iterations have run, but not what percentage of the work is complete. And tasks that require coordinated changes across many interdependent files may not converge, because each iteration's changes can invalidate previous work.

## When to Use It

This pattern suits tasks where the completion condition is clear but the path to get there is not, where upfront decomposition is difficult or premature, and where the work naturally accumulates in files that the agent can read on subsequent iterations. Migration tasks, large refactorings, and "make all tests pass" objectives are natural fits.

Avoid it for tasks requiring tight coordination across many agents (use [Agent Team](agent-team.md) instead), tasks where each iteration is expensive and progress per iteration is low, and work where the completion condition cannot be verified deterministically.

This pattern complements [Deterministic Orchestration](deterministic-orchestration.md): the loop provides persistence across iterations while deterministic hooks enforce constraints within each one. [Generation Memory](generation-memory.md) can augment the pattern by giving the agent an explicit log of what it has tried, reducing redundant work across iterations.

## Maturity

**Assess.** The technique is architecturally novel and demonstrably effective for convergent tasks like "make all tests pass." The main risks are convergence failure on complex tasks and wasted compute from repeated context loading. Worth experimenting with on well-scoped tasks with clear, verifiable completion conditions. Not yet proven on tasks requiring nuanced judgement about when "done" means done.

## Further Reading

- [The Code Agent Orchestra](https://addyosmani.com/blog/code-agent-orchestra/) - Addy Osmani on the Ralph Loop (Pick, Implement, Validate, Commit, Reset), kill criteria, and forced reflection steps
- [Ralph Wiggum Plugin](https://github.com/anthropics/claude-code/tree/main/plugins/ralph-wiggum) - Anthropic's implementation of the persistent loop pattern for Claude Code, including honesty enforcement and iteration tracking
- [Geoffrey Huntley's Ralph Wiggum Technique](https://ghuntley.com/specs) - The original description of the "run in a loop with the same prompt" approach
