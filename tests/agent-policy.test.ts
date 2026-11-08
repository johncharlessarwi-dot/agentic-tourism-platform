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
  it("rejects newlines and control characters in audit identifiers", () => {
    expect(() => authorizeAgentAction({
      ...base, actorId: "operator-1\nspoofed", tool: "search_destinations"
    })).toThrow(/Invalid agent audit identifiers/);
    expect(() => authorizeAgentAction({
      ...base, requestId: "req-001\rspoofed", tool: "update_booking", approved: true
    })).toThrow(/Invalid agent audit identifiers/);
  });
  it("normalizes padded identifiers in successful audit records", () => {
    const result = authorizeAgentAction({ ...base, actorId: " operator-1 ", requestId: " req-001 ", tool: "search_destinations" });
    expect(result.allowed).toBe(true);
    expect(result.auditEvent.actorId).toBe("operator-1");
    expect(result.auditEvent.requestId).toBe("req-001");
  });
  it("denies even approved actions when audit identifiers are missing", () => {
    const result = authorizeAgentAction({ ...base, actorId: "  ", tool: "update_booking", approved: true });
    expect(result.allowed).toBe(false);
    expect(result.reason).toMatch(/audit trail/);
    expect(result.auditEvent.decision).toBe("denied");
  });
});

it('rejects bidirectional control marks in audit actor and request IDs',()=>{
 expect(()=>authorizeAgentAction({...base, actorId:'agent\u202eone',tool:'search_destinations'})).toThrow();
 expect(()=>authorizeAgentAction({...base, requestId:'req\u2067spoof',tool:'search_destinations'})).toThrow();
});

it('rejects invisible LRM and RLM in agent identity',()=>{
 expect(()=>authorizeAgentAction({...base,actorId:'agent\u200e2',tool:'search_destinations'})).toThrow();
 expect(()=>authorizeAgentAction({...base,requestId:'req\u200f2',tool:'search_destinations'})).toThrow();
});
