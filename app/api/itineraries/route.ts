import { NextResponse } from "next/server";
import { z } from "zod";
import { buildItinerary, ItineraryValidationError, summarizeItinerary, summarizeItineraryGaps } from "../../../lib/itinerary";
import { isJsonContentType, readLimitedJson, RequestTooLargeError } from "../../../lib/request-json";

const activitySchema = z.object({
  day: z.number().int().min(1).max(30),
  title: z.string().trim().min(1).max(160),
  startTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/),
  endTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/),
  location: z.string().trim().min(1).max(160).optional(),
}).strict();

const itinerarySchema = z.object({
  dayCount: z.number().int().min(1).max(30),
  activities: z.array(activitySchema).max(120),
}).strict();

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
    const parsed = itinerarySchema.safeParse(payload);
    if (!parsed.success) return NextResponse.json({ error: "Invalid itinerary" }, { status: 422, headers });
    const days = buildItinerary(parsed.data.dayCount, parsed.data.activities);
    return NextResponse.json({ days, summary: summarizeItinerary(days), gaps: summarizeItineraryGaps(days) }, { headers });
  } catch (error) {
    if (error instanceof ItineraryValidationError) return NextResponse.json({ error: "Invalid itinerary" }, { status: 422, headers });
    console.error("itinerary_processing_failed");
    return NextResponse.json({ error: "Could not process itinerary" }, { status: 500, headers });
  }
}
