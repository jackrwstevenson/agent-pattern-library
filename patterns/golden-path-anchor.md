# Golden Path Anchor

## Problem

Organisations maintain reference applications (templates, starter kits, golden paths) that embody best practices. These references work well for new projects but fail to influence existing ones:

- **Drift**: Once teams fork templates, codebases diverge over time
- **Manual updates**: Propagating template improvements to existing projects is tedious and error-prone
- **Stale patterns**: Reference apps evolve, but downstream projects don't follow

The result is that "best practices" exist only in documentation and new projects, while the bulk of the codebase operates on outdated patterns.

## Solution

Use an AI agent to continuously align codebases with reference implementations through drift detection and automated remediation.

### How It Works

1. **Reference monitoring**: Watch for changes to the reference application
2. **Drift detection**: Compare target codebases against latest patterns
3. **Impact analysis**: Assess scope and risk of updates
4. **Automated remediation**: Generate PRs with contextual updates
5. **Human review**: Engineers approve and merge changes

### Why This Works

The key insight, described by Birgitta Böckeler as "anchoring to reference", is that a well-maintained reference application can serve as an executable, authoritative source of truth for coding standards.

AI agents make this practical at scale because they can:

- **Extract patterns, not just diffs**: Understand the intent behind reference code
- **Apply contextually**: Adapt patterns to different codebases rather than blind copy-paste
- **Explain changes**: Document why updates align with reference standards
- **Handle tedium**: Refactoring that's mind-numbing for humans is routine for AI

### Limitations and Mitigations

**Structural similarity assumption**: The pattern assumes reference and target share similar architecture. When targets have legitimately different structures, the agent must distinguish "drift to fix" from "intentional variation".

Mitigations:

- `.anchor-ignore` files for explicit exceptions
- Confidence thresholds, low-confidence suggestions require human triage
- Pattern-level rules defining which patterns are mandatory vs. recommended

**Reference quality is critical**: Bad patterns propagate automatically too. A flawed security practice in the reference becomes a fleet-wide vulnerability.

Mitigations:

- Rigorous review process for reference changes
- Staged rollout, apply to canary projects before fleet-wide propagation
- Easy rollback mechanisms for problematic updates

**Review overhead**: PRs still need human approval, which can become a bottleneck.

Mitigations:

- Auto-merge for low-risk, high-confidence updates (with appropriate guardrails)
- Clear categorisation: breaking vs. non-breaking, security vs. style

## Costs & Benefits

### Benefits

- **Living standards**: Best practices propagate automatically
- **Reduced maintenance burden**: Updates flow with minimal manual effort
- **Consistency at scale**: All projects stay aligned
- **Easier auditing**: Clear traceability from reference to implementation
- **Lower cognitive load**: Teams don't need to track what's changed in the reference

### Costs

- **Reference becomes critical path**: Poor reference quality causes fleet-wide harm
- **Intentional drift is awkward**: Legitimate variations require explicit exception handling
- **Tooling investment**: Requires infrastructure for comparison, PR generation, and tracking
- **False positives**: Agent may flag acceptable variations as drift
- **Review fatigue**: Too many auto-generated PRs can overwhelm teams

## When to Use

- Organisations with multiple similar applications (microservices, multi-tenant)
- Platform teams maintaining golden paths
- Compliance environments requiring consistent implementation
- Large teams where manual standardisation doesn't scale
- When reference applications are stable and well-maintained

## When NOT to Use

- Small teams with few projects
- Highly diverse applications with little shared structure
- When the reference application itself is unstable or frequently changing
- Projects with legitimate architectural differences from the reference
- Early-stage organisations where patterns are still being discovered

## Sources

- [Anchoring AI to Reference Applications](https://martinfowler.com/articles/exploring-gen-ai/anchoring-to-reference.html) - Birgitta Böckeler
