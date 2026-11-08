import { describe, expect, it } from "vitest";
import { POST } from "../app/api/itineraries/route";

function request(body: unknown) {
  return new Request("http://localhost/api/itineraries", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
}

describe("POST /api/itineraries", () => {
  it("returns a validated itinerary", async () => {
    const response = await POST(request({ dayCount: 2, activities: [{ day: 1, title: "Game drive", startTime: "08:00", endTime: "10:00" }] }));
    expect(response.status).toBe(200);
    const payload = await response.json();
    expect(payload.days[0].activities[0].durationMinutes).toBe(120);
    expect(payload.summary).toEqual({ days: 2, plannedActivities: 1, plannedMinutes: 120, unplannedDays: 1 });
  });

  it("rejects overlapping activities", async () => {
    const response = await POST(request({ dayCount: 1, activities: [
      { day: 1, title: "Walk", startTime: "08:00", endTime: "10:00" },
      { day: 1, title: "Drive", startTime: "09:00", endTime: "11:00" },
    ] }));
    expect(response.status).toBe(422);
  });
});

it('does not disclose internal itinerary errors in public responses',async()=>{
 const response=await POST(new Request('http://localhost/api/itineraries',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({dayCount:1,activities:[{day:1,title:'Overlapping',startTime:'09:00',endTime:'11:00'},{day:1,title:'Other',startTime:'10:00',endTime:'12:00'}]})}));
 expect(response.status).toBe(422);
 expect(await response.json()).toEqual({error:'Invalid itinerary'});
});
