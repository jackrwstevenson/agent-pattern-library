---
name: Deterministic Orchestration
description: Control workflow progression through deterministic hooks, not agent reasoning, reserving creativity for bounded execution steps.
category: Workflow
maturity: adopt
---

# Deterministic Orchestration

Every team I've studied that tried letting agents orchestrate themselves abandoned it. The pattern is remarkably consistent: it works on small demos, then collapses on real codebases. Agents skip steps, create cycles, get stuck in loops, and lose track of where they are in a multi-phase workflow. The more capable the model, the more confidently it goes off the rails.

The instinct is understandable. If agents are good at reasoning, why not let them reason about what to do next? The answer is that workflow progression and creative execution are fundamentally different problems. One benefits from determinism; the other benefits from flexibility.

## Sketch

_Sketch coming soon._

## How It Works

The approach separates orchestration from execution. Workflow progression is controlled by deterministic mechanisms: hooks, state machines, pipelines, or simple scripts that fire every time regardless of what the LLM decides. Within each step, the agent has bounded freedom to reason, explore, and make decisions.

The distinction matters. _Orchestration_ answers "what phase are we in, what happens next, and what are the constraints?" These questions have right answers and should never be left to probabilistic reasoning. _Execution_ answers "how should I implement this requirement?" This is where agent intelligence earns its keep.

### Hooks as Guarantees

The most effective implementation uses hooks that fire on specific events. A hook before any file write enforces path boundaries and negative constraints. A hook after each phase validates the output, advances the workflow state, records provenance, and surfaces the next step. A hook on every model output runs post-inference checks.

These are guarantees, not suggestions. They execute whether the agent remembers them or not. This is the critical difference from putting workflow instructions in a prompt: prompts are advisory, hooks are deterministic.

### Bounded Reasoning

Within each phase, the agent operates with bounded freedom. It receives a scoped task with specific tools, allowed file paths, and iteration caps (typically three to five attempts). If it cannot complete the task within those bounds, it escalates to a human rather than improvising. This prevents the runaway loops that plague unconstrained agent workflows.

## The Trade-offs

The benefits are reliability and predictability. Workflow progression never depends on the model's mood. Every phase transition is logged and auditable. Hooks catch violations that agents would otherwise skip. And the system behaves consistently regardless of which model version is running.

The costs are rigidity and upfront investment. You must design the workflow explicitly rather than hoping agents figure it out. Adding a new phase means writing new hooks. And the deterministic layer adds infrastructure that pure prompt-based approaches avoid. For simple, single-step tasks, this machinery is overhead.

## When to Use It

This pattern is essential for multi-phase agent workflows where steps must execute in order, regulated environments where workflow compliance must be demonstrable, teams running agents at scale where inconsistent behaviour compounds, and any workflow where skipping a step has serious consequences.

It's unnecessary for single-shot agent interactions, exploratory work where the workflow is deliberately unstructured, and simple tasks where a prompt and a response suffice.

This provides the orchestration layer that [Specify Plan Ship](specify-plan-ship.md) describes conceptually. It enforces [Structural Constraint](structural-constraint.md) and [Runtime Guardrails](runtime-guardrails.md) through hooks rather than relying on agents to remember them. And it complements [Agent Swarm](agent-swarm.md) by providing deterministic coordination for hierarchical agent workflows.

## Maturity

**Adopt.** Various independent teams reached the same conclusion before I documented it. Agents orchestrating themselves works in demos and fails in production. The separation of orchestration from execution is non-negotiable for multi-phase workflows.

## Further Reading

- [Harness Engineering](https://martinfowler.com/articles/exploring-gen-ai/harness-engineering.html) - Birgitta Böckeler
