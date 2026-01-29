# Regen

## Problem

Traditional documentation rots. Teams write specs once, then watch them drift from reality until they're worse than useless. The same happens with AI-assisted development: agents produce code based on requirements that become stale as standards evolve, dependencies update, and business rules change.

The maintenance burden compounds:

- Security standards tighten, but existing code isn't updated
- New components become available, but old implementations don't adopt them
- Domain models evolve, but specs reference outdated terminology
- Best practices improve, but codebases fossilise around old patterns

Manual updates don't scale. Teams either fall behind or spend disproportionate effort keeping everything aligned.

## Solution

Treat specifications and implementations as functions, not artefacts.

- SPEC = f(requirements, corpus)
- PLAN = f(SPEC)
- CODE = f(PLAN)

When inputs change, outputs regenerate - all the way down. A security standard updates, affected specs regenerate, plans adapt, and code follows. This isn't rework; it's keeping the entire system aligned with reality.

The pattern works because regeneration is cheap. Agents draft; humans review.

### Dependency Tracking

Every SPEC.md declares what it depends on:

- `corpus/standards/security-policy.md@v2.1`
- `corpus/components/auth-client.md@v1.3`
- `corpus/domain/customer-model.md@v4.0`

When any dependency changes, dependency scanning identifies which specs need review. This can be automated: a security policy update triggers a list of affected specs, the agent proposes updates, and humans approve or reject.

### Regeneration Triggers

**Context Library changes** propagate through the entire chain. When a standard in the [Context Library](context-library.md) updates, affected specs regenerate, plans adapt, and implementations are updated to match.

**Discovery during implementation** surfaces gaps. When building reveals the spec missed something, the spec updates, the plan adjusts, and code changes cascade. Don't patch around gaps - fix them at the source.

**Scheduled reviews** catch drift. Periodic freshness checks ensure nothing falls too far behind. Treat it like dependency updates: regular, incremental, not a massive catching-up exercise.

### Living Systems

When a spec regenerates after implementation exists, the agent proposes code changes to align with the new spec. Tests that fail against the regenerated spec reveal real drift that needed fixing anyway.

The application evolves with its inputs rather than calcifying against outdated assumptions. Standards become living constraints, not historical snapshots.

## Costs and Benefits

### Benefits

- **Continuous alignment**: Systems stay current with evolving standards
- **Reduced drift**: Regular regeneration prevents large catch-up efforts
- **Cheap updates**: Agents draft changes; humans review rather than rewrite
- **Clear provenance**: Every spec knows what it depends on and why
- **Audit trail**: Version control tracks what changed and when

### Costs

- **Infrastructure investment**: Dependency tracking and scanning needs tooling
- **Review load**: More regeneration means more human review cycles
- **False positives**: Not every corpus change requires spec updates
- **Coordination overhead**: Large regenerations may need sequencing

## When to Use

- Systems that must track evolving standards or regulations
- Long-lived applications where maintenance matters
- Multi-team environments where consistency across projects is valuable
- Compliance contexts requiring demonstrable currency
- Any system where "we'll update it later" means "we'll never update it"

## When Not to Use

- Short-lived prototypes where currency doesn't matter
- Stable domains with infrequent standard changes
- Projects where regeneration cost exceeds drift cost
- Early-stage work where specs are still forming

## Related Patterns

- [Context Library](context-library.md): The vetted knowledge that specs depend on
- [Specify Plan Ship](specify-plan-ship.md): The workflow that produces specs and plans
- [Code Archaeologist](code-archaeologist.md): Extracts initial requirements from legacy systems
- [Golden Path Anchor](golden-path-anchor.md): Applies similar regeneration thinking to reference applications
