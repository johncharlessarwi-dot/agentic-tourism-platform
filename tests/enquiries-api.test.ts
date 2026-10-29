import { describe, expect, it } from "vitest";
import { POST } from "../app/api/enquiries/route";

const valid = { fullName: "Asha Mushi", email: "asha@example.com", destination: "Lake Manyara", travellers: 2 };

describe("POST /api/enquiries", () => {
  it("accepts a valid enquiry without claiming persistence", async () => {
    const response = await POST(new Request("http://localhost/api/enquiries", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(valid) }));
    expect(response.status).toBe(202);
    expect((await response.json()).status).toBe("accepted");
  });

  it("rejects invalid enquiry data", async () => {
    const response = await POST(new Request("http://localhost/api/enquiries", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ ...valid, travellers: 0 }) }));
    expect(response.status).toBe(422);
  });

  it("rejects malformed JSON", async () => {
    const response = await POST(new Request("http://localhost/api/enquiries", { method: "POST", body: "{" }));
    expect(response.status).toBe(400);
  });
});
