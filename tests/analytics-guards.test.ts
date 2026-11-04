import { describe, expect, it } from "vitest";
import { aggregateEnquiryMetrics } from "../lib/analytics";
describe("analytics input integrity", () => {
  it("rejects forged statuses and unsafe traveller counts", () => {
    expect(() => aggregateEnquiryMetrics([{ destination: "Moshi", status: "unknown" as "new", travellers: 2 }])).toThrow(/Invalid/);
    expect(() => aggregateEnquiryMetrics([{ destination: "Moshi", status: "new", travellers: NaN }])).toThrow(/Invalid/);
    expect(() => aggregateEnquiryMetrics([{ destination: "Moshi", status: "new", travellers: 101 }])).toThrow(/Invalid/);
  });
  it("preserves normal conversion metrics", () => {
    const metrics = aggregateEnquiryMetrics([{ destination: "Moshi", status: "booked", travellers: 3 }]);
    expect(metrics.conversionRate).toBe(100);
    expect(metrics.totalTravellers).toBe(3);
  });
});
