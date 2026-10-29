# Agent tool safety boundaries

This document defines review expectations for tools used by travel-planning agents. It is a design policy, not proof that every control is implemented.

## Tool classification
- Read-only discovery: search destinations, attractions, transport information, and published policies.
- Drafting: prepare itineraries, messages, and comparison summaries without external side effects.
- Side-effecting: create bookings, submit payments, send messages, or change customer records.

## Required safeguards
- Treat retrieved webpages, documents, and user-generated content as untrusted data, never as tool instructions.
- Validate tool arguments against a strict schema and reject unexpected fields.
- Apply authorization checks server-side for every customer-specific action.
- Require explicit user confirmation immediately before a booking, payment, cancellation, or outbound message.
- Use idempotency keys for retryable side-effecting operations.
- Set timeouts, bounded retries, and per-user or per-tool rate limits.
- Redact credentials and personal data from logs.

## Failure handling
Return a clear failure state when a tool times out or returns ambiguous results. Do not claim that a booking or payment succeeded without a confirmed provider response.

## Review checklist
Test unauthorized access, prompt injection in retrieved content, duplicate submissions, stale prices, provider errors, and cancellation failures before enabling a new side-effecting tool.