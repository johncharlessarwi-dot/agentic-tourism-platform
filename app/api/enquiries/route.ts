import { NextResponse } from "next/server";
import { enquirySchema, normalizeDestination } from "../../../lib/tourism";
import { scoreEnquiry } from "../../../lib/lead-scoring";
import { suggestFollowUp } from "../../../lib/follow-up";

export async function POST(request: Request) {
  let payload: unknown;
  try { payload = await request.json(); } catch { return NextResponse.json({ error: "Request body must be valid JSON" }, { status: 400 }); }
  const parsed = enquirySchema.safeParse(payload);
  if (!parsed.success) return NextResponse.json({ error: "Invalid enquiry", issues: parsed.error.issues }, { status: 422 });
  const lead = scoreEnquiry(parsed.data);
  return NextResponse.json({ status: "accepted", enquiry: { ...parsed.data, destination: normalizeDestination(parsed.data.destination) }, lead, followUp: suggestFollowUp(lead) }, { status: 202, headers: { "Cache-Control": "no-store" } });
}
