# Agent Pattern Library

This is my attempt to make sense of the emerging patterns in AI-assisted software development. The patterns here are drawn from research, personal observations, and a fair amount of experimentation. Some are well-established; others are directions I find promising but wouldn't yet call best practice. I've tried to be honest about which is which.

## Patterns

### Grounding

These patterns ensure agents work from accurate, authoritative information rather than inventing their own.

| Pattern | Description | Novel Insight |
| --- | --- | --- |
| [Context Library](patterns/context-library.md) | Curate reference material (standards, architecture, design system, domain knowledge) that agents consult to understand WHAT good looks like. | Gives agents institutional memory; they read this context to understand your world before generating anything. |
| [Authoritative Source Anchor](patterns/authoritative-source-anchor.md) | Embed authoritative external specifications (web standards, RFCs, regulatory docs) directly in the repository so agents can cite rather than recall. | Grounds agent decisions in verifiable facts and enables longer autonomous runs. |
| [Code Archaeologist](patterns/code-archaeologist.md) | Reverse-engineer legacy codebases to extract implicit business rules, data models, and constraints before replacement begins. | Forces explicit retain/discard/modernise decisions rather than accidental preservation or loss of tribal knowledge encoded only in code. |

### Workflow

These patterns structure how agents perform work, compensating for the limitations that make unstructured agent use unreliable.

| Pattern | Description | Novel Insight |
| --- | --- | --- |
| [Specify Plan Ship](patterns/specify-plan-ship.md) | A three-phase development workflow (Specify, Plan, Implement with TDD) that uses explicit documents and verification gates to maintain quality in AI-assisted coding. | Compensates for LLM limitations (finite context, no persistent memory) by externalising working memory into structured documents that serve as stable reference points across sessions. |
| [Throwaway Spike](patterns/throwaway-spike.md) | Rapid throwaway prototypes with explicit constraints, safety guardrails, and human decision gates. | Adds agent-specific guardrails to the classic XP spike, preventing clean-looking AI output from being accidentally promoted to production. |
| [Skills Library](patterns/skills-library.md) | Package procedures as executable skills that agents follow to perform tasks consistently, the HOW of your organisation. | Transforms tribal knowledge into repeatable workflows; agents execute these skills rather than improvising each time. |
| [Digital Twin](patterns/digital-twin.md) | Clone the observable behaviour of third-party dependencies into local replicas for deterministic, high-volume testing. | Moves beyond hand-written mocks to behavioural replicas validated against the real service, giving agents a fast, reliable integration test target. |
| [Session Checkpoint](patterns/session-checkpoint.md) | Capture agent sessions with rollback capability, shadow branches for metadata, and auto-summarisation. | Preserves the reasoning behind agent-assisted code changes as replayable, recoverable history without polluting the code branch. |
| [Validation Constraint](patterns/validation-constraint.md) | Validate agent output through externally observable behaviour (tests, monitoring) rather than line-by-line code review. | Treats generated code like ML model weights: opaque internals validated through outputs, letting automated checks scale with agent throughput. |
| [Structural Constraint](patterns/structural-constraint.md) | Use custom linters, structural tests, and enforced boundaries to constrain the architectural shape of generated code, ensuring it fits the system rather than just working. | Functional tests validate behaviour; structural constraints validate form. Maintainable AI-generated code at scale requires constraining the solution space, not maximising flexibility. |

### Safety

These patterns control and validate agent output to meet compliance, safety, and quality requirements.

| Pattern | Description | Novel Insight |
| --- | --- | --- |
| [Runtime Guardrails](patterns/runtime-guardrails.md) | Apply layered controls during inference (topic denial, content filters, PII detection, contextual grounding) to prevent problematic output at generation time. | Prevention at generation time is cheaper and safer than post-hoc detection; layered controls compensate for each other's gaps. |
| [Post-Inference Validation](patterns/post-inference-validation.md) | Place an independent validation pipeline after inference with deterministic rules, PII re-detection, contextual verification, risk scoring, and escalation. | Runs outside the model host to preserve separation of concerns; an auditable pipeline with immutable logs and policy versioning satisfies regulatory expectations. |

