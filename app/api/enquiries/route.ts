import { NextResponse } from "next/server";
import { enquirySchema, normalizeDestination } from "../../../lib/tourism";

export async function POST(request: Request) {
  let payload: unknown;
  try { payload = await request.json(); } catch { return NextResponse.json({ error: "Request body must be valid JSON" }, { status: 400 }); }
  const parsed = enquirySchema.safeParse(payload);
  if (!parsed.success) return NextResponse.json({ error: "Invalid enquiry", issues: parsed.error.issues }, { status: 422 });
  return NextResponse.json({ status: "accepted", enquiry: { ...parsed.data, destination: normalizeDestination(parsed.data.destination) } }, { status: 202 });
}
