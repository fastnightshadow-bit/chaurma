"use client";

import { useAppState } from "@/components/app/AppStateProvider";
import type { SectionId } from "@/state/initialState";
import { useEffect } from "react";

const sections: readonly SectionId[] = ["home", "menu", "cart", "route"];

export function useActiveSection(): void {
  const { dispatch } = useAppState();

  useEffect(() => {
    const elements = sections
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => Boolean(element));
    const visibility = new Map<SectionId, number>(
      sections.map((section) => [section, 0]),
    );
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          visibility.set(
            entry.target.id as SectionId,
            entry.isIntersecting ? entry.intersectionRatio : 0,
          );
        }
        const visible = [...visibility.entries()].sort(
          (a, b) => b[1] - a[1],
        )[0];
        if (visible && visible[1] > 0) {
          dispatch({
            type: "section/set",
            section: visible[0],
          });
        }
      },
      {
        rootMargin: "-124px 0px -64px 0px",
        threshold: [0, 0.15, 0.35, 0.6],
      },
    );
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [dispatch]);
}
