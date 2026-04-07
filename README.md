# Agent Pattern Library

Making sense of the emerging patterns in AI-assisted software development. The patterns here are drawn from research, personal observations, and hands-on experimentation with AI coding agents. Some are well-established; others are directions I find promising but wouldn't yet call best practice. I have tried to be honest about which is which.

If you work with AI coding agents and have found patterns that belong here, I would like to hear from you.

## Using this site

Browse patterns using the **left sidebar**, which lists all 35 grouped by category. Click any pattern to read it in full. While you are on a pattern page, the sidebar expands to show its headings so you can jump between sections. The **Home** link in the top nav returns here.

Each pattern carries a **maturity badge** indicating how much confidence I have in it.

## Key concepts

### Categories

The patterns are organised into seven categories:

| Category                | What it covers                                                                                                           |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| **Grounding**           | Ensuring agents work from accurate, authoritative information rather than inventing their own                            |
| **Workflow**            | Structuring how agents perform work, compensating for the limitations that make unstructured use unreliable              |
| **Harness Engineering** | Designing, testing, optimising, and maintaining the scaffolding that orchestrates agent execution                        |
| **Safety**              | Controlling and validating agent output to meet compliance, safety, and quality requirements                             |
| **Observability**       | Persisting agent progress, decisions, and provenance so that work survives context limits and remains auditable          |
| **Scale**               | What happens when you push beyond single-agent constraints: context limits, throughput ceilings, coordination challenges |
| **Evolution**           | Keeping systems current as dependencies, standards, and the world around them change                                     |

### Maturity ratings

Borrowed from the [ThoughtWorks Technology Radar](https://www.thoughtworks.com/radar):

| Rating     | Meaning                                                                  |
| ---------- | ------------------------------------------------------------------------ |
| **Adopt**  | Use it. It solves a real problem reliably and I apply it in my own work. |
| **Trial**  | Worth trying where the context fits. Some rough edges remain.            |
| **Assess** | Worth understanding; be cautious about deploying it yet.                 |
| **Hold**   | Not ready or not recommended for most situations.                        |

---

## Patterns

### Grounding

These patterns ensure agents work from accurate, authoritative information rather than inventing their own.

| Pattern                                                                | Description                                                                                                                                          | Novel Insight                                                                                                                            |
| ---------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| [Context Library](patterns/context-library.md)                         | Curate reference material (standards, architecture, design system, domain knowledge) that agents consult to understand WHAT good looks like.         | Gives agents institutional memory; they read this context to understand your world before generating anything.                           |
| [Authoritative Source Anchor](patterns/authoritative-source-anchor.md) | Embed authoritative external specifications (web standards, RFCs, regulatory docs) directly in the repository so agents can cite rather than recall. | Grounds agent decisions in verifiable facts and enables longer autonomous runs.                                                          |
| [Code Archaeologist](patterns/code-archaeologist.md)                   | Reverse-engineer legacy codebases to extract implicit business rules, data models, and constraints before replacement begins.                        | Forces explicit retain/discard/modernise decisions rather than accidental preservation or loss of tribal knowledge encoded only in code. |

### Workflow

These patterns structure how agents perform work, compensating for the limitations that make unstructured agent use unreliable.

| Pattern                                                                | Description                                                                                                                                                           | Novel Insight                                                                                                                                                                           |
| ---------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Specify Plan Ship](patterns/specify-plan-ship.md)                     | A three-phase development workflow (Specify, Plan, Implement with TDD) that uses explicit documents and verification gates to maintain quality in AI-assisted coding. | Compensates for LLM limitations (finite context, no persistent memory) by externalising working memory into structured documents that serve as stable reference points across sessions. |
| [Throwaway Spike](patterns/throwaway-spike.md)                         | Rapid throwaway prototypes with explicit constraints, safety guardrails, and human decision gates.                                                                    | Adds agent-specific guardrails to the classic XP spike, preventing clean-looking AI output from being accidentally promoted to production.                                              |
| [Skills Library](patterns/skills-library.md)                           | Package procedures as executable skills that agents follow to perform tasks consistently, the HOW of your organisation.                                               | Transforms tribal knowledge into repeatable workflows; agents execute these skills rather than improvising each time.                                                                   |
| [Digital Twin](patterns/digital-twin.md)                               | Clone the observable behaviour of third-party dependencies into local replicas for deterministic, high-volume testing.                                                | Moves beyond hand-written mocks to behavioural replicas validated against the real service, giving agents a fast, reliable integration test target.                                     |
| [Adversarial Agents](patterns/adversarial-agents.md)                   | Set multiple agents on the same problem with competing hypotheses, using structured debate to fight anchoring bias and converge on stronger conclusions.              | Structurally eliminates anchoring bias by making agents challenge each other's findings rather than asking a single agent to argue against itself.                                      |

