import type { AppAction } from "./actions.ts";
import type { AppState } from "./initialState.ts";
import {
  ITEM_COMMENT_MAX_LENGTH,
  ORDER_COMMENT_MAX_LENGTH,
} from "../types/cart.ts";

export function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "cart/add": {
      const existing = state.cart.items.find(
        (item) => item.id === action.item.id,
      );
      const items = existing
        ? state.cart.items.map((item) =>
            item.id === action.item.id
              ? { ...item, quantity: item.quantity + action.item.quantity }
              : item,
          )
        : [...state.cart.items, action.item];
      return { ...state, cart: { ...state.cart, items } };
    }
    case "cart/setQuantity":
      return action.quantity <= 0
        ? appReducer(state, { type: "cart/remove", itemId: action.itemId })
        : {
            ...state,
            cart: {
              ...state.cart,
              items: state.cart.items.map((item) =>
                item.id === action.itemId
                  ? { ...item, quantity: action.quantity }
                  : item,
              ),
            },
          };
    case "cart/remove": {
      const items = state.cart.items.filter(
        (item) => item.id !== action.itemId,
      );
      return {
        ...state,
        cart: {
          ...state.cart,
          items,
          orderComment: items.length ? state.cart.orderComment : "",
        },
      };
    }
    case "cart/setItemComment":
      return {
        ...state,
        cart: {
          ...state.cart,
          items: state.cart.items.map((item) =>
            item.id === action.itemId
              ? {
                  ...item,
                  comment: action.comment
                    .trim()
                    .slice(0, ITEM_COMMENT_MAX_LENGTH),
                }
              : item,
          ),
        },
      };
    case "cart/setOrderComment":
      return {
        ...state,
        cart: {
          ...state.cart,
          orderComment: action.comment.slice(0, ORDER_COMMENT_MAX_LENGTH),
        },
      };
    case "cart/clear":
      return {
        ...state,
        cart: { ...state.cart, items: [], orderComment: "" },
      };
    case "cart/restore":
      return {
        ...state,
        cart: action.snapshot,
        selectedLocationId: action.snapshot.locationId,
        cartRestoreStatus: action.status,
      };
    case "cart/resolveStale":
      return {
        ...state,
        cart: action.snapshot,
        cartRestoreStatus: "fresh",
      };
    case "cart/storageInvalid":
      return { ...state, cartRestoreStatus: "invalid" };
    case "location/select":
      return {
        ...state,
        selectedLocationId: action.locationId,
        cart: { ...state.cart, locationId: action.locationId },
      };
    case "section/set":
      return { ...state, activeSection: action.section };
    case "presentation/open":
      return { ...state, isOrderPresentationOpen: true };
    case "presentation/close":
      return { ...state, isOrderPresentationOpen: false };
  }
}
