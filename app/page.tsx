const capabilities = [
  { number: "01", name: "Growth & SEO Agent", detail: "Find search opportunities and turn destination content into qualified demand.", status: "Foundation planned" },
  { number: "02", name: "Lead Intelligence Agent", detail: "Capture enquiries, qualify intent and prepare timely follow-ups.", status: "Foundation planned" },
  { number: "03", name: "Booking Operations Agent", detail: "Coordinate availability, booking requests and guest communication.", status: "Foundation planned" },
  { number: "04", name: "MCP Integration Layer", detail: "Connect approved business tools through auditable, permission-aware actions.", status: "Foundation planned" },
];

export default function Home() {
  return <main className="shell">
    <nav className="nav"><a className="brand" href="#"><span className="brand-mark">S</span> SAFARI<span className="brand-light">OS</span></a><span className="nav-note">EAST AFRICA · TOURISM INTELLIGENCE</span><a className="nav-link" href="https://github.com/johncharlessarwi-dot/agentic-tourism-platform">View source ↗</a></nav>
    <section className="hero"><div className="eyebrow"><span className="pulse" /> PLATFORM FOUNDATION · V0.1</div><h1>More meaningful journeys.<br/><em>Smarter tourism operations.</em></h1><p className="intro">An agentic workspace for East African tour operators — bringing guest enquiries, marketing workflows and booking operations into one connected system.</p><div className="hero-actions"><a className="primary" href="#capabilities">Explore the platform <span>↓</span></a><span className="quiet">Built for operators, lodges & destination teams</span></div><div className="hero-stats"><div><strong>04</strong><span>Agent domains</span></div><div><strong>01</strong><span>Connected workspace</span></div><div><strong>EA</strong><span>Regional focus</span></div></div></section>
    <section className="section" id="capabilities"><div className="section-head"><div><div className="eyebrow">THE OPERATING SYSTEM</div><h2>One platform. Specialized agents.</h2></div><p>Each capability is designed around a practical business outcome, with human approval for consequential actions.</p></div><div className="cards">{capabilities.map((item) => <article className="cap-card" key={item.number}><div className="card-top"><span>{item.number}</span><span className="status">{item.status}</span></div><h3>{item.name}</h3><p>{item.detail}</p><div className="card-line" /></article>)}</div></section>
    <section className="principle"><div className="eyebrow">OUR DESIGN PRINCIPLE</div><p>AI should reduce repetitive work — <em>not remove human judgment.</em></p><span>Permission-aware tools · Clear audit trails · Measurable outcomes</span></section>
    <footer><span>SAFARIOS / AGENTIC TOURISM PLATFORM</span><span>Created by JOHN ONLINE SERVICES AND APPLICATIONS</span></footer>
  </main>;
}
