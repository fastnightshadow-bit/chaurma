"use client";

import { useAppState } from "@/components/app/AppStateProvider";
import { publicPath } from "@/utils/publicPath";
import { scrollToSection } from "@/utils/scrollToSection";
import Image from "next/image";
import styles from "../site.module.css";

const stages = [
  { id: "home", label: "Главная" },
  { id: "menu", label: "Меню" },
  { id: "cart", label: "Корзина" },
  { id: "route", label: "Маршрут" },
] as const;

export function ShawarmaProgress() {
  const { state } = useAppState();
  const activeIndex = stages.findIndex(({ id }) => id === state.activeSection);

  return (
    <nav className={styles.progress} aria-label="Этапы заказа">
      <div className={styles.progressTrack} aria-hidden="true" />
      <span
        className={styles.progressShawarma}
        style={
          {
            "--progress-position": `${12.5 + activeIndex * 25}%`,
          } as React.CSSProperties
        }
        aria-hidden="true"
      >
        <Image
          src={publicPath("/icons/icon.svg")}
          alt=""
          width={28}
          height={28}
          unoptimized
        />
      </span>
      {stages.map(({ id, label }, index) => (
        <button
          key={id}
          type="button"
          className={`${styles.progressStage} ${index <= activeIndex ? styles.progressStageDone : ""} ${index === activeIndex ? styles.progressStageActive : ""}`}
          onClick={() => scrollToSection(id)}
          aria-current={index === activeIndex ? "step" : undefined}
        >
          <i aria-hidden="true" />
          <span>{label}</span>
        </button>
      ))}
    </nav>
  );
}
