"use client";

import { getBusinessStatus } from "@/services/businessStatus";
import type { Location } from "@/types/location";
import { useEffect, useState } from "react";

export function useBusinessStatus(location: Location) {
  const [status, setStatus] = useState(() => getBusinessStatus(location));

  useEffect(() => {
    const update = () => setStatus(getBusinessStatus(location));
    update();
    const interval = window.setInterval(update, 60_000);
    document.addEventListener("visibilitychange", update);
    return () => {
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", update);
    };
  }, [location]);

  return status;
}
