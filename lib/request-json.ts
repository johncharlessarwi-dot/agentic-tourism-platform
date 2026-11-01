export class RequestTooLargeError extends Error {
  constructor() { super("Request body exceeds the 16 KB limit"); }
}

export function isJsonContentType(request: Request): boolean {
  return /^application\/json(?:\s*;|\s*$)/i.test(request.headers.get("content-type") ?? "");
}

/** Read a bounded JSON body without buffering an arbitrarily large request. */
export async function readLimitedJson(request: Request, maxBytes = 16_384): Promise<unknown> {
  const length = request.headers.get("content-length");
  if (length !== null && Number(length) > maxBytes) throw new RequestTooLargeError();
  if (!request.body) throw new SyntaxError("Missing JSON body");

  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > maxBytes) {
      await reader.cancel();
      throw new RequestTooLargeError();
    }
    chunks.push(value);
  }

  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length; }
  return JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes));
}
