import { describe, expect, it } from "vitest";
import { authorizeAgentAction } from "../lib/agent-policy";

const base = { actorId: "operator-1", actorRole: "operator" as const, requestId: "req-001" };

describe("agent action policy", () => {
  it("allows read-only tools for viewers", () => {
    const result = authorizeAgentAction({ ...base, actorRole: "viewer", tool: "search_destinations" });
    expect(result.allowed).toBe(true);
    expect(result.auditEvent.decision).toBe("allowed");
  });
  it("requires explicit approval for write actions", () => {
    const result = authorizeAgentAction({ ...base, tool: "create_enquiry" });
    expect(result.allowed).toBe(false);
    expect(result.reason).toMatch(/human approval/);
  });
  it("allows approved operator writes", () => {
    expect(authorizeAgentAction({ ...base, tool: "update_booking", approved: true }).allowed).toBe(true);
  });
  it("denies financial actions to operators even when approved", () => {
    const result = authorizeAgentAction({ ...base, tool: "issue_refund", approved: true });
    expect(result.allowed).toBe(false);
    expect(result.auditEvent.permission).toBe("financial");
  });
  it("allows an explicitly approved admin financial action", () => {
    expect(authorizeAgentAction({ ...base, actorRole: "admin", tool: "issue_refund", approved: true }).allowed).toBe(true);
  });
});
