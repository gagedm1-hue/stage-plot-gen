"use client";

// Measurement for the template pages.
//
// The app's own analytics are Vercel's, which the owner reads and the team
// cannot. The team's first-party pageview log lives on the marketing site, so
// these pages post to it: one "pageview" when the page loads, one "download"
// when a template file is clicked. The log gets the same fields it always has
// (timestamp, type, path, referrer, bot flag) — no cookie, no id, no IP, and
// nothing is stored on the visitor's device.
//
// Everything here is best-effort and off the critical path: the fetch is
// `no-cors` + `keepalive`, its promise is swallowed, and the download links are
// real anchors, so they work with JavaScript disabled and are not delayed by a
// beacon that never resolves.
import { useEffect } from "react";

import { BEACON_URL } from "./config";

function send(payload: Record<string, string>): void {
  try {
    void fetch(BEACON_URL, {
      method: "POST",
      mode: "no-cors",
      keepalive: true,
      headers: { "content-type": "text/plain;charset=UTF-8" },
      body: JSON.stringify(payload),
    }).catch(() => {
      /* measurement is optional; the page must never care */
    });
  } catch {
    /* same */
  }
}

/** Records one pageview for `path` when the page mounts. Renders nothing. */
export function PageviewBeacon({ path }: { path: string }) {
  useEffect(() => {
    send({ event: "pageview", path, ref: document.referrer || "" });
  }, [path]);
  return null;
}

/** Records one download of `file`, reported against the page it came from. */
export function trackDownload(file: string): void {
  send({ event: "download", path: file, ref: window.location.pathname });
}
