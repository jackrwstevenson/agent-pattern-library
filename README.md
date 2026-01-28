# Agent Pattern Library

An attempt to make sense of emerging patterns in AI-assisted software development, drawn from research, personal observations and experiments.

## Patterns

### Grounding

Ensuring agents work from accurate, authoritative information.

| Pattern | Description | Novel Insight |
| ------- | ----------- | ------------- |
| [Context Library](patterns/context-library.md) | Curate reference material (standards, architecture, design system, domain knowledge) that agents consult to understand WHAT good looks like. | Gives agents institutional memory - they read this context to understand your world before generating anything. |
| [Authoritative Source Anchor](patterns/authoritative-source-anchor.md) | Embed authoritative external specifications (web standards, RFCs, regulatory docs) directly in the repository so agents can cite rather than recall. | Transforms "I think the spec says..." into "Section 4.3.2 states...", grounding agent decisions in verifiable facts and enabling longer autonomous runs. |
| [Code Archaeologist](patterns/code-archaeologist.md) | Reverse-engineer legacy codebases to extract implicit business rules, data models, and constraints before replacement begins. | Forces explicit retain/discard/modernise decisions rather than accidental preservation or loss of tribal knowledge encoded only in code. |

### Workflow

Structuring how agents perform work.

| Pattern | Description | Novel Insight |
| ------- | ----------- | ------------- |
| [Specify Plan Ship](patterns/specify-plan-ship.md) | A three-phase development workflow (Specify, Plan, Implement with TDD) that uses explicit documents and verification gates to maintain quality in AI-assisted coding. | Compensates for LLM limitations (finite context, no persistent memory) by externalising working memory into structured documents that serve as stable reference points across sessions. |
| [Throwaway Spike](patterns/throwaway-spike.md) | Rapid throwaway prototypes with explicit constraints, safety guardrails, and human decision gates. | Adds agent-specific guardrails to the classic XP spike, preventing clean-looking AI output from being accidentally promoted to production. |
| [Skills Library](patterns/skills-library.md) | Package procedures as executable skills that agents follow to perform tasks consistently - the HOW of your organisation. | Transforms tribal knowledge into repeatable workflows; agents execute these skills rather than improvising each time. |

### Scale

Operating beyond single-agent constraints.

| Pattern | Description | Novel Insight |
| ------- | ----------- | ------------- |
| [Agent Swarm](patterns/agent-swarm.md) | Deploy hierarchical swarms of planning and worker agents; intelligent task decomposition enables massive parallelism without merge conflicts. | Demonstrates that a single engineer plus thousands of coordinated agents can produce substantial codebases by making decomposition, not coordination, the hard problem. |
| [Detached Agent](patterns/detached-agent.md) | Use issue trackers as task queues for AI agents executing in sandboxed cloud environments, decoupling interface from execution. | Gains audit trails, team accessibility, and security isolation without requiring local development setup. |
| [Context Bypass](patterns/context-bypass.md) | Delegate data-heavy operations to local APIs and return only compact results, avoiding context window limits entirely. | Inverts the data flow: bring the model's intent to the data, not data to the model. |
| [Autonomous Agent](patterns/autonomous-agent.md) | Enable agents to select tasks from backlogs, monitor outcomes, and operate under defined values; moving beyond reactive prompting toward self-direction. | Identifies the prerequisites and scaling paradox: human review remains essential, shifting the bottleneck from scheduling to verification. |

### Evolution

Keeping systems current as dependencies change.

| Pattern | Description | Novel Insight |
| ------- | ----------- | ------------- |
| [Regen](patterns/regen.md) | Treat specifications and implementations as functions of their inputs; when inputs change, outputs regenerate. | Makes regeneration economical - agents draft, humans review - so systems evolve with their dependencies rather than calcifying. |
| [Golden Path Anchor](patterns/golden-path-anchor.md) | AI continuously detects drift between production codebases and a reference application, then auto-generates contextual PRs to propagate best practices. | Transforms reference applications from passive templates into active, living standards that propagate automatically. |
| [Spec Library](patterns/spec-library.md) | Distribute specifications and tests as the library; AI generates language-specific implementations on demand. | Inverts software distribution by treating code as ephemeral and regenerable, while specifications and tests become the preserved artefacts. |

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

Credit to Chris Hay, Birgitta Böckeler, Simon Willison, Gergely Orosz, Drew Breunig, Wilson Lin, Tim Kellogg, Addy Osmani & Jesse Vincent on being the inspration for the patterns within.
