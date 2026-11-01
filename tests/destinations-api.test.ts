import { describe, expect, it } from "vitest";
import { GET } from "../app/api/destinations/route";

describe("GET /api/destinations", () => {
  it("filters destinations by query and country", async () => {
    const response = await GET(new Request("http://localhost/api/destinations?q=mountain&country=Tanzania"));
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.destinations.map((item: { slug: string }) => item.slug)).toContain("kilimanjaro");
  });

  it("rejects unsupported category filters", async () => {
    const response = await GET(new Request("http://localhost/api/destinations?category=unknown"));
    expect(response.status).toBe(400);
  });
});
