export type EnquiryStatus = "new" | "contacted" | "quoted" | "booked" | "lost";
export type EnquiryMetricInput = { destination: string; travellers: number; status: EnquiryStatus };
export type EnquiryAnalytics = {
  totalEnquiries: number;
  bookedEnquiries: number;
  conversionRate: number;
  totalTravellers: number;
  statusCounts: Record<EnquiryStatus, number>;
  topDestinations: { destination: string; enquiries: number }[];
};

export function aggregateEnquiryMetrics(records: EnquiryMetricInput[]): EnquiryAnalytics {
  const statusCounts: Record<EnquiryStatus, number> = { new: 0, contacted: 0, quoted: 0, booked: 0, lost: 0 };
  const destinationCounts = new Map<string, number>();
  let totalTravellers = 0;

  for (const record of records) {
    statusCounts[record.status] += 1;
    totalTravellers += record.travellers;
    const destination = record.destination.trim().replace(/\s+/g, " ");
    if (destination) destinationCounts.set(destination, (destinationCounts.get(destination) ?? 0) + 1);
  }

  const totalEnquiries = records.length;
  const bookedEnquiries = statusCounts.booked;
  const topDestinations = [...destinationCounts.entries()]
    .map(([destination, enquiries]) => ({ destination, enquiries }))
    .sort((a, b) => b.enquiries - a.enquiries || a.destination.localeCompare(b.destination))
    .slice(0, 5);

  return {
    totalEnquiries,
    bookedEnquiries,
    conversionRate: totalEnquiries === 0 ? 0 : Number(((bookedEnquiries / totalEnquiries) * 100).toFixed(1)),
    totalTravellers,
    statusCounts,
    topDestinations
  };
}
