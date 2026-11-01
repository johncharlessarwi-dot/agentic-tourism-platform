import { describe, expect, it } from "vitest";
import { readLimitedJson, RequestTooLargeError } from "../lib/request-json";

describe("bounded JSON request reader", () => {
  it("decodes valid JSON", async () => {
    expect(await readLimitedJson(new Request("http://localhost", { method: "POST", body: '{"ok":true}' }))).toEqual({ ok: true });
  });
  it("rejects streaming payloads over the limit without trusting content length", async () => {
    const request = new Request("http://localhost", { method: "POST", body: "x".repeat(20_000) });
    await expect(readLimitedJson(request)).rejects.toBeInstanceOf(RequestTooLargeError);
  });
  it("rejects an announced oversized body before reading it", async () => {
    const request = new Request("http://localhost", { method: "POST", headers: { "content-length": "30000" }, body: "{}" });
    await expect(readLimitedJson(request)).rejects.toBeInstanceOf(RequestTooLargeError);
  });
});
