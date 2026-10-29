import { enquirySchema } from "../../../lib/tourism";

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return Response.json({ error: "Malformed JSON body" }, { status: 400 });
  }

  const result = enquirySchema.safeParse(payload);
  if (!result.success) {
    return Response.json({ error: "Invalid enquiry", issues: result.error.issues }, { status: 422 });
  }

  return Response.json({ status: "accepted" }, { status: 202 });
}