### Harness Engineering

These patterns address the design, testing, optimisation, and maintenance of the scaffolding that orchestrates agent execution.

| Pattern                                                                     | Description                                                                                                                                                              | Novel Insight                                                                                                                                                                             |
| --------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Deterministic Orchestration](patterns/deterministic-orchestration.md)      | Control workflow progression through deterministic hooks and pipelines, not agent reasoning; let agents reason freely only within bounded execution steps.                | Various independent teams converged on the same conclusion: agents should never decide what phase comes next. Deterministic control, creative execution.                                  |
| [Persistent Loop](patterns/persistent-loop.md)                              | Run an agent in a loop until it can truthfully declare completion, with state persisted through files and honesty enforcement at the exit gate.                           | Sidesteps upfront task decomposition entirely: the agent runs repeatedly with the same prompt, picking up where it left off by reading its own previous output from the file system.      |
| [Generator-Evaluator Loop](patterns/generator-evaluator-loop.md)           | Separate generation from evaluation into distinct agents, with criteria-based feedback driving iterative refinement of output quality.                                    | Tuning a standalone evaluator to be sceptical is far more tractable than making a generator critical of its own work; the separation creates real evaluative pressure that self-review cannot. |
| [Eval-Driven Agent Development](patterns/eval-driven-agent-development.md) | Build automated test suites for the agent system itself, using repeated runs to handle variability and promoting passing tests into regression suites as the agent matures.                        | Check results, not steps: agents find valid approaches test designers did not anticipate, so rigid path assertions penalise creativity rather than catch bugs.                            |
| [Tiered Model Routing](patterns/tiered-model-routing.md)                   | Match model capability and cost to each step in a workflow, using cheap models for simple decisions and expensive models for deep reasoning.                              | Most workflow steps don't need frontier reasoning; tiered routing cuts cost substantially while preserving quality where it matters.                                                       |
| [Harness Evolution](patterns/harness-evolution.md)                          | Systematically stress-test and strip agent scaffolding as models improve, because every harness component encodes an assumption about model limitations that goes stale.  | The space of interesting harness combinations does not shrink as models improve; it moves. Methodical one-at-a-time removal beats radical simplification.                                 |

### Safety

These patterns control and validate agent output to meet compliance, safety, and quality requirements.

| Pattern                                                                | Description                                                                                                                                                           | Novel Insight                                                                                                                                                                     |
| ---------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Runtime Guardrails](patterns/runtime-guardrails.md)                   | Apply layered controls during inference (topic denial, content filters, PII detection, contextual grounding) to prevent problematic output at generation time.        | Prevention at generation time is cheaper and safer than post-hoc detection; layered controls compensate for each other's gaps.                                                    |
| [Post-Inference Validation](patterns/post-inference-validation.md)     | Place an independent validation pipeline after inference with deterministic rules, PII re-detection, contextual verification, risk scoring, and escalation.           | Runs outside the model host to preserve separation of concerns; an auditable pipeline with immutable logs and policy versioning satisfies regulatory expectations.                |
| [Validation Constraint](patterns/validation-constraint.md)             | Validate agent output through externally observable behaviour (tests, monitoring) rather than line-by-line code review.                                               | Treats generated code like ML model weights: opaque internals validated through outputs, letting automated checks scale with agent throughput.                                    |
| [Structural Constraint](patterns/structural-constraint.md)             | Use custom linters, structural tests, and enforced boundaries to constrain the architectural shape of generated code, ensuring it fits the system.                    | Functional tests validate behaviour; structural constraints validate form. Constraining the solution space beats maximising flexibility.                                          |
| [Confidence-Gated Validation](patterns/confidence-gated-validation.md) | Use numeric confidence scores with calibrated thresholds and independent verification agents to filter findings, reducing false positives without losing real issues. | Moves beyond binary pass/fail to quantified certainty; a second agent validates each finding independently, catching context-dependent false positives that prompt tuning cannot. |

