import { locations } from "../data/locations.ts";
import type { CartSnapshot } from "../types/cart.ts";

export type SectionId = "home" | "menu" | "cart" | "route";

export interface AppState {
  readonly activeSection: SectionId;
  readonly selectedLocationId: string;
  readonly cart: CartSnapshot;
  readonly cartRestoreStatus: "idle" | "fresh" | "stale" | "invalid";
  readonly isOrderPresentationOpen: boolean;
}

export const initialState: AppState = {
  activeSection: "home",
  selectedLocationId: locations[0].id,
  cart: { locationId: locations[0].id, items: [] },
  cartRestoreStatus: "idle",
  isOrderPresentationOpen: false,
};
