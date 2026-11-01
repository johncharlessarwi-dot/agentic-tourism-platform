import { NextResponse } from "next/server";
import { enquirySchema } from "../../../lib/tourism";
import { scoreEnquiry } from "../../../lib/lead-scoring";
import { suggestFollowUp } from "../../../lib/follow-up";
import { readLimitedJson, RequestTooLargeError } from "../../../lib/request-json";

export async function POST(request: Request) {
  let payload: unknown;
  try { payload = await readLimitedJson(request); } catch (error) { return NextResponse.json({ error: error instanceof RequestTooLargeError ? "Request body is too large" : "Request body must be valid JSON" }, { status: error instanceof RequestTooLargeError ? 413 : 400 }); }
  const parsed = enquirySchema.safeParse(payload);
  if (!parsed.success) return NextResponse.json({ error: "Invalid enquiry", issues: parsed.error.issues }, { status: 422 });
  const lead = scoreEnquiry(parsed.data);
  // No database or messaging transport is configured. Never imply that a lead was saved.
  // Avoid echoing names, email addresses, dates or the guest's private message.
  return NextResponse.json({ status: "validated", stored: false, lead, followUp: suggestFollowUp(lead) }, { status: 200, headers: { "Cache-Control": "no-store" } });
}
