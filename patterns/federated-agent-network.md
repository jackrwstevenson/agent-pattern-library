---
name: Federated Agent Network
description: Connect independent agent systems through shared protocols and schemas, enabling cross-boundary collaboration without central orchestration.
category: Scale
maturity: assess
---

# Federated Agent Network

> **In plain terms:** When independent teams each run their own AI agent systems, central coordination doesn't work - no one wants to cede control. Federation connects these independent systems through shared protocols, like how email works across providers. Each team keeps its own tools and governance.
>
> **What is it?** Independent agent systems collaborating through shared schemas and Git-style fork-and-merge semantics, without central orchestration.
> **What's in it for you?** Cross-boundary collaboration without surrendering control of your tools, data, or governance to a central platform.
> **What are the trade-offs?** Schema evolution, trust bootstrapping, and anti-fraud are all harder in federated systems than centralised ones.

[Agent Swarm](agent-swarm.md) addresses an emerging problem: how to coordinate many agents working on the same codebase under a single team's control. A central orchestrator decomposes work, assigns it, and manages integration. This works well when one party has authority over the entire system.

What happens when independent teams, each running their own agent systems, want to collaborate on shared work? The central orchestrator model breaks down here, for the same reason that a single enterprise service bus breaks down across organisational boundaries. No single party has authority. No single system can hold the full context. And no one wants to cede control of their tooling to someone else.

The instinct is to standardise: get everyone onto one platform. This fails for the same reason enterprise-wide tool mandates usually fail. Teams have different stacks, different trust requirements, different governance needs. Centralisation creates a single point of failure and, perhaps more importantly, a political chokepoint.

The alternative is _federation_: independent systems collaborating through shared protocols, much as email works across providers or Git works across hosting platforms. I find the analogy to email particularly instructive; no one owns email, everyone speaks SMTP, and your identity is portable across providers. The question is whether something similar can work for agent-to-agent collaboration at scale.

## Sketch

_Sketch coming soon._

## How It Works

The core idea is to separate the protocol from the platform. Each participant runs a sovereign agent system; their own orchestrator, their own data store, their own governance rules. These systems connect through a shared schema that defines how work is described, claimed, submitted, and validated. Each node stores its own copy of the relevant data. Synchronisation happens through fork-and-merge semantics on structured data.

If that sounds familiar, it should. It's the same model Git uses for source code, extended to structured records. I think this is the crucial architectural insight: rather than inventing a new coordination protocol, you reuse the one that development teams already understand and that AI agents already know better than almost any other collaboration mechanism.

### The Schema

The shared schema is deliberately simple. Work items have titles, descriptions, effort estimates, and tags. Completions include evidence of what was done; a commit, a link, a description. Validations carry structured attestations. Each node speaks this schema but stores the data in its own database, under its own governance.

This means no single node owns the canonical state. Each has a consistent local view that it can merge with others. Conflicts are resolved through the same merge semantics the team already uses for code. Whether this scales to truly large networks is an open question; merge conflicts on structured data are less well-understood than merge conflicts on source files, and I suspect this will be where early implementations hit friction.

### Portable Identity

A participant's identity travels with them across the network. Join one node, and your handle, trust level, and work history are visible to other nodes you join later. A contributor who has demonstrated reliability in one context carries that reputation into the next.

This portability relies on the append-only nature of the underlying data. Work history can't be rewritten after the fact. Every validation points to specific evidence, and every piece of evidence points to a specific work item. The graph is fully traversable; you can trace any reputation claim back to the work that earned it.

I find this appealing in principle, but I should note that portable identity across trust boundaries is a genuinely hard problem. The internet has been trying to solve federated identity for decades, with mixed results. The append-only ledger helps, but it doesn't solve the bootstrapping problem: how do you trust a newcomer whose history is in a node you've never interacted with?

### Progressive Trust

New participants start with minimal capabilities: browsing available work, claiming items, and submitting completions. As their work is validated and attestations accumulate, they earn broader permissions; eventually including the ability to validate others' work. This creates a natural apprenticeship path.

