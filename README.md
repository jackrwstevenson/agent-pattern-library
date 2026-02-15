# Agent Pattern Library

An attempt to make sense of emerging patterns in AI-assisted software development, drawn from research, personal observations and experiments.

## Patterns

### Grounding

Ensuring agents work from accurate, authoritative information.

| Pattern                                                                | Description                                                                                                                                          | Novel Insight                                                                                                                            |
| ---------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| [Context Library](patterns/context-library.md)                         | Curate reference material (standards, architecture, design system, domain knowledge) that agents consult to understand WHAT good looks like.         | Gives agents institutional memory - they read this context to understand your world before generating anything.                          |
| [Authoritative Source Anchor](patterns/authoritative-source-anchor.md) | Embed authoritative external specifications (web standards, RFCs, regulatory docs) directly in the repository so agents can cite rather than recall. | Ground agent decisions in verifiable facts and enable longer autonomous runs.                                                            |
| [Code Archaeologist](patterns/code-archaeologist.md)                   | Reverse-engineer legacy codebases to extract implicit business rules, data models, and constraints before replacement begins.                        | Forces explicit retain/discard/modernise decisions rather than accidental preservation or loss of tribal knowledge encoded only in code. |

### Workflow

Structuring how agents perform work.

| Pattern                                            | Description                                                                                                                                                           | Novel Insight                                                                                                                                                                           |
| -------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Specify Plan Ship](patterns/specify-plan-ship.md) | A three-phase development workflow (Specify, Plan, Implement with TDD) that uses explicit documents and verification gates to maintain quality in AI-assisted coding. | Compensates for LLM limitations (finite context, no persistent memory) by externalising working memory into structured documents that serve as stable reference points across sessions. |
| [Throwaway Spike](patterns/throwaway-spike.md)     | Rapid throwaway prototypes with explicit constraints, safety guardrails, and human decision gates.                                                                    | Adds agent-specific guardrails to the classic XP spike, preventing clean-looking AI output from being accidentally promoted to production.                                              |
| [Skills Library](patterns/skills-library.md)       | Package procedures as executable skills that agents follow to perform tasks consistently - the HOW of your organisation.                                              | Transforms tribal knowledge into repeatable workflows; agents execute these skills rather than improvising each time.                                                                   |
| [Digital Twin](patterns/digital-twin.md)           | Clone the observable behaviour of third-party dependencies into local replicas for deterministic, high-volume testing.                                                | Moves beyond hand-written mocks to behavioural replicas validated against the real service, giving agents a fast, reliable integration test target.                                     |
| [Session Checkpoint](patterns/session-checkpoint.md) | Capture agent sessions with rollback capability, shadow branches for metadata, and auto-summarisation.                                                              | Preserves the reasoning behind agent-assisted code changes as replayable, recoverable history without polluting the code branch.                                                       |
| [Validation Constraint](patterns/validation-constraint.md) | Validate agent output through externally observable behaviour (tests, monitoring) rather than line-by-line code review.                                        | Treats generated code like ML model weights - opaque internals validated through outputs - letting automated checks scale with agent throughput.                                        |

### Scale

Operating beyond single-agent constraints.

| Pattern                                          | Description                                                                                                                                              | Novel Insight                                                                                                                                        |
| ------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Agent Swarm](patterns/agent-swarm.md)           | Deploy hierarchical swarms of planning and worker agents; intelligent task decomposition enables massive parallelism without merge conflicts.            | Demonstrates that a single engineer plus thousands of coordinated agents can produce substantial codebases by making decomposition the hard problem. |
| [Detached Agent](patterns/detached-agent.md)     | Use issue trackers as task queues for AI agents executing in sandboxed cloud environments, decoupling interface from execution.                          | Gains audit trails, team accessibility, and security isolation without requiring local development setup.                                            |
| [Context Bypass](patterns/context-bypass.md)     | Delegate data-heavy operations to local APIs and return only compact results, avoiding context window limits entirely.                                   | Inverts the data flow: bring the model's intent to the data, not data to the model.                                                                  |
| [Autonomous Agent](patterns/autonomous-agent.md) | Enable agents to select tasks from backlogs, monitor outcomes, and operate under defined values; moving beyond reactive prompting toward self-direction. | Identifies the prerequisites and scaling paradox: human review remains essential, shifting the bottleneck from scheduling to verification.           |
| [Pyramid Summary](patterns/pyramid-summary.md)   | Build reversible multi-level summaries so agents can navigate between system overview and full source detail on demand.                                   | Enables comprehension of systems that exceed context limits through selective expansion rather than lossy compression.                                |
| [Agent Memory Graph](patterns/agent-memory-graph.md) | Replace flat task files with dependency-aware graphs supporting safe multi-agent coordination and semantic compaction.                                 | Provides the coordination primitives (atomic claims, hash-based IDs, ready-state detection) that flat TODO files lack for parallel agent work.       |

### Evolution

Keeping systems current as dependencies change.

