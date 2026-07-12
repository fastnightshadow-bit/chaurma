"use client";

import { useActiveSection } from "@/hooks/useActiveSection";
import { CartSection } from "../cart/CartSection";
import { HeroSection } from "../hero/HeroSection";
import { BottomNavigation } from "../layout/BottomNavigation";
import { TopBar } from "../layout/TopBar";
import { MapSection } from "../map/MapSection";
import { MenuSection } from "../menu/MenuSection";
import { ShawarmaProgress } from "../progress/ShawarmaProgress";
import styles from "../site.module.css";

export function SiteApp() {
  useActiveSection();
  return (
    <>
      <TopBar />
      <ShawarmaProgress />
      <main id="main-content" className={styles.page}>
        <HeroSection />
        <MenuSection />
        <CartSection />
        <MapSection />
      </main>
      <BottomNavigation />
    </>
  );
}
