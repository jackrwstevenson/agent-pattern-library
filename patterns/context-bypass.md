# Context Bypass

## Problem

LLM context windows have hard limits, but real-world tasks routinely exceed them:

- **Large datasets**: A spreadsheet with 100,000 rows won't fit in context
- **Big codebases**: Reading an entire repository exhausts token limits before analysis begins
- **Lengthy documents**: Legal contracts, research corpora, server logs

Common workarounds fail in predictable ways:

| Tactic          | Failure mode                                                        |
| --------------- | ------------------------------------------------------------------- |
| Truncation      | Discards potentially critical information                           |
| Sampling        | Misses patterns visible only in full data                           |
| Summarise-first | Strips fine-grained detail needed for accuracy                      |
| Agent API calls | Adds wiring overhead, bloats parsing context, increases token costs |

The fundamental issue: we're trying to bring the data to the model when we should bring the model's intent to the data.

## Solution

Delegate data-intensive operations to local code APIs. Pass only compact results back to the LLM.

### Sketch

![Context Bypass Sketch](../docs/assets/context-bypass.png)

## Tradeoffs

| Benefit                                        | Cost                                 |
| ---------------------------------------------- | ------------------------------------ |
| Handle arbitrarily large datasets              | Must build and maintain local APIs   |
| Full-data accuracy, not truncated samples      | LLM must correctly formulate queries |
| Lower token costs                              | Local execution needs sandboxing     |
| Faster responses (less data transfer)          | Additional infrastructure to deploy  |
| Leverage battle-tested tools (SQL, grep, etc.) | Debugging spans LLM and local code   |

## When to Use

- Datasets exceeding context window limits
- Aggregation tasks over large data (counting, averaging, grouping)
- Needle-in-haystack searches with clear filtering criteria
- Operations where precision matters more than flexibility
- Cost-sensitive applications processing high data volumes

## When to Avoid

- Small datasets that fit comfortably in context
- Exploratory analysis where filtering criteria emerge through iteration
- Tasks where query formulation is harder than just reading the data

## Sources

- [Tool Use in Claude](https://docs.anthropic.com/claude/docs/tool-use), Anthropic's tool use documentation
- [OpenAI Function Calling](https://platform.openai.com/docs/guides/function-calling), OpenAI's approach to structured tool calls
