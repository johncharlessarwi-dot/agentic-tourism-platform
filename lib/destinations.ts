export type DestinationCategory = "wildlife" | "mountain" | "coastal" | "culture";

export type Destination = {
  slug: string;
  name: string;
  country: "Tanzania" | "Kenya" | "Uganda" | "Rwanda";
  category: DestinationCategory;
  summary: string;
  highlights: string[];
};

export const destinations: Destination[] = [
  { slug: "serengeti", name: "Serengeti National Park", country: "Tanzania", category: "wildlife", summary: "Open plains known for seasonal wildlife movement and big-cat viewing.", highlights: ["Great Migration", "Big cats", "Game drives"] },
  { slug: "ngorongoro", name: "Ngorongoro Conservation Area", country: "Tanzania", category: "wildlife", summary: "A highland conservation landscape with a wildlife-rich crater.", highlights: ["Ngorongoro Crater", "Maasai heritage", "Highland scenery"] },
  { slug: "kilimanjaro", name: "Mount Kilimanjaro", country: "Tanzania", category: "mountain", summary: "Africa’s highest mountain with several established trekking routes.", highlights: ["Summit trekking", "Mountain ecosystems", "Moshi gateway"] },
  { slug: "zanzibar", name: "Zanzibar", country: "Tanzania", category: "coastal", summary: "Indian Ocean islands with beaches and Swahili coastal heritage.", highlights: ["Stone Town", "Beaches", "Spice tours"] },
  { slug: "masai-mara", name: "Maasai Mara", country: "Kenya", category: "wildlife", summary: "Savannah reserve famed for wildlife and seasonal migration.", highlights: ["Big Five", "Migration season", "Hot-air balloons"] },
  { slug: "bwindi", name: "Bwindi Impenetrable Forest", country: "Uganda", category: "wildlife", summary: "Montane rainforest known for carefully managed gorilla trekking.", highlights: ["Gorilla trekking", "Forest walks", "Birding"] },
  { slug: "volcanoes", name: "Volcanoes National Park", country: "Rwanda", category: "mountain", summary: "Volcanic highlands and guided primate experiences.", highlights: ["Gorilla trekking", "Volcano hikes", "Golden monkeys"] }
];

export function searchDestinations(query = "", category?: DestinationCategory, country?: Destination["country"]): Destination[] {
  const term = query.trim().toLocaleLowerCase();
  return destinations.filter((destination) => {
    const matchesText = !term || [destination.name, destination.summary, ...destination.highlights].some((value) => value.toLocaleLowerCase().includes(term));
    return matchesText && (!category || destination.category === category) && (!country || destination.country === country);
  });
}

export function getDestinationBySlug(slug: string): Destination | undefined {
  return destinations.find((destination) => destination.slug === slug);
}
