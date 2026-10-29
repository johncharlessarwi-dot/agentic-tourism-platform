import { describe, expect, it } from "vitest";
import { aggregateEnquiryMetrics } from "../lib/analytics";

const sample = [
  { destination: "Serengeti", travellers: 2, status: "booked" as const },
  { destination: " Serengeti ", travellers: 4, status: "quoted" as const },
  { destination: "Zanzibar", travellers: 3, status: "new" as const },
  { destination: "Kilimanjaro", travellers: 1, status: "lost" as const }
];

describe("enquiry analytics", () => {
  it("aggregates totals, status counts, and booking conversion", () => {
    const result = aggregateEnquiryMetrics(sample);
    expect(result.totalEnquiries).toBe(4);
    expect(result.bookedEnquiries).toBe(1);
    expect(result.conversionRate).toBe(25);
    expect(result.totalTravellers).toBe(10);
    expect(result.statusCounts.quoted).toBe(1);
  });
  it("normalizes destination names and ranks the most requested", () => {
    expect(aggregateEnquiryMetrics(sample).topDestinations[0]).toEqual({ destination: "Serengeti", enquiries: 2 });
  });
  it("returns zero-safe metrics for an empty dataset", () => {
    const result = aggregateEnquiryMetrics([]);
    expect(result.conversionRate).toBe(0);
    expect(result.totalTravellers).toBe(0);
    expect(result.topDestinations).toEqual([]);
  });
});
