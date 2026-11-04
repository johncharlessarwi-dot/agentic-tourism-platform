import { describe, expect, it } from "vitest";
import { buildItinerary } from "../lib/itinerary";
const trip = { day: 1, title: "Walk", startTime: "08:00", endTime: "09:00" };
describe("itinerary input bounds", () => {
  it("rejects oversized activity arrays", () => {
    expect(() => buildItinerary(1, Array.from({ length: 301 }, () => trip))).toThrow(/300/);
  });
  it("rejects oversized text and malformed objects", () => {
    expect(() => buildItinerary(1, [{ ...trip, title: "x".repeat(161) }])).toThrow(/details/);
    expect(() => buildItinerary(1, [{ ...trip, location: "x".repeat(161) }])).toThrow(/details/);
    expect(() => buildItinerary(1, [null as unknown as typeof trip])).toThrow(/details/);
  });
  it("preserves ordinary valid itineraries", () => {
    expect(buildItinerary(1, [trip])[0].activities[0].durationMinutes).toBe(60);
  });
});