| Pattern                                              | Description                                                                                                                                             | Novel Insight                                                                                                                               |
| ---------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| [Regen](patterns/regen.md)                           | Treat specifications and implementations as functions of their inputs; when inputs change, outputs regenerate.                                          | Makes regeneration economical - agents draft, humans review - so systems evolve with their dependencies rather than calcifying.             |
| [Golden Path Anchor](patterns/golden-path-anchor.md) | AI continuously detects drift between production codebases and a reference application, then auto-generates contextual PRs to propagate best practices. | Transforms reference applications from passive templates into active, living standards that propagate automatically.                        |
| [Spec Library](patterns/spec-library.md)             | Distribute specifications and tests as the library; AI generates language-specific implementations on demand.                                           | Inverts software distribution by treating code as ephemeral and regenerable, while specifications and tests become the preserved artefacts. |
| [Semantic Port](patterns/semantic-port.md)           | Use AI agents to port code between languages or frameworks, preserving intent and producing idiomatic output rather than mechanical translation.        | Goes beyond transpilation by mapping idioms and conventions, not just syntax, producing code that reads as native to the target ecosystem.  |

## Pattern Relationships

Some noteworthy relationships:

**Starting a project**

- [Code Archaeologist](patterns/code-archaeologist.md) + [Context Library](patterns/context-library.md) + [Specify Plan Ship](patterns/specify-plan-ship.md): For brownfield projects, extract legacy knowledge first, then feed it into specification.
- [Context Library](patterns/context-library.md) + [Specify Plan Ship](patterns/specify-plan-ship.md): For greenfield projects, load organisational standards before specifying.

**Maintaining consistency at scale**

- [Context Library](patterns/context-library.md) + [Skills Library](patterns/skills-library.md): Context defines WHAT good looks like; Skills define HOW to achieve it. Skills reference Context.
- [Skills Library](patterns/skills-library.md) + [Golden Path Anchor](patterns/golden-path-anchor.md): Distribute executable procedures and automatically align codebases with reference implementations.
- [Context Library](patterns/context-library.md) + [Regen](patterns/regen.md): When standards evolve, regenerate affected specs and implementations.

**Handling large data or async work**

- [Context Bypass](patterns/context-bypass.md): When data exceeds context limits, delegate to local APIs.
- [Detached Agent](patterns/detached-agent.md): When you want fire-and-forget task execution with security isolation.

**Increasing agent autonomy**

- [Detached Agent](patterns/detached-agent.md) + [Autonomous Agent](patterns/autonomous-agent.md): Detached Agent provides the execution infrastructure; Autonomous Agent adds task selection and outcome monitoring.
- [Skills Library](patterns/skills-library.md) + [Autonomous Agent](patterns/autonomous-agent.md): Skills define reliable coordination; a prerequisite before agents can self-direct.
- [Agent Swarm](patterns/agent-swarm.md): Scales parallelism through hierarchical coordination; planners decompose, workers execute.

**Testing and validation**

- [Digital Twin](patterns/digital-twin.md) + [Validation Constraint](patterns/validation-constraint.md): Clone dependencies for deterministic testing; validate agent output through observable behaviour rather than code review.
- [Validation Constraint](patterns/validation-constraint.md) + [Specify Plan Ship](patterns/specify-plan-ship.md): TDD in Specify Plan Ship naturally produces the test suite that Validation Constraint relies on.

**Agent memory and observability**

- [Agent Memory Graph](patterns/agent-memory-graph.md) + [Agent Swarm](patterns/agent-swarm.md): The memory graph provides coordination primitives (atomic claims, dependency tracking) that swarms need.
- [Session Checkpoint](patterns/session-checkpoint.md) + [Agent Swarm](patterns/agent-swarm.md): Track concurrent agent sessions independently with rollback capability.
- [Pyramid Summary](patterns/pyramid-summary.md) + [Context Bypass](patterns/context-bypass.md): Pyramid Summary handles comprehension of large systems; Context Bypass handles data-heavy processing. Different tools for different scaling problems.

**Cross-language distribution**

- [Semantic Port](patterns/semantic-port.md) + [Spec Library](patterns/spec-library.md): Specs define what to implement; Semantic Port generates idiomatic implementations across languages.
- [Semantic Port](patterns/semantic-port.md) + [Regen](patterns/regen.md): When the source evolves, the port regenerates automatically.

**Exploration vs production**

- [Throwaway Spike](patterns/throwaway-spike.md): Validate ideas quickly with explicit throwaway markers.
- [Specify Plan Ship](patterns/specify-plan-ship.md): Build production code with full process once spike proves the idea.

## Contributing

Contributions welcome. To add a new pattern:

1. Create a markdown file in `patterns/<pattern-name>.md`
2. Follow the pattern template (see existing patterns)
3. Submit a PR

If you spot a pattern that isn't listed here, it may be too well-known for me to bother distilling, or I simply haven't discovered it yet :-). PRs and issues pointing out gaps are appreciated.

## Inspiration

Credit to Chris Hay, Birgitta Böckeler, Simon Willison, Gergely Orosz, Drew Breunig, Wilson Lin, Tim Kellogg, Addy Osmani, Jesse Vincent, Steve Yegge, StrongDM & Entire.io on being the inspiration for the patterns within.
