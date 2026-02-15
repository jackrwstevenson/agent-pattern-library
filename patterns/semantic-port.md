# Semantic Port

> **Pattern in Research**: This pattern describes a direction rather than current best practice. Verifying behavioural equivalence across languages is hard, and subtle semantic differences between runtimes can introduce silent bugs. Treat this as a lens for rethinking code translation, not a guarantee of correctness.

## Sketch

![Semantic Port](../docs/assets/semantic-port.png)

## Problem

Porting code between languages or frameworks is common but painful:

- **Manual translation is slow**: Line-by-line rewriting is tedious and error-prone
- **Syntax-level tools miss intent**: Transpilers and converters produce technically correct but unidiomatic output
- **Framework conventions differ**: A React component and a SwiftUI view solve the same problem with entirely different patterns
- **Ongoing ports compound**: When the source continues to evolve, the port must track changes continuously

Traditional automated translation treats code as syntax to be converted. The result compiles but doesn't read like code a native developer would write.

## Solution

Use AI agents to perform semantically-aware ports that preserve intent and produce idiomatic output in the target language or framework.

### How It Works

1. **Extract intent**: Analyse the source code to understand what it does and why, not just how
2. **Map idioms**: Identify the target language's native patterns for expressing the same intent
3. **Generate idiomatically**: Produce code that follows the target ecosystem's conventions, naming, and structure
4. **Validate behaviourally**: Verify the port preserves the original's observable behaviour through tests

### One-Time vs. Ongoing

**One-time port**: Migrate a codebase from one language to another. The source is archived; the target becomes canonical.

**Ongoing port**: Source and target co-exist. Changes in the source propagate to the target automatically. Useful for maintaining SDKs across multiple languages from a single reference implementation.

### What Makes This Different from Transpilation

| Aspect | Transpiler | Semantic port |
| --- | --- | --- |
| Input | Syntax tree | Intent and behaviour |
| Output | Mechanically correct code | Idiomatic code |
| Error handling | Source language patterns | Target language patterns |
| Dependencies | Direct equivalents or shims | Native ecosystem libraries |
| Result | Compiles but reads foreign | Reads like native code |

## Costs and Benefits

### Benefits

- **Idiomatic output**: Generated code follows target ecosystem conventions
- **Faster than manual**: Agents port in minutes what takes developers days
- **Ongoing sync**: Continuous ports keep multi-language projects aligned
- **Preserves intent**: Business logic survives translation intact

### Costs

- **Validation burden**: Behavioural equivalence must be verified, not assumed
- **Idiom mapping is hard**: Some patterns have no clean equivalent in the target
- **Edge cases**: Subtle language differences (threading models, error handling) risk silent behavioural changes
- **Test porting**: Tests must also be ported or rewritten for the target

## When to Use

- Maintaining SDKs or libraries across multiple languages
- Migrating codebases between frameworks (e.g. Angular to React, UIKit to SwiftUI)
- Porting reference implementations to new platforms
- Keeping multi-language projects synchronised with a single source of truth

## When Not to Use

- When a rewrite from scratch would be simpler than porting
- Trivial codebases where manual translation is faster than setting up the process
- When the source and target languages are too conceptually different for meaningful mapping

## Related Patterns

- Pairs with [Spec Library](spec-library.md) - specifications define what to implement; Semantic Port provides the mechanism for generating language-specific code
- Supports [Regen](regen.md) - when the source evolves, the port regenerates
- Complements [Validation Constraint](validation-constraint.md) - behavioural tests verify port correctness

## Sources

- [Software Factory Techniques](https://factory.strongdm.ai/techniques) - StrongDM