### Observability

These patterns persist agent progress, decisions, and provenance so that work survives context limits and remains auditable.

| Pattern                                              | Description                                                                                                                                 | Novel Insight                                                                                                                                                   |
| ---------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Session Checkpoint](patterns/session-checkpoint.md) | Capture agent sessions with rollback capability, shadow branches for metadata, and auto-summarisation.                                      | Preserves the reasoning behind agent-assisted code changes as replayable, recoverable history without polluting the code branch.                                |
| [Generation Memory](patterns/generation-memory.md)   | Give agents an external log of their own work that persists across context window compactions, preventing repeated work and lost decisions. | Solves a problem unique to LLMs: context compaction silently discards the agent's working memory. Externalising progress into a file restores continuity.       |
| [Provenance Ledger](patterns/provenance-ledger.md)   | Record which agent, model, and iteration produced every artefact, providing lightweight traceability from deployment to reasoning.          | Distinct from session replay: structured metadata per generation step, not transcripts. Paired with Git, provides a complete audit chain for regulated domains. |

### Scale

These patterns address what happens when you push beyond single-agent constraints, whether that's context limits, throughput ceilings, or coordination challenges.

| Pattern                                                        | Description                                                                                                                                              | Novel Insight                                                                                                                                                    |
| -------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Agent Team](patterns/agent-team.md)                           | Coordinate a small team of specialised agents through shared task lists, file ownership, and peer messaging for safe parallel execution.                 | Three focused agents consistently outperform one generalist; coordination primitives (shared tasks, file locking, peer messaging) are now shipping in real tools. |
| [Detached Agent](patterns/detached-agent.md)                   | Use issue trackers as task queues for AI agents executing in sandboxed cloud environments, decoupling interface from execution.                          | Gains audit trails, team accessibility, and security isolation without requiring local development setup.                                                        |
| [Context Bypass](patterns/context-bypass.md)                   | Delegate data-heavy operations to local APIs and return only compact results, avoiding context window limits entirely.                                   | Inverts the data flow: bring the model's intent to the data, not data to the model.                                                                              |
| [Autonomous Agent](patterns/autonomous-agent.md)               | Enable agents to select tasks from backlogs, monitor outcomes, and operate under defined values; moving beyond reactive prompting toward self-direction. | Identifies the prerequisites and scaling paradox: human review remains essential, shifting the bottleneck from scheduling to verification.                       |
| [Pyramid Summary](patterns/pyramid-summary.md)                 | Build reversible multi-level summaries so agents can navigate between system overview and full source detail on demand.                                  | Enables comprehension of systems that exceed context limits through selective expansion rather than lossy compression.                                           |
| [Agent Memory Graph](patterns/agent-memory-graph.md)           | Replace flat task files with dependency-aware graphs supporting safe multi-agent coordination and semantic compaction.                                   | Provides the coordination primitives (atomic claims, hash-based IDs, ready-state detection) that flat TODO files lack for parallel agent work.                   |
| [Verification Bottleneck](patterns/verification-bottleneck.md) | Recognise that verification, not generation, is the throughput constraint; organise work around human review capacity.                                   | Spec quality multiplies across a fleet of agents; comprehension debt is the new class of risk when delegation speed outpaces understanding.                      |
| [Federated Agent Network](patterns/federated-agent-network.md) | Connect independent agent systems through shared protocols and schemas, enabling cross-boundary collaboration without central orchestration.             | Extends beyond single-orchestrator swarms to inter-system collaboration: sovereign nodes, portable identity, and progressive trust through Git-style federation. |

