import { enquirySchema } from "@/lib/tourism";

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return Response.json({ error: "Request body must be valid JSON" }, { status: 400 });
  }

  const parsed = enquirySchema.safeParse(payload);
  if (!parsed.success) {
    return Response.json({ error: "Invalid enquiry", issues: parsed.error.flatten() }, { status: 422 });
  }

  // Persistence is intentionally delegated to the CRM repository layer added separately.
  return Response.json({ status: "accepted", enquiry: parsed.data }, { status: 202 });
}
