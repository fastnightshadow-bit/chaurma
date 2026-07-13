"use client";

import { useAppState } from "@/components/app/AppStateProvider";
import { locations } from "@/data/locations";
import { getBusinessStatus } from "@/services/businessStatus";
import { useState } from "react";
import styles from "../site.module.css";
import { ConfirmDialog } from "../ui/ConfirmDialog";

export function LocationSwitcher() {
  const { state, dispatch } = useAppState();
  const [pendingId, setPendingId] = useState<string | null>(null);
  const statuses = locations.map((location) => getBusinessStatus(location));
  const allClosed = statuses.every((status) => status === "closed");

  function requestLocation(locationId: string) {
    if (locationId === state.selectedLocationId) return;
    if (state.cart.items.length > 0) setPendingId(locationId);
    else dispatch({ type: "location/select", locationId });
  }

  return (
    <>
      {allClosed ? (
        <p className={styles.closedNotice}>
          Сейчас обе точки закрыты. Позвоните и уточните время работы.
        </p>
      ) : null}
      <div
        className={styles.locationSwitcher}
        role="group"
        aria-label="Выберите точку"
      >
        {locations.map((location, index) => {
          const status = statuses[index] ?? "unknown";
          return (
            <button
              key={location.id}
              type="button"
              className={
                state.selectedLocationId === location.id
                  ? styles.locationSelected
                  : ""
              }
              aria-pressed={state.selectedLocationId === location.id}
              onClick={() => requestLocation(location.id)}
            >
              <strong>{location.name}</strong>
              <span
                className={`${styles.status} ${styles[`status-${status}`]}`}
              >
                <i />{" "}
                {status === "open"
                  ? "Открыто"
                  : status === "closed"
                    ? "Закрыто"
                    : "Уточнить"}
              </span>
            </button>
          );
        })}
      </div>
      {pendingId ? (
        <ConfirmDialog
          title="Перенести заказ в другую точку?"
          description="Выбранные позиции сохранятся. Доступность нужно подтвердить по телефону."
          primaryLabel="Перенести заказ"
          secondaryLabel="Отмена"
          onPrimary={() => {
            dispatch({ type: "location/select", locationId: pendingId });
            setPendingId(null);
          }}
          onSecondary={() => setPendingId(null)}
        />
      ) : null}
    </>
  );
}