### Evolution

These patterns address the challenge of keeping systems current as dependencies, standards, and the world around them change.

| Pattern                                                          | Description                                                                                                                                                              | Novel Insight                                                                                                                                                         |
| ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Regen](patterns/regen.md)                                       | Treat specifications and implementations as functions of their inputs; when inputs change, outputs regenerate.                                                           | Makes regeneration economical: agents draft, humans review, so systems evolve with their dependencies rather than calcifying.                                         |
| [Golden Path Anchor](patterns/golden-path-anchor.md)             | AI continuously detects drift between production codebases and a reference application, then auto-generates contextual PRs to propagate best practices.                  | Transforms reference applications from passive templates into active, living standards that propagate automatically.                                                  |
| [Spec Library](patterns/spec-library.md)                         | Distribute specifications and tests as the library; AI generates language-specific implementations on demand.                                                            | Inverts software distribution by treating code as ephemeral and regenerable, while specifications and tests become the preserved artefacts.                           |
| [Semantic Port](patterns/semantic-port.md)                       | Use AI agents to port code between languages or frameworks, preserving intent and producing idiomatic output rather than mechanical translation.                         | Goes beyond transpilation by mapping idioms and conventions, not just syntax, producing code that reads as native to the target ecosystem.                            |
| [Garbage Collection Agent](patterns/garbage-collection-agent.md) | Deploy periodic agents that sweep through AI-generated codebases identifying documentation drift, architectural violations, dead code, and cross-module inconsistencies. | AI-generated codebases accumulate entropy faster than human attention can manage; scheduled maintenance agents keep the codebase healthy between human review cycles. |

---

## How the Patterns Relate

These patterns don't exist in isolation. Here are the clusters worth understanding.

### Starting a project

For brownfield projects, [Code Archaeologist](patterns/code-archaeologist.md) surfaces the implicit knowledge baked into legacy code, which feeds into a [Context Library](patterns/context-library.md). For greenfield, curate a [Context Library](patterns/context-library.md). [Specify Plan Ship](patterns/specify-plan-ship.md) consumes that context to drive structured specification before any code is generated.

### Consistency at scale

- [Context Library](patterns/context-library.md) defines **what** good looks like; [Skills Library](patterns/skills-library.md) defines **how** to achieve it; skills reference context
- [Golden Path Anchor](patterns/golden-path-anchor.md) automatically aligns production codebases with a reference implementation as standards evolve
- [Regen](patterns/regen.md) regenerates affected specs and implementations when upstream inputs change

### Autonomy and orchestration

- [Detached Agent](patterns/detached-agent.md) provides execution infrastructure with audit trails and security isolation
- [Autonomous Agent](patterns/autonomous-agent.md) adds task selection and outcome monitoring on top of that infrastructure
- [Agent Team](patterns/agent-team.md) scales through hierarchical coordination; a lead decomposes, specialists execute in isolated worktrees
- [Federated Agent Network](patterns/federated-agent-network.md) extends beyond a single orchestrator: independent systems collaborate through shared protocols
- [Adversarial Agents](patterns/adversarial-agents.md) puts multiple agents on the _same_ problem with competing hypotheses, where [Agent Team](patterns/agent-team.md) puts agents on _different_ tasks
- [Verification Bottleneck](patterns/verification-bottleneck.md) caps concurrency at human review capacity; spec quality multiplies across the fleet

### Memory and observability

- [Generation Memory](patterns/generation-memory.md): a single agent's awareness of its own progress across context compactions
- [Agent Memory Graph](patterns/agent-memory-graph.md): coordination primitives for parallel agents: atomic task claims, dependency tracking, ready-state detection
- [Session Checkpoint](patterns/session-checkpoint.md): concurrent session history with rollback, without polluting the code branch
- [Provenance Ledger](patterns/provenance-ledger.md): lightweight audit trail from any artefact back to the agent and model that produced it
- [Pyramid Summary](patterns/pyramid-summary.md): navigating systems that exceed context limits through selective expansion rather than lossy compression
- [Context Bypass](patterns/context-bypass.md): delegating data-heavy operations to local APIs so they never enter the context window at all

