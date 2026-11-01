import type { Metadata } from "next";
import Link from "next/link";
import { searchDestinations, type Destination, type DestinationCategory } from "../../lib/destinations";

export const metadata: Metadata = {
  title: "Explore East African Destinations",
  description: "Discover mountain, wildlife and coastal journeys across Tanzania, Kenya, Uganda and Rwanda.",
};

type Filters = { q?: string; category?: string; country?: string };
const categories: DestinationCategory[] = ["wildlife", "mountain", "coastal", "culture"];
const countries: Destination["country"][] = ["Tanzania", "Kenya", "Uganda", "Rwanda"];

export default async function DestinationsPage({ searchParams }: { searchParams: Promise<Filters> }) {
  const filters = await searchParams;
  const category = categories.find((value) => value === filters.category);
  const country = countries.find((value) => value === filters.country);
  const matches = searchDestinations((filters.q ?? "").slice(0, 120), category, country);

  return <main className="shell">
    <nav className="nav"><Link className="brand" href="/">SAFARI<span className="brand-light">OS</span></Link><Link className="nav-link" href="/#enquire">Talk to our team ↗</Link></nav>
    <section className="section"><div className="eyebrow">EXPLORE EAST AFRICA</div><h1>Find your next <em>journey.</em></h1>
      <p className="intro">Browse a curated starter selection. Availability, prices and travel requirements must be confirmed with a licensed operator.</p>
      <form className="destination-filters" method="get">
        <label>Search destinations<input name="q" maxLength={120} defaultValue={filters.q ?? ""} placeholder="Safari, beach, mountain..." /></label>
        <label>Experience<select name="category" defaultValue={category ?? ""}><option value="">Any experience</option>{categories.map((item) => <option value={item} key={item}>{item}</option>)}</select></label>
        <label>Country<select name="country" defaultValue={country ?? ""}><option value="">Any country</option>{countries.map((item) => <option value={item} key={item}>{item}</option>)}</select></label>
        <button className="primary" type="submit">Find journeys</button>
      </form>
      <p className="results-count">{matches.length} destination{matches.length === 1 ? "" : "s"} found</p>
      <div className="destination-grid">{matches.map((place) => <article className="cap-card" key={place.slug}>
        <div className="card-top"><span>{place.country}</span><span className="status">{place.category}</span></div>
        <h2>{place.name}</h2><p>{place.summary}</p><p className="highlights">{place.highlights.join(" · ")}</p>
        <Link className="nav-link" href="/#enquire">Enquire about this place ↗</Link>
      </article>)}</div>
      {matches.length === 0 && <p className="intro">No matches yet. Try another destination or country.</p>}
    </section>
  </main>;
}
