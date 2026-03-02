---
name: Pyramid Summary
description: Build reversible summaries at multiple zoom levels so agents can navigate between overview and detail on demand.
category: Scale
maturity: assess
---

# Pyramid Summary

Agents working with large codebases or documents face a fundamental tension. Loading everything gives accuracy but exhausts token limits. Compressing to fit discards the fine-grained information needed for precision. And once summarised, the original detail is gone from context and cannot be recovered without re-reading the source.

This is different from [Context Bypass](context-bypass.md), which delegates to external tools. Here the problem is that the agent needs to hold a mental model of a large system in its own context while retaining the ability to drill into specifics.

## Sketch

![Pyramid Summary](../docs/assets/pyramid-summary.png)

## How It Works

The approach builds reversible summaries at multiple zoom levels, so agents can navigate between overview and detail on demand.

At the base is _Layer 0_, the full, uncompressed source: files, documents, data. Above it, _Layer 1_ condenses each file or module to key facts, interfaces, and responsibilities. _Layer 2_ summarises groups of related files into architectural descriptions. And _Layer 3_ captures the entire system in a paragraph or two.

Agents start at the top layer and expand downward only where needed, keeping the rest compressed.

### Why It Works

The power comes from selective attention. Most context stays compressed; only the relevant portion expands. Any layer can be expanded to the layer below, so detail is never permanently lost. The pyramid shape means the full set of summaries is far smaller than the source material. And agents can reason about which branch to explore before committing tokens to it.

## The Trade-offs

The benefits are clear. Agents can reason about systems that far exceed context limits. They get precision where it matters by expanding only the relevant section. Summaries persist across sessions and regenerate only when source changes. And agents can hold broad understanding and deep focus simultaneously.

The costs are real too. Bad summaries at upper layers misdirect exploration. Building the pyramid takes time and tokens upfront. Summaries must be regenerated when source material changes. And deciding the right granularity for each layer requires judgement.

## When to Use It

This pattern works for agents exploring unfamiliar large codebases, multi-step tasks requiring both breadth and depth, long-running sessions where re-reading source files wastes tokens, and documentation generation requiring understanding at multiple levels.

Skip it for small codebases that fit in context without compression, tasks focused on a single file or function, and situations where [Context Bypass](context-bypass.md) is more appropriate. The distinction is: Pyramid Summary handles comprehension, Context Bypass handles data processing.

This supports [Context Library](context-library.md) by storing summaries as reference material, and enables [Agent Swarm](agent-swarm.md) by giving each worker agent only the relevant pyramid layers.

## Maturity

**Assess.** The selective expansion principle is sound, but summary quality at upper layers is critical.

## Further Reading

- [Software Factory Techniques](https://factory.strongdm.ai/techniques) - StrongDM
