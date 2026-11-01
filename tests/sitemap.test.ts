import { afterEach, describe, expect, it, vi } from "vitest";
import sitemap from "../app/sitemap";
import { destinations } from "../lib/destinations";

afterEach(() => vi.unstubAllEnvs());

describe("public sitemap", () => {
  it("includes landing and all destination guides for a configured origin", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://example.org");
    const entries = sitemap();
    expect(entries).toHaveLength(destinations.length + 2);
    expect(entries[0].url).toBe("https://example.org/");
    expect(entries.some((entry) => entry.url.endsWith("/destinations/kilimanjaro"))).toBe(true);
  });
  it("does not publish localhost or a bogus domain when the origin is missing", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "");
    expect(sitemap()).toEqual([]);
  });
});
