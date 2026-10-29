import { describe, expect, it } from "vitest";
import { getDestinationBySlug, searchDestinations } from "../lib/destinations";

describe("destination catalog", () => {
  it("returns East African destinations", () => {
    expect(searchDestinations().length).toBeGreaterThanOrEqual(5);
  });
  it("filters by category and country", () => {
    const results = searchDestinations("", "wildlife", "Tanzania");
    expect(results.length).toBeGreaterThan(0);
    expect(results.every((item) => item.category === "wildlife" && item.country === "Tanzania")).toBe(true);
  });
  it("searches highlights without case sensitivity", () => {
    expect(searchDestinations("stone town")[0]?.slug).toBe("zanzibar");
  });
  it("returns undefined for an unknown slug", () => {
    expect(getDestinationBySlug("unknown-place")).toBeUndefined();
  });
});
