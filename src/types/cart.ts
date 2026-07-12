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
}

export interface StoredCart extends CartSnapshot {
  readonly version: 1;
  readonly savedAt: string;
}

export type StoredCartReadResult =
  | { readonly status: "invalid" }
  | { readonly status: "fresh" | "stale"; readonly snapshot: CartSnapshot };
