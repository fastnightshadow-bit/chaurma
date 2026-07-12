"use client";

import { siteConfig } from "@/data/siteConfig";
import { scrollToSection } from "@/utils/scrollToSection";
import { ArrowDown } from "lucide-react";
import styles from "../site.module.css";
import { FoodPlaceholder } from "../ui/FoodPlaceholder";

export function HeroSection() {
  return (
    <section id="home" className={styles.hero} aria-labelledby="hero-title">
      <div className={styles.heroVisual}>
        <FoodPlaceholder />
      </div>
      <div className={styles.heroContent}>
        <p className={styles.eyebrow}>Шаурма №1 Халял</p>
        <h1 id="hero-title">{siteConfig.heroTitle}</h1>
        <p>{siteConfig.heroSubtitle}</p>
        <button
          type="button"
          className={styles.primaryButton}
          onClick={() => scrollToSection("menu")}
        >
          Смотреть меню <ArrowDown size={20} aria-hidden="true" />
        </button>
      </div>
    </section>
  );
}
