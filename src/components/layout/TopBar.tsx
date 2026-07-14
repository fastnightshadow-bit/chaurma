"use client";

import { useAppState } from "@/components/app/AppStateProvider";
import { locations } from "@/data/locations";
import { siteConfig } from "@/data/siteConfig";
import { useBusinessStatus } from "@/hooks/useBusinessStatus";
import { publicPath } from "@/utils/publicPath";
import { scrollToSection } from "@/utils/scrollToSection";
import { MapPin, Phone } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import styles from "../site.module.css";

export function TopBar() {
  const { state } = useAppState();
  const [compact, setCompact] = useState(false);
  const location =
    locations.find((entry) => entry.id === state.selectedLocationId) ??
    locations[0];
  const status = useBusinessStatus(location);
  const statusLabel =
    status === "open"
      ? "Открыто"
      : status === "closed"
        ? "Закрыто"
        : "Уточнить";
  const needsClarification = status !== "open";

  useEffect(() => {
    const update = () => setCompact(window.scrollY > 72);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <header
      className={`${styles.topBar} ${compact ? styles.topBarCompact : ""}`}
    >
      <div className={styles.topBarMain}>
        <span className={styles.brandMark} aria-hidden="true">
          <Image
            src={publicPath("/icons/brand-icon-photo.png")}
            alt=""
            width={32}
            height={32}
            priority
            unoptimized
          />
        </span>
        <div className={styles.brandText}>
          <strong>{siteConfig.name}</strong>
          <span className={`${styles.status} ${styles[`status-${status}`]}`}>
            <i aria-hidden="true" /> {statusLabel}
          </span>
        </div>
        <a
          className={styles.callButton}
          href={`tel:${location.phone}`}
          aria-label={`${needsClarification ? "Позвонить и уточнить" : "Позвонить и заказать"}. ${location.phone}`}
        >
          <Phone size={20} aria-hidden="true" />
          <span>{needsClarification ? "Уточнить" : "Позвонить"}</span>
        </a>
      </div>
      <button
        type="button"
        className={styles.locationLine}
        onClick={() => scrollToSection("route")}
      >
        <MapPin size={16} aria-hidden="true" />
        <span>{location.name}</span>
        <small>{location.address}</small>
      </button>
    </header>
  );
}
