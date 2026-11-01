import { NextResponse } from "next/server";
import { enquirySchema } from "../../../lib/tourism";
import { scoreEnquiry } from "../../../lib/lead-scoring";
import { suggestFollowUp } from "../../../lib/follow-up";

export async function POST(request: Request) {
  let payload: unknown;
  try { payload = await request.json(); } catch { return NextResponse.json({ error: "Request body must be valid JSON" }, { status: 400 }); }
  const parsed = enquirySchema.safeParse(payload);
  if (!parsed.success) return NextResponse.json({ error: "Invalid enquiry", issues: parsed.error.issues }, { status: 422 });
  const lead = scoreEnquiry(parsed.data);
  // No database or messaging transport is configured. Never imply that a lead was saved.
  // Avoid echoing names, email addresses, dates or the guest's private message.
  return NextResponse.json({ status: "validated", stored: false, lead, followUp: suggestFollowUp(lead) }, { status: 200, headers: { "Cache-Control": "no-store" } });
}