### Testing and validation

- [Digital Twin](patterns/digital-twin.md) clones third-party dependencies for deterministic, high-volume testing
- [Validation Constraint](patterns/validation-constraint.md) validates that output **works** through observable behaviour (tests, monitoring)
- [Structural Constraint](patterns/structural-constraint.md) validates that it **fits** through architectural tests and custom linters
- [Specify Plan Ship](patterns/specify-plan-ship.md) naturally produces the test suite that Validation Constraint relies on

### Safety and compliance

[Runtime Guardrails](patterns/runtime-guardrails.md) prevents problematic output at generation time. [Post-Inference Validation](patterns/post-inference-validation.md) catches what gets through. [Confidence-Gated Validation](patterns/confidence-gated-validation.md) extends validation from deterministic rules to agent-based verification with calibrated confidence scoring. Together they provide defence in depth for content. For code, [Validation Constraint](patterns/validation-constraint.md) and [Structural Constraint](patterns/structural-constraint.md) play equivalent roles.

### Harness engineering

- [Deterministic Orchestration](patterns/deterministic-orchestration.md) provides the control layer: deterministic hooks govern what phase comes next, while agents reason freely within each phase
- [Persistent Loop](patterns/persistent-loop.md) offers a simpler alternative when upfront decomposition is premature: repeat until done, with state in files
- [Generator-Evaluator Loop](patterns/generator-evaluator-loop.md) pairs a generator with a dedicated critic for iterative refinement, distinct from [Adversarial Agents](patterns/adversarial-agents.md)' competing-hypotheses debate
- [Tiered Model Routing](patterns/tiered-model-routing.md) optimises cost across any harness by matching model capability to each step's cognitive demands
- [Eval-Driven Agent Development](patterns/eval-driven-agent-development.md) provides the measurement layer that validates the agent system itself, enabling confident iteration on all the above
- [Harness Evolution](patterns/harness-evolution.md) closes the loop: re-evaluate every component as models improve, stripping what is no longer load-bearing and investing in new capabilities. Complements [Regen](patterns/regen.md), which regenerates _application code_ when inputs change

### Codebase health

- [Garbage Collection Agent](patterns/garbage-collection-agent.md) runs periodic sweeps for documentation drift, dead code, and cross-module inconsistencies
- Builds on [Structural Constraint](patterns/structural-constraint.md) by enforcing architectural rules continuously, beyond what CI catches
- Complements [Golden Path Anchor](patterns/golden-path-anchor.md), which catches drift from a reference app rather than internal consistency

### Cross-language distribution

[Spec Library](patterns/spec-library.md) defines what to implement; [Semantic Port](patterns/semantic-port.md) generates idiomatic implementations across languages.

### Exploration vs production

[Throwaway Spike](patterns/throwaway-spike.md) validates ideas quickly with explicit throwaway markers and safety guardrails. Once proven, [Specify Plan Ship](patterns/specify-plan-ship.md) takes over to build production code with the full process.

---

## Contributing

Contributions are welcome. To add a new pattern, create a markdown file in `patterns/<pattern-name>.md`, follow the style of existing patterns, and submit a PR.

If you spot a pattern that isn't listed here, it may be too well-known for me to bother distilling, or I simply haven't discovered it yet. PRs and issues pointing out gaps are appreciated.

## Acknowledgements

Credit to Chris Hay, Birgitta Böckeler, Dan Sheard, Simon Willison, Wilson Lin, Gergely Orosz, Drew Breunig, Tim Kellogg, Addy Osmani, Jesse Vincent, Steve Yegge, Prithvi Rajasekaran, Mikaela Grace, Jeremy Hadfield, StrongDM, and Entire.io for the ideas that inspired the patterns here.
