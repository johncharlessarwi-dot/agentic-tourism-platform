import { afterEach, describe, expect, it, vi } from "vitest";
import robots from "../app/robots";
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

it.each(["invalid", "file:///tmp/site", "https://example-user@example.org/"])(
  "omits an invalid public origin from both metadata routes",
  (value) => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", value);
    expect(robots().sitemap).toBeUndefined();
    expect(sitemap()).toEqual([]);
  },
);

it("publishes the same origin when the configured URL has a path and query", () => {
  vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://example.org/setup?lang=sw");
  expect(robots().sitemap).toBe("https://example.org/sitemap.xml");
  expect(sitemap()[0].url).toBe("https://example.org/");
});