The critical constraint is what Steve Yegge calls the _yearbook rule_: you cannot validate your own work. Reputation is what others attest about you, not what you claim about yourself. This is the fundamental difference from systems where participants self-report their skills. Whether it's sufficient to prevent gaming is another matter; collusion rings, where participants validate each other's trivial work to inflate reputations, are an obvious attack vector. The claim is that these rings have a distinctive graph topology (lots of mutual validation, sharp boundaries, no outside critics) that can be detected, but I haven't seen this demonstrated at scale.

### Work Lifecycle

The protocol defines a simple lifecycle: open, claimed, in review, completed. When a participant claims an item, others can see who's working on it, preventing duplicate effort. Completed work includes evidence. A participant with sufficient trust reviews the evidence and issues a structured validation; not binary pass/fail, but a multi-dimensional attestation covering dimensions like quality, reliability, and creativity, each scored independently with a confidence level.

This multi-dimensional validation is one of the more interesting ideas. A binary stamp loses information. Knowing that someone is excellent at backend work but unreliable at frontend gives you much more useful signal than knowing they have a "good" reputation. Whether validators will actually provide this granularity consistently is an empirical question I can't yet answer.

## The Trade-offs

The benefits address real limitations of centralised approaches. No single point of failure or political chokepoint. Each node retains sovereignty over its own data and governance. The protocol scales horizontally; adding nodes doesn't bottleneck a central coordinator. Participants can join and leave without disrupting the network. And identity portability means work history accumulates across contexts rather than being locked into a single platform.

The costs are substantial, and I want to be honest about them. Schema evolution across independent nodes is a coordination challenge; every node must understand new schema versions, and there's no central authority to enforce upgrades. Trust bootstrapping is a cold-start problem; new networks have no reputation data, so early validation requires manual trust grants that undermine the system's premise. Anti-fraud is harder in federated systems than centralised ones. And the infrastructure requirements are significant: each node needs a versioned, merge-capable data store, which is not yet commodity technology.

I'm also uncertain about the governance model. The article that inspired this pattern describes the protocol as something that "will get worked out," which is honest but not reassuring. Federation without governance tends to fragment; federation with governance tends to centralise. Finding the middle ground is the hard problem that email, and every other federated protocol has struggled with.

## When to Use It

This pattern suits situations where multiple independent teams or organisations want to share work without ceding control to a central platform. I can see it fitting open-source ecosystems where contributors span many organisations, cross-company collaboration on shared standards, and networks of independent developers coordinating through a common protocol.

Avoid it when a single team controls all the agents; use [Agent Swarm](agent-swarm.md) instead. Avoid it when the overhead of protocol compliance exceeds the benefit of federation. Avoid it for small collaborations where a shared repository and PR workflow suffice. And avoid it when trust requirements demand tightly controlled, centrally audited systems.

[Agent Swarm](agent-swarm.md) scales within a single orchestrator's control; this pattern scales across independent systems. [Autonomous Agent](autonomous-agent.md) provides the task-selection capability that individual nodes need to participate effectively. [Provenance Ledger](provenance-ledger.md) records artefact provenance within a single system; federation extends that provenance across organisational boundaries. And [Agent Memory Graph](agent-memory-graph.md) provides coordination primitives within a node, while the federation protocol coordinates across nodes.

## Maturity

**Assess.** The architectural ideas are sound; Git-style federation, portable identity, progressive trust; and they draw on well-established distributed systems principles. But production implementations are in their earliest stages. The most visible experiment is Steve Yegge's Wasteland, a federation layer for his Gas Town orchestrator, built on Dolt (a SQL database with Git semantics). Schema evolution, anti-fraud, and cross-node trust calibration are all unsolved at scale. I find the direction compelling, but I'd want to see these systems handle real adversarial conditions before recommending them for anything beyond experimentation.

## Further Reading

- [Welcome to the Wasteland: A Thousand Gas Towns](https://steve-yegge.medium.com/welcome-to-the-wasteland-a-thousand-gas-towns-a5eb9bc8dc1f) — Steve Yegge's launch post for Gas Town federation
- [Dolt](https://www.dolthub.com/) — SQL database with Git semantics, the storage layer behind the Wasteland
