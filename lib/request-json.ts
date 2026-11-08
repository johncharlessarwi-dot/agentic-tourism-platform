export class RequestTooLargeError extends Error {
  constructor() { super("Request body exceeds the 16 KB limit"); }
}

export function isJsonContentType(request: Request): boolean {
  const contentType = request.headers.get("content-type") ?? "";
  if (contentType.length > 512) return false;
  return /^application\/json(?:\s*;\s*[a-z0-9!#$%&\x27*+.^_`|~-]+\s*=\s*(?:[a-z0-9!#$%&\x27*+.^_`|~-]+|"(?:[^"\\\\]|\\\\.)*")\s*)*$/i.test(contentType);
}

/** Read a bounded JSON body without buffering an arbitrarily large request. */
export async function readLimitedJson(request: Request, maxBytes = 16_384): Promise<unknown> {
  if (!Number.isSafeInteger(maxBytes) || maxBytes < 1 || maxBytes > 1_048_576) {
    throw new RangeError("Invalid JSON body limit");
  }
  const length = request.headers.get("content-length");
  if (length !== null) {
    if (!/^[0-9]+$/.test(length) || !Number.isSafeInteger(Number(length))) {
      throw new SyntaxError("Invalid Content-Length header");
    }
    if (Number(length) > maxBytes) throw new RequestTooLargeError();
  }
  if (!request.body) throw new SyntaxError("Missing JSON body");

  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
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
  } finally {
    reader.releaseLock();
  }

  if (length !== null && Number(length) !== size) throw new SyntaxError("Content-Length mismatch");
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length; }
  return JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes));
}
