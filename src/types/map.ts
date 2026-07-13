import type { Coordinates } from "./location.ts";

export interface MapProviderState {
  readonly kind: "idle" | "loading" | "ready" | "error";
  readonly coordinates: Coordinates;
}
