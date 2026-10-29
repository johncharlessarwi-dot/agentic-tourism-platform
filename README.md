# SafariOS — Agentic Tourism Platform

SafariOS is an agentic operating platform concept for East African tour operators, lodges and destination teams. Its goal is to help tourism businesses win more qualified enquiries, coordinate bookings and reduce repetitive operational work.

## Product direction

- **Growth & SEO Agent** — discover search opportunities and support destination content workflows.
- **Lead Intelligence Agent** — capture, classify and prioritize guest enquiries.
- **Booking Operations Agent** — coordinate booking requests and operational hand-offs.
- **Guest Experience Agent** — support timely, consistent pre-trip and in-trip communication.
- **MCP integration layer** — connect approved tools through explicit permissions and auditable actions.

## Current foundation

- Next.js App Router with TypeScript
- Zod validation for the tourism enquiry domain
- Health endpoint at `/api/health`
- Vitest unit tests
- GitHub Actions quality pipeline (typecheck, lint, tests, production build)
- Responsive platform landing page

## Getting started

```bash
npm install
npm run dev
```

## Quality checks

```bash
npm run typecheck
npm run lint
npm test
npm run build
```

## Product safety principles

- Agents propose actions; sensitive or consequential operations require explicit human approval.
- Secrets belong in environment variables and must never be committed.
- External integrations must be scoped, logged and permission-checked.
- Guest personal data should be minimized and handled with appropriate safeguards.

## Roadmap

1. Tourism CRM and enquiry inbox
2. Lead scoring and follow-up workflows
3. Booking and availability integrations
4. MCP server and permission-aware tool registry
5. Analytics, audit events and tenant management

Created by **JOHN ONLINE SERVICES AND APPLICATIONS**.
