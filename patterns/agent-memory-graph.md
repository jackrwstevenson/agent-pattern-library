# Agent Memory Graph

> **Pattern in Research**: This pattern describes a direction rather than current best practice. Purpose-built agent memory tooling is early-stage, and the overhead of graph-based coordination may not justify itself for single-agent or simple workflows. Treat this as a lens for understanding multi-agent coordination needs, not a recommendation for immediate adoption.

## Sketch

![Agent Memory Graph](../docs/assets/agent-memory-graph.png)

## Problem

Agents managing multi-step work use flat files (TODO.md, task lists) for memory, but these break down as complexity grows:

- **No dependencies**: Flat lists cannot express "task B is blocked by task A"
- **Merge conflicts**: Sequential IDs collide when multiple agents work in parallel
- **Unbounded growth**: Completed tasks accumulate, consuming context with irrelevant history
- **No coordination primitives**: Two agents can claim the same task simultaneously
- **Lost lineage**: Subtasks lose their connection to parent goals

These problems are manageable for a single agent on a small task. They become acute with multi-agent workflows, long-running projects, or hierarchical task decomposition.

## Solution

Replace flat task files with a structured graph that tracks dependencies, supports safe multi-agent coordination, and compacts history to stay within context limits.

### Core Mechanisms

**Dependency-aware graph**: Tasks link via explicit relationships (blocks, blocked-by, relates-to, supersedes). Agents query for ready tasks - those with zero open blockers - rather than scanning the full list.

**Hash-based identifiers**: Tasks use collision-resistant IDs (e.g. `bd-a1b2`) rather than sequential numbers. Multiple agents creating tasks simultaneously never collide.

**Hierarchical decomposition**: Tasks decompose into subtasks (e.g. `bd-a1b2.1`, `bd-a1b2.1.1`) preserving parent-child lineage. Agents can zoom in or out on the task tree.

**Semantic compaction**: When tasks close, their content is summarised and the full detail is archived. The graph stays compact without losing institutional knowledge.

**Atomic claims**: A single operation claims a task and marks it in-progress, preventing race conditions in multi-agent scenarios.

## Costs and Benefits

### Benefits

- **Safe parallelism**: Multiple agents work concurrently without task conflicts
- **Intelligent sequencing**: Agents automatically identify actionable work via dependency resolution
- **Bounded context**: Compaction keeps the working set small regardless of project history
- **Preserved knowledge**: Summarised history retains learnings without consuming active context
- **Hierarchical planning**: Complex goals decompose naturally into trackable sub-goals

### Costs

- **Tooling required**: Needs purpose-built infrastructure, not just a text file
- **Complexity**: Graph management is more complex than a simple list
- **Learning curve**: Agents (and humans) must understand graph operations
- **Overhead for small tasks**: A single agent on a simple task doesn't need this machinery

## When to Use

- Multi-agent workflows where coordination is essential
- Long-running projects spanning multiple sessions
- Hierarchical task decomposition with complex dependencies
- Teams wanting persistent, structured agent memory across sessions

## When Not to Use

- Single-agent, single-session tasks
- Simple linear workflows with no dependencies
- When a flat TODO.md is genuinely sufficient

## Related Patterns

- Enables [Agent Swarm](agent-swarm.md) by providing the coordination layer for parallel workers
- Supports [Autonomous Agent](autonomous-agent.md) by giving agents structured task selection
- Complements [Detached Agent](detached-agent.md) where issue trackers serve a similar but less agent-native purpose

## Sources

- [Beads: A Coding Agent Memory System](https://github.com/steveyegge/beads) - Steve Yegge
