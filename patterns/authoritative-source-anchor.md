# Authoritative Source Anchor

## Sketch

![Authoritative Source Anchor Sketch](../docs/assets/authoritative-source-anchor.png)

## Problem

AI agents working on standards-compliant code must make decisions about specifications they weren't trained on or can't recall accurately. Without access to authoritative sources, agents:

- **Hallucinate specifications**: Confidently generate code based on incorrect or outdated understanding of standards
- **Require constant human verification**: Engineers must check every standards-related decision
- **Leave no audit trail**: No way to verify which version of a standard informed implementation choices

The result is either unreliable output or short autonomous runs with heavy human oversight.

## Solution

Embed authoritative external specifications directly in the repository, making canonical sources available to agents during development.

### How It Works

1. **Embed specifications**: Add authoritative sources to the repository (git submodules, vendored docs, or local mirrors)
2. **Make discoverable**: Structure and index sources so agents can navigate to relevant sections
3. **Reference in code**: Agents cite specific sections when implementing standards-dependent behaviour
4. **Version pin**: Lock to specific versions so builds are reproducible and citations remain valid

### Why This Works

The key insight is that agents perform dramatically better when they can **cite rather than recall**. LLMs trained on web content have seen specifications, but:

- Training data may be outdated
- Recall is probabilistic, not precise
- Edge cases and nuances get lost
- No way to distinguish confident recall from hallucination

### Implementation Approaches

| Approach                   | Pros                                            | Cons                                        |
| -------------------------- | ----------------------------------------------- | ------------------------------------------- |
| Git submodules             | Version-pinned, standard tooling, works offline | Repository bloat, submodule complexity      |
| Vendored copies            | Simple, no external dependencies                | Manual updates, potential licensing issues  |
| MCP server                 | Dynamic access, no repo bloat                   | Requires infrastructure, network dependency |
| Local documentation mirror | Fast access, searchable                         | Storage overhead, sync maintenance          |

## Costs and Benefits

### Benefits

- **Reduced hallucination**: Agents ground decisions in authoritative sources
- **Longer autonomous runs**: Fewer interruptions for human verification
- **Audit trail**: Trace decisions to specific spec sections
- **Reproducible builds**: Pinned versions ensure consistent behaviour
- **Faster onboarding**: New agents (and humans) have specs at hand

### Costs

- **Repository overhead**: Embedded specs increase repo size
- **Maintenance burden**: Specs must be kept current
- **Licensing constraints**: Some specs cannot be redistributed

## When to Use

- Projects implementing web standards (HTML, CSS, ECMAScript)
- Protocol implementations (HTTP, WebSocket, gRPC)
- Regulatory compliance work (GDPR, HIPAA, PCI-DSS)
- Language tooling (compilers, linters, formatters)
- Any domain with authoritative external specifications

## When NOT to Use

- Rapidly evolving specifications where pinning causes problems
- Proprietary specs with restrictive licensing
- Simple projects where standards compliance isn't critical

## Related Patterns

- [Context Library](context-library.md): Internal organisational standards (WHAT we do here) vs external authoritative sources (WHAT the standard says)
- [Specify Plan Ship](specify-plan-ship.md): Authoritative sources inform the specification phase
- [Regen](regen.md): Spec version updates can trigger regeneration

## Sources

- [FastRender development approach](https://simonwillison.net/2026/Jan/23/fastrender/) - Wilson Lin's use of spec submodules for autonomous agent development
