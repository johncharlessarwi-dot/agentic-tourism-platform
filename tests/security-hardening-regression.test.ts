import { describe, expect, it } from "vitest";
import { enquirySchema } from "../lib/tourism";
import { authorizeAgentAction } from "../lib/agent-policy";
import { buildItinerary } from "../lib/itinerary";
import { aggregateEnquiryMetrics } from "../lib/analytics";
import { searchDestinations } from "../lib/destinations";
import { GET as getDestinations } from "../app/api/destinations/route";
import { POST as postEnquiry } from "../app/api/enquiries/route";
import { POST as postItinerary } from "../app/api/itineraries/route";

const validEnquiry = {
  fullName: "John Safari",
  email: "john@example.com",
  destination: "Serengeti",
  travellers: 2
};

const itineraryActivity = { day: 1, title: "Game drive", startTime: "08:00", endTime: "10:00" };

function postJson(url: string, payload: unknown): Request {
  return new Request(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload)
  });
}

describe("security hardening regression", () => {
  it("rejects extra guest fields", () => {
    expect(enquirySchema.safeParse({ ...validEnquiry, isAdmin: true }).success).toBe(false);
  });
  it("normalizes uppercase guest emails", () => {
    expect(enquirySchema.parse({ ...validEnquiry, email: "JOHN@EXAMPLE.COM" }).email).toBe("john@example.com");
  });
  it("trims padded guest email", () => {
    expect(enquirySchema.parse({ ...validEnquiry, email: " john@example.com " }).email).toBe("john@example.com");
  });
  it("rejects oversized guest email", () => {
    expect(enquirySchema.safeParse({ ...validEnquiry, email: "a".repeat(250) + "@example.com" }).success).toBe(false);
  });
  it("rejects carriage returns in guest names", () => {
    expect(enquirySchema.safeParse({ ...validEnquiry, fullName: "Guest\rInjected" }).success).toBe(false);
  });
});
