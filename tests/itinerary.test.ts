import { describe, expect, it } from "vitest";
import { buildItinerary } from "../lib/itinerary";

describe("itinerary planner", () => {
  it("creates all requested days and sorts activities by start time", () => {
    const result = buildItinerary(2, [
      { day: 1, title: "Afternoon walk", startTime: "14:00", endTime: "15:00" },
      { day: 1, title: "Breakfast", startTime: "08:00", endTime: "09:00" }
    ]);
    expect(result).toHaveLength(2);
    expect(result[0].activities[0].title).toBe("Breakfast");
    expect(result[0].activities[1].durationMinutes).toBe(60);
  });
  it("rejects activities outside the trip", () => {
    expect(() => buildItinerary(2, [{ day: 3, title: "Hike", startTime: "08:00", endTime: "10:00" }])).toThrow(/day must be/);
  });
  it("rejects invalid or reversed times", () => {
    expect(() => buildItinerary(1, [{ day: 1, title: "Tour", startTime: "10:00", endTime: "09:00" }])).toThrow(/times must be valid/);
  });
  it("rejects overlapping activities", () => {
    expect(() => buildItinerary(1, [
      { day: 1, title: "Museum", startTime: "09:00", endTime: "11:00" },
      { day: 1, title: "Transfer", startTime: "10:30", endTime: "12:00" }
    ])).toThrow(/overlap/);
  });
  it("limits trip length", () => {
    expect(() => buildItinerary(31, [])).toThrow(/between 1 and 30/);
  });
});
