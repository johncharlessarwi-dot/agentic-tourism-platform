import { describe, expect, it } from "vitest";
import { enquirySchema, normalizeDestination } from "../lib/tourism";

describe("tourism domain", () => {
  it("accepts a valid guest enquiry", () => {
    const result = enquirySchema.safeParse({ fullName: "Asha Mushi", email: "asha@example.com", destination: "Serengeti", travellers: 2 });
    expect(result.success).toBe(true);
  });

  it("rejects an invalid email and zero travellers", () => {
    const result = enquirySchema.safeParse({ fullName: "Asha Mushi", email: "not-an-email", destination: "Serengeti", travellers: 0 });
    expect(result.success).toBe(false);
  });

  it("normalizes destination whitespace", () => {
    expect(normalizeDestination("  Lake   Manyara  ")).toBe("Lake Manyara");
  });
});
