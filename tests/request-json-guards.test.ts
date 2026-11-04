import { describe, expect, it } from "vitest";
import { readLimitedJson, RequestTooLargeError } from "../lib/request-json";
const make = (headers: Record<string, string> = {}) => new Request("http://localhost", { method: "POST", headers, body: "{}" });
describe("JSON header and limit guards", () => {
  it("rejects malformed or oversized declared lengths", async () => {
    await expect(readLimitedJson(make({ "content-length": "not-a-number" }))).rejects.toThrow(/Content-Length/);
    await expect(readLimitedJson(make({ "content-length": "50000" }))).rejects.toBeInstanceOf(RequestTooLargeError);
  });
  it("rejects invalid configurable limits", async () => {
    await expect(readLimitedJson(make(), 0)).rejects.toThrow(/limit/);
    await expect(readLimitedJson(make(), Number.POSITIVE_INFINITY)).rejects.toThrow(/limit/);
  });
  it("preserves valid bounded JSON", async () => {
    await expect(readLimitedJson(make())).resolves.toEqual({});
  });
});
