import { z } from "zod";

export const enquirySchema = z.object({
  fullName: z.string().trim().min(2, "Name must contain at least 2 characters").max(120),
  email: z.email(),
  destination: z.string().trim().min(2).max(120),
  travelDate: z.iso.date().optional(),
  travellers: z.number().int().min(1).max(100),
  message: z.string().trim().max(2000).optional(),
});

export type TourismEnquiry = z.infer<typeof enquirySchema>;

export const agentDomains = ["growth-seo", "lead-intelligence", "booking-operations", "guest-experience"] as const;
export type AgentDomain = (typeof agentDomains)[number];

export function normalizeDestination(destination: string): string {
  return destination.trim().replace(/\s+/g, " ");
}
