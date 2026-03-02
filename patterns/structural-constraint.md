---
name: Structural Constraint
description: Use custom linters and structural tests to ensure agent-generated code fits your architecture, not just works.
category: Workflow
maturity: trial
---

# Structural Constraint

[Validation Constraint](validation-constraint.md) asks whether agent-generated code *works*: do the tests pass? But there's a different question that matters just as much at scale: does the code *fit*? An agent can produce a functionally correct implementation that ignores your module boundaries, bypasses your layering conventions, introduces circular dependencies, or reaches into internals that should be private.

Functional tests won't catch these problems. A test suite that asserts correct behaviour tells you nothing about whether the implementation respects your architecture. And the [Context Library](context-library.md) can describe your architectural conventions, but description is advisory. Agents can read it and still produce code that violates it.

The insight from OpenAI's experience building a million-line AI-generated codebase is that maintainable AI-generated code at scale requires *constraining the solution space* through enforcement, not just guidance. You need to trade "generate anything" flexibility for structural rules that keep the codebase coherent as it grows.

## Sketch

![Structural Constraint](../docs/assets/structural-constraint.png)

## How It Works

The approach uses custom linters, structural tests, and enforced boundaries to constrain the architectural shape of generated code. Where functional tests validate behaviour, structural constraints validate form.

### Custom Linters

Purpose-built lint rules enforce organisation-specific conventions that general-purpose linters don't cover. These might prohibit imports across module boundaries, enforce naming conventions for specific layers, require certain annotations or decorators on public APIs, or flag patterns your team has explicitly banned. The key is that these rules are *deterministic*: they run fast, produce no false negatives, and give agents unambiguous pass/fail signals.

### Structural Tests

Frameworks like ArchUnit (Java), Dependency Cruiser (JavaScript), or custom AST-based checks let you write tests that assert architectural properties. A structural test might verify that nothing in the `domain` layer imports from `infrastructure`, that all REST controllers live in a specific package, that no module has more than a defined number of dependencies, or that public APIs follow your versioning convention.

These tests run in CI alongside functional tests, but they validate different properties. A codebase can be functionally correct and structurally rotten.

### Enforced Boundaries

Beyond linting and testing, some constraints work best as hard boundaries: separate packages or modules with explicit public APIs, build-system-level dependency rules that prevent compilation if violated, pre-commit hooks that reject structurally non-conforming code before it enters the repository.

### The Feedback Loop

Böckeler emphasises the iterative nature of this work. When agents consistently produce code that violates a constraint, the response isn't to relax the constraint. It's to improve the harness: add better context, write clearer linter messages, or provide examples of conforming code. The agents themselves can implement these improvements, creating a virtuous cycle where the harness becomes more effective over time.

## The Trade-offs

The benefits compound as the codebase grows. Architectural conventions are enforced rather than hoped for. Agents receive fast, deterministic feedback on structural violations. The codebase remains navigable and maintainable even as it scales. And structural tests serve as executable documentation of your architecture.

The costs are mostly upfront. Writing custom linters and structural tests takes effort. Over-constraining the solution space can make legitimate architectural evolution difficult. The rules need maintenance as architecture evolves. And teams must invest in understanding structural testing frameworks, which are less familiar than functional testing to many developers.

## When to Use It

This pattern earns its keep on large codebases with high volumes of AI-generated code, teams with established architectural conventions worth enforcing, multi-agent workflows where structural consistency can't rely on a single agent's memory, and organisations where the codebase must remain maintainable by humans who didn't generate it.

It's unnecessary for small projects where architectural drift is manageable through review, exploratory work and spikes where structural flexibility is the point, and early-stage projects where the architecture is still being discovered.

This complements [Validation Constraint](validation-constraint.md) directly: functional tests validate behaviour, structural constraints validate form. Together they provide comprehensive automated verification. [Context Library](context-library.md) provides the advisory layer describing your architecture, while Structural Constraint provides the enforcement layer ensuring agents actually follow it.

## Further Reading

- [Harness Engineering](https://martinfowler.com/articles/exploring-gen-ai/harness-engineering.html) - Birgitta Böckeler
