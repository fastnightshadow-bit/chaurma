import type { CartItem, CartSnapshot } from "../types/cart.ts";
import type { SectionId } from "./initialState.ts";

export type AppAction =
  | { readonly type: "cart/add"; readonly item: CartItem }
  | {
      readonly type: "cart/setQuantity";
      readonly itemId: string;
      readonly quantity: number;
    }
  | { readonly type: "cart/remove"; readonly itemId: string }
  | {
      readonly type: "cart/setItemComment";
      readonly itemId: string;
      readonly comment: string;
    }
  | { readonly type: "cart/setOrderComment"; readonly comment: string }
  | { readonly type: "cart/clear" }
  | {
      readonly type: "cart/restore";
      readonly snapshot: CartSnapshot;
      readonly status: "fresh" | "stale";
    }
  | { readonly type: "cart/resolveStale"; readonly snapshot: CartSnapshot }
  | { readonly type: "cart/storageInvalid" }
  | { readonly type: "location/select"; readonly locationId: string }
  | { readonly type: "section/set"; readonly section: SectionId }
  | { readonly type: "presentation/open" }
  | { readonly type: "presentation/close" };
