---
name: Generation Memory
description: Give agents an external progress log that persists across context window compactions, preventing repeated work in long sessions.
category: Observability
maturity: trial
---

# Generation Memory

> **In plain terms:** In long AI sessions, the system silently discards earlier messages to make room for new ones. The agent forgets what it's already done and starts repeating itself. A generation memory is a simple progress log the agent writes to and reads from, surviving these memory compactions.
>
> **What is it?** An external progress log that the agent writes to during work and reads to recover context after the system compresses earlier messages.
> **What's in it for you?** Agents maintain coherence across long sessions instead of repeating work or contradicting earlier decisions.
> **What are the trade-offs?** Small overhead per step; log quality depends on the agent's ability to summarise its own work accurately.

Long agent sessions have a subtle failure mode that's easy to miss. Modern LLMs operate within finite context windows, and when a session grows long enough, the system compacts earlier messages to make room. This is necessary, but it means the agent silently loses awareness of work it has already completed.

The symptoms are familiar to anyone who's run extended generation sessions. The agent re-implements a function it already wrote. It asks a question it already answered. It revisits a decision it already made. It loses track of which tasks are done and which remain. The context window has moved on, and the agent's working memory has moved on with it.

[Session Checkpoint](session-checkpoint.md) solves a different problem: rollback and replay. [Agent Memory Graph](agent-memory-graph.md) solves another: multi-agent coordination. Neither addresses the specific problem of a single agent maintaining awareness of its own work during a long session.

## How It Works

The approach gives the agent an external log of its own work that persists in a file, outside the context window. The agent writes to this log as it progresses and reads from it when it needs to recall what has happened.

A typical implementation uses a PROGRESS.md file within the feature's working directory. After each meaningful step, the agent appends a structured entry: what it did, what it decided, what it produced, and what comes next. When the context window compacts and the agent loses its earlier messages, the log remains. The agent can read it to reconstruct where it is.

### What Gets Logged

Each entry captures the step completed, the key decisions made and why, the files created or modified, any assumptions recorded, and the next step to take. The log is append-only during a session. Entries are concise: enough to reconstruct the thread, not a transcript of everything the agent said.

### Why This Works

The mechanism is simple but the effect is significant. Without it, agents on long sessions degrade gradually. With it, they maintain coherence across context compactions because the log provides continuity that the context window cannot.

The log also has a secondary benefit: it creates a human-readable record of the generation process. When reviewing agent output, you can read the log to understand the sequence of decisions that led to the current state. This is less detailed than [Session Checkpoint](session-checkpoint.md) but available immediately, without replay infrastructure.

### Beyond Single Sessions: Organisational Learning

Within-session memory solves immediate continuity, but a more powerful application extends the same principle across sessions. Osmani describes a structured reflection cycle: after every task, the agent writes a REFLECTION.md covering what surprised it, one pattern worth adding to the context library, and one prompt improvement. The lead reviews these proposals and merges approved learnings into the team's shared context.

This transforms generation memory from a single-agent continuity mechanism into an organisational learning system. Session 1 discovers a gotcha. Session 2 benefits from that discovery. Knowledge compounds across time rather than being rediscovered.

The Beads pattern (from Steve Yegge's Gastown) takes this further: immutable, git-backed records of every decision and outcome with full provenance, structured as queryable task graphs with a SQL-addressable data plane. This provides richer institutional memory than flat markdown logs, because past decisions can be traversed and queried rather than merely read sequentially.

### Relationship to Context Compaction

This pattern exists because of a specific technical limitation: context window compaction discards earlier messages. If models eventually gain unlimited context with perfect recall, the within-session aspect becomes unnecessary. But the cross-session organisational learning aspect remains valuable regardless of context window size — it solves a knowledge management problem, not a technical limitation.

## The Trade-offs

The benefits are clear. Agents maintain coherence across long sessions. Repeated work and contradictory decisions decrease. Humans get a readable record of the generation process. And the mechanism is simple to implement: it's a file and a convention, not infrastructure.

The costs are modest but real. The agent must be disciplined about writing to the log, which consumes tokens and adds a small overhead to each step. The log can grow large on very long sessions, itself consuming context when read. And the quality of the log depends on the agent's ability to summarise its own work accurately, which isn't guaranteed.

## When to Use It

This pattern pays off for long generation sessions spanning many tasks or files, multi-step workflows like [Specify Plan Ship](specify-plan-ship.md) where the agent works through a plan over an extended period, complex features where decisions made early in the session affect later steps, and any situation where you've observed agents losing the thread during extended work.

It's unnecessary for short, single-task interactions where context compaction won't occur, workflows that are already broken into independent sessions (one session per task), and environments where the model's context window is large enough to hold the entire session.

## Maturity

**Trial.** This solves a real problem with a simple mechanism, and I use it on long sessions. The within-session aspect may become less necessary as models gain longer context windows, but the cross-session organisational learning aspect is model-independent and increasingly important as teams scale agent usage.

## Further Reading

- [The Code Agent Orchestra](https://addyosmani.com/blog/code-agent-orchestra/) - Addy Osmani on REFLECTION.md proposals for compound learning across sessions, and the Beads pattern for queryable institutional memory
