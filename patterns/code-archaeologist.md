# Code Archaeologist

## Problem

Replacing legacy systems is risky because critical knowledge exists only in the code:

- **Tribal knowledge**: Business rules encoded by developers long gone
- **Implicit behaviour**: Edge cases handled by accident rather than design
- **Obsolete constraints**: Workarounds for limitations that no longer exist
- **Undocumented integrations**: Coupling points discovered only when things break

Teams replacing legacy systems often accidentally lose important behaviour or faithfully recreate constraints that no longer matter. Without explicit analysis, you inherit technical decisions from a different era without knowing which ones still serve a purpose.

## Solution

Use an AI agent to reverse-engineer existing codebases, extracting implicit knowledge into an explicit document that humans then curate before specification begins.

### Sketch

![Code Archaeologist Sketch](assets/code-archaeologist.png)

### How It Works

- **Input**: Existing codebase
- **Output**: LEGACY-ANALYSIS.md document
- **Gate**: Human curation before proceeding

The agent analyses the legacy system to extract:

- **Business rules**: Validation logic, calculations, state machines, domain constraints
- **Data models**: Entities, relationships, invariants, implicit schemas
- **Integration points**: External services, APIs, file formats, protocols
- **Edge cases**: Error handling, boundary conditions, special cases
- **Constraints**: Performance characteristics, batch windows, resource limits

### Human Curation

The analysis is a starting point, not a final answer. Humans must curate it, making deliberate choices:

| Decision      | Meaning                                        | Example                                    |
| ------------- | ---------------------------------------------- | ------------------------------------------ |
| **Retain**    | Business logic that must be preserved          | Tax calculation rules                      |
| **Discard**   | Constraints from obsolete technology           | Batch windows from mainframe era           |
| **Modernise** | Patterns with better contemporary alternatives | Replace polling with event-driven          |
| **Question**  | Unclear behaviour requiring stakeholder input  | Why does this field allow negative values? |

This curation feeds directly into specification:

- Retained behaviours become requirements
- Discarded constraints become explicit non-goals
- Modernisation candidates inform architecture decisions
- Questioned items become open issues to resolve

### Analysis Techniques

The agent can employ multiple approaches:

| Technique              | Extracts                                | Limitations                               |
| ---------------------- | --------------------------------------- | ----------------------------------------- |
| Static code analysis   | Structure, dependencies, data flow      | Misses runtime behaviour                  |
| Test mining            | Expected behaviour from existing tests  | Tests may be incomplete or wrong          |
| Log analysis           | Actual usage patterns, error rates      | Requires access to production logs        |
| Database schema review | Data models, constraints, relationships | Schema drift from application assumptions |
| API surface mapping    | Integration contracts                   | May miss undocumented protocols           |

Combining techniques produces more complete analysis than any single approach.

## Costs and Benefits

### Benefits

- **Captures tribal knowledge**: Extracts what the system actually does, not what anyone remembers
- **Surfaces obsolete constraints**: Identifies workarounds that no longer serve a purpose
- **Forces explicit decisions**: Prevents accidental preservation or loss
- **Reduces replacement risk**: Fewer surprises when the new system goes live
- **Documents the journey**: Creates artefact explaining why old behaviours were kept or dropped

### Costs

- **Time investment**: Analysis takes effort before any new code exists
- **Requires code access**: Agent needs read access to legacy codebase
- **Incomplete extraction**: Some knowledge exists only in people's heads
- **Curation bottleneck**: Human review of analysis can be slow

## When to Use

- Replacing systems where original developers are unavailable
- Migrating from platforms with poor documentation
- Modernising systems that have accumulated decades of patches
- Consolidating multiple systems with overlapping functionality
- Any replacement where "we'll just rebuild it" has failed before

## When Not to Use

- Greenfield development with no legacy system
- Simple rewrites where behaviour is well-documented
- Throwaway prototypes not intended as replacements
- Systems so broken that preserving behaviour is undesirable

## Related Patterns

Code Archaeologist is a prerequisite phase for other patterns:

- Feeds into [Specify Plan Ship](specify-plan-ship.md) as input to specification
- Informs the [Context Library](context-library.md) with domain-specific knowledge extracted from legacy code
- Supports [Regen](regen.md) by providing baseline requirements that can be re-evaluated as standards evolve
