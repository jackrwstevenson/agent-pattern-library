# Agent Pattern Library

This is my attempt to make sense of the emerging patterns in AI-assisted software development. The patterns here are drawn from research, personal observations, and hands-on experimentation with AI coding agents. Some are well-established; others are directions I find promising but wouldn't yet call best practice. I have tried to be honest about which is which.

If you work with AI coding agents and have found patterns that belong here, I would like to hear from you.

## Using this site

Browse patterns using the **left sidebar**, which lists all 26 grouped by category. Click any pattern to read it in full. While you are on a pattern page, the sidebar expands to show its headings so you can jump between sections. The **Home** link in the top nav returns here.

Each sidebar entry carries a **maturity badge** indicating how much confidence I have in it. The toggle in the top nav switches between dark and light modes.

## Key concepts

### Categories

The 26 patterns are organised into five categories:

| Category | What it covers |
| --- | --- |
| **Grounding** | Ensuring agents work from accurate, authoritative information rather than inventing their own |
| **Workflow** | Structuring how agents perform work, compensating for the limitations that make unstructured use unreliable |
| **Safety** | Controlling and validating agent output to meet compliance, safety, and quality requirements |
| **Scale** | What happens when you push beyond single-agent constraints: context limits, throughput ceilings, coordination challenges |
| **Evolution** | Keeping systems current as dependencies, standards, and the world around them change |

### Maturity ratings

Borrowed from the [ThoughtWorks Technology Radar](https://www.thoughtworks.com/radar):

| Rating | Meaning |
| --- | --- |
| **Adopt** | Use it. It solves a real problem reliably and I apply it in my own work. |
| **Trial** | Worth trying where the context fits. Some rough edges remain. |
| **Assess** | Worth understanding; be cautious about deploying it yet. |
| **Hold** | Not ready or not recommended for most situations. |

---

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
| [Deterministic Orchestration](patterns/deterministic-orchestration.md) | Control workflow progression through deterministic hooks and pipelines, not agent reasoning; let agents reason freely only within bounded execution steps. | Four independent teams converged on the same conclusion: agents should never decide what phase comes next. Deterministic control, creative execution. |
| [Generation Memory](patterns/generation-memory.md) | Give agents an external log of their own work that persists across context window compactions, preventing repeated work and lost decisions during long sessions. | Solves a problem unique to LLMs: context compaction silently discards the agent's working memory. Externalising progress into a file restores continuity. |
| [Provenance Ledger](patterns/provenance-ledger.md) | Record which agent, model, prompt, and iteration produced every artefact, providing lightweight traceability from deployment to reasoning. | Distinct from session replay: structured metadata per generation step, not transcripts. Paired with Git, provides a complete audit chain for regulated domains. |

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

---

## How the Patterns Relate

These patterns don't exist in isolation. Here are the clusters worth understanding.

### Starting a project

For brownfield projects, [Code Archaeologist](patterns/code-archaeologist.md) surfaces the implicit knowledge baked into legacy code, which feeds into a [Context Library](patterns/context-library.md). For greenfield, load organisational standards directly. Either way, [Specify Plan Ship](patterns/specify-plan-ship.md) consumes that context to drive structured specification before any code is generated.

### Consistency at scale

- [Context Library](patterns/context-library.md) defines **what** good looks like; [Skills Library](patterns/skills-library.md) defines **how** to achieve it — skills reference context
- [Golden Path Anchor](patterns/golden-path-anchor.md) automatically aligns production codebases with a reference implementation as standards evolve
- [Regen](patterns/regen.md) regenerates affected specs and implementations when upstream inputs change

### Autonomy and orchestration

- [Detached Agent](patterns/detached-agent.md) provides execution infrastructure with audit trails and security isolation
- [Autonomous Agent](patterns/autonomous-agent.md) adds task selection and outcome monitoring on top of that infrastructure
- [Agent Swarm](patterns/agent-swarm.md) scales through hierarchical coordination — planners decompose, workers execute
- [Deterministic Orchestration](patterns/deterministic-orchestration.md) enforces that agents control *what they produce*, not *what phase comes next*

### Memory and observability

- [Generation Memory](patterns/generation-memory.md) — a single agent's awareness of its own progress across context compactions
- [Agent Memory Graph](patterns/agent-memory-graph.md) — coordination primitives for parallel agents: atomic task claims, dependency tracking, ready-state detection
- [Session Checkpoint](patterns/session-checkpoint.md) — concurrent session history with rollback, without polluting the code branch
- [Provenance Ledger](patterns/provenance-ledger.md) — lightweight audit trail from any artefact back to the agent and prompt that produced it
- [Pyramid Summary](patterns/pyramid-summary.md) — navigating systems that exceed context limits through selective expansion rather than lossy compression
- [Context Bypass](patterns/context-bypass.md) — delegating data-heavy operations to local APIs so they never enter the context window at all

### Testing and validation

- [Digital Twin](patterns/digital-twin.md) clones third-party dependencies for deterministic, high-volume testing
- [Validation Constraint](patterns/validation-constraint.md) validates that output **works** through observable behaviour (tests, monitoring)
- [Structural Constraint](patterns/structural-constraint.md) validates that it **fits** through architectural tests and custom linters
- [Specify Plan Ship](patterns/specify-plan-ship.md) naturally produces the test suite that Validation Constraint relies on

### Safety and compliance

[Runtime Guardrails](patterns/runtime-guardrails.md) prevents problematic output at generation time. [Post-Inference Validation](patterns/post-inference-validation.md) catches what gets through. Together they provide defence in depth for content. For code, [Validation Constraint](patterns/validation-constraint.md) and [Structural Constraint](patterns/structural-constraint.md) play equivalent roles.

### Codebase health

- [Garbage Collection Agent](patterns/garbage-collection-agent.md) runs periodic sweeps for documentation drift, dead code, and cross-module inconsistencies
- Builds on [Structural Constraint](patterns/structural-constraint.md) by enforcing architectural rules continuously, beyond what CI catches
- Complements [Golden Path Anchor](patterns/golden-path-anchor.md), which catches drift from a reference app rather than internal consistency

### Cross-language distribution

[Spec Library](patterns/spec-library.md) defines what to implement; [Semantic Port](patterns/semantic-port.md) generates idiomatic implementations across languages. When the source evolves, [Regen](patterns/regen.md) regenerates the ports automatically.

### Exploration vs production

[Throwaway Spike](patterns/throwaway-spike.md) validates ideas quickly with explicit throwaway markers and safety guardrails. Once proven, [Specify Plan Ship](patterns/specify-plan-ship.md) takes over to build production code with the full process.

---

## Contributing

Contributions are welcome. To add a new pattern, create a markdown file in `patterns/<pattern-name>.md`, follow the style of existing patterns, and submit a PR.

If you spot a pattern that isn't listed here, it may be too well-known for me to bother distilling, or I simply haven't discovered it yet. PRs and issues pointing out gaps are appreciated.

## Acknowledgements

Credit to Chris Hay, Birgitta Böckeler, Simon Willison, Gergely Orosz, Drew Breunig, Wilson Lin, Tim Kellogg, Addy Osmani, Jesse Vincent, Steve Yegge, StrongDM, and Entire.io for the ideas that inspired the patterns here.
