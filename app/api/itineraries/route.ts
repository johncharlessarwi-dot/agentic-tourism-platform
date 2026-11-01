import { NextResponse } from "next/server";
import { z } from "zod";
import { buildItinerary } from "../../../lib/itinerary";

const activitySchema = z.object({
  day: z.number().int().min(1).max(30),
  title: z.string().trim().min(1).max(120),
  startTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/),
  endTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/),
  location: z.string().trim().max(120).optional(),
}).strict();

const itinerarySchema = z.object({
  dayCount: z.number().int().min(1).max(30),
  activities: z.array(activitySchema).max(120),
}).strict();

export async function POST(request: Request) {
  let payload: unknown;
  try { payload = await request.json(); } catch { return NextResponse.json({ error: "Request body must be valid JSON" }, { status: 400 }); }
  const parsed = itinerarySchema.safeParse(payload);
  if (!parsed.success) return NextResponse.json({ error: "Invalid itinerary", issues: parsed.error.issues }, { status: 422 });
  try {
    const days = buildItinerary(parsed.data.dayCount, parsed.data.activities);
    return NextResponse.json({ days }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Invalid itinerary" }, { status: 422 });
  }
}
