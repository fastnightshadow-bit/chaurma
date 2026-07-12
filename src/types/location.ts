export interface Coordinates {
  readonly lat: number;
  readonly lng: number;
}

export interface ScheduleInterval {
  readonly open: string;
  readonly close: string;
}

export interface ScheduleDay {
  readonly day: number;
  readonly intervals: readonly ScheduleInterval[];
}

export interface Location {
  readonly id: string;
  readonly name: string;
  readonly address: string;
  readonly streetAddress: string;
  readonly postalCode: string;
  readonly addressLocality: string;
  readonly addressRegion: string;
  readonly addressCountry: string;
  readonly phone: string;
  readonly coordinates: Coordinates;
  readonly coordinatesAreConfirmed: boolean;
  readonly preparationTime: string;
  readonly scheduleLabel: string;
  readonly timeZone: string;
  readonly schedule: readonly ScheduleDay[];
  readonly scheduleIsConfirmed: boolean;
  readonly mapUrl: string;
  readonly socialLinks: readonly string[];
  readonly priceRange: string | null;
  readonly isTemporarilyUnavailable: boolean;
  readonly isTemporaryData: boolean;
}

export type BusinessStatus = "open" | "closed" | "unknown";
