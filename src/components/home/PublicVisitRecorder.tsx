"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const SESSION_KEY = "visit-recorded-v2";

export function PublicVisitRecorder() {
  const pathname = usePathname();
  const adminRoute = pathname.startsWith("/canes");

  useEffect(() => {
    if (adminRoute) return;
    if (sessionStorage.getItem(SESSION_KEY) === "1") return;

    let cancelled = false;

    async function record() {
      try {
        const response = await fetch("/api/visitors", {
          method: "POST",
          credentials: "include",
        });
        if (cancelled) return;
        if (!response.ok) return;
        sessionStorage.setItem(SESSION_KEY, "1");
      } catch {
        if (cancelled) return;
      }
    }

    void record();

    return () => {
      cancelled = true;
    };
  }, [adminRoute, pathname]);

  return null;
}