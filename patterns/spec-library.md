# Spec Library

## Problem

Traditional software distribution treats code as the primary artefact, creating several friction points:

- **Language lock-in**: A library exists for Python but not Rust, leaving developers to write their own or go without
- **Maintenance burden**: Each language variant requires separate upkeep, bug fixes, and version management
- **Translation drift**: Ports and reimplementations slowly diverge from the original's behaviour
- **Context mismatch**: Downloaded code may clash with your environment, style guide, or dependency constraints

The root issue: we distribute implementations when what we actually need is behaviour.

## Solution

Distribute the specification and tests instead of code. Let AI generate implementations on demand, tailored to any language or context.

The specification defines _what_ the library does. The tests prove _whether_ an implementation is correct. The code itself becomes ephemeral, generated fresh whenever needed.

## Structure

- **SPEC.md** - Behavioural requirements in plain language
- **tests.yaml** - Language-agnostic test cases
- **INSTALL.md** - Generation instructions for users
- **examples/** - Sample outputs for reference (optional)

### SPEC.md Format

A SPEC.md should include:

- **Purpose**: What problem this solves and why it exists
- **Functions**: Each with signature, precise behavioural description, constraints, and edge cases
  - **Constraints**: Invariants that must hold, performance or resource bounds
  - **Edge cases**: How to handle empty/null inputs, boundary conditions

### tests.yaml Format

Each test case defines:

- **name**: Descriptive label (e.g., "basic case", "edge case - empty input", "error case - invalid type")
- **function**: The function under test
- **input**: Arguments to pass
- **expected**: The expected return value, or **throws** for error cases

### Generation Prompt

The generation prompt instructs the agent to:

1. Read SPEC.md for behavioural requirements
2. Parse tests.yaml for test cases
3. Generate tests in the target language first (TDD red-green-refactor)
4. Implement functions until all tests pass
5. Follow local conventions for style and idioms

## Tradeoffs

| Benefit                                  | Cost                                                        |
| ---------------------------------------- | ----------------------------------------------------------- |
| Universal language availability          | Requires capable AI for generation                          |
| Zero cross-language maintenance          | Specification must be rigorous; ambiguity causes drift      |
| Context-appropriate output (style, deps) | Non-functional properties (perf, security) less predictable |
| Always current with latest practices     | Generation time on each use                                 |
| Smaller distribution size                | Users need AI access                                        |

## When to Use

- Utility libraries with clear, testable behaviour (parsing, formatting, validation)
- Cross-platform tools needed in multiple languages
- Internal libraries where "correct and readable" beats "maximally optimised"

## When to Avoid

- Performance-critical code requiring hand-tuned optimisation
- Security-sensitive implementations requiring formal verification
- Specifications changing faster than regeneration is practical

## The Inversion

- **Traditional flow**: Specification, Implementation, Distribution, Usage
- **Codeless flow**: Specification + Tests, Distribution, Generation, Usage

The novel insight: specifications and tests are the durable artefacts; implementations are disposable.

## Sources

- [A Software Library with No Code](https://www.dbreunig.com/2026/01/08/a-software-library-with-no-code.html), Drew Breunig's whenwords experiment
- [whenwords](https://github.com/dbreunig/whenwords), Reference implementation of the pattern
