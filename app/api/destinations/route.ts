import { NextResponse } from "next/server";
import { searchDestinations, type Destination, type DestinationCategory } from "../../../lib/destinations";

const categories = new Set<DestinationCategory>(["wildlife", "mountain", "coastal", "culture"]);
const countries = new Set<Destination["country"]>(["Tanzania", "Kenya", "Uganda", "Rwanda"]);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = (searchParams.get("q") ?? "").trim();
  const category = searchParams.get("category");
  const country = searchParams.get("country");
  if (["q", "category", "country"].some((key) => searchParams.getAll(key).length > 1)) {
    return NextResponse.json({ error: "Duplicate destination filters" }, { status: 400 });
  }

  if (query.length > 120 || /[\u0000-\u001f\u007f\u202a-\u202e\u2066-\u2069]/.test(query) || (category && !categories.has(category as DestinationCategory)) || (country && !countries.has(country as Destination["country"]))) {
    return NextResponse.json({ error: "Invalid destination filters" }, { status: 400 });
  }

  const destinations = searchDestinations(query, category as DestinationCategory | undefined, country as Destination["country"] | undefined);
  return NextResponse.json({ count: destinations.length, destinations }, { headers: { "Cache-Control": "public, max-age=60" } });
}
