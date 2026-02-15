# Validation Constraint

> **Pattern in Research**: This pattern describes a direction rather than current best practice. Replacing human code review with automated validation requires mature test infrastructure and carries risks for security-sensitive code. Treat this as a lens for scaling agent output verification, not a mandate to stop reading code.

## Sketch

![Validation Constraint](../docs/assets/validation-constraint.png)

## Problem

Traditional code review doesn't scale to AI-generated code:

- **Volume**: Agents produce code faster than humans can meaningfully review it
- **Cognitive mismatch**: Reviewing unfamiliar code line-by-line is slow and error-prone
- **False confidence**: AI-generated code often looks clean and well-structured, creating a dangerous illusion of correctness
- **Review fatigue**: The sheer volume of agent output degrades review quality over time

The instinct is to read the code carefully, but this approach collapses when agents produce substantial output in minutes.

## Solution

Validate agent output exclusively through externally observable behaviour: tests, integration checks, and runtime verification. Treat generated code like ML model weights - opaque internals validated through outputs.

### Principles

1. **Tests are the specification**: If the tests pass, the implementation is acceptable. If they don't, it's not. Code style and structure are secondary.
2. **Write tests first**: Define expected behaviour before the agent generates code. The tests become the acceptance criteria.
3. **Automate verification**: Rely on CI pipelines, type checkers, linters, and integration suites rather than human reading.
4. **Observe in production**: Use monitoring, error tracking, and observability tools to catch what tests miss.

### What Changes

| Traditional review | Validation constraint |
| --- | --- |
| Read every line of code | Read test specifications |
| Judge implementation quality | Judge behavioural correctness |
| Humans are the primary gate | Automated checks are the primary gate |
| Review speed limits throughput | Test coverage limits throughput |

### Human Review Still Matters For

- Architecture and design decisions
- Security-sensitive code paths
- Test quality and coverage completeness
- Boundary definitions (what to test, what to trust)

## Costs and Benefits

### Benefits

- **Scales with agent output**: Automated checks run as fast as agents produce code
- **Objective**: Tests either pass or fail; no subjective judgement on style
- **Composable**: Each verification layer catches different classes of defect
- **Shifts investment**: Time spent writing good tests pays dividends across all future agent output

### Costs

- **Test quality is critical**: Bad tests validate bad code. The constraint is only as strong as the test suite.
- **Blind spots**: Behaviour not covered by tests or monitoring goes unvalidated
- **Cultural shift**: Teams accustomed to line-by-line review may resist
- **Upfront investment**: Requires comprehensive test infrastructure before agents become productive

## When to Use

- High-volume agent output where human review is the bottleneck
- Codebases with strong existing test suites
- Teams practising TDD or behaviour-driven development
- When agent-generated code is treated as replaceable (regenerate rather than debug)

## When Not to Use

- Security-critical code requiring manual audit
- Novel architectures where tests can't yet capture intent
- Early-stage projects where the specification is still fluid
- When test infrastructure is immature or absent

## Related Patterns

- Pairs with [Specify Plan Ship](specify-plan-ship.md) where TDD is already part of the workflow
- Enables [Agent Swarm](agent-swarm.md) by removing human review as the throughput bottleneck
- Supports [Regen](regen.md) - if validation is automated, regeneration becomes low-risk

## Sources

- [Software Factory Techniques](https://factory.strongdm.ai/techniques) - StrongDM
