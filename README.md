# SafariOS — East African Tourism Intelligence

[![CI](https://github.com/johncharlessarwi-dot/agentic-tourism-platform/actions/workflows/ci.yml/badge.svg)](https://github.com/johncharlessarwi-dot/agentic-tourism-platform/actions/workflows/ci.yml)

**Discover destinations · Plan itineraries · Qualify guest enquiries · Keep people in control**

SafariOS is an early-stage Next.js workspace for tour operators, lodges, destination teams and travellers exploring Tanzania and East Africa. Built by **JOHN ONLINE SERVICES AND APPLICATIONS** in Moshi, Tanzania.

> **Prototype status:** destination discovery and trip-planning demos work. The enquiry API *validates and scores* data but does **not** save leads, dispatch messages, confirm availability, accept payments or book tours. The public enquiry form prepares a WhatsApp draft that the visitor must review and send themselves.

## What's working

| Capability | Where | Status |
| --- | --- | --- |
| Destination explorer with country/experience filters | `/destinations` | Working |
| Individual destination guides and SEO metadata | `/destinations/[slug]` | Working |
| WhatsApp enquiry handoff | Home page `#enquire` | Working, visitor-controlled |
| Destination search and detail APIs | `/api/destinations` | Working |
| Itinerary validation, overlap checks and summary | `/api/itineraries` | Working, no persistence |
| Enquiry validation, lead score and human follow-up recommendation | `/api/enquiries` | Working, no persistence |
| Agent permission/approval policy | `lib/agent-policy.ts` | Library with tests; no external tool execution |
| CRM, live booking, pricing, payments, MCP connectors | Roadmap | Not yet integrated |

## Start locally

Requirements: **Node.js 22+** and npm.

```bash
git clone https://github.com/johncharlessarwi-dot/agentic-tourism-platform.git
cd agentic-tourism-platform
npm ci
npm run dev
```

Visit `http://localhost:3000`. No credentials are needed for the current demo.

For a deployed website, set `NEXT_PUBLIC_SITE_URL` to the verified public origin (without a path). This enables absolute canonical metadata and `/sitemap.xml`; without a configured origin, the sitemap intentionally contains no URLs.

## Check quality

```bash
npm run typecheck
npm run lint
npm test
npm run build
```

CI runs the same checks on pushes to `main` and pull requests, using a committed lockfile.

## API examples

```bash
curl 'http://localhost:3000/api/destinations?q=kilimanjaro&country=Tanzania'
curl 'http://localhost:3000/api/destinations/serengeti'
curl -X POST 'http://localhost:3000/api/itineraries' \
  -H 'Content-Type: application/json' \
  -d '{"dayCount":1,"activities":[{"day":1,"title":"Morning game drive","startTime":"08:00","endTime":"11:00"}]}'
```

The POST endpoints require `Content-Type: application/json`, reject requests larger than 16 KB, and return validation errors rather than committing a booking. See the [full API reference](docs/API.md) and [enquiry triage playbook](docs/operations/enquiry-triage.md).

## Safety and privacy

- Never commit passwords or production API keys; store approved integrations in server-side environment variables.
- The API does not store guest contact information. WhatsApp handoff is user-initiated.
- Tool actions in the agent policy require role permission, identifiers and explicit human approval for writes and financial actions.
- Do not promise a tour, permit or payment without a verified human/operator workflow.
- Additional real-world controls are needed before production lead collection: authentication, rate limiting, encrypted storage, tenant boundaries, audit retention, and legal/privacy review.

Read the [privacy lifecycle](docs/privacy/guest-data-lifecycle.md), [agent security boundaries](docs/security/agent-approval-boundaries.md), and [operations](docs/operations/enquiry-triage.md).

## Roadmap

1. Authenticated operator CRM and durable enquiry inbox
2. Operator-managed listings, availability and verified packages
3. Human-approved quotes and booking handoffs
4. Auditable connectors and tenant-scoped workflows
5. Conversion analytics and secure data lifecycle automation

## Contact

**JOHN ONLINE SERVICES AND APPLICATIONS** — Moshi, Tanzania  
WhatsApp: [+255 698 170 989](https://wa.me/255698170989)  
Email: [johncharlessarwi@gmail.com](mailto:johncharlessarwi@gmail.com)

*Digital Solutions. Simplified. · Tunahudumia Tanzania nzima.*
