import { describe, expect, it } from "vitest";
import { authorizeAgentAction } from "../lib/agent-policy";
describe("runtime agent authorization guards", () => {
  const base = { actorId: "agent-1", actorRole: "viewer" as const, tool: "search_destinations" as const, requestId: "req-1" };
  it("rejects forged roles and tools", () => {
    expect(() => authorizeAgentAction({ ...base, actorRole: "owner" as "viewer" })).toThrow(/denied/);
    expect(() => authorizeAgentAction({ ...base, tool: "delete_all" as "search_destinations" })).toThrow(/denied/);
  });
  it("bounds audit identifiers and denies malformed runtime input", () => {
    expect(() => authorizeAgentAction({ ...base, actorId: "x".repeat(129) })).toThrow(/denied/);
    expect(() => authorizeAgentAction({ ...base, requestId: null as unknown as string })).toThrow(/denied/);
  });
});
