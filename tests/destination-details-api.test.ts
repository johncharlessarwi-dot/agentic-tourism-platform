import { describe, expect, it } from "vitest";
import { GET } from "../app/api/destinations/[slug]/route";

describe("GET /api/destinations/[slug]", () => {
  it("returns a destination detail", async () => {
    const response = await GET(new Request("http://localhost"), { params: Promise.resolve({ slug: "serengeti" }) });
    expect(response.status).toBe(200);
    expect((await response.json()).destination.country).toBe("Tanzania");
  });

  it("returns 404 for unknown destinations", async () => {
    const response = await GET(new Request("http://localhost"), { params: Promise.resolve({ slug: "not-found" }) });
    expect(response.status).toBe(404);
  });
});
