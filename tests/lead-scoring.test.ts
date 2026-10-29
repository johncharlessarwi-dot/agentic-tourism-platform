import { describe, expect, it } from "vitest";
import { scoreEnquiry } from "../lib/lead-scoring";
import type { TourismEnquiry } from "../lib/tourism";

const base: TourismEnquiry = { fullName: "Asha Mushi", email: "asha@example.com", destination: "Serengeti", travellers: 2 };

describe("enquiry lead scoring", () => {
  it("classifies a simple enquiry as cold", () => {
    expect(scoreEnquiry(base, new Date("2026-01-01T00:00:00Z")).temperature).toBe("cold");
  });
  it("prioritizes near-term group enquiries with detailed requirements", () => {
    const result = scoreEnquiry({ ...base, travelDate: "2026-01-20", travellers: 5, message: "We need a detailed family safari itinerary with accommodation and transfers." }, new Date("2026-01-01T00:00:00Z"));
    expect(result.temperature).toBe("hot");
    expect(result.score).toBe(75);
    expect(result.reasons).toHaveLength(4);
  });
  it("does not reward dates that have already passed", () => {
    expect(scoreEnquiry({ ...base, travelDate: "2025-12-01" }, new Date("2026-01-01T00:00:00Z")).score).toBe(30);
  });
  it("caps the score at 100", () => {
    const result = scoreEnquiry({ ...base, travelDate: "2026-01-10", travellers: 12, message: "x".repeat(200) }, new Date("2026-01-01T00:00:00Z"));
    expect(result.score).toBeLessThanOrEqual(100);
  });
});
