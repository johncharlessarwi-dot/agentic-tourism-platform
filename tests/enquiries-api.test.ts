import { describe, expect, it, vi } from "vitest";
import { POST } from "../app/api/enquiries/route";
import * as leadScoring from "../lib/lead-scoring";

const valid = { fullName: "Asha Mushi", email: "asha@example.com", destination: "Lake Manyara", travellers: 2 };

describe("POST /api/enquiries", () => {
  it("validates without claiming persistence or echoing guest personal data", async () => {
    const response = await POST(new Request("http://localhost/api/enquiries", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(valid) }));
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.status).toBe("validated");
    expect(body.stored).toBe(false);
    expect(JSON.stringify(body)).not.toContain("asha@example.com");
  });

  it("returns an explainable lead score for triage", async () => {
    const response = await POST(new Request("http://localhost/api/enquiries", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ ...valid, travellers: 4 }) }));
    const body = await response.json();
    expect(body.lead.score).toBeGreaterThan(30);
    expect(body.lead.reasons).toContain("Group has at least four travellers");
    expect(response.headers.get("cache-control")).toBe("no-store");
  });

  it("rejects invalid enquiry data", async () => {
    const response = await POST(new Request("http://localhost/api/enquiries", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ ...valid, travellers: 0 }) }));
    expect(response.status).toBe(422);
  });

  it("rejects malformed JSON", async () => {
    const response = await POST(new Request("http://localhost/api/enquiries", { method: "POST", headers: { "content-type": "application/json" }, body: "{" }));
    expect(response.status).toBe(400);
  });

  it("rejects cross-origin form style content types", async () => {
    const response = await POST(new Request("http://localhost/api/enquiries", { method: "POST", headers: { "content-type": "text/plain" }, body: "{}" }));
    expect(response.status).toBe(415);
  });

  it("reports unexpected failures without exposing error details", async () => {
    const log = vi.spyOn(console, "error").mockImplementation(() => {});
    const score = vi.spyOn(leadScoring, "scoreEnquiry").mockImplementationOnce(() => {
      throw new Error("Example internal diagnostic");
    });
    try {
      const response = await POST(new Request("http://localhost/api/enquiries", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(valid) }));
      expect(response.status).toBe(500);
      expect(response.headers.get("cache-control")).toBe("no-store");
      expect(await response.json()).toEqual({ error: "Could not process enquiry" });
      expect(log.mock.calls).toEqual([["enquiry_processing_failed"]]);
    } finally {
      score.mockRestore();
      log.mockRestore();
    }
  });

  it.each([
    ["application/json", "{", 400],
    ["application/json", "x".repeat(16_385), 413],
    ["text/plain", "{}", 415],
    ["application/json", "{}", 422],
  ])("marks %s errors as non-cacheable (%#)", async (contentType, body, status) => {
    const response = await POST(new Request("http://localhost/api/enquiries", { method: "POST", headers: { "content-type": contentType }, body }));
    expect(response.status).toBe(status);
    expect(response.headers.get("cache-control")).toBe("no-store");
  });
});

it('does not reflect potentially private invalid enquiry fields',async()=>{
 const response=await POST(new Request('http://localhost/api/enquiries',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({fullName:'SECRET_GUEST_NAME',email:'invalid',destination:'Serengeti',travellers:2})}));
 expect(response.status).toBe(422);
 expect(JSON.stringify(await response.json())).not.toContain('SECRET_GUEST_NAME');
});
