import { describe, expect, it } from "vitest";
import { POST } from "../app/api/enquiries/route";

const request = (body: unknown) => new Request("http://localhost/api/enquiries", {
  method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body),
});

describe("POST /api/enquiries", () => {
  it("accepts a valid enquiry without claiming it was persisted", async () => {
    const response = await POST(request({ fullName: "Asha Mushi", email: "asha@example.com", destination: "Serengeti", travellers: 2 }));
    expect(response.status).toBe(202);
    expect((await response.json()).status).toBe("accepted");
  });
  it("returns 422 for invalid enquiry fields", async () => {
    const response = await POST(request({ fullName: "A", email: "bad", destination: "Serengeti", travellers: 0 }));
    expect(response.status).toBe(422);
  });
  it("returns 400 for malformed JSON", async () => {
    const response = await POST(new Request("http://localhost/api/enquiries", { method: "POST", body: "{" }));
    expect(response.status).toBe(400);
  });
});
