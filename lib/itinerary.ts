export type ItineraryActivityInput = {
  day: number;
  title: string;
  startTime: string;
  endTime: string;
  location?: string;
};

export type ItineraryActivity = ItineraryActivityInput & { durationMinutes: number };
export type ItineraryDay = { day: number; activities: ItineraryActivity[] };

function toMinutes(value: string): number | null {
  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(value)) return null;
  const [hours, minutes] = value.split(":").map(Number);
  return hours * 60 + minutes;
}

export function buildItinerary(dayCount: number, activities: ItineraryActivityInput[]): ItineraryDay[] {
  if (!Number.isInteger(dayCount) || dayCount < 1 || dayCount > 30) throw new Error("Trip length must be between 1 and 30 days");
  const days: ItineraryDay[] = Array.from({ length: dayCount }, (_, index) => ({ day: index + 1, activities: [] }));

  for (const activity of activities) {
    if (!Number.isInteger(activity.day) || activity.day < 1 || activity.day > dayCount) throw new Error(`Activity day must be between 1 and ${dayCount}`);
    if (!activity.title.trim()) throw new Error("Activity title is required");
    const start = toMinutes(activity.startTime);
    const end = toMinutes(activity.endTime);
    if (start === null || end === null || end <= start) throw new Error("Activity times must be valid and end after they start");
    days[activity.day - 1].activities.push({ ...activity, title: activity.title.trim(), durationMinutes: end - start });
  }

  for (const day of days) {
    day.activities.sort((a, b) => a.startTime.localeCompare(b.startTime));
    for (let index = 1; index < day.activities.length; index += 1) {
      const previousEnd = toMinutes(day.activities[index - 1].endTime)!;
      const currentStart = toMinutes(day.activities[index].startTime)!;
      if (currentStart < previousEnd) throw new Error(`Activities overlap on day ${day.day}`);
    }
  }
  return days;
}
