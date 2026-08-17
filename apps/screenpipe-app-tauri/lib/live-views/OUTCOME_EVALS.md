# Live View outcome evals

The existing Pipe eval suite under `crates/screenpipe-semantic/evals/pipes/`
tests evidence representation, prompt retention, artifact creation, fact recall,
ordering, and contamination. Those checks are necessary, but they do not show
that a Live View helps a person make a good decision.

The deterministic `outcome-evals.test.ts` layer adds a narrower product
contract for bundled Live View designs:

1. state the user-visible outcome;
2. name the decisions the view supports;
3. expose source evidence and the trust boundary;
4. end in a next action, success check, or stop condition;
5. for financial models, show the annual-hours formula, illustrative rates,
   excluded costs, and the boundary between modeled and realized value.

This is a regression check, not a semantic judge and not a production gate.
It can reject structurally incomplete designs, but it cannot prove that a
rendered answer is correct, useful, or behavior-changing.

## Existing privacy-safe product signals

The app already records non-content events for a visible Live View result,
positive or corrective Block feedback, persisted item actions, and repeat
qualified value. Use result views as diagnostics; use positive feedback,
resolve/snooze/correct actions, and repeat qualified value as stronger outcome
signals. A dismiss or reopen action is not accepted value.

Template preview and agent-handoff events include a fixed bundled template id,
but later result, feedback, and qualified-value events do not retain template
provenance. That means the current data can evaluate Live Views overall and
the onboarding goal categories, but it cannot support a clean claim that one
specific template caused more accepted value. Add allowlisted, non-content
template provenance before running a per-template outcome experiment.

## Remaining product-outcome eval

Run candidate templates on the exact installed runtime with representative,
non-synthetic Pipe workloads. Have independent reviewers label evidence
correctness, decision usefulness, next-action clarity, and whether the user
accepted or acted on the result. In-product clicks and sends are diagnostic;
repeat qualified use and a user-confirmed useful outcome are the stronger
signals. Keep historical replay aggregate-only unless a user explicitly opts
into reviewed labels.
