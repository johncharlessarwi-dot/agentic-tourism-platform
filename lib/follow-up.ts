import type { LeadScore } from "./lead-scoring";

export type FollowUpSuggestion = {
  priority: "high" | "normal" | "low";
  suggestedAction: string;
  requiresHumanApproval: true;
};

/** A recommendation only: this module never sends messages or books a trip. */
export function suggestFollowUp(lead: LeadScore): FollowUpSuggestion {
  if (!lead || typeof lead !== "object") throw new RangeError("Invalid lead");
  if (lead.temperature === "hot") {
    return { priority: "high", suggestedAction: "Review availability and prepare a personal response", requiresHumanApproval: true };
  }
  if (lead.temperature === "warm") {
    return { priority: "normal", suggestedAction: "Clarify travel preferences before preparing a quote", requiresHumanApproval: true };
  }
  if (lead.temperature !== "cold") throw new RangeError("Invalid lead classification");
  return { priority: "low", suggestedAction: "Ask whether the guest needs destination guidance", requiresHumanApproval: true };
}
