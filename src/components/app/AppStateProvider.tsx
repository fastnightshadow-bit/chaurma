"use client";

import { menuItems } from "@/data/menu";
import { siteConfig } from "@/data/siteConfig";
import {
  createStoredCart,
  readStoredCart,
  refreshCartPrices,
} from "@/services/cartStorage";
import type { AppAction } from "@/state/actions";
import { appReducer } from "@/state/appReducer";
import { initialState, type AppState } from "@/state/initialState";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
  type Dispatch,
  type ReactNode,
} from "react";

interface AppContextValue {
  readonly state: AppState;
  readonly dispatch: Dispatch<AppAction>;
  readonly isHydrated: boolean;
  readonly storageUnavailable: boolean;
  readonly resolveStaleCart: (choice: "refresh" | "clear") => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppStateProvider({
  children,
}: Readonly<{ children: ReactNode }>) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const [isHydrated, setIsHydrated] = useState(false);
  const [storageUnavailable, setStorageUnavailable] = useState(false);

  useEffect(() => {
    try {
      const rawValue = window.localStorage.getItem(siteConfig.cartStorageKey);
      if (rawValue) {
        const result = readStoredCart(
          rawValue,
          new Date(),
          siteConfig.cartMaxAgeHours,
        );
        if (result.status === "fresh" || result.status === "stale") {
          dispatch({
            type: "cart/restore",
            snapshot: result.snapshot,
            status: result.status,
          });
        } else {
          dispatch({ type: "cart/storageInvalid" });
        }
      }
    } catch {
      setStorageUnavailable(true);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!isHydrated || state.cartRestoreStatus === "stale") return;
    const timeout = window.setTimeout(() => {
      try {
        window.localStorage.setItem(
          siteConfig.cartStorageKey,
          JSON.stringify(createStoredCart(state.cart)),
        );
      } catch {
        setStorageUnavailable(true);
      }
    }, 150);
    return () => window.clearTimeout(timeout);
  }, [isHydrated, state.cart, state.cartRestoreStatus]);

  const value = useMemo<AppContextValue>(
    () => ({
      state,
      dispatch,
      isHydrated,
      storageUnavailable,
      resolveStaleCart(choice) {
        const snapshot =
          choice === "refresh"
            ? refreshCartPrices(state.cart, menuItems)
            : { ...state.cart, items: [], orderComment: "" };
        dispatch({ type: "cart/resolveStale", snapshot });
      },
    }),
    [isHydrated, state, storageUnavailable],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppState(): AppContextValue {
  const value = useContext(AppContext);
  if (!value)
    throw new Error("useAppState must be used inside AppStateProvider");
  return value;
}
