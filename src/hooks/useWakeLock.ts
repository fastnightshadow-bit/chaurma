"use client";

import { useEffect } from "react";

export function useWakeLock(enabled: boolean): void {
  useEffect(() => {
    if (!enabled || !("wakeLock" in navigator)) return;
    let released = false;
    let sentinel: WakeLockSentinel | undefined;
    void navigator.wakeLock
      .request("screen")
      .then((value) => {
        if (released) void value.release();
        else sentinel = value;
      })
      .catch(() => undefined);
    return () => {
      released = true;
      void sentinel?.release();
    };
  }, [enabled]);
}
