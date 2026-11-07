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
  it("rejects line feeds in guest names", () => {
    expect(enquirySchema.safeParse({ ...validEnquiry, fullName: "Guest\nInjected" }).success).toBe(false);
  });
  it("rejects null bytes in destinations", () => {
    expect(enquirySchema.safeParse({ ...validEnquiry, destination: "Serengeti\u0000" }).success).toBe(false);
  });
  it("rejects line feeds in destinations", () => {
    expect(enquirySchema.safeParse({ ...validEnquiry, destination: "Kilimanjaro\nInjected" }).success).toBe(false);
  });
  it("rejects null bytes in guest messages", () => {
    expect(enquirySchema.safeParse({ ...validEnquiry, message: "Please book\u0000hidden" }).success).toBe(false);
  });
  it("allows ordinary multiline guest messages", () => {
    expect(enquirySchema.safeParse({ ...validEnquiry, message: "Hello\nWe are two travellers" }).success).toBe(true);
  });
  it("rejects tab control characters in itinerary titles", () => {
    expect(() => buildItinerary(1, [{ ...itineraryActivity, title: "Drive\tspoof" }])).toThrow(/Invalid activity details/);
  });
  it("rejects newline control characters in itinerary titles", () => {
    expect(() => buildItinerary(1, [{ ...itineraryActivity, title: "Drive\nspoof" }])).toThrow(/Invalid activity details/);
  });
  it("rejects null control characters in itinerary locations", () => {
    expect(() => buildItinerary(1, [{ ...itineraryActivity, location: "Park\u0000hidden" }])).toThrow(/Invalid activity details/);
  });
  it("rejects newline characters in itinerary locations", () => {
    expect(() => buildItinerary(1, [{ ...itineraryActivity, location: "Park\nother" }])).toThrow(/Invalid activity details/);
  });
  it("rejects empty itinerary locations", () => {
    expect(() => buildItinerary(1, [{ ...itineraryActivity, location: "  " }])).toThrow(/Invalid activity details/);
  });
  it("keeps adjacent itinerary activities valid", () => {
    expect(buildItinerary(1, [itineraryActivity, { ...itineraryActivity, title: "Lunch", startTime: "10:00", endTime: "11:00" }])[0].activities).toHaveLength(2);
  });
  it("searches destinations by country name", () => {
    expect(searchDestinations("Tanzania").some((destination) => destination.slug === "kilimanjaro")).toBe(true);
  });
  it("rejects control characters in analytics labels", () => {
    expect(() => aggregateEnquiryMetrics([{ destination: "Safari\nInjected", travellers: 2, status: "new" }])).toThrow(/Invalid enquiry record/);
  });
  it("denies viewer enquiry creation even with approval", () => {
    expect(authorizeAgentAction({ actorId: "viewer-1", actorRole: "viewer", requestId: "req-viewer", tool: "create_enquiry", approved: true }).allowed).toBe(false);
  });
  it("denies operator refunds without approval", () => {
    expect(authorizeAgentAction({ actorId: "operator-1", actorRole: "operator", requestId: "req-refund", tool: "issue_refund" }).allowed).toBe(false);
  });
  it("denies operator refunds even when approved", () => {
    expect(authorizeAgentAction({ actorId: "operator-1", actorRole: "operator", requestId: "req-refund", tool: "issue_refund", approved: true }).allowed).toBe(false);
  });
  it("denies admin refunds without approval", () => {
    expect(authorizeAgentAction({ actorId: "admin-1", actorRole: "admin", requestId: "req-refund", tool: "issue_refund" }).allowed).toBe(false);
  });
  it("allows approved admin refund action", () => {
    expect(authorizeAgentAction({ actorId: "admin-1", actorRole: "admin", requestId: "req-refund", tool: "issue_refund", approved: true }).auditEvent.decision).toBe("allowed");
  });
  it("denies an unknown agent tool", () => {
    expect(() => authorizeAgentAction({ actorId: "admin-1", actorRole: "admin", requestId: "req-invalid", tool: "unknown_tool" as never, approved: true })).toThrow(/Unknown agent role or tool/);
  });
  it("denies an unknown agent role", () => {
    expect(() => authorizeAgentAction({ actorId: "admin-1", actorRole: "root" as never, requestId: "req-invalid", tool: "issue_refund", approved: true })).toThrow(/Unknown agent role or tool/);
  });
});
