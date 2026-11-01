# SafariOS API reference (prototype)

Base URL for local development: `http://localhost:3000`.

These routes are demonstration services. **They do not create bookings, write to a database, send messages, or charge guests.** Do not connect a customer-facing checkout to them.

## Read-only destination discovery

`GET /api/destinations?q=mountain&category=mountain&country=Tanzania`

- `q`: optional text search, maximum 120 characters
- `category`: optional `wildlife`, `mountain`, `coastal`, `culture`
- `country`: optional `Tanzania`, `Kenya`, `Uganda`, `Rwanda`
- Response: `{ "count": number, "destinations": Destination[] }`
- Bad filters: `400`

`GET /api/destinations/:slug` returns `{ "destination": Destination }`, `404` for unknown slugs and `400` for invalid slugs.

The included destination collection is a small editorial sample, not real-time inventory or availability. GET responses permit a short public cache.

## Itinerary planning

`POST /api/itineraries` with `Content-Type: application/json`:

```json
{
  "dayCount": 2,
  "activities": [
    {"day": 1, "title": "Game drive", "startTime": "08:00", "endTime": "11:00", "location": "Serengeti"}
  ]
}
```

The response has `days` (sorted activities with `durationMinutes`) and a `summary` with day count, planned activities, total planned minutes and unplanned days. Activity times must be on the same day, in 24-hour `HH:mm` format, with no overlaps. Maximum 30 days and 120 activities. Transport and transfer times are not estimated.

## Enquiry validation

`POST /api/enquiries` with `Content-Type: application/json`:

```json
{
  "fullName": "Example Guest",
  "email": "guest@example.com",
  "destination": "Kilimanjaro",
  "travellers": 2,
  "travelDate": "2027-07-10",
  "message": "We are considering a guided trek."
}
```

A valid request returns HTTP `200` with:

```json
{
  "status": "validated",
  "stored": false,
  "lead": { "score": 35, "temperature": "cold", "reasons": ["Complete enquiry passed validation", "Guest provided additional trip context"] },
  "followUp": { "priority": "low", "suggestedAction": "Ask whether the guest needs destination guidance", "requiresHumanApproval": true }
}
```

The score and reasons vary by group size, travel date, and message detail. **Validation does not mean your request was delivered to an operator.** Guests can use the website's visitor-controlled WhatsApp handoff to make contact.

## Error handling

| Code | Meaning |
| --- | --- |
| `400` | Malformed JSON or invalid filters/slug |
| `404` | Unknown destination |
| `413` | POST body exceeds 16 KB |
| `415` | POST content type is not `application/json` |
| `422` | Enquiry or itinerary fails validation |

POST responses are marked `Cache-Control: no-store` for validated data. Do not log request bodies or guest identifiers in production. Add authentication, rate limits, observability, data protection and human verification before building an operator inbox or sending quotes.
