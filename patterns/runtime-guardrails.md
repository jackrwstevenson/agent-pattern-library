# Runtime Guardrails

## Sketch

![Runtime Guardrails](../docs/assets/runtime-guardrails.png)

## Problem

LLMs generate fluent, confident text regardless of whether the content is appropriate, safe, or compliant. Without active controls during inference:

- **Unrestricted topics**: Models freely discuss high-risk domains (financial advice, legal interpretation, medical guidance) where incorrect output creates liability
- **Harmful content**: Output may contain hate speech, graphic violence, or harassing language that violates organisational policies
- **Data leakage**: Models can reproduce personally identifiable information from context, training data, or user prompts without awareness of data handling obligations
- **Ungrounded claims**: Models confabulate assertions that sound authoritative but lack any basis in the provided context, eroding user trust and creating compliance risk

Post-hoc validation catches some of these failures, but prevention at generation time is cheaper, safer, and reduces the volume of problematic output that downstream systems must handle.

## Solution

Apply a layered set of controls during inference that constrain what the model can generate, blocking or filtering problematic output before it leaves the model.

### Controls

**Deny topics**: Block generation on high-risk domains such as financial advice, legal or regulatory interpretation, and customer data exposure. Topic denials are categorical rather than keyword-based, preventing the model from engaging with entire subject areas regardless of phrasing.

**Content filters**: Detect and block hate speech, graphic violence, sexual content, and insulting or harassing language. Filters operate on the generated output stream, catching harmful content that topic restrictions alone may miss.

**Word filters**: Block competitor names, internal codenames, and other organisation-specific restricted terms. These are exact-match or pattern-based rules that enforce brand and commercial constraints.

**Sensitive-data controls**: Continuous PII detection with automated masking and redaction during generation. Configurable policies support hashing, tokenisation, or full redaction depending on the data classification and downstream use case.

**Contextual grounding**: Require outputs to be grounded in the provided context. Flag or block assertions that lack a sourceable anchor in the supplied documents, retrieval results, or data. This is the primary defence against confabulation.

### Layered Defence

No single control catches everything. The power of runtime guardrails comes from layering: topic restrictions prevent entire categories of risk, content filters catch harmful language that slips through, word filters enforce organisational constraints, PII controls protect data, and contextual grounding prevents confabulation. Each layer compensates for gaps in the others.

## Costs and Benefits

### Benefits

- **Prevention over detection**: Stops problematic output before it reaches users or downstream systems
- **Reduced downstream load**: Fewer failures for post-inference validation to catch, lowering overall processing cost
- **Real-time protection**: Controls operate during generation, not after, eliminating the window between generation and detection
- **Configurable by domain**: Different applications can apply different guardrail configurations without changing the model

### Costs

- **Latency overhead**: Each control adds processing time to the inference pipeline
- **False positives**: Overly aggressive filters block legitimate output, frustrating users and reducing utility
- **Maintenance burden**: Topic lists, word filters, and PII patterns require ongoing updates as the organisation and threat landscape evolve
- **Incomplete coverage**: Guardrails reduce but do not eliminate risk; determined adversarial prompting can bypass individual controls

## When to Use

- Customer-facing applications where inappropriate output creates liability
- Regulated industries (finance, healthcare, legal) with explicit content constraints
- Applications handling PII or other sensitive data
- Any deployment where confabulation poses a trust or compliance risk

## When Not to Use

- Internal prototyping where speed matters more than content safety
- Research environments where unrestricted model output is the goal
- When latency budgets cannot accommodate additional processing layers

## Related Patterns

- [Post-Inference Validation](post-inference-validation.md): Complementary second layer that validates output after generation; together they form defence in depth
- [Validation Constraint](validation-constraint.md): Validates agent-generated code through tests and observable behaviour; Runtime Guardrails validates generated text through content controls

## Sources

- [Amazon Bedrock Guardrails](https://docs.aws.amazon.com/bedrock/latest/userguide/guardrails.html) - AWS
