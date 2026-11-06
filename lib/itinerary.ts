export type ItineraryActivityInput = {
  day: number;
  title: string;
  startTime: string;
  endTime: string;
  location?: string;
};

export type ItineraryActivity = ItineraryActivityInput & { durationMinutes: number };
export type ItineraryDay = { day: number; activities: ItineraryActivity[] };
export type ItinerarySummary = { days: number; plannedActivities: number; plannedMinutes: number; unplannedDays: number };

function toMinutes(value: string): number | null {
  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(value)) return null;
  const [hours, minutes] = value.split(":").map(Number);
  return hours * 60 + minutes;
}

export function buildItinerary(dayCount: number, activities: ItineraryActivityInput[]): ItineraryDay[] {
  if (!Number.isInteger(dayCount) || dayCount < 1 || dayCount > 30) throw new Error("Trip length must be between 1 and 30 days");
  if (!Array.isArray(activities) || activities.length > 300) throw new Error("Trip activities must be limited to 300");
  const days: ItineraryDay[] = Array.from({ length: dayCount }, (_, index) => ({ day: index + 1, activities: [] }));

  for (const activity of activities) {
    if (!activity || typeof activity.title !== "string" || activity.title.trim().length > 160 ||
        typeof activity.startTime !== "string" || typeof activity.endTime !== "string" ||
        (activity.location !== undefined && (typeof activity.location !== "string" || !activity.location.trim() || activity.location.trim().length > 160))) {
      throw new Error("Invalid activity details");
    }
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

export function summarizeItinerary(days: ItineraryDay[]): ItinerarySummary {
  return {
    days: days.length,
    plannedActivities: days.reduce((count, day) => count + day.activities.length, 0),
    plannedMinutes: days.reduce((minutes, day) => minutes + day.activities.reduce((total, activity) => total + activity.durationMinutes, 0), 0),
    unplannedDays: days.filter((day) => day.activities.length === 0).length,
  };
}

/** Advisory free-time calculation; excludes overnight time and does not book transfers. */
export function summarizeItineraryGaps(days: ItineraryDay[]): { freeMinutesBetweenActivities: number; gaps: number } {
  let freeMinutesBetweenActivities = 0;
  let gaps = 0;
  for (const day of days) {
    const sorted = [...day.activities].sort((a, b) => a.startTime.localeCompare(b.startTime));
    for (let index = 1; index < sorted.length; index += 1) {
      const previousEnd = toMinutes(sorted[index - 1].endTime);
      const nextStart = toMinutes(sorted[index].startTime);
      if (previousEnd === null || nextStart === null || nextStart < previousEnd) throw new Error("Invalid itinerary gap");
      if (nextStart > previousEnd) {
        freeMinutesBetweenActivities += nextStart - previousEnd;
        gaps += 1;
      }
    }
  }
  return { freeMinutesBetweenActivities, gaps };
}
