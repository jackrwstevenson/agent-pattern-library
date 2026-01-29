# Specify Plan Ship

## Problem

AI agents excel at generating code but struggle with:

- **Scope creep**: Without boundaries, agents wander into over-engineering or miss requirements entirely
- **Context loss**: Long sessions degrade quality as agents lose track of goals and constraints
- **Inconsistent quality**: Results vary wildly without structured feedback loops
- **Difficult debugging**: When things go wrong, it's unclear where the process failed

Teams using AI assistants often experience a frustrating pattern: impressive initial demos followed by mounting technical debt as agents produce code that works but doesn't fit the broader system.

## Solution

Structure AI-assisted development into three distinct phases, each with explicit artefacts and verification gates.

For brownfield environments replacing legacy systems, use the [Code Archaeologist](code-archaeologist.md) pattern first to extract implicit business rules before specification begins.

### Phase 1: Specification

**Input**: Idea, requirements, or curated legacy analysis
**Output**: SPEC.md document
**Gate**: Human approval before proceeding

The human and agent collaborate to flesh out requirements through iterative questioning. Where available, the agent consults a [Context Library](context-library.md) of vetted standards, components, and domain knowledge to inform the specification.

1. Agent asks clarifying questions until edge cases and constraints are clear
2. Requirements are documented in a structured specification
3. Architecture decisions, data models, API contracts, and testing strategy are captured
4. Acceptance criteria are defined in testable terms

**SPEC.md should include:**

- Problem statement and goals
- Non-goals (explicitly out of scope)
- Data models and type definitions
- API or interface contracts
- Error handling strategy
- Security and performance constraints
- Acceptance criteria

The spec becomes the source of truth that both human and agent reference throughout.

### Phase 2: Planning

**Input**: Approved SPEC.md
**Output**: PLAN.md document
**Gate**: Human approval before proceeding

Break the specification into small, verifiable implementation steps:

1. Each task should be completable in one focused session (15-30 minutes of agent work)
2. Each task has explicit verification criteria (typically a test command)
3. Dependencies between tasks are mapped
4. Tasks are ordered topologically by dependency

**PLAN.md should include:**

- Ordered task list with checkboxes
- For each task: description, files touched, verification command
- Estimated complexity per task
- Rollback points (where you can safely stop)

A good plan enables "one-shot" implementation where each step can be completed without rework.

### Phase 3: Implementation (Red-Green-Refactor)

**Input**: Approved PLAN.md
**Output**: Working, tested code
**Gate**: All tests pass, human review of changes

Execute each task using strict Test-Driven Development:

#### Red: Write a Failing Test

1. Write a test that captures the expected behaviour from SPEC.md
2. Run the test - it **must fail** (if it passes, your test is wrong or the feature exists)
3. Ensure the failure message is clear and describes the missing behaviour

#### Green: Make It Pass

1. Write the **minimum code** necessary to make the test pass
2. No cleverness, no optimisation, no "while I'm here" improvements
3. Run the test - it **must pass**
4. If it fails, fix the implementation (not the test, unless the test was wrong)

#### Refactor: Clean Up

1. Now that tests are green, improve the code structure
2. Remove duplication, improve names, simplify logic
3. Run tests after each change - they **must stay green**
4. Commit when refactoring is complete

#### Cycle Discipline

- **One behaviour per cycle**: Each red-green-refactor addresses exactly one requirement
- **Never skip red**: Writing code without a failing test first leads to untested behaviour
- **Never skip refactor**: Technical debt compounds; clean as you go
- **Commit after each cycle**: Small, verified commits create a clear history
- **Reference SPEC.md**: Each test should trace back to a specification requirement

## Why This Works for Agents

Agents are prone to writing code that "looks right" but doesn't work. This structure addresses core LLM limitations:

| LLM Limitation                | How This Pattern Compensates                   |
| ----------------------------- | ---------------------------------------------- |
| Limited context window        | SPEC.md and PLAN.md externalise working memory |
| No persistent memory          | Documents persist across sessions              |
| Overconfidence                | Verification gates catch errors early          |
| Scope drift                   | Explicit non-goals and task boundaries         |
| Quality degradation over time | Small cycles with mandatory refactoring        |

## Costs and Benefits

### Benefits

- **Improved quality**: Structured process produces improved results
- **Clear accountability**: Human reviews spec and plan before expensive implementation
- **Easy debugging**: When issues arise, trace back to the specific phase and step
- **Reduced rework**: Catching issues in planning is far cheaper than in code
- **Knowledge capture**: SPEC.md and PLAN.md serve as living documentation
- **Interruptible**: Work can pause and resume without losing context
- **Auditable**: Clear artefact trail for compliance or review

### Costs

- **Upfront time investment**: Creating specs and plans takes effort before any code exists
- **Overhead for small tasks**: Simple bug fixes don't need the full cycle
- **Document maintenance**: Specs and plans can drift from reality if not updated
- **Learning curve**: Teams need practice to write good specs and plans

## When to Use

- New feature development with unclear requirements
- Complex changes spanning multiple files or systems
- Work that will be reviewed by others or maintained long-term
- When onboarding AI assistants to a new codebase
- Projects where requirements are evolving

## When Not to Use

- Trivial bug fixes (typos, obvious errors)
- Exploratory prototyping where you expect to throw away the code (see [Throwaway Spike](throwaway-spike.md))
- Single-line changes with clear scope

## Scaling the Pattern

For small tasks, use a lightweight version:

| Task Size               | Spec                | Plan                 | TDD      |
| ----------------------- | ------------------- | -------------------- | -------- |
| Trivial (typo fix)      | Skip                | Skip                 | Optional |
| Small (single function) | Mental note         | Skip                 | Yes      |
| Medium (single feature) | Brief SPEC.md       | Task list            | Yes      |
| Large (multi-file)      | Full SPEC.md        | Full PLAN.md         | Yes      |
| Epic (multi-session)    | SPEC.md + sub-specs | PLAN.md + milestones | Yes      |

## Related Patterns

- [Code Archaeologist](code-archaeologist.md): Optional prerequisite for brownfield projects
- [Context Library](context-library.md): Vetted knowledge that informs specification
- [Regen](regen.md): Treats specs as functions that regenerate when inputs change

## Sources

- [My LLM coding workflow](https://medium.com/@addyosmani/my-llm-coding-workflow-going-into-2026-52fe1681325e), Addy Osmani
