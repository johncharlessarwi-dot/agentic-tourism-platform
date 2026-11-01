import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { destinations, getDestinationBySlug } from "../../../lib/destinations";

export function generateStaticParams() {
  return destinations.map((destination) => ({ slug: destination.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const destination = getDestinationBySlug(slug);
  return destination
    ? { title: `${destination.name} Travel Guide`, description: destination.summary }
    : { title: "Destination not found", robots: { index: false, follow: false } };
}

export default async function DestinationPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const destination = getDestinationBySlug(slug);
  if (!destination) notFound();

  return <main className="shell">
    <nav className="nav"><Link className="brand" href="/">SAFARI<span className="brand-light">OS</span></Link><Link className="nav-link" href="/destinations">All destinations ↗</Link></nav>
    <section className="hero"><div className="eyebrow">{destination.country.toUpperCase()} · {destination.category.toUpperCase()}</div>
      <h1>{destination.name}</h1><p className="intro">{destination.summary}</p>
      <h2>Experience highlights</h2>
      <ul className="destination-highlights">{destination.highlights.map((highlight) => <li key={highlight}>{highlight}</li>)}</ul>
      <p className="intro">This is a destination overview, not a confirmed tour package. Ask our team for current availability, prices, permits and safety requirements.</p>
      <div className="hero-actions"><Link href="/#enquire" className="primary">Enquire about a trip ↗</Link><Link href="/destinations" className="nav-link">Browse more journeys</Link></div>
    </section>
  </main>;
}
