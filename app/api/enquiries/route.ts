import { NextResponse } from "next/server";
import { enquirySchema } from "../../../lib/tourism";
import { scoreEnquiry } from "../../../lib/lead-scoring";
import { suggestFollowUp } from "../../../lib/follow-up";
import { isJsonContentType, readLimitedJson, RequestTooLargeError } from "../../../lib/request-json";

const headers = { "Cache-Control": "no-store" };

export async function POST(request: Request) {
  if (!isJsonContentType(request)) return NextResponse.json({ error: "Content-Type must be application/json" }, { status: 415, headers });
  let payload: unknown;
  try {
    payload = await readLimitedJson(request);
  } catch (error) {
    if (error instanceof RequestTooLargeError) return NextResponse.json({ error: "Request body is too large" }, { status: 413, headers });
    return NextResponse.json({ error: "Request body must be valid JSON" }, { status: 400, headers });
  }
  try {
    const parsed = enquirySchema.safeParse(payload);
    if (!parsed.success) return NextResponse.json({ error: "Invalid enquiry" }, { status: 422, headers });
    const lead = scoreEnquiry(parsed.data);
    // No database or messaging transport is configured. Never imply that a lead was saved.
    // Avoid echoing names, email addresses, dates or the guest's private message.
    return NextResponse.json({ status: "validated", stored: false, lead, followUp: suggestFollowUp(lead) }, { status: 200, headers });
  } catch {
    console.error("enquiry_processing_failed");
    return NextResponse.json({ error: "Could not process enquiry" }, { status: 500, headers });
  }
}
