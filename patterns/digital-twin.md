# Digital Twin

> **Pattern in Research**: This pattern describes a direction rather than current best practice. Building behavioural replicas of third-party services requires significant tooling investment, and the fidelity of the twin depends on the quality and completeness of captured interactions. Treat this as a lens for improving agent testing workflows, not a plug-and-play solution.

## Sketch

![Digital Twin](../docs/assets/digital-twin.png)

## Problem

AI agents writing integration code need to test against external dependencies (APIs, databases, cloud services), but:

- **Rate limits and costs**: Real APIs charge per call; testing at scale is expensive
- **Non-determinism**: External services return different results at different times, making tests flaky
- **Availability**: Third-party services go down, blocking development
- **Edge cases**: Difficult to reproduce error conditions, timeouts, and failure modes against real services
- **Speed**: Network calls slow test suites, discouraging thorough testing

Mocking is the traditional answer, but hand-written mocks drift from real behaviour and test the mock rather than the integration.

## Solution

Clone the externally observable behaviour of critical third-party dependencies into local replicas that agents can test against at any volume, speed, or failure condition.

### How It Works

1. **Capture**: Record real interactions with the external dependency (request/response pairs, state transitions, error responses)
2. **Model**: Build a behavioural replica that reproduces the dependency's observable contract
3. **Validate**: Verify the twin against the real service periodically to detect drift
4. **Test**: Agents run integration tests against the twin with full control over conditions

### What Makes This Different from Mocks

| Aspect | Traditional mocks | Digital twin |
| --- | --- | --- |
| Source of truth | Developer assumptions | Observed real behaviour |
| Drift detection | None | Automated validation |
| State management | Typically stateless | Preserves stateful interactions |
| Edge cases | Manually authored | Captured from production |

## Costs and Benefits

### Benefits

- **Deterministic testing**: Identical inputs always produce identical outputs
- **Volume testing**: Test at rates far exceeding production limits
- **Failure injection**: Simulate outages, timeouts, and error responses on demand
- **Speed**: Local execution eliminates network latency
- **Cost reduction**: No API charges during development

### Costs

- **Initial capture effort**: Must record sufficient real interactions to model behaviour
- **Maintenance**: Twins need periodic revalidation against the real service
- **Behavioural fidelity**: Undiscovered edge cases remain unmodelled
- **Complexity**: Another system to build and maintain

## When to Use

- Testing integrations with rate-limited or paid APIs
- Reproducing specific failure conditions for debugging
- Load testing that would exceed production quotas
- CI pipelines needing fast, reliable integration tests
- Agent workflows that iterate rapidly against external services

## When Not to Use

- Simple, stateless APIs where basic mocks suffice
- Services with official sandbox environments that already meet testing needs
- When the integration surface is trivial (one or two endpoints)

## Sources

- [Software Factory Techniques](https://factory.strongdm.ai/techniques) - StrongDM