### Scale

These patterns address what happens when you push beyond single-agent constraints, whether that's context limits, throughput ceilings, or coordination challenges.

| Pattern | Description | Novel Insight |
| --- | --- | --- |
| [Agent Swarm](patterns/agent-swarm.md) | Deploy hierarchical swarms of planning and worker agents; intelligent task decomposition enables massive parallelism without merge conflicts. | Demonstrates that a single engineer plus thousands of coordinated agents can produce substantial codebases by making decomposition the hard problem. |
| [Detached Agent](patterns/detached-agent.md) | Use issue trackers as task queues for AI agents executing in sandboxed cloud environments, decoupling interface from execution. | Gains audit trails, team accessibility, and security isolation without requiring local development setup. |
| [Context Bypass](patterns/context-bypass.md) | Delegate data-heavy operations to local APIs and return only compact results, avoiding context window limits entirely. | Inverts the data flow: bring the model's intent to the data, not data to the model. |
| [Autonomous Agent](patterns/autonomous-agent.md) | Enable agents to select tasks from backlogs, monitor outcomes, and operate under defined values; moving beyond reactive prompting toward self-direction. | Identifies the prerequisites and scaling paradox: human review remains essential, shifting the bottleneck from scheduling to verification. |
| [Pyramid Summary](patterns/pyramid-summary.md) | Build reversible multi-level summaries so agents can navigate between system overview and full source detail on demand. | Enables comprehension of systems that exceed context limits through selective expansion rather than lossy compression. |
| [Agent Memory Graph](patterns/agent-memory-graph.md) | Replace flat task files with dependency-aware graphs supporting safe multi-agent coordination and semantic compaction. | Provides the coordination primitives (atomic claims, hash-based IDs, ready-state detection) that flat TODO files lack for parallel agent work. |

### Evolution

These patterns address the challenge of keeping systems current as dependencies, standards, and the world around them change.

| Pattern | Description | Novel Insight |
| --- | --- | --- |
| [Regen](patterns/regen.md) | Treat specifications and implementations as functions of their inputs; when inputs change, outputs regenerate. | Makes regeneration economical: agents draft, humans review, so systems evolve with their dependencies rather than calcifying. |
| [Golden Path Anchor](patterns/golden-path-anchor.md) | AI continuously detects drift between production codebases and a reference application, then auto-generates contextual PRs to propagate best practices. | Transforms reference applications from passive templates into active, living standards that propagate automatically. |
| [Spec Library](patterns/spec-library.md) | Distribute specifications and tests as the library; AI generates language-specific implementations on demand. | Inverts software distribution by treating code as ephemeral and regenerable, while specifications and tests become the preserved artefacts. |
| [Semantic Port](patterns/semantic-port.md) | Use AI agents to port code between languages or frameworks, preserving intent and producing idiomatic output rather than mechanical translation. | Goes beyond transpilation by mapping idioms and conventions, not just syntax, producing code that reads as native to the target ecosystem. |
| [Garbage Collection Agent](patterns/garbage-collection-agent.md) | Deploy periodic agents that sweep through AI-generated codebases identifying documentation drift, architectural violations, dead code, and cross-module inconsistencies. | AI-generated codebases accumulate entropy faster than human attention can manage; scheduled maintenance agents keep the codebase healthy between human review cycles. |

## How the Patterns Relate

These patterns don't exist in isolation. Several clusters of relationships are worth calling out.

**Starting a project.** For brownfield projects, [Code Archaeologist](patterns/code-archaeologist.md) extracts legacy knowledge, which feeds into a [Context Library](patterns/context-library.md), which informs specification through [Specify Plan Ship](patterns/specify-plan-ship.md). For greenfield projects, you skip the archaeology and load organisational standards from the Context Library before specifying.

