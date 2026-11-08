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
  it("normalizes extra whitespace in destination searches", () => {
    expect(searchDestinations("  Stone   Town  ")[0]?.slug).toBe("zanzibar");
    expect(searchDestinations("Stone\tTown")[0]?.slug).toBe("zanzibar");
  });
  it("supports searching by destination slug", () => {
    expect(searchDestinations("masai-mara")[0]?.name).toBe("Maasai Mara");
    expect(searchDestinations("ngorongoro")[0]?.slug).toBe("ngorongoro");
  });
  it("matches spaced versions of hyphenated destination slugs", () => {
    expect(searchDestinations("Masai Mara")[0]?.slug).toBe("masai-mara");
  });
  it("resolves slugs regardless of case or surrounding spaces", () => {
    expect(getDestinationBySlug("  ZANZIBAR  ")?.slug).toBe("zanzibar");
    expect(getDestinationBySlug("Masai-Mara")?.name).toBe("Maasai Mara");
  });
  it("returns undefined for an unknown slug", () => {
    expect(getDestinationBySlug("unknown-place")).toBeUndefined();
  });
});

it('rejects malformed direct search API calls',()=>{
 expect(()=>searchDestinations(42 as never)).toThrow(RangeError);
 expect(()=>searchDestinations('a'.repeat(121))).toThrow(RangeError);
});
