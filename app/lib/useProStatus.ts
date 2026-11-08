"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "stageplotpro:pro";

export function useProStatus() {
  const [isPro, setIsPro] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY) === "1") setIsPro(true);

    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get("session_id");

    if (!sessionId) {
      setChecked(true);
      return;
    }

    let cancelled = false;

    fetch(`/api/verify?session_id=${encodeURIComponent(sessionId)}`)
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        if (data?.paid) {
          localStorage.setItem(STORAGE_KEY, "1");
          setIsPro(true);
        }
      })
      .catch(() => {})
      .finally(() => {
        if (cancelled) return;
        const url = new URL(window.location.href);
        url.searchParams.delete("session_id");
        window.history.replaceState(
          {},
          "",
          url.pathname + url.search + url.hash
        );
        setChecked(true);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { isPro, checked };
}