**Maintaining consistency at scale.** [Context Library](patterns/context-library.md) defines WHAT good looks like; [Skills Library](patterns/skills-library.md) defines HOW to achieve it. Skills reference Context. [Golden Path Anchor](patterns/golden-path-anchor.md) takes this further by automatically aligning codebases with reference implementations. And when standards evolve, [Regen](patterns/regen.md) regenerates affected specs and implementations.

**Handling large data or async work.** [Context Bypass](patterns/context-bypass.md) delegates to local APIs when data exceeds context limits. [Detached Agent](patterns/detached-agent.md) provides fire-and-forget task execution with security isolation.

**Increasing agent autonomy.** [Detached Agent](patterns/detached-agent.md) provides execution infrastructure; [Autonomous Agent](patterns/autonomous-agent.md) adds task selection and outcome monitoring on top. [Skills Library](patterns/skills-library.md) defines reliable coordination, which is a prerequisite before agents can self-direct. [Agent Swarm](patterns/agent-swarm.md) scales parallelism through hierarchical coordination: planners decompose, workers execute.

**Testing and validation.** [Digital Twin](patterns/digital-twin.md) clones dependencies for deterministic testing. [Validation Constraint](patterns/validation-constraint.md) validates that agent output *works* through observable behaviour, while [Structural Constraint](patterns/structural-constraint.md) validates that it *fits* through architectural tests and custom linters. TDD in [Specify Plan Ship](patterns/specify-plan-ship.md) naturally produces the test suite that Validation Constraint relies on.

**Codebase health.** [Garbage Collection Agent](patterns/garbage-collection-agent.md) runs periodic sweeps to catch documentation drift, dead code, and inconsistencies that accumulate in AI-generated codebases. It builds on [Structural Constraint](patterns/structural-constraint.md) by enforcing constraints beyond CI, and complements [Golden Path Anchor](patterns/golden-path-anchor.md), which detects drift from a reference application rather than internal consistency.

**Agent memory and observability.** [Agent Memory Graph](patterns/agent-memory-graph.md) provides the coordination primitives (atomic claims, dependency tracking) that [Agent Swarm](patterns/agent-swarm.md) needs. [Session Checkpoint](patterns/session-checkpoint.md) tracks concurrent agent sessions independently with rollback capability. [Pyramid Summary](patterns/pyramid-summary.md) handles comprehension of large systems, while [Context Bypass](patterns/context-bypass.md) handles data-heavy processing. Different tools for different scaling problems.

**Safety and compliance.** [Runtime Guardrails](patterns/runtime-guardrails.md) prevents problematic output at generation time; [Post-Inference Validation](patterns/post-inference-validation.md) catches what slips through. Together they form defence in depth. For code rather than text, [Validation Constraint](patterns/validation-constraint.md) validates through tests and observable behaviour.

**Cross-language distribution.** [Spec Library](patterns/spec-library.md) defines what to implement; [Semantic Port](patterns/semantic-port.md) generates idiomatic implementations across languages. When the source evolves, [Regen](patterns/regen.md) regenerates the ports automatically.

**Exploration vs production.** [Throwaway Spike](patterns/throwaway-spike.md) validates ideas quickly with explicit throwaway markers. Once the spike proves the idea, [Specify Plan Ship](patterns/specify-plan-ship.md) builds production code with the full process.

## Contributing

Contributions are welcome. To add a new pattern, create a markdown file in `patterns/<pattern-name>.md`, follow the style of existing patterns, and submit a PR.

If you spot a pattern that isn't listed here, it may be too well-known for me to bother distilling, or I simply haven't discovered it yet. PRs and issues pointing out gaps are appreciated.

## Acknowledgements

Credit to Chris Hay, Birgitta Böckeler, Simon Willison, Gergely Orosz, Drew Breunig, Wilson Lin, Tim Kellogg, Addy Osmani, Jesse Vincent, Steve Yegge, StrongDM, and Entire.io for the ideas that inspired the patterns here.
