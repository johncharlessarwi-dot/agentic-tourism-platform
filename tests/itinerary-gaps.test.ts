import { describe, expect, it } from "vitest";
import { buildItinerary, summarizeItineraryGaps } from "../lib/itinerary";
describe("itinerary free-time planning", () => {
  it("counts breaks between activities on the same day", () => {
    const days = buildItinerary(2, [
      { day: 1, title: "Breakfast", startTime: "08:00", endTime: "09:00" },
      { day: 1, title: "Drive", startTime: "10:30", endTime: "11:30" },
      { day: 2, title: "Walk", startTime: "07:00", endTime: "08:00" }
    ]);
    expect(summarizeItineraryGaps(days)).toEqual({ freeMinutesBetweenActivities: 90, gaps: 1 });
  });
  it("does not count overnight periods or adjoining activities", () => {
    const days = buildItinerary(1, [
      { day: 1, title: "One", startTime: "08:00", endTime: "09:00" },
      { day: 1, title: "Two", startTime: "09:00", endTime: "10:00" }
    ]);
    expect(summarizeItineraryGaps(days).freeMinutesBetweenActivities).toBe(0);
  });
});
