# Context Library

## Problem

AI agents lack institutional knowledge. They produce impressive demos that:

- Reinvent solutions your team has already built
- Ignore coding standards and architectural patterns
- Miss available components and libraries
- Violate security policies or compliance requirements
- Drift from organisational conventions

The result is code that works in isolation but doesn't fit the broader system. Without context, agents operate as capable outsiders who don't know what good looks like here.

## Solution

Curate a library of reference material that agents consult to understand your organisation's standards, architecture, and domain. This is the WHAT - what good looks like, what's already built, what decisions have been made.

Agents read this context to understand your world before generating anything.

### Components

**Standards** define what "good" looks like: API design conventions, security policies, testing requirements, accessibility guidelines, code style. These are the rules you'd want any new team member to follow from day one.

**Architecture** captures how your system is structured: service boundaries, data flow, integration patterns, infrastructure topology. Agents that understand your architecture produce code that fits.

**Design system** documents UX patterns and components: the component library, interaction patterns, brand guidelines, visual language. This ensures agents produce interfaces native to your product.

**Domain context** encodes business knowledge: glossaries, entity models, regulatory requirements, business rules. Agents that understand your domain speak the same language as your team.

**Reusable components** catalogue what's already built: authentication clients, event bus wrappers, shared libraries. Each should document not just how to use it, but when *not* to use it.

**Decision records** explain why past choices were made: Architecture Decision Records, post-mortems, spike findings. These prevent agents from relitigating settled questions.

### Principles

**Curated, not comprehensive**: An agent drowning in context performs worse than one with none. Include only high-signal documents. Quality over quantity.

**Versioned**: Specs need to track which context version they were generated against. When standards evolve, you need to know what changed.

**Progressive loading**: Not all context is needed for every task. Structure information so agents pull in what they need when they need it.

**Maintained**: Stale context actively misleads. Build updates into how your team works, not as a separate documentation burden.

## Structure

```
context/
├── standards/
│   ├── api-design.md
│   ├── security-policy.md
│   └── testing-requirements.md
├── architecture/
│   ├── system-overview.md
│   └── service-boundaries.md
├── design-system/
│   └── component-guide.md
├── domain/
│   ├── glossary.md
│   └── entity-models.md
├── components/
│   ├── auth-client.md
│   └── event-bus.md
└── decisions/
    ├── ADR-001-database-choice.md
    └── ADR-002-auth-strategy.md
```

## Costs and Benefits

### Benefits

- **Consistent output**: Agents produce code aligned with your standards
- **Knowledge preservation**: Institutional knowledge survives team changes
- **Faster onboarding**: New agents (and humans) ramp up quickly
- **Reduced rework**: Fewer violations caught in code review
- **Reuse over reinvention**: Agents discover existing solutions

### Costs

- **Curation effort**: Building the initial library takes time
- **Maintenance burden**: Context must stay current to stay useful
- **Over-specification risk**: Too much context constrains creativity
- **False authority**: Outdated context actively misleads

## When to Use

- Teams with established standards worth preserving
- Organisations using AI assistants across multiple projects
- Environments with compliance or regulatory requirements
- Any situation where "what good looks like" should be consistent

## When Not to Use

- Greenfield exploration where standards are still forming
- One-off prototypes where consistency doesn't matter
- Small teams where verbal coordination suffices
- Projects deliberately diverging from organisational norms

## Related Patterns

- [Skills Library](skills-library.md): Executable procedures that reference Context Library standards (HOW vs WHAT)
- [Specify Plan Ship](specify-plan-ship.md): Context Library informs the specification phase
- [Regen](regen.md): Context Library changes trigger spec and code updates
- [Golden Path Anchor](golden-path-anchor.md): Reference applications can be part of the Context Library
