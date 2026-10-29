import { describe, expect, it } from "vitest";
import { POST } from "../app/api/enquiries/route";
const request = (body: unknown) => new Request("http://localhost/api/enquiries", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
describe("POST /api/enquiries", () => {
 it("accepts a valid enquiry", async () => { const r = await POST(request({ fullName: "Asha Mushi", email: "asha@example.com", destination: "Serengeti", travellers: 2 })); expect(r.status).toBe(202); expect((await r.json()).status).toBe("accepted"); });
 it("rejects invalid fields", async () => { const r = await POST(request({ fullName: "A", email: "bad", destination: "Serengeti", travellers: 0 })); expect(r.status).toBe(422); });
 it("rejects malformed JSON", async () => { const r = await POST(new Request("http://localhost/api/enquiries", { method: "POST", body: "{" })); expect(r.status).toBe(400); });
});
