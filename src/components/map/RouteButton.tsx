import type { Location } from "@/types/location";
import { buildRouteUrl } from "@/services/routeBuilder";
import { siteConfig } from "@/data/siteConfig";
import { Navigation } from "lucide-react";
import styles from "../site.module.css";

export function RouteButton({ location }: Readonly<{ location: Location }>) {
  return (
    <a
      className={styles.primaryButton}
      href={buildRouteUrl(siteConfig.routeUrlTemplate, location)}
      target="_blank"
      rel="noreferrer"
    >
      <Navigation size={20} /> Построить маршрут
    </a>
  );
}
