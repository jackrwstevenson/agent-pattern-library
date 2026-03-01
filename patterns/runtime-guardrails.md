# Runtime Guardrails

LLMs generate fluent, confident text regardless of whether the content is appropriate, safe, or compliant. Without active controls during inference, models freely discuss high-risk domains like financial advice and legal interpretation where incorrect output creates liability. They produce content that violates organisational policies. They reproduce personally identifiable information from context or training data without awareness of data handling obligations. And they confabulate assertions that sound authoritative but lack any basis in the provided context.

Post-hoc validation catches some of these failures, but prevention at generation time is cheaper, safer, and reduces the volume of problematic output that downstream systems must handle.

## Sketch

![Runtime Guardrails](../docs/assets/runtime-guardrails.png)

## How It Works

The approach is to apply a layered set of controls during inference that constrain what the model can generate, blocking or filtering problematic output before it leaves the model.

*Deny topics* block generation on high-risk domains such as financial advice, legal or regulatory interpretation, and customer data exposure. Topic denials are categorical rather than keyword-based, preventing the model from engaging with entire subject areas regardless of phrasing.

*Content filters* detect and block hate speech, graphic violence, sexual content, and insulting or harassing language. Filters operate on the generated output stream, catching harmful content that topic restrictions alone may miss.

*Word filters* block competitor names, internal codenames, and other organisation-specific restricted terms. These are exact-match or pattern-based rules that enforce brand and commercial constraints.

*Sensitive-data controls* provide continuous PII detection with automated masking and redaction during generation. Configurable policies support hashing, tokenisation, or full redaction depending on the data classification and downstream use case.

*Contextual grounding* requires outputs to be grounded in the provided context. It flags or blocks assertions that lack a sourceable anchor in the supplied documents, retrieval results, or data. This is the primary defence against confabulation.

### Layered Defence

No single control catches everything. The power of runtime guardrails comes from layering: topic restrictions prevent entire categories of risk, content filters catch harmful language that slips through, word filters enforce organisational constraints, PII controls protect data, and contextual grounding prevents confabulation. Each layer compensates for gaps in the others.

## The Trade-offs

On the benefit side, guardrails stop problematic output before it reaches users or downstream systems. They reduce the load on [Post-Inference Validation](post-inference-validation.md) by catching failures early. Controls operate during generation, eliminating the window between generation and detection. And different applications can apply different guardrail configurations without changing the model.

On the cost side, each control adds latency to the inference pipeline. Overly aggressive filters block legitimate output, frustrating users and reducing utility. Topic lists, word filters, and PII patterns require ongoing updates as the organisation and threat landscape evolve. And guardrails reduce but do not eliminate risk; determined adversarial prompting can bypass individual controls.

## When to Use It

This pattern is essential for customer-facing applications where inappropriate output creates liability, regulated industries with explicit content constraints, applications handling PII or other sensitive data, and any deployment where confabulation poses a trust or compliance risk.

It's unnecessary for internal prototyping where speed matters more than content safety, research environments where unrestricted model output is the goal, and situations where latency budgets cannot accommodate additional processing layers.

Runtime Guardrails pairs naturally with [Post-Inference Validation](post-inference-validation.md) to form defence in depth: guardrails prevent at generation time, validation catches what slips through. [Validation Constraint](validation-constraint.md) addresses a related problem for agent-generated code rather than text.

## Further Reading

- [Amazon Bedrock Guardrails](https://docs.aws.amazon.com/bedrock/latest/userguide/guardrails.html) - AWS
