"use client";

import { useAppState } from "@/components/app/AppStateProvider";
import { locations } from "@/data/locations";
import { useBusinessStatus } from "@/hooks/useBusinessStatus";
import { Clock3, Hand, MapPin, Phone, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import styles from "../site.module.css";
import { LocationSwitcher } from "./LocationSwitcher";
import { MapPlaceholder } from "./MapPlaceholder";
import { RouteButton } from "./RouteButton";

export function MapSection() {
  const { state } = useAppState();
  const sectionRef = useRef<HTMLElement>(null);
  const [mapEnabled, setMapEnabled] = useState(false);
  const [mapUrl, setMapUrl] = useState<string | null>(null);
  const [mapInteractionEnabled, setMapInteractionEnabled] = useState(false);
  const [mapState, setMapState] = useState<
    "idle" | "loading" | "ready" | "error"
  >("idle");
  const location =
    locations.find((entry) => entry.id === state.selectedLocationId) ??
    locations[0];
  const status = useBusinessStatus(location);

  useEffect(() => {
    const element = sectionRef.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setMapEnabled(true);
        observer.disconnect();
      },
      { rootMargin: "100% 0px" },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!mapEnabled) return;
    let cancelled = false;

    setMapInteractionEnabled(false);
    setMapState("loading");
    setMapUrl(null);
    void import("@/services/mapProvider")
      .then(({ yandexMapProvider }) => yandexMapProvider.load(location))
      .then(({ src }) => {
        if (!cancelled) setMapUrl(src);
      })
      .catch(() => {
        if (!cancelled) setMapState("error");
      });

    return () => {
      cancelled = true;
    };
  }, [location, mapEnabled]);

  useEffect(() => {
    if (!mapInteractionEnabled) return;

    const stopMapInteraction = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMapInteractionEnabled(false);
    };
    window.addEventListener("keydown", stopMapInteraction);
    return () => window.removeEventListener("keydown", stopMapInteraction);
  }, [mapInteractionEnabled]);

  return (
    <section
      ref={sectionRef}
      id="route"
      className={`${styles.section} ${styles.mapSection}`}
      aria-labelledby="map-title"
    >
      <div className={styles.sectionHeading}>
        <span>Заберите заказ</span>
        <h2 id="map-title">Точка и маршрут</h2>
      </div>
      <LocationSwitcher />
      <div className={styles.locationDetails}>
        <h3>{location.name}</h3>
        <p>
          <MapPin size={18} /> {location.address}
        </p>
        <p>
          <Clock3 size={18} /> {location.scheduleLabel}
        </p>
        <p>Приготовление: {location.preparationTime}</p>
        <span className={`${styles.status} ${styles[`status-${status}`]}`}>
          <i />{" "}
          {status === "open"
            ? "Открыто"
            : status === "closed"
              ? "Закрыто"
              : "Уточнить"}
        </span>
      </div>
      <div
        className={`${styles.mapFrame} ${mapInteractionEnabled ? styles.mapFrameInteractive : ""}`}
      >
        {mapUrl ? (
          <iframe
            key={mapUrl}
            src={mapUrl}
            title={`Карта: ${location.address}`}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            onLoad={() => setMapState("ready")}
            onError={() => setMapState("error")}
          />
        ) : null}
        {mapState !== "ready" ? (
          <MapPlaceholder loading={mapState !== "error"} />
        ) : null}
        {mapState === "ready" && !mapInteractionEnabled ? (
          <div className={styles.mapInteractionGuard}>
            <button
              type="button"
              className={styles.mapInteractionButton}
              onClick={() => setMapInteractionEnabled(true)}
            >
              <Hand size={18} aria-hidden="true" />
              Управлять картой
            </button>
          </div>
        ) : null}
        {mapState === "ready" && mapInteractionEnabled ? (
          <button
            type="button"
            className={styles.mapInteractionExit}
            aria-label="Закончить работу с картой"
            title="Вернуть прокрутку страницы"
            onClick={() => setMapInteractionEnabled(false)}
          >
            <X size={20} aria-hidden="true" />
          </button>
        ) : null}
      </div>
      {mapState === "error" ? (
        <p className={styles.inlineNotice}>
          Карта не загрузилась. Адрес и маршрут остаются доступными.
        </p>
      ) : null}
      <div className={styles.mapActions}>
        <RouteButton location={location} />
        <a className={styles.secondaryButton} href={`tel:${location.phone}`}>
          <Phone size={20} />{" "}
          {status !== "open" ? "Позвонить и уточнить" : "Позвонить"}
        </a>
      </div>
    </section>
  );
}
