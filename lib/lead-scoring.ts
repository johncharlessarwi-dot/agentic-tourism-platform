import type { TourismEnquiry } from "./tourism";

export type LeadTemperature = "hot" | "warm" | "cold";
export type LeadScore = { score: number; temperature: LeadTemperature; reasons: string[] };

export function scoreEnquiry(enquiry: TourismEnquiry, now = new Date()): LeadScore {
  let score = 30;
  const reasons = ["Complete enquiry passed validation"];

  if (enquiry.travelDate) {
    const daysUntilTravel = Math.ceil((Date.parse(`${enquiry.travelDate}T00:00:00Z`) - Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())) / 86_400_000);
    if (daysUntilTravel >= 0 && daysUntilTravel <= 30) {
      score += 25;
      reasons.push("Travel is planned within 30 days");
    } else if (daysUntilTravel > 30 && daysUntilTravel <= 90) {
      score += 15;
      reasons.push("Travel is planned within 90 days");
    }
  }

  if (enquiry.travellers >= 4) {
    score += 15;
    reasons.push("Group has at least four travellers");
  }

  const messageLength = enquiry.message?.trim().length ?? 0;
  if (messageLength >= 80) {
    score += 10;
    reasons.push("Guest provided detailed trip requirements");
  } else if (messageLength >= 20) {
    score += 5;
    reasons.push("Guest provided additional trip context");
  }

  const boundedScore = Math.min(100, score);
  const temperature: LeadTemperature = boundedScore >= 70 ? "hot" : boundedScore >= 45 ? "warm" : "cold";
  return { score: boundedScore, temperature, reasons };
}
