import { NextResponse } from "next/server";
import { getDestinationBySlug } from "../../../../lib/destinations";

export async function GET(_request: Request, context: { params: Promise<{ slug: string }> }) {
  const { slug } = await context.params;
  if (!/^[a-z0-9-]{1,80}$/.test(slug)) {
    return NextResponse.json({ error: "Invalid destination slug" }, { status: 400 });
  }
  const destination = getDestinationBySlug(slug);
  if (!destination) return NextResponse.json({ error: "Destination not found" }, { status: 404 });
  return NextResponse.json({ destination }, { headers: { "Cache-Control": "public, max-age=60" } });
}
