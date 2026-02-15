# Session Checkpoint

> **Pattern in Research**: This pattern describes a direction rather than current best practice. Tooling for session capture and checkpoint-based rollback is nascent, and the value depends on team workflows and review norms. Treat this as a lens for thinking about agent observability, not a mature practice.

## Sketch

![Session Checkpoint](../docs/assets/session-checkpoint.png)

## Problem

AI agent sessions are opaque and fragile:

- **No undo**: When an agent makes a destructive change, recovery means manual git archaeology
- **Lost reasoning**: The chain of thought behind code changes disappears when the session ends
- **No replay**: You cannot revisit an earlier point in a session to branch a different direction
- **Invisible work**: Team members reviewing agent-assisted code have no visibility into how it was produced

Agent output looks like any other commit, but the process that created it is fundamentally different from human development and worth preserving.

## Solution

Capture agent sessions as a sequence of checkpoints with full context (prompts, responses, file changes), stored on a separate branch to keep code history clean.

### How It Works

1. **Session recording**: Capture all agent interactions from start to finish
2. **Checkpoint creation**: Save restore points at each commit or agent response
3. **Shadow storage**: Store session metadata on a dedicated branch (e.g. `checkpoints/v1`), not in the code branch
4. **Rollback**: Rewind to any checkpoint without losing the session context that led there
5. **Summarisation**: Auto-generate summaries of intent, outcomes, and learnings at commit time

### What Gets Captured

- Prompts sent to the agent
- Agent responses and reasoning
- Files modified at each step
- Timestamps and model identifiers
- Auto-generated session summaries

## Costs and Benefits

### Benefits

- **Safe experimentation**: Roll back mistakes without losing context
- **Team visibility**: Others can understand how agent-assisted code was produced
- **Audit trail**: Complete provenance from prompt to committed code
- **Knowledge capture**: Summaries preserve intent and learnings for future sessions
- **Multi-agent support**: Track concurrent sessions independently

### Costs

- **Storage overhead**: Session metadata accumulates over time
- **Tooling dependency**: Requires integration with your agent and git workflow
- **Noise risk**: Too much metadata can overwhelm rather than inform
- **Branch management**: Shadow branches need periodic cleanup

## When to Use

- Teams adopting AI agents where code review norms require understanding provenance
- High-stakes codebases where rollback capability matters
- Onboarding scenarios where reviewing past agent sessions accelerates learning
- Multi-agent workflows where concurrent sessions must be tracked independently

## When Not to Use

- Solo prototyping where session history adds no value
- Short, single-purpose agent interactions
- Environments where git branch restrictions prevent shadow branches

## Related Patterns

- Complements [Specify Plan Ship](specify-plan-ship.md) by preserving the reasoning behind implementation decisions
- Supports [Agent Swarm](agent-swarm.md) by tracking concurrent agent sessions independently

## Sources

- [Entire CLI](https://github.com/entireio/cli) - Entire.io
