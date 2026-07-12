import type {
  CartSnapshot,
  StoredCart,
  StoredCartReadResult,
} from "../types/cart.ts";
import type { MenuItem } from "../types/menu.ts";
import { z } from "zod";

const storedCartSchema = z.object({
  version: z.literal(1),
  savedAt: z.iso.datetime(),
  locationId: z.string().min(1),
  items: z.array(
    z.object({
      id: z.string().min(1),
      menuItemId: z.string().min(1),
      quantity: z.number().int().positive(),
      unitPrice: z.number().nonnegative(),
      optionIds: z.array(z.string()),
      comment: z.string(),
    }),
  ),
});

export function createStoredCart(
  snapshot: CartSnapshot,
  savedAt = new Date(),
): StoredCart {
  return { ...snapshot, version: 1, savedAt: savedAt.toISOString() };
}

export function readStoredCart(
  rawValue: string,
  now = new Date(),
  maxAgeHours = 24,
): StoredCartReadResult {
  try {
    const parsed = storedCartSchema.safeParse(JSON.parse(rawValue));
    if (!parsed.success) return { status: "invalid" };
    const { savedAt, locationId, items } = parsed.data;
    const snapshot = { locationId, items };
    const age = now.getTime() - new Date(savedAt).getTime();
    const maxAgeMilliseconds = maxAgeHours * 60 * 60 * 1000;
    return {
      status: age > maxAgeMilliseconds ? "stale" : "fresh",
      snapshot,
    };
  } catch {
    return { status: "invalid" };
  }
}

export function refreshCartPrices(
  snapshot: CartSnapshot,
  menuItems: readonly MenuItem[],
): CartSnapshot {
  const itemsById = new Map(menuItems.map((item) => [item.id, item]));
  return {
    ...snapshot,
    items: snapshot.items.map((item) => {
      const menuItem = itemsById.get(item.menuItemId);
      if (!menuItem) return item;
      const optionPrice = menuItem.options
        .filter((option) => item.optionIds.includes(option.id))
        .reduce((total, option) => total + option.priceDelta, 0);
      return { ...item, unitPrice: menuItem.price + optionPrice };
    }),
  };
}
