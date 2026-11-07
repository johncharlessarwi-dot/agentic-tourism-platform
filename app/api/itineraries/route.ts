import { NextResponse } from "next/server";
import { z } from "zod";
import { buildItinerary, summarizeItinerary, summarizeItineraryGaps } from "../../../lib/itinerary";
import { isJsonContentType, readLimitedJson, RequestTooLargeError } from "../../../lib/request-json";

const activitySchema = z.object({
  day: z.number().int().min(1).max(30),
  title: z.string().trim().min(1).max(160),
  startTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/),
  endTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/),
  location: z.string().trim().max(120).optional(),
}).strict();

const itinerarySchema = z.object({
  dayCount: z.number().int().min(1).max(30),
  activities: z.array(activitySchema).max(120),
}).strict();

export async function POST(request: Request) {
  if (!isJsonContentType(request)) return NextResponse.json({ error: "Content-Type must be application/json" }, { status: 415 });
  let payload: unknown;
  try { payload = await readLimitedJson(request); } catch (error) { return NextResponse.json({ error: error instanceof RequestTooLargeError ? "Request body is too large" : "Request body must be valid JSON" }, { status: error instanceof RequestTooLargeError ? 413 : 400 }); }
  const parsed = itinerarySchema.safeParse(payload);
  if (!parsed.success) return NextResponse.json({ error: "Invalid itinerary", issues: parsed.error.issues }, { status: 422 });
  try {
    const days = buildItinerary(parsed.data.dayCount, parsed.data.activities);
    return NextResponse.json({ days, summary: summarizeItinerary(days), gaps: summarizeItineraryGaps(days) }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Invalid itinerary" }, { status: 422 });
  }
}
