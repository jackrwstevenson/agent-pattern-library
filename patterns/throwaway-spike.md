# Throwaway Spike

## Problem

Traditional development practices (tests, code review, documentation) create overhead that slows early-stage exploration:

- **Premature optimisation**: Spending time on code quality for experiments that may be discarded
- **Analysis paralysis**: Over-thinking architecture for throwaway code
- **Wasted effort**: Building production-quality code for concepts that don't pan out

When a **coding AI agent** drives the spike, new risks and opportunities appear:

- **Agent scope confusion**: The AI can over-engineer or miss the target without a tightly scoped brief
- **Hidden defaults and secrets**: Automated code may insert unsafe placeholders or attempt network calls
- **Spike-to-production drift**: AI output that looks clean is easily copy-pasted into production
- **Handoff friction**: Humans need clear, runnable artefacts and checks to validate the agent's work quickly

Teams need a way to quickly validate ideas while treating the AI as an explicit actor with constraints, inputs, and a human-in-the-loop decision gate.

## Solution

Use an AI agent optimised for rapid prototyping with explicit "throwaway" expectations and agent-specific guardrails.

Treat the agent as a focused, constraint-driven developer with a strict brief: success criterion, allowed libraries, prohibited actions, time box, and required deliverables. The agent produces a runnable, labelled prototype and a concise assessment that lets humans make a clear binary decision (proceed or discard).

### Spike Brief Template

Before starting, the human prepares a structured brief:

```
## Spike Brief

**Question to answer**: [One sentence the spike must resolve]
**Success criterion**: [Observable outcome that proves/disproves the idea]
**Sample inputs**: [Test data or scenarios to use]
**Allowed libraries**: [Explicit allowlist]
**Forbidden actions**: [e.g., no network calls, no real credentials, no database writes]
**Time box**: [Maximum effort, e.g., 2 hours]
**Deliverables**: [Code, README, verification steps, risk notes]
```

### Spike Characteristics

- **Prompt-first**: The spike is driven by a precise brief that states success criterion, inputs, allowed libs, forbidden actions, and time box
- **Happy-path only**: Agent implements the minimal flow to prove the idea, no error handling, no edge cases, no production hardening
- **Ephemeral and labelled**: All artefacts include a clear `⚠️ THROWAWAY, DO NOT SHIP` header and machine-checkable marker (e.g., `// SPIKE: delete before merge`)
- **Safety-aware defaults**: Agent must not embed secrets, production credentials, or make live calls to production services, use mocks or synthetic data
- **Minimal structure**: Prefer a single file unless the idea requires multiple files to demonstrate the point
- **Explainable output**: Agent returns code, run instructions, sample inputs/expected outputs, assumptions made, and a risk checklist
- **Human gate**: A named human reviewer must run the artefact and sign off before any next steps

### Spike Workflow

```
┌─────────────────┐
│  1. Define      │  Human writes spike brief with success criterion
│     Brief       │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  2. Agent       │  AI generates prototype within constraints
│     Generates   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  3. Human       │  Run provided steps, observe results
│     Verifies    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  4. Decision    │  Proceed → Productionize (new tickets)
│     Gate        │  Iterate → Another spike with refined brief
└─────────────────┘  Discard → Archive learnings, delete code
```

### Required Agent Deliverables

The agent must produce:

| Deliverable               | Purpose                                                  |
| ------------------------- | -------------------------------------------------------- |
| Code with SPIKE marker    | Runnable prototype, clearly labelled                     |
| README with run command   | One-liner to execute the spike                           |
| Sample verification steps | 2–3 checks human can run in < 5 minutes                  |
| Assumptions list          | What the agent assumed or deferred                       |
| Risk notes                | Security, scale, or operational concerns observed        |
| Recommendation            | Agent's assessment: promising, uncertain, or unpromising |

### Spike Isolation Rules

To prevent accidental promotion to production:

1. **Directory isolation**: All spike code lives in `/spikes/` or a dedicated branch
2. **File markers**: Every file starts with `// SPIKE: <brief-name>, delete before merge`
3. **No shared imports**: Spike code must not import from or be imported by production code
4. **CI blocking**: Lint rules or CI checks fail if SPIKE markers reach main branch
5. **Expiration date**: Spike branches auto-delete after 14 days (configurable)

## Costs and Benefits

### Benefits

- **Fast validation**: Agent produces runnable proof-of-concept in hours, not days
- **Lower human time**: Developers spend review time, not implementation time
- **Consistent artefacts**: Standard briefs yield repeatable, comparable outputs
- **Clear boundaries**: Labels and isolation reduce accidental promotion to production
- **Enables exploration**: More ideas tested in the same time budget
- **Knowledge capture**: Even failed spikes document what doesn't work

### Costs and Trade-offs

- **Technical debt temptation**: Clean AI output may hide gaps and be mistakenly promoted
- **False confidence**: Agent may not surface non-functional risks (security, scale, ops)
- **Quality culture risk**: Requires strong norms to keep spike and production standards separate
- **Brief overhead**: Writing good briefs takes practice; bad briefs yield bad spikes

## When to Use

- Validating a new library, SDK, or API integration
- Proving a parsing algorithm or data transformation
- Exploring a language feature or framework capability
- Testing feasibility of a technical approach
- Fast experiments during hackathons or discovery sprints
- Comparing two implementation strategies quickly

## When Not to Use

- Anything touching production data or sensitive systems
- Security-, privacy-, or compliance-critical functionality
- Work requiring realistic performance or load testing
- Integrations that need real authentication flows
- Anything you're tempted to "just clean up and ship"

## Anti-Patterns to Avoid

| Anti-Pattern                | Why It's Dangerous                        | Fix                               |
| --------------------------- | ----------------------------------------- | --------------------------------- |
| Shipping spike code         | Gaps in error handling, security, testing | Enforce SPIKE markers in CI       |
| Vague success criteria      | Agent builds wrong thing                  | Require one-sentence criterion    |
| No time box                 | Spike becomes mini-project                | Hard stop at time limit           |
| Skipping human verification | False confidence in results               | Require sign-off before decisions |
| No risk notes               | Hidden concerns surface later             | Make risk checklist mandatory     |

## Transitioning from Spike to Production

If the spike succeeds and you decide to proceed:

1. **Archive the spike**: Move to `/spikes/archive/` with learnings documented
2. **Create fresh tickets**: Do not "clean up" spike code, reimplement properly
3. **Reference, don't copy**: Use spike as reference for requirements, not as starting code
4. **Apply full process**: New implementation follows standard development practices (tests, review, etc.)

The spike proved the idea works. Production code proves it works _reliably, securely, and maintainably_.

## Sources

- [Spike Solutions in XP](http://www.extremeprogramming.org/rules/spike.html), Time-boxed experiments
