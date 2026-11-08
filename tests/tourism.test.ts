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

  it("normalizes repeated spaces, tabs, and newlines in destinations", () => {
    expect(normalizeDestination("  Lake   Manyara  ")).toBe("Lake Manyara");
    expect(normalizeDestination("\tLake\nManyara  ")).toBe("Lake Manyara");
  });
});

it('rejects visual direction spoofing in guest enquiries',()=>{
 const input={fullName:'Asha\u202eMushi',email:'asha@example.com',destination:'Serengeti',travellers:2};
 expect(enquirySchema.safeParse(input).success).toBe(false);
 expect(enquirySchema.safeParse({...input,fullName:'Asha Mushi',message:'trip\u2066spoof'}).success).toBe(false);
});

it('rejects malformed destination normalization input',()=>{
 expect(()=>normalizeDestination(5 as never)).toThrow(RangeError);
 expect(()=>normalizeDestination('x'.repeat(161))).toThrow(RangeError);
});
