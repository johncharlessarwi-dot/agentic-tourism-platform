import { z } from "zod";

export const enquirySchema = z.object({
  fullName: z.string().trim().min(2, "Name must contain at least 2 characters").max(120).regex(/^[^\u0000-\u001f\u007f]+$/),
  email: z.string().trim().toLowerCase().max(254).email(),
  destination: z.string().trim().min(2).max(120).regex(/^[^\u0000-\u001f\u007f]+$/),
  travelDate: z.iso.date().optional(),
  travellers: z.number().int().min(1).max(100),
  message: z.string().trim().max(2000).regex(/^[^\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]*$/).optional(),
}).strict();

export type TourismEnquiry = z.infer<typeof enquirySchema>;

export const agentDomains = ["growth-seo", "lead-intelligence", "booking-operations", "guest-experience"] as const;
export type AgentDomain = (typeof agentDomains)[number];

export function normalizeDestination(destination: string): string {
  return destination.trim().replace(/\s+/g, " ");
}
