export const ITEM_COMMENT_MAX_LENGTH = 120;
export const ORDER_COMMENT_MAX_LENGTH = 200;

export interface CartItem {
  readonly id: string;
  readonly menuItemId: string;
  readonly quantity: number;
  readonly unitPrice: number;
  readonly optionIds: readonly string[];
  readonly comment: string;
}

export interface CartSnapshot {
  readonly locationId: string;
  readonly items: readonly CartItem[];
  readonly orderComment: string;
}

export interface StoredCart extends CartSnapshot {
  readonly version: 2;
  readonly savedAt: string;
}

export type StoredCartReadResult =
  | { readonly status: "invalid" }
  | { readonly status: "fresh" | "stale"; readonly snapshot: CartSnapshot };
