import { describe, expect, it } from "vitest";
import { suggestFollowUp } from "../lib/follow-up";

describe("manual follow-up suggestions", () => {
  it("prioritizes hot leads without triggering external action", () => {
    const result = suggestFollowUp({ score: 80, temperature: "hot", reasons: [] });
    expect(result.priority).toBe("high");
    expect(result.requiresHumanApproval).toBe(true);
  });
  it("provides a guidance prompt for cold leads", () => {
    expect(suggestFollowUp({ score: 30, temperature: "cold", reasons: [] }).suggestedAction).toMatch(/guidance/);
  });
});

it('rejects unsupported lead temperature instead of silently lowering priority',()=>{
 expect(()=>suggestFollowUp({temperature:'critical' as never,score:90,reasons:[]})).toThrow(RangeError);
});
