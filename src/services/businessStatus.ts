import type { BusinessStatus, Location } from "../types/location.ts";

const weekdayIndexes: Record<string, number> = {
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
};

function minutesFromTime(value: string): number {
  const [hours = "0", minutes = "0"] = value.split(":");
  return Number(hours) * 60 + Number(minutes);
}

export function getBusinessStatus(
  location: Location,
  date = new Date(),
): BusinessStatus {
  if (location.isTemporarilyUnavailable) return "closed";

  try {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: location.timeZone,
      weekday: "short",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    }).formatToParts(date);
    const weekday = parts.find((part) => part.type === "weekday")?.value;
    const hour = Number(parts.find((part) => part.type === "hour")?.value);
    const minute = Number(parts.find((part) => part.type === "minute")?.value);
    if (!weekday || !Number.isFinite(hour) || !Number.isFinite(minute)) {
      return "unknown";
    }

    const dayIndex = weekdayIndexes[weekday];
    if (dayIndex === undefined) return "unknown";
    const scheduleDay = location.schedule.find(
      (entry) => entry.day === dayIndex,
    );
    const previousScheduleDay = location.schedule.find(
      (entry) => entry.day === (dayIndex + 6) % 7,
    );
    const currentMinutes = hour * 60 + minute;
    const openToday = scheduleDay?.intervals.some(({ open, close }) => {
      const openMinutes = minutesFromTime(open);
      const closeMinutes = minutesFromTime(close);
      return openMinutes <= closeMinutes
        ? currentMinutes >= openMinutes && currentMinutes < closeMinutes
        : currentMinutes >= openMinutes;
    });
    const openFromPreviousDay = previousScheduleDay?.intervals.some(
      ({ open, close }) => {
        const openMinutes = minutesFromTime(open);
        const closeMinutes = minutesFromTime(close);
        return openMinutes > closeMinutes && currentMinutes < closeMinutes;
      },
    );
    if (!scheduleDay && !openFromPreviousDay) return "unknown";
    return openToday || openFromPreviousDay ? "open" : "closed";
  } catch {
    return "unknown";
  }
}
