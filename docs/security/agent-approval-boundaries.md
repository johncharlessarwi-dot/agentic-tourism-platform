# Agent approval boundaries

SafariOS agents may prepare recommendations and draft operational changes, but actions with external, financial, privacy, or booking consequences require explicit human approval.

## Current implementation

The public prototype endpoints only validate or calculate data; they do not invoke agent tools. `lib/agent-policy.ts` is a policy helper, not an authentication or approval-verification mechanism. When wiring a tool executor, derive actor, role, and tenant from a verified server-side session and the target resource. Derive approval from a server-side record bound to the actor, tenant, tool, resource, and action parameters; never trust those fields or an `approved` flag supplied by the client or model. Reject expired or replayed approval and recheck the resource scope before execution.

## Approval-required actions

- Confirming or changing a booking or availability commitment.
- Sending messages to guests or suppliers.
- Issuing refunds, collecting payments, or changing prices.
- Exporting guest records or sharing personal data.
- Publishing destination content or changing public SEO metadata.

## Review record

For every approval-gated action, capture the requesting actor, proposed action, relevant resource, decision, approver, timestamp, and outcome. Do not store access tokens or unnecessary guest data in the record.

## Safe defaults

- Deny by default when the actor, tenant, or resource scope is unclear.
- Make approval specific to the proposed action and resource.
- Re-check permissions at execution time; approval is not a permanent capability grant.
- Make retries idempotent where an external action could be duplicated.
- Provide a clear cancellation path before execution.